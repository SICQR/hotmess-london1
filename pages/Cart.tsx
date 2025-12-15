import { motion } from 'motion/react';
import { ArrowLeft, Trash2, ShoppingBag, Radio as RadioIcon, Plus, Minus } from 'lucide-react';
import { formatPrice } from '../lib/mockData';
import { RouteId } from '../lib/routes';
import { EmptyState } from '../components/EmptyState';
import { useCart } from '../contexts/CartContext';

interface CartProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function Cart({ onNavigate }: CartProps) {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  const shipping = subtotal >= 5000 ? 0 : 495; // Free shipping over £50
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10 px-6 lg:px-12 py-6">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-2 text-white/60 hover:text-hot transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>
            Continue Shopping
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 lg:px-12 py-12">
        <h1 
          className="text-white uppercase tracking-wider mb-12"
          style={{ fontWeight: 900, fontSize: 'clamp(42px, 8vw, 96px)' }}
        >
          Your Cart
        </h1>

        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your cart's empty"
            message="Add something RAW, HUNG, HIGH, or SUPER and it'll show up here. We save your cart for 24 hours, no strings."
            primaryAction={{
              label: 'Shop Drops',
              onClick: () => onNavigate('shop'),
            }}
            secondaryAction={{
              label: 'Listen Live',
              onClick: () => onNavigate('radio'),
            }}
            supportAction={{
              label: 'Need help?',
              onClick: () => onNavigate('care'),
            }}
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="flex gap-6 p-6 bg-white/5 border border-white/10 hover:border-hot transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  {/* Image */}
                  <button
                    onClick={() => onNavigate('shopProduct', { slug: item.slug })}
                    className="w-24 h-24 bg-white/5 overflow-hidden flex-shrink-0"
                  >
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </button>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="text-hot text-xs uppercase tracking-wider" style={{ fontWeight: 700 }}>
                          {item.category}
                        </span>
                        <h3 
                          className="text-white uppercase tracking-wider mt-1"
                          style={{ fontWeight: 700, fontSize: '16px' }}
                        >
                          {item.title}
                        </h3>
                        {item.size && (
                          <span className="text-white/40 text-sm">Size: {item.size}</span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-white/40 hover:text-hot transition-colors"
                        aria-label="Remove item from cart"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          className="w-8 h-8 border border-white/20 hover:border-hot flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} className="text-white" />
                        </button>
                        <span className="text-white w-8 text-center" style={{ fontWeight: 700 }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="w-8 h-8 border border-white/20 hover:border-hot flex items-center justify-center transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} className="text-white" />
                        </button>
                      </div>
                      
                      <span className="text-white" style={{ fontWeight: 900, fontSize: '18px' }}>
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order summary */}
            <motion.div
              className="lg:sticky lg:top-24 h-fit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white/5 border border-white/20 p-8">
                <h2 className="text-white uppercase tracking-wider mb-6" style={{ fontWeight: 900, fontSize: '20px' }}>
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 700 }}>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span style={{ fontWeight: 700 }}>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-white/40">
                      Add {formatPrice(5000 - subtotal)} for free shipping
                    </p>
                  )}
                </div>

                <div className="flex justify-between mb-8">
                  <span className="text-white uppercase tracking-wider" style={{ fontWeight: 900 }}>Total</span>
                  <span className="text-hot" style={{ fontWeight: 900, fontSize: '24px' }}>
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  onClick={() => onNavigate('shopPurchase')}
                  className="w-full bg-hot hover:bg-white text-white hover:text-black h-14 uppercase tracking-wider transition-all mb-3"
                  style={{ fontWeight: 900 }}
                >
                  Checkout
                </button>

                <p className="text-xs text-white/40 text-center">
                  Secure checkout powered by Stripe
                </p>
              </div>

              {/* Secondary actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => onNavigate('radio')}
                  className="w-full border border-white/20 hover:border-hot text-white h-12 uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  style={{ fontWeight: 700 }}
                >
                  <RadioIcon size={18} />
                  <span>Listen Live</span>
                </button>
                <button
                  onClick={() => onNavigate('care')}
                  className="w-full text-white/60 hover:text-hot uppercase tracking-wider text-sm transition-colors"
                  style={{ fontWeight: 700 }}
                >
                  Need help?
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}