/**
 * MESSMARKET API
 * Handles marketplace listings, orders, and vendor operations
 */

import { Hono } from 'npm:hono@4.10.6';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS middleware - MUST be first
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: false,
}));

// Logger middleware
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getAuthenticatedUser(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

// ============================================================================
// LISTINGS ROUTES
// ============================================================================

// Get all active listings (public)
app.get('/listings', async (c) => {
  try {
    const { category, search, status = 'active', limit = 50, offset = 0 } = c.req.query();
    
    // Build prefix for filtering
    let prefix = 'messmarket:listing:';
    
    // Get all listings
    const allListings = await kv.getByPrefix(prefix);
    
    console.log(`[MessMarket] getByPrefix returned ${allListings?.length || 0} items`);
    
    // FIXED: Handle both formats - getByPrefix might return values only or {key,value} objects
    let filtered = allListings
      .filter((item: any) => {
        const listing = item.value || item;
        return listing?.status === status || status === 'all';
      })
      .filter((item: any) => {
        const listing = item.value || item;
        return !category || listing?.category === category;
      })
      .filter((item: any) => {
        if (!search) return true;
        const listing = item.value || item;
        const searchLower = search.toLowerCase();
        return (
          listing?.title?.toLowerCase().includes(searchLower) ||
          listing?.description?.toLowerCase().includes(searchLower)
        );
      });
    
    // Sort by created date (newest first)
    filtered.sort((a: any, b: any) => {
      const listingA = a.value || a;
      const listingB = b.value || b;
      const dateA = new Date(listingA?.createdAt || 0);
      const dateB = new Date(listingB?.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Paginate
    const total = filtered.length;
    const paginated = filtered.slice(Number(offset), Number(offset) + Number(limit));
    
    // Extract values
    const listings = paginated.map((item: any) => {
      const key = item.key || '';
      const value = item.value || item;
      const id = key ? key.split(':').pop() : crypto.randomUUID();
      
      return {
        id,
        ...value,
      };
    });
    
    return c.json({ listings, total, limit: Number(limit), offset: Number(offset) });
  } catch (error) {
    console.error('Get listings error:', error);
    return c.json({ error: 'Failed to fetch listings' }, 500);
  }
});

// Get single listing (public)
app.get('/listings/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const listing = await kv.get(`messmarket:listing:${id}`);
    
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }
    
    // Increment view count
    const viewCount = (listing.views || 0) + 1;
    await kv.set(`messmarket:listing:${id}`, { ...listing, views: viewCount });
    
    return c.json({ listing: { id, ...listing, views: viewCount } });
  } catch (error) {
    console.error('Get listing error:', error);
    return c.json({ error: 'Failed to fetch listing' }, 500);
  }
});

// Get my listings (requires auth)
app.get('/listings/me/all', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    console.log(`[MessMarket] Fetching listings for user: ${user.id}`);
    
    // Get all listings for this user
    const allListings = await kv.getByPrefix(`messmarket:listing:`);
    
    console.log(`[MessMarket] getByPrefix returned:`, {
      count: allListings?.length || 0,
      sample: allListings?.[0]
    });
    
    // FIXED: getByPrefix returns { key, value } objects, not just values
    const myListings = allListings
      .filter((item: any) => {
        // Handle both formats: item.value or direct item
        const listing = item.value || item;
        const matches = listing?.userId === user.id;
        console.log(`[MessMarket] Checking listing:`, {
          key: item.key,
          userId: listing?.userId,
          targetUserId: user.id,
          matches
        });
        return matches;
      })
      .map((item: any) => {
        // Extract key and value
        const key = item.key || '';
        const value = item.value || item;
        const id = key.split(':').pop() || crypto.randomUUID();
        
        console.log(`[MessMarket] Mapping listing:`, { key, id, title: value.title });
        
        return {
          id,
          ...value,
        };
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
    
    console.log(`[MessMarket] Returning ${myListings.length} listings`);
    
    return c.json({ listings: myListings });
  } catch (error) {
    console.error('Get my listings error:', error);
    return c.json({ error: 'Failed to fetch listings' }, 500);
  }
});

// Create listing (requires auth)
app.post('/listings', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const body = await c.req.json();
    const {
      title,
      description,
      price,
      stock,
      category,
      tags,
      shippingCost,
      processingTime,
      condition,
      size,
      brand,
      shipsFrom,
      shippingUK,
      shippingEU,
      shippingUSA,
      customRequestsAccepted,
      discretePackaging,
      noRefunds,
      isNsfw,
      status = 'active',
      images = [],
    } = body;
    
    // Validation
    if (!title?.trim()) {
      return c.json({ error: 'Title is required' }, 400);
    }
    if (!price || parseFloat(price) <= 0) {
      return c.json({ error: 'Valid price is required' }, 400);
    }
    if (stock === undefined || parseInt(stock) < 0) {
      return c.json({ error: 'Valid stock quantity is required' }, 400);
    }
    
    // Generate ID
    const id = crypto.randomUUID();
    
    // Create listing
    const listing = {
      userId: user.id,
      userEmail: user.email,
      title: title.trim(),
      description: description?.trim() || '',
      price: parseFloat(price),
      stock: parseInt(stock),
      category: category || 'Other',
      tags: Array.isArray(tags) ? tags : [],
      shippingCost: parseFloat(shippingCost || '0'),
      processingTime: processingTime || '1-3',
      condition: condition || '',
      size: size || '',
      brand: brand || '',
      shipsFrom: shipsFrom || '',
      shippingRates: {
        uk: parseFloat(shippingUK || '0'),
        eu: parseFloat(shippingEU || '0'),
        usa: parseFloat(shippingUSA || '0'),
      },
      policies: {
        customRequestsAccepted: !!customRequestsAccepted,
        discretePackaging: !!discretePackaging,
        noRefunds: !!noRefunds,
      },
      isNsfw: !!isNsfw,
      status,
      images,
      views: 0,
      sold: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Save to KV store
    await kv.set(`messmarket:listing:${id}`, listing);
    
    console.log(`Created listing ${id} for user ${user.id}`);
    
    return c.json({ listing: { id, ...listing } }, 201);
  } catch (error) {
    console.error('Create listing error:', error);
    return c.json({ error: 'Failed to create listing' }, 500);
  }
});

// Update listing (requires auth)
app.patch('/listings/:id', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { id } = c.req.param();
    const listing = await kv.get(`messmarket:listing:${id}`);
    
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }
    
    // Check ownership
    if (listing.userId !== user.id) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    
    const body = await c.req.json();
    
    // Update listing
    const updated = {
      ...listing,
      ...body,
      userId: listing.userId, // Don't allow changing owner
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`messmarket:listing:${id}`, updated);
    
    return c.json({ listing: { id, ...updated } });
  } catch (error) {
    console.error('Update listing error:', error);
    return c.json({ error: 'Failed to update listing' }, 500);
  }
});

// Delete listing (requires auth)
app.delete('/listings/:id', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { id } = c.req.param();
    const listing = await kv.get(`messmarket:listing:${id}`);
    
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }
    
    // Check ownership
    if (listing.userId !== user.id) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    
    await kv.del(`messmarket:listing:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete listing error:', error);
    return c.json({ error: 'Failed to delete listing' }, 500);
  }
});

// ============================================================================
// IMAGE UPLOAD ROUTES
// ============================================================================

// Upload image (requires auth)
app.post('/images', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ error: 'File too large (max 5MB)' }, 400);
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      return c.json({ error: 'File must be an image' }, 400);
    }
    
    // Ensure bucket exists
    const bucketName = 'messmarket-images';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log('Creating messmarket-images bucket...');
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      });
      
      if (createError) {
        console.error('Failed to create bucket:', createError);
        return c.json({ error: `Storage setup error: ${createError.message}` }, 500);
      }
      
      console.log('Bucket created successfully');
    }
    
    // Generate unique filename
    const ext = file.name.split('.').pop();
    const filename = `${user.id}/${crypto.randomUUID()}.${ext}`;
    
    console.log(`Uploading image: ${filename} (${file.size} bytes, ${file.type})`);
    
    // Convert File to ArrayBuffer for Deno
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filename, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });
    
    if (error) {
      console.error('Storage upload error:', error);
      return c.json({ error: `Upload failed: ${error.message}` }, 500);
    }
    
    console.log('Upload successful:', data);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filename);
    
    console.log('Public URL:', urlData.publicUrl);
    
    return c.json({
      url: urlData.publicUrl,
      filename,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
    return c.json({ error: errorMessage }, 500);
  }
});

// ============================================================================
// VENDOR ROUTES
// ============================================================================

// Get vendor profile (public)
app.get('/vendors/:username', async (c) => {
  try {
    const { username } = c.req.param();
    
    // Get vendor profile from KV
    const profile = await kv.get(`messmarket:vendor:${username}`);
    
    if (!profile) {
      return c.json({ error: 'Vendor not found' }, 404);
    }
    
    // Get vendor's listings
    const allListings = await kv.getByPrefix(`messmarket:listing:`);
    const vendorListings = allListings
      .filter((item: any) => item.value?.userId === profile.userId)
      .filter((item: any) => item.value?.status === 'active')
      .map((item: any) => ({
        id: item.key.split(':').pop(),
        ...item.value,
      }));
    
    return c.json({
      vendor: profile,
      listings: vendorListings,
    });
  } catch (error) {
    console.error('Get vendor error:', error);
    return c.json({ error: 'Failed to fetch vendor' }, 500);
  }
});

export default app;