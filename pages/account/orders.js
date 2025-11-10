import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import OrderCard from '../../components/OrderCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAppContext } from '../../contexts/AppProviders';

const OrdersPage = () => {
  const router = useRouter();
  const { user, loadingUser } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loadingUser && !user) {
      router.replace('/login?redirect=/account/orders');
    }
  }, [user, loadingUser, router]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data?.error || 'Unable to load orders');
        }
        const data = await response.json();
        setOrders(data.orders);
      } catch (ordersError) {
        setError(ordersError.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <Layout title="Order history · Elite Electronics">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Order history</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track your latest purchases and download receipts.
          </p>
        </div>
        {loading && <LoadingSpinner message="Fetching orders" />}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !orders.length && (
          <div className="py-20 text-center text-slate-500 dark:text-slate-400">
            You have not placed any orders yet.
          </div>
        )}
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
