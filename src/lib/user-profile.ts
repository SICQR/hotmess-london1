/**
 * HOTMESS User Profile System
 * Real user profiles backed by Supabase Auth + KV storage
 */

import { createClient } from './supabase';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api`;

export interface UserProfile {
  id: string; // Supabase auth user ID
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  role: 'USER' | 'VENDOR' | 'ADMIN' | 'SUPER_ADMIN';
  createdAt: string;
  updatedAt: string;
  
  // Stats
  stats: {
    level: number;
    xp: number;
    streak: number;
    beaconsScanned: number;
    eventsAttended: number;
  };
  
  // Preferences
  preferences: {
    notifications: boolean;
    emailMarketing: boolean;
    locationSharing: boolean;
  };
  
  // Social
  social?: {
    instagram?: string;
    twitter?: string;
    telegram?: string;
  };
  
  // Metadata
  metadata?: Record<string, any>;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<{ user: any; profile: UserProfile | null } | null> {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      if (import.meta.env.DEV) {
        console.log('[UserProfile] No authenticated user');
      }
      return null;
    }

    // Fetch profile from backend
    const profile = await getUserProfile(user.id);
    
    return { user, profile };
  } catch (error) {
    console.error('[UserProfile] Error getting current user:', error);
    return null;
  }
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Profile doesn't exist, create it
        return await createUserProfile(userId, session.access_token);
      }
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error('[UserProfile] Error fetching user profile:', error);
    return null;
  }
}

/**
 * Create user profile
 */
async function createUserProfile(userId: string, accessToken: string): Promise<UserProfile> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('No user found');
  }

  const profile: UserProfile = {
    id: userId,
    email: user.email || '',
    displayName: user.user_metadata?.displayName || user.email?.split('@')[0] || 'User',
    role: 'USER',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stats: {
      level: 1,
      xp: 0,
      streak: 0,
      beaconsScanned: 0,
      eventsAttended: 0,
    },
    preferences: {
      notifications: true,
      emailMarketing: false,
      locationSharing: false,
    },
  };

  const response = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    throw new Error('Failed to create user profile');
  }

  const data = await response.json();
  return data.profile;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>
): Promise<UserProfile> {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE}/users/${session.user.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error('[UserProfile] Error updating user profile:', error);
    throw error;
  }
}

/**
 * Award XP to user
 */
export async function awardXP(amount: number, reason: string): Promise<{ newXP: number; newLevel: number; leveledUp: boolean }> {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE}/users/${session.user.id}/xp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, reason }),
    });

    if (!response.ok) {
      throw new Error('Failed to award XP');
    }

    const data = await response.json();
    return {
      newXP: data.newXP,
      newLevel: data.newLevel,
      leveledUp: data.leveledUp,
    };
  } catch (error) {
    console.error('[UserProfile] Error awarding XP:', error);
    throw error;
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

/**
 * Check if user has role
 */
export function hasRole(profile: UserProfile | null, role: UserProfile['role']): boolean {
  if (!profile) return false;
  
  // Role hierarchy
  const roleHierarchy: Record<UserProfile['role'], number> = {
    'USER': 1,
    'VENDOR': 2,
    'ADMIN': 3,
    'SUPER_ADMIN': 4,
  };
  
  return roleHierarchy[profile.role] >= roleHierarchy[role];
}

/**
 * Calculate level from XP
 */
export function calculateLevel(xp: number): number {
  // Simple formula: level = sqrt(xp / 100)
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * Calculate XP needed for next level
 */
export function xpForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}

/**
 * Get XP progress to next level (0-1)
 */
export function getXPProgress(currentXP: number, currentLevel: number): number {
  const currentLevelXP = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelXP = xpForNextLevel(currentLevel);
  const xpInCurrentLevel = currentXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  
  return Math.min(1, Math.max(0, xpInCurrentLevel / xpNeededForLevel));
}
