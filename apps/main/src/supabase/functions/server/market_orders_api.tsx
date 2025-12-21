/**
 * Market Orders API
 * Manages marketplace orders and shipments using KV store
 */

import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const app = new Hono();

// ============================================================================
// GET ALL ORDERS (with filters)
// ============================================================================
app.get('/orders', async (c) => {
  try {
    const status = c.req.query('status'); // pending, accepted, shipped, delivered, cancelled
    const sellerId = c.req.query('seller_id');
    const buyerId = c.req.query('buyer_id');
    console.log('📋 Fetching orders, filters:', { status, sellerId, buyerId });
    
    // Get all orders from KV store
    let orders = await kv.getByPrefix('market_order:');
    
    // Filter by status
    if (status) {
      orders = orders.filter((o: any) => o.status === status);
    }
    
    // Filter by seller
    if (sellerId) {
      orders = orders.filter((o: any) => o.seller_id === sellerId);
    }
    
    // Filter by buyer
    if (buyerId) {
      orders = orders.filter((o: any) => o.buyer_id === buyerId);
    }
    
    // Sort by created_at desc
    orders.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    console.log(`✅ Found ${orders.length} orders`);
    
    return c.json({ success: true, orders });
  } catch (error: any) {
    console.error('❌ Error fetching orders:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// GET ORDER BY ID
// ============================================================================
app.get('/orders/:id', async (c) => {
  try {
    const id = c.req.param('id');
    console.log('🔍 Fetching order:', id);
    
    const order = await kv.get(`market_order:${id}`);
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    // Get listing info
    const listing = await kv.get(`market_listing:${order.listing_id}`);
    
    // Get seller info
    const seller = await kv.get(`market_seller:${order.seller_id}`);
    
    // Get shipment info if exists
    const shipments = await kv.getByPrefix('market_shipment:');
    const shipment = shipments.find((s: any) => s.order_id === id);
    
    console.log('✅ Found order:', order.id);
    
    return c.json({ 
      success: true, 
      order: {
        ...order,
        listing: listing || null,
        seller: seller || null,
        shipment: shipment || null
      }
    });
  } catch (error: any) {
    console.error('❌ Error fetching order:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// CREATE ORDER
// ============================================================================
app.post('/orders', async (c) => {
  try {
    const body = await c.req.json();
    console.log('📝 Creating order:', body);
    
    const {
      listingId,
      sellerId,
      buyerId,
      buyerEmail,
      buyerName,
      quantity,
      price_pence,
      shippingAddress,
      stripePaymentIntentId
    } = body;
    
    if (!listingId || !sellerId || !buyerEmail || !quantity || !price_pence) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const order = {
      id: crypto.randomUUID(),
      listing_id: listingId,
      seller_id: sellerId,
      buyer_id: buyerId || null,
      buyer_email: buyerEmail,
      buyer_name: buyerName || '',
      quantity,
      price_pence,
      total_pence: price_pence * quantity,
      shipping_address: shippingAddress || null,
      stripe_payment_intent_id: stripePaymentIntentId || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      accepted_at: null,
      shipped_at: null,
      delivered_at: null,
      cancelled_at: null
    };
    
    // Save to KV store
    await kv.set(`market_order:${order.id}`, order);
    
    console.log('✅ Order created:', order.id);
    
    return c.json({ success: true, order });
  } catch (error: any) {
    console.error('❌ Error creating order:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// UPDATE ORDER STATUS
// ============================================================================
app.put('/orders/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    console.log('🔄 Updating order status:', id, status);
    
    const validStatuses = ['pending', 'accepted', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }
    
    const order = await kv.get(`market_order:${id}`);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    order.status = status;
    order.updated_at = new Date().toISOString();
    
    // Update timestamp based on status
    if (status === 'accepted') order.accepted_at = new Date().toISOString();
    if (status === 'shipped') order.shipped_at = new Date().toISOString();
    if (status === 'delivered') order.delivered_at = new Date().toISOString();
    if (status === 'cancelled') order.cancelled_at = new Date().toISOString();
    
    await kv.set(`market_order:${id}`, order);
    
    console.log('✅ Order status updated');
    
    return c.json({ success: true, order });
  } catch (error: any) {
    console.error('❌ Error updating order status:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// CREATE SHIPMENT
// ============================================================================
app.post('/shipments', async (c) => {
  try {
    const body = await c.req.json();
    console.log('📦 Creating shipment:', body);
    
    const {
      orderId,
      carrier,
      trackingNumber,
      trackingUrl
    } = body;
    
    if (!orderId || !carrier || !trackingNumber) {
      return c.json({ error: 'Order ID, carrier, and tracking number are required' }, 400);
    }
    
    // Verify order exists
    const order = await kv.get(`market_order:${orderId}`);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    const shipment = {
      id: crypto.randomUUID(),
      order_id: orderId,
      carrier,
      tracking_number: trackingNumber,
      tracking_url: trackingUrl || null,
      shipped_at: new Date().toISOString(),
      delivered_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Save shipment
    await kv.set(`market_shipment:${shipment.id}`, shipment);
    
    // Update order status to shipped
    order.status = 'shipped';
    order.shipped_at = shipment.shipped_at;
    order.updated_at = new Date().toISOString();
    await kv.set(`market_order:${orderId}`, order);
    
    console.log('✅ Shipment created:', shipment.id);
    
    return c.json({ success: true, shipment, order });
  } catch (error: any) {
    console.error('❌ Error creating shipment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// GET SHIPMENT BY ORDER ID
// ============================================================================
app.get('/shipments/order/:orderId', async (c) => {
  try {
    const orderId = c.req.param('orderId');
    console.log('🔍 Fetching shipment for order:', orderId);
    
    const shipments = await kv.getByPrefix('market_shipment:');
    const shipment = shipments.find((s: any) => s.order_id === orderId);
    
    if (!shipment) {
      return c.json({ success: true, shipment: null });
    }
    
    console.log('✅ Found shipment:', shipment.id);
    
    return c.json({ success: true, shipment });
  } catch (error: any) {
    console.error('❌ Error fetching shipment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// UPDATE SHIPMENT (mark as delivered)
// ============================================================================
app.put('/shipments/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    console.log('🔄 Updating shipment:', id, updates);
    
    const shipment = await kv.get(`market_shipment:${id}`);
    if (!shipment) {
      return c.json({ error: 'Shipment not found' }, 404);
    }
    
    // Update delivered status
    if (updates.delivered === true && !shipment.delivered_at) {
      shipment.delivered_at = new Date().toISOString();
      shipment.updated_at = new Date().toISOString();
      
      // Update order status
      const order = await kv.get(`market_order:${shipment.order_id}`);
      if (order) {
        order.status = 'delivered';
        order.delivered_at = shipment.delivered_at;
        order.updated_at = new Date().toISOString();
        await kv.set(`market_order:${shipment.order_id}`, order);
      }
    }
    
    await kv.set(`market_shipment:${id}`, shipment);
    
    console.log('✅ Shipment updated');
    
    return c.json({ success: true, shipment });
  } catch (error: any) {
    console.error('❌ Error updating shipment:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
