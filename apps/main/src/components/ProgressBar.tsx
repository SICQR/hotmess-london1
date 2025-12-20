/**
 * Responsive Progress Bar Component
 * Used for XP progress, loading bars, etc.
 */

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  color?: 'hot' | 'heat' | 'lime' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showPercentage?: boolean;
}

export function ProgressBar({
  current,
  max,
  label,
  color = 'hot',
  size = 'md',
  animated = false,
  showPercentage = false,
}: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  const colorClasses = {
    hot: 'bg-hot',
    heat: 'bg-heat',
    lime: 'bg-neon-lime',
    cyan: 'bg-cyan-static',
  };

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full space-y-2">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-white/80" style={{ fontSize: '12px', fontWeight: 700 }}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-white/60" style={{ fontSize: '12px' }}>
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${heightClasses[size]} bg-white/10 rounded-full overflow-hidden`}>
        <div
          className={`${heightClasses[size]} ${colorClasses[color]} rounded-full ${
            animated ? 'transition-all duration-500 ease-out' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
