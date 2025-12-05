/**
 * CONNECT PROFILE
 * View a user's Connect profile
 */

import { RouteId } from '../lib/routes';

interface ConnectProfileProps {
  profileId: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function ConnectProfile({ profileId, onNavigate }: ConnectProfileProps) {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">PROFILE</h1>
        <p className="text-white/60 mb-4">
          Profile ID: {profileId}
        </p>
        <p className="text-white/60 mb-8">
          Coming soon.
        </p>
        
        <button
          onClick={() => onNavigate('connectDiscovery')}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          ← Back to Discovery
        </button>
      </div>
    </div>
  );
}
