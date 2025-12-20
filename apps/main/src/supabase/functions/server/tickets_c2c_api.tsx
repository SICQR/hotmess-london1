/**
 * HOTMESS C2C TICKETS API
 * Peer-to-peer ticket marketplace with escrow
 */

import { Hono } from 'npm:hono@4.10.6';
import Stripe from 'npm:stripe@17.5.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const app = new Hono();

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Platform fee: 10% buyer fee + 5% seller fee
const BUYER_FEE_PERCENT = 0.10;
const SELLER_FEE_PERCENT = 0.05;

// ============================================================================
// GET LISTING DETAIL
// ============================================================================

app.get('/listings/:listingId', async (c) => {
  try {
    const listingId = c.req.param('listingId');
    
    const { data: listing, error } = await supabase
      .from('ticket_listings')
      .select(`
        *,
        seller:profiles!ticket_listings_seller_id_fkey(id, display_name, avatar_url),
        beacon:ticket_beacons!ticket_listings_beacon_id_fkey(title, event_name, event_date, venue_name)
      `)
      .eq('id', listingId)
      .eq('status', 'active')
      .single();
      
    if (error || !listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }
    
    return c.json({ success: true, listing });
  } catch (error: any) {
    console.error('Error fetching listing:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// CREATE CHECKOUT SESSION (C2C Purchase)
// ============================================================================

app.post('/listings/:listingId/checkout', async (c) => {
  try {
    // Get authenticated user
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const listingId = c.req.param('listingId');
    const { quantity } = await c.req.json();
    
    if (!quantity || quantity < 1) {
      return c.json({ error: 'Invalid quantity' }, 400);
    }
    
    // Get listing
    const { data: listing, error: listingError } = await supabase
      .from('ticket_listings')
      .select('*')
      .eq('id', listingId)
      .eq('status', 'active')
      .single();
      
    if (listingError || !listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }
    
    // Check quantity available
    if (listing.quantity_available < quantity) {
      return c.json({ error: 'Not enough tickets available' }, 400);
    }
    
    // Prevent self-purchase
    if (listing.seller_id === user.id) {
      return c.json({ error: 'Cannot purchase your own listing' }, 400);
    }
    
    // Calculate fees
    const ticketPrice = listing.price_pence;
    const totalTicketPrice = ticketPrice * quantity;
    const buyerFee = Math.round(totalTicketPrice * BUYER_FEE_PERCENT);
    const totalAmount = totalTicketPrice + buyerFee; // Buyer pays ticket price + buyer fee
    const sellerFee = Math.round(totalTicketPrice * SELLER_FEE_PERCENT);
    const sellerPayout = totalTicketPrice - sellerFee; // Seller receives ticket price - seller fee
    
    // Create Payment Intent (with capture_method: manual for escrow)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'gbp',
      capture_method: 'manual', // Hold funds in escrow until proof verified
      metadata: {
        listing_id: listingId,
        buyer_id: user.id,
        seller_id: listing.seller_id,
        quantity: quantity.toString(),
        ticket_price: ticketPrice.toString(),
        buyer_fee: buyerFee.toString(),
        seller_fee: sellerFee.toString(),
        seller_payout: sellerPayout.toString(),
      },
      description: `HOTMESS Ticket Purchase: ${listing.event_name || 'Event'}`,
    });
    
    // Create purchase record (status: pending_payment)
    const { data: purchase, error: purchaseError } = await supabase
      .from('ticket_purchases')
      .insert({
        listing_id: listingId,
        buyer_id: user.id,
        seller_id: listing.seller_id,
        quantity,
        price_pence: ticketPrice,
        buyer_fee_pence: buyerFee,
        seller_fee_pence: sellerFee,
        total_paid_pence: totalAmount,
        seller_payout_pence: sellerPayout,
        status: 'pending_payment',
        stripe_payment_intent_id: paymentIntent.id,
      })
      .select()
      .single();
      
    if (purchaseError) {
      console.error('Error creating purchase:', purchaseError);
      // Cancel payment intent if DB insert fails
      await stripe.paymentIntents.cancel(paymentIntent.id);
      return c.json({ error: 'Failed to create purchase' }, 500);
    }
    
    return c.json({
      success: true,
      client_secret: paymentIntent.client_secret,
      purchase_id: purchase.id,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// WEBHOOK: Payment Succeeded → Move to Escrow
// ============================================================================

app.post('/webhook/payment-succeeded', async (c) => {
  try {
    const { payment_intent_id } = await c.req.json();
    
    // Update purchase status to awaiting_proof (funds in escrow)
    const { data: purchase, error } = await supabase
      .from('ticket_purchases')
      .update({
        status: 'awaiting_proof',
        paid_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', payment_intent_id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating purchase:', error);
      return c.json({ error: error.message }, 500);
    }
    
    // Reserve tickets from listing
    await supabase.rpc('reserve_tickets', {
      p_listing_id: purchase.listing_id,
      p_quantity: purchase.quantity,
    });
    
    // Create thread for buyer-seller communication
    const { data: thread } = await supabase
      .from('ticket_threads')
      .insert({
        listing_id: purchase.listing_id,
        buyer_id: purchase.buyer_id,
        seller_id: purchase.seller_id,
        status: 'awaiting_proof',
      })
      .select()
      .single();
      
    // Send initial message to thread
    if (thread) {
      await supabase.from('ticket_messages').insert({
        thread_id: thread.id,
        sender_id: purchase.buyer_id,
        content: 'Hi! I\'ve purchased your ticket. Please upload proof of purchase.',
        is_system: true,
      });
    }
    
    // TODO: Trigger Make.com automation to notify seller
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// UPLOAD PROOF OF PURCHASE
// ============================================================================

app.post('/purchases/:purchaseId/proof', async (c) => {
  try {
    // Get authenticated user
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const purchaseId = c.req.param('purchaseId');
    const { proof_url } = await c.req.json();
    
    if (!proof_url) {
      return c.json({ error: 'proof_url required' }, 400);
    }
    
    // Get purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from('ticket_purchases')
      .select('*')
      .eq('id', purchaseId)
      .single();
      
    if (purchaseError || !purchase) {
      return c.json({ error: 'Purchase not found' }, 404);
    }
    
    // Verify user is the seller
    if (purchase.seller_id !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // Update purchase with proof
    const { error: updateError } = await supabase
      .from('ticket_purchases')
      .update({
        proof_url,
        proof_uploaded_at: new Date().toISOString(),
        status: 'proof_uploaded',
      })
      .eq('id', purchaseId);
      
    if (updateError) {
      console.error('Error updating proof:', updateError);
      return c.json({ error: updateError.message }, 500);
    }
    
    // TODO: Trigger Make.com automation to notify buyer
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Upload proof error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// VERIFY PROOF & RELEASE PAYMENT
// ============================================================================

app.post('/purchases/:purchaseId/verify', async (c) => {
  try {
    // Get authenticated user
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const purchaseId = c.req.param('purchaseId');
    const { approve } = await c.req.json();
    
    // Get purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from('ticket_purchases')
      .select('*')
      .eq('id', purchaseId)
      .single();
      
    if (purchaseError || !purchase) {
      return c.json({ error: 'Purchase not found' }, 404);
    }
    
    // Verify user is the buyer
    if (purchase.buyer_id !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    if (approve) {
      // APPROVE: Capture payment and release to seller
      
      // Capture payment intent (release escrow)
      await stripe.paymentIntents.capture(purchase.stripe_payment_intent_id);
      
      // Update purchase status
      await supabase
        .from('ticket_purchases')
        .update({
          status: 'completed',
          verified_at: new Date().toISOString(),
        })
        .eq('id', purchaseId);
        
      // Transfer funds to seller (create payout)
      // In production, this would be handled by Stripe Connect
      // For now, we just mark it as ready for payout
      
      // Award XP to buyer
      await supabase.rpc('award_xp', {
        p_user_id: purchase.buyer_id,
        p_amount: 50,
        p_reason: 'ticket_purchase_completed',
      });
      
      // TODO: Trigger Make.com automation to notify seller of payout
      
      return c.json({ success: true, message: 'Payment released to seller' });
    } else {
      // REJECT: Refund buyer
      
      // Cancel/refund payment intent
      await stripe.refunds.create({
        payment_intent: purchase.stripe_payment_intent_id,
      });
      
      // Update purchase status
      await supabase
        .from('ticket_purchases')
        .update({
          status: 'refunded',
          refunded_at: new Date().toISOString(),
        })
        .eq('id', purchaseId);
        
      // Return tickets to listing
      await supabase.rpc('return_tickets', {
        p_listing_id: purchase.listing_id,
        p_quantity: purchase.quantity,
      });
      
      // TODO: Trigger Make.com automation to notify seller of rejection
      
      return c.json({ success: true, message: 'Purchase rejected, buyer refunded' });
    }
  } catch (error: any) {
    console.error('Verify error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// GET PURCHASE DETAIL
// ============================================================================

app.get('/purchases/:purchaseId', async (c) => {
  try {
    // Get authenticated user
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const purchaseId = c.req.param('purchaseId');
    
    const { data: purchase, error } = await supabase
      .from('ticket_purchases')
      .select(`
        *,
        listing:ticket_listings(title, event_name, event_date),
        seller:profiles!ticket_purchases_seller_id_fkey(display_name, avatar_url),
        buyer:profiles!ticket_purchases_buyer_id_fkey(display_name, avatar_url)
      `)
      .eq('id', purchaseId)
      .single();
      
    if (error || !purchase) {
      return c.json({ error: 'Purchase not found' }, 404);
    }
    
    // Verify user is buyer or seller
    if (purchase.buyer_id !== user.id && purchase.seller_id !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    return c.json({ success: true, purchase });
  } catch (error: any) {
    console.error('Error fetching purchase:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
