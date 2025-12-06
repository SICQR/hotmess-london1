// HOTMESS LONDON - Drop Countdown Component
// Real-time countdown for timed drops

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface DropCountdownProps {
  targetDate: string;
  onComplete?: () => void;
  compact?: boolean;
}

export function DropCountdown({ targetDate, onComplete, compact = false }: DropCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isLive: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true });
        onComplete?.();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isLive: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (timeLeft.isLive) {
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 bg-hot rounded-full animate-pulse ${compact ? 'text-xs' : 'text-sm'}`}>
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="text-white uppercase tracking-wider">LIVE NOW</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 text-white/60 text-sm">
        <Clock size={14} />
        <span>
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {timeLeft.hours}h {timeLeft.minutes}m
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl text-white tabular-nums">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs text-white/60 uppercase tracking-wider">{label}</div>
    </div>
  );
}
