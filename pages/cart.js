import Layout from '../components/Layout';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import { useAppContext } from '../contexts/AppProviders';

const CartPage = () => {
  const { cart } = useAppContext();

  return (
    <Layout title="Your Cart · Elite Electronics">
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold">Shopping Cart</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {cart.length} items in your bag.
          </p>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center text-slate-500 dark:text-slate-400">
                Your cart is empty. Start exploring the latest devices.
              </div>
            ) : (
              cart.map((item) => <CartItem key={item.product._id} item={item} />)
            )}
          </div>
        </section>
        <CartSummary items={cart} />
      </div>
    </Layout>
  );
};

export default CartPage;
