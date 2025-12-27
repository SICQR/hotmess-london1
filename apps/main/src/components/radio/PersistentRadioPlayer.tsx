// HOTMESS LONDON - Persistent Radio Player
// Mini player that stays visible across all navigation

import { useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Users, X, Maximize2 } from 'lucide-react';
import { useRadio } from '../../contexts/RadioContext';
import { cn } from '../ui/utils';
import { OSBus } from '../../lib/os-bus';

export function PersistentRadioPlayer() {
  const {
    isPlaying,
    isLoading,
    volume,
    isMuted,
    isMinimized,
    nowPlaying,
    currentShow,
    stats,
    togglePlay,
    setVolume,
    toggleMute,
    expand,
    close
  } = useRadio();

  // Broadcast BPM when track metadata changes.
  // This is the core "Sonic Pulse" that powers globe emissive + any HUD pulse.
  useEffect(() => {
    if (!nowPlaying) return;
    const bpmRaw = (nowPlaying as any)?.bpm;
    const bpm = Number.isFinite(Number(bpmRaw)) ? Number(bpmRaw) : 120;
    OSBus.emit({ type: 'TRACK_BPM_CHANGE', bpm });
  }, [nowPlaying]);
  
  // Don't render if not playing and minimized
  if (!isPlaying && isMinimized) {
    return null;
  }
  
  return (
    <div className="fixed bottom-20 right-4 z-50 bg-black/95 border border-red-500/30 rounded-lg p-3 backdrop-blur-sm shadow-2xl shadow-red-500/20 w-80 lg:bottom-4">
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 text-white" fill="white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-3 h-3 text-red-500 animate-pulse" />
            <span className="text-xs text-red-500 uppercase tracking-wide">Live</span>
            {stats && stats.listeners > 0 && (
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <Users className="w-3 h-3" />
                <span>{stats.listeners}</span>
              </div>
            )}
          </div>
          
          <div className="text-sm text-white truncate">
            {nowPlaying ? `${nowPlaying.artist} - ${nowPlaying.title}` : 'HOTMESS RADIO'}
          </div>
          
          {currentShow && (
            <div className="text-xs text-zinc-400 truncate">{currentShow.name}</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={expand}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="Expand player"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={close}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="Close player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Volume slider */}
      <div className="mt-3 flex items-center gap-2">
        <Volume2 className="w-3 h-3 text-zinc-500" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500"
          aria-label="Volume"
        />
      </div>
    </div>
  );
}
