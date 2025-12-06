/**
 * XP API CLIENT
 * Frontend API calls for XP system
 */

import { projectId, publicAnonKey } from '../../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/v2`;

/**
 * Get user's XP profile
 */
export async function getXPProfile(accessToken: string) {
  const response = await fetch(`${API_BASE}/xp/profile`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch XP profile');
  }

  return response.json();
}

/**
 * Get XP transaction history
 */
export async function getXPHistory(accessToken: string, limit = 50) {
  const response = await fetch(`${API_BASE}/xp/history?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch XP history');
  }

  return response.json();
}

/**
 * Get leaderboard
 */
export async function getLeaderboard(params?: { limit?: number; city?: string }) {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.city) queryParams.append('city', params.city);

  const response = await fetch(`${API_BASE}/xp/leaderboard?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }

  return response.json();
}

/**
 * Get available rewards
 */
export async function getRewards() {
  const response = await fetch(`${API_BASE}/xp/rewards`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch rewards');
  }

  return response.json();
}

/**
 * Redeem a reward
 */
export async function redeemReward(rewardId: string, accessToken: string) {
  const response = await fetch(`${API_BASE}/xp/rewards/${rewardId}/redeem`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to redeem reward');
  }

  return response.json();
}

/**
 * Get available quests with progress
 */
export async function getQuests(accessToken: string) {
  const response = await fetch(`${API_BASE}/xp/quests`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch quests');
  }

  return response.json();
}

/**
 * Award XP (internal use - requires auth)
 */
export async function awardXP(
  amount: number,
  source: string,
  sourceId: string | undefined,
  metadata: any,
  accessToken: string
) {
  const response = await fetch(`${API_BASE}/xp/award`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      amount,
      source,
      sourceId,
      metadata,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to award XP');
  }

  return response.json();
}