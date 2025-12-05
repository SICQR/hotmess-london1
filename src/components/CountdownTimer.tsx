/**
 * Responsive Countdown Timer Component
 * Used for timed drops, events, etc.
 */

'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
  compact?: boolean;
  onComplete?: () => void;
}

export function CountdownTimer({
  targetDate,
  label = 'Time remaining',
  compact = false,
  onComplete,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    function calculateTimeLeft() {
      const difference = +targetDate - +new Date();

      if (difference <= 0) {
        if (onComplete) onComplete();
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (!timeLeft) {
    return (
      <div className="flex items-center gap-2 text-heat">
        <Clock size={16} />
        <span style={{ fontSize: '12px', fontWeight: 700 }}>Ended</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-heat">
        <Clock size={16} />
        <span style={{ fontSize: '12px', fontWeight: 700 }}>
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {timeLeft.hours}h {timeLeft.minutes}m
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <div className="text-white/60" style={{ fontSize: '12px', fontWeight: 700 }}>
          {label}
        </div>
      )}
      <div className="flex items-center gap-2 sm:gap-3">
        {timeLeft.days > 0 && (
          <div className="flex flex-col items-center min-w-[60px]">
            <div className="text-hot" style={{ fontSize: '24px', fontWeight: 700 }}>
              {timeLeft.days}
            </div>
            <div className="text-white/60" style={{ fontSize: '10px' }}>DAYS</div>
          </div>
        )}
        <div className="flex flex-col items-center min-w-[50px]">
          <div className="text-hot" style={{ fontSize: '24px', fontWeight: 700 }}>
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-white/60" style={{ fontSize: '10px' }}>HOURS</div>
        </div>
        <div className="flex flex-col items-center min-w-[50px]">
          <div className="text-hot" style={{ fontSize: '24px', fontWeight: 700 }}>
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-white/60" style={{ fontSize: '10px' }}>MINS</div>
        </div>
        <div className="flex flex-col items-center min-w-[50px]">
          <div className="text-hot" style={{ fontSize: '24px', fontWeight: 700 }}>
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-white/60" style={{ fontSize: '10px' }}>SECS</div>
        </div>
      </div>
    </div>
  );
}
