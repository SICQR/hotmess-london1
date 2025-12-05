/**
 * CONNECT CREATE INTENT
 * Create anonymous intent at venue - wrapper for app router page
 */

import { RouteId } from '../lib/routes';

interface ConnectCreateProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function ConnectCreate({ onNavigate }: ConnectCreateProps) {
  // Redirect to app router implementation
  if (typeof window !== 'undefined') {
    window.location.href = '/app/connect/create';
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <p className="text-white/60 mb-8">
          Redirecting to Create Intent...
        </p>
        <button
          onClick={() => onNavigate('connect')}
          className="text-white/60 hover:text-white transition-colors"
        >
          ← Back to Connect
        </button>
      </div>
    </div>
  );
}
