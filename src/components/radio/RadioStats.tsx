// HOTMESS LONDON - Radio Statistics Panel
// Shows detailed radio analytics for City OS and dashboard views
// Live listeners, peak counts, current show info

import { useRadio } from '../../contexts/RadioContext';
import { Users, TrendingUp, Radio, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface RadioStatsProps {
  variant?: 'compact' | 'full';
  showPeakListeners?: boolean;
}

export function RadioStats({ 
  variant = 'compact',
  showPeakListeners = true 
}: RadioStatsProps) {
  const { stats, currentShow, nowPlaying, isPlaying } = useRadio();

  if (!stats) {
    return (
      <div className="bg-black/50 border border-white/10 rounded-2xl p-6">
        <p className="text-white/60 text-sm">Loading radio stats...</p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 border border-white/10 rounded-2xl p-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#ff1694]" />
            <h3 className="font-semibold text-white">Radio Pulse</h3>
          </div>
          {isPlaying && (
            <span className="px-2 py-1 bg-[#ff1694]/20 border border-[#ff1694]/40 rounded-full text-xs text-[#ff1694]">
              LIVE
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/40 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-white/60" />
              <span className="text-xs text-white/60">Listening Now</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.listeners}</p>
          </div>

          {showPeakListeners && (
            <div className="bg-black/40 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-white/60" />
                <span className="text-xs text-white/60">Peak Today</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.peakListeners}</p>
            </div>
          )}
        </div>

        {nowPlaying && (
          <div className="pt-2 border-t border-white/10">
            <p className="text-sm text-white/60 mb-1">Now Playing</p>
            <p className="text-sm font-semibold text-white">{nowPlaying.title}</p>
            <p className="text-xs text-white/50">{nowPlaying.artist}</p>
          </div>
        )}
      </motion.div>
    );
  }

  // Full variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/50 border border-white/10 rounded-2xl p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Radio className="w-6 h-6 text-[#ff1694]" />
          HOTMESS Radio
        </h2>
        {stats.isLive && (
          <span className="px-3 py-1 bg-[#ff1694]/20 border border-[#ff1694]/40 rounded-full text-sm text-[#ff1694] font-semibold">
            LIVE
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#ff1694]/20 to-black border border-[#ff1694]/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-[#ff1694]" />
            <span className="text-sm text-white/80">Live Listeners</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.listeners}</p>
          <p className="text-xs text-white/60 mt-1">men tuned in right now</p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-white/60" />
            <span className="text-sm text-white/80">Peak Today</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.peakListeners}</p>
          <p className="text-xs text-white/60 mt-1">highest listener count</p>
        </div>

        {currentShow && (
          <div className="bg-black/40 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-white/60" />
              <span className="text-sm text-white/80">Current Show</span>
            </div>
            <p className="text-lg font-bold text-white">{currentShow.name}</p>
            <p className="text-xs text-white/60 mt-1">{currentShow.startTime} - {currentShow.endTime}</p>
          </div>
        )}
      </div>

      {nowPlaying && (
        <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex items-center gap-4">
          {nowPlaying.albumArt && (
            <img 
              src={nowPlaying.albumArt} 
              alt={nowPlaying.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div className="flex-1">
            <p className="text-xs text-white/60 mb-1">Now Playing</p>
            <p className="text-lg font-semibold text-white">{nowPlaying.title}</p>
            <p className="text-sm text-white/60">{nowPlaying.artist}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
