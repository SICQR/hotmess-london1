/**
 * HOTMESS AUTO-INTEL ENGINE API
 * Automated event intelligence, drops, trends, and cultural data
 */

import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

/**
 * POST /intel/events/normalise
 * Normalize raw scraped events into unified schema
 */
app.post('/events/normalise', async (c) => {
  try {
    // Get all unprocessed raw events
    const rawEvents = await kv.getByPrefix('event_raw:');
    
    const normalized = [];
    
    for (const raw of rawEvents) {
      const event = normalizeEvent(raw);
      if (event) {
        const eventId = `event:${event.city}:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
        await kv.set(eventId, event);
        normalized.push(event);
        
        // Mark raw as processed
        await kv.set(raw.id + ':processed', true);
      }
    }
    
    return c.json({
      success: true,
      normalized: normalized.length,
      events: normalized,
    });
  } catch (error) {
    console.error('Event normalization error:', error);
    return c.json({ error: 'Failed to normalize events' }, 500);
  }
});

/**
 * Normalize event from various sources
 */
function normalizeEvent(raw: any) {
  const source = raw.source;
  const event: any = {
    id: `event:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
    city: 'london',
    created_at: new Date().toISOString(),
  };
  
  try {
    // Normalize based on source
    switch (source) {
      case 'resident_advisor':
        event.title = raw.raw_data?.title || raw.raw_data?.event_name;
        event.venue = raw.raw_data?.venue;
        event.date = raw.raw_data?.date;
        event.time = raw.raw_data?.time;
        event.ticket_url = raw.raw_data?.link;
        event.category = 'club';
        event.image = raw.raw_data?.image;
        break;
        
      case 'qx':
        event.title = raw.raw_data?.title;
        event.venue = raw.raw_data?.venue;
        event.date = raw.raw_data?.start_date;
        event.category = 'queer';
        event.ticket_url = raw.raw_data?.url;
        break;
        
      case 'gaytimes':
        event.title = raw.raw_data?.event_title;
        event.venue = raw.raw_data?.location;
        event.date = raw.raw_data?.event_date;
        event.category = 'queer';
        event.ticket_url = raw.raw_data?.ticket_link;
        break;
        
      case 'eventbrite':
        event.title = raw.raw_data?.name?.text;
        event.venue = raw.raw_data?.venue?.name;
        event.date = raw.raw_data?.start?.local;
        event.ticket_url = raw.raw_data?.url;
        event.category = 'party';
        event.image = raw.raw_data?.logo?.url;
        break;
        
      default:
        return null;
    }
    
    // Validate required fields
    if (!event.title || !event.date) {
      return null;
    }
    
    return event;
  } catch (error) {
    console.error('Event parse error:', error);
    return null;
  }
}

/**
 * GET /intel/events/:city
 * Get all events for a city
 */
app.get('/events/:city', async (c) => {
  try {
    const city = c.req.param('city');
    const events = await kv.getByPrefix(`event:${city}:`);
    
    // Filter to upcoming events only
    const upcoming = events.filter((e: any) => {
      const eventDate = new Date(e.date);
      return eventDate >= new Date();
    });
    
    // Sort by date
    upcoming.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return c.json({ city, events: upcoming });
  } catch (error) {
    console.error('Get events error:', error);
    return c.json({ error: 'Failed to get events' }, 500);
  }
});

/**
 * GET /intel/tonight/:city
 * Get tonight's digest for a city
 */
app.get('/tonight/:city', async (c) => {
  try {
    const city = c.req.param('city');
    const today = new Date().toISOString().split('T')[0];
    
    // Get all events
    const allEvents = await kv.getByPrefix(`event:${city}:`);
    
    // Filter to today's events
    const tonightEvents = allEvents.filter((e: any) => {
      const eventDate = new Date(e.date).toISOString().split('T')[0];
      return eventDate === today;
    });
    
    // Get set times
    const setTimes = await kv.getByPrefix(`settime:${city}:${today}`);
    
    // Build summary
    const summary = `${tonightEvents.length} events happening tonight in ${city.toUpperCase()}`;
    
    return c.json({
      city,
      date: today,
      events: tonightEvents,
      set_times: setTimes,
      summary,
      total_events: tonightEvents.length,
    });
  } catch (error) {
    console.error('Tonight digest error:', error);
    return c.json({ error: 'Failed to get tonight digest' }, 500);
  }
});

/**
 * POST /intel/settimes
 * Save DJ set times
 */
app.post('/settimes', async (c) => {
  try {
    const body = await c.req.json();
    const { venue, city, date, lineup, source } = body;
    
    if (!venue || !city || !date || !lineup) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const setTimeId = `settime:${city}:${date}:${venue.toLowerCase().replace(/\s+/g, '-')}`;
    
    const setTime = {
      id: setTimeId,
      venue,
      city,
      date,
      lineup,
      source: source || 'manual',
      posted_at: new Date().toISOString(),
    };
    
    await kv.set(setTimeId, setTime);
    
    return c.json({ success: true, set_time: setTime });
  } catch (error) {
    console.error('Set times save error:', error);
    return c.json({ error: 'Failed to save set times' }, 500);
  }
});

/**
 * POST /intel/music/drop
 * Process RAW CONVICT music drop
 */
app.post('/music/drop', async (c) => {
  try {
    const body = await c.req.json();
    const { title, artist, release_type, artwork_url, spotify_url, soundcloud_url } = body;
    
    if (!title || !artist) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const releaseId = `release:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    
    const release = {
      id: releaseId,
      title,
      artist,
      release_type: release_type || 'single',
      release_date: new Date().toISOString(),
      artwork_url,
      spotify_url,
      soundcloud_url,
      drop_announced_at: new Date().toISOString(),
    };
    
    await kv.set(releaseId, release);
    
    // TODO: Trigger poster generation
    // TODO: Trigger Telegram notifications
    // TODO: Award XP to first 50 listeners
    
    return c.json({ success: true, release });
  } catch (error) {
    console.error('Music drop error:', error);
    return c.json({ error: 'Failed to process music drop' }, 500);
  }
});

/**
 * POST /intel/sentiment/analyze
 * Analyze room sentiment (AI-powered)
 */
app.post('/sentiment/analyze', async (c) => {
  try {
    const body = await c.req.json();
    const { room_id, room_name, messages } = body;
    
    if (!room_id || !messages || messages.length === 0) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // TODO: Call OpenAI for sentiment analysis
    // For now, simple keyword matching
    const messagesText = messages.join(' ').toLowerCase();
    
    let label = 'neutral';
    let confidence = 0.5;
    
    // Safety keywords
    if (messagesText.includes('unsafe') || messagesText.includes('help') || messagesText.includes('scared')) {
      label = 'unsafe';
      confidence = 0.9;
    }
    // Messy keywords
    else if (messagesText.includes('drama') || messagesText.includes('fight') || messagesText.includes('wtf')) {
      label = 'messy';
      confidence = 0.7;
    }
    // Positive keywords
    else if (messagesText.includes('amazing') || messagesText.includes('love') || messagesText.includes('great')) {
      label = 'positive';
      confidence = 0.8;
    }
    
    const sentimentLog = {
      id: `sentiment:${room_id}:${Date.now()}`,
      room_id,
      room_name,
      label,
      confidence,
      sample_messages: messages.slice(0, 5),
      analyzed_at: new Date().toISOString(),
    };
    
    await kv.set(sentimentLog.id, sentimentLog);
    
    // If unsafe, trigger alert
    if (label === 'unsafe') {
      // TODO: Notify hosts
      console.log(`🚨 UNSAFE VIBE DETECTED IN ${room_name}`);
    }
    
    return c.json({ success: true, sentiment: sentimentLog });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return c.json({ error: 'Failed to analyze sentiment' }, 500);
  }
});

/**
 * GET /intel/city/:city/full
 * Get complete intel package for a city
 */
app.get('/city/:city/full', async (c) => {
  try {
    const city = c.req.param('city');
    
    // Fetch all data types
    const events = await kv.getByPrefix(`event:${city}:`);
    const setTimes = await kv.getByPrefix(`settime:${city}:`);
    const markets = await kv.getByPrefix(`market:${city}:`);
    const sexEvents = await kv.getByPrefix(`sex_event:${city}:`);
    const prideEvents = await kv.getByPrefix(`pride:${city}:`);
    const festivals = await kv.getByPrefix(`festival:${city}:`);
    const releases = await kv.getByPrefix(`release:`); // Global
    const trends = await kv.get(`trends:${city}:latest`);
    const vibe = await kv.get(`sentiment:${city}:latest`);
    
    return c.json({
      city,
      events: events.filter((e: any) => new Date(e.date) >= new Date()),
      set_times: setTimes,
      queer_markets: markets,
      sex_positive_events: sexEvents,
      pride_events: prideEvents,
      festivals,
      releases,
      trends,
      vibe,
      last_updated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('City intel error:', error);
    return c.json({ error: 'Failed to get city intel' }, 500);
  }
});

/**
 * GET /intel/cities
 * Get list of active cities
 */
app.get('/cities', async (c) => {
  try {
    const cities = await kv.get('cities:active') || [
      {
        id: 'london',
        name: 'London',
        country: 'UK',
        coordinates: {
          lat: 51.5074,
          lng: -0.1278,
          x: -0.05,
          y: 0.51,
          z: 0.86,
        },
        timezone: 'Europe/London',
        active: true,
      },
      // More cities can be added
    ];
    
    return c.json({ cities });
  } catch (error) {
    console.error('Cities error:', error);
    return c.json({ error: 'Failed to get cities' }, 500);
  }
});

/**
 * POST /intel/pride
 * Add Pride event
 */
app.post('/pride', async (c) => {
  try {
    const body = await c.req.json();
    const { name, city, country, date, type, website } = body;
    
    if (!name || !city || !date) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const prideId = `pride:${city}:${date}:${Math.random().toString(36).substr(2, 9)}`;
    
    const pride = {
      id: prideId,
      name,
      city,
      country: country || 'UK',
      date,
      type: type || 'parade',
      website,
      created_at: new Date().toISOString(),
    };
    
    await kv.set(prideId, pride);
    
    return c.json({ success: true, pride });
  } catch (error) {
    console.error('Pride event error:', error);
    return c.json({ error: 'Failed to add Pride event' }, 500);
  }
});

/**
 * POST /intel/market
 * Add queer market/pop-up
 */
app.post('/market', async (c) => {
  try {
    const body = await c.req.json();
    const { title, location, city, date, time, type, instagram } = body;
    
    if (!title || !location || !date) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const marketId = `market:${city}:${date}:${Math.random().toString(36).substr(2, 9)}`;
    
    const market = {
      id: marketId,
      title,
      location,
      city: city || 'london',
      date,
      time,
      type: type || 'market',
      instagram,
      created_at: new Date().toISOString(),
    };
    
    await kv.set(marketId, market);
    
    return c.json({ success: true, market });
  } catch (error) {
    console.error('Market error:', error);
    return c.json({ error: 'Failed to add market' }, 500);
  }
});

export default app;
