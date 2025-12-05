/**
 * Responsive Empty State Component
 * Shows when lists/grids have no data
 * TYPOGRAPHY: All text uses inline styles (fontSize, fontWeight)
 */

import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6 sm:p-8">
      <div className="text-center max-w-md mx-auto space-y-4 sm:space-y-6">
        <div className="flex justify-center">
          <Icon size={64} className="text-white/20 sm:w-20 sm:h-20" />
        </div>
        
        <h3 className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>
          {title}
        </h3>
        
        <p className="text-white/60" style={{ fontSize: '14px' }}>
          {description}
        </p>
        
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="mt-6 px-6 py-3 bg-hot hover:bg-white text-white hover:text-black rounded-xl transition-colors"
            style={{ fontSize: '14px', fontWeight: 900 }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}