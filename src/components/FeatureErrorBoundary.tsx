import { ErrorBoundary } from './ErrorBoundary';

interface FeatureErrorBoundaryProps {
  children: React.ReactNode;
  featureName: string;
}

export function FeatureErrorBoundary({ children, featureName }: FeatureErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center">
          <p className="text-white/60 mb-4">
            Failed to load {featureName}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-hot hover:bg-white text-white hover:text-black transition-all text-sm uppercase tracking-wider"
          >
            Retry
          </button>
        </div>
      }
      onError={(error) => {
        console.error(`[${featureName}] Error:`, error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
