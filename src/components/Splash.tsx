/**
 * SPLASH SCREEN — Editorial Brutal Luxury Monogram
 * 1.4 second minimal entrance sequence
 */

import { useEffect } from 'react';
import { motion } from 'motion/react';

interface SplashProps {
  onComplete: () => void;
}

export function Splash({ onComplete }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1400);
    
    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden z-50">
      {/* Subtle grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Monogram - Minimal fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="relative z-10"
      >
        {/* HOTMESS Logo Typography */}
        <div className="flex flex-col items-center">
          <h1 
            className="text-[100px] md:text-[140px] lg:text-[180px] uppercase tracking-[-0.05em] text-white"
            style={{ 
              fontWeight: 700,
              lineHeight: 0.9
            }}
          >
            HOTMESS
          </h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-4 w-16 h-[1px] bg-hotmess-red"
          />
        </div>
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute bottom-16 text-white/50 text-xs tracking-[0.2em] uppercase font-medium"
      >
        London · Men · 18+
      </motion.div>
    </div>
  );
}