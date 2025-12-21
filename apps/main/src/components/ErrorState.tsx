/**
 * Error state component
 * Uses design system error tokens
 */

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { ERRORS } from '../design-system/tokens';

interface ErrorStateProps {
  type?: keyof typeof ERRORS;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ type = 'generic', message, onRetry }: ErrorStateProps) {
  const displayMessage = message || ERRORS[type];

  return (
    <div className="text-center py-20">
      <AlertTriangle className="mx-auto mb-6 text-red-400" size={64} />
      
      <h3 className="mb-4 text-red-400">Something's off</h3>
      
      <p className="text-gray-400 mb-8 max-w-md mx-auto" style={{ fontSize: '18px' }}>
        {displayMessage}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-8 py-4 bg-red-600 hover:bg-red-700 transition-colors uppercase tracking-wider flex items-center gap-3 mx-auto"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      )}
    </div>
  );
}