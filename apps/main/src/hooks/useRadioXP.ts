/**
 * HOTMESS - Radio Listening XP Hook
 * Tracks radio listen time and awards XP
 */

import { useEffect, useRef, useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface UseRadioXPOptions {
  enabled?: boolean;
  onXPAwarded?: (xp: number) => void;
  initialXP?: number;
  extendedXP?: number;
  extendedThresholdMinutes?: number;
}

export function useRadioXP(options: UseRadioXPOptions = {}) {
  const {
    enabled = true,
    onXPAwarded,
    initialXP = 10,
    extendedXP = 20,
    extendedThresholdMinutes = 10,
  } = options;
  const { user } = useAuth();
  const [listenDuration, setListenDuration] = useState(0); // seconds
  const [xpAwarded, setXpAwarded] = useState(0);
  const [lastMilestone, setLastMilestone] = useState(0);
  const [hasAwardedInitial, setHasAwardedInitial] = useState(false);
  const [hasAwardedExtended, setHasAwardedExtended] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // XP milestones (in seconds)
  const XP_MILESTONES = [
    { duration: 0, xp: initialXP, label: 'Started listening' },
    { duration: extendedThresholdMinutes * 60, xp: extendedXP, label: `${extendedThresholdMinutes} minutes listened` },
    { duration: 1800, xp: 50, label: '30 minutes listened' },
  ];

  const trackListen = async (durationSeconds: number) => {
    if (!user) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/radio/track-listen`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            durationSeconds,
          }),
        }
      );

      const data = await response.json();
      
      if (data.success && data.xp) {
        setXpAwarded(prev => prev + data.xp);
        onXPAwarded?.(data.xp);

        // Keep compatibility flags for UI
        if (durationSeconds === 0) setHasAwardedInitial(true);
        if (durationSeconds >= extendedThresholdMinutes * 60) setHasAwardedExtended(true);

        toast.success(`+${data.xp} XP for listening to RAW CONVICT RADIO`, {
          icon: '🎧',
        });
      }
    } catch (err) {
      console.error('Failed to track radio listen:', err);
    }
  };

  const startTracking = () => {
    if (!enabled || !user) return;

    startTimeRef.current = Date.now();
    
    // Award initial XP immediately
    trackListen(0);

    // Update duration every second
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setListenDuration(duration);

        // Check for milestone XP awards
        const milestone = XP_MILESTONES.find(
          m => m.duration > lastMilestone && duration >= m.duration
        );

        if (milestone) {
          setLastMilestone(milestone.duration);
          trackListen(duration);
        }
      }
    }, 1000);
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Final tracking on stop
    if (startTimeRef.current && listenDuration > 0) {
      trackListen(listenDuration);
    }

    startTimeRef.current = null;
  };

  const resetTracking = () => {
    stopTracking();
    setListenDuration(0);
    setXpAwarded(0);
    setLastMilestone(0);
    setHasAwardedInitial(false);
    setHasAwardedExtended(false);
  };

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  return {
    listenDuration,
    listeningMinutes: Math.floor(listenDuration / 60),
    xpAwarded,
    hasAwardedInitial,
    hasAwardedExtended,
    isTracking: !!startTimeRef.current,
    startTracking,
    stopTracking,
    resetTracking,
  };
}
