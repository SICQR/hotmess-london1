/**
 * Client-side hook for fetching user profile, XP, and stats
 */

import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface UserXPStats {
  userId: string;
  totalXP: number;
  availableXP: number;
  membershipTier: string;
  currentMultiplier: number;
  level: number;
  nextLevelXP: number;
  rewardsRedeemed: number;
  streakDays: number;
  lastActivityAt: string;
  rank?: number;
  cityRank?: number;
}

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  role: string;
  stats: {
    level: number;
    xp: number;
    streak: number;
    beaconsScanned: number;
    eventsAttended: number;
  };
  preferences: {
    notifications: boolean;
    emailMarketing: boolean;
    locationSharing: boolean;
  };
  social?: {
    instagram?: string;
    twitter?: string;
    telegram?: string;
  };
}

interface XPHistoryEntry {
  id: string;
  userId: string;
  amount: number;
  action: string;
  timestamp: string;
  metadata?: any;
}

export function useUserXP(accessToken?: string) {
  const [data, setData] = useState<UserXPStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchXP() {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/xp/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch XP: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result.stats);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching user XP:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchXP();
  }, [accessToken]);

  return { data, loading, error };
}

export function useUserProfile(userId?: string, accessToken?: string) {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!userId || !accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result.profile);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching user profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId, accessToken]);

  return { data, loading, error };
}

export function useXPHistory(accessToken?: string, limit = 20) {
  const [data, setData] = useState<XPHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/xp/history?limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch XP history: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result.entries || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching XP history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [accessToken, limit]);

  return { data, loading, error };
}
