/**
 * Loading state component
 * Consistent loading UX across the app
 */

import { Loader } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ message = "Loading...", fullScreen = false }: LoadingStateProps) {
  const content = (
    <div className="text-center">
      <Loader className="mx-auto mb-4 text-red-400 animate-spin" size={48} />
      <p className="text-gray-400">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        {content}
      </div>
    );
  }

  return (
    <div className="py-20">
      {content}
    </div>
  );
}
