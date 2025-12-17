/**
 * NIGHT PULSE REALTIME HOOK
 * Subscribes to real-time Night Pulse events via Supabase
 * Updates globe markers incrementally when new activity occurs
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase/client';
import type { NightPulseCity, NightPulseEvent } from '../types/night-pulse';

export function useNightPulseRealtime() {
  const [cities, setCities] = useState<NightPulseCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Load initial data from materialized view
  const loadInitialData = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('night_pulse_realtime')
        .select('*')
        .order('heat_intensity', { ascending: false });

      if (fetchError) {
        console.error('❌ Error loading Night Pulse data:', fetchError);
        setError(fetchError.message);
        return;
      }

      if (data) {
        console.log('✅ Night Pulse initial data loaded:', data.length, 'cities');
        setCities(data);
        setLastUpdate(new Date());
        setLoading(false);
      }
    } catch (err: any) {
      console.error('❌ Exception loading Night Pulse data:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Calculate heat intensity from scan count
  const calculateHeat = useCallback((scans: number): number => {
    return Math.min(100, scans * 10);
  }, []);

  // Handle real-time event updates
  const handleRealtimeUpdate = useCallback((payload: any) => {
    const event: NightPulseEvent = payload.new;
    
    console.log('🔴 Night Pulse real-time event:', event);

    setCities(prev => {
      return prev.map(city => {
        if (city.city_id !== event.city_id) return city;

        // Calculate new values
        const newBeacons = Math.max(0, (city.active_beacons || 0) + event.delta_beacons);
        const newScans = Math.max(0, city.scans_last_hour + event.delta_scans);
        const newHeat = calculateHeat(newScans);

        // Apply privacy filter: hide beacon count if <5
        const displayBeacons = newBeacons < 5 ? null : newBeacons;

        return {
          ...city,
          active_beacons: displayBeacons,
          scans_last_hour: newScans,
          heat_intensity: newHeat,
          last_activity_at: event.created_at,
        };
      });
    });

    setLastUpdate(new Date());
  }, [calculateHeat]);

  // Set up subscriptions and refresh
  useEffect(() => {
    // 1. Initial load
    loadInitialData();

    // 2. Subscribe to real-time events
    const subscription = supabase
      .channel('night_pulse_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'night_pulse_events'
        },
        handleRealtimeUpdate
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Night Pulse real-time subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Night Pulse subscription error');
          setError('Real-time connection failed');
        }
      });

    // 3. Refresh full view every 60 seconds (fallback)
    const interval = setInterval(() => {
      console.log('🔄 Refreshing Night Pulse data (60s interval)');
      loadInitialData();
    }, 60000);

    // Cleanup
    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [loadInitialData, handleRealtimeUpdate]);

  return {
    cities,
    loading,
    error,
    lastUpdate,
    refresh: loadInitialData,
  };
}
