// HOTMESS LONDON - Live Listeners Badge
// Real-time listener count from RadioKing API
// Floating indicator that shows current audience size

import { useRadio } from '../../contexts/RadioContext';
import { Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LiveListenersProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showWhenZero?: boolean;
}

export function LiveListeners({ 
  position = 'top-right',
  showWhenZero = false 
}: LiveListenersProps) {
  const { stats } = useRadio();
  
  // Don't show if no data or zero listeners (unless showWhenZero is true)
  if (!stats || (!showWhenZero && stats.listeners === 0)) {
    return null;
  }

  const positionClasses = {
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`fixed ${positionClasses[position]} z-50`}
      >
        <div className="bg-black/80 border border-[#ff1694]/40 rounded-xl px-4 py-2 
          backdrop-blur-sm flex items-center gap-2 shadow-lg">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Users className="w-4 h-4 text-[#ff1694]" />
          </motion.div>
          
          <div className="flex flex-col">
            <span className="text-sm text-white font-semibold">
              {stats.listeners}
            </span>
            <span className="text-xs text-white/60">
              listening live
            </span>
          </div>
          
          {/* Pulsing indicator */}
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1694] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff1694]"></span>
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
