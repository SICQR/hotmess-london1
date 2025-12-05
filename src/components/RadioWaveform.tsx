/**
 * Animated radio waveform visualization
 * Pulses when radio is playing
 */

import { useEffect, useState } from 'react';

interface RadioWaveformProps {
  isPlaying: boolean;
  barCount?: number;
}

export function RadioWaveform({ isPlaying, barCount = 32 }: RadioWaveformProps) {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(barCount).fill(0.2));
      return;
    }

    // Animate bars
    const interval = setInterval(() => {
      setBars(Array.from({ length: barCount }, () => Math.random() * 0.8 + 0.2));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, barCount]);

  return (
    <div className="flex items-center justify-center gap-1 h-24">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-1 bg-gradient-to-t from-hot to-heat transition-all duration-100"
          style={{
            height: `${height * 100}%`,
            opacity: isPlaying ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}
