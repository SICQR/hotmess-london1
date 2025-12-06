/**
 * HOTMESS LONDON — AUDIO PLAYER HOOK
 * 
 * Universal audio player hook for all audio sources:
 * - RadioKing HLS streaming
 * - Records MP3/FLAC
 * - Beacons (short audio)
 * - Shop promos
 * - Community voice posts
 * - Bot voice messages
 * 
 * Provides:
 * - play(), pause(), seek()
 * - volume control
 * - progress tracking
 * - waveform data
 * - transcript integration
 * - queue management
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  coverArt?: string;
  audioUrl?: string;
  source: 'radio' | 'records' | 'podcast' | 'beacon' | 'care' | 'shop' | 'community' | 'bot';
  duration?: number;
  isLive?: boolean;
  transcript?: string;
  waveformData?: number[];
}

export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  loading: boolean;
  error: string | null;
  queue: AudioTrack[];
}

// ============================================================================
// HOOK
// ============================================================================

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    loading: false,
    error: null,
    queue: [],
  });

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleDurationChange = () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
      // Auto-play next in queue
      playNext();
    };

    const handleLoadStart = () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
    };

    const handleCanPlay = () => {
      setState(prev => ({ ...prev, loading: false }));
    };

    const handleError = (e: ErrorEvent) => {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        isPlaying: false,
        error: 'Failed to load audio' 
      }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError as any);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError as any);
    };
  }, []);

  // ============================================================================
  // CONTROLS
  // ============================================================================

  const play = useCallback(async (track?: AudioTrack) => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      // If new track, load it
      if (track && track.id !== state.currentTrack?.id) {
        audio.src = track.audioUrl || '';
        setState(prev => ({ 
          ...prev, 
          currentTrack: track,
          isPlaying: false,
          currentTime: 0,
          loading: true,
        }));
      }

      // Play
      await audio.play();
      setState(prev => ({ ...prev, isPlaying: true, error: null }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isPlaying: false,
        loading: false,
        error: err.message || 'Failed to play' 
      }));
    }
  }, [state.currentTrack]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = time;
    setState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    audio.volume = clampedVolume;
    setState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setState(prev => ({ ...prev, muted: audio.muted }));
  }, []);

  // ============================================================================
  // QUEUE MANAGEMENT
  // ============================================================================

  const addToQueue = useCallback((track: AudioTrack) => {
    setState(prev => ({ 
      ...prev, 
      queue: [...prev.queue, track] 
    }));
  }, []);

  const removeFromQueue = useCallback((trackId: string) => {
    setState(prev => ({ 
      ...prev, 
      queue: prev.queue.filter(t => t.id !== trackId) 
    }));
  }, []);

  const clearQueue = useCallback(() => {
    setState(prev => ({ ...prev, queue: [] }));
  }, []);

  const playNext = useCallback(() => {
    if (state.queue.length === 0) return;

    const nextTrack = state.queue[0];
    setState(prev => ({ 
      ...prev, 
      queue: prev.queue.slice(1) 
    }));
    play(nextTrack);
  }, [state.queue, play]);

  // ============================================================================
  // WAVEFORM GENERATION
  // ============================================================================

  const generateWaveform = useCallback(async (audioUrl: string): Promise<number[]> => {
    // In production, use Web Audio API to analyze audio and generate waveform
    // For now, return mock data
    return Array.from({ length: 100 }, () => Math.random());
  }, []);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State
    ...state,

    // Controls
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,

    // Queue
    addToQueue,
    removeFromQueue,
    clearQueue,
    playNext,

    // Utilities
    generateWaveform,

    // Computed
    progress: state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0,
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export default useAudioPlayer;
