// HOTMESS LONDON - Radio Now Playing Bar
// Sticky bottom bar showing current track when radio is playing
// Appears globally across all pages

import { useRadio } from '../../contexts/RadioContext';
import { Play, Pause, Radio, Users, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RadioNowPlayingBarProps {
  onExpand?: () => void;
}

export function RadioNowPlayingBar({ onExpand }: RadioNowPlayingBarProps) {
  const { 
    isPlaying, 
    nowPlaying, 
    stats,
    togglePlay,
    expand 
  } = useRadio();

  // Only show when radio is playing
  if (!isPlaying || !nowPlaying) {
    return null;
  }

  const handleExpand = () => {
    if (onExpand) {
      onExpand();
    } else {
      expand();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-t border-[#ff1694]/30"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Album Art */}
            {nowPlaying.albumArt && (
              <img 
                src={nowPlaying.albumArt}
                alt={nowPlaying.title}
                className="w-12 h-12 rounded-lg object-cover hidden sm:block"
              />
            )}

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Radio className="w-3 h-3 text-[#ff1694]" />
                <span className="text-xs text-white/60 uppercase tracking-wider">
                  Live on HOTMESS Radio
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {nowPlaying.title}
                  </p>
                  <p className="text-xs text-white/60 truncate">
                    {nowPlaying.artist}
                  </p>
                </div>
                
                {/* Listener Count */}
                {stats && stats.listeners > 0 && (
                  <motion.div 
                    className="flex items-center gap-1 px-2 py-1 bg-[#ff1694]/20 border border-[#ff1694]/40 rounded-full"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Users className="w-3 h-3 text-[#ff1694]" />
                    <span className="text-xs text-[#ff1694] font-semibold">
                      {stats.listeners}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-[#ff1694] hover:bg-[#ff1694]/90 transition-colors flex items-center justify-center"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" fill="white" />
                ) : (
                  <Play className="w-5 h-5 text-white" fill="white" />
                )}
              </button>

              <button
                onClick={handleExpand}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                aria-label="Expand player"
              >
                <Maximize2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Progress Bar (optional - can show elapsed time if available) */}
          <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#ff1694] to-purple-600"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ 
                duration: nowPlaying.duration || 180, 
                ease: 'linear',
                repeat: Infinity 
              }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
