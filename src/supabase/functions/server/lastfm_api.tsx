/**
 * HOTMESS - Last.fm API Integration
 * Now Playing, Scrobbling, and Radio Stats via Last.fm
 */

import { Hono } from 'npm:hono@4.10.6';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const app = new Hono();

// Last.fm API configuration
const LASTFM_API_KEY = Deno.env.get('LASTFM_API_KEY') || '';
const LASTFM_SHARED_SECRET = Deno.env.get('LASTFM_SHARED_SECRET') || '';
const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';

interface LastFmTrack {
  name: string;
  artist: {
    '#text': string;
  };
  image: Array<{
    size: string;
    '#text': string;
  }>;
  date?: {
    uts: string;
  };
}

interface NowPlayingResponse {
  listeners: number;
  currentTrack: {
    title: string;
    artist: string;
    artwork: string;
    startedAt: string;
    duration: number;
  };
  isLive: boolean;
  timestamp: string;
}

/**
 * GET /auth/callback
 * Last.fm authentication callback
 */
app.get('/auth/callback', async (c) => {
  try {
    const token = c.req.query('token');
    
    if (!token) {
      return c.json({ error: 'No token provided' }, 400);
    }

    // Exchange token for session key
    const params = new URLSearchParams({
      method: 'auth.getSession',
      api_key: LASTFM_API_KEY,
      token,
      format: 'json',
    });

    // Generate API signature
    const sig = await generateSignature({
      method: 'auth.getSession',
      api_key: LASTFM_API_KEY,
      token,
    });
    params.append('api_sig', sig);

    const response = await fetch(`${LASTFM_API_URL}?${params}`);
    const data = await response.json();

    if (data.error) {
      console.error('Last.fm auth error:', data.message);
      return c.json({ error: data.message }, 400);
    }

    const sessionKey = data.session.key;
    const username = data.session.name;

    console.log('✅ Last.fm authenticated:', username);

    // Store session key in KV store
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );

    // Store in KV for server use
    await supabase
      .from('kv_store_a670c824')
      .upsert({
        key: 'lastfm:session',
        value: JSON.stringify({
          sessionKey,
          username,
          authenticatedAt: new Date().toISOString(),
        }),
      });

    // Redirect to success page
    const appUrl = Deno.env.get('APP_BASE_URL') || 'https://hotmessldn.com';
    return c.redirect(`${appUrl}/radio?lastfm=connected`);
  } catch (error: any) {
    console.error('❌ Last.fm callback error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /now-playing
 * Get current track from Last.fm user
 */
app.get('/now-playing', async (c) => {
  try {
    if (!LASTFM_API_KEY) {
      console.warn('⚠️ Last.fm API not configured - returning mock data');
      return c.json({
        listeners: 248,
        currentTrack: {
          title: 'Wet Black Chrome',
          artist: 'RAW CONVICT',
          artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
          startedAt: new Date().toISOString(),
          duration: 180,
        },
        isLive: true,
        timestamp: new Date().toISOString(),
        mock: true,
      });
    }

    // Get session key from KV
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );

    const { data: kvData } = await supabase
      .from('kv_store_a670c824')
      .select('value')
      .eq('key', 'lastfm:session')
      .single();

    if (!kvData?.value) {
      return c.json({
        message: 'Last.fm account not connected',
        authUrl: `https://www.last.fm/api/auth/?api_key=${LASTFM_API_KEY}&cb=${Deno.env.get('APP_BASE_URL') || 'https://hotmessldn.com'}/api/lastfm/auth/callback`,
      }, 401);
    }

    const session = JSON.parse(kvData.value);
    const username = session.username;

    // Fetch recent tracks from Last.fm
    const params = new URLSearchParams({
      method: 'user.getRecentTracks',
      user: username,
      api_key: LASTFM_API_KEY,
      format: 'json',
      limit: '1',
    });

    const response = await fetch(`${LASTFM_API_URL}?${params}`);
    const data = await response.json();

    if (data.error) {
      console.error('Last.fm API error:', data.message);
      return c.json({ error: data.message }, 400);
    }

    const tracks = data.recenttracks?.track || [];
    if (tracks.length === 0) {
      return c.json({
        listeners: 0,
        currentTrack: {
          title: 'RAW CONVICT RADIO',
          artist: 'HOTMESS LONDON',
          artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
          startedAt: new Date().toISOString(),
          duration: 0,
        },
        isLive: false,
        timestamp: new Date().toISOString(),
      });
    }

    const track = tracks[0];
    const isNowPlaying = track['@attr']?.nowplaying === 'true';
    
    // Get artwork (prefer large size)
    let artwork = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600';
    const largeImage = track.image?.find((img: any) => img.size === 'large' || img.size === 'extralarge');
    if (largeImage?.['#text']) {
      artwork = largeImage['#text'];
    }

    const nowPlaying: NowPlayingResponse = {
      listeners: isNowPlaying ? 1 : 0, // Last.fm doesn't provide listener count for personal accounts
      currentTrack: {
        title: track.name || 'RAW CONVICT RADIO',
        artist: track.artist?.['#text'] || 'HOTMESS LONDON',
        artwork,
        startedAt: track.date?.uts ? new Date(parseInt(track.date.uts) * 1000).toISOString() : new Date().toISOString(),
        duration: 0, // Last.fm doesn't provide duration in recent tracks
      },
      isLive: isNowPlaying,
      timestamp: new Date().toISOString(),
    };

    console.log('✅ Last.fm now playing:', nowPlaying.currentTrack.title);

    return c.json(nowPlaying);
  } catch (error: any) {
    console.error('❌ Last.fm now playing error:', error);
    
    // Return fallback data instead of error (graceful degradation)
    return c.json({
      listeners: 0,
      currentTrack: {
        title: 'RAW CONVICT RADIO',
        artist: 'HOTMESS LONDON',
        artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
        startedAt: new Date().toISOString(),
        duration: 0,
      },
      isLive: false,
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

/**
 * POST /scrobble
 * Scrobble a track to Last.fm
 */
app.post('/scrobble', async (c) => {
  try {
    const { artist, track, timestamp, album, duration } = await c.req.json();

    if (!artist || !track) {
      return c.json({ error: 'Artist and track required' }, 400);
    }

    // Get session key from KV
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );

    const { data: kvData } = await supabase
      .from('kv_store_a670c824')
      .select('value')
      .eq('key', 'lastfm:session')
      .single();

    if (!kvData?.value) {
      return c.json({ error: 'Last.fm not authenticated' }, 401);
    }

    const session = JSON.parse(kvData.value);
    const sessionKey = session.sessionKey;

    // Build scrobble parameters
    const params: Record<string, string> = {
      method: 'track.scrobble',
      api_key: LASTFM_API_KEY,
      sk: sessionKey,
      artist,
      track,
      timestamp: timestamp || Math.floor(Date.now() / 1000).toString(),
    };

    if (album) params.album = album;
    if (duration) params.duration = duration.toString();

    // Generate API signature
    const sig = await generateSignature(params);
    params.api_sig = sig;
    params.format = 'json';

    // Send scrobble request
    const response = await fetch(LASTFM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Last.fm scrobble error:', data.message);
      return c.json({ error: data.message }, 400);
    }

    console.log('✅ Scrobbled:', track, 'by', artist);

    return c.json({
      success: true,
      scrobbles: data.scrobbles,
    });
  } catch (error: any) {
    console.error('❌ Scrobble error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /auth/status
 * Check if Last.fm is authenticated
 */
app.get('/auth/status', async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );

    const { data: kvData } = await supabase
      .from('kv_store_a670c824')
      .select('value')
      .eq('key', 'lastfm:session')
      .single();

    if (!kvData?.value) {
      return c.json({
        authenticated: false,
        authUrl: `https://www.last.fm/api/auth/?api_key=${LASTFM_API_KEY}&cb=${encodeURIComponent(`${Deno.env.get('APP_BASE_URL') || 'https://hotmessldn.com'}/api/lastfm/auth/callback`)}`,
      });
    }

    const session = JSON.parse(kvData.value);

    return c.json({
      authenticated: true,
      username: session.username,
      authenticatedAt: session.authenticatedAt,
    });
  } catch (error: any) {
    console.error('❌ Auth status error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Helper: Generate Last.fm API signature
 */
async function generateSignature(params: Record<string, string>): Promise<string> {
  // Sort parameters alphabetically
  const sorted = Object.keys(params)
    .filter(key => key !== 'format' && key !== 'callback')
    .sort()
    .map(key => `${key}${params[key]}`)
    .join('');

  // Append shared secret
  const sigString = sorted + LASTFM_SHARED_SECRET;

  // Generate MD5 hash
  // NOTE: MD5 is required by Last.fm API specification (external requirement)
  // This is not used for security purposes, only for API authentication
  const encoder = new TextEncoder();
  const data = encoder.encode(sigString);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

export default app;