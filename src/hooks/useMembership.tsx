// HOTMESS LONDON - useMembership Hook
// Manages membership tier, benefits, and access control

import { useState, useEffect } from 'react';
import { UserMembership, MembershipTier, MembershipAccessCheck } from '../types/membership';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/membership`;

export function useMembership(authToken?: string) {
  const [membership, setMembership] = useState<UserMembership | null>(null);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [canUpgradeToPro, setCanUpgradeToPro] = useState(false);
  const [canUpgradeToElite, setCanUpgradeToElite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authToken) {
      fetchMembership();
    }
  }, [authToken]);

  const fetchMembership = async () => {
    if (!authToken) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch membership');
      }

      const data = await response.json();
      setMembership(data.membership);
      setCurrentLevel(data.current_level);
      setCanUpgradeToPro(data.can_upgrade_to_pro);
      setCanUpgradeToElite(data.can_upgrade_to_elite);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching membership:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchMembership();
  };

  return {
    membership,
    currentLevel,
    canUpgradeToPro,
    canUpgradeToElite,
    loading,
    error,
    refetch,
  };
}

export function useMembershipActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAccess = async (
    module: string,
    feature: string,
    authToken: string
  ): Promise<MembershipAccessCheck | null> => {
    try {
      const response = await fetch(`${API_URL}/check-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ module, feature }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check access');
      }

      const data = await response.json();
      return {
        user_id: '',
        tier: data.user_tier,
        feature,
        module,
        has_access: data.has_access,
        required_tier: data.required_tier,
        upgrade_cta: data.upgrade_cta,
      };
    } catch (err: any) {
      console.error('Error checking access:', err);
      return null;
    }
  };

  const createUpgradeIntent = async (
    toTier: MembershipTier,
    billingCycle: 'monthly' | 'yearly',
    authToken: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/upgrade-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ to_tier: toTier, billing_cycle: billingCycle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create upgrade intent');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error('Error creating upgrade intent:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const completeUpgrade = async (
    toTier: MembershipTier,
    billingCycle: 'monthly' | 'yearly',
    stripeSubscriptionId: string,
    stripeCustomerId: string,
    authToken: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/complete-upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          to_tier: toTier,
          billing_cycle: billingCycle,
          stripe_subscription_id: stripeSubscriptionId,
          stripe_customer_id: stripeCustomerId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete upgrade');
      }

      return true;
    } catch (err: any) {
      console.error('Error completing upgrade:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (
    immediate: boolean,
    authToken: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ immediate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }

      return true;
    } catch (err: any) {
      console.error('Error cancelling subscription:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    checkAccess,
    createUpgradeIntent,
    completeUpgrade,
    cancelSubscription,
    loading,
    error,
  };
}

// Helper hook to quickly check if user has access to a feature
export function useHasAccess(module: string, feature: string, authToken?: string) {
  const [hasAccess, setHasAccess] = useState(true); // Default to true for free features
  const [loading, setLoading] = useState(false);
  const { checkAccess } = useMembershipActions();

  useEffect(() => {
    if (authToken && module && feature) {
      checkFeatureAccess();
    }
  }, [module, feature, authToken]);

  const checkFeatureAccess = async () => {
    if (!authToken) return;

    setLoading(true);
    const result = await checkAccess(module, feature, authToken);
    if (result) {
      setHasAccess(result.has_access);
    }
    setLoading(false);
  };

  return { hasAccess, loading };
}

// Helper to get tier display info
export function getTierInfo(tier: MembershipTier) {
  const tiers = {
    free: {
      name: 'Free',
      color: 'text-zinc-400',
      bgColor: 'bg-zinc-800',
      borderColor: 'border-zinc-700',
      icon: '🆓',
    },
    pro: {
      name: 'Pro',
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/50',
      borderColor: 'border-blue-700',
      icon: '⭐',
    },
    elite: {
      name: 'Elite',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-950/50',
      borderColor: 'border-yellow-700',
      icon: '👑',
    },
  };

  return tiers[tier];
}
