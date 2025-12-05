/**
 * SIGNED BEACON ROUTE - /x/:payload.:sig
 * For encrypted/signed one-time codes (hook-ups, resale, etc.)
 */

import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import { parseSignedPayload } from '../beacon-signatures';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const app = new Hono();

app.use('*', cors());

/**
 * GET /x/:payloadSig
 * Example: /x/eyJjb2Rl...abc123.def456
 */
app.get('/x/:payloadSig', async (c) => {
  try {
    const payloadSig = c.req.param('payloadSig');
    if (!payloadSig) {
      return c.json({ error: 'Missing signed payload' }, 400);
    }

    const secret = Deno.env.get('BEACON_SECRET');
    if (!secret) {
      console.error('BEACON_SECRET not configured');
      return c.json({ error: 'Server configuration error' }, 500);
    }

    // Verify and parse payload
    const verification = parseSignedPayload(payloadSig, secret);
    if (!verification.valid) {
      console.error('Invalid signed beacon:', verification.error);
      return c.json({ error: verification.error || 'Invalid signature' }, 403);
    }

    const payload = verification.payload!;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Load beacon
    const { data: beacon, error } = await supabase
      .from('beacons_a670c824')
      .select('*')
      .eq('code', payload.code)
      .single();

    if (error || !beacon) {
      console.error('Beacon not found:', payload.code, error);
      return c.json({ error: 'Beacon not found' }, 404);
    }

    // Check if beacon is active
    if (beacon.status !== 'active') {
      return c.json({ error: 'Beacon is not active', status: beacon.status }, 403);
    }

    // TODO: Record signed scan with nonce, kind, exp for analytics
    // This allows tracking one-time codes, hook-up beacons, etc.

    // Increment scan count (fire and forget)
    supabase
      .from('beacons_a670c824')
      .update({ scan_count: (beacon.scan_count || 0) + 1 })
      .eq('id', beacon.id)
      .then(() => {})
      .catch((err) => console.error('Failed to increment scan count:', err));

    // Determine redirect based on beacon kind and type
    let redirectUrl = '/';

    if (payload.kind === 'person') {
      // Hook-up beacon - show profile or connect flow
      redirectUrl = `/connect/profile?beacon=${payload.code}&kind=person`;
    } else if (payload.kind === 'resale') {
      // Ticket resale - show ticket claim flow
      redirectUrl = `/tickets/claim?beacon=${payload.code}&resale=true`;
    } else if (payload.kind === 'one_night_room') {
      // Private room access
      redirectUrl = `/rooms/${payload.code}?private=true`;
    } else {
      // Default: fallback to normal beacon flow
      if (beacon.type === 'transaction') {
        switch (beacon.subtype) {
          case 'ticket':
            redirectUrl = `/tickets?beacon=${payload.code}`;
            break;
          case 'product':
            redirectUrl = `/shop?beacon=${payload.code}`;
            break;
          case 'drop':
            redirectUrl = `/drops?beacon=${payload.code}`;
            break;
          default:
            redirectUrl = `/scan-result?code=${payload.code}`;
        }
      } else {
        redirectUrl = `/scan-result?code=${payload.code}`;
      }
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
        signed: {
          kind: payload.kind,
          exp: payload.exp,
          nonce: payload.nonce,
        },
        redirect: redirectUrl,
      });
    }

    // Redirect to app
    return c.redirect(`${Deno.env.get('APP_BASE_URL') || 'https://hotmess.london'}${redirectUrl}`);
  } catch (err) {
    console.error('Signed beacon resolve error:', err);
    return c.json({ error: 'Failed to resolve signed beacon' }, 500);
  }
});

export default app;