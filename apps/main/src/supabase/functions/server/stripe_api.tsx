/**
 * HOTMESS LONDON — STRIPE API
 * 
 * Handles Stripe Connect and payment processing for Club Mode
 */

import { Hono } from 'npm:hono';
import Stripe from 'npm:stripe@17.5.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import * as kv from './kv_store.tsx';

const stripe = new Stripe(Deno.env.get('STRIPE_RESTRICTED_KEY') || '', {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

const app = new Hono();

// ============================================================================
// STRIPE CONNECT ENDPOINTS
// ============================================================================

/**
 * Create Stripe Connect account for venue
 */
app.post('/connect/create', async (c) => {
  try {
    const { club_id, club_name, owner_email } = await c.req.json();

    if (!club_id || !club_name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Create Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'GB',
      email: owner_email,
      business_type: 'company',
      company: {
        name: club_name,
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: {
        hotmess_club_id: club_id,
      },
    });

    // Update club with Stripe account ID
    const { error: updateError } = await supabase
      .from('clubs')
      .update({
        stripe_account_id: account.id,
        onboarding_complete: false,
        payouts_enabled: false,
      })
      .eq('id', club_id);

    if (updateError) {
      console.error('Error updating club with Stripe account:', updateError);
      return c.json({ error: 'Failed to update club' }, 500);
    }

    return c.json({
      success: true,
      account_id: account.id,
    });
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error);
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * Get onboarding link for Stripe Connect
 */
app.post('/connect/onboarding-link', async (c) => {
  try {
    const { account_id, refresh_url, return_url } = await c.req.json();

    if (!account_id) {
      return c.json({ error: 'Missing account_id' }, 400);
    }

    const accountLink = await stripe.accountLinks.create({
      account: account_id,
      refresh_url,
      return_url,
      type: 'account_onboarding',
    });

    return c.json({
      success: true,
      url: accountLink.url,
    });
  } catch (error) {
    console.error('Error creating onboarding link:', error);
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * Check Stripe Connect account status
 */
app.post('/connect/status', async (c) => {
  try {
    const { account_id } = await c.req.json();

    if (!account_id) {
      return c.json({ error: 'Missing account_id' }, 400);
    }

    const account = await stripe.accounts.retrieve(account_id);

    // Update club with latest status
    const { error: updateError } = await supabase
      .from('clubs')
      .update({
        onboarding_complete: account.details_submitted || false,
        payouts_enabled: account.payouts_enabled || false,
      })
      .eq('stripe_account_id', account_id);

    if (updateError) {
      console.error('Error updating club status:', updateError);
    }

    return c.json({
      success: true,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
    });
  } catch (error) {
    console.error('Error checking account status:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============================================================================
// TICKET PURCHASE ENDPOINTS
// ============================================================================

/**
 * Purchase ticket (create Payment Intent)
 */
app.post('/purchase-ticket', async (c) => {
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

    const { event_id, tier, price, buyer_email } = await c.req.json();

    if (!event_id || !tier || !price) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get event and club
    const { data: event, error: eventError } = await supabase
      .from('club_events')
      .select('*, clubs(stripe_account_id, onboarding_complete)')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      return c.json({ error: 'Event not found' }, 404);
    }

    // Type the joined data properly
    interface EventWithClub {
      clubs: {
        stripe_account_id: string | null;
        onboarding_complete: boolean;
      } | null;
    }
    
    const eventWithClub = event as unknown as EventWithClub;
    const club = eventWithClub.clubs;
    
    if (!club || !club.stripe_account_id || !club.onboarding_complete) {
      return c.json({ error: 'Venue payment setup incomplete' }, 400);
    }

    // Calculate fees
    const stripeFee = Math.round(price * 0.029 + 30);
    const platformFee = Math.round(price * 0.05);
    const venueAmount = price - stripeFee - platformFee;

    // Generate QR code (temporary - will be replaced with proper QR generation)
    const qrCode = `HOTMESS-${event_id.slice(0, 8).toUpperCase()}-${Date.now()}-${tier.toUpperCase()}`;

    // Create ticket record (status: purchased)
    const { data: ticket, error: ticketError } = await supabase
      .from('club_tickets')
      .insert({
        type: 'club_primary',
        event_id,
        buyer_id: user.id,
        tier,
        price,
        fee_buyer: platformFee + stripeFee,
        status: 'purchased',
        qr_code: qrCode,
      })
      .select()
      .single();

    if (ticketError || !ticket) {
      console.error('Error creating ticket:', ticketError);
      return c.json({ error: 'Failed to create ticket' }, 500);
    }

    // Create Payment Intent with Connect
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: 'gbp',
      customer_email: buyer_email || user.email,
      application_fee_amount: platformFee,
      transfer_data: {
        destination: club.stripe_account_id,
      },
      metadata: {
        hotmess_ticket_id: ticket.id,
        hotmess_event_id: event_id,
        hotmess_buyer_id: user.id,
        tier,
      },
    });

    // Trigger Make.com webhook for ticket purchase
    const makeWebhook = Deno.env.get('MAKE_WEBHOOK_TICKET_PURCHASE');
    if (makeWebhook) {
      fetch(makeWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'ticket.purchased',
          timestamp: new Date().toISOString(),
          ticketId: ticket.id,
          eventId: event_id,
          eventName: event?.name || 'Event',
          eventDate: event?.event_date || new Date().toISOString(),
          buyerId: user.id,
          buyerEmail: buyer_email || user.email,
          buyerName: user.user_metadata?.displayName || user.email,
          tier,
          price: price / 100, // Convert from pence to pounds
          qrCode: qrCode,
          paymentIntentId: paymentIntent.id
        })
      }).catch(err => console.error('Make.com webhook error:', err));
    }

    return c.json({
      success: true,
      client_secret: paymentIntent.client_secret,
      ticket_id: ticket.id,
      qr_code: qrCode,
    });
  } catch (error) {
    console.error('Error purchasing ticket:', error);
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * Confirm payment (webhook or manual confirmation)
 */
app.post('/confirm-payment', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { payment_intent_id, ticket_id } = await c.req.json();

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      return c.json({ error: 'Payment not completed' }, 400);
    }

    // Get ticket with event data
    const { data: ticket, error: ticketError } = await supabase
      .from('club_tickets')
      .select('*, club_events(*)')
      .eq('id', ticket_id)
      .single();

    if (ticketError || !ticket) {
      return c.json({ error: 'Ticket not found' }, 404);
    }

    // Type the joined data properly
    interface TicketWithEvent {
      event_id: string;
      tier: string;
      price: number;
      club_events: {
        club_id: string;
      } | null;
    }
    
    const typedTicket = ticket as unknown as TicketWithEvent;
    
    if (!typedTicket.club_events) {
      return c.json({ error: 'Event data not found' }, 404);
    }

    // Update event stats using helper function
    const { error: statsError } = await supabase.rpc('increment_event_ticket_sales', {
      event_id: typedTicket.event_id,
      tier: typedTicket.tier,
      amount: typedTicket.price,
    });

    if (statsError) {
      console.error('Error updating event stats:', statsError);
    }

    // Get current club stats to update them
    const { data: clubData } = await supabase
      .from('clubs')
      .select('total_tickets_sold, total_revenue')
      .eq('id', typedTicket.club_events.club_id)
      .single();

    // Update club stats
    const { error: clubStatsError } = await supabase
      .from('clubs')
      .update({
        total_tickets_sold: (clubData?.total_tickets_sold || 0) + 1,
        total_revenue: (clubData?.total_revenue || 0) + typedTicket.price,
      })
      .eq('id', typedTicket.club_events.club_id);

    if (clubStatsError) {
      console.error('Error updating club stats:', clubStatsError);
    }

    return c.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * Refund ticket
 */
app.post('/refund-ticket', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { ticket_id, reason } = await c.req.json();

    // Get ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('club_tickets')
      .select('*')
      .eq('id', ticket_id)
      .single();

    if (ticketError || !ticket) {
      return c.json({ error: 'Ticket not found' }, 404);
    }

    // Find payment intent (this requires storing it in the ticket record)
    // For now, we'll skip the actual Stripe refund and just update status

    // Update ticket status
    const { error: updateError } = await supabase
      .from('club_tickets')
      .update({
        status: 'refunded',
        refunded_at: new Date().toISOString(),
      })
      .eq('id', ticket_id);

    if (updateError) {
      return c.json({ error: 'Failed to refund ticket' }, 500);
    }

    return c.json({
      success: true,
      refund: { ticket_id, status: 'refunded' },
    });
  } catch (error) {
    console.error('Error refunding ticket:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============================================================================
// SHOP PURCHASE ENDPOINTS
// ============================================================================

/**
 * Get shop orders for a user
 */
app.get('/shop-orders', async (c) => {
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

    // Get all shop orders from KV store
    const allOrders = await kv.getByPrefix('shop_order:');
    
    // Filter orders by user ID
    const userOrders = allOrders
      .filter((order: any) => order.user_id === user.id)
      .sort((a: any, b: any) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA; // Most recent first
      });

    return c.json({
      success: true,
      orders: userOrders,
    });
  } catch (error) {
    console.error('Error fetching shop orders:', error);
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * Get a single shop order
 */
app.get('/shop-orders/:orderId', async (c) => {
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

    const orderId = c.req.param('orderId');
    const order = await kv.get(`shop_order:${orderId}`);

    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    // Check if order belongs to user
    if (order.user_id !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    return c.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error fetching shop order:', error);
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * Purchase shop products (create Payment Intent)
 */
app.post('/purchase-shop', async (c) => {
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

    const { items, total, buyer_email } = await c.req.json();

    if (!items || !Array.isArray(items) || items.length === 0 || !total) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Generate order ID
    const orderId = `HM-${Date.now().toString(36).toUpperCase()}`;

    // Create order record in KV store
    try {
      await kv.set(`shop_order:${orderId}`, {
        order_id: orderId,
        user_id: user.id,
        items,
        total,
        status: 'pending',
        email: buyer_email || user.email,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating order in KV store:', error);
      // Continue anyway - order can be created later via webhook
    }

    // Create Payment Intent (direct charge - no Connect needed for shop)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'gbp',
      customer_email: buyer_email || user.email,
      metadata: {
        hotmess_order_id: orderId,
        hotmess_buyer_id: user.id,
        hotmess_type: 'shop',
        hotmess_items: JSON.stringify(items.map((item: any) => ({
          id: item.id,
          title: item.title,
          qty: item.qty,
          price: item.price,
        }))),
      },
    });

    return c.json({
      success: true,
      client_secret: paymentIntent.client_secret,
      order_id: orderId,
    });
  } catch (error) {
    console.error('Error purchasing shop products:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============================================================================
// WEBHOOKS
// ============================================================================

/**
 * Stripe webhook handler
 */
app.post('/webhook', async (c) => {
  try {
    const signature = c.req.header('stripe-signature');
    const body = await c.req.text();

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('No webhook secret configured');
      return c.json({ error: 'Webhook not configured' }, 500);
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const ticketId = paymentIntent.metadata.hotmess_ticket_id;
        const orderId = paymentIntent.metadata.hotmess_order_id;
        const orderType = paymentIntent.metadata.hotmess_type;

        if (ticketId) {
          // Mark ticket as confirmed
          await supabase
            .from('club_tickets')
            .update({ status: 'purchased' })
            .eq('id', ticketId);
        }

        if (orderId && orderType === 'shop') {
          // Mark shop order as paid in KV store
          try {
            const order = await kv.get(`shop_order:${orderId}`);
            if (order) {
              await kv.set(`shop_order:${orderId}`, {
                ...order,
                status: 'paid',
                paid_at: new Date().toISOString(),
                payment_intent_id: paymentIntent.id,
              });
            }
          } catch (error) {
            console.error('Error updating order in KV store:', error);
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const ticketId = paymentIntent.metadata.hotmess_ticket_id;
        const orderId = paymentIntent.metadata.hotmess_order_id;
        const orderType = paymentIntent.metadata.hotmess_type;

        if (ticketId) {
          // Mark ticket as cancelled
          await supabase
            .from('club_tickets')
            .update({ status: 'cancelled' })
            .eq('id', ticketId);
        }

        if (orderId && orderType === 'shop') {
          // Mark shop order as failed in KV store
          try {
            const order = await kv.get(`shop_order:${orderId}`);
            if (order) {
              await kv.set(`shop_order:${orderId}`, {
                ...order,
                status: 'failed',
                payment_intent_id: paymentIntent.id,
              });
            }
          } catch (error) {
            console.error('Error updating failed order in KV store:', error);
          }
        }
        break;
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        const clubId = account.metadata.hotmess_club_id;

        if (clubId) {
          // Update club status
          await supabase
            .from('clubs')
            .update({
              onboarding_complete: account.details_submitted || false,
              payouts_enabled: account.payouts_enabled || false,
            })
            .eq('id', clubId);
        }
        break;
      }
    }

    return c.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: String(error) }, 400);
  }
});

export default app;
