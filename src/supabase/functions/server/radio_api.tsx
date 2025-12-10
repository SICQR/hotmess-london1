/**
 * HOTMESS - RadioKing Live Listeners API
 * Fetches real-time listener data from RadioKing
 */

import { Hono } from 'npm:hono@4.10.6';

const app = new Hono();

// RadioKing API configuration
const RADIOKING_STATION_ID = Deno.env.get('RADIOKING_STATION_ID') || '';
const RADIOKING_API_KEY = Deno.env.get('RADIOKING_API_KEY') || '';

interface RadioKingStatus {
  listeners: {
    current: number;
    unique: number;
    peak: number;
  };
  now: {
    title: string;
    artist: string;
    cover: string;
    duration: number;
    started_at: string;
  };
  stream: {
    online: boolean;
    bitrate: number;
  };
}

interface RadioStatus {
  listeners: number;
  uniqueListeners: number;
  peakListeners: number;
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
 * GET /listeners
 * Returns current listener count and track info
 */
app.get('/listeners', async (c) => {
  try {
    // Check if RadioKing credentials are configured
    if (!RADIOKING_STATION_ID || !RADIOKING_API_KEY) {
      console.warn('⚠️ RadioKing API not configured - returning mock data');
      return c.json({
        listeners: 248,
        uniqueListeners: 221,
        peakListeners: 341,
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

    // Fetch from RadioKing API
    const response = await fetch(
      `https://api.radioking.io/v1/radio/${RADIOKING_STATION_ID}/status`,
      {
        headers: {
          'Authorization': `Bearer ${RADIOKING_API_KEY}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('RadioKing API error:', response.status);
      throw new Error('Failed to fetch RadioKing data');
    }

    const data: RadioKingStatus = await response.json();

    const status: RadioStatus = {
      listeners: data.listeners.current,
      uniqueListeners: data.listeners.unique,
      peakListeners: data.listeners.peak,
      currentTrack: {
        title: data.now.title || 'RAW CONVICT RADIO',
        artist: data.now.artist || 'HOTMESS',
        artwork: data.now.cover || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
        startedAt: data.now.started_at,
        duration: data.now.duration,
      },
      isLive: data.stream.online,
      timestamp: new Date().toISOString(),
    };

    console.log('✅ RadioKing data fetched:', status.listeners, 'listeners');

    return c.json(status);
  } catch (error: any) {
    console.error('❌ RadioKing API error:', error);
    
    // Return fallback data instead of error (graceful degradation)
    return c.json({
      listeners: 0,
      uniqueListeners: 0,
      peakListeners: 0,
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
 * POST /track-listen
 * Award XP for listening to radio
 */
app.post('/track-listen', async (c) => {
  try {
    const { userId, durationSeconds } = await c.req.json();

    if (!userId) {
      return c.json({ error: 'User ID required' }, 400);
    }

    // Award XP based on listen duration
    let xp = 10; // Base XP for starting stream
    
    if (durationSeconds >= 600) { // 10+ minutes
      xp = 20;
    }
    
    if (durationSeconds >= 1800) { // 30+ minutes
      xp = 50;
    }

    console.log(`✅ Radio listen tracked: ${userId} - ${durationSeconds}s - +${xp} XP`);

    return c.json({
      success: true,
      xp,
      message: `+${xp} XP for listening to RAW CONVICT RADIO`,
    });
  } catch (error: any) {
    console.error('❌ Track listen error:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
