/**
 * HOTMESS LONDON — FROSTED AUDIO CARD SYSTEM
 * 
 * Universal audio component for ALL sound on the platform:
 * - Radio (live streaming)
 * - Records (track previews)
 * - Podcasts
 * - Beacons with audio
 * - Care content
 * - Shop promos
 * - Community voice posts
 * - Bot voice messages
 * 
 * Variants: Mini Bar, Inline Card, Full Player, Live Radio, Transcript Panel
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize2,
  Minimize2,
  Share2,
  Plus,
  Users,
  Radio as RadioIcon,
  Disc,
  Mic,
  Heart,
  Download
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export type AudioSource = 'radio' | 'records' | 'podcast' | 'beacon' | 'care' | 'shop' | 'community' | 'bot';
export type AudioVariant = 'mini' | 'inline' | 'full' | 'live' | 'transcript';

export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  coverArt?: string;
  source: AudioSource;
  audioUrl?: string;
  duration?: number;
  isLive?: boolean;
  transcript?: string;
  waveformData?: number[];
}

export interface FrostedAudioCardProps {
  /** Audio track data */
  track: AudioTrack;
  
  /** Visual variant */
  variant?: AudioVariant;
  
  /** Current playback state */
  isPlaying?: boolean;
  
  /** Current time (seconds) */
  currentTime?: number;
  
  /** Volume (0-1) */
  volume?: number;
  
  /** Muted */
  muted?: boolean;
  
  /** Show transcript */
  showTranscript?: boolean;
  
  /** Listener count (for live radio) */
  listenerCount?: number;
  
  /** DJ info (for radio) */
  djName?: string;
  djImage?: string;
  
  /** Sponsor label */
  sponsorLabel?: string;
  
  /** Callbacks */
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
  onToggleMute?: () => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  onShare?: () => void;
  onAddToQueue?: () => void;
  onSave?: () => void;
  onToggleTranscript?: () => void;
}

// ============================================================================
// SOURCE COLORS & ICONS
// ============================================================================

const getSourceConfig = (source: AudioSource) => {
  switch (source) {
    case 'radio':
      return {
        color: '#FF003D',
        label: 'RADIO',
        icon: <RadioIcon className="w-3 h-3" />,
      };
    case 'records':
      return {
        color: '#8800FF',
        label: 'RECORDS',
        icon: <Disc className="w-3 h-3" />,
      };
    case 'podcast':
      return {
        color: '#FF6A00',
        label: 'PODCAST',
        icon: <Mic className="w-3 h-3" />,
      };
    case 'beacon':
      return {
        color: '#FF0080',
        label: 'BEACON',
        icon: <Play className="w-3 h-3" />,
      };
    case 'care':
      return {
        color: '#23FF87',
        label: 'CARE',
        icon: <Heart className="w-3 h-3" />,
      };
    case 'shop':
      return {
        color: '#E4C373',
        label: 'SHOP',
        icon: <Play className="w-3 h-3" />,
      };
    case 'community':
      return {
        color: '#006CFF',
        label: 'COMMUNITY',
        icon: <Mic className="w-3 h-3" />,
      };
    case 'bot':
      return {
        color: '#FFC847',
        label: 'BOT',
        icon: <Mic className="w-3 h-3" />,
      };
    default:
      return {
        color: '#FFFFFF',
        label: 'AUDIO',
        icon: <Play className="w-3 h-3" />,
      };
  }
};

// ============================================================================
// FROSTED GLASS BASE STYLES
// ============================================================================

const frostedGlassStyles = {
  backgroundColor: 'rgba(15, 15, 15, 0.58)',
  backdropFilter: 'blur(18px)',
  border: '1px solid rgba(255, 255, 255, 0.16)',
  boxShadow: 'inset 0 0 40px rgba(255, 0, 52, 0.08)',
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function FrostedAudioCard({
  track,
  variant = 'inline',
  isPlaying = false,
  currentTime = 0,
  volume = 1,
  muted = false,
  showTranscript = false,
  listenerCount,
  djName,
  djImage,
  sponsorLabel,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onExpand,
  onCollapse,
  onShare,
  onAddToQueue,
  onSave,
  onToggleTranscript,
}: FrostedAudioCardProps) {
  const sourceConfig = getSourceConfig(track.source);
  const [showVolume, setShowVolume] = useState(false);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = track.duration ? (currentTime / track.duration) * 100 : 0;

  // Render based on variant
  switch (variant) {
    case 'mini':
      return <MiniFrostBar {...{ track, sourceConfig, isPlaying, onPlay, onPause, onExpand }} />;
    
    case 'full':
      return <FullFrostPlayer {...{ 
        track, 
        sourceConfig, 
        isPlaying, 
        currentTime, 
        volume, 
        muted, 
        showTranscript,
        djName,
        djImage,
        onPlay, 
        onPause, 
        onSeek, 
        onVolumeChange,
        onToggleMute,
        onCollapse,
        onShare,
        onAddToQueue,
        onSave,
        onToggleTranscript,
        formatTime,
        progress
      }} />;
    
    case 'live':
      return <LiveRadioFrost {...{ 
        track, 
        sourceConfig, 
        isPlaying, 
        listenerCount,
        djName,
        djImage,
        sponsorLabel,
        onPlay, 
        onPause 
      }} />;
    
    case 'transcript':
      return <TranscriptPanel {...{ track, isPlaying, currentTime }} />;
    
    default: // inline
      return <InlineFrostCard {...{ 
        track, 
        sourceConfig, 
        isPlaying, 
        currentTime,
        onPlay, 
        onPause,
        onToggleTranscript,
        formatTime,
        progress
      }} />;
  }
}

// ============================================================================
// VARIANT: MINI FROST BAR (Global Bottom Bar)
// ============================================================================

function MiniFrostBar({ 
  track, 
  sourceConfig, 
  isPlaying, 
  onPlay, 
  onPause, 
  onExpand 
}: any) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        ...frostedGlassStyles,
        borderRadius: 0,
        borderTop: `2px solid ${sourceConfig.color}40`,
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Cover Art */}
        <div 
          className="w-12 h-12 rounded-xl bg-white/5 bg-cover bg-center flex-shrink-0"
          style={{ backgroundImage: track.coverArt ? `url(${track.coverArt})` : undefined }}
        >
          {!track.coverArt && (
            <div className="w-full h-full flex items-center justify-center">
              {sourceConfig.icon}
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded"
              style={{ 
                color: sourceConfig.color,
                backgroundColor: `${sourceConfig.color}20`
              }}
            >
              {sourceConfig.label}
            </span>
          </div>
          <h3 className="text-white text-sm font-bold truncate">
            {track.title}
          </h3>
          {track.artist && (
            <p className="text-white/60 text-xs truncate">
              {track.artist}
            </p>
          )}
        </div>

        {/* Mini Waveform */}
        <div className="hidden md:flex items-center gap-0.5 h-8">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-white/40 rounded-full"
              animate={isPlaying ? {
                height: [8, Math.random() * 24 + 8, 8],
              } : {
                height: 8
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.05,
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: `${sourceConfig.color}20` }}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" style={{ color: sourceConfig.color }} />
          ) : (
            <Play className="w-5 h-5 ml-0.5" style={{ color: sourceConfig.color }} />
          )}
        </button>

        {/* Expand */}
        <button
          onClick={onExpand}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <Maximize2 className="w-4 h-4 text-white/60" />
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// VARIANT: INLINE FROST CARD
// ============================================================================

function InlineFrostCard({ 
  track, 
  sourceConfig, 
  isPlaying, 
  currentTime,
  onPlay, 
  onPause,
  onToggleTranscript,
  formatTime,
  progress
}: any) {
  return (
    <div
      className="rounded-2xl p-4 w-full"
      style={frostedGlassStyles}
    >
      <div className="flex items-center gap-4">
        {/* Cover Art */}
        <div 
          className="w-16 h-16 rounded-xl bg-white/5 bg-cover bg-center flex-shrink-0"
          style={{ backgroundImage: track.coverArt ? `url(${track.coverArt})` : undefined }}
        >
          {!track.coverArt && (
            <div className="w-full h-full flex items-center justify-center">
              {sourceConfig.icon}
            </div>
          )}
        </div>

        {/* Info & Waveform */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span 
              className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded"
              style={{ 
                color: sourceConfig.color,
                backgroundColor: `${sourceConfig.color}20`
              }}
            >
              {sourceConfig.label}
            </span>
          </div>

          <h3 className="text-white font-bold text-base mb-1 truncate">
            {track.title}
          </h3>

          {track.artist && (
            <p className="text-white/60 text-sm mb-2 truncate">
              {track.artist}
            </p>
          )}

          {/* Waveform */}
          <div className="flex items-center gap-0.5 h-8 mb-2">
            {track.waveformData?.slice(0, 40).map((amplitude, i) => (
              <div
                key={i}
                className="flex-1 rounded-full transition-colors"
                style={{
                  height: `${amplitude * 100}%`,
                  backgroundColor: i < (progress / 100 * 40) 
                    ? sourceConfig.color 
                    : 'rgba(255, 255, 255, 0.3)',
                }}
              />
            )) || (
              // Fallback if no waveform data
              Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full"
                  style={{
                    height: `${Math.random() * 100}%`,
                    backgroundColor: i < (progress / 100 * 40) 
                      ? sourceConfig.color 
                      : 'rgba(255, 255, 255, 0.3)',
                  }}
                />
              ))
            )}
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 text-xs text-white/60 font-mono">
            <span>{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: sourceConfig.color
                }}
              />
            </div>
            <span>{track.duration ? formatTime(track.duration) : '--:--'}</span>
          </div>
        </div>

        {/* Play/Pause */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
          style={{ 
            backgroundColor: `${sourceConfig.color}20`,
            boxShadow: isPlaying ? `0 0 20px ${sourceConfig.color}40` : 'none'
          }}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" style={{ color: sourceConfig.color }} />
          ) : (
            <Play className="w-6 h-6 ml-0.5" style={{ color: sourceConfig.color }} />
          )}
        </button>
      </div>

      {/* Transcript Toggle */}
      {track.transcript && (
        <button
          onClick={onToggleTranscript}
          className="mt-3 text-xs text-white/60 hover:text-white transition-colors"
        >
          Show transcript
        </button>
      )}
    </div>
  );
}

// ============================================================================
// VARIANT: FULL FROST PLAYER (Modal/Expanded)
// ============================================================================

function FullFrostPlayer({ 
  track, 
  sourceConfig, 
  isPlaying,
  currentTime,
  volume,
  muted,
  showTranscript,
  djName,
  djImage,
  onPlay, 
  onPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onCollapse,
  onShare,
  onAddToQueue,
  onSave,
  onToggleTranscript,
  formatTime,
  progress
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={onCollapse}
    >
      <div
        className="rounded-3xl p-8 max-w-lg w-full"
        style={frostedGlassStyles}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span 
            className="text-sm font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg"
            style={{ 
              color: sourceConfig.color,
              backgroundColor: `${sourceConfig.color}20`
            }}
          >
            {sourceConfig.label}
          </span>

          <button
            onClick={onCollapse}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Minimize2 className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Cover Art */}
        <div 
          className="w-60 h-60 mx-auto rounded-2xl bg-white/5 bg-cover bg-center mb-6"
          style={{ backgroundImage: track.coverArt ? `url(${track.coverArt})` : undefined }}
        >
          {!track.coverArt && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 text-white/20">
                {sourceConfig.icon}
              </div>
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-white mb-2">
            {track.title}
          </h2>
          {track.artist && (
            <p className="text-white/60 text-lg">
              {track.artist}
            </p>
          )}
          {djName && (
            <div className="flex items-center justify-center gap-2 mt-3">
              {djImage && (
                <img src={djImage} className="w-6 h-6 rounded-full" alt={djName} />
              )}
              <p className="text-white/80 text-sm">with {djName}</p>
            </div>
          )}
        </div>

        {/* Waveform */}
        <div className="flex items-center gap-1 h-16 mb-4">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-full transition-colors cursor-pointer"
              style={{
                height: `${Math.random() * 100}%`,
                backgroundColor: i < (progress / 100 * 60) 
                  ? sourceConfig.color 
                  : 'rgba(255, 255, 255, 0.2)',
              }}
              onClick={() => onSeek && onSeek((i / 60) * (track.duration || 0))}
            />
          ))}
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between text-sm text-white/60 font-mono mb-6">
          <span>{formatTime(currentTime)}</span>
          <span>{track.duration ? formatTime(track.duration) : '--:--'}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={onToggleMute}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            {muted ? (
              <VolumeX className="w-5 h-5 text-white/60" />
            ) : (
              <Volume2 className="w-5 h-5 text-white/60" />
            )}
          </button>

          <button
            onClick={isPlaying ? onPause : onPlay}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
            style={{ 
              backgroundColor: `${sourceConfig.color}`,
              boxShadow: `0 0 30px ${sourceConfig.color}60`
            }}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>

          <button
            onClick={onShare}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Share2 className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          {track.source === 'records' && (
            <>
              <button
                onClick={onAddToQueue}
                className="px-4 py-2 rounded-lg bg-white/5 text-white/80 text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Queue
              </button>
              <button
                onClick={onSave}
                className="px-4 py-2 rounded-lg bg-white/5 text-white/80 text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Save
              </button>
            </>
          )}

          {track.transcript && (
            <button
              onClick={onToggleTranscript}
              className="px-4 py-2 rounded-lg bg-white/5 text-white/80 text-sm hover:bg-white/10 transition-colors"
            >
              {showTranscript ? 'Hide' : 'Show'} Transcript
            </button>
          )}
        </div>

        {/* Transcript */}
        <AnimatePresence>
          {showTranscript && track.transcript && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 rounded-lg bg-white/5 max-h-48 overflow-y-auto"
            >
              <p className="text-white/80 text-sm leading-relaxed">
                {track.transcript}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================================================
// VARIANT: LIVE RADIO FROST
// ============================================================================

function LiveRadioFrost({ 
  track, 
  sourceConfig, 
  isPlaying,
  listenerCount,
  djName,
  djImage,
  sponsorLabel,
  onPlay, 
  onPause 
}: any) {
  return (
    <div
      className="rounded-2xl p-6 w-full"
      style={{
        ...frostedGlassStyles,
        border: `2px solid ${sourceConfig.color}40`,
        boxShadow: `inset 0 0 40px ${sourceConfig.color}20, 0 0 40px ${sourceConfig.color}20`,
      }}
    >
      {/* Live Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-500 text-sm font-bold uppercase tracking-wide">
            LIVE NOW
          </span>
        </div>

        {listenerCount && (
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Users className="w-4 h-4" />
            <span>{listenerCount.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="flex items-start gap-4">
        {/* DJ Image or Cover */}
        <div className="relative">
          <div 
            className="w-24 h-24 rounded-xl bg-white/5 bg-cover bg-center"
            style={{ backgroundImage: (djImage || track.coverArt) ? `url(${djImage || track.coverArt})` : undefined }}
          >
            {!djImage && !track.coverArt && (
              <div className="w-full h-full flex items-center justify-center">
                <RadioIcon className="w-8 h-8 text-white/40" />
              </div>
            )}
          </div>

          {/* Animated ring for live */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2"
              style={{ borderColor: sourceConfig.color }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white text-xl font-black mb-1">
            {track.title}
          </h3>

          {djName && (
            <p className="text-white/80 text-sm mb-3">
              with {djName}
            </p>
          )}

          {/* Live Waveform */}
          <div className="flex items-center gap-1 h-12 mb-3">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-full"
                style={{ backgroundColor: `${sourceConfig.color}80` }}
                animate={isPlaying ? {
                  height: [8, Math.random() * 40 + 8, 8],
                } : {
                  height: 8
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>

          {/* Sponsor Label */}
          {sponsorLabel && (
            <p className="text-yellow-500 text-xs mb-2">
              Sponsored by {sponsorLabel}
            </p>
          )}
        </div>

        {/* Play/Pause */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all flex-shrink-0"
          style={{ 
            backgroundColor: sourceConfig.color,
            boxShadow: `0 0 30px ${sourceConfig.color}60`
          }}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 text-white" />
          ) : (
            <Play className="w-7 h-7 text-white ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// VARIANT: TRANSCRIPT PANEL
// ============================================================================

function TranscriptPanel({ track, isPlaying, currentTime }: any) {
  const [autoScroll, setAutoScroll] = useState(true);

  return (
    <div
      className="rounded-2xl p-6 w-full max-h-96 overflow-y-auto"
      style={frostedGlassStyles}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold">Transcript</h3>
        
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className={`text-xs px-3 py-1.5 rounded ${
            autoScroll 
              ? 'bg-white/10 text-white' 
              : 'text-white/60'
          }`}
        >
          Auto-scroll {autoScroll ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="space-y-4">
        {track.transcript ? (
          <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
            {track.transcript}
          </p>
        ) : (
          <p className="text-white/40 text-sm italic">
            Transcribing live...
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EXPORT
// ============================================================================

export default FrostedAudioCard;
