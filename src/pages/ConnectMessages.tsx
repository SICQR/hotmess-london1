/**
 * CONNECT MESSAGES
 * View all your message threads
 */

import { RouteId } from '../lib/routes';

interface ConnectMessagesProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function ConnectMessages({ onNavigate }: ConnectMessagesProps) {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">MESSAGES</h1>
        <p className="text-white/60 mb-8">
          Your message threads. Coming soon.
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
