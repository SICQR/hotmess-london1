/**
 * CHECK-IN SUCCESS MODAL
 * Shown after scanning a venue check-in beacon
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Star, Zap, Users, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CheckInSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueName?: string;
  venueAddress?: string;
  xpEarned?: number;
  streak?: number;
  firstTime?: boolean;
  totalCheckIns?: number;
  currentlyHere?: number;
}

export function CheckInSuccessModal({
  isOpen,
  onClose,
  venueName,
  venueAddress,
  xpEarned = 0,
  streak = 0,
  firstTime = false,
  totalCheckIns = 1,
  currentlyHere = 0,
}: CheckInSuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isOpen]);

  if (!isOpen || !venueName) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-black border-2 border-hotmess-red rounded-2xl w-full max-w-md overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="size-5 text-white" />
              </button>

              {/* Animated Confetti Background */}
              {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        x: '50%', 
                        y: '50%', 
                        opacity: 1,
                        scale: 0 
                      }}
                      animate={{ 
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 100}%`,
                        opacity: 0,
                        scale: 1,
                        rotate: Math.random() * 360
                      }}
                      transition={{ 
                        duration: 2 + Math.random(),
                        ease: "easeOut"
                      }}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: ['#FF1744', '#E91E63', '#9C27B0', '#00E5FF'][i % 4]
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="p-8 text-center relative z-10">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-hotmess-red to-hotmess-purple flex items-center justify-center"
                >
                  <MapPin className="size-10 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white mb-2"
                >
                  Checked In!
                </motion.h2>

                {/* Venue Name */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <p className="text-[18px] font-bold text-hotmess-red mb-1">{venueName}</p>
                  {venueAddress && (
                    <p className="text-[13px] text-white/60">{venueAddress}</p>
                  )}
                </motion.div>

                {/* XP Earned */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
                  className="bg-gradient-to-br from-hotmess-yellow/20 to-hotmess-orange/20 border border-hotmess-yellow/30 rounded-xl p-6 mb-6"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="size-6 text-hotmess-yellow" />
                    <span className="text-[36px] font-black text-hotmess-yellow">
                      +{xpEarned} XP
                    </span>
                  </div>
                  {firstTime && (
                    <p className="text-[13px] text-hotmess-yellow font-bold uppercase tracking-wider">
                      🎉 First time here!
                    </p>
                  )}
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-3 gap-4 mb-6"
                >
                  {streak > 1 && (
                    <StatBubble
                      icon={<Star className="size-4 text-hotmess-orange" />}
                      value={`${streak} day`}
                      label="Streak"
                    />
                  )}
                  <StatBubble
                    icon={<MapPin className="size-4 text-hotmess-blue" />}
                    value={totalCheckIns}
                    label="Check-ins"
                  />
                  {currentlyHere > 0 && (
                    <StatBubble
                      icon={<Users className="size-4 text-hotmess-purple" />}
                      value={currentlyHere}
                      label="Here now"
                    />
                  )}
                </motion.div>

                {/* Action Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={onClose}
                  className="w-full px-6 py-4 bg-hotmess-red hover:bg-hotmess-red/80 rounded-xl text-white font-bold uppercase tracking-wider transition-colors"
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatBubble({ 
  icon, 
  value, 
  label 
}: { 
  icon: React.ReactNode; 
  value: string | number; 
  label: string;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
      <div className="flex items-center justify-center mb-1">
        {icon}
      </div>
      <div className="text-[16px] font-black text-white mb-0.5">{value}</div>
      <div className="text-[10px] text-white/40 uppercase tracking-wider">{label}</div>
    </div>
  );
}
