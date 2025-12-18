import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error tracking service (Sentry, etc.)
    console.error('Error boundary caught:', error, errorInfo);
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback or default error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-hot mx-auto mb-4" />
              <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                Something Went Wrong
              </h1>
              <p className="text-white/60 text-sm">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-hot hover:bg-white text-white hover:text-black transition-all uppercase tracking-wider font-bold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white transition-all uppercase tracking-wider font-bold flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-white/40 cursor-pointer hover:text-white/60">
                  Error Details (Dev Only)
                </summary>
                <pre className="mt-2 p-4 bg-black/50 rounded text-xs text-white/60 overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
