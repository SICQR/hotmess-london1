import { RouteId } from '../lib/routes';
import { ArrowLeft, MapPin, CheckCircle } from 'lucide-react';

interface SafePlacesProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function SafePlaces({ onNavigate }: SafePlacesProps) {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <button
        onClick={() => onNavigate('community')}
        className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        BACK TO COMMUNITY
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <MapPin size={48} className="text-hotmess-red" />
          <h1 className="text-5xl uppercase">Safe Places</h1>
        </div>
        <p className="text-zinc-400 mb-12 text-xl">Verified safe spaces and venues for queer men.</p>

        <div className="bg-zinc-900 border border-white/10 rounded-lg p-12 text-center">
          <CheckCircle size={64} className="text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">No safe places listed yet.</p>
          <p className="text-zinc-600 text-sm mt-2">We're building our directory of verified safe spaces.</p>
        </div>
      </div>
    </div>
  );
}
