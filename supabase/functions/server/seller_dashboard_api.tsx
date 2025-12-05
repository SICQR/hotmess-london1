/**
 * Seller Dashboard API
 * Real-time seller statistics and dashboard data
 */

import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const app = new Hono();

// ============================================================================
// GET SELLER DASHBOARD STATS
// ============================================================================
app.get('/dashboard/stats/:ownerId', async (c) => {
  try {
    const ownerId = c.req.param('ownerId');
    console.log('📊 Fetching dashboard stats for owner:', ownerId);
    
    // 1. Get seller account
    const seller = await kv.get(`market_seller:${ownerId}`);
    if (!seller) {
      return c.json({ error: 'Seller account not found' }, 404);
    }
    
    // 2. Get all listings for this seller
    const allListings = await kv.getByPrefix('market_listing:');
    const sellerListings = allListings.filter((l: any) => l.seller_id === ownerId);
    const activeListings = sellerListings.filter((l: any) => l.status === 'active');
    
    // 3. Get all orders for this seller
    const allOrders = await kv.getByPrefix('market_order:');
    const sellerOrders = allOrders.filter((o: any) => o.seller_id === ownerId);
    
    // 4. Calculate total sales (completed orders only)
    const completedOrders = sellerOrders.filter((o: any) => 
      o.status === 'delivered' || o.status === 'completed'
    );
    const totalSales = completedOrders.reduce((sum: number, order: any) => 
      sum + (order.total_amount || 0), 0
    );
    
    // 5. Calculate pending payouts (shipped/delivered but not yet paid out)
    const pendingPayoutOrders = sellerOrders.filter((o: any) => 
      (o.status === 'shipped' || o.status === 'delivered') && !o.payout_completed
    );
    const pendingPayouts = pendingPayoutOrders.reduce((sum: number, order: any) => 
      sum + (order.total_amount || 0), 0
    );
    
    // 6. Count pending shipment orders
    const pendingShipmentOrders = sellerOrders.filter((o: any) => 
      o.status === 'pending' || o.status === 'accepted'
    );
    
    // 7. Calculate total views across all listings
    const totalViews = sellerListings.reduce((sum: number, listing: any) => 
      sum + (listing.view_count || 0), 0
    );
    
    // 8. Calculate conversion rate (orders / views)
    const conversionRate = totalViews > 0 
      ? ((sellerOrders.length / totalViews) * 100).toFixed(1)
      : '0';
    
    // 9. Get recent orders (last 5)
    const recentOrders = sellerOrders
      .sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);
    
    // 10. Generate dynamic tasks based on seller state
    const tasks = [];
    
    // Task: Complete Stripe onboarding
    if (!seller.stripe_onboarding_complete) {
      tasks.push({
        id: 'stripe-onboarding',
        title: 'Complete your Stripe Connect onboarding to receive payouts',
        type: 'action',
        priority: 'high',
        cta: { label: 'COMPLETE SETUP', route: 'sellerSettings' }
      });
    }
    
    // Task: Pending shipments
    if (pendingShipmentOrders.length > 0) {
      tasks.push({
        id: 'pending-shipments',
        title: `You have ${pendingShipmentOrders.length} order${pendingShipmentOrders.length > 1 ? 's' : ''} pending shipment`,
        type: 'action',
        priority: 'high',
        cta: { label: 'VIEW ORDERS', route: 'sellerOrders' }
      });
    }
    
    // Task: No listings yet
    if (activeListings.length === 0) {
      tasks.push({
        id: 'create-listing',
        title: 'Create your first listing to start selling',
        type: 'action',
        priority: 'medium',
        cta: { label: 'CREATE LISTING', route: 'sellerListingCreate' }
      });
    }
    
    // Task: Pending approval
    if (seller.status === 'pending') {
      tasks.push({
        id: 'pending-approval',
        title: 'Your seller account is pending admin approval',
        type: 'info',
        priority: 'medium'
      });
    }
    
    // Task: Account suspended
    if (seller.status === 'suspended') {
      tasks.push({
        id: 'account-suspended',
        title: 'Your seller account has been suspended. Contact support for assistance.',
        type: 'warning',
        priority: 'high'
      });
    }
    
    // Task: Pending payouts available
    if (pendingPayouts > 0 && seller.stripe_onboarding_complete) {
      tasks.push({
        id: 'pending-payouts',
        title: `£${pendingPayouts.toFixed(2)} in pending payouts will be transferred to your account`,
        type: 'info',
        priority: 'low',
        cta: { label: 'VIEW PAYOUTS', route: 'sellerPayouts' }
      });
    }
    
    const stats = {
      // Core stats
      totalSales: totalSales,
      pendingPayouts: pendingPayouts,
      activeListings: activeListings.length,
      totalListings: sellerListings.length,
      views: totalViews,
      conversionRate: parseFloat(conversionRate),
      
      // Order stats
      totalOrders: sellerOrders.length,
      pendingShipments: pendingShipmentOrders.length,
      completedOrders: completedOrders.length,
      
      // Seller account status
      sellerStatus: seller.status,
      stripeConnected: seller.stripe_onboarding_complete,
      stripeAccountId: seller.stripe_account_id,
      
      // Recent activity
      recentOrders: recentOrders.map((order: any) => ({
        id: order.id,
        listing_id: order.listing_id,
        buyer_id: order.buyer_id,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at
      })),
      
      // Dynamic tasks
      tasks: tasks
    };
    
    console.log('✅ Dashboard stats calculated:', {
      totalSales: stats.totalSales,
      activeListings: stats.activeListings,
      pendingShipments: stats.pendingShipments,
      tasks: stats.tasks.length
    });
    
    return c.json({ success: true, stats });
    
  } catch (error: any) {
    console.error('❌ Error fetching dashboard stats:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// GET SELLER RECENT ACTIVITY
// ============================================================================
app.get('/dashboard/activity/:ownerId', async (c) => {
  try {
    const ownerId = c.req.param('ownerId');
    const limit = parseInt(c.req.query('limit') || '10');
    console.log('📋 Fetching recent activity for owner:', ownerId);
    
    // Get all orders for this seller
    const allOrders = await kv.getByPrefix('market_order:');
    const sellerOrders = allOrders
      .filter((o: any) => o.seller_id === ownerId)
      .sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, limit);
    
    // Enrich with listing data
    const activity = await Promise.all(
      sellerOrders.map(async (order: any) => {
        const listing = await kv.get(`market_listing:${order.listing_id}`);
        return {
          id: order.id,
          type: 'order',
          status: order.status,
          amount: order.total_amount,
          created_at: order.created_at,
          listing: listing ? {
            id: listing.id,
            title: listing.title,
            image: listing.images?.[0] || null
          } : null
        };
      })
    );
    
    console.log(`✅ Found ${activity.length} activity items`);
    
    return c.json({ success: true, activity });
    
  } catch (error: any) {
    console.error('❌ Error fetching activity:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// GET SELLER PERFORMANCE METRICS (30-day trends)
// ============================================================================
app.get('/dashboard/metrics/:ownerId', async (c) => {
  try {
    const ownerId = c.req.param('ownerId');
    console.log('📈 Fetching performance metrics for owner:', ownerId);
    
    // Get all orders for this seller
    const allOrders = await kv.getByPrefix('market_order:');
    const sellerOrders = allOrders.filter((o: any) => o.seller_id === ownerId);
    
    // Calculate 30-day metrics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const last30DaysOrders = sellerOrders.filter((o: any) => 
      new Date(o.created_at) >= thirtyDaysAgo
    );
    
    const revenue30d = last30DaysOrders
      .filter((o: any) => o.status === 'delivered' || o.status === 'completed')
      .reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
    
    // Calculate 7-day metrics for comparison
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const last7DaysOrders = sellerOrders.filter((o: any) => 
      new Date(o.created_at) >= sevenDaysAgo
    );
    
    const revenue7d = last7DaysOrders
      .filter((o: any) => o.status === 'delivered' || o.status === 'completed')
      .reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
    
    const metrics = {
      revenue30d: revenue30d,
      revenue7d: revenue7d,
      orders30d: last30DaysOrders.length,
      orders7d: last7DaysOrders.length,
      avgOrderValue30d: last30DaysOrders.length > 0 
        ? revenue30d / last30DaysOrders.length 
        : 0,
      // Simple growth calculation (7d vs 30d average)
      revenueGrowth: revenue7d > 0 && revenue30d > 0
        ? (((revenue7d / 7) / (revenue30d / 30) - 1) * 100).toFixed(1)
        : '0'
    };
    
    console.log('✅ Metrics calculated:', metrics);
    
    return c.json({ success: true, metrics });
    
  } catch (error: any) {
    console.error('❌ Error fetching metrics:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
