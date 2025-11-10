import Layout from '../../components/Layout';
import { useAppContext } from '../../contexts/AppProviders';

const ProductDetailPage = ({ product }) => {
  const { addToCart } = useAppContext();

  if (!product) {
    return (
      <Layout title="Product not found">
        <div className="py-32 text-center text-slate-500 dark:text-slate-400">
          Product not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${product.name} · Elite Electronics`}>
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
          <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
                Image coming soon
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {product.brand} · {product.category}
            </p>
            <h1 className="text-4xl font-semibold">{product.name}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
            {product.previousPrice && (
              <span className="text-sm text-slate-400 line-through">
                ${product.previousPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Key features
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
                {product.tags?.length ? (
                  product.tags.map((tag) => <li key={tag}>{tag}</li>)
                ) : (
                  <li>Premium build and backed by EliteCare warranty.</li>
                )}
              </ul>
            </div>
            <button
              onClick={() => addToCart(product)}
              className="w-full px-4 py-3 rounded-full bg-primary text-white font-semibold text-center hover:bg-primary-dark"
            >
              Add to cart
            </button>
            <p className="text-xs text-slate-400">Ships in 24 hours · Free expedited shipping over $500</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async ({ params, req }) => {
  try {
    const host = req.headers.host;
    const protocol = host.startsWith('localhost') ? 'http' : 'https';
    const response = await fetch(`${protocol}://${host}/api/products/${params.id}`);
    if (!response.ok) {
      return { props: { product: null } };
    }
    const data = await response.json();
    return { props: { product: data.product } };
  } catch (error) {
    console.error('Failed to fetch product', error);
    return { props: { product: null } };
  }
};

export default ProductDetailPage;
