/**
 * HOTMESS HOOKUP BEACONS HOOK
 * React hook for hookup beacon operations
 */

import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type {
  HookupBeacon,
  HookupBeaconCreateRequest,
  HookupBeaconCreateResponse,
  HookupScanRequest,
  HookupScanResponse,
  HookupBeaconStats,
  HookupNearbyResponse,
} from '../types/hookup';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/hookup`;

export function useHookupBeacons() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    return session?.access_token || publicAnonKey;
  }, [session]);

  /**
   * Create a new hookup beacon
   */
  const createBeacon = useCallback(async (
    request: HookupBeaconCreateRequest
  ): Promise<HookupBeaconCreateResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/beacon/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create beacon');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error('Error creating hookup beacon:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  /**
   * Get beacon details
   */
  const getBeacon = useCallback(async (
    beaconId: string
  ): Promise<HookupBeacon | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/beacon/${beaconId}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch beacon');
      }

      const data = await response.json();
      return data.beacon;
    } catch (err: any) {
      console.error('Error fetching beacon:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  /**
   * Scan a hookup beacon
   */
  const scanBeacon = useCallback(async (
    request: HookupScanRequest
  ): Promise<HookupScanResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Special handling for membership errors
        if (response.status === 403 && errorData.required_tier) {
          throw new Error(
            `This hookup zone requires ${errorData.required_tier.toUpperCase()} membership. ` +
            `Your tier: ${errorData.current_tier.toUpperCase()}`
          );
        }
        
        throw new Error(errorData.error || 'Failed to scan beacon');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error('Error scanning beacon:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  /**
   * Get nearby hookup beacons (room-based only)
   */
  const getNearbyBeacons = useCallback(async (params?: {
    city?: string;
    lat?: number;
    lng?: number;
    radius?: number;
  }): Promise<HookupNearbyResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (params?.city) queryParams.set('city', params.city);
      if (params?.lat) queryParams.set('lat', params.lat.toString());
      if (params?.lng) queryParams.set('lng', params.lng.toString());
      if (params?.radius) queryParams.set('radius', params.radius.toString());

      const url = `${API_BASE}/nearby${queryParams.toString() ? `?${queryParams}` : ''}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch nearby beacons');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error('Error fetching nearby beacons:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  /**
   * Get user's created beacons
   */
  const getMyBeacons = useCallback(async (): Promise<HookupBeacon[] | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/my-beacons`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch beacons');
      }

      const data = await response.json();
      return data.beacons;
    } catch (err: any) {
      console.error('Error fetching my beacons:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  /**
   * Deactivate a beacon
   */
  const deleteBeacon = useCallback(async (
    beaconId: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/beacon/${beaconId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete beacon');
      }

      return true;
    } catch (err: any) {
      console.error('Error deleting beacon:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  /**
   * Get beacon analytics (owner only)
   */
  const getBeaconStats = useCallback(async (
    beaconId: string
  ): Promise<HookupBeaconStats | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/stats/${beaconId}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch stats');
      }

      const data = await response.json();
      return data.stats;
    } catch (err: any) {
      console.error('Error fetching beacon stats:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  return {
    loading,
    error,
    createBeacon,
    getBeacon,
    scanBeacon,
    getNearbyBeacons,
    getMyBeacons,
    deleteBeacon,
    getBeaconStats,
  };
}

/**
 * Helper hook for checking hookup membership access
 */
export function useHookupMembershipAccess() {
  const { user } = useAuth();
  const [membershipTier, setMembershipTier] = useState<'free' | 'pro' | 'elite'>('free');

  // TODO: Fetch actual membership tier from membership API
  // For now, assumes free tier

  const canCreateRoomBeacon = true; // All tiers
  const canCreate1to1Beacon = membershipTier !== 'free';
  const canAccessAnalytics = membershipTier === 'pro' || membershipTier === 'elite';
  const hasAdvancedControls = membershipTier === 'elite';

  return {
    membershipTier,
    canCreateRoomBeacon,
    canCreate1to1Beacon,
    canAccessAnalytics,
    hasAdvancedControls,
  };
}
