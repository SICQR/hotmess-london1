/**
 * HOTMESS - Radio Statistics Panel
 * Shows listener analytics and current track info
 */

import { motion } from 'motion/react';
import { Radio, TrendingUp, Users, Music } from 'lucide-react';
import { RadioStatus } from '../hooks/useRadioStatus';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RadioStatsProps {
  status: RadioStatus;
  className?: string;
}

export function RadioStats({ status, className = '' }: RadioStatsProps) {
  const { listeners, uniqueListeners, peakListeners, currentTrack, isLive } = status;

  return (
    <div className={`bg-black/50 border border-white/10 rounded-2xl p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
          Radio Pulse
        </h3>
        
        {isLive && (
          <div className="flex items-center gap-2 px-3 py-1 bg-[#5200ff]/20 border border-[#5200ff]/40 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5200ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5200ff]"></span>
            </span>
            <span className="text-[#5200ff] text-xs uppercase tracking-wider" style={{ fontWeight: 900 }}>
              Live
            </span>
          </div>
        )}
      </div>

      {/* Current Track */}
      {currentTrack && (
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex gap-4">
          <ImageWithFallback
            src={currentTrack.artwork}
            alt={currentTrack.title}
            className="w-20 h-20 rounded-lg object-cover"
          />

          <div className="flex flex-col justify-center flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Music className="w-4 h-4 text-[#5200ff]" />
              <span className="text-xs text-white/40 uppercase tracking-wider" style={{ fontWeight: 700 }}>
                Now Playing
              </span>
            </div>
            <h4 className="font-semibold truncate">{currentTrack.title}</h4>
            <p className="text-white/60 text-sm truncate">{currentTrack.artist}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Current Listeners */}
        <motion.div
          className="bg-black/40 border border-white/5 rounded-xl p-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-[#5200ff]" />
          </div>
          <p className="text-2xl font-bold">{listeners.toLocaleString()}</p>
          <p className="text-white/50 text-xs uppercase tracking-wider mt-1" style={{ fontWeight: 700 }}>
            Live Now
          </p>
        </motion.div>

        {/* Unique Listeners */}
        <motion.div
          className="bg-black/40 border border-white/5 rounded-xl p-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#5200ff]" />
          </div>
          <p className="text-2xl font-bold">{uniqueListeners.toLocaleString()}</p>
          <p className="text-white/50 text-xs uppercase tracking-wider mt-1" style={{ fontWeight: 700 }}>
            Unique
          </p>
        </motion.div>

        {/* Peak Listeners */}
        <motion.div
          className="bg-black/40 border border-white/5 rounded-xl p-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#5200ff]" />
          </div>
          <p className="text-2xl font-bold">{peakListeners.toLocaleString()}</p>
          <p className="text-white/50 text-xs uppercase tracking-wider mt-1" style={{ fontWeight: 700 }}>
            Peak
          </p>
        </motion.div>
      </div>

      {/* Mock Data Warning */}
      {status.mock && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-500/80">
          ⚠️ Using mock data - Add RADIOKING_API_KEY to enable live listeners
        </div>
      )}
    </div>
  );
}
