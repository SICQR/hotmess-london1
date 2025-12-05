/**
 * CREATOR ONBOARDING
 * Apply to become a host/creator
 */

import { RouteId } from '../lib/routes';

interface CreatorOnboardingProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function CreatorOnboarding({ onNavigate }: CreatorOnboardingProps) {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-hotmess-red to-hotmess-pink bg-clip-text text-transparent">
          BECOME A HOST
        </h1>
        <p className="text-white/60 mb-8">
          Apply to host events and create experiences. Coming soon.
        </p>
        
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
