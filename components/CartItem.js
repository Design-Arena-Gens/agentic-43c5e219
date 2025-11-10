import { useAppContext } from '../contexts/AppProviders';

const CartItem = ({ item }) => {
  const { updateCartQuantity, removeFromCart } = useAppContext();
  const { product, quantity } = item;

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
      <div className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No image</div>
        )}
      </div>
      <div className="flex-1 w-full">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{product.brand}</p>
        <div className="mt-3 flex items-center gap-3">
          <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => updateCartQuantity(product._id, Number(event.target.value))}
            className="w-20 rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>
      <div className="flex flex-col items-end gap-3">
        <span className="text-lg font-semibold text-primary">
          ${(product.price * quantity).toFixed(2)}
        </span>
        <button
          onClick={() => removeFromCart(product._id)}
          className="text-sm text-red-500 hover:text-red-400"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
