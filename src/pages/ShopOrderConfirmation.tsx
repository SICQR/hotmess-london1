/**
 * HOTMESS LONDON — SHOP ORDER CONFIRMATION PAGE
 * 
 * Shows order confirmation after successful checkout
 */

import { motion } from 'motion/react';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { Card } from '../components/design-system/Card';
import { HMButton } from '../components/library/HMButton';
import { RouteId } from '../lib/routes';

interface ShopOrderConfirmationProps {
  orderId: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function ShopOrderConfirmation({ orderId, onNavigate }: ShopOrderConfirmationProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Success Banner */}
      <motion.div
        className="bg-gradient-to-r from-hot/20 to-transparent border-b border-hot/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="px-6 lg:px-12 py-8">
          <div className="flex items-center gap-4">
            <CheckCircle size={48} className="text-hot flex-shrink-0" />
            <div>
              <h1>Order Confirmed!</h1>
              <p className="text-white/60">Order #{orderId}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-6 lg:px-12 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8">
              <h2>What happens next?</h2>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-hot/20 border border-hot/40 rounded-full flex items-center justify-center">
                    <Mail size={20} className="text-hot" />
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '4px' }}>Confirmation Email</h3>
                    <p className="text-white/60 text-sm">
                      We've sent your order confirmation to your email. Check your inbox (and spam folder just in case).
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-hot/20 border border-hot/40 rounded-full flex items-center justify-center">
                    <Package size={20} className="text-hot" />
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '4px' }}>Order Processing</h3>
                    <p className="text-white/60 text-sm">
                      We'll prepare your items for shipment. This usually takes 1-2 business days.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-hot/20 border border-hot/40 rounded-full flex items-center justify-center">
                    <ArrowRight size={20} className="text-hot" />
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '4px' }}>Shipping Updates</h3>
                    <p className="text-white/60 text-sm">
                      You'll receive tracking information once your order ships. Delivery typically takes 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8">
              <h2 style={{ marginBottom: '16px' }}>Order Details</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Order Number</span>
                  <span className="font-mono">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Order Date</span>
                  <span>{new Date().toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Status</span>
                  <span className="text-hot font-medium">Processing</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-white/60">
                  Need help? Contact us at{' '}
                  <a href="mailto:orders@hotmesslondon.com" className="text-hot hover:underline">
                    orders@hotmesslondon.com
                  </a>
                </p>
              </div>
            </Card>
          </motion.div>

          {/* XP Earned */}
          <motion.div
            className="bg-gradient-to-r from-hot/10 to-transparent border border-hot/20 rounded-lg p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-4">
              <div style={{ fontSize: '72px' }}>✨</div>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--color-hot)', marginBottom: '4px' }}>XP Earned!</p>
                <p className="text-sm text-white/60">
                  You've earned XP for this purchase. Check your rewards dashboard to see your progress.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <HMButton
              onClick={() => onNavigate('shop')}
              variant="primary"
              className="flex-1"
            >
              Continue Shopping
            </HMButton>
            <HMButton
              onClick={() => onNavigate('accountOrders')}
              variant="secondary"
              className="flex-1"
            >
              View All Orders
            </HMButton>
          </motion.div>

          {/* Aftercare Notice */}
          <motion.div
            className="bg-hot/5 border border-hot/10 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 style={{ fontWeight: 700, color: 'var(--color-hot)', marginBottom: '8px' }}>HOTMESS Aftercare</h3>
            <p className="text-sm text-white/60 mb-4">
              Looking good is one thing, feeling safe is everything. Before your first night out in your new gear, 
              check our Care hub for health, safety, and wellbeing resources.
            </p>
            <HMButton
              onClick={() => onNavigate('care')}
              variant="ghost"
              size="sm"
            >
              Visit Care Hub →
            </HMButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
