/**
 * HOTMESS - Live Listener Count Badge
 * Floating indicator showing real-time radio listeners
 */

import { motion, AnimatePresence } from 'motion/react';
import { Radio } from 'lucide-react';

interface LiveListenersProps {
  listeners: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

export function LiveListeners({ 
  listeners, 
  position = 'top-right',
  className = '' 
}: LiveListenersProps) {
  const positionClasses = {
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <AnimatePresence>
      {listeners > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`fixed ${positionClasses[position]} bg-black/90 border border-[#5200ff]/40 
            rounded-xl px-4 py-2 text-sm text-[#5200ff] backdrop-blur-lg z-50 
            flex items-center gap-2 shadow-lg shadow-[#5200ff]/20 ${className}`}
        >
          {/* Pulse animation */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5200ff] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#5200ff]"></span>
          </span>

          {/* Icon */}
          <Radio className="w-4 h-4" />

          {/* Count */}
          <span className="font-semibold">
            {listeners.toLocaleString()}
          </span>

          <span className="text-white/60">
            {listeners === 1 ? 'listener' : 'listening'}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
