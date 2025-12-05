import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RouteId } from '../lib/routes';
import { CheckCircle2, Package, Mail, Clock, Store, Truck, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface OrderConfirmationProps {
  orderId: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Order {
  id: string;
  status: string;
  created_at: string;
  subtotal_pence: number;
  shipping_pence: number;
  total_pence: number;
  fulfilment_mode: string;
  buyer_shipping: any;
  seller?: {
    id: string;
    display_name: string;
  };
  items?: Array<{
    title: string;
    quantity: number;
    unit_price_pence: number;
    total_price_pence: number;
  }>;
}

export default function MessMarketOrderConfirmation({ orderId, onNavigate }: OrderConfirmationProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading order:', orderId);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Please log in to view your order');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('market_orders')
        .select(`
          *,
          seller:market_sellers(id, display_name),
          items:market_order_items(
            title,
            quantity,
            unit_price_pence,
            total_price_pence
          )
        `)
        .eq('id', orderId)
        .single();

      if (fetchError) {
        console.error('Order fetch error:', fetchError);
        setError('Failed to load order');
        return;
      }

      if (!data) {
        setError('Order not found');
        return;
      }

      setOrder(data as Order);
    } catch (err: any) {
      console.error('Order load error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (pence: number) => {
    return `£${(pence / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ff0055] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-white text-xl mb-2">Order Not Found</h2>
          <p className="text-white/60 mb-6">{error || 'Unable to load order details'}</p>
          <button
            onClick={() => onNavigate('messmarket')}
            className="px-6 py-3 bg-[#ff0055] text-white hover:bg-[#ff0055]/80 transition-colors"
          >
            Back to Market
          </button>
        </div>
      </div>
    );
  }

  const seller = order.seller;
  const items = order.items || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500"
          >
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-white/60 text-lg">Thanks for your order</p>
        </motion.div>

        {/* Email Confirmation Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900 border border-[#ff0055] p-6 mb-8 flex items-start gap-4"
        >
          <Mail className="w-6 h-6 text-[#ff0055] flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-white font-semibold mb-1">Email Confirmation Sent</h3>
            <p className="text-white/60 text-sm">
              We've sent a confirmation email with your order details and tracking info. 
              Check your inbox (and spam folder just in case).
            </p>
          </div>
        </motion.div>

        {/* Order Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900 border border-zinc-800 p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Order Number</p>
              <p className="text-white text-2xl font-mono font-bold">
                #{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm mb-1">Order Date</p>
              <p className="text-white">{formatDate(order.created_at)}</p>
            </div>
          </div>
        </motion.div>

        {/* What's Next Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900 border border-zinc-800 p-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#ff0055]" />
            What's Next?
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                  <span className="text-green-500 font-bold text-sm">✓</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Payment Confirmed</h3>
                <p className="text-white/60 text-sm">Your payment has been processed successfully</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#ff0055]/20 border-2 border-[#ff0055] flex items-center justify-center">
                  <span className="text-[#ff0055] font-bold text-sm">2</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Seller Confirmation</h3>
                <p className="text-white/60 text-sm">
                  {seller?.display_name || 'The seller'} will confirm your order within 12 hours
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-600 flex items-center justify-center">
                  <span className="text-zinc-400 font-bold text-sm">3</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Shipping</h3>
                <p className="text-white/60 text-sm">
                  You'll receive tracking information once your order ships
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-600 flex items-center justify-center">
                  <span className="text-zinc-400 font-bold text-sm">4</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Delivery</h3>
                <p className="text-white/60 text-sm">Estimated 3-5 business days</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-zinc-900 border border-zinc-800 p-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#ff0055]" />
            Order Items
          </h2>

          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start pb-4 border-b border-zinc-800 last:border-0 last:pb-0">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-white/60 text-sm">
                    Qty: {item.quantity} × {formatPrice(item.unit_price_pence)}
                  </p>
                </div>
                <div className="text-white font-semibold">
                  {formatPrice(item.total_price_pence)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 pt-6 border-t border-zinc-800 space-y-2">
            <div className="flex justify-between text-white/60">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal_pence)}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping_pence)}</span>
            </div>
            <div className="flex justify-between text-white text-lg font-bold pt-2 border-t border-zinc-800">
              <span>Total</span>
              <span className="text-[#ff0055]">{formatPrice(order.total_pence)}</span>
            </div>
          </div>
        </motion.div>

        {/* Seller & Shipping Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Seller */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-zinc-900 border border-zinc-800 p-6"
          >
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Store className="w-5 h-5 text-[#ff0055]" />
              Seller
            </h3>
            <p className="text-white font-semibold mb-2">{seller?.display_name || 'Unknown Seller'}</p>
            <p className="text-white/60 text-sm flex items-center gap-2">
              <Truck className="w-4 h-4" />
              {order.fulfilment_mode === 'white_label_partner' 
                ? 'Fulfilled by HOTMESS LONDON' 
                : 'Seller fulfilled'}
            </p>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-zinc-900 border border-zinc-800 p-6"
          >
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#ff0055]" />
              Shipping Address
            </h3>
            {order.buyer_shipping && (
              <div className="text-white/80 text-sm space-y-1">
                <p>{order.buyer_shipping.name}</p>
                <p>{order.buyer_shipping.line1}</p>
                {order.buyer_shipping.line2 && <p>{order.buyer_shipping.line2}</p>}
                <p>{order.buyer_shipping.city}, {order.buyer_shipping.postal_code}</p>
                <p>{order.buyer_shipping.country || 'UK'}</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => onNavigate('messmarket')}
            className="px-8 py-3 bg-zinc-800 text-white hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
          <button
            onClick={() => onNavigate('accountOrders')}
            className="px-8 py-3 bg-[#ff0055] text-white hover:bg-[#ff0055]/80 transition-colors"
          >
            View All Orders
          </button>
        </motion.div>

      </div>
    </div>
  );
}
