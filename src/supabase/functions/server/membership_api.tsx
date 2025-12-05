/**
 * HOTMESS LONDON - MEMBERSHIP API
 * Tiered membership system (Free/Pro/Elite)
 * Handles subscriptions, access control, benefits
 */

import { Hono } from 'npm:hono@4.10.6';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Helper to get Supabase client
function getSupabase(authToken?: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    authToken ? Deno.env.get('SUPABASE_ANON_KEY') || '' : Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );
  return supabase;
}

// Helper to verify user
async function verifyUser(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  const supabase = getSupabase();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// Membership tier configs
const TIER_CONFIGS = {
  free: {
    tier: 'free',
    name: 'Free',
    price_monthly: 0,
    level_required: 0,
  },
  pro: {
    tier: 'pro',
    name: 'Pro',
    price_monthly: 15,
    price_yearly: 150,
    level_required: 3,
    stripe_price_id_monthly: 'price_pro_monthly', // Replace with real Stripe price ID
    stripe_price_id_yearly: 'price_pro_yearly',
  },
  elite: {
    tier: 'elite',
    name: 'Elite',
    price_monthly: 35,
    price_yearly: 350,
    level_required: 6,
    stripe_price_id_monthly: 'price_elite_monthly',
    stripe_price_id_yearly: 'price_elite_yearly',
  },
};

// ============================================================================
// GET USER MEMBERSHIP
// ============================================================================

app.get('/me', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user membership
    const membershipKey = `membership:${user.id}`;
    const membershipData = await kv.get(membershipKey);
    
    let membership;
    if (membershipData) {
      membership = JSON.parse(membershipData);
    } else {
      // Create default free membership
      membership = {
        user_id: user.id,
        tier: 'free',
        status: 'active',
        billing_cycle: 'monthly',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false,
        payment_failed: false,
        joined_tier_at: new Date().toISOString(),
        lifetime_value: 0,
        months_subscribed: 0,
      };
      await kv.set(membershipKey, JSON.stringify(membership));
    }

    // Get user XP level to check eligibility
    const xpData = await kv.get(`xp:${user.id}`);
    const xp = xpData ? JSON.parse(xpData) : { total: 0, level: 1 };

    return c.json({ 
      membership,
      current_level: xp.level,
      can_upgrade_to_pro: xp.level >= TIER_CONFIGS.pro.level_required,
      can_upgrade_to_elite: xp.level >= TIER_CONFIGS.elite.level_required,
    });
  } catch (error: any) {
    console.error('Error fetching membership:', error);
    return c.json({ error: error.message || 'Failed to fetch membership' }, 500);
  }
});

// ============================================================================
// CHECK ACCESS
// ============================================================================

app.post('/check-access', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { module, feature } = await c.req.json();

    if (!module || !feature) {
      return c.json({ error: 'Module and feature required' }, 400);
    }

    // Get user membership
    const membershipKey = `membership:${user.id}`;
    const membershipData = await kv.get(membershipKey);
    const membership = membershipData ? JSON.parse(membershipData) : { tier: 'free' };

    // Access check logic (simplified - expand based on feature)
    const accessRules: Record<string, { required_tier: string }> = {
      // Rooms
      'rooms:city_wide_access': { required_tier: 'pro' },
      'rooms:global_access': { required_tier: 'elite' },
      'rooms:priority_messages': { required_tier: 'elite' },
      
      // Drops
      'drops:schedule': { required_tier: 'pro' },
      'drops:boost': { required_tier: 'pro' },
      'drops:first_access': { required_tier: 'elite' },
      
      // Market
      'market:boost': { required_tier: 'pro' },
      'market:reduced_fees': { required_tier: 'pro' },
      'market:lowest_fees': { required_tier: 'elite' },
      
      // Events
      'events:early_access': { required_tier: 'pro' },
      'events:vip_line': { required_tier: 'elite' },
      'events:free_monthly': { required_tier: 'elite' },
      
      // Beacons
      'beacons:analytics': { required_tier: 'pro' },
      'beacons:heatmap_full': { required_tier: 'elite' },
      
      // XP
      'xp:boost_10': { required_tier: 'pro' },
      'xp:boost_20': { required_tier: 'elite' },
    };

    const featureKey = `${module}:${feature}`;
    const rule = accessRules[featureKey];

    if (!rule) {
      // Feature doesn't require paid tier
      return c.json({
        has_access: true,
        user_tier: membership.tier,
      });
    }

    const tierOrder = ['free', 'pro', 'elite'];
    const userTierIndex = tierOrder.indexOf(membership.tier);
    const requiredTierIndex = tierOrder.indexOf(rule.required_tier);

    const hasAccess = userTierIndex >= requiredTierIndex;

    return c.json({
      has_access: hasAccess,
      user_tier: membership.tier,
      required_tier: rule.required_tier,
      upgrade_cta: hasAccess ? null : `Upgrade to ${rule.required_tier} to access this feature`,
    });
  } catch (error: any) {
    console.error('Error checking access:', error);
    return c.json({ error: error.message || 'Failed to check access' }, 500);
  }
});

// ============================================================================
// CREATE UPGRADE INTENT (for Stripe checkout)
// ============================================================================

app.post('/upgrade-intent', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { to_tier, billing_cycle } = await c.req.json();

    if (!['pro', 'elite'].includes(to_tier)) {
      return c.json({ error: 'Invalid tier' }, 400);
    }

    if (!['monthly', 'yearly'].includes(billing_cycle)) {
      return c.json({ error: 'Invalid billing cycle' }, 400);
    }

    // Get current membership
    const membershipKey = `membership:${user.id}`;
    const membershipData = await kv.get(membershipKey);
    const membership = membershipData ? JSON.parse(membershipData) : { tier: 'free' };

    // Check XP level requirement
    const xpData = await kv.get(`xp:${user.id}`);
    const xp = xpData ? JSON.parse(xpData) : { total: 0, level: 1 };

    const requiredLevel = TIER_CONFIGS[to_tier as 'pro' | 'elite'].level_required;
    if (xp.level < requiredLevel) {
      return c.json({
        error: `You need to be level ${requiredLevel} to upgrade to ${to_tier}`,
        current_level: xp.level,
        required_level: requiredLevel,
      }, 400);
    }

    // Calculate price
    const tierConfig = TIER_CONFIGS[to_tier as 'pro' | 'elite'];
    const price = billing_cycle === 'monthly' ? tierConfig.price_monthly : tierConfig.price_yearly;

    const intent = {
      user_id: user.id,
      from_tier: membership.tier,
      to_tier,
      billing_cycle,
      estimated_price: price,
      proration_credit: 0, // Could calculate based on existing subscription
      created_at: new Date().toISOString(),
    };

    // Save intent
    const intentId = `upgrade_intent_${Date.now()}_${user.id}`;
    await kv.set(`upgrade_intent:${intentId}`, JSON.stringify(intent));

    return c.json({
      intent_id: intentId,
      ...intent,
    });
  } catch (error: any) {
    console.error('Error creating upgrade intent:', error);
    return c.json({ error: error.message || 'Failed to create upgrade intent' }, 500);
  }
});

// ============================================================================
// COMPLETE UPGRADE (called after Stripe payment)
// ============================================================================

app.post('/complete-upgrade', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { 
      to_tier, 
      billing_cycle, 
      stripe_subscription_id,
      stripe_customer_id,
    } = await c.req.json();

    if (!to_tier || !billing_cycle) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get current membership
    const membershipKey = `membership:${user.id}`;
    const membershipData = await kv.get(membershipKey);
    const currentMembership = membershipData ? JSON.parse(membershipData) : { tier: 'free' };

    // Update membership
    const now = new Date();
    const periodEnd = new Date(now);
    if (billing_cycle === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    const updatedMembership = {
      ...currentMembership,
      tier: to_tier,
      status: 'active',
      stripe_subscription_id,
      stripe_customer_id,
      billing_cycle,
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: false,
      last_payment_date: now.toISOString(),
      next_payment_date: periodEnd.toISOString(),
      payment_failed: false,
      previous_tier: currentMembership.tier,
      upgraded_at: now.toISOString(),
      months_subscribed: (currentMembership.months_subscribed || 0) + (billing_cycle === 'monthly' ? 1 : 12),
    };

    await kv.set(membershipKey, JSON.stringify(updatedMembership));

    // Award XP for upgrading
    const xpKey = `xp:${user.id}`;
    const xpData = await kv.get(xpKey);
    const xp = xpData ? JSON.parse(xpData) : { total: 0, level: 1 };
    const xpBonus = to_tier === 'pro' ? 100 : 250;
    xp.total += xpBonus;
    xp.level = Math.floor(xp.total / 100) + 1;
    await kv.set(xpKey, JSON.stringify(xp));

    console.log(`✅ User ${user.id} upgraded to ${to_tier} (${billing_cycle})`);

    return c.json({
      success: true,
      membership: updatedMembership,
      xp_earned: xpBonus,
    });
  } catch (error: any) {
    console.error('Error completing upgrade:', error);
    return c.json({ error: error.message || 'Failed to complete upgrade' }, 500);
  }
});

// ============================================================================
// CANCEL SUBSCRIPTION
// ============================================================================

app.post('/cancel', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { immediate } = await c.req.json();

    // Get current membership
    const membershipKey = `membership:${user.id}`;
    const membershipData = await kv.get(membershipKey);
    
    if (!membershipData) {
      return c.json({ error: 'No membership found' }, 404);
    }

    const membership = JSON.parse(membershipData);

    if (membership.tier === 'free') {
      return c.json({ error: 'Cannot cancel free tier' }, 400);
    }

    if (immediate) {
      // Cancel immediately - downgrade to free
      membership.tier = 'free';
      membership.status = 'cancelled';
      membership.previous_tier = membership.tier;
      membership.downgraded_at = new Date().toISOString();
    } else {
      // Cancel at period end
      membership.cancel_at_period_end = true;
    }

    await kv.set(membershipKey, JSON.stringify(membership));

    console.log(`✅ User ${user.id} cancelled subscription (immediate: ${immediate})`);

    return c.json({
      success: true,
      membership,
    });
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return c.json({ error: error.message || 'Failed to cancel subscription' }, 500);
  }
});

// ============================================================================
// GET MEMBERSHIP STATS (Admin)
// ============================================================================

app.get('/stats', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin (simplified - should check actual admin role)
    // For now, just return placeholder stats

    const stats = {
      total_members: 1000,
      free: 750,
      pro: 200,
      elite: 50,
      mrr: (200 * 15) + (50 * 35), // Monthly recurring revenue
      conversion_rate: 25,
      churn_rate: 5,
    };

    return c.json({ stats });
  } catch (error: any) {
    console.error('Error fetching membership stats:', error);
    return c.json({ error: error.message || 'Failed to fetch stats' }, 500);
  }
});

export default app;
