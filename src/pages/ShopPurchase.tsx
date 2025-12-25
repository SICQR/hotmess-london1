/**
 * HOTMESS LONDON — SHOP PURCHASE PAGE
 * 
 * Shop checkout flow with Stripe payment
 */

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { Card } from '../components/design-system/Card';
import { HMButton } from '../components/library/HMButton';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import { purchaseShop } from '../lib/stripe/stripeService';
import { STRIPE_CONFIGURED, STRIPE_PUBLISHABLE_KEY } from '../lib/env';
import { RouteId } from '../lib/routes';

// Initialize Stripe
const stripePromise = STRIPE_CONFIGURED ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

interface ShopPurchaseProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

/**
 * Checkout Form Component
 */
function CheckoutForm({ 
  items, 
  total, 
  onSuccess 
}: {
  items: any[];
  total: number;
  onSuccess: (orderId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // Confirm the payment
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/shop/order-confirmation`,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        setErrorMessage(stripeError.message || 'Payment failed');
        setLoading(false);
        return;
      }

      // Payment succeeded!
      console.log('Payment confirmed successfully');
      
      // Get order ID from payment metadata
      // For now, we'll generate it here - in production it would come from the backend
      const orderId = `HM-${Date.now().toString(36).toUpperCase()}`;
      onSuccess(orderId);
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{errorMessage}</p>
        </div>
      )}

      <HMButton
        type="submit"
        disabled={!stripe || loading}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={20} />
            Processing...
          </span>
        ) : (
          `Pay £${(total / 100).toFixed(2)}`
        )}
      </HMButton>

      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-white/40 text-center">
          🔒 Secure payment processing by Stripe. Your payment information is encrypted and secure.
        </p>
      </div>
    </form>
  );
}

/**
 * Main Purchase Page
 */
export function ShopPurchase({ onNavigate }: ShopPurchaseProps) {
  const { items, subtotal, clearCart } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (!STRIPE_CONFIGURED) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl mb-2">Payments not configured</h2>
          <p className="text-white/60 mb-6">
            Stripe is not configured. Set VITE_STRIPE_PUBLISHABLE_KEY (pk_test_… or pk_live_…) to enable checkout.
          </p>
          <HMButton onClick={() => onNavigate('shopCart')} variant="ghost">
            Back to Cart
          </HMButton>
        </Card>
      </div>
    );
  }

  const shipping = subtotal >= 5000 ? 0 : 495; // Free shipping over £50
  const total = subtotal + shipping;

  useEffect(() => {
    if (items.length === 0) {
      onNavigate('shopCart');
      return;
    }

    loadAndCreateIntent();
  }, []);

  async function loadAndCreateIntent() {
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('You must be logged in to complete your purchase. Click the button below to login.');
        setLoading(false);
        return;
      }

      // Create Payment Intent
      const result = await purchaseShop(
        items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          qty: item.qty,
          category: item.category,
          size: item.size,
        })),
        total,
        session.user.email || '',
        session.access_token
      );

      if (!result.success || !result.clientSecret) {
        setError(result.error || 'Failed to initialize payment');
        setLoading(false);
        return;
      }

      setClientSecret(result.clientSecret);
      setOrderId(result.orderId);
      setLoading(false);
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError('Failed to initialize payment');
      setLoading(false);
    }
  }

  async function handleSuccess(orderId: string) {
    // Clear cart
    await clearCart();
    
    // Navigate to order confirmation
    onNavigate('shopOrder', { id: orderId });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-hot border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl mb-2">Error</h2>
          <p className="text-white/60 mb-6">{error || 'Your cart is empty'}</p>
          <div className="flex flex-col gap-3">
            {error?.includes('logged in') && (
              <>
                <HMButton onClick={() => onNavigate('login')}>
                  Login
                </HMButton>
                <HMButton onClick={() => onNavigate('register')} variant="secondary">
                  Create Account
                </HMButton>
              </>
            )}
            <HMButton onClick={() => onNavigate('shopCart')} variant="ghost">
              Back to Cart
            </HMButton>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10 px-6 lg:px-12 py-6">
        <button
          onClick={() => onNavigate('shopCart')}
          className="flex items-center gap-2 text-white/60 hover:text-hot transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>
            Back to Cart
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 lg:px-12 py-12">
        <motion.h1
          className="text-white uppercase tracking-wider mb-8"
          style={{ fontWeight: 900, fontSize: 'clamp(42px, 8vw, 72px)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Checkout
        </motion.h1>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h2 className="text-xl mb-6 flex items-center gap-2">
                <ShoppingBag size={24} />
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover bg-white/5"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-hot uppercase tracking-wider" style={{ fontWeight: 700 }}>
                        {item.category}
                      </p>
                      <p className="font-medium">{item.title}</p>
                      {item.size && (
                        <p className="text-sm text-white/40">Size: {item.size}</p>
                      )}
                      <p className="text-sm text-white/60">Qty: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">£{(item.price / 100).toFixed(2)}</p>
                      {item.qty > 1 && (
                        <p className="text-sm text-white/40">
                          £{((item.price * item.qty) / 100).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>£{(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `£${(shipping / 100).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-xl pt-2 border-t border-white/10">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-hot">£{(total / 100).toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl mb-6">Payment Details</h2>

              {clientSecret && orderId && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    items={items}
                    total={total}
                    onSuccess={handleSuccess}
                  />
                </Elements>
              )}
            </Card>

            {/* Care Notice */}
            <motion.div
              className="mt-6 p-4 bg-hot/10 border border-hot/20 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm">
                <span className="font-bold text-hot">AFTERCARE REMINDER:</span>{' '}
                Looking good is one thing, feeling safe is everything. Check our{' '}
                <button
                  onClick={() => onNavigate('care')}
                  className="underline hover:text-hot transition"
                >
                  Care hub
                </button>{' '}
                for health, safety, and wellbeing resources.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
