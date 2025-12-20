import { RouteId } from '../lib/routes';
import { ArrowLeft, Heart, Phone, MessageCircle, Shield } from 'lucide-react';

interface CareHubProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function CareHub({ onNavigate }: CareHubProps) {
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
          <Heart size={48} className="text-hotmess-red" />
          <h1 className="text-5xl uppercase">Care Hub</h1>
        </div>
        <p className="text-zinc-400 mb-12 text-xl">Support, resources, and care services.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-8">
            <Phone size={32} className="text-hotmess-red mb-4" />
            <h3 className="text-xl uppercase mb-2">Crisis Lines</h3>
            <p className="text-zinc-400 text-sm">24/7 support hotlines</p>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-lg p-8">
            <MessageCircle size={32} className="text-hotmess-red mb-4" />
            <h3 className="text-xl uppercase mb-2">Chat Support</h3>
            <p className="text-zinc-400 text-sm">Live chat with counselors</p>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-lg p-8">
            <Shield size={32} className="text-hotmess-red mb-4" />
            <h3 className="text-xl uppercase mb-2">Safety Resources</h3>
            <p className="text-zinc-400 text-sm">Info and education</p>
          </div>
        </div>

        <div className="mt-12 bg-zinc-900 border border-white/10 rounded-lg p-8">
          <p className="text-zinc-500 text-sm">
            <strong>Disclaimer:</strong> HOTMESS LONDON provides information and community support. 
            We are not a substitute for professional medical, mental health, or crisis intervention services.
          </p>
        </div>
      </div>
    </div>
  );
}
