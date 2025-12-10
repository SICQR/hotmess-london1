// HOTMESS LONDON - Radio Context
// Global state management for persistent radio player across navigation

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { getNowPlaying, getCurrentShow, getRadioStats, type RadioTrack, type RadioShow, type RadioStats } from '../lib/radioking-api';

interface RadioContextType {
  // Player state
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  isMinimized: boolean;
  isExpanded: boolean;
  
  // Live data
  nowPlaying: RadioTrack | null;
  currentShow: RadioShow | null;
  stats: RadioStats | null;
  
  // Audio ref
  audioRef: React.RefObject<HTMLAudioElement>;
  
  // Actions
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => Promise<void>;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  minimize: () => void;
  expand: () => void;
  close: () => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

interface RadioProviderProps {
  children: ReactNode;
  streamUrl?: string;
}

export function RadioProvider({ 
  children, 
  streamUrl = 'https://listen.radioking.com/radio/736103/stream/802454' 
}: RadioProviderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [nowPlaying, setNowPlaying] = useState<RadioTrack | null>(null);
  const [currentShow, setCurrentShow] = useState<RadioShow | null>(null);
  const [stats, setStats] = useState<RadioStats | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Fetch live data
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const [trackData, showData, statsData] = await Promise.all([
          getNowPlaying(),
          getCurrentShow(),
          getRadioStats()
        ]);
        
        setNowPlaying(trackData);
        setCurrentShow(showData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching radio data:', error);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, []);
  
  // Initialize audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);
  
  const play = async () => {
    if (!audioRef.current) return;
    
    setIsLoading(true);
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };
  
  const togglePlay = async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  };
  
  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };
  
  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };
  
  const minimize = () => {
    setIsMinimized(true);
    setIsExpanded(false);
  };
  
  const expand = () => {
    setIsMinimized(false);
    setIsExpanded(true);
  };
  
  const close = () => {
    pause();
    setIsMinimized(true);
    setIsExpanded(false);
  };
  
  const value: RadioContextType = {
    isPlaying,
    isLoading,
    volume,
    isMuted,
    isMinimized,
    isExpanded,
    nowPlaying,
    currentShow,
    stats,
    audioRef,
    play,
    pause,
    togglePlay,
    setVolume,
    toggleMute,
    minimize,
    expand,
    close
  };
  
  return (
    <RadioContext.Provider value={value}>
      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        src={streamUrl} 
        preload="none"
        style={{ display: 'none' }}
      />
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadio must be used within RadioProvider');
  }
  return context;
}
