/**
 * NIGHT PULSE REALTIME HOOK
 * Subscribes to real-time Night Pulse events via Supabase
 * Updates globe markers incrementally when new activity occurs
 */

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '../utils/supabase/client';
import type { NightPulseCity, NightPulseEvent } from '../types/night-pulse';

const supabase = createClient();

function getOfflineFallbackCities(now = new Date()): NightPulseCity[] {
  const iso = now.toISOString();
  return [
    {
      city_id: 'offline-london',
      city_name: 'London',
      country_code: 'GB',
      latitude: 51.5074,
      longitude: -0.1278,
      active_beacons: null,
      scans_last_hour: 22,
      heat_intensity: 64,
      last_activity_at: iso,
      refreshed_at: iso,
    },
    {
      city_id: 'offline-berlin',
      city_name: 'Berlin',
      country_code: 'DE',
      latitude: 52.52,
      longitude: 13.405,
      active_beacons: null,
      scans_last_hour: 17,
      heat_intensity: 52,
      last_activity_at: iso,
      refreshed_at: iso,
    },
    {
      city_id: 'offline-paris',
      city_name: 'Paris',
      country_code: 'FR',
      latitude: 48.8566,
      longitude: 2.3522,
      active_beacons: null,
      scans_last_hour: 14,
      heat_intensity: 45,
      last_activity_at: iso,
      refreshed_at: iso,
    },
    {
      city_id: 'offline-nyc',
      city_name: 'New York',
      country_code: 'US',
      latitude: 40.7128,
      longitude: -74.006,
      active_beacons: null,
      scans_last_hour: 19,
      heat_intensity: 58,
      last_activity_at: iso,
      refreshed_at: iso,
    },
    {
      city_id: 'offline-sao-paulo',
      city_name: 'São Paulo',
      country_code: 'BR',
      latitude: -23.5505,
      longitude: -46.6333,
      active_beacons: null,
      scans_last_hour: 11,
      heat_intensity: 36,
      last_activity_at: iso,
      refreshed_at: iso,
    },
  ];
}

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
        // Provide a visible/interactive fallback so the globe isn't empty.
        if (cities.length === 0) {
          const now = new Date();
          setCities(getOfflineFallbackCities(now));
          setLastUpdate(now);
        }
        setLoading(false);
        return;
      }

      const resolved = data ?? [];
      console.log('✅ Night Pulse initial data loaded:', resolved.length, 'cities');
      setCities(resolved);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err: any) {
      console.error('❌ Exception loading Night Pulse data:', err);
      setError(err?.message || 'Night Pulse fetch failed');

      // Network/DNS/CORS issues should still render a useful globe.
      if (cities.length === 0) {
        const now = new Date();
        setCities(getOfflineFallbackCities(now));
        setLastUpdate(now);
      }
      setLoading(false);
    }
  }, [cities.length]);

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
          if (cities.length === 0) {
            const now = new Date();
            setCities(getOfflineFallbackCities(now));
            setLastUpdate(now);
          }
          setLoading(false);
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
