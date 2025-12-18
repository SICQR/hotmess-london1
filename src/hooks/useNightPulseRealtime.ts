/**
 * NIGHT PULSE REALTIME HOOK
 * Subscribes to real-time Night Pulse events via Supabase
 * Updates globe markers incrementally when new activity occurs
 */

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '../utils/supabase/client';
import { checkNightPulseSchema } from '../utils/db-health-check';
import type { NightPulseCity, NightPulseEvent } from '../types/night-pulse';

const supabase = createClient();

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
        
        // Check if it's a "relation does not exist" error
        if (fetchError.message.includes('does not exist') || 
            fetchError.message.includes('night_pulse_realtime')) {
          console.warn('⚠️ Materialized view not found, falling back to direct beacon aggregation');
          
          // Fallback: Aggregate from beacons table directly
          const { data: beacons, error: beaconError } = await supabase
            .from('beacons')
            .select('city, latitude, longitude, scan_count, active')
            .eq('active', true)
            .not('city', 'is', null)
            .not('latitude', 'is', null)
            .not('longitude', 'is', null);
          
          if (beaconError) {
            setError('Unable to load Night Pulse data. Please ensure beacons table has city and location data.');
            setLoading(false);
            return;
          }
          
          if (beacons && beacons.length > 0) {
            // Aggregate beacons by city
            const cityMap = new Map<string, NightPulseCity>();
            
            beacons.forEach((beacon) => {
              const cityId = beacon.city.toUpperCase();
              
              if (!cityMap.has(cityId)) {
                cityMap.set(cityId, {
                  city_id: cityId,
                  city_name: beacon.city,
                  country_code: 'Unknown', // TODO: Could add country lookup
                  latitude: beacon.latitude,
                  longitude: beacon.longitude,
                  active_beacons: 1,
                  scans_last_hour: beacon.scan_count || 0,
                  heat_intensity: Math.min(100, (beacon.scan_count || 0) * 10),
                  last_activity_at: new Date().toISOString(),
                  refreshed_at: new Date().toISOString(),
                });
              } else {
                const city = cityMap.get(cityId)!;
                city.active_beacons = (city.active_beacons || 0) + 1;
                city.scans_last_hour += beacon.scan_count || 0;
                city.heat_intensity = Math.min(100, city.scans_last_hour * 10);
              }
            });
            
            const aggregatedCities = Array.from(cityMap.values())
              .map(city => ({
                ...city,
                // Apply privacy filter: hide beacon count if <5
                active_beacons: (city.active_beacons || 0) < 5 ? null : city.active_beacons,
              }))
              .sort((a, b) => b.heat_intensity - a.heat_intensity);
            
            console.log('✅ Fallback: Aggregated', aggregatedCities.length, 'cities from beacons');
            setCities(aggregatedCities);
            setLastUpdate(new Date());
            setLoading(false);
            
            // Show warning to user
            setError('Using fallback data. For full real-time features, run database migration.');
            return;
          }
        }
        
        setError(fetchError.message);
        setLoading(false);
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
    // 0. Diagnostic health check
    const diagnose = async () => {
      const health = await checkNightPulseSchema();
      console.log('🏥 Night Pulse Schema Health:', health);
      
      if (!health.materialized_view) {
        console.warn('⚠️ Missing: night_pulse_realtime view - will use fallback');
      }
      if (!health.beacons_has_city) {
        console.error('❌ Missing: beacons.city column - globe will not work');
      }
    };
    
    diagnose();

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
