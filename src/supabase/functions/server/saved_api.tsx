// supabase/functions/server/saved_api.tsx
// KV-based saved content API for all content types

import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import * as kv from './kv_store.tsx';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

app.use('*', cors());

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// ============================================================================
// TYPES
// ============================================================================

export type ContentType = 'beacon' | 'record' | 'release' | 'product' | 'post' | 'show';

export interface SavedItem {
  userId: string;
  contentType: ContentType;
  contentId: string;
  savedAt: string;
  metadata?: any; // Optional cached metadata (title, image, etc)
}

// ============================================================================
// SAVE CONTENT
// ============================================================================

app.post('/make-server-a670c824/saved/save', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { contentType, contentId, metadata } = await c.req.json();

    if (!contentType || !contentId) {
      return c.json({ error: 'contentType and contentId required' }, 400);
    }

    const item: SavedItem = {
      userId: user.id,
      contentType,
      contentId,
      savedAt: new Date().toISOString(),
      metadata: metadata || {}
    };

    // Store in KV: saved:{userId}:{contentType}:{contentId}
    const key = `saved:${user.id}:${contentType}:${contentId}`;
    await kv.set(key, item);

    return c.json({ success: true, item });
  } catch (error) {
    console.error('Error saving content:', error);
    return c.json({ error: 'Failed to save content: ' + (error as Error).message }, 500);
  }
});

// ============================================================================
// UNSAVE CONTENT
// ============================================================================

app.delete('/make-server-a670c824/saved/unsave', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { contentType, contentId } = await c.req.json();

    if (!contentType || !contentId) {
      return c.json({ error: 'contentType and contentId required' }, 400);
    }

    const key = `saved:${user.id}:${contentType}:${contentId}`;
    await kv.del(key);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error unsaving content:', error);
    return c.json({ error: 'Failed to unsave content: ' + (error as Error).message }, 500);
  }
});

// ============================================================================
// CHECK IF SAVED
// ============================================================================

app.get('/make-server-a670c824/saved/check', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const contentType = c.req.query('contentType');
    const contentId = c.req.query('contentId');

    if (!contentType || !contentId) {
      return c.json({ error: 'contentType and contentId required' }, 400);
    }

    const key = `saved:${user.id}:${contentType}:${contentId}`;
    const item = await kv.get(key);

    return c.json({ saved: !!item, item });
  } catch (error) {
    console.error('Error checking saved status:', error);
    return c.json({ error: 'Failed to check saved status: ' + (error as Error).message }, 500);
  }
});

// ============================================================================
// GET ALL SAVED CONTENT (with optional type filter)
// ============================================================================

app.get('/make-server-a670c824/saved/all', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const contentType = c.req.query('contentType'); // Optional filter

    // Get all saved items for this user
    const prefix = contentType 
      ? `saved:${user.id}:${contentType}:`
      : `saved:${user.id}:`;
    
    const results = await kv.getByPrefix(prefix);
    
    // Sort by savedAt descending (newest first)
    const items = results
      .map((r: any) => r.value)
      .sort((a: SavedItem, b: SavedItem) => 
        new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      );

    return c.json({ items, count: items.length });
  } catch (error) {
    console.error('Error fetching saved content:', error);
    return c.json({ error: 'Failed to fetch saved content: ' + (error as Error).message }, 500);
  }
});

// ============================================================================
// GET SAVED COUNT BY TYPE
// ============================================================================

app.get('/make-server-a670c824/saved/counts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const prefix = `saved:${user.id}:`;
    const results = await kv.getByPrefix(prefix);
    
    // Count by type
    const counts: Record<ContentType, number> = {
      beacon: 0,
      record: 0,
      release: 0,
      product: 0,
      post: 0,
      show: 0
    };

    results.forEach((r: any) => {
      const item = r.value as SavedItem;
      if (item.contentType in counts) {
        counts[item.contentType]++;
      }
    });

    return c.json({ counts, total: results.length });
  } catch (error) {
    console.error('Error fetching saved counts:', error);
    return c.json({ error: 'Failed to fetch saved counts: ' + (error as Error).message }, 500);
  }
});

export default app;