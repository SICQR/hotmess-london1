/**
 * QR CODE GENERATION ROUTES
 * GET /make-server-a670c824/qr/:code - Generate QR for beacon
 * GET /make-server-a670c824/qr/:code.svg - SVG format
 * GET /make-server-a670c824/qr/:code.png - PNG format
 * GET /make-server-a670c824/qr/signed/:payload.:sig - Signed beacon QR
 */

import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import { renderStyledQrSvg, type QrStyleName, generateQrMatrix } from '../qr-styles';
import { parseSignedPayload } from '../beacon-signatures';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const app = new Hono();

app.use('*', cors());

const BASE_URL = 'https://hotmess.london';

/**
 * GET /qr/:codeWithExt
 * Supports: /qr/ABC123 (default SVG), /qr/ABC123.svg, /qr/ABC123.png
 * Query params: ?style=hotmess&size=512
 * Note: PNG not supported in this version, returns SVG
 */
app.get('/qr/:codeWithExt', async (c) => {
  try {
    const codeWithExt = c.req.param('codeWithExt');
    if (!codeWithExt) {
      return c.text('Missing code', 400);
    }

    // Parse code and extension
    const parts = codeWithExt.split('.');
    const code = parts[0];
    const ext = parts[1] || 'svg'; // default to SVG

    // Get query params
    const style = (c.req.query('style') || 'raw') as QrStyleName;
    const size = parseInt(c.req.query('size') || '512', 10);

    // Optional: Validate beacon exists and is active
    // const supabase = createClient(
    //   Deno.env.get('SUPABASE_URL')!,
    //   Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    // );
    // const { data: beacon } = await supabase
    //   .from('beacons_a670c824')
    //   .select('*')
    //   .eq('code', code)
    //   .single();
    // if (!beacon || beacon.status !== 'active') {
    //   return c.text('Beacon not found or inactive', 404);
    // }

    const targetUrl = `${BASE_URL}/l/${encodeURIComponent(code)}`;

    // Generate QR matrix
    const modules = generateQrMatrix(targetUrl);
    
    // Render as SVG (PNG not supported in this version)
    const svg = renderStyledQrSvg(modules, { size, style });

    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    });
  } catch (err) {
    console.error('QR generation error:', err);
    return c.text('QR generation failed: ' + (err as Error).message, 500);
  }
});

/**
 * GET /qr/signed/:payloadSig
 * Example: /qr/signed/eyJjb2Rl...abc123.def456.svg
 */
app.get('/qr/signed/:payloadSig', async (c) => {
  try {
    const payloadSig = c.req.param('payloadSig');
    if (!payloadSig) {
      return c.text('Missing payload', 400);
    }

    // Parse format: payload.signature.ext or payload.signature
    const parts = payloadSig.split('.');
    if (parts.length < 2) {
      return c.text('Invalid signed payload format', 400);
    }

    const payload = parts[0];
    const signature = parts[1];
    const ext = parts[2] || 'svg'; // default to SVG for signed codes

    // Get query params
    const style = (c.req.query('style') || 'stealth') as QrStyleName;
    const size = parseInt(c.req.query('size') || '512', 10);

    // Verify signature
    const secret = Deno.env.get('BEACON_SECRET');
    if (!secret) {
      return c.text('Server configuration error', 500);
    }

    const verification = parseSignedPayload(`${payload}.${signature}`, secret);
    if (!verification.valid) {
      return c.text(`Invalid signature: ${verification.error}`, 403);
    }

    const targetUrl = `${BASE_URL}/x/${payload}.${signature}`;

    // Generate QR matrix
    const modules = generateQrMatrix(targetUrl);
    
    // Render as SVG
    const svg = renderStyledQrSvg(modules, { size, style });

    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600', // 1 hour cache for signed codes
    });
  } catch (err) {
    console.error('Signed QR generation error:', err);
    return c.text('Signed QR generation failed: ' + (err as Error).message, 500);
  }
});

export default app;