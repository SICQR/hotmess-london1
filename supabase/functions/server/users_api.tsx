/**
 * HOTMESS Users API
 * User profile management backed by KV storage
 */

import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import * as kv from './kv_store.tsx';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();
app.use('*', cors());

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  role: 'USER' | 'VENDOR' | 'ADMIN' | 'SUPER_ADMIN';
  createdAt: string;
  updatedAt: string;
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
  metadata?: Record<string, any>;
}

// Get KV key for user profile
function getUserProfileKey(userId: string): string {
  return `user:profile:${userId}`;
}

// Get KV key for user settings
function getUserSettingsKey(userId: string): string {
  return `user:settings:${userId}`;
}

/**
 * GET /users/:id - Get user profile
 */
app.get('/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('id');
    
    // Users can only view their own profile (unless admin)
    if (user.id !== userId) {
      // TODO: Add admin check
      return c.json({ error: 'Forbidden' }, 403);
    }

    const profile = await kv.get<UserProfile>(getUserProfileKey(userId));
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({
      success: true,
      profile
    });

  } catch (error: any) {
    console.error('❌ Error fetching user profile:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /users - Create user profile
 */
app.post('/', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    
    // Validate required fields
    if (!body.id || !body.email || !body.displayName) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Only allow creating own profile
    if (user.id !== body.id) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    // Check if profile already exists
    const existing = await kv.get<UserProfile>(getUserProfileKey(body.id));
    if (existing) {
      return c.json({ error: 'Profile already exists' }, 409);
    }

    const profile: UserProfile = {
      id: body.id,
      email: body.email,
      displayName: body.displayName,
      avatar: body.avatar,
      bio: body.bio,
      role: body.role || 'USER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: body.stats || {
        level: 1,
        xp: 0,
        streak: 0,
        beaconsScanned: 0,
        eventsAttended: 0,
      },
      preferences: body.preferences || {
        notifications: true,
        emailMarketing: false,
        locationSharing: false,
      },
      social: body.social,
      metadata: body.metadata,
    };

    await kv.set(getUserProfileKey(profile.id), profile);

    console.log('✅ Created user profile:', profile.id);

    return c.json({
      success: true,
      profile
    });

  } catch (error: any) {
    console.error('❌ Error creating user profile:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * PUT /users/:id - Update user profile
 */
app.put('/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('id');
    
    // Users can only update their own profile (unless admin)
    if (user.id !== userId) {
      // TODO: Add admin check
      return c.json({ error: 'Forbidden' }, 403);
    }

    const body = await c.req.json();
    const existing = await kv.get<UserProfile>(getUserProfileKey(userId));
    
    if (!existing) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    // Update profile (merge with existing)
    const updated: UserProfile = {
      ...existing,
      ...body,
      id: existing.id, // Prevent ID change
      createdAt: existing.createdAt, // Prevent createdAt change
      updatedAt: new Date().toISOString(),
      stats: {
        ...existing.stats,
        ...body.stats,
      },
      preferences: {
        ...existing.preferences,
        ...body.preferences,
      },
      social: {
        ...existing.social,
        ...body.social,
      },
    };

    await kv.set(getUserProfileKey(userId), updated);

    return c.json({
      success: true,
      profile: updated
    });

  } catch (error: any) {
    console.error('❌ Error updating user profile:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /users/:id/xp - Award XP to user
 */
app.post('/:id/xp', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('id');
    
    // Users can only award XP to themselves
    if (user.id !== userId) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const body = await c.req.json();
    const { amount, reason } = body;

    if (!amount || typeof amount !== 'number') {
      return c.json({ error: 'Invalid XP amount' }, 400);
    }

    const profile = await kv.get<UserProfile>(getUserProfileKey(userId));
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    // Calculate new XP and level
    const newXP = profile.stats.xp + amount;
    const oldLevel = profile.stats.level;
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > oldLevel;

    // Update profile
    profile.stats.xp = newXP;
    profile.stats.level = newLevel;
    profile.updatedAt = new Date().toISOString();

    await kv.set(getUserProfileKey(userId), profile);

    console.log(`✅ Awarded ${amount} XP to user ${userId} (${reason}). Level: ${oldLevel} → ${newLevel}`);

    return c.json({
      success: true,
      newXP,
      newLevel,
      leveledUp,
      reason
    });

  } catch (error: any) {
    console.error('❌ Error awarding XP:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Calculate level from XP
 */
function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * GET /users/:id/settings - Get user settings
 */
app.get('/:id/settings', async (c) => {
  try {
    const userId = c.req.param('id');
    
    // Get settings from KV store (no auth required for reading own settings in dev mode)
    const settings = await kv.get(getUserSettingsKey(userId));
    
    // Return default settings if none exist
    if (!settings) {
      const defaultSettings = {
        displayName: '',
        bio: '',
        profileVisibility: 'public',
        showLocation: true,
        showActivity: true,
        showStats: true,
        pushEnabled: true,
        emailEnabled: true,
        eventReminders: true,
        messageNotifications: true,
        beaconAlerts: true,
        theme: 'dark',
        soundEnabled: true,
        autoPlayRadio: false,
        language: 'en',
        shareLocationAlways: false,
      };
      return c.json(defaultSettings);
    }

    return c.json(settings);

  } catch (error: any) {
    console.error('❌ Error fetching user settings:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * PUT /users/:id/settings - Update user settings
 */
app.put('/:id/settings', async (c) => {
  try {
    const userId = c.req.param('id');
    const body = await c.req.json();
    
    // Get existing settings
    const existing = await kv.get(getUserSettingsKey(userId));
    
    // Merge with existing settings
    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    // Save to KV store
    await kv.set(getUserSettingsKey(userId), updated);

    console.log(`✅ Updated settings for user ${userId}`);

    return c.json({
      success: true,
      settings: updated
    });

  } catch (error: any) {
    console.error('❌ Error updating user settings:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;