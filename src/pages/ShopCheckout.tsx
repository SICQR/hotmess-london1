/**
 * HOTMESS LONDON — SHOP CHECKOUT PAGE
 * 
 * Creates Shopify checkout session and redirects to hosted checkout
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { createCheckout } from '../lib/shopify-api';
import { Card } from '../components/design-system/Card';
import { HMButton } from '../components/library/HMButton';
import { RouteId } from '../lib/routes';

interface ShopCheckoutProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function ShopCheckout({ onNavigate }: ShopCheckoutProps) {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = subtotal >= 5000 ? 0 : 495; // Free shipping over £50
  const total = subtotal + shipping;

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      onNavigate('shopCart');
    }
  }, [items, onNavigate]);

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Map cart items to Shopify variant IDs
      // NOTE: Since we're using mock products without real Shopify variant IDs,
      // we'll create a mock checkout URL for now
      // In production, you need to:
      // 1. Store Shopify variant IDs in your product data
      // 2. Pass real variant IDs to createCheckout()
      // 3. Use the returned webUrl to redirect

      // For demo purposes, create a mock order and redirect to success page
      console.log('Creating checkout with items:', items);

      // TODO: Replace this with real Shopify checkout when variant IDs are available
      // const lineItems = items.map(item => ({
      //   variantId: item.shopifyVariantId, // Need to add this to CartItem interface
      //   quantity: item.qty,
      // }));
      // const checkout = await createCheckout(lineItems);
      // window.location.href = checkout.webUrl;

      // TEMPORARY: Simulate checkout delay and redirect to success
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock order ID
      const orderId = `HM-${Date.now().toString(36).toUpperCase()}`;

      // Clear cart
      await clearCart();

      // Redirect to order confirmation
      onNavigate('shopOrder', { id: orderId });

    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to create checkout. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10 px-6 lg:px-12 py-6">
        <button
          onClick={() => onNavigate('shopCart')}
          className="flex items-center gap-2 text-white/60 hover:text-hot transition-colors"
          disabled={loading}
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

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl mb-6">Payment</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Secure Checkout Badge */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🔒</div>
                    <div>
                      <p className="font-medium mb-1">Secure Checkout</p>
                      <p className="text-sm text-white/60">
                        Your payment is processed securely through Shopify. We never store your card details.
                      </p>
                    </div>
                  </div>
                </div>

                {/* What You Get */}
                <div className="space-y-3">
                  <p className="font-medium">What you'll get:</p>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li className="flex items-start gap-2">
                      <span className="text-hot">✓</span>
                      <span>Fast & discreet shipping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-hot">✓</span>
                      <span>30-day returns on unworn items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-hot">✓</span>
                      <span>XP rewards on every purchase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-hot">✓</span>
                      <span>Order tracking & updates</span>
                    </li>
                  </ul>
                </div>

                {/* Checkout Button */}
                <HMButton
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </span>
                  ) : (
                    `Complete Purchase - £${(total / 100).toFixed(2)}`
                  )}
                </HMButton>

                {/* Trust Signals */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-white/40 text-center">
                    By completing this purchase, you agree to our Terms & Conditions and Privacy Policy.
                    This is an 18+ only platform.
                  </p>
                </div>
              </div>
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
                  disabled={loading}
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
