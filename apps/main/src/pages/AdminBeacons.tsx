/**
 * ADMIN BEACONS
 * Manage all beacons in the system
 */

import { NavFunction } from '../lib/routes';

interface AdminBeaconsProps {
  onNavigate: NavFunction;
}

export function AdminBeacons({ onNavigate }: AdminBeaconsProps) {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-hotmess-red">
          BEACON MANAGEMENT
        </h1>
        <p className="text-white/60 mb-8">
          Manage all beacons across the platform. Coming soon.
        </p>
        
        <button
          onClick={() => onNavigate('admin')}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          ← Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
}
