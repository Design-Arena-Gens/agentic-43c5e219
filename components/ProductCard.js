import Link from 'next/link';
import { useAppContext } from '../contexts/AppProviders';

const ProductCard = ({ product }) => {
  const { addToCart } = useAppContext();

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow transition-transform hover:-translate-y-1">
      <div className="aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="text-slate-400 text-sm">Image coming soon</div>
        )}
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <span>{product.brand}</span>
          <span>{product.category}</span>
        </div>
        <Link href={`/products/${product._id}`} className="text-lg font-semibold leading-tight">
          {product.name}
        </Link>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
            {product.previousPrice && (
              <span className="ml-2 text-sm line-through text-slate-400">
                ${product.previousPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="px-4 py-2 text-sm rounded-full bg-primary text-white font-medium hover:bg-primary-dark"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
