/**
 * HOTMESS - Radio Now Playing Bar (Sticky Footer)
 * Shows current track with live listener count
 */

import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Radio, ExternalLink } from 'lucide-react';
import { RadioStatus } from '../hooks/useRadioStatus';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RadioNowPlayingBarProps {
  status: RadioStatus | null;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  streamUrl?: string;
  className?: string;
}

export function RadioNowPlayingBar({ 
  status, 
  isPlaying = false,
  onTogglePlay,
  streamUrl,
  className = '' 
}: RadioNowPlayingBarProps) {
  if (!status || !status.currentTrack) return null;

  const { currentTrack, listeners, isLive } = status;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 shadow-lg ${className}`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          {/* Album Art */}
          <ImageWithFallback
            src={currentTrack.artwork}
            alt={currentTrack.title}
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
          />

          {/* Track Info */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5200ff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5200ff]"></span>
                </span>
              )}
              <span className="text-xs text-white/40 uppercase tracking-wider" style={{ fontWeight: 700 }}>
                RAW CONVICT RADIO
              </span>
            </div>
            
            <h4 className="font-semibold truncate text-sm">{currentTrack.title}</h4>
            <p className="text-white/60 text-xs truncate">{currentTrack.artist}</p>
          </div>

          {/* Listener Count */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#5200ff]/10 border border-[#5200ff]/30 rounded-lg">
            <Radio className="w-4 h-4 text-[#5200ff]" />
            <span className="text-[#5200ff] text-sm font-semibold">
              {listeners.toLocaleString()}
            </span>
            <span className="text-white/50 text-xs">
              {listeners === 1 ? 'listener' : 'listening'}
            </span>
          </div>

          {/* Play/Pause Button */}
          {onTogglePlay && (
            <button
              onClick={onTogglePlay}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#5200ff] hover:bg-[#5200ff]/90 rounded-full transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" fill="white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
              )}
            </button>
          )}

          {/* External Link */}
          {streamUrl && (
            <a
              href={streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/80 transition-colors"
            >
              <span>Open in Player</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
