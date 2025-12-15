/**
 * RAW CONVICT RECORDS API
 * Manage records, tracks, uploads, and storage
 */

import { Hono } from 'npm:hono@4.10.6';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Create Supabase client helper
const getSupabaseClient = async () => {
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.0');
  return createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
  );
};

// Initialize storage buckets on startup
const initializeStorage = async () => {
  const supabase = await getSupabaseClient();
  
  // Create buckets if they don't exist
  const bucketsToCreate = [
    { name: 'records-covers', public: true },
    { name: 'records-audio', public: true },
  ];

  for (const bucket of bucketsToCreate) {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucket.name);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: bucket.name === 'records-audio' ? 52428800 : 10485760, // 50MB for audio, 10MB for images
      });
      if (error) {
        console.error(`Failed to create bucket ${bucket.name}:`, error);
      } else {
        console.log(`✅ Created storage bucket: ${bucket.name}`);
      }
    }
  }
};

// Initialize on module load
initializeStorage().catch(console.error);

// ============================================================================
// RECORDS MANAGEMENT
// ============================================================================

// Get all records
app.get('/', async (c) => {
  try {
    const records = await kv.getByPrefix('record:');
    return c.json({ 
      success: true, 
      records: records.sort((a, b) => 
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      )
    });
  } catch (error: any) {
    console.error('Error fetching records:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get single record by slug
app.get('/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    const record = await kv.get(`record:${slug}`);
    
    if (!record) {
      return c.json({ error: 'Record not found' }, 404);
    }
    
    return c.json({ success: true, record });
  } catch (error: any) {
    console.error('Error fetching record:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create or update record
app.post('/records', async (c) => {
  try {
    const body = await c.req.json();
    const { slug, title, artist, tagline, type, status, tags, coverUrl, releaseDate, totalDuration, soundcloudUrl, cuts, credits, press, shopItems } = body;

    if (!slug || !title || !artist) {
      return c.json({ error: 'Missing required fields: slug, title, artist' }, 400);
    }

    const record = {
      slug,
      title,
      artist,
      tagline: tagline || '',
      type: type || 'SINGLE',
      status: status || 'ACTIVE',
      tags: tags || [],
      coverUrl: coverUrl || '',
      releaseDate: releaseDate || new Date().toISOString(),
      totalDuration: totalDuration || '0:00',
      soundcloudUrl: soundcloudUrl || '',
      cuts: cuts || [],
      credits: credits || [],
      press: press || '',
      shopItems: shopItems || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`record:${slug}`, record);
    
    console.log(`✅ Record created/updated: ${slug}`);
    return c.json({ success: true, record });
  } catch (error: any) {
    console.error('Error creating record:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete record
app.delete('/records/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    await kv.del(`record:${slug}`);
    
    console.log(`✅ Record deleted: ${slug}`);
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting record:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// FILE UPLOADS
// ============================================================================

// Generate signed upload URL for cover image
app.post('/upload-cover-url', async (c) => {
  try {
    const { fileName } = await c.req.json();
    
    if (!fileName) {
      return c.json({ error: 'fileName required' }, 400);
    }

    const supabase = await getSupabaseClient();
    const filePath = `${Date.now()}-${fileName}`;

    const { data, error } = await supabase.storage
      .from('records-covers')
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error('Error creating upload URL:', error);
      return c.json({ error: error.message }, 500);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('records-covers')
      .getPublicUrl(filePath);

    return c.json({ 
      success: true, 
      uploadUrl: data.signedUrl,
      publicUrl,
      filePath 
    });
  } catch (error: any) {
    console.error('Error generating cover upload URL:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Generate signed upload URL for audio file
app.post('/upload-audio-url', async (c) => {
  try {
    const { fileName } = await c.req.json();
    
    if (!fileName) {
      return c.json({ error: 'fileName required' }, 400);
    }

    const supabase = await getSupabaseClient();
    const filePath = `${Date.now()}-${fileName}`;

    const { data, error } = await supabase.storage
      .from('records-audio')
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error('Error creating upload URL:', error);
      return c.json({ error: error.message }, 500);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('records-audio')
      .getPublicUrl(filePath);

    return c.json({ 
      success: true, 
      uploadUrl: data.signedUrl,
      publicUrl,
      filePath 
    });
  } catch (error: any) {
    console.error('Error generating audio upload URL:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// DOWNLOAD ENDPOINTS
// ============================================================================

// Generate signed download URL for track
app.post('/download/:trackId', async (c) => {
  try {
    const trackId = c.req.param('trackId');
    
    // Get authenticated user
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const supabase = await getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Get track info from KV
    const tracks = await kv.getByPrefix('track:');
    const track = tracks.find((t: any) => t.id === trackId);
    
    if (!track) {
      return c.json({ error: 'Track not found' }, 404);
    }
    
    // Check if track is free or user has purchased
    if (!track.isFree) {
      // Check purchase record
      const purchases = await kv.getByPrefix(`purchase:${user.id}:`);
      const hasPurchased = purchases.some((p: any) => 
        p.trackId === trackId || p.releaseId === track.releaseId
      );
      
      if (!hasPurchased) {
        return c.json({ error: 'Track not purchased' }, 403);
      }
    }
    
    // Generate signed URL for download (expires in 1 hour)
    const { data, error } = await supabase.storage
      .from('records-audio')
      .createSignedUrl(track.audioPath, 3600);
    
    if (error) {
      console.error('Error creating signed URL:', error);
      return c.json({ error: error.message }, 500);
    }
    
    // Log download
    await kv.set(`download:${trackId}:${user.id}:${Date.now()}`, {
      trackId,
      userId: user.id,
      downloadedAt: new Date().toISOString(),
    });
    
    return c.json({ 
      success: true, 
      downloadUrl: data.signedUrl,
      track: {
        title: track.title,
        artist: track.artist,
        format: track.format || 'mp3',
      }
    });
  } catch (error: any) {
    console.error('Error generating download URL:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Direct upload endpoint (alternative method)
app.post('/upload-cover', async (c) => {
  console.log('=== COVER UPLOAD REQUEST STARTED ===');
  try {
    console.log('Parsing form data...');
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('No file provided in form data');
      return c.json({ error: 'No file provided' }, 400);
    }

    console.log(`File received: ${file.name}, type: ${file.type}, size: ${file.size}`);

    const supabase = await getSupabaseClient();
    const fileName = `${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();

    console.log(`Uploading to bucket: records-covers, filename: ${fileName}`);

    const { data, error } = await supabase.storage
      .from('records-covers')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return c.json({ error: `Storage error: ${error.message}` }, 500);
    }

    console.log('Upload successful, getting public URL...');

    const { data: { publicUrl } } = supabase.storage
      .from('records-covers')
      .getPublicUrl(data.path);

    console.log(`Public URL: ${publicUrl}`);
    console.log('=== COVER UPLOAD SUCCESS ===');

    return c.json({ 
      success: true, 
      publicUrl,
      path: data.path 
    });
  } catch (error: any) {
    console.error('=== COVER UPLOAD ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return c.json({ error: `Upload failed: ${error.message}` }, 500);
  }
});

app.post('/upload-audio', async (c) => {
  console.log('=== AUDIO UPLOAD REQUEST STARTED ===');
  try {
    console.log('Parsing form data...');
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('No file provided in form data');
      return c.json({ error: 'No file provided' }, 400);
    }

    console.log(`File received: ${file.name}, type: ${file.type}, size: ${file.size}`);

    const supabase = await getSupabaseClient();
    const fileName = `${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();

    console.log(`Uploading to bucket: records-audio, filename: ${fileName}`);

    const { data, error } = await supabase.storage
      .from('records-audio')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return c.json({ error: `Storage error: ${error.message}` }, 500);
    }

    console.log('Upload successful, getting public URL...');

    const { data: { publicUrl } } = supabase.storage
      .from('records-audio')
      .getPublicUrl(data.path);

    console.log(`Public URL: ${publicUrl}`);
    console.log('=== AUDIO UPLOAD SUCCESS ===');

    return c.json({ 
      success: true, 
      publicUrl,
      path: data.path 
    });
  } catch (error: any) {
    console.error('=== AUDIO UPLOAD ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return c.json({ error: `Upload failed: ${error.message}` }, 500);
  }
});

export default app;