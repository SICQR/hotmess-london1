/**
 * CONNECT DISCOVERY
 * Discover profiles
 */

import { RouteId } from '../lib/routes';

interface ConnectDiscoveryProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function ConnectDiscovery({ onNavigate }: ConnectDiscoveryProps) {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">DISCOVERY</h1>
        <p className="text-white/60 mb-8">
          Discover new profiles. Coming soon.
        </p>
        
        <button
          onClick={() => onNavigate('connect')}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          ← Back to Connect
        </button>
      </div>
    </div>
  );
}
