/**
 * HOTMESS LONDON — STRIPE SERVICE
 * 
 * Handles Stripe Connect for Club Mode marketplace:
 * - Stripe Connect onboarding for venues
 * - Payment processing for ticket sales
 * - Split payments (platform fee + venue payout)
 * - Refunds and disputes
 */

import { projectId, publicAnonKey } from '../../utils/supabase/info';

const STRIPE_FEE_PERCENT = 0.029; // 2.9%
const STRIPE_FEE_FIXED = 30; // 30 cents
const HOTMESS_FEE_PERCENT = 0.05; // 5% platform fee

/**
 * Calculate fees for a ticket purchase
 */
export function calculateFees(priceInCents: number) {
  // Stripe fees
  const stripeFee = Math.round(priceInCents * STRIPE_FEE_PERCENT + STRIPE_FEE_FIXED);
  
  // HOTMESS platform fee (on gross amount)
  const platformFee = Math.round(priceInCents * HOTMESS_FEE_PERCENT);
  
  // Venue receives
  const venueAmount = priceInCents - stripeFee - platformFee;
  
  return {
    gross: priceInCents,
    stripeFee,
    platformFee,
    venueAmount,
    buyerPays: priceInCents, // Buyer pays gross amount
  };
}

/**
 * Create Stripe Connect Account for venue
 */
export async function createStripeConnectAccount(
  clubId: string,
  clubName: string,
  ownerEmail: string
) {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/stripe/connect/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          club_id: clubId,
          club_name: clubName,
          owner_email: ownerEmail,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create Connect account: ${error}`);
    }

    const data = await response.json();
    return { success: true, accountId: data.account_id };
  } catch (error) {
    console.error('Error creating Connect account:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Get Stripe Connect onboarding link
 */
export async function getConnectOnboardingLink(
  stripeAccountId: string,
  clubSlug: string
) {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/stripe/connect/onboarding-link`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          account_id: stripeAccountId,
          refresh_url: `${window.location.origin}/club/${clubSlug}/settings?setup=failed`,
          return_url: `${window.location.origin}/club/${clubSlug}/settings?setup=complete`,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get onboarding link: ${error}`);
    }

    const data = await response.json();
    return { success: true, url: data.url };
  } catch (error) {
    console.error('Error getting onboarding link:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Check Stripe Connect account status
 */
export async function checkConnectAccountStatus(stripeAccountId: string) {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/stripe/connect/status`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          account_id: stripeAccountId,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to check account status: ${error}`);
    }

    const data = await response.json();
    return {
      success: true,
      charges_enabled: data.charges_enabled,
      payouts_enabled: data.payouts_enabled,
      details_submitted: data.details_submitted,
    };
  } catch (error) {
    console.error('Error checking account status:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Purchase ticket with Stripe (creates Payment Intent)
 */
export async function purchaseTicket(
  eventId: string,
  tier: 'ga' | 'vip',
  price: number,
  buyerEmail: string,
  accessToken: string
) {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/stripe/purchase-ticket`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          event_id: eventId,
          tier,
          price,
          buyer_email: buyerEmail,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to purchase ticket: ${error}`);
    }

    const data = await response.json();
    return {
      success: true,
      clientSecret: data.client_secret,
      ticketId: data.ticket_id,
    };
  } catch (error) {
    console.error('Error purchasing ticket:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Confirm payment and finalize ticket
 */
export async function confirmPayment(
  paymentIntentId: string,
  ticketId: string,
  accessToken: string
) {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/stripe/confirm-payment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          payment_intent_id: paymentIntentId,
          ticket_id: ticketId,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to confirm payment: ${error}`);
    }

    const data = await response.json();
    return { success: true, ticket: data.ticket };
  } catch (error) {
    console.error('Error confirming payment:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Refund ticket
 */
export async function refundTicket(
  ticketId: string,
  reason: string,
  accessToken: string
) {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/stripe/refund-ticket`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ticket_id: ticketId,
          reason,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to refund ticket: ${error}`);
    }

    const data = await response.json();
    return { success: true, refund: data.refund };
  } catch (error) {
    console.error('Error refunding ticket:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Purchase shop products with Stripe (creates Payment Intent)
 */
export async function purchaseShop(
  items: Array<{
    id: string;
    title: string;
    price: number;
    qty: number;
    category: string;
    size?: string;
  }>,
  total: number,
  buyerEmail: string,
  accessToken: string
) {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/stripe/purchase-shop`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          items,
          total,
          buyer_email: buyerEmail,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Shop purchase error:', error);
      throw new Error(`Failed to purchase shop items: ${error}`);
    }

    const data = await response.json();
    return {
      success: true,
      clientSecret: data.client_secret,
      orderId: data.order_id,
    };
  } catch (error) {
    console.error('Error purchasing shop items:', error);
    return { success: false, error: String(error) };
  }
}
