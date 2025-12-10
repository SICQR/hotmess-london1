/**
 * hm/XPMeter — HOTMESS XP Progress Meter
 */

import { Zap } from 'lucide-react';

interface HMXPMeterProps {
  current: number;
  max: number;
  level: number;
  showLabel?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
}

export function HMXPMeter({
  current,
  max,
  level,
  showLabel = true,
  showPercentage = true,
  animated = true,
}: HMXPMeterProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-hot" />
            <span className="uppercase tracking-wider text-gray-400" style={{ fontSize: '14px' }}>
              Level {level}
            </span>
          </div>
          {showPercentage && (
            <span className="text-hot" style={{ fontSize: '14px', fontWeight: 700 }}>{Math.round(percentage)}%</span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
        <div
          className={`h-full bg-gradient-to-r from-hot to-heat shadow-[0_0_20px_rgba(231,15,60,0.6)] transition-all duration-500 ease-out ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Numbers */}
      <div className="flex items-center justify-between mt-1 text-gray-500" style={{ fontSize: '12px' }}>
        <span>{current.toLocaleString()} XP</span>
        <span>{max.toLocaleString()} XP</span>
      </div>

      {/* Next level text */}
      {current < max && (
        <p className="mt-2 text-gray-600 italic text-center" style={{ fontSize: '12px' }}>
          {(max - current).toLocaleString()} XP to level {level + 1}
        </p>
      )}

      {/* Level up! */}
      {current >= max && (
        <p className="mt-2 text-neon-lime text-center uppercase tracking-wider animate-pulse" style={{ fontSize: '12px' }}>
          Ready to level up!
        </p>
      )}
    </div>
  );
}
