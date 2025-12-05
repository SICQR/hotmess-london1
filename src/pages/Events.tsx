import { RouteId } from '../lib/routes';
import { ArrowLeft, Calendar } from 'lucide-react';

interface EventsProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function Events({ onNavigate }: EventsProps) {
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
          <Calendar size={48} className="text-hotmess-red" />
          <h1 className="text-5xl uppercase">Events</h1>
        </div>
        <p className="text-zinc-400 mb-12 text-xl">Community gatherings, parties, and happenings.</p>

        <div className="bg-zinc-900 border border-white/10 rounded-lg p-12 text-center">
          <p className="text-zinc-500">No events scheduled yet.</p>
          <p className="text-zinc-600 text-sm mt-2">Check back soon for upcoming community events.</p>
        </div>
      </div>
    </div>
  );
}
