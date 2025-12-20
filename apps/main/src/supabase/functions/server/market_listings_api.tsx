/**
 * Market Listings API
 * Manages marketplace product listings using KV store
 */

import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const app = new Hono();

// ============================================================================
// GET ALL LISTINGS (with filters)
// ============================================================================
app.get('/listings', async (c) => {
  try {
    const status = c.req.query('status'); // active, inactive, sold_out
    const sellerId = c.req.query('seller_id');
    console.log('📋 Fetching listings, filters:', { status, sellerId });
    
    // Get all listings from KV store
    let listings = await kv.getByPrefix('market_listing:');
    
    // Filter by status
    if (status) {
      listings = listings.filter((l: any) => l.status === status);
    }
    
    // Filter by seller
    if (sellerId) {
      listings = listings.filter((l: any) => l.seller_id === sellerId);
    }
    
    // Sort by created_at desc
    listings.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    console.log(`✅ Found ${listings.length} listings`);
    
    return c.json({ success: true, listings });
  } catch (error: any) {
    console.error('❌ Error fetching listings:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// GET LISTING BY SLUG
// ============================================================================
app.get('/listings/slug/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    console.log('🔍 Fetching listing by slug:', slug);
    
    // Get all listings and find by slug
    const listings = await kv.getByPrefix('market_listing:');
    const listing = listings.find((l: any) => l.slug === slug);
    
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }
    
    // Get seller info
    const seller = await kv.get(`market_seller:${listing.seller_id}`);
    
    console.log('✅ Found listing:', listing.title);
    
    return c.json({ 
      success: true, 
      listing: {
        ...listing,
        seller: seller || null
      }
    });
  } catch (error: any) {
    console.error('❌ Error fetching listing:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// GET LISTING BY ID
// ============================================================================
app.get('/listings/:id', async (c) => {
  try {
    const id = c.req.param('id');
    console.log('🔍 Fetching listing by ID:', id);
    
    const listing = await kv.get(`market_listing:${id}`);
    
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }
    
    // Get seller info
    const seller = await kv.get(`market_seller:${listing.seller_id}`);
    
    console.log('✅ Found listing:', listing.title);
    
    return c.json({ 
      success: true, 
      listing: {
        ...listing,
        seller: seller || null
      }
    });
  } catch (error: any) {
    console.error('❌ Error fetching listing:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// CREATE LISTING
// ============================================================================
app.post('/listings', async (c) => {
  try {
    const body = await c.req.json();
    console.log('📝 Creating listing:', body);
    
    const {
      sellerId,
      title,
      slug,
      description,
      price_pence,
      images,
      quantity_available,
      category,
      tags
    } = body;
    
    if (!sellerId || !title || !slug || price_pence === undefined) {
      return c.json({ error: 'Seller ID, title, slug, and price are required' }, 400);
    }
    
    // Check if slug is unique
    const listings = await kv.getByPrefix('market_listing:');
    const existingSlug = listings.find((l: any) => l.slug === slug);
    if (existingSlug) {
      return c.json({ error: 'Slug already exists' }, 400);
    }
    
    const listing = {
      id: crypto.randomUUID(),
      seller_id: sellerId,
      title,
      slug,
      description: description || '',
      price_pence,
      images: images || [],
      quantity_available: quantity_available || 0,
      quantity_sold: 0,
      category: category || 'other',
      tags: tags || [],
      status: quantity_available > 0 ? 'active' : 'sold_out',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Save to KV store
    await kv.set(`market_listing:${listing.id}`, listing);
    
    console.log('✅ Listing created:', listing.id);
    
    return c.json({ success: true, listing });
  } catch (error: any) {
    console.error('❌ Error creating listing:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// UPDATE LISTING
// ============================================================================
app.put('/listings/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    console.log('🔄 Updating listing:', id, updates);
    
    const listing = await kv.get(`market_listing:${id}`);
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }
    
    // Update allowed fields
    if (updates.title !== undefined) listing.title = updates.title;
    if (updates.description !== undefined) listing.description = updates.description;
    if (updates.price_pence !== undefined) listing.price_pence = updates.price_pence;
    if (updates.images !== undefined) listing.images = updates.images;
    if (updates.quantity_available !== undefined) {
      listing.quantity_available = updates.quantity_available;
      // Auto-update status based on quantity
      listing.status = updates.quantity_available > 0 ? 'active' : 'sold_out';
    }
    if (updates.category !== undefined) listing.category = updates.category;
    if (updates.tags !== undefined) listing.tags = updates.tags;
    if (updates.status !== undefined) listing.status = updates.status;
    
    listing.updated_at = new Date().toISOString();
    
    await kv.set(`market_listing:${id}`, listing);
    
    console.log('✅ Listing updated');
    
    return c.json({ success: true, listing });
  } catch (error: any) {
    console.error('❌ Error updating listing:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// UPDATE LISTING QUANTITY (after purchase)
// ============================================================================
app.post('/listings/:id/purchase', async (c) => {
  try {
    const id = c.req.param('id');
    const { quantity } = await c.req.json();
    console.log('🛒 Processing purchase for listing:', id, 'quantity:', quantity);
    
    const listing = await kv.get(`market_listing:${id}`);
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }
    
    if (listing.quantity_available < quantity) {
      return c.json({ error: 'Insufficient quantity available' }, 400);
    }
    
    listing.quantity_available -= quantity;
    listing.quantity_sold += quantity;
    
    // Auto-update status
    if (listing.quantity_available === 0) {
      listing.status = 'sold_out';
    }
    
    listing.updated_at = new Date().toISOString();
    
    await kv.set(`market_listing:${id}`, listing);
    
    console.log('✅ Purchase processed, quantity remaining:', listing.quantity_available);
    
    return c.json({ success: true, listing });
  } catch (error: any) {
    console.error('❌ Error processing purchase:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// DELETE LISTING
// ============================================================================
app.delete('/listings/:id', async (c) => {
  try {
    const id = c.req.param('id');
    console.log('🗑️ Deleting listing:', id);
    
    await kv.del(`market_listing:${id}`);
    
    console.log('✅ Listing deleted');
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error deleting listing:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
