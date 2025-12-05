/**
 * QUICK CHECKOUT MODAL
 * Instant purchase flow for scan-to-buy beacons
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, CreditCard, Zap, Check } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category: string;
  inStock: boolean;
}

interface QuickCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  xpEarned: number;
}

export function QuickCheckoutModal({
  isOpen,
  onClose,
  product,
  xpEarned,
}: QuickCheckoutModalProps) {
  const [step, setStep] = useState<'product' | 'payment' | 'success'>('product');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [processing, setProcessing] = useState(false);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  async function handlePurchase() {
    setProcessing(true);
    // TODO: Implement actual payment processing
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
    }, 2000);
  }

  function resetAndClose() {
    setStep('product');
    setSelectedSize('M');
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-black border-2 border-hotmess-purple rounded-2xl w-full max-w-md overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={resetAndClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="size-5 text-white" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-br from-hotmess-purple/20 to-hotmess-blue/20 border-b border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-hotmess-purple/30 flex items-center justify-center">
                    <Zap className="size-6 text-hotmess-purple" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-white uppercase tracking-wider">
                      Quick Checkout
                    </h3>
                    <p className="text-[13px] text-white/60">
                      Scan to buy • Instant checkout
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {step === 'product' && (
                    <motion.div
                      key="product"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      {/* Product Image */}
                      {product.imageUrl && (
                        <div className="aspect-square rounded-xl overflow-hidden bg-white/5">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div>
                        <p className="text-[12px] text-hotmess-purple uppercase tracking-wider mb-2">
                          {product.category}
                        </p>
                        <h2 className="text-[20px] font-bold text-white mb-2">
                          {product.name}
                        </h2>
                        <p className="text-[28px] font-black text-hotmess-red">
                          £{product.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Size Selection */}
                      <div>
                        <p className="text-[13px] text-white/60 uppercase tracking-wider mb-3">
                          Select Size
                        </p>
                        <div className="flex gap-2">
                          {sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`flex-1 py-3 rounded-lg font-bold uppercase tracking-wider transition-all ${
                                selectedSize === size
                                  ? 'bg-hotmess-purple text-white'
                                  : 'bg-white/5 text-white/60 hover:bg-white/10'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* XP Badge */}
                      <div className="flex items-center gap-2 p-3 bg-hotmess-yellow/10 border border-hotmess-yellow/30 rounded-lg">
                        <Zap className="size-4 text-hotmess-yellow" />
                        <span className="text-[13px] font-bold text-hotmess-yellow">
                          Earn +{xpEarned} XP with this purchase
                        </span>
                      </div>

                      {/* Continue Button */}
                      <button
                        onClick={() => setStep('payment')}
                        disabled={!product.inStock}
                        className="w-full px-6 py-4 bg-hotmess-purple hover:bg-hotmess-purple/80 disabled:bg-white/10 disabled:text-white/40 rounded-xl text-white font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                      >
                        <CreditCard className="size-5" />
                        {product.inStock ? 'Continue to Payment' : 'Out of Stock'}
                      </button>
                    </motion.div>
                  )}

                  {step === 'payment' && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      {/* Order Summary */}
                      <div className="bg-white/5 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[13px] text-white/60">Subtotal</span>
                          <span className="text-[15px] font-bold text-white">
                            £{product.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[13px] text-white/60">Shipping</span>
                          <span className="text-[15px] font-bold text-white">£4.99</span>
                        </div>
                        <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                          <span className="text-[15px] font-bold text-white">Total</span>
                          <span className="text-[20px] font-black text-hotmess-red">
                            £{(product.price + 4.99).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Saved Payment Method */}
                      <div className="bg-white/5 rounded-xl p-4 border-2 border-hotmess-purple">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="size-5 text-hotmess-purple" />
                            <div>
                              <p className="text-[13px] font-bold text-white">•••• 4242</p>
                              <p className="text-[11px] text-white/60">Expires 12/25</p>
                            </div>
                          </div>
                          <button className="text-[12px] text-hotmess-purple font-bold uppercase tracking-wider">
                            Change
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        <button
                          onClick={handlePurchase}
                          disabled={processing}
                          className="w-full px-6 py-4 bg-hotmess-purple hover:bg-hotmess-purple/80 disabled:opacity-50 rounded-xl text-white font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                        >
                          {processing ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Zap className="size-5" />
                              </motion.div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="size-5" />
                              Complete Purchase
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setStep('product')}
                          disabled={processing}
                          className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 rounded-xl text-white/80 font-bold uppercase tracking-wider transition-colors"
                        >
                          Back
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 space-y-6"
                    >
                      {/* Success Icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-20 h-20 mx-auto rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center"
                      >
                        <Check className="size-10 text-green-500" />
                      </motion.div>

                      <div>
                        <h3 className="text-white mb-2">Order Confirmed!</h3>
                        <p className="text-[14px] text-white/60 mb-1">
                          Your order has been placed
                        </p>
                        <p className="text-[13px] text-white/40">
                          Check your email for confirmation
                        </p>
                      </div>

                      {/* XP Earned */}
                      <div className="bg-gradient-to-br from-hotmess-yellow/20 to-hotmess-orange/20 border border-hotmess-yellow/30 rounded-xl p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Zap className="size-5 text-hotmess-yellow" />
                          <span className="text-[24px] font-black text-hotmess-yellow">
                            +{xpEarned} XP
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={resetAndClose}
                        className="w-full px-6 py-4 bg-hotmess-purple hover:bg-hotmess-purple/80 rounded-xl text-white font-bold uppercase tracking-wider transition-colors"
                      >
                        Done
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
