import { useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useAppContext } from '../contexts/AppProviders';

const CheckoutForm = ({ clientSecret, cart, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useAppContext();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (stripe && clientSecret) {
      const clientSecretParams = new URLSearchParams(window.location.search).get(
        'payment_intent_client_secret'
      );
      if (clientSecretParams) {
        stripe.retrievePaymentIntent(clientSecretParams).then(({ paymentIntent }) => {
          if (paymentIntent && paymentIntent.status === 'succeeded') {
            setSuccessMessage('Payment successful!');
          }
        });
      }
    }
  }, [stripe, clientSecret]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    setStatus('processing');

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    });

    if (stripeError) {
      setError(stripeError.message);
      setStatus('idle');
      return;
    }

    if (!paymentIntent) {
      setError('Payment could not be confirmed. Please try again.');
      setStatus('idle');
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          paymentIntentId: paymentIntent?.id,
          amount: paymentIntent?.amount_received || paymentIntent?.amount
        })
      });

      if (!response.ok) {
        const message = (await response.json())?.error || 'Failed to create order.';
        throw new Error(message);
      }

      clearCart();
      setSuccessMessage('Order confirmed! A receipt was sent to your email.');
      onSuccess();
    } catch (orderError) {
      setError(orderError.message);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {successMessage && <p className="text-sm text-green-500">{successMessage}</p>}
      <button
        type="submit"
        disabled={status === 'processing' || !stripe || !elements}
        className="w-full px-4 py-3 rounded-full bg-primary text-white font-semibold disabled:opacity-50"
      >
        {status === 'processing' ? 'Processing…' : 'Complete Payment'}
      </button>
    </form>
  );
};

export default CheckoutForm;
