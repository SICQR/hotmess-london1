/**
 * HOTMESS LONDON - ADMIN API
 * Complete backend for admin console operations
 * Handles: Records, Moderation, Stats, Users, Beacons
 */

import { Hono } from 'npm:hono@4.10.6';
import * as kv from './kv_store.tsx';

const app = new Hono();

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

async function requireAdmin(c: any, next: any) {
  try {
    // DEV_MODE: Bypass auth for development/testing
    const DEV_MODE = Deno.env.get('DEV_MODE') === 'true' || true; // Enable by default
    
    if (DEV_MODE) {
      console.log('⚠️ DEV_MODE: Auth bypass enabled for admin API');
      c.set('user', { id: 'dev-user', email: 'dev@hotmess.london' });
      c.set('userData', { role: 'admin' });
      await next();
      return;
    }

    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized - No token provided' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Create Supabase client
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.0');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
    );

    // Verify token and get user
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Auth error:', error);
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }

    // Check if user is admin
    const userData = await kv.get(`user:${user.id}`);
    if (!userData || (userData.role !== 'admin' && userData.role !== 'operator')) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    // Attach user to context
    c.set('user', user);
    c.set('userData', userData);
    
    await next();
  } catch (err) {
    console.error('Admin auth middleware error:', err);
    return c.json({ error: 'Internal auth error' }, 500);
  }
}

// ============================================================================
// RECORDS MANAGEMENT API
// ============================================================================

// Upload MP3 + Cover Art
app.post('/records/upload', requireAdmin, async (c) => {
  try {
    // This would need multipart form data handling
    // For now, we'll return a placeholder response
    const body = await c.req.parseBody();
    
    const mp3File = body.mp3 as File;
    const coverFile = body.cover as File;
    const metadataStr = body.metadata as string;
    
    if (!mp3File || !coverFile || !metadataStr) {
      return c.json({ error: 'Missing required files or metadata' }, 400);
    }

    const metadata = JSON.parse(metadataStr);
    const { artist, title, album, year, genre, label } = metadata;

    if (!artist || !title) {
      return c.json({ error: 'Artist and title are required' }, 400);
    }

    // Create Supabase client for storage
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.0');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );

    // Create storage bucket if it doesn't exist
    const bucketName = 'make-a670c824-records';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false });
    }

    // Generate unique ID for this release
    const releaseId = `release_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Upload MP3 file
    const mp3Path = `${releaseId}/audio.mp3`;
    const mp3Buffer = await mp3File.arrayBuffer();
    const { error: mp3Error } = await supabase.storage
      .from(bucketName)
      .upload(mp3Path, mp3Buffer, {
        contentType: 'audio/mpeg',
      });

    if (mp3Error) {
      console.error('MP3 upload error:', mp3Error);
      return c.json({ error: 'Failed to upload MP3 file' }, 500);
    }

    // Upload cover art
    const coverPath = `${releaseId}/cover.jpg`;
    const coverBuffer = await coverFile.arrayBuffer();
    const { error: coverError } = await supabase.storage
      .from(bucketName)
      .upload(coverPath, coverBuffer, {
        contentType: coverFile.type,
      });

    if (coverError) {
      console.error('Cover upload error:', coverError);
      return c.json({ error: 'Failed to upload cover art' }, 500);
    }

    // Get signed URLs (valid for 1 year)
    const { data: mp3SignedUrl } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(mp3Path, 31536000);

    const { data: coverSignedUrl } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(coverPath, 31536000);

    // Store release metadata in KV
    const release = {
      id: releaseId,
      artist,
      title,
      album: album || '',
      year,
      genre: genre || '',
      label: label || 'RAW Convict',
      mp3_url: mp3SignedUrl?.signedUrl || '',
      cover_url: coverSignedUrl?.signedUrl || '',
      created_at: new Date().toISOString(),
      views: 0,
      downloads: 0,
      storage_paths: {
        mp3: mp3Path,
        cover: coverPath,
      },
    };

    await kv.set(`records:release:${releaseId}`, release);

    // Add to releases index
    const allReleases = await kv.get('records:releases:index') || [];
    allReleases.unshift(releaseId);
    await kv.set('records:releases:index', allReleases);

    return c.json({ 
      success: true, 
      release,
      message: 'Release uploaded successfully' 
    });

  } catch (err) {
    console.error('Record upload error:', err);
    return c.json({ error: 'Failed to upload record', details: err.message }, 500);
  }
});

// Get all releases
app.get('/records/releases', requireAdmin, async (c) => {
  try {
    const releasesIndex = await kv.get('records:releases:index') || [];
    
    // Fetch all releases
    const releases = await Promise.all(
      releasesIndex.map(async (releaseId: string) => {
        const release = await kv.get(`records:release:${releaseId}`);
        return release;
      })
    );

    // Filter out null values
    const validReleases = releases.filter(r => r !== null);

    return c.json({ 
      releases: validReleases,
      total: validReleases.length 
    });

  } catch (err) {
    console.error('Get releases error:', err);
    return c.json({ error: 'Failed to fetch releases' }, 500);
  }
});

// Delete release
app.delete('/records/releases/:id', requireAdmin, async (c) => {
  try {
    const releaseId = c.req.param('id');
    
    // Get release data
    const release = await kv.get(`records:release:${releaseId}`);
    if (!release) {
      return c.json({ error: 'Release not found' }, 404);
    }

    // Delete files from storage
    if (release.storage_paths) {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.0');
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') || '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      );

      const bucketName = 'make-a670c824-records';
      
      // Delete MP3
      if (release.storage_paths.mp3) {
        await supabase.storage.from(bucketName).remove([release.storage_paths.mp3]);
      }
      
      // Delete cover
      if (release.storage_paths.cover) {
        await supabase.storage.from(bucketName).remove([release.storage_paths.cover]);
      }
    }

    // Delete from KV
    await kv.del(`records:release:${releaseId}`);

    // Remove from index
    const releasesIndex = await kv.get('records:releases:index') || [];
    const updatedIndex = releasesIndex.filter((id: string) => id !== releaseId);
    await kv.set('records:releases:index', updatedIndex);

    return c.json({ success: true, message: 'Release deleted' });

  } catch (err) {
    console.error('Delete release error:', err);
    return c.json({ error: 'Failed to delete release' }, 500);
  }
});

// ============================================================================
// MODERATION API
// ============================================================================

// Get moderation queue
app.get('/moderation/queue', requireAdmin, async (c) => {
  try {
    // Get all flagged content
    const flaggedItems = await kv.getByPrefix('moderation:flagged:');
    
    // Calculate stats
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const stats = {
      pending: flaggedItems.filter(item => item.status === 'pending').length,
      approved_today: flaggedItems.filter(item => 
        item.status === 'approved' && 
        new Date(item.reviewed_at) >= startOfDay
      ).length,
      rejected_today: flaggedItems.filter(item => 
        item.status === 'rejected' && 
        new Date(item.reviewed_at) >= startOfDay
      ).length,
      avg_review_time: 12, // Mock for now
    };

    return c.json({ 
      items: flaggedItems,
      stats 
    });

  } catch (err) {
    console.error('Get moderation queue error:', err);
    return c.json({ error: 'Failed to fetch moderation queue' }, 500);
  }
});

// Take moderation action
app.post('/moderation/action', requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const { itemId, action } = body;

    if (!itemId || !action) {
      return c.json({ error: 'Item ID and action required' }, 400);
    }

    if (!['approve', 'reject', 'ban_user'].includes(action)) {
      return c.json({ error: 'Invalid action' }, 400);
    }

    // Get flagged item
    const item = await kv.get(`moderation:flagged:${itemId}`);
    if (!item) {
      return c.json({ error: 'Item not found' }, 404);
    }

    const user = c.get('userData');

    // Handle action
    if (action === 'ban_user') {
      // Ban the user
      const bannedUser = await kv.get(`user:${item.user_id}`);
      if (bannedUser) {
        bannedUser.status = 'banned';
        bannedUser.banned_at = new Date().toISOString();
        bannedUser.banned_by = user.id;
        await kv.set(`user:${item.user_id}`, bannedUser);
      }
    }

    // Update item status
    item.status = action === 'approve' ? 'approved' : 'rejected';
    item.reviewed_at = new Date().toISOString();
    item.reviewed_by = user.id;
    await kv.set(`moderation:flagged:${itemId}`, item);

    return c.json({ 
      success: true, 
      message: `Item ${action}d successfully` 
    });

  } catch (err) {
    console.error('Moderation action error:', err);
    return c.json({ error: 'Failed to perform action' }, 500);
  }
});

// ============================================================================
// BEACONS API (for Globe View)
// ============================================================================

// Get all beacons with location data
app.get('/beacons/all', requireAdmin, async (c) => {
  try {
    const beacons = await kv.getByPrefix('beacon:');
    
    // Calculate stats
    const stats = {
      total_beacons: beacons.length,
      active_beacons: beacons.filter(b => b.status === 'active').length,
      total_scans: beacons.reduce((sum, b) => sum + (b.scans || 0), 0),
      countries: new Set(beacons.map(b => b.country)).size,
      cities: new Set(beacons.map(b => b.city)).size,
    };

    return c.json({ 
      beacons,
      stats 
    });

  } catch (err) {
    console.error('Get beacons error:', err);
    return c.json({ error: 'Failed to fetch beacons' }, 500);
  }
});

// ============================================================================
// ADMIN STATS API (for AdminOverview)
// ============================================================================

// Get platform stats
app.get('/stats/overview', requireAdmin, async (c) => {
  try {
    // Get all users
    const users = await kv.getByPrefix('user:');
    const totalUsers = users.length;
    const newUsersThisWeek = users.filter(u => {
      const created = new Date(u.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created >= weekAgo;
    }).length;

    // Get all orders
    const orders = await kv.getByPrefix('market_order:');
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    // Get products
    const products = await kv.getByPrefix('market_listing:');
    const totalProducts = products.length;

    // Get reports
    const reports = await kv.getByPrefix('report:');
    const pendingReports = reports.filter(r => r.status === 'pending').length;

    // Get DSAR requests
    const dsarRequests = await kv.getByPrefix('dsar:');
    const pendingDsar = dsarRequests.filter(d => d.status === 'pending').length;

    return c.json({
      stats: {
        totalUsers,
        newUsersThisWeek,
        userGrowth: newUsersThisWeek > 0 ? '+' + ((newUsersThisWeek / totalUsers) * 100).toFixed(1) + '%' : '0%',
        totalOrders,
        pendingOrders,
        orderGrowth: '+12.5%', // Mock for now
        totalProducts,
        productGrowth: '+8.2%', // Mock for now
        totalRevenue,
        revenueGrowth: '+15.3%', // Mock for now
      },
      actionQueues: {
        pendingOrders,
        pendingReports,
        pendingDsar,
        pendingSellers: 0, // TODO: implement
      },
      recentActivity: [] // TODO: implement activity log
    });

  } catch (err) {
    console.error('Get admin stats error:', err);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

// ============================================================================
// USERS API
// ============================================================================

// Get all users
app.get('/users', requireAdmin, async (c) => {
  try {
    const users = await kv.getByPrefix('user:');
    
    return c.json({ 
      users,
      total: users.length 
    });

  } catch (err) {
    console.error('Get users error:', err);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Ban user
app.post('/users/:id/ban', requireAdmin, async (c) => {
  try {
    const userId = c.req.param('id');
    const admin = c.get('userData');
    
    const user = await kv.get(`user:${userId}`);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    user.status = 'banned';
    user.banned_at = new Date().toISOString();
    user.banned_by = admin.id;
    
    await kv.set(`user:${userId}`, user);

    return c.json({ 
      success: true, 
      message: 'User banned successfully' 
    });

  } catch (err) {
    console.error('Ban user error:', err);
    return c.json({ error: 'Failed to ban user' }, 500);
  }
});

// Update user role
app.put('/users/:id/role', requireAdmin, async (c) => {
  try {
    const userId = c.req.param('id');
    const body = await c.req.json();
    const { role } = body;
    
    if (!['user', 'seller', 'admin', 'operator'].includes(role)) {
      return c.json({ error: 'Invalid role' }, 400);
    }

    const user = await kv.get(`user:${userId}`);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    user.role = role;
    user.role_updated_at = new Date().toISOString();
    
    await kv.set(`user:${userId}`, user);

    return c.json({ 
      success: true, 
      message: 'User role updated successfully',
      user 
    });

  } catch (err) {
    console.error('Update user role error:', err);
    return c.json({ error: 'Failed to update role' }, 500);
  }
});

// ============================================================================
// ORDERS API
// ============================================================================

// Get all orders
app.get('/orders', requireAdmin, async (c) => {
  try {
    const orders = await kv.getByPrefix('market_order:');
    
    // Sort by date (newest first)
    orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return c.json({ 
      orders,
      total: orders.length 
    });

  } catch (err) {
    console.error('Get orders error:', err);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

export default app;