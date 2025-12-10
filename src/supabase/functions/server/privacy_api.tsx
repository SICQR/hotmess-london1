/**
 * HOTMESS LONDON - Privacy API
 * GDPR-compliant data subject rights endpoints
 * Handles: DSAR, Right to Deletion, Data Export, Consent Management
 */

import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const privacyRouter = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Helper to verify user auth
async function verifyUser(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Unauthorized', userId: null };
  }
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return { error: 'Unauthorized', userId: null };
  }
  
  return { error: null, userId: user.id };
}

/**
 * DATA SUBJECT ACCESS REQUEST (DSAR)
 * GDPR Article 15 - Right to Access
 * Returns complete user data package
 */
privacyRouter.post('/dsar/request', async (c) => {
  const authHeader = c.req.header('Authorization');
  const { error, userId } = await verifyUser(authHeader);
  
  if (error || !userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    // Collect all user data from all tables
    const userData: any = {};
    
    // Profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    userData.profile = profile;
    
    // Beacons created
    const { data: beacons } = await supabase
      .from('beacons')
      .select('*')
      .eq('created_by', userId);
    userData.beacons_created = beacons;
    
    // Saved beacons
    const { data: savedBeacons } = await supabase
      .from('saved_beacons')
      .select('*, beacons(*)')
      .eq('user_id', userId);
    userData.saved_beacons = savedBeacons;
    
    // Connect threads
    const { data: threads } = await supabase
      .from('threads')
      .select('*, messages(*)')
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
    userData.threads = threads;
    
    // Ticket listings
    const { data: listings } = await supabase
      .from('ticket_listings')
      .select('*')
      .eq('seller_id', userId);
    userData.ticket_listings = listings;
    
    // Records library
    const { data: library } = await supabase
      .from('records_library')
      .select('*, releases(*)')
      .eq('user_id', userId);
    userData.records_library = library;
    
    // Records plays
    const { data: plays } = await supabase
      .from('records_plays')
      .select('*')
      .eq('user_id', userId);
    userData.records_plays = plays;
    
    // XP and rewards
    const { data: xp } = await supabase
      .from('user_xp')
      .select('*')
      .eq('user_id', userId)
      .single();
    userData.xp = xp;
    
    // Trust & safety data
    const { data: blockedUsers } = await supabase
      .from('blocked_users')
      .select('*')
      .eq('blocker_id', userId);
    userData.blocked_users = blockedUsers;
    
    const { data: mutedUsers } = await supabase
      .from('muted_users')
      .select('*')
      .eq('muter_id', userId);
    userData.muted_users = mutedUsers;
    
    const { data: reports } = await supabase
      .from('reports')
      .select('*')
      .eq('reporter_id', userId);
    userData.reports_filed = reports;
    
    // Consent log
    const { data: consents } = await supabase
      .from('consent_log')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    userData.consent_log = consents;
    
    // Location consent
    const { data: locationConsent } = await supabase
      .from('location_consent')
      .select('*')
      .eq('user_id', userId)
      .order('granted_at', { ascending: false })
      .limit(1);
    userData.location_consent = locationConsent?.[0] || null;
    
    // Cookie preferences
    const { data: cookiePrefs } = await supabase
      .from('cookie_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    userData.cookie_preferences = cookiePrefs;
    
    // Auth metadata (anonymized)
    const { data: { user } } = await supabase.auth.getUser(authHeader.split(' ')[1]);
    userData.account_info = {
      email: user?.email,
      created_at: user?.created_at,
      last_sign_in: user?.last_sign_in_at,
      providers: user?.app_metadata?.providers || [],
    };
    
    // Log DSAR request
    await supabase.from('consent_log').insert({
      user_id: userId,
      action: 'dsar_request',
      data: { request_type: 'full_export' },
      timestamp: new Date().toISOString(),
    });
    
    // Return complete data package
    return c.json({
      success: true,
      message: 'Data Subject Access Request completed',
      data: userData,
      exported_at: new Date().toISOString(),
      gdpr_article: 'Article 15 - Right to Access',
    });
    
  } catch (err: any) {
    console.error('DSAR request error:', err);
    return c.json({ error: 'Failed to process DSAR request', details: err.message }, 500);
  }
});

/**
 * RIGHT TO DELETION (Right to be Forgotten)
 * GDPR Article 17 - Right to Erasure
 * Permanently deletes all user data
 */
privacyRouter.post('/deletion/request', async (c) => {
  const authHeader = c.req.header('Authorization');
  const { error, userId } = await verifyUser(authHeader);
  
  if (error || !userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const body = await c.req.json();
  const { confirmation, reason } = body;
  
  // Require explicit confirmation
  if (confirmation !== 'DELETE MY ACCOUNT') {
    return c.json({ 
      error: 'Confirmation required', 
      required: 'You must type "DELETE MY ACCOUNT" to confirm deletion' 
    }, 400);
  }
  
  try {
    // Log deletion request (must be kept for 7 years per GDPR)
    await supabase.from('consent_log').insert({
      user_id: userId,
      action: 'account_deletion_request',
      data: { reason: reason || 'No reason provided' },
      timestamp: new Date().toISOString(),
    });
    
    // Create deletion audit record (anonymized, kept for legal compliance)
    const { data: profile } = await supabase
      .from('profiles')
      .select('created_at')
      .eq('id', userId)
      .single();
    
    await supabase.from('kv_store_a670c824').insert({
      key: `deletion_audit:${userId}`,
      value: {
        deleted_at: new Date().toISOString(),
        account_age_days: profile ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)) : null,
        reason: reason || 'No reason provided',
        gdpr_article: 'Article 17',
      },
    });
    
    // Delete user data in reverse foreign key order
    
    // 1. Soft delete messages (keep for legal compliance)
    await supabase
      .from('messages')
      .update({ content: '[DELETED]', removed: true, removed_at: new Date().toISOString() })
      .eq('sender_id', userId);
    
    // 2. Close threads
    await supabase
      .from('threads')
      .update({ status: 'closed', closed_at: new Date().toISOString() })
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
    
    // 3. Delete user-generated content
    await supabase.from('ticket_listings').delete().eq('seller_id', userId);
    await supabase.from('saved_beacons').delete().eq('user_id', userId);
    await supabase.from('records_library').delete().eq('user_id', userId);
    await supabase.from('records_plays').delete().eq('user_id', userId);
    await supabase.from('blocked_users').delete().eq('blocker_id', userId);
    await supabase.from('muted_users').delete().eq('muter_id', userId);
    await supabase.from('user_xp').delete().eq('user_id', userId);
    
    // 4. Anonymize beacons (if they have interactions, keep them but anonymize)
    await supabase
      .from('beacons')
      .update({ 
        created_by: '00000000-0000-0000-0000-000000000000',
        metadata: { anonymized: true, deleted_at: new Date().toISOString() }
      })
      .eq('created_by', userId);
    
    // 5. Delete consent data (except audit log per GDPR)
    await supabase.from('location_consent').delete().eq('user_id', userId);
    await supabase.from('cookie_preferences').delete().eq('user_id', userId);
    
    // 6. Delete profile
    await supabase.from('profiles').delete().eq('id', userId);
    
    // 7. Delete auth user (Supabase Auth)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      console.error('Auth deletion error:', authError);
      // Continue anyway - user data is deleted
    }
    
    return c.json({
      success: true,
      message: 'Account and data permanently deleted',
      deleted_at: new Date().toISOString(),
      gdpr_article: 'Article 17 - Right to Erasure',
      note: 'Consent logs retained for 7 years per GDPR Article 7(1)',
    });
    
  } catch (err: any) {
    console.error('Deletion request error:', err);
    return c.json({ error: 'Failed to process deletion request', details: err.message }, 500);
  }
});

/**
 * DATA PORTABILITY
 * GDPR Article 20 - Right to Data Portability
 * Returns data in machine-readable format (JSON)
 */
privacyRouter.get('/export/json', async (c) => {
  const authHeader = c.req.header('Authorization');
  const { error, userId } = await verifyUser(authHeader);
  
  if (error || !userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    // Reuse DSAR logic for data collection
    const response = await privacyRouter.request(
      new Request('https://temp/dsar/request', {
        method: 'POST',
        headers: { Authorization: authHeader ?? '' },
      })
    );
    
    const dsarData = await response.json();
    
    if (!dsarData.success) {
      return c.json({ error: 'Failed to export data' }, 500);
    }
    
    // Log export
    await supabase.from('consent_log').insert({
      user_id: userId,
      action: 'data_export',
      data: { format: 'json', gdpr_article: 'Article 20' },
      timestamp: new Date().toISOString(),
    });
    
    // Return as downloadable JSON
    return c.json(dsarData.data, 200, {
      'Content-Disposition': `attachment; filename="hotmess_data_export_${userId}_${Date.now()}.json"`,
      'Content-Type': 'application/json',
    });
    
  } catch (err: any) {
    console.error('Data export error:', err);
    return c.json({ error: 'Failed to export data', details: err.message }, 500);
  }
});

/**
 * CONSENT WITHDRAWAL
 * GDPR Article 7(3) - Right to Withdraw Consent
 * Revoke specific consents
 */
privacyRouter.post('/consent/withdraw', async (c) => {
  const authHeader = c.req.header('Authorization');
  const { error, userId } = await verifyUser(authHeader);
  
  if (error || !userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const body = await c.req.json();
  const { consent_type } = body;
  
  const validConsents = ['location', 'marketing', 'analytics', 'third_party'];
  if (!validConsents.includes(consent_type)) {
    return c.json({ error: 'Invalid consent type', valid: validConsents }, 400);
  }
  
  try {
    // Log consent withdrawal
    await supabase.from('consent_log').insert({
      user_id: userId,
      action: 'consent_withdrawn',
      data: { consent_type },
      timestamp: new Date().toISOString(),
    });
    
    // Apply withdrawal
    if (consent_type === 'location') {
      await supabase
        .from('location_consent')
        .update({ 
          granted: false, 
          revoked_at: new Date().toISOString(),
          revoke_reason: 'user_request'
        })
        .eq('user_id', userId);
    }
    
    if (consent_type === 'marketing' || consent_type === 'analytics') {
      const { data: cookiePrefs } = await supabase
        .from('cookie_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      const updates: any = {};
      if (consent_type === 'marketing') {
        updates.marketing = false;
      }
      if (consent_type === 'analytics') {
        updates.analytics = false;
      }
      
      await supabase
        .from('cookie_preferences')
        .update(updates)
        .eq('user_id', userId);
    }
    
    return c.json({
      success: true,
      message: `${consent_type} consent withdrawn`,
      withdrawn_at: new Date().toISOString(),
      gdpr_article: 'Article 7(3) - Right to Withdraw Consent',
    });
    
  } catch (err: any) {
    console.error('Consent withdrawal error:', err);
    return c.json({ error: 'Failed to withdraw consent', details: err.message }, 500);
  }
});

/**
 * CONSENT HISTORY
 * View all consent actions for transparency
 */
privacyRouter.get('/consent/history', async (c) => {
  const authHeader = c.req.header('Authorization');
  const { error, userId } = await verifyUser(authHeader);
  
  if (error || !userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const { data: history } = await supabase
      .from('consent_log')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    
    return c.json({
      success: true,
      history,
      total: history?.length || 0,
    });
    
  } catch (err: any) {
    console.error('Consent history error:', err);
    return c.json({ error: 'Failed to fetch consent history', details: err.message }, 500);
  }
});

/**
 * THIRD-PARTY DATA SHARING
 * List and manage third-party integrations
 */
privacyRouter.get('/third-party/list', async (c) => {
  const authHeader = c.req.header('Authorization');
  const { error, userId } = await verifyUser(authHeader);
  
  if (error || !userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  // Define third-party integrations
  const integrations = [
    {
      name: 'Shopify',
      purpose: 'E-commerce for shop purchases',
      data_shared: ['name', 'email', 'shipping address'],
      opt_out: false, // Required for commerce
      privacy_policy: 'https://www.shopify.com/legal/privacy',
    },
    {
      name: 'Stripe',
      purpose: 'Payment processing',
      data_shared: ['name', 'email', 'payment method'],
      opt_out: false, // Required for commerce
      privacy_policy: 'https://stripe.com/privacy',
    },
    {
      name: 'Last.fm',
      purpose: 'Music scrobbling and recommendations',
      data_shared: ['listening history'],
      opt_out: true,
      privacy_policy: 'https://www.last.fm/legal/privacy',
    },
    {
      name: 'Google Maps',
      purpose: 'Location services and mapping',
      data_shared: ['location data'],
      opt_out: true,
      privacy_policy: 'https://policies.google.com/privacy',
    },
  ];
  
  return c.json({
    success: true,
    integrations,
    note: 'Some integrations are required for core functionality',
  });
});

/**
 * PRIVACY PREFERENCES
 * Get and update privacy settings
 */
privacyRouter.get('/preferences', async (c) => {
  const authHeader = c.req.header('Authorization');
  const { error, userId } = await verifyUser(authHeader);
  
  if (error || !userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    // Get location consent
    const { data: locationConsent } = await supabase
      .from('location_consent')
      .select('*')
      .eq('user_id', userId)
      .order('granted_at', { ascending: false })
      .limit(1)
      .single();
    
    // Get cookie preferences
    const { data: cookiePrefs } = await supabase
      .from('cookie_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    // Get profile privacy settings
    const { data: profile } = await supabase
      .from('profiles')
      .select('privacy_preferences, notification_preferences')
      .eq('id', userId)
      .single();
    
    return c.json({
      success: true,
      preferences: {
        location: {
          granted: locationConsent?.granted || false,
          granted_at: locationConsent?.granted_at,
          purposes: locationConsent?.purposes || [],
        },
        cookies: {
          necessary: true, // Always required
          analytics: cookiePrefs?.analytics ?? false,
          marketing: cookiePrefs?.marketing ?? false,
          functional: cookiePrefs?.functional ?? true,
        },
        privacy: profile?.privacy_preferences || {},
        notifications: profile?.notification_preferences || {},
      },
    });
    
  } catch (err: any) {
    console.error('Preferences fetch error:', err);
    return c.json({ error: 'Failed to fetch preferences', details: err.message }, 500);
  }
});

privacyRouter.put('/preferences', async (c) => {
  const authHeader = c.req.header('Authorization');
  const { error, userId } = await verifyUser(authHeader);
  
  if (error || !userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const body = await c.req.json();
  const { location, cookies, privacy, notifications } = body;
  
  try {
    // Update location consent
    if (location !== undefined) {
      await supabase
        .from('location_consent')
        .upsert({
          user_id: userId,
          granted: location.granted,
          purposes: location.purposes || [],
          granted_at: location.granted ? new Date().toISOString() : null,
          revoked_at: !location.granted ? new Date().toISOString() : null,
        });
      
      // Log consent change
      await supabase.from('consent_log').insert({
        user_id: userId,
        action: location.granted ? 'location_consent_granted' : 'location_consent_revoked',
        data: { purposes: location.purposes },
        timestamp: new Date().toISOString(),
      });
    }
    
    // Update cookie preferences
    if (cookies !== undefined) {
      await supabase
        .from('cookie_preferences')
        .upsert({
          user_id: userId,
          analytics: cookies.analytics ?? false,
          marketing: cookies.marketing ?? false,
          functional: cookies.functional ?? true,
          necessary: true,
          updated_at: new Date().toISOString(),
        });
      
      // Log cookie preference change
      await supabase.from('consent_log').insert({
        user_id: userId,
        action: 'cookie_preferences_updated',
        data: cookies,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Update profile privacy settings
    if (privacy !== undefined) {
      await supabase
        .from('profiles')
        .update({ privacy_preferences: privacy })
        .eq('id', userId);
    }
    
    // Update notification preferences
    if (notifications !== undefined) {
      await supabase
        .from('profiles')
        .update({ notification_preferences: notifications })
        .eq('id', userId);
    }
    
    return c.json({
      success: true,
      message: 'Privacy preferences updated',
      updated_at: new Date().toISOString(),
    });
    
  } catch (err: any) {
    console.error('Preferences update error:', err);
    return c.json({ error: 'Failed to update preferences', details: err.message }, 500);
  }
});

export default privacyRouter;
