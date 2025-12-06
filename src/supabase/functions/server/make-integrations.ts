// HOTMESS LONDON - Make.com Backend Integration Layer
// Server-side webhook triggers for all Make.com automation scenarios
// Import this file in your Hono server routes

// Note: kv_store import removed - not needed for webhook calls

// Make.com webhook URLs (set via environment variables)
const MAKE_WEBHOOKS = {
  BEACON_SCAN: Deno.env.get('MAKE_WEBHOOK_BEACON_SCAN') || '',
  ORDER_PLACED: Deno.env.get('MAKE_WEBHOOK_ORDER_PLACED') || '',
  USER_SIGNUP: Deno.env.get('MAKE_WEBHOOK_USER_SIGNUP') || '',
  TICKET_PURCHASED: Deno.env.get('MAKE_WEBHOOK_TICKET_PURCHASED') || '',
  LISTING_CREATED: Deno.env.get('MAKE_WEBHOOK_LISTING_CREATED') || '',
  RADIO_SHOW_START: Deno.env.get('MAKE_WEBHOOK_RADIO_SHOW_START') || '',
  RECORD_RELEASED: Deno.env.get('MAKE_WEBHOOK_RECORD_RELEASED') || '',
  ABUSE_REPORTED: Deno.env.get('MAKE_WEBHOOK_ABUSE_REPORTED') || '',
  STRIPE_PAYOUT: Deno.env.get('MAKE_WEBHOOK_STRIPE_PAYOUT') || '',
};

interface WebhookCallOptions {
  retries?: number;
  timeout?: number;
  logErrors?: boolean;
}

const DEFAULT_OPTIONS: WebhookCallOptions = {
  retries: 3,
  timeout: 10000,
  logErrors: true,
};

/**
 * Call Make.com webhook from server
 */
async function callMakeWebhook(
  webhookUrl: string,
  payload: any,
  options: WebhookCallOptions = {}
): Promise<{ success: boolean; error?: string }> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (!webhookUrl || webhookUrl === '') {
    if (opts.logErrors) {
      console.warn('[Make] Webhook URL not configured, skipping:', payload.eventType);
    }
    return { success: false, error: 'Webhook URL not configured' };
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= (opts.retries || 1); attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), opts.timeout);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Make webhook returned ${response.status}`);
      }

      console.log(`[Make] ✅ ${payload.eventType} sent (attempt ${attempt})`);
      return { success: true };

    } catch (error) {
      lastError = error as Error;
      if (opts.logErrors) {
        console.error(`[Make] ❌ Attempt ${attempt}/${opts.retries}:`, lastError.message);
      }
      if (attempt < (opts.retries || 1)) {
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    }
  }

  return { success: false, error: lastError?.message };
}

/**
 * SCENARIO 1: Beacon Scan
 * Call this after a user successfully scans a beacon
 */
export async function notifyBeaconScan(data: {
  beaconId: string;
  beaconCode: string;
  beaconType: string;
  beaconTitle: string;
  userId: string;
  userName: string;
  userXP: number;
  location: {
    venue: string;
    address: string;
    lat: number;
    lng: number;
    city: string;
  };
  scanContext: {
    platform: string;
    firstScan: boolean;
    streakDay: number;
    scansToday?: number;
  };
  xpEarned: number;
}): Promise<void> {
  await callMakeWebhook(MAKE_WEBHOOKS.BEACON_SCAN, {
    eventType: 'beacon.scanned',
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * SCENARIO 2: Order Placed
 * Call this after a Shopify order is confirmed
 */
export async function notifyOrderPlaced(data: {
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  orderTotal: number;
  currency: string;
  items: Array<{
    productId: string;
    productSlug: string;
    productTitle: string;
    quantity: number;
    price: number;
  }>;
  shipping: {
    name: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
  };
  paymentMethod: string;
  stripePaymentIntentId?: string;
}): Promise<void> {
  await callMakeWebhook(MAKE_WEBHOOKS.ORDER_PLACED, {
    eventType: 'order.placed',
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * SCENARIO 3: User Signup
 * Call this after a new user registers
 */
export async function notifyUserSignup(data: {
  userId: string;
  email: string;
  userName: string;
  signupMethod: 'email' | 'google' | 'github' | 'facebook';
  referralCode?: string;
  city?: string;
  age: number;
  agreedTerms: boolean;
  agreedAge: boolean;
}): Promise<void> {
  await callMakeWebhook(MAKE_WEBHOOKS.USER_SIGNUP, {
    eventType: 'user.signup',
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * SCENARIO 4: Ticket Purchased
 * Call this after a user buys an event ticket
 */
export async function notifyTicketPurchased(data: {
  ticketId: string;
  userId: string;
  userEmail: string;
  userName: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  eventAddress: string;
  ticketType: string;
  ticketPrice: number;
  ticketQuantity: number;
  ticketTotal: number;
  qrData: string;
}): Promise<void> {
  await callMakeWebhook(MAKE_WEBHOOKS.TICKET_PURCHASED, {
    eventType: 'ticket.purchased',
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * SCENARIO 5: Listing Created
 * Call this after a user creates a MessMarket listing
 */
export async function notifyListingCreated(data: {
  listingId: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  condition: string;
  city: string;
}): Promise<void> {
  await callMakeWebhook(MAKE_WEBHOOKS.LISTING_CREATED, {
    eventType: 'listing.created',
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * SCENARIO 7: Radio Show Start
 * Call this when RadioKing show starts (or manually trigger)
 */
export async function notifyRadioShowStart(data: {
  showId: string;
  showTitle: string;
  hostName: string;
  duration: number;
  genres: string[];
  coverImage: string;
}): Promise<void> {
  await callMakeWebhook(MAKE_WEBHOOKS.RADIO_SHOW_START, {
    eventType: 'radio.show_start',
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * SCENARIO 10: Record Released
 * Call this when RAW label releases new music
 */
export async function notifyRecordReleased(data: {
  recordId: string;
  artistName: string;
  trackTitle: string;
  releaseType: 'single' | 'album' | 'ep';
  coverArt: string;
  spotifyUrl?: string;
  soundcloudUrl?: string;
  genre: string;
}): Promise<void> {
  await callMakeWebhook(MAKE_WEBHOOKS.RECORD_RELEASED, {
    eventType: 'record.released',
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * SCENARIO 11: Abuse Reported
 * Call this when a user reports abuse/harassment
 */
export async function notifyAbuseReported(data: {
  reportId: string;
  reporterId: string;
  reporterName: string;
  targetType: 'user' | 'listing' | 'post' | 'message';
  targetId: string;
  targetName?: string;
  reason: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  evidence: string[];
}): Promise<void> {
  await callMakeWebhook(MAKE_WEBHOOKS.ABUSE_REPORTED, {
    eventType: 'abuse.reported',
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * SCENARIO 8: Stripe Payout
 * Call this when Stripe Connect payout processes (from Stripe webhook)
 */
export async function notifyStripePayout(data: {
  payoutId: string;
  sellerId: string;
  sellerEmail: string;
  amount: number;
  currency: string;
  stripeAccountId: string;
  arrivalDate: string;
}): Promise<void> {
  await callMakeWebhook(MAKE_WEBHOOKS.STRIPE_PAYOUT, {
    eventType: 'payout.paid',
    timestamp: new Date().toISOString(),
    ...data,
  });
}