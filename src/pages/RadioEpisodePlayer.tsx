import { useState, useEffect } from 'react';
import { RouteId } from '../lib/routes';
import { ArrowLeft, Play, Pause } from 'lucide-react';

interface RadioEpisodePlayerProps {
  slug: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function RadioEpisodePlayer({ slug, onNavigate }: RadioEpisodePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('radio')}
        className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        BACK TO RADIO
      </button>

      {/* Episode Player */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-900 border border-white/10 rounded-lg p-8">
          <h1 className="text-4xl uppercase mb-4">Episode: {slug}</h1>
          <p className="text-zinc-400 mb-8">This episode player is coming soon.</p>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-3 bg-hotmess-red hover:bg-red-600 px-6 py-3 rounded transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            {isPlaying ? 'PAUSE' : 'PLAY'} EPISODE
          </button>
        </div>
      </div>
    </div>
  );
}
