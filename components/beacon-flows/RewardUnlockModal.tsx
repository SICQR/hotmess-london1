/**
 * REWARD UNLOCK MODAL
 * Mystery prize reveal animation
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, Sparkles, Zap, Trophy, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Reward {
  type: 'xp' | 'discount' | 'freebie' | 'ticket' | 'upgrade';
  title: string;
  description: string;
  value?: string;
  imageUrl?: string;
}

interface RewardUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: Reward;
  xpBonus?: number;
}

export function RewardUnlockModal({
  isOpen,
  onClose,
  reward,
  xpBonus = 50,
}: RewardUnlockModalProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRevealed(false);
      // Auto-reveal after 1.5s
      setTimeout(() => setRevealed(true), 1500);
    }
  }, [isOpen]);

  const rewardIcons = {
    xp: <Zap className="size-16 text-hotmess-yellow" />,
    discount: <Star className="size-16 text-hotmess-purple" />,
    freebie: <Gift className="size-16 text-hotmess-red" />,
    ticket: <Trophy className="size-16 text-hotmess-blue" />,
    upgrade: <Sparkles className="size-16 text-hotmess-orange" />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-black border-2 border-hotmess-red rounded-2xl w-full max-w-md overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="size-5 text-white" />
              </button>

              {/* Sparkle Animation Background */}
              {revealed && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        x: '50%', 
                        y: '50%', 
                        opacity: 0,
                        scale: 0 
                      }}
                      animate={{ 
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 100}%`,
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{ 
                        duration: 2,
                        delay: Math.random() * 0.5,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                      className="absolute"
                    >
                      <Sparkles className="size-4 text-hotmess-yellow" />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="p-8 text-center relative z-10">
                <AnimatePresence mode="wait">
                  {!revealed ? (
                    // Mystery Box
                    <motion.div
                      key="mystery"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="py-12"
                    >
                      <motion.div
                        animate={{ 
                          rotateY: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-hotmess-red via-hotmess-purple to-hotmess-blue flex items-center justify-center"
                      >
                        <Gift className="size-16 text-white" />
                      </motion.div>
                      <h2 className="text-white mb-3">
                        Unlocking Reward...
                      </h2>
                      <div className="flex justify-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.3, 1, 0.3]
                            }}
                            transition={{ 
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                            className="w-2 h-2 rounded-full bg-hotmess-red"
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    // Revealed Reward
                    <motion.div
                      key="reveal"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      {/* Reward Icon */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="flex justify-center"
                      >
                        {rewardIcons[reward.type]}
                      </motion.div>

                      {/* Title */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h2 className="text-white mb-2">
                          {reward.title}
                        </h2>
                        <p className="text-[15px] text-white/70">
                          {reward.description}
                        </p>
                      </motion.div>

                      {/* Value Badge */}
                      {reward.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                          className="inline-block px-6 py-3 bg-gradient-to-r from-hotmess-red to-hotmess-purple rounded-full"
                        >
                          <span className="text-[28px] font-black text-white">
                            {reward.value}
                          </span>
                        </motion.div>
                      )}

                      {/* XP Bonus */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-hotmess-yellow/10 border border-hotmess-yellow/30 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Zap className="size-5 text-hotmess-yellow" />
                          <span className="text-[18px] font-bold text-hotmess-yellow">
                            +{xpBonus} XP Bonus
                          </span>
                        </div>
                      </motion.div>

                      {/* Reward Image */}
                      {reward.imageUrl && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          className="rounded-xl overflow-hidden"
                        >
                          <img 
                            src={reward.imageUrl} 
                            alt={reward.title}
                            className="w-full h-48 object-cover"
                          />
                        </motion.div>
                      )}

                      {/* Claim Button */}
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        onClick={onClose}
                        className="w-full px-6 py-4 bg-gradient-to-r from-hotmess-red to-hotmess-purple hover:opacity-90 rounded-xl text-white font-bold uppercase tracking-wider transition-opacity"
                      >
                        Claim Reward
                      </motion.button>
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
