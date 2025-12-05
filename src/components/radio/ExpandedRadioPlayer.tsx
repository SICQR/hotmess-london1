// HOTMESS LONDON - Expanded Radio Player
// Full-screen radio player overlay

import { Play, Pause, Volume2, VolumeX, Radio, Users, X, Minimize2 } from 'lucide-react';
import { useRadio } from '../../contexts/RadioContext';

export function ExpandedRadioPlayer() {
  const {
    isPlaying,
    isLoading,
    volume,
    isMuted,
    isExpanded,
    nowPlaying,
    currentShow,
    stats,
    togglePlay,
    setVolume,
    toggleMute,
    minimize
  } = useRadio();
  
  if (!isExpanded) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black/98 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Close/Minimize buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={minimize}
            className="text-zinc-400 hover:text-white transition-colors p-2"
            aria-label="Minimize"
          >
            <Minimize2 className="w-6 h-6" />
          </button>
          <button
            onClick={minimize}
            className="text-zinc-400 hover:text-white transition-colors p-2"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Album art / Show image */}
        <div className="aspect-square w-full max-w-md mx-auto mb-8 rounded-lg overflow-hidden bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30">
          {nowPlaying?.albumArt || currentShow?.image ? (
            <img
              src={nowPlaying?.albumArt || currentShow?.image!}
              alt="Now Playing"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Radio className="w-24 h-24 text-red-500/50" />
            </div>
          )}
        </div>

        {/* Live indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Radio className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="text-sm text-red-500 uppercase tracking-wide">Live Now</span>
          {stats && stats.listeners > 0 && (
            <div className="flex items-center gap-1 text-sm text-zinc-400 ml-4">
              <Users className="w-4 h-4" />
              <span>{stats.listeners} listening</span>
            </div>
          )}
        </div>

        {/* Now playing info */}
        <div className="text-center mb-8">
          <h2 className="text-3xl text-white mb-2">
            {nowPlaying ? nowPlaying.title : 'HOTMESS RADIO'}
          </h2>
          <p className="text-xl text-zinc-400">
            {nowPlaying ? nowPlaying.artist : 'Live Stream'}
          </p>
          {currentShow && (
            <p className="text-sm text-red-500 mt-2">{currentShow.name}</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 shadow-lg shadow-red-500/50"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-8 h-8 text-white" fill="white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            )}
          </button>
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-4 max-w-sm mx-auto">
          <button
            onClick={toggleMute}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-red-500/50"
            aria-label="Volume"
          />
          
          <span className="text-sm text-zinc-500 w-12 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
