// XP Progress Bar Component

interface XPBarProps {
  current: number;
  max: number;
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

export function XPBar({ current, max, showLabel = false, height = 'md' }: XPBarProps) {
  const progress = Math.min((current / max) * 100, 100);

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>{current.toLocaleString()} XP</span>
          <span>{max.toLocaleString()} XP</span>
        </div>
      )}
      <div className={`w-full bg-neutral-800 rounded-full overflow-hidden ${heights[height]}`}>
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
        />
      </div>
    </div>
  );
}
