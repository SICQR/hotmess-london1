'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type LocationMode = 'off' | 'approximate' | 'precise';

interface LocationConsentState {
  mode: LocationMode;
  loading: boolean;
  granted: boolean; // true if approximate or precise
  needsConsent: boolean; // true if mode is 'off'
}

export function useLocationConsent() {
  const [state, setState] = useState<LocationConsentState>({
    mode: 'off',
    loading: true,
    granted: false,
    needsConsent: true
  });

  useEffect(() => {
    loadConsentMode();
  }, []);

  async function loadConsentMode() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setState({
          mode: 'off',
          loading: false,
          granted: false,
          needsConsent: true
        });
        return;
      }

      // Load from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('location_consent_mode')
        .eq('id', user.id)
        .single();

      const mode = (profile?.location_consent_mode || 'off') as LocationMode;

      setState({
        mode,
        loading: false,
        granted: mode !== 'off',
        needsConsent: mode === 'off'
      });
    } catch (error) {
      console.error('Load consent error:', error);
      setState({
        mode: 'off',
        loading: false,
        granted: false,
        needsConsent: true
      });
    }
  }

  const requestConsent = useCallback((feature: string) => {
    // Returns a promise that resolves when user grants/denies consent
    return new Promise<LocationMode>((resolve) => {
      // This will be handled by the LocationConsentModal in the UI
      // For now, just return current mode
      resolve(state.mode);
    });
  }, [state.mode]);

  const updateMode = useCallback(async (newMode: LocationMode) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Determine action based on mode change
      const action = newMode === 'off' ? 'revoked' : (state.mode === 'off' ? 'granted' : 'updated');

      // Update via NEW RPC function with enums
      const { error } = await supabase.rpc('set_location_consent', {
        p_user_id: user.id,
        p_action: action,
        p_metadata: {
          mode: newMode,
          previous_mode: state.mode,
          user_agent: navigator.userAgent,
          source: 'settings'
        }
      });

      if (error) throw error;

      setState({
        mode: newMode,
        loading: false,
        granted: newMode !== 'off',
        needsConsent: newMode === 'off'
      });

      return true;
    } catch (error: any) {
      console.error('Update consent error:', error);
      toast.error(error.message || 'Failed to update location consent');
      return false;
    }
  }, [state.mode]); // Added state.mode dependency

  const checkConsent = useCallback((): boolean => {
    return state.granted;
  }, [state.granted]);

  const getCoordinates = useCallback((): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
      if (!state.granted || state.mode === 'off') {
        resolve(null);
        return;
      }

      if (state.mode === 'approximate') {
        // Don't request GPS for approximate mode
        toast.info('Approximate location mode enabled. GPS not required.');
        resolve(null);
        return;
      }

      // Only request GPS if precise mode
      if (!navigator.geolocation) {
        toast.error('Geolocation not supported by browser');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Failed to get location. Check browser permissions.');
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000 // Cache for 1 minute
        }
      );
    });
  }, [state.granted, state.mode]);

  return {
    ...state,
    requestConsent,
    updateMode,
    checkConsent,
    getCoordinates,
    refresh: loadConsentMode
  };
}