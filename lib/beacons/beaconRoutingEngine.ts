/**
 * HOTMESS LONDON — BEACON ROUTING ENGINE (BRE)
 * 
 * The core engine that processes every beacon scan:
 * 1. Resolves beacon code
 * 2. Validates user eligibility
 * 3. Evaluates rules
 * 4. Awards XP
 * 5. Triggers bots
 * 6. Triggers automations
 * 7. Logs analytics
 * 8. Executes redirect
 * 
 * This is the P0 critical feature that makes HOTMESS work.
 */

import { supabase } from '../supabase';
import { RouteId } from '../routes';

// ============================================================================
// TYPES
// ============================================================================

export type BeaconScanResult = 
  | { success: true; beacon: any; xpAwarded: number; redirect: RouteId | string; redirectParams?: Record<string, string> }
  | { success: false; error: BeaconScanError; message: string };

export type BeaconScanError = 
  | 'NOT_FOUND'
  | 'EXPIRED'
  | 'NOT_STARTED'
  | 'ALREADY_SCANNED'
  | 'COOLDOWN_ACTIVE'
  | 'GEO_REQUIRED'
  | 'GEO_TOO_FAR'
  | 'PREMIUM_REQUIRED'
  | 'CONSENT_REQUIRED'
  | 'MAX_SCANS_REACHED'
  | 'USER_NOT_ELIGIBLE'
  | 'BEACON_PAUSED';

export interface ScanContext {
  userId?: string;
  userLat?: number;
  userLng?: number;
  userAgent?: string;
  deviceHash?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
}

// ============================================================================
// MAIN BEACON ROUTING ENGINE
// ============================================================================

export async function processBeaconScan(
  code: string,
  context: ScanContext
): Promise<BeaconScanResult> {
  
  // STEP 1: Resolve beacon
  const beacon = await resolveBeacon(code);
  if (!beacon) {
    return {
      success: false,
      error: 'NOT_FOUND',
      message: 'Beacon not found or has been deleted'
    };
  }

  // STEP 2: Validate beacon timing and status
  const timingCheck = validateTiming(beacon);
  if (!timingCheck.valid) {
    return {
      success: false,
      error: timingCheck.error!,
      message: timingCheck.message!
    };
  }

  // STEP 3: Validate user eligibility (if authenticated)
  if (context.userId) {
    const eligibilityCheck = await validateUserEligibility(beacon, context.userId);
    if (!eligibilityCheck.valid) {
      return {
        success: false,
        error: eligibilityCheck.error!,
        message: eligibilityCheck.message!
      };
    }
  }

  // STEP 4: Validate geographic constraints
  if (beacon.requires_gps && context.userLat && context.userLng) {
    const geoCheck = validateGeographic(beacon, context.userLat, context.userLng);
    if (!geoCheck.valid) {
      return {
        success: false,
        error: geoCheck.error!,
        message: geoCheck.message!
      };
    }
  } else if (beacon.requires_gps && (!context.userLat || !context.userLng)) {
    return {
      success: false,
      error: 'GEO_REQUIRED',
      message: 'This beacon requires your location to scan'
    };
  }

  // STEP 5: Check previous scans and cooldown
  if (context.userId) {
    const scanHistoryCheck = await checkScanHistory(beacon, context.userId);
    if (!scanHistoryCheck.valid) {
      return {
        success: false,
        error: scanHistoryCheck.error!,
        message: scanHistoryCheck.message!
      };
    }
  }

  // STEP 6: Calculate XP reward
  const xpAmount = calculateXP(beacon, context);

  // STEP 7: Record the scan
  await recordScan(beacon, context, xpAmount, true);

  // STEP 8: Award XP (if user authenticated)
  if (context.userId && xpAmount > 0) {
    await awardXP(context.userId, xpAmount, 'beacon_scan', beacon.id);
  }

  // STEP 9: Evaluate and execute rules (async, non-blocking)
  executeBeaconRules(beacon, context).catch(err => 
    console.error('Beacon rules execution failed:', err)
  );

  // STEP 10: Trigger automations (async, non-blocking)
  triggerAutomations(beacon, context).catch(err =>
    console.error('Automation trigger failed:', err)
  );

  // STEP 11: Determine redirect
  const { route, params } = determineRedirect(beacon);

  // STEP 12: Return success
  return {
    success: true,
    beacon,
    xpAwarded: xpAmount,
    redirect: route,
    redirectParams: params
  };
}

// ============================================================================
// STEP 1: RESOLVE BEACON
// ============================================================================

async function resolveBeacon(code: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('beacons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('status', 'active')
    .single();

  if (error || !data) return null;
  return data;
}

// ============================================================================
// STEP 2: VALIDATE TIMING
// ============================================================================

function validateTiming(beacon: any): {
  valid: boolean;
  error?: BeaconScanError;
  message?: string;
} {
  const now = new Date();

  // Check if beacon has started
  if (beacon.starts_at) {
    const startTime = new Date(beacon.starts_at);
    if (now < startTime) {
      const startsIn = Math.ceil((startTime.getTime() - now.getTime()) / 1000 / 60); // minutes
      return {
        valid: false,
        error: 'NOT_STARTED',
        message: `This beacon starts in ${startsIn} minutes`
      };
    }
  }

  // Check if beacon has expired
  if (beacon.ends_at) {
    const endTime = new Date(beacon.ends_at);
    if (now > endTime) {
      return {
        valid: false,
        error: 'EXPIRED',
        message: 'This beacon has expired'
      };
    }
  }

  // Check if beacon is paused
  if (beacon.status === 'paused') {
    return {
      valid: false,
      error: 'BEACON_PAUSED',
      message: 'This beacon is temporarily paused'
    };
  }

  return { valid: true };
}

// ============================================================================
// STEP 3: VALIDATE USER ELIGIBILITY
// ============================================================================

async function validateUserEligibility(
  beacon: any,
  userId: string
): Promise<{
  valid: boolean;
  error?: BeaconScanError;
  message?: string;
}> {
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('membership_tier, xp')
    .eq('id', userId)
    .single();

  if (!profile) {
    return { valid: true }; // Allow scan if profile doesn't exist yet
  }

  // Check premium requirement
  if (beacon.premium_required) {
    const isPremium = ['pro', 'elite'].includes(profile.membership_tier);
    if (!isPremium) {
      return {
        valid: false,
        error: 'PREMIUM_REQUIRED',
        message: 'This beacon requires Pro or Elite membership'
      };
    }
  }

  // Check membership tier requirement (if specified in config)
  if (beacon.config?.required_tier) {
    const tierOrder = { starter: 0, pro: 1, elite: 2 };
    const userTier = tierOrder[profile.membership_tier as keyof typeof tierOrder] || 0;
    const requiredTier = tierOrder[beacon.config.required_tier as keyof typeof tierOrder] || 0;
    
    if (userTier < requiredTier) {
      return {
        valid: false,
        error: 'USER_NOT_ELIGIBLE',
        message: `This beacon requires ${beacon.config.required_tier} membership`
      };
    }
  }

  return { valid: true };
}

// ============================================================================
// STEP 4: VALIDATE GEOGRAPHIC
// ============================================================================

function validateGeographic(
  beacon: any,
  userLat: number,
  userLng: number
): {
  valid: boolean;
  error?: BeaconScanError;
  message?: string;
} {
  if (!beacon.geo_lat || !beacon.geo_lng) {
    return { valid: true }; // No geo restriction
  }

  const distance = calculateDistance(
    userLat,
    userLng,
    beacon.geo_lat,
    beacon.geo_lng
  );

  const maxDistance = beacon.radius_m || 150; // Default 150m

  if (distance > maxDistance) {
    return {
      valid: false,
      error: 'GEO_TOO_FAR',
      message: `You must be within ${maxDistance}m of this beacon (you're ${Math.round(distance)}m away)`
    };
  }

  return { valid: true };
}

// Haversine formula for distance calculation
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// ============================================================================
// STEP 5: CHECK SCAN HISTORY
// ============================================================================

async function checkScanHistory(
  beacon: any,
  userId: string
): Promise<{
  valid: boolean;
  error?: BeaconScanError;
  message?: string;
}> {
  // Get user's scan history for this beacon
  const { data: scans } = await supabase
    .from('beacon_scans')
    .select('scanned_at')
    .eq('beacon_id', beacon.id)
    .eq('user_id', userId)
    .order('scanned_at', { ascending: false });

  if (!scans || scans.length === 0) {
    return { valid: true }; // First scan
  }

  // Check max scans per user
  const maxScansPerUser = beacon.config?.max_scans_per_user || 999999;
  if (scans.length >= maxScansPerUser) {
    return {
      valid: false,
      error: 'MAX_SCANS_REACHED',
      message: `You've reached the maximum number of scans for this beacon`
    };
  }

  // Check cooldown
  const lastScan = new Date(scans[0].scanned_at);
  const cooldownMinutes = beacon.config?.cooldown_minutes || 0;
  
  if (cooldownMinutes > 0) {
    const now = new Date();
    const minutesSinceLastScan = (now.getTime() - lastScan.getTime()) / 1000 / 60;
    
    if (minutesSinceLastScan < cooldownMinutes) {
      const minutesRemaining = Math.ceil(cooldownMinutes - minutesSinceLastScan);
      return {
        valid: false,
        error: 'COOLDOWN_ACTIVE',
        message: `You can scan this beacon again in ${minutesRemaining} minutes`
      };
    }
  }

  // Check daily limit
  const maxScansPerDay = beacon.config?.max_scans_per_day || 999999;
  if (maxScansPerDay < 999999) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const scansToday = scans.filter(scan => {
      const scanDate = new Date(scan.scanned_at);
      scanDate.setHours(0, 0, 0, 0);
      return scanDate.getTime() === today.getTime();
    });

    if (scansToday.length >= maxScansPerDay) {
      return {
        valid: false,
        error: 'ALREADY_SCANNED',
        message: `You've reached your daily scan limit for this beacon`
      };
    }
  }

  return { valid: true };
}

// ============================================================================
// STEP 6: CALCULATE XP
// ============================================================================

function calculateXP(beacon: any, context: ScanContext): number {
  let baseXP = beacon.config?.xp_amount || 10;

  // Apply multipliers based on membership tier
  if (context.userId) {
    // This would ideally come from user profile, but we'll use defaults here
    // In production, pass membership_tier through context
    const multiplier = beacon.config?.xp_multiplier || 1.0;
    baseXP = Math.round(baseXP * multiplier);
  }

  // Bonus XP for first scan
  // (Would need to check scan history, but keep it simple for now)

  return Math.max(0, baseXP);
}

// ============================================================================
// STEP 7: RECORD SCAN
// ============================================================================

async function recordScan(
  beacon: any,
  context: ScanContext,
  xpAwarded: number,
  success: boolean
): Promise<void> {
  await supabase.from('beacon_scans').insert({
    beacon_id: beacon.id,
    user_id: context.userId || null,
    scan_lat: context.userLat || null,
    scan_lng: context.userLng || null,
    xp_awarded: xpAwarded,
    success,
    user_agent: context.userAgent || null,
    device_hash: context.deviceHash || null,
    utm_source: context.utm_source || null,
    utm_medium: context.utm_medium || null,
    utm_campaign: context.utm_campaign || null,
    referrer: context.referrer || null
  });

  // Update beacon scan count
  await supabase.rpc('increment_beacon_scan_count', {
    beacon_id: beacon.id
  });
}

// ============================================================================
// STEP 8: AWARD XP
// ============================================================================

async function awardXP(
  userId: string,
  amount: number,
  source: string,
  beaconId: string
): Promise<void> {
  // Call the award_xp database function
  await supabase.rpc('award_xp', {
    p_user_id: userId,
    p_amount: amount,
    p_source: source,
    p_source_id: beaconId,
    p_reason: 'Beacon scan'
  });
}

// ============================================================================
// STEP 9: EXECUTE BEACON RULES
// ============================================================================

async function executeBeaconRules(
  beacon: any,
  context: ScanContext
): Promise<void> {
  // Query beacon_rules table for this beacon
  const { data: rules } = await supabase
    .from('beacon_rules')
    .select('*')
    .eq('beacon_id', beacon.id)
    .eq('enabled', true)
    .order('priority', { ascending: false });

  if (!rules || rules.length === 0) return;

  // Execute each rule
  for (const rule of rules) {
    try {
      const conditionMet = await evaluateRuleCondition(rule, context);
      if (conditionMet) {
        await executeRuleAction(rule, beacon, context);
      }
    } catch (err) {
      console.error(`Rule ${rule.id} execution failed:`, err);
    }
  }
}

async function evaluateRuleCondition(rule: any, context: ScanContext): Promise<boolean> {
  // Implement rule condition evaluation logic here
  // This would check things like user tier, scan count, time range, etc.
  // For now, return true (execute all rules)
  return true;
}

async function executeRuleAction(rule: any, beacon: any, context: ScanContext): Promise<void> {
  switch (rule.action_type) {
    case 'award_xp':
      if (context.userId) {
        const bonusXP = rule.action_params?.amount || 0;
        await awardXP(context.userId, bonusXP, 'bonus_rule', beacon.id);
      }
      break;
    case 'send_bot_dm':
      // Trigger bot notification
      // This would integrate with Telegram bot
      break;
    case 'create_thread':
      // Create a thread between users
      break;
    case 'fire_webhook':
      // Call Make.com webhook
      if (rule.action_params?.webhook_url) {
        await fetch(rule.action_params.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ beacon, context })
        });
      }
      break;
    default:
      console.warn(`Unknown rule action: ${rule.action_type}`);
  }
}

// ============================================================================
// STEP 10: TRIGGER AUTOMATIONS
// ============================================================================

async function triggerAutomations(
  beacon: any,
  context: ScanContext
): Promise<void> {
  // Query automations table for beacon scan triggers
  const { data: automations } = await supabase
    .from('automations')
    .select('*')
    .eq('trigger_type', 'beacon_scan')
    .eq('enabled', true);

  if (!automations || automations.length === 0) return;

  for (const automation of automations) {
    try {
      // Check if this automation applies to this beacon type
      if (automation.beacon_type && automation.beacon_type !== beacon.type) {
        continue;
      }

      // Fire Make.com scenario webhook
      if (automation.make_scenario_url) {
        await fetch(automation.make_scenario_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            automation_id: automation.id,
            beacon,
            context,
            timestamp: new Date().toISOString()
          })
        });

        // Log automation execution
        await supabase.from('automation_logs').insert({
          automation_id: automation.id,
          trigger_entity_type: 'beacon',
          trigger_entity_id: beacon.id,
          user_id: context.userId || null,
          success: true
        });
      }
    } catch (err) {
      console.error(`Automation ${automation.id} failed:`, err);
      
      // Log failure
      await supabase.from('automation_logs').insert({
        automation_id: automation.id,
        trigger_entity_type: 'beacon',
        trigger_entity_id: beacon.id,
        user_id: context.userId || null,
        success: false,
        error_message: String(err)
      });
    }
  }
}

// ============================================================================
// STEP 11: DETERMINE REDIRECT
// ============================================================================

function determineRedirect(beacon: any): {
  route: RouteId | string;
  params?: Record<string, string>;
} {
  // If beacon has explicit redirect URL in config
  if (beacon.config?.redirect_url) {
    return {
      route: beacon.config.redirect_url
    };
  }

  // Determine redirect based on beacon type
  switch (beacon.type) {
    case 'checkin':
      return { route: 'map' as RouteId };
    
    case 'ticket':
      return {
        route: 'ticketListing' as RouteId,
        params: { listingId: beacon.config?.listing_id || beacon.id }
      };
    
    case 'product':
      return {
        route: 'shopProduct' as RouteId,
        params: { productId: beacon.config?.product_id || '' }
      };
    
    case 'drop':
      return {
        route: 'drops' as RouteId
      };
    
    case 'event':
      return {
        route: 'beacons' as RouteId,
        params: { code: beacon.code }
      };
    
    case 'music':
    case 'playlist':
      return {
        route: 'records' as RouteId
      };
    
    case 'radio':
      return { route: 'radio' as RouteId };
    
    case 'vendor':
      return {
        route: 'messmarket' as RouteId
      };
    
    default:
      // Default to beacon detail page
      return {
        route: 'beacons' as RouteId,
        params: { code: beacon.code }
      };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  processBeaconScan as default,
  resolveBeacon,
  validateTiming,
  validateUserEligibility,
  validateGeographic,
  checkScanHistory,
  calculateXP,
  recordScan,
  awardXP,
  executeBeaconRules,
  triggerAutomations,
  determineRedirect
};
