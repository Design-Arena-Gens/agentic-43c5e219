import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { connectToDatabase } from '../../lib/db';
import Product from '../../models/Product';
import User from '../../models/User';
import Order from '../../models/Order';
import {
  signToken,
  setAuthCookie,
  clearAuthCookie,
  requireAdmin,
  requireUser,
  extractUser
} from '../../lib/auth';
import { stripe } from '../../lib/stripe';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const sampleProducts = [
  {
    _id: '64b000000000000000000001',
    name: 'Apex Pro X Phone',
    description: '6.7" AMOLED 120Hz display, triple-lens camera, 5G, 256GB storage, 45W fast charging.',
    price: 1099,
    previousPrice: 1199,
    brand: 'Apex',
    category: 'phones',
    image: 'https://images.unsplash.com/photo-1510554310709-16f33b29d89d?auto=format&fit=crop&w=900&q=80',
    stock: 42,
    featured: true,
    rating: 4.8,
    tags: ['120Hz AMOLED', 'Triple camera', '5G ready'],
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z'
  },
  {
    _id: '64b000000000000000000002',
    name: 'NovaBook Ultra 15',
    description: 'Intel Core i9, 32GB RAM, 1TB NVMe, RTX 4070 graphics, 4K OLED panel, Thunderbolt 4.',
    price: 2499,
    previousPrice: 2699,
    brand: 'NovaTech',
    category: 'laptops',
    image: 'https://images.unsplash.com/photo-1484807352052-23338990c6c6?auto=format&fit=crop&w=900&q=80',
    stock: 18,
    featured: true,
    rating: 4.9,
    tags: ['RTX graphics', '4K OLED', 'Thunderbolt 4'],
    createdAt: '2024-02-02T00:00:00.000Z',
    updatedAt: '2024-02-02T00:00:00.000Z'
  },
  {
    _id: '64b000000000000000000003',
    name: 'SoundSphere Max Earbuds',
    description: 'Adaptive ANC, spatial audio, 36-hour battery with wireless charging, IPX5 rated.',
    price: 249,
    brand: 'SoundSphere',
    category: 'audio',
    image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=900&q=80',
    stock: 120,
    featured: true,
    rating: 4.7,
    tags: ['Adaptive ANC', 'Spatial audio', 'Wireless charging'],
    createdAt: '2024-01-25T00:00:00.000Z',
    updatedAt: '2024-01-25T00:00:00.000Z'
  },
  {
    _id: '64b000000000000000000004',
    name: 'PulseWatch Titanium',
    description: 'Always-on LTPO display, ECG monitoring, dual-frequency GPS, 3-day battery life.',
    price: 499,
    brand: 'Pulse',
    category: 'wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    stock: 75,
    featured: true,
    rating: 4.6,
    tags: ['ECG', 'Titanium build', 'Dual-frequency GPS'],
    createdAt: '2024-03-01T00:00:00.000Z',
    updatedAt: '2024-03-01T00:00:00.000Z'
  },
  {
    _id: '64b000000000000000000005',
    name: 'FluxPad S12 Tablet',
    description: '12.4" mini-LED ProMotion display, stylus support, 16GB RAM, 512GB storage.',
    price: 899,
    brand: 'Flux',
    category: 'tablets',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=900&q=80',
    stock: 65,
    featured: false,
    rating: 4.5,
    tags: ['Mini-LED', 'Stylus included', 'ProMotion display'],
    createdAt: '2024-02-14T00:00:00.000Z',
    updatedAt: '2024-02-14T00:00:00.000Z'
  },
  {
    _id: '64b000000000000000000006',
    name: 'Lumina Smart Speaker Duo',
    description: 'High-fidelity stereo smart speakers with voice assistant, adaptive room tuning, Wi-Fi 6.',
    price: 349,
    brand: 'Lumina',
    category: 'smart-home',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    stock: 90,
    featured: false,
    rating: 4.4,
    tags: ['Smart assistant', 'Adaptive tuning', 'Stereo pair'],
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z'
  }
];

let seedingPromise;

const ensureSeedData = async () => {
  if (!seedingPromise) {
    seedingPromise = (async () => {
      const count = await Product.estimatedDocumentCount();
      if (count === 0) {
        await Product.insertMany(sampleProducts);
      }
    })();
  }
  return seedingPromise;
};

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    await ensureSeedData();
    req.dbAvailable = true;
  } catch (error) {
    req.dbAvailable = false;
    console.error('Database connection unavailable', error.message);
  }
  next();
});

const sanitizeUser = (user) => ({
  _id: user._id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role
});

const generateOrderNumber = () => {
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `EL-${random}`;
};

const buildProductFilters = (query) => {
  const filters = {};
  if (query.search) {
    filters.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
      { brand: { $regex: query.search, $options: 'i' } }
    ];
  }
  if (query.category) {
    filters.category = query.category;
  }
  if (query.brand) {
    filters.brand = query.brand;
  }
  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) {
      filters.price.$gte = Number(query.minPrice);
    }
    if (query.maxPrice) {
      filters.price.$lte = Number(query.maxPrice);
    }
  }
  if (query.featured) {
    filters.featured = query.featured === 'true';
  }
  return filters;
};

const applyProductSort = (query, sortParam) => {
  switch (sortParam) {
    case 'price-asc':
      return query.sort({ price: 1 });
    case 'price-desc':
      return query.sort({ price: -1 });
    case 'top-rated':
      return query.sort({ rating: -1 });
    default:
      return query.sort({ createdAt: -1 });
  }
};

const resolveCartItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cart items are required');
  }
  const productIds = items.map((item) => item.product?._id || item.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const resolved = items.map((item) => {
    const productId = item.product?._id || item.productId;
    const quantity = Number(item.quantity) || 1;
    const product = productMap.get(productId);
    if (!product) {
      throw new Error('A product in your cart is no longer available.');
    }
    return {
      product,
      quantity
    };
  });

  const subtotal = resolved.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : 15;
  const total = subtotal + shipping;

  return {
    subtotal,
    shipping,
    total,
    items: resolved.map((entry) => ({
      product: entry.product,
      quantity: entry.quantity
    }))
  };
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/signup', async (req, res) => {
  if (!req.dbAvailable) {
    return res.status(503).json({ error: 'Database is currently unavailable' });
  }
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    const user = await User.create({ email, password, firstName, lastName });
    const token = signToken({ id: user._id, email: user.email, role: user.role, firstName: user.firstName });
    setAuthCookie(res, token);
    res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('Signup failed', error);
    res.status(500).json({ error: 'Unable to sign up right now.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  if (!req.dbAvailable) {
    return res.status(503).json({ error: 'Database is currently unavailable' });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken({ id: user._id, email: user.email, role: user.role, firstName: user.firstName });
    setAuthCookie(res, token);
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('Login failed', error);
    res.status(500).json({ error: 'Unable to login right now.' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  clearAuthCookie(res);
  res.status(204).end();
});

app.get('/api/auth/me', async (req, res) => {
  if (!req.dbAvailable) {
    return res.status(503).json({ error: 'Database is currently unavailable' });
  }
  try {
    const payload = extractUser(req);
    if (!payload) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('Me failed', error);
    res.status(500).json({ error: 'Unable to fetch user' });
  }
});

app.get('/api/products', async (req, res) => {
  if (!req.dbAvailable) {
    try {
      const {
        search = '',
        category = '',
        brand = '',
        minPrice = '',
        maxPrice = '',
        sort = 'newest',
        limit,
        skip = 0,
        featured
      } = req.query;

      let results = sampleProducts.map((product) => ({ ...product }));

      if (search) {
        const term = String(search).toLowerCase();
        results = results.filter(
          (product) =>
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            product.brand.toLowerCase().includes(term)
        );
      }
      if (category) {
        results = results.filter((product) => product.category === category);
      }
      if (brand) {
        results = results.filter((product) => product.brand === brand);
      }
      if (featured) {
        const featuredBool = featured === 'true';
        results = results.filter((product) => product.featured === featuredBool);
      }
      if (minPrice) {
        const min = Number(minPrice);
        results = results.filter((product) => product.price >= min);
      }
      if (maxPrice) {
        const max = Number(maxPrice);
        results = results.filter((product) => product.price <= max);
      }

      const total = results.length;

      switch (sort) {
        case 'price-asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'top-rated':
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        default:
          results.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
      }

      const skipNumber = Number(skip) || 0;
      const limitNumber = limit ? Math.min(Number(limit), results.length) : results.length;
      const paginated = results.slice(skipNumber, skipNumber + limitNumber);

      const brands = Array.from(new Set(sampleProducts.map((product) => product.brand)));
      const categories = Array.from(new Set(sampleProducts.map((product) => product.category)));

      return res.json({
        products: paginated,
        meta: {
          total,
          brands,
          categories
        }
      });
    } catch (error) {
      console.error('Fallback products failed', error);
      return res.status(500).json({ error: 'Failed to load products' });
    }
  }
  try {
    const filters = buildProductFilters(req.query);
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const skip = Number(req.query.skip) || 0;

    let productQuery = Product.find(filters).skip(skip).limit(limit);
    productQuery = applyProductSort(productQuery, req.query.sort);

    const [products, total, brands, categories] = await Promise.all([
      productQuery,
      Product.countDocuments(filters),
      Product.distinct('brand'),
      Product.distinct('category')
    ]);

    res.json({
      products,
      meta: {
        total,
        brands,
        categories
      }
    });
  } catch (error) {
    console.error('Get products failed', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  if (!req.dbAvailable) {
    const product = sampleProducts.find((item) => item._id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json({ product });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    console.error('Get product failed', error);
    res.status(500).json({ error: 'Failed to load product' });
  }
});

app.post('/api/admin/products', requireAdmin, async (req, res) => {
  if (!req.dbAvailable) {
    return res.status(503).json({ error: 'Database is currently unavailable' });
  }
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (error) {
    console.error('Create product failed', error);
    res.status(500).json({ error: 'Unable to create product' });
  }
});

app.get('/api/admin/products', requireAdmin, async (req, res) => {
  if (!req.dbAvailable) {
    return res.status(503).json({ error: 'Database is currently unavailable' });
  }
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    console.error('List admin products failed', error);
    res.status(500).json({ error: 'Unable to load products' });
  }
});

app.put('/api/admin/products/:id', requireAdmin, async (req, res) => {
  if (!req.dbAvailable) {
    return res.status(503).json({ error: 'Database is currently unavailable' });
  }
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    console.error('Update product failed', error);
    res.status(500).json({ error: 'Unable to update product' });
  }
});

app.delete('/api/admin/products/:id', requireAdmin, async (req, res) => {
  if (!req.dbAvailable) {
    return res.status(503).json({ error: 'Database is currently unavailable' });
  }
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete product failed', error);
    res.status(500).json({ error: 'Unable to delete product' });
  }
});

app.get('/api/orders', requireUser, async (req, res) => {
  if (!req.dbAvailable) {
    return res.status(503).json({ error: 'Database is currently unavailable' });
  }
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product');
    res.json({ orders });
  } catch (error) {
    console.error('Get orders failed', error);
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

app.post('/api/orders', requireUser, async (req, res) => {
  if (!req.dbAvailable) {
    return res.status(503).json({ error: 'Database is currently unavailable' });
  }
  try {
    const { items, paymentIntentId } = req.body;
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent || paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    const { subtotal, shipping, total, items: resolvedItems } = await resolveCartItems(items);
    const expectedAmount = Math.round(total * 100);
    if (paymentIntent.amount_received < expectedAmount) {
      return res.status(400).json({ error: 'Paid amount does not match order total' });
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user.id,
      items: resolvedItems.map(({ product, quantity }) => ({
        product: product._id,
        name: product.name,
        image: product.image,
        quantity,
        price: product.price * quantity
      })),
      subtotal,
      shipping,
      total,
      status: 'paid',
      paymentIntentId
    });

    res.status(201).json({ order });
  } catch (error) {
    console.error('Create order failed', error);
    res.status(500).json({ error: 'Unable to create order' });
  }
});

app.post('/api/checkout/create-intent', requireUser, async (req, res) => {
  if (!req.dbAvailable) {
    return res.status(503).json({ error: 'Database is currently unavailable' });
  }
  try {
    const { items } = req.body;
    const { subtotal, shipping, total } = await resolveCartItems(items);
    const amount = Math.round(total * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        userId: req.user.id,
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2)
      },
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Create payment intent failed', error);
    res.status(400).json({ error: error.message || 'Unable to start checkout' });
  }
});

const handler = serverless(app);

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function mainHandler(req, res) {
  return handler(req, res);
}
