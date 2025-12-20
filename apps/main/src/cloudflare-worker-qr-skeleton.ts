/**
 * HOTMESS QR CLOUDFLARE WORKER
 * 
 * Optional: Deploy this to Cloudflare Workers for global edge QR generation
 * Benefits: Faster, cheaper, global CDN
 * 
 * Deploy: npx wrangler deploy
 */

import { createHmac } from 'crypto';
import QRCode from 'qrcode';

const BASE_URL = 'https://hotmess.london';

interface Env {
  BEACON_SECRET: string;
  // Optional: Add KV for beacon validation cache
  // BEACON_CACHE: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route: /qr/signed/:payload.:sig.:ext
      if (path.startsWith('/qr/signed/')) {
        return await handleSignedQr(request, env, corsHeaders);
      }

      // Route: /qr/:code.:ext
      if (path.startsWith('/qr/')) {
        return await handleBeaconQr(request, env, corsHeaders);
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (err: any) {
      console.error('QR generation error:', err);
      return new Response('QR error: ' + (err?.message || 'unknown'), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};

/**
 * Handle normal beacon QR: /qr/:code.:ext
 */
async function handleBeaconQr(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const [, , codeAndExt] = url.pathname.split('/'); // ['', 'qr', 'ABC123.svg']

  if (!codeAndExt) {
    return new Response('Missing code', { status: 400, headers: corsHeaders });
  }

  const parts = codeAndExt.split('.');
  const code = parts[0];
  const ext = parts[1] || 'png';

  const style = url.searchParams.get('style') || 'raw';
  const size = parseInt(url.searchParams.get('size') || '512', 10);

  // Optional: Validate beacon exists via Supabase API
  // const valid = await validateBeacon(code, env);
  // if (!valid) return new Response('Beacon not found', { status: 404 });

  const targetUrl = `${BASE_URL}/l/${encodeURIComponent(code)}`;

  if (ext === 'svg') {
    const svg = await generateStyledSvg(targetUrl, style, size);
    return new Response(svg, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // PNG
  const pngBuffer = await QRCode.toBuffer(targetUrl, {
    width: size,
    margin: 1,
    errorCorrectionLevel: 'M',
  });

  return new Response(pngBuffer, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

/**
 * Handle signed beacon QR: /qr/signed/:payload.:sig.:ext
 */
async function handleSignedQr(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const [, , , payloadSig] = url.pathname.split('/'); // ['', 'qr', 'signed', 'abc.def.svg']

  if (!payloadSig) {
    return new Response('Missing payload', { status: 400, headers: corsHeaders });
  }

  const parts = payloadSig.split('.');
  if (parts.length < 2) {
    return new Response('Invalid format', { status: 400, headers: corsHeaders });
  }

  const payload = parts[0];
  const signature = parts[1];
  const ext = parts[2] || 'svg';

  const style = url.searchParams.get('style') || 'stealth';
  const size = parseInt(url.searchParams.get('size') || '512', 10);

  // Verify signature
  const expectedSig = base64Url(
    createHmac('sha256', env.BEACON_SECRET).update(payload).digest('base64')
  );

  if (signature !== expectedSig) {
    return new Response('Invalid signature', { status: 403, headers: corsHeaders });
  }

  const targetUrl = `${BASE_URL}/x/${payload}.${signature}`;

  if (ext === 'svg') {
    const svg = await generateStyledSvg(targetUrl, style, size);
    return new Response(svg, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600', // 1 hour cache for signed codes
      },
    });
  }

  // PNG
  const pngBuffer = await QRCode.toBuffer(targetUrl, {
    width: size,
    margin: 1,
    errorCorrectionLevel: 'M',
  });

  return new Response(pngBuffer, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

/**
 * Generate styled SVG QR code
 */
async function generateStyledSvg(data: string, style: string, size: number): Promise<string> {
  const qrData = await QRCode.create(data, { errorCorrectionLevel: 'M' });
  const modules = qrData.modules;
  const count = modules.size;
  const cellSize = size / count;

  switch (style) {
    case 'hotmess':
      return renderHotmessSvg(modules.data, count, cellSize, size);
    case 'chrome':
      return renderChromeSvg(modules.data, count, cellSize, size);
    case 'stealth':
      return renderStealthSvg(modules.data, count, cellSize, size);
    default:
      return renderRawSvg(modules.data, count, cellSize, size);
  }
}

/**
 * RAW style
 */
function renderRawSvg(data: Uint8Array, count: number, cell: number, size: number): string {
  const rects: string[] = [];
  let index = 0;

  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (data[index]) {
        rects.push(`<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" />`);
      }
      index++;
    }
  }

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <rect width="${size}" height="${size}" fill="#ffffff" />
  <g fill="#000000">
    ${rects.join('\n    ')}
  </g>
</svg>`;
}

/**
 * HOTMESS style
 */
function renderHotmessSvg(data: Uint8Array, count: number, cell: number, size: number): string {
  const rects: string[] = [];
  let index = 0;

  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (data[index]) {
        const rx = cell * 0.25;
        rects.push(
          `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" rx="${rx}" ry="${rx}" />`
        );
      }
      index++;
    }
  }

  const logoSize = size * 0.22;
  const logoX = (size - logoSize) / 2;
  const logoY = (size - logoSize) / 2;

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="hotmessGlow">
      <stop offset="0%" stop-color="#ff3366" />
      <stop offset="40%" stop-color="#ffcc00" />
      <stop offset="100%" stop-color="#101010" />
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="#000000" />
  <rect width="${size}" height="${size}" fill="url(#hotmessGlow)" opacity="0.85" />
  <g fill="#f5f5f5">
    ${rects.join('\n    ')}
  </g>
  <rect x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" rx="${
    logoSize * 0.08
  }" fill="#000000" opacity="0.85" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="system-ui" font-size="${logoSize * 0.33}" font-weight="900" 
        letter-spacing="0.16em" fill="#ff1694">
    HOT
  </text>
  <text x="50%" y="${logoY + logoSize * 0.78}" text-anchor="middle"
        font-family="system-ui" font-size="${logoSize * 0.3}" font-weight="700" 
        letter-spacing="0.21em" fill="#ffffff">
    MESS
  </text>
</svg>`;
}

/**
 * CHROME style
 */
function renderChromeSvg(data: Uint8Array, count: number, cell: number, size: number): string {
  const rects: string[] = [];
  let index = 0;

  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (data[index]) {
        rects.push(`<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" />`);
      }
      index++;
    }
  }

  const frame = size * 0.04;

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="chromeMetal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5f5f5" />
      <stop offset="35%" stop-color="#b4b4b4" />
      <stop offset="65%" stop-color="#303030" />
      <stop offset="100%" stop-color="#f5f5f5" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="#050505" />
  <rect x="${frame}" y="${frame}" width="${size - 2 * frame}" height="${
    size - 2 * frame
  }" fill="url(#chromeMetal)" rx="${frame * 0.5}" />
  <g transform="translate(${frame * 1.5}, ${frame * 1.5}) scale(${(size - frame * 3) / size})">
    <g fill="#000000">
      ${rects.join('\n      ')}
    </g>
  </g>
</svg>`;
}

/**
 * STEALTH style
 */
function renderStealthSvg(data: Uint8Array, count: number, cell: number, size: number): string {
  const rects: string[] = [];
  let index = 0;

  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (data[index]) {
        rects.push(`<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" />`);
      }
      index++;
    }
  }

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#050505" />
  <g fill="#f0f0f0" opacity="0.85">
    ${rects.join('\n    ')}
  </g>
</svg>`;
}

/**
 * Base64url encoding
 */
function base64Url(input: string): string {
  return input.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Optional: Validate beacon via Supabase API
 */
// async function validateBeacon(code: string, env: Env): Promise<boolean> {
//   try {
//     const response = await fetch(
//       `https://your-project.supabase.co/rest/v1/beacons_a670c824?code=eq.${code}&select=id`,
//       {
//         headers: {
//           apikey: env.SUPABASE_ANON_KEY,
//           Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
//         },
//       }
//     );
//     const data = await response.json();
//     return data.length > 0;
//   } catch {
//     return false;
//   }
// }
