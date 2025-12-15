'use client';

import { useState, useRef } from 'react';
import { motion } from 'motion/react';

interface PanicButtonProps {
  onTrigger: () => void;
}

export function PanicButton({ onTrigger }: PanicButtonProps) {
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    setPressing(true);
    setProgress(0);

    // Increment progress
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handlePressComplete();
          return 100;
        }
        return prev + 5; // Fill in 2 seconds (20 increments * 100ms)
      });
    }, 100);

    // Trigger after 2 seconds
    pressTimer.current = setTimeout(() => {
      handlePressComplete();
    }, 2000);
  };

  const handlePressEnd = () => {
    setPressing(false);
    setProgress(0);
    
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const handlePressComplete = () => {
    handlePressEnd();
    onTrigger();
  };

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <motion.button
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
        animate={{
          scale: pressing ? 1.1 : 1,
        }}
        className="relative"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: pressing 
            ? 'linear-gradient(135deg, #FF1744 0%, #E70F3C 100%)'
            : 'rgba(255,23,68,0.2)',
          border: '2px solid rgba(255,23,68,0.5)',
          boxShadow: pressing
            ? '0 0 30px rgba(255,23,68,0.6)'
            : '0 0 15px rgba(255,23,68,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Progress Ring */}
        <svg 
          className="absolute inset-0" 
          style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="3"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
        </svg>

        {/* Icon */}
        <div style={{
          fontSize: '24px',
          position: 'relative',
          zIndex: 10,
        }}>
          🚨
        </div>
      </motion.button>

      {/* Label */}
      {!pressing && (
        <div 
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          style={{
            fontSize: '9px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            background: 'rgba(0,0,0,0.8)',
            padding: '6px 10px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          PRESS & HOLD
        </div>
      )}

      {pressing && (
        <div 
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          style={{
            fontSize: '9px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#ffffff',
            background: 'rgba(255,23,68,0.9)',
            padding: '6px 10px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          ACTIVATING...
        </div>
      )}
    </div>
  );
}
