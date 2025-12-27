// market_api.tsx - MessMarket marketplace APIs (Stripe Connect)
import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@17';

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}));

// Logger middleware
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-11-20.acacia',
});

// ============================================================================
// SELLER ONBOARDING (Stripe Connect Express)
// ============================================================================

// Create account session for embedded onboarding
app.post('/seller-onboard', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { display_name } = await c.req.json();

    if (!display_name?.trim()) {
      return c.json({ error: 'display_name required' }, 400);
    }

    // Get or create seller record
    const { data: seller, error: sellerError } = await supabase
      .from('market_sellers')
      .select('*')
      .eq('owner_id', user.id)
      .single();

    let stripeAccountId = seller?.stripe_account_id;

    // Create Connect account if doesn't exist
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'GB',
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          hotmess_user_id: user.id,
          display_name: display_name.trim(),
        },
      });

      stripeAccountId = account.id;

      // Create or update seller record
      if (seller) {
        await supabase
          .from('market_sellers')
          .update({ 
            stripe_account_id: stripeAccountId,
            display_name: display_name.trim(),
          })
          .eq('id', seller.id);
      } else {
        await supabase.from('market_sellers').insert({
          owner_id: user.id,
          stripe_account_id: stripeAccountId,
          display_name: display_name.trim(),
          status: 'pending',
        });
      }
    }

    // Create Account Session for embedded onboarding
    const accountSession = await stripe.accountSessions.create({
      account: stripeAccountId,
      components: {
        account_onboarding: { enabled: true },
      },
    });

    return c.json({
      clientSecret: accountSession.client_secret,
      stripe_account_id: stripeAccountId,
    });
  } catch (err: any) {
    console.error('Seller onboarding error:', err);
    return c.json({ error: err.message }, 500);
  }
});

// Get seller dashboard session for embedded dashboard
app.post('/seller-dashboard-session', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get seller record
    const { data: seller } = await supabase
      .from('market_sellers')
      .select('stripe_account_id')
      .eq('owner_id', user.id)
      .single();

    if (!seller?.stripe_account_id) {
      return c.json({ error: 'No Stripe account found' }, 404);
    }

    // Create Account Session for embedded dashboard
    const accountSession = await stripe.accountSessions.create({
      account: seller.stripe_account_id,
      components: {
        account_management: { enabled: true },
        balances: { enabled: true },
        payouts: { enabled: true },
      },
    });

    return c.json({
      clientSecret: accountSession.client_secret,
    });
  } catch (err: any) {
    console.error('Dashboard session error:', err);
    return c.json({ error: err.message }, 500);
  }
});

// ============================================================================
// CHECKOUT & PAYMENT
// ============================================================================

// Create checkout session (for Stripe Checkout)
app.post('/create-checkout', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { listing_id } = await c.req.json();

    if (!listing_id) {
      return c.json({ error: 'listing_id required' }, 400);
    }

    // Get listing
    const { data: listing, error: listingError } = await supabase
      .from('market_listings')
      .select(`
        *,
        seller:market_sellers!inner(stripe_account_id, display_name)
      `)
      .eq('id', listing_id)
      .single();

    if (listingError || !listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }

    if (listing.status !== 'active') {
      return c.json({ error: 'Listing not available' }, 400);
    }

    if (!listing.seller?.stripe_account_id) {
      return c.json({ error: 'Seller not connected to Stripe' }, 400);
    }

    // Calculate fees
    const platformFeePercentage = 12; // 12% standard, 20% for white-label
    const applicationFeeAmount = Math.round(listing.price_pence * (platformFeePercentage / 100));

    // Create Payment Intent (for Payment Element)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: listing.price_pence, // Already in pence
      currency: 'gbp',
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: listing.seller.stripe_account_id,
      },
      metadata: {
        listing_id: listing.id,
        buyer_id: user.id,
        seller_id: listing.seller_id,
      },
    });

    return c.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    });
  } catch (err: any) {
    console.error('Create checkout error:', err);
    return c.json({ error: err.message }, 500);
  }
});

// ============================================================================
// STRIPE WEBHOOK HANDLER
// ============================================================================

app.post('/stripe-webhook', async (c) => {
  try {
    const signature = c.req.header('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !webhookSecret) {
      return c.json({ error: 'Missing signature or secret' }, 400);
    }

    const body = await c.req.text();
    
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return c.json({ error: 'Invalid signature' }, 400);
    }

    console.log('Stripe webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        await handleAccountUpdated(account);
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return c.json({ received: true });
  } catch (err: any) {
    console.error('Stripe webhook error:', err);
    return c.json({ error: err.message }, 500);
  }
});

function purchaseXpFromTotalPence(totalPence: number) {
  // 10 XP per £ => total_pence / 10
  return Math.max(0, Math.floor(Number(totalPence || 0) / 10));
}

async function markOrderPaid(orderId: string, session: Stripe.Checkout.Session) {
  const patch: Record<string, unknown> = {
    status: 'paid',
    paid_at: new Date().toISOString(),
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: session.payment_intent as string,
  };

  const attempt = await supabase.from('market_orders').update(patch).eq('id', orderId);
  if (!attempt.error) return { ok: true as const };

  const msg = String(attempt.error.message || '');
  // Schema cache can be stale or migrations not applied yet.
  if (msg.includes("Could not find the 'paid_at'") || (msg.includes('paid_at') && msg.includes('schema cache'))) {
    const { paid_at: _paidAt, ...rest } = patch as any;
    const retry = await supabase.from('market_orders').update(rest).eq('id', orderId);
    if (!retry.error) return { ok: true as const };
    return { ok: false as const, error: retry.error };
  }

  return { ok: false as const, error: attempt.error };
}

async function awardPurchaseXp(params: {
  orderId: string;
  userId: string;
  totalPence: number;
  currency: string;
  stripeEventId?: string;
}) {
  const xp = purchaseXpFromTotalPence(params.totalPence);
  if (xp <= 0) return;

  const existing = await supabase
    .from('xp_ledger')
    .select('id')
    .eq('user_id', params.userId)
    .eq('kind', 'purchase')
    .eq('ref_id', params.orderId)
    .limit(1)
    .maybeSingle();

  if (existing.data?.id) return;

  const ins = await supabase.from('xp_ledger').insert({
    user_id: params.userId,
    kind: 'purchase',
    amount: xp,
    ref_id: params.orderId,
    metadata: {
      currency: params.currency,
      total_pence: params.totalPence,
      stripe_event_id: params.stripeEventId,
    },
  });

  if (ins.error) {
    await supabase.from('audit_log').insert({
      action: 'xp_award_error',
      entity_type: 'xp_ledger',
      entity_id: params.orderId,
      meta: { stripe_event_id: params.stripeEventId, message: String(ins.error.message || ins.error) },
    });
  }
}

async function activateBeaconFromMetadata(metadata: Stripe.Metadata | null | undefined, stripeEventId?: string) {
  const beaconId = String((metadata as any)?.beacon_id || (metadata as any)?.spawn_beacon_id || (metadata as any)?.globe_beacon_id || '').trim();
  if (!beaconId) return;

  const patch: Record<string, unknown> = {
    status: 'active',
    starts_at: new Date().toISOString(),
  };

  const lat = (metadata as any)?.geo_lat ? Number((metadata as any).geo_lat) : NaN;
  const lng = (metadata as any)?.geo_lng ? Number((metadata as any).geo_lng) : NaN;
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    patch.geo_lat = lat;
    patch.geo_lng = lng;
  }
  if ((metadata as any)?.city_slug) patch.city_slug = String((metadata as any).city_slug).slice(0, 100);

  const up = await supabase.from('beacons').update(patch).eq('id', beaconId);
  if (up.error) {
    await supabase.from('audit_log').insert({
      action: 'beacon_activate_error',
      entity_type: 'beacons',
      entity_id: beaconId,
      meta: { stripe_event_id: stripeEventId, message: String(up.error.message || up.error) },
    });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id;
  if (!orderId) return;

  console.log('✅ Checkout completed for order:', orderId);

  const { data: before } = await supabase
    .from('market_orders')
    .select('id,status')
    .eq('id', orderId)
    .maybeSingle();

  const wasCreated = before?.status === 'created';

  // Mark order as paid
  const paidRes = await markOrderPaid(orderId, session);
  if (!paidRes.ok) {
    console.error('Failed to update order status:', paidRes.error);
    return;
  }

  // Get order details for notifications
  const { data: order } = await supabase
    .from('market_orders')
    .select(`
      *,
      seller:market_sellers(owner_id),
      buyer:buyer_id(email)
    `)
    .eq('id', orderId)
    .single();

  if (!order) return;

  const seller = order.seller as any;

  // XP awarding + optional beacon activation (idempotent)
  try {
    await awardPurchaseXp({
      orderId,
      userId: String(order.buyer_id),
      totalPence: Number((order as any).total_pence || 0),
      currency: String((order as any).currency || 'GBP'),
      stripeEventId: undefined,
    });
  } catch (xpErr: any) {
    console.error('Failed to award purchase XP (non-critical):', xpErr);
  }

  try {
    await activateBeaconFromMetadata(session.metadata, undefined);
  } catch (beaconErr: any) {
    console.error('Failed to activate beacon (non-critical):', beaconErr);
  }

  // Only notify once (Stripe retries, multiple event types)
  if (!wasCreated) return;

  // Notify seller
  await supabase.from('notifications').insert({
    user_id: seller.owner_id,
    channel: 'inapp',
    type: 'order_paid',
    title: 'New Order Received',
    body: `You have a new order. Accept within ${seller.response_sla_hours || 12} hours.`,
    href: `/seller/orders/${orderId}`,
  });

  // Notify buyer
  await supabase.from('notifications').insert({
    user_id: order.buyer_id,
    channel: 'inapp',
    type: 'order_paid',
    title: 'Order Confirmed',
    body: 'Your order is being processed by the seller.',
    href: `/messmarket/orders/${orderId}`,
  });

  // Send order confirmation email
  console.log('📧 Triggering email confirmation for order:', orderId);
  try {
    const { sendOrderConfirmationEmail } = await import('./email_service.tsx');
    await sendOrderConfirmationEmail(orderId);
  } catch (emailErr: any) {
    console.error('Email send failed (non-critical):', emailErr);
    // Don't fail the webhook if email fails
  }

  // Audit log
  await supabase.from('audit_log').insert({
    action: 'order_paid',
    entity_type: 'market_order',
    entity_id: orderId,
    meta: { total_pence: order.total_pence },
  });
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const listingId = paymentIntent.metadata?.listing_id;
  const buyerId = paymentIntent.metadata?.buyer_id;
  const sellerId = paymentIntent.metadata?.seller_id;

  if (!listingId || !buyerId || !sellerId) {
    console.error('Missing metadata in payment intent');
    return;
  }

  console.log('💰 Payment succeeded for listing:', listingId);

  // Check if order already exists
  const { data: existingOrder } = await supabase
    .from('market_orders')
    .select('id')
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .maybeSingle();

  if (existingOrder) {
    console.log('Order already exists:', existingOrder.id);
    return;
  }

  // Get listing details
  const { data: listing } = await supabase
    .from('market_listings')
    .select('*')
    .eq('id', listingId)
    .single();

  if (!listing) {
    console.error('Listing not found:', listingId);
    return;
  }

  // Create order record
  const { data: order, error: orderError } = await supabase
    .from('market_orders')
    .insert({
      buyer_id: buyerId,
      seller_id: sellerId,
      listing_id: listingId,
      quantity: 1,
      price_pence_per_unit: listing.price_pence,
      total_pence: listing.price_pence,
      stripe_payment_intent_id: paymentIntent.id,
      status: 'paid',
      // Extract shipping from payment intent
      shipping_name: (paymentIntent.shipping as any)?.name,
      shipping_line1: (paymentIntent.shipping as any)?.address?.line1,
      shipping_line2: (paymentIntent.shipping as any)?.address?.line2,
      shipping_city: (paymentIntent.shipping as any)?.address?.city,
      shipping_postcode: (paymentIntent.shipping as any)?.address?.postal_code,
      shipping_country: (paymentIntent.shipping as any)?.address?.country || 'GB',
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error('Failed to create order:', orderError);
    return;
  }

  console.log('✅ Order created:', order.id);

  // Notify seller
  await supabase.from('notifications').insert({
    user_id: sellerId,
    channel: 'inapp',
    type: 'order_paid',
    title: 'New Order Received',
    body: `You have a new order. Accept within 12 hours.`,
    href: `/seller/orders`,
  });

  // Notify buyer
  await supabase.from('notifications').insert({
    user_id: buyerId,
    channel: 'inapp',
    type: 'order_paid',
    title: 'Order Confirmed',
    body: 'Your order is being processed by the seller.',
    href: `/messmarket/orders/${order.id}`,
  });

  // Audit log
  await supabase.from('audit_log').insert({
    action: 'order_paid',
    entity_type: 'market_order',
    entity_id: order.id,
    meta: { total_pence: order.total_pence },
  });
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const orderId = charge.metadata?.order_id;
  if (!orderId) return;

  await supabase
    .from('market_orders')
    .update({ status: 'refunded' })
    .eq('id', orderId);

  await supabase.from('audit_log').insert({
    action: 'order_refunded',
    entity_type: 'market_order',
    entity_id: orderId,
    meta: { charge_id: charge.id },
  });
}

async function handleAccountUpdated(account: Stripe.Account) {
  const onboardingComplete = account.details_submitted && account.charges_enabled;

  await supabase
    .from('market_sellers')
    .update({
      stripe_onboarding_complete: onboardingComplete,
    })
    .eq('stripe_account_id', account.id);

  if (onboardingComplete) {
    // Notify seller
    const { data: seller } = await supabase
      .from('market_sellers')
      .select('owner_id')
      .eq('stripe_account_id', account.id)
      .single();

    if (seller) {
      await supabase.from('notifications').insert({
        user_id: seller.owner_id,
        channel: 'inapp',
        type: 'stripe_onboarding_complete',
        title: 'Payments Ready',
        body: 'Your seller account is now ready to receive payments.',
        href: '/seller',
      });
    }
  }
}

// ============================================================================
// SELLER ACTIONS (Accept, Ship, etc.)
// ============================================================================

app.post('/accept-order', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { order_id } = await c.req.json();

    // Verify seller owns this order
    const { data: order } = await supabase
      .from('market_orders')
      .select(`
        *,
        seller:market_sellers(owner_id)
      `)
      .eq('id', order_id)
      .single();

    if (!order || (order.seller as any).owner_id !== user.id) {
      return c.json({ error: 'Not authorized' }, 403);
    }

    if (order.status !== 'paid') {
      return c.json({ error: 'Order not in paid status' }, 400);
    }

    // Update order
    await supabase
      .from('market_orders')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', order_id);

    // Notify buyer
    await supabase.from('notifications').insert({
      user_id: order.buyer_id,
      channel: 'inapp',
      type: 'order_accepted',
      title: 'Order Accepted',
      body: 'Your order has been accepted and will ship soon.',
      href: `/messmarket/orders/${order_id}`,
    });

    return c.json({ success: true });
  } catch (err: any) {
    console.error('Accept order error:', err);
    return c.json({ error: err.message }, 500);
  }
});

app.post('/ship-order', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { order_id, carrier, tracking_number, tracking_url } = await c.req.json();

    // Verify seller owns this order
    const { data: order } = await supabase
      .from('market_orders')
      .select(`
        *,
        seller:market_sellers(owner_id)
      `)
      .eq('id', order_id)
      .single();

    if (!order || (order.seller as any).owner_id !== user.id) {
      return c.json({ error: 'Not authorized' }, 403);
    }

    if (order.status !== 'accepted') {
      return c.json({ error: 'Order not accepted yet' }, 400);
    }

    // Create shipment record
    await supabase.from('market_shipments').insert({
      order_id,
      carrier,
      tracking_number,
      tracking_url,
    });

    // Update order
    await supabase
      .from('market_orders')
      .update({
        status: 'shipped',
        shipped_at: new Date().toISOString(),
      })
      .eq('id', order_id);

    // Notify buyer
    await supabase.from('notifications').insert({
      user_id: order.buyer_id,
      channel: 'inapp',
      type: 'order_shipped',
      title: 'Order Shipped',
      body: tracking_number ? `Tracking: ${tracking_number}` : 'Your order is on the way.',
      href: `/messmarket/orders/${order_id}`,
    });

    return c.json({ success: true });
  } catch (err: any) {
    console.error('Ship order error:', err);
    return c.json({ error: err.message }, 500);
  }
});

// Export the Hono app
export default app;