/**
 * BEACON RESOLVE ROUTE - /l/:code
 * Normal beacon scanning endpoint
 * Looks up beacon, records scan, returns redirect or JSON
 */

import { Hono } from 'npm:hono@4.10.6';
import { cors } from 'npm:hono/cors';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const app = new Hono();

app.use('*', cors());

/**
 * GET /l/:code
 * Resolve a beacon by code and redirect to appropriate page
 */
app.get('/l/:code', async (c) => {
  try {
    const code = c.req.param('code');
    if (!code) {
      return c.json({ error: 'Missing beacon code' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Load beacon
    const { data: beacon, error } = await supabase
      .from('beacons_a670c824')
      .select('*')
      .eq('code', code)
      .single();

    if (error || !beacon) {
      console.error('Beacon not found:', code, error);
      return c.json({ error: 'Beacon not found' }, 404);
    }

    // Check if beacon is active
    if (beacon.status !== 'active') {
      return c.json({ error: 'Beacon is not active', status: beacon.status }, 403);
    }

    // Check time window if configured
    if (beacon.time_window_start || beacon.time_window_end) {
      const now = new Date();
      const start = beacon.time_window_start
        ? new Date(beacon.time_window_start)
        : null;
      const end = beacon.time_window_end ? new Date(beacon.time_window_end) : null;

      if (start && now < start) {
        return c.json({ error: 'Beacon not yet active', startsAt: start }, 403);
      }
      if (end && now > end) {
        return c.json({ error: 'Beacon has expired', endedAt: end }, 403);
      }
    }

    // Increment scan count (fire and forget)
    supabase
      .from('beacons_a670c824')
      .update({ scan_count: (beacon.scan_count || 0) + 1 })
      .eq('id', beacon.id)
      .then(() => {})
      .catch((err) => console.error('Failed to increment scan count:', err));

    // TODO: Record scan in beacon_scans table with user info, timestamp, etc.

    // Determine redirect based on beacon type
    let redirectUrl = '/';

    if (beacon.type === 'transaction') {
      // Transaction beacons: redirect to product/ticket/drop page
      switch (beacon.subtype) {
        case 'ticket':
          redirectUrl = `/tickets?beacon=${code}`;
          break;
        case 'product':
          redirectUrl = `/shop?beacon=${code}`;
          break;
        case 'drop':
          redirectUrl = `/drops?beacon=${code}`;
          break;
        default:
          redirectUrl = `/scan-result?code=${code}`;
      }
    } else if (beacon.type === 'presence') {
      // Presence beacons: show scan result with XP
      redirectUrl = `/scan-result?code=${code}`;
    } else {
      // Default: scan result page
      redirectUrl = `/scan-result?code=${code}`;
    }

    // Return JSON for API calls, redirect for browser
    const acceptsJson = c.req.header('Accept')?.includes('application/json');
    if (acceptsJson) {
      return c.json({
        success: true,
        beacon: {
          id: beacon.id,
          code: beacon.code,
          label: beacon.label,
          type: beacon.type,
          subtype: beacon.subtype,
          xp_base: beacon.xp_base,
        },
        redirect: redirectUrl,
      });
    }

    // Redirect to app
    return c.redirect(`${Deno.env.get('APP_BASE_URL') || 'https://hotmessldn.com'}${redirectUrl}`);
  } catch (err) {
    console.error('Beacon resolve error:', err);
    return c.json({ error: 'Failed to resolve beacon' }, 500);
  }
});

export default app;