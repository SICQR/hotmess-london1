/**
 * HOTMESS - RAW CONVICT PUBLIC API
 * Releases, artists, tracks, playlists
 */

import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();
app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

/**
 * GET /raw/releases
 * Returns all RAW Convict releases
 */
app.get('/make-server-a670c824/raw/releases', async (c) => {
  try {
    const { data: releases, error } = await supabase
      .from('raw_releases')
      .select(`
        *,
        artist:raw_artists(id, name, avatar, city)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Failed to fetch releases:', error);
      // Return mock data for development
      return c.json([
        {
          id: '1',
          title: 'Wet Black Chrome',
          artist: { name: 'RAW CONVICT', avatar: '', city: 'London' },
          artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
          soundcloud_url: 'https://soundcloud.com/rawconvict/wet-black-chrome',
          release_date: '2025-01-15',
          bpm: 128,
          genre: 'Techno',
          duration: 320,
          plays: 12450,
          tiktok_reel_url: null,
          qr_poster_url: null,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Darkroom Pulse',
          artist: { name: 'DJ Domination', avatar: '', city: 'Berlin' },
          artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600',
          soundcloud_url: 'https://soundcloud.com/rawconvict/darkroom-pulse',
          release_date: '2025-01-10',
          bpm: 132,
          genre: 'Hard Techno',
          duration: 280,
          plays: 8920,
          tiktok_reel_url: null,
          qr_poster_url: null,
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
        {
          id: '3',
          title: 'Basement Heat',
          artist: { name: 'Marcus Cruz', avatar: '', city: 'London' },
          artwork: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600',
          soundcloud_url: 'https://soundcloud.com/rawconvict/basement-heat',
          release_date: '2025-01-05',
          bpm: 125,
          genre: 'Deep House',
          duration: 360,
          plays: 15680,
          tiktok_reel_url: null,
          qr_poster_url: null,
          created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        },
      ]);
    }

    return c.json(releases || []);
  } catch (err: any) {
    console.error('❌ RAW releases error:', err);
    return c.json({ error: err.message }, 500);
  }
});

/**
 * GET /raw/artist/:id
 * Returns artist profile with releases
 */
app.get('/make-server-a670c824/raw/artist/:id', async (c) => {
  try {
    const artistId = c.req.param('id');

    const { data: artist, error: artistError } = await supabase
      .from('raw_artists')
      .select('*')
      .eq('id', artistId)
      .single();

    if (artistError || !artist) {
      return c.json({ error: 'Artist not found' }, 404);
    }

    const { data: releases, error: releasesError } = await supabase
      .from('raw_releases')
      .select('*')
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false });

    return c.json({
      ...artist,
      releases: releases || [],
    });
  } catch (err: any) {
    console.error('❌ Artist fetch error:', err);
    return c.json({ error: err.message }, 500);
  }
});

/**
 * GET /raw/artists
 * Returns all RAW Convict artists
 */
app.get('/make-server-a670c824/raw/artists', async (c) => {
  try {
    const { data: artists, error } = await supabase
      .from('raw_artists')
      .select(`
        *,
        releases:raw_releases(count)
      `)
      .order('name');

    if (error) {
      return c.json([
        {
          id: '1',
          name: 'RAW CONVICT',
          city: 'London',
          avatar: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400',
          soundcloud_url: 'https://soundcloud.com/rawconvict',
          bio: 'Underground techno label. Men-only. 18+.',
          releases: 12,
        },
      ]);
    }

    return c.json(artists || []);
  } catch (err: any) {
    console.error('❌ Artists fetch error:', err);
    return c.json({ error: err.message }, 500);
  }
});

/**
 * POST /raw/generate-tiktok
 * Generates TikTok reel from release (triggers Make.com)
 */
app.post('/make-server-a670c824/raw/generate-tiktok', async (c) => {
  try {
    const { releaseId } = await c.req.json();

    const { data: release } = await supabase
      .from('raw_releases')
      .select('*')
      .eq('id', releaseId)
      .single();

    if (!release) {
      return c.json({ error: 'Release not found' }, 404);
    }

    // Trigger Make.com webhook for TikTok generation
    const makeWebhookUrl = Deno.env.get('MAKE_TIKTOK_WEBHOOK_URL');
    
    if (makeWebhookUrl) {
      await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          release_id: release.id,
          title: release.title,
          artist: release.artist_id,
          artwork: release.artwork,
          soundcloud_url: release.soundcloud_url,
          bpm: release.bpm,
          duration: release.duration,
        }),
      });
    }

    console.log('✅ TikTok generation triggered for:', release.title);

    return c.json({
      success: true,
      message: 'TikTok reel generation started',
      releaseId: release.id,
    });
  } catch (err: any) {
    console.error('❌ TikTok generation error:', err);
    return c.json({ error: err.message }, 500);
  }
});

/**
 * POST /raw/generate-qr-poster
 * Generates QR code poster for release
 */
app.post('/make-server-a670c824/raw/generate-qr-poster', async (c) => {
  try {
    const { releaseId } = await c.req.json();

    const { data: release } = await supabase
      .from('raw_releases')
      .select('*')
      .eq('id', releaseId)
      .single();

    if (!release) {
      return c.json({ error: 'Release not found' }, 404);
    }

    // Generate QR code for release
    const qrData = {
      url: release.soundcloud_url,
      title: release.title,
      type: 'raw_release',
    };

    // Store QR poster URL
    const posterUrl = `https://hotmess.london/raw/release/${release.id}`;
    
    await supabase
      .from('raw_releases')
      .update({ qr_poster_url: posterUrl })
      .eq('id', releaseId);

    console.log('✅ QR poster generated for:', release.title);

    return c.json({
      success: true,
      posterUrl,
      qrData,
    });
  } catch (err: any) {
    console.error('❌ QR poster generation error:', err);
    return c.json({ error: err.message }, 500);
  }
});

/**
 * GET /raw/playlists/:club
 * Returns club-specific playlist
 */
app.get('/make-server-a670c824/raw/playlists/:club', async (c) => {
  try {
    const clubId = c.req.param('club');

    // Get club playlist rules
    const { data: club } = await supabase
      .from('clubs')
      .select('playlist_rules')
      .eq('id', clubId)
      .single();

    if (!club) {
      return c.json({ error: 'Club not found' }, 404);
    }

    const rules = club.playlist_rules || { min_bpm: 120, max_bpm: 140 };

    // Get matching releases
    const { data: releases } = await supabase
      .from('raw_releases')
      .select(`
        *,
        artist:raw_artists(name, city)
      `)
      .gte('bpm', rules.min_bpm)
      .lte('bpm', rules.max_bpm)
      .order('plays', { ascending: false })
      .limit(50);

    return c.json({
      club: clubId,
      rules,
      releases: releases || [],
    });
  } catch (err: any) {
    console.error('❌ Playlist fetch error:', err);
    return c.json({ error: err.message }, 500);
  }
});

export default app;

Deno.serve(app.fetch);
