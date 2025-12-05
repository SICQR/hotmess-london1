/**
 * XP ENDPOINTS
 * Handles XP tracking, rewards, and quests
 */

import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

/**
 * GET /xp/profile - Get user's XP profile
 */
app.get('/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Get user XP stats
    const userXP = await kv.get(`user:${user.id}:xp`) || {
      userId: user.id,
      totalXP: 0,
      availableXP: 0,
      membershipTier: 'free',
      currentMultiplier: 1,
      level: 1,
      nextLevelXP: 100,
      rewardsRedeemed: 0,
      streakDays: 0,
      lastActivityAt: new Date(),
    };
    
    // Calculate next level XP
    const nextLevel = userXP.level + 1;
    userXP.nextLevelXP = nextLevel * nextLevel * 100;
    
    // Get global rank
    const allUsers = await kv.getByPrefix('user:');
    const xpUsers = allUsers
      .filter(item => item.key.endsWith(':xp'))
      .map(item => item.value)
      .sort((a: any, b: any) => b.totalXP - a.totalXP);
    
    const rank = xpUsers.findIndex((u: any) => u.userId === user.id) + 1;
    userXP.rank = rank || 1;
    
    // Get city rank (if user has location)
    const userProfile = await kv.get(`user:${user.id}:profile`);
    if (userProfile?.city) {
      const cityUsers = xpUsers.filter((u: any) => u.city === userProfile.city);
      const cityRank = cityUsers.findIndex((u: any) => u.userId === user.id) + 1;
      userXP.cityRank = cityRank || 1;
    }
    
    return c.json({ stats: userXP });
  } catch (error) {
    console.error('Error fetching XP profile:', error);
    return c.json({ error: 'Failed to fetch XP profile' }, 500);
  }
});

/**
 * GET /xp/history - Get XP transaction history
 */
app.get('/history', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { limit = 50 } = c.req.query();
    
    // Get all XP entries for user
    const allEntries = await kv.getByPrefix('xp:');
    const userEntries = allEntries
      .map(item => item.value)
      .filter((entry: any) => entry.userId === user.id)
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, parseInt(limit as string));
    
    return c.json({ entries: userEntries });
  } catch (error) {
    console.error('Error fetching XP history:', error);
    return c.json({ error: 'Failed to fetch XP history' }, 500);
  }
});

/**
 * GET /xp/leaderboard - Get global leaderboard
 */
app.get('/leaderboard', async (c) => {
  try {
    const { limit = 100, city } = c.req.query();
    
    // Get all user XP data
    const allUsers = await kv.getByPrefix('user:');
    let xpUsers = allUsers
      .filter(item => item.key.endsWith(':xp'))
      .map(item => item.value);
    
    // Filter by city if specified
    if (city) {
      const profiles = await kv.getByPrefix('user:');
      const cityUserIds = profiles
        .filter(item => item.key.endsWith(':profile') && item.value.city === city)
        .map(item => item.value.userId);
      
      xpUsers = xpUsers.filter((u: any) => cityUserIds.includes(u.userId));
    }
    
    // Sort by XP and add ranks
    const leaderboard = xpUsers
      .sort((a: any, b: any) => b.totalXP - a.totalXP)
      .slice(0, parseInt(limit as string))
      .map((user: any, index: number) => ({
        rank: index + 1,
        userId: user.userId,
        totalXP: user.totalXP,
        level: user.level,
        membershipTier: user.membershipTier,
      }));
    
    return c.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return c.json({ error: 'Failed to fetch leaderboard' }, 500);
  }
});

/**
 * GET /xp/rewards - Get available rewards
 */
app.get('/rewards', async (c) => {
  try {
    // Hardcoded rewards catalog
    const rewards = [
      {
        id: 'merch-raw-tee',
        type: 'merch',
        name: 'RAW Collection T-Shirt',
        description: 'Free t-shirt from the RAW essentials collection',
        xpCost: 1000,
        available: true,
        stock: 50,
      },
      {
        id: 'early-drop-access',
        type: 'early-access',
        name: '24h Early Drop Access',
        description: 'Get exclusive 24-hour early access to all drops for 1 month',
        xpCost: 2000,
        available: true,
      },
      {
        id: 'vip-event-ticket',
        type: 'vip-event',
        name: 'VIP Event Ticket',
        description: 'Free VIP ticket to any HOTMESS event',
        xpCost: 3000,
        available: true,
        stock: 20,
      },
      {
        id: 'queue-jump-pass',
        type: 'queue-jump',
        name: 'Queue Jump Pass (5x)',
        description: 'Skip the line at 5 partner venues',
        xpCost: 1500,
        available: true,
      },
      {
        id: 'artist-meet-greet',
        type: 'artist-exclusive',
        name: 'RAW CONVICT Artist Meet & Greet',
        description: 'Private meet & greet with a RAW CONVICT artist',
        xpCost: 5000,
        available: true,
        stock: 5,
      },
      {
        id: 'mystery-box-medium',
        type: 'mystery-box',
        name: 'Mystery Box - Medium',
        description: 'Random selection of HOTMESS merch and exclusive items',
        xpCost: 2500,
        available: true,
        stock: 30,
      },
      {
        id: 'premium-beacon-unlock',
        type: 'beacon-unlock',
        name: 'Premium Beacon Unlock',
        description: 'Unlock premium beacon types (chat, reward, quest) for 3 months',
        xpCost: 3500,
        available: true,
      },
      {
        id: 'chat-beacon-monthly',
        type: 'chat-beacon',
        name: 'Chat Beacon Access (1 Month)',
        description: 'Access to exclusive chat beacons for connections',
        xpCost: 800,
        available: true,
      },
    ];
    
    return c.json({ rewards });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return c.json({ error: 'Failed to fetch rewards' }, 500);
  }
});

/**
 * POST /xp/rewards/:rewardId/redeem - Redeem a reward
 */
app.post('/rewards/:rewardId/redeem', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const rewardId = c.req.param('rewardId');
    
    // Get reward details (hardcoded for now)
    const rewards: Record<string, any> = {
      'merch-raw-tee': { xpCost: 1000, stock: 50 },
      'early-drop-access': { xpCost: 2000 },
      'vip-event-ticket': { xpCost: 3000, stock: 20 },
      'queue-jump-pass': { xpCost: 1500 },
      'artist-meet-greet': { xpCost: 5000, stock: 5 },
      'mystery-box-medium': { xpCost: 2500, stock: 30 },
      'premium-beacon-unlock': { xpCost: 3500 },
      'chat-beacon-monthly': { xpCost: 800 },
    };
    
    const reward = rewards[rewardId];
    if (!reward) {
      return c.json({ error: 'Reward not found' }, 404);
    }
    
    // Get user XP
    const userXP = await kv.get(`user:${user.id}:xp`);
    if (!userXP || userXP.availableXP < reward.xpCost) {
      return c.json({ error: 'Insufficient XP' }, 400);
    }
    
    // Check stock
    if (reward.stock !== undefined) {
      const stockKey = `reward:${rewardId}:stock`;
      const currentStock = await kv.get(stockKey) || reward.stock;
      if (currentStock <= 0) {
        return c.json({ error: 'Reward out of stock' }, 400);
      }
      await kv.set(stockKey, currentStock - 1);
    }
    
    // Deduct XP
    userXP.availableXP -= reward.xpCost;
    userXP.rewardsRedeemed++;
    await kv.set(`user:${user.id}:xp`, userXP);
    
    // Record redemption
    const redemption = {
      id: crypto.randomUUID(),
      userId: user.id,
      rewardId,
      xpSpent: reward.xpCost,
      redeemedAt: new Date(),
    };
    
    await kv.set(`redemption:${redemption.id}`, redemption);
    
    return c.json({ success: true, redemption, userXP });
  } catch (error) {
    console.error('Error redeeming reward:', error);
    return c.json({ error: 'Failed to redeem reward' }, 500);
  }
});

/**
 * GET /xp/quests - Get available quests
 */
app.get('/quests', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Hardcoded quests
    const quests = [
      {
        id: 'first-night-out',
        name: 'First Night Out',
        description: 'Complete your first night in the HOTMESS ecosystem',
        difficulty: 'easy',
        totalXP: 300,
        steps: [
          {
            id: 'scan-venue',
            description: 'Scan a venue beacon',
            requirement: { type: 'beacon-scan', count: 1 },
            xpReward: 100,
          },
          {
            id: 'buy-ticket',
            description: 'Purchase an event ticket',
            requirement: { type: 'ticket-purchase', count: 1 },
            xpReward: 100,
          },
          {
            id: 'stream-track',
            description: 'Stream 5 tracks on HOTMESS Radio',
            requirement: { type: 'track-stream', count: 5 },
            xpReward: 100,
          },
        ],
      },
      {
        id: 'beacon-hunter',
        name: 'Beacon Hunter',
        description: 'Scan 50 unique beacons across the city',
        difficulty: 'medium',
        totalXP: 1000,
        steps: [
          {
            id: 'scan-10',
            description: 'Scan 10 unique beacons',
            requirement: { type: 'beacon-scan', count: 10 },
            xpReward: 200,
          },
          {
            id: 'scan-25',
            description: 'Scan 25 unique beacons',
            requirement: { type: 'beacon-scan', count: 25 },
            xpReward: 300,
          },
          {
            id: 'scan-50',
            description: 'Scan 50 unique beacons',
            requirement: { type: 'beacon-scan', count: 50 },
            xpReward: 500,
          },
        ],
      },
    ];
    
    // Get user's quest progress
    const questProgress = await kv.get(`user:${user.id}:quest-progress`) || {};
    
    // Attach progress to quests
    const questsWithProgress = quests.map(quest => ({
      ...quest,
      progress: questProgress[quest.id] || { completed: false, stepsCompleted: [] },
    }));
    
    return c.json({ quests: questsWithProgress });
  } catch (error) {
    console.error('Error fetching quests:', error);
    return c.json({ error: 'Failed to fetch quests' }, 500);
  }
});

/**
 * POST /xp/award - Award XP (internal use)
 */
app.post('/award', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const body = await c.req.json();
    const { amount, source, sourceId, metadata } = body;
    
    if (!amount || !source) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Get user profile for tier
    const userProfile = await kv.get(`user:${user.id}:profile`) || {};
    const membershipTier = userProfile.membershipTier || 'free';
    const multipliers = { free: 1, member: 2, plus: 3, pro: 5 };
    const multiplier = multipliers[membershipTier as keyof typeof multipliers];
    
    // Create XP entry
    const xpEntry = {
      id: crypto.randomUUID(),
      userId: user.id,
      amount,
      source,
      sourceId,
      multiplier,
      membershipTier,
      timestamp: new Date(),
      metadata,
    };
    
    await kv.set(`xp:${xpEntry.id}`, xpEntry);
    
    // Update user's total XP
    const userXP = await kv.get(`user:${user.id}:xp`) || {
      userId: user.id,
      totalXP: 0,
      availableXP: 0,
      membershipTier,
      currentMultiplier: multiplier,
      level: 1,
      rewardsRedeemed: 0,
      streakDays: 1,
      lastActivityAt: new Date(),
    };
    
    userXP.totalXP += amount;
    userXP.availableXP += amount;
    userXP.level = Math.floor(Math.sqrt(userXP.totalXP / 100));
    userXP.lastActivityAt = new Date();
    
    await kv.set(`user:${user.id}:xp`, userXP);
    
    return c.json({ success: true, xpEntry, userXP });
  } catch (error) {
    console.error('Error awarding XP:', error);
    return c.json({ error: 'Failed to award XP' }, 500);
  }
});

export default app;
