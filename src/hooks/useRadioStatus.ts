/**
 * HOTMESS - Live Radio Status Hook
 * Fetches RadioKing listener data every 15 seconds
 */

import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface CurrentTrack {
  title: string;
  artist: string;
  artwork: string;
  startedAt: string;
  duration: number;
}

export interface RadioStatus {
  listeners: number;
  uniqueListeners: number;
  peakListeners: number;
  currentTrack: CurrentTrack;
  isLive: boolean;
  timestamp: string;
  mock?: boolean;
  error?: string;
}

interface UseRadioStatusOptions {
  refreshInterval?: number; // milliseconds (default: 15000)
  enabled?: boolean;
}

export function useRadioStatus(options: UseRadioStatusOptions = {}) {
  const { refreshInterval = 15000, enabled = true } = options;
  const [data, setData] = useState<RadioStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/radio/listeners`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch radio status');
      }

      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      console.error('Radio status fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchStatus();

    // Set up polling interval
    const interval = setInterval(fetchStatus, refreshInterval);

    return () => clearInterval(interval);
  }, [enabled, refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchStatus,
  };
}
