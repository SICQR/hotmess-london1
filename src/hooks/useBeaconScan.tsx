// useBeaconScan.tsx
// Production-ready React hook for secure beacon scanning with XP rewards
// Uses the new secure backend API: redeem_scan → session_token → reveal

import { useState, useCallback } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/beacons`;

export interface BeaconRequirements {
  age18: boolean;
  consent: boolean;
  premium: boolean;
  gpsMode: 'off' | 'soft' | 'hard';
  gpsRadiusM: number;
}

export interface BeaconXP {
  scan: number;
  action: number;
}

export interface BeaconReveal {
  id: string;
  status: string;
  type: string;
  title: string;
  description: string | null;
  startsAt: string;
  expiresAt: string;
  durationHours: number;
  isSponsored: boolean;
  sponsorName: string | null;
  sponsorDisclosure: string | null;
  requirements: BeaconRequirements;
  xp: BeaconXP;
  actionRoute: string;
  actionConfig: Record<string, any>;
  city?: string | null;
  lat?: number | null;
  lng?: number | null;
}

export interface ScanResult {
  sessionToken: string;
  xpAwarded: number;
  beacon: BeaconReveal;
}

export interface SessionData {
  token: string;
  beacon: BeaconReveal;
}

interface UseBeaconScanResult {
  // State
  isScanning: boolean;
  isLoading: boolean;
  error: string | null;
  sessionToken: string | null;
  beacon: BeaconReveal | null;
  xpAwarded: number;

  // Actions
  redeemScan: (qrKey: string, source?: string) => Promise<ScanResult | null>;
  getSession: (token: string) => Promise<SessionData | null>;
  verifyProximity: (beaconId: string, lat: number, lng: number) => Promise<ProximityResult | null>;
  reset: () => void;
}

export interface ProximityResult {
  passed: boolean;
  distance: number | null;
  required: number;
  mode: 'off' | 'soft' | 'hard';
}

export function useBeaconScan(): UseBeaconScanResult {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [beacon, setBeacon] = useState<BeaconReveal | null>(null);
  const [xpAwarded, setXpAwarded] = useState(0);

  /**
   * Redeem a QR scan → logs scan → awards XP → returns session token + beacon reveal
   */
  const redeemScan = useCallback(async (
    qrKey: string,
    source: string = 'qr'
  ): Promise<ScanResult | null> => {
    setIsScanning(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ qrKey, source }),
        credentials: 'include', // Important: sends/receives guest_id cookie
      });

      const data = await response.json();

      if (!response.ok) {
        // Map error codes to user-friendly messages
        const errorMessages: Record<string, string> = {
          invalid_qr: 'Invalid or expired QR code',
          rate_limit: 'Too many scan attempts. Try again in 10 minutes.',
          beacon_inactive: 'This beacon is no longer active',
          beacon_scheduled: 'This beacon hasn\'t started yet',
          scan_failed: 'Failed to scan beacon. Please try again.',
        };

        const message = errorMessages[data.error] || data.message || 'Scan failed';
        setError(message);
        toast.error(message);
        return null;
      }

      // Success!
      const result: ScanResult = {
        sessionToken: data.sessionToken,
        xpAwarded: data.xpAwarded,
        beacon: data.beacon,
      };

      setSessionToken(result.sessionToken);
      setBeacon(result.beacon);
      setXpAwarded(result.xpAwarded);

      // Show XP toast
      if (result.xpAwarded > 0) {
        toast.success(`+${result.xpAwarded} XP earned!`, {
          description: 'Beacon scanned successfully',
        });
      } else {
        toast.info('Beacon revealed', {
          description: 'Already scanned today',
        });
      }

      return result;

    } catch (err: any) {
      console.error('Scan error:', err);
      const message = 'Network error. Please check your connection.';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsScanning(false);
    }
  }, []);

  /**
   * Get scan session data from token (for /s/:token reveal pages)
   */
  const getSession = useCallback(async (token: string): Promise<SessionData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/session/${token}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.error === 'session_expired'
          ? 'This session has expired. Scan again to unlock.'
          : data.message || 'Failed to load session';
        
        setError(message);
        
        if (data.error === 'session_expired') {
          toast.error(message);
        }
        
        return null;
      }

      setBeacon(data.beacon);
      setSessionToken(data.token);

      return data as SessionData;

    } catch (err: any) {
      console.error('Get session error:', err);
      const message = 'Network error. Please check your connection.';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Verify user is within GPS radius (for hard GPS requirement beacons)
   */
  const verifyProximity = useCallback(async (
    beaconId: string,
    lat: number,
    lng: number
  ): Promise<ProximityResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/verify-proximity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ beaconId, lat, lng }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.error === 'beacon_not_found'
          ? 'Beacon not found'
          : data.message || 'Failed to verify location';
        
        setError(message);
        toast.error(message);
        return null;
      }

      return data as ProximityResult;

    } catch (err: any) {
      console.error('Verify proximity error:', err);
      const message = 'Network error. Please check your connection.';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setIsScanning(false);
    setIsLoading(false);
    setError(null);
    setSessionToken(null);
    setBeacon(null);
    setXpAwarded(0);
  }, []);

  return {
    isScanning,
    isLoading,
    error,
    sessionToken,
    beacon,
    xpAwarded,
    redeemScan,
    getSession,
    verifyProximity,
    reset,
  };
}
