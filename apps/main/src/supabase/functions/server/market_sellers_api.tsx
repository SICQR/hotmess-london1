/**
 * Market Sellers API
 * Manages marketplace seller accounts using KV store
 */

import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const app = new Hono();

// ============================================================================
// GET ALL SELLERS (with optional status filter)
// ============================================================================
app.get('/sellers', async (c) => {
  try {
    const status = c.req.query('status'); // pending, approved, suspended
    console.log('📋 Fetching sellers, status filter:', status || 'all');
    
    // Get all sellers from KV store
    let sellers = await kv.getByPrefix('market_seller:');
    
    // Filter by status if provided
    if (status) {
      sellers = sellers.filter((s: any) => s.status === status);
    }
    
    // Sort by created_at desc
    sellers.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    console.log(`✅ Found ${sellers.length} sellers`);
    
    return c.json({ success: true, sellers });
  } catch (error: any) {
    console.error('❌ Error fetching sellers:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// GET SELLER BY OWNER ID
// ============================================================================
app.get('/sellers/:ownerId', async (c) => {
  try {
    const ownerId = c.req.param('ownerId');
    console.log('🔍 Fetching seller for owner:', ownerId);
    
    const seller = await kv.get(`market_seller:${ownerId}`);
    
    if (!seller) {
      return c.json({ success: true, seller: null });
    }
    
    console.log('✅ Found seller:', seller.display_name);
    
    return c.json({ success: true, seller });
  } catch (error: any) {
    console.error('❌ Error fetching seller:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// CREATE/UPDATE SELLER
// ============================================================================
app.post('/sellers', async (c) => {
  try {
    const body = await c.req.json();
    console.log('📝 Creating/updating seller:', body);
    
    const {
      ownerId,
      displayName,
      stripeAccountId,
      stripeOnboardingComplete,
      whiteLabelEnabled,
      status
    } = body;
    
    if (!ownerId || !displayName) {
      return c.json({ error: 'Owner ID and display name are required' }, 400);
    }
    
    // Check if seller exists
    const existing = await kv.get(`market_seller:${ownerId}`);
    
    const seller = {
      id: existing?.id || crypto.randomUUID(),
      owner_id: ownerId,
      display_name: displayName,
      stripe_account_id: stripeAccountId || existing?.stripe_account_id || null,
      stripe_onboarding_complete: stripeOnboardingComplete ?? existing?.stripe_onboarding_complete ?? false,
      white_label_enabled: whiteLabelEnabled ?? existing?.white_label_enabled ?? false,
      status: status || existing?.status || 'pending',
      created_at: existing?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Save to KV store
    await kv.set(`market_seller:${ownerId}`, seller);
    
    console.log('✅ Seller saved successfully:', seller.id);
    
    return c.json({ success: true, seller });
  } catch (error: any) {
    console.error('❌ Error saving seller:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// UPDATE SELLER STATUS (ADMIN)
// ============================================================================
app.put('/sellers/:ownerId/status', async (c) => {
  try {
    const ownerId = c.req.param('ownerId');
    const { status } = await c.req.json();
    console.log('🔄 Updating seller status:', ownerId, status);
    
    if (!['pending', 'approved', 'suspended'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }
    
    const seller = await kv.get(`market_seller:${ownerId}`);
    if (!seller) {
      return c.json({ error: 'Seller not found' }, 404);
    }
    
    seller.status = status;
    seller.updated_at = new Date().toISOString();
    
    await kv.set(`market_seller:${ownerId}`, seller);
    
    console.log('✅ Seller status updated');
    
    return c.json({ success: true, seller });
  } catch (error: any) {
    console.error('❌ Error updating seller status:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// UPDATE SELLER DETAILS
// ============================================================================
app.put('/sellers/:ownerId', async (c) => {
  try {
    const ownerId = c.req.param('ownerId');
    const updates = await c.req.json();
    console.log('🔄 Updating seller:', ownerId, updates);
    
    const seller = await kv.get(`market_seller:${ownerId}`);
    if (!seller) {
      return c.json({ error: 'Seller not found' }, 404);
    }
    
    // Update allowed fields
    if (updates.displayName !== undefined) seller.display_name = updates.displayName;
    if (updates.stripeAccountId !== undefined) seller.stripe_account_id = updates.stripeAccountId;
    if (updates.stripeOnboardingComplete !== undefined) seller.stripe_onboarding_complete = updates.stripeOnboardingComplete;
    if (updates.whiteLabelEnabled !== undefined) seller.white_label_enabled = updates.whiteLabelEnabled;
    
    seller.updated_at = new Date().toISOString();
    
    await kv.set(`market_seller:${ownerId}`, seller);
    
    console.log('✅ Seller updated');
    
    return c.json({ success: true, seller });
  } catch (error: any) {
    console.error('❌ Error updating seller:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// DELETE SELLER
// ============================================================================
app.delete('/sellers/:ownerId', async (c) => {
  try {
    const ownerId = c.req.param('ownerId');
    console.log('🗑️ Deleting seller:', ownerId);
    
    await kv.del(`market_seller:${ownerId}`);
    
    console.log('✅ Seller deleted');
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error deleting seller:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
