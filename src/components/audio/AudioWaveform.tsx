/**
 * HOTMESS LONDON — AUDIO WAVEFORM COMPONENT
 * 
 * Visual waveform representation for audio tracks
 * Used in Frosted Audio Cards
 */

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

// ============================================================================
// TYPES
// ============================================================================

export interface AudioWaveformProps {
  /** Waveform data (0-1 normalized amplitudes) */
  data?: number[];
  
  /** Current progress (0-100) */
  progress?: number;
  
  /** Primary color */
  color?: string;
  
  /** Background color */
  backgroundColor?: string;
  
  /** Height in pixels */
  height?: number;
  
  /** Number of bars */
  bars?: number;
  
  /** Animated (for live audio) */
  animated?: boolean;
  
  /** Interactive (click to seek) */
  interactive?: boolean;
  
  /** Callback when clicked */
  onSeek?: (progress: number) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function AudioWaveform({
  data,
  progress = 0,
  color = '#FF003D',
  backgroundColor = 'rgba(255, 255, 255, 0.2)',
  height = 64,
  bars = 60,
  animated = false,
  interactive = false,
  onSeek,
}: AudioWaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate random waveform if no data provided
  const waveformData = data || Array.from({ length: bars }, () => Math.random());

  // Normalize to correct number of bars
  const normalizedData = waveformData.length === bars
    ? waveformData
    : resampleData(waveformData, bars);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !onSeek || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickProgress = (x / rect.width) * 100;
    onSeek(clickProgress);
  };

  return (
    <div
      ref={containerRef}
      className={`flex items-center gap-0.5 ${interactive ? 'cursor-pointer' : ''}`}
      style={{ height: `${height}px` }}
      onClick={handleClick}
    >
      {normalizedData.map((amplitude, i) => {
        const barProgress = (i / bars) * 100;
        const isPlayed = barProgress < progress;

        return animated ? (
          <motion.div
            key={i}
            className="flex-1 rounded-full transition-colors"
            style={{
              backgroundColor: isPlayed ? color : backgroundColor,
            }}
            animate={{
              height: [`${amplitude * 20}%`, `${amplitude * 100}%`, `${amplitude * 20}%`],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.02,
            }}
          />
        ) : (
          <div
            key={i}
            className="flex-1 rounded-full transition-all"
            style={{
              height: `${amplitude * 100}%`,
              backgroundColor: isPlayed ? color : backgroundColor,
            }}
          />
        );
      })}
    </div>
  );
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Resample waveform data to target number of bars
 */
function resampleData(data: number[], targetLength: number): number[] {
  if (data.length === targetLength) return data;

  const result: number[] = [];
  const ratio = data.length / targetLength;

  for (let i = 0; i < targetLength; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.floor((i + 1) * ratio);
    
    // Average values in this range
    let sum = 0;
    for (let j = start; j < end; j++) {
      sum += data[j] || 0;
    }
    result.push(sum / (end - start));
  }

  return result;
}

// ============================================================================
// LIVE WAVEFORM (Animated Variant)
// ============================================================================

export interface LiveWaveformProps {
  color?: string;
  height?: number;
  bars?: number;
  isPlaying?: boolean;
}

export function LiveWaveform({
  color = '#FF003D',
  height = 48,
  bars = 30,
  isPlaying = false,
}: LiveWaveformProps) {
  return (
    <div className="flex items-center gap-1" style={{ height: `${height}px` }}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-full"
          style={{ backgroundColor: `${color}80` }}
          animate={isPlaying ? {
            height: [8, Math.random() * height * 0.8 + 8, 8],
          } : {
            height: 8
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.05,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// MINI WAVEFORM (For Mini Frost Bar)
// ============================================================================

export interface MiniWaveformProps {
  color?: string;
  isPlaying?: boolean;
}

export function MiniWaveform({
  color = '#FF003D',
  isPlaying = false,
}: MiniWaveformProps) {
  return (
    <div className="flex items-center gap-0.5 h-8">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{ backgroundColor: `${color}60` }}
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
  );
}

// ============================================================================
// EXPORT
// ============================================================================

export default AudioWaveform;
