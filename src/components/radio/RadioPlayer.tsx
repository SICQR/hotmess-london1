// HOTMESS LONDON - Persistent Radio Player
// Global audio player with live stream, now playing, and controls

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Users, X, Maximize2 } from 'lucide-react';
import { getNowPlaying, getRadioStats, getCurrentShow, type RadioTrack, type RadioShow, type RadioStats } from '../../lib/radioking-api';
import { cn } from '../ui/utils';

interface RadioPlayerProps {
  streamUrl?: string;
  onClose?: () => void;
  expanded?: boolean;
}

export function RadioPlayer({ 
  streamUrl = 'https://listen.radioking.com/radio/736103/stream/802454',
  onClose,
  expanded: initialExpanded = false 
}: RadioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<RadioTrack | null>(null);
  const [currentShow, setCurrentShow] = useState<RadioShow | null>(null);
  const [stats, setStats] = useState<RadioStats | null>(null);
  const [expanded, setExpanded] = useState(initialExpanded);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch live data
  useEffect(() => {
    const fetchLiveData = async () => {
      const [trackData, showData, statsData] = await Promise.all([
        getNowPlaying(),
        getCurrentShow(),
        getRadioStats()
      ]);
      
      setNowPlaying(trackData);
      setCurrentShow(showData);
      setStats(statsData);
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, []);

  // Audio controls
  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };

  if (!expanded) {
    // Mini player
    return (
      <div className="fixed bottom-20 right-4 z-50 bg-black/95 border border-red-500/30 rounded-lg p-3 backdrop-blur-sm shadow-2xl shadow-red-500/20 w-80">
        <audio ref={audioRef} src={streamUrl} preload="none" />
        
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
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setExpanded(true)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
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
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500"
          />
        </div>
      </div>
    );
  }

  // Expanded player
  return (
    <div className="fixed inset-0 z-50 bg-black/98 backdrop-blur-lg flex items-center justify-center p-4">
      <audio ref={audioRef} src={streamUrl} preload="none" />
      
      <div className="w-full max-w-2xl">
        {/* Close button */}
        <button
          onClick={() => setExpanded(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

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
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-red-500/50"
          />
          
          <span className="text-sm text-zinc-500 w-12 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
