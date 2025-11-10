import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Layout from '../components/Layout';
import CheckoutForm from '../components/CheckoutForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppContext } from '../contexts/AppProviders';

const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, user } = useAppContext();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      router.replace('/login?redirect=/checkout');
    }
  }, [user, router]);

  useEffect(() => {
    const initializePayment = async () => {
      if (!cart.length) {
        return;
      }
      setLoading(true);
      try {
        const response = await fetch('/api/checkout/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cart })
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data?.error || 'Failed to initialize payment');
        }
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (intentError) {
        setError(intentError.message);
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [cart]);

  if (!cart.length) {
    return (
      <Layout title="Checkout">
        <div className="py-32 text-center text-slate-500 dark:text-slate-400">
          Your cart is empty. Add products before checking out.
        </div>
      </Layout>
    );
  }

  if (!stripePromise) {
    return (
      <Layout title="Checkout">
        <div className="py-32 text-center text-red-500">
          Stripe publishable key is not configured. Please set STRIPE_PUBLISHABLE_KEY.
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Checkout · Elite Electronics">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Secure Checkout</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Complete your order with our encrypted payment flow powered by Stripe.
          </p>
        </div>
        {loading && <LoadingSpinner message="Setting up payment" />}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {clientSecret && stripePromise && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'night',
                variables: { colorPrimary: '#2563eb' }
              }
            }}
          >
            <CheckoutForm clientSecret={clientSecret} cart={cart} onSuccess={() => router.push('/account/orders')} />
          </Elements>
        )}
      </div>
    </Layout>
  );
};

export default CheckoutPage;
