/**
 * Vendor Applications API
 * Handles vendor application submissions and admin management using KV store
 */

import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const app = new Hono();

// ============================================================================
// GET ALL VENDOR APPLICATIONS
// ============================================================================
app.get('/applications', async (c) => {
  try {
    console.log('📋 Fetching all vendor applications...');
    
    // Get all vendor applications from KV store
    const applications = await kv.getByPrefix('vendor_app:');
    
    console.log(`✅ Found ${applications.length} vendor applications`);
    
    return c.json({ 
      success: true, 
      applications: applications.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    });
  } catch (error: any) {
    console.error('❌ Error fetching vendor applications:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// GET VENDOR APPLICATION BY EMAIL
// ============================================================================
app.get('/applications/:email', async (c) => {
  try {
    const email = c.req.param('email');
    console.log('🔍 Fetching vendor application for:', email);
    
    const application = await kv.get(`vendor_app:${email}`);
    
    if (!application) {
      return c.json({ success: true, application: null, status: null });
    }
    
    console.log('✅ Found application:', application);
    
    return c.json({ 
      success: true, 
      application,
      status: application.status 
    });
  } catch (error: any) {
    console.error('❌ Error fetching vendor application:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// SUBMIT VENDOR APPLICATION
// ============================================================================
app.post('/applications', async (c) => {
  try {
    const body = await c.req.json();
    console.log('📝 Submitting vendor application:', body);
    
    const {
      email,
      displayName,
      bio,
      portfolioUrl,
      instagramHandle,
      userId,
      referralSource
    } = body;
    
    // Validate required fields
    if (!email || !displayName || !bio) {
      return c.json({ error: 'Email, display name, and bio are required' }, 400);
    }
    
    // Check if application already exists
    const existing = await kv.get(`vendor_app:${email}`);
    if (existing) {
      console.log('⚠️ Application already exists for:', email);
      return c.json({ 
        error: 'An application already exists for this email',
        status: existing.status 
      }, 400);
    }
    
    // Create application object
    const application = {
      id: crypto.randomUUID(),
      email,
      displayName,
      bio,
      portfolioUrl: portfolioUrl || null,
      instagramHandle: instagramHandle || null,
      userId: userId || null,
      referralSource: referralSource || 'direct',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reviewed_at: null,
      reviewed_by: null,
      admin_notes: null
    };
    
    // Save to KV store
    await kv.set(`vendor_app:${email}`, application);
    
    console.log('✅ Vendor application submitted successfully:', application.id);
    
    return c.json({ 
      success: true, 
      application,
      message: 'Application submitted successfully' 
    });
  } catch (error: any) {
    console.error('❌ Error submitting vendor application:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// UPDATE VENDOR APPLICATION STATUS (ADMIN ONLY)
// ============================================================================
app.put('/applications/:email', async (c) => {
  try {
    const email = c.req.param('email');
    const body = await c.req.json();
    console.log('🔄 Updating vendor application:', email, body);
    
    const { status, adminNotes } = body;
    
    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }
    
    // Get existing application
    const application = await kv.get(`vendor_app:${email}`);
    if (!application) {
      return c.json({ error: 'Application not found' }, 404);
    }
    
    // Update application
    const updatedApplication = {
      ...application,
      status,
      admin_notes: adminNotes || application.admin_notes,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Save updated application
    await kv.set(`vendor_app:${email}`, updatedApplication);
    
    console.log('✅ Vendor application updated successfully');
    
    return c.json({ 
      success: true, 
      application: updatedApplication,
      message: 'Application updated successfully' 
    });
  } catch (error: any) {
    console.error('❌ Error updating vendor application:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// DELETE VENDOR APPLICATION (ADMIN ONLY)
// ============================================================================
app.delete('/applications/:email', async (c) => {
  try {
    const email = c.req.param('email');
    console.log('🗑️ Deleting vendor application:', email);
    
    await kv.del(`vendor_app:${email}`);
    
    console.log('✅ Vendor application deleted successfully');
    
    return c.json({ 
      success: true, 
      message: 'Application deleted successfully' 
    });
  } catch (error: any) {
    console.error('❌ Error deleting vendor application:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
