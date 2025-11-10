import Link from 'next/link';

const CartSummary = ({ items }) => {
  const subtotal = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  return (
    <aside className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 h-max">
      <h3 className="text-lg font-semibold">Order Summary</h3>
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>Shipping</span>
        <span>${shipping.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between text-lg font-semibold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <Link
        href="/checkout"
        className={`block text-center px-4 py-3 rounded-full font-semibold ${
          subtotal > 0
            ? 'bg-primary text-white hover:bg-primary-dark'
            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
        }`}
      >
        Proceed to Checkout
      </Link>
      <p className="text-xs text-slate-400">
        Taxes calculated during checkout. Shipping is waived for orders above $500.
      </p>
    </aside>
  );
};

export default CartSummary;
