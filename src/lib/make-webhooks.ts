// HOTMESS LONDON - Make.com Webhook Client
// Centralized webhook caller with retry logic, error handling, and logging

import type { MakeWebhookPayload, WebhookResponse } from './make-webhook-types';

// Webhook URLs - UPDATE THESE AFTER BUILDING MAKE.COM SCENARIOS
export const MAKE_WEBHOOKS = {
  BEACON_SCAN: import.meta.env.VITE_MAKE_WEBHOOK_BEACON_SCAN || '',
  ORDER_PLACED: import.meta.env.VITE_MAKE_WEBHOOK_ORDER_PLACED || '',
  USER_SIGNUP: import.meta.env.VITE_MAKE_WEBHOOK_USER_SIGNUP || '',
  TICKET_PURCHASED: import.meta.env.VITE_MAKE_WEBHOOK_TICKET_PURCHASED || '',
  LISTING_CREATED: import.meta.env.VITE_MAKE_WEBHOOK_LISTING_CREATED || '',
  RADIO_SHOW_START: import.meta.env.VITE_MAKE_WEBHOOK_RADIO_SHOW_START || '',
  RECORD_RELEASED: import.meta.env.VITE_MAKE_WEBHOOK_RECORD_RELEASED || '',
  ABUSE_REPORTED: import.meta.env.VITE_MAKE_WEBHOOK_ABUSE_REPORTED || '',
  STRIPE_PAYOUT: import.meta.env.VITE_MAKE_WEBHOOK_STRIPE_PAYOUT || '',
} as const;

interface WebhookCallOptions {
  retries?: number;
  timeout?: number;
  logErrors?: boolean;
}

const DEFAULT_OPTIONS: WebhookCallOptions = {
  retries: 3,
  timeout: 10000, // 10 seconds
  logErrors: true,
};

/**
 * Call a Make.com webhook with retry logic and error handling
 */
export async function callMakeWebhook(
  webhookUrl: string,
  payload: MakeWebhookPayload,
  options: WebhookCallOptions = {}
): Promise<WebhookResponse> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Skip if webhook URL not configured
  if (!webhookUrl || webhookUrl === '') {
    if (opts.logErrors) {
      console.warn('[Make Webhook] URL not configured, skipping:', payload.eventType);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
      }

      // Make.com webhooks typically return "Accepted" or execution ID
      const result = await response.text();
      
      console.log(`[Make Webhook] Success: ${payload.eventType}`, {
        attempt,
        executionId: result,
      });

      return {
        success: true,
        executionId: result || undefined,
      };

    } catch (error) {
      lastError = error as Error;
      
      if (opts.logErrors) {
        console.error(`[Make Webhook] Attempt ${attempt}/${opts.retries} failed:`, {
          eventType: payload.eventType,
          error: lastError.message,
        });
      }

      // Wait before retry (exponential backoff)
      if (attempt < (opts.retries || 1)) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  // All retries failed
  return {
    success: false,
    error: lastError?.message || 'Unknown error',
  };
}

/**
 * Fire-and-forget webhook call (don't wait for response)
 * Useful for non-critical notifications
 */
export function callMakeWebhookAsync(
  webhookUrl: string,
  payload: MakeWebhookPayload,
  options?: WebhookCallOptions
): void {
  callMakeWebhook(webhookUrl, payload, options).catch((error) => {
    console.error('[Make Webhook] Async call failed:', error);
  });
}

/**
 * Batch webhook calls (useful for sending multiple events at once)
 */
export async function callMakeWebhookBatch(
  calls: Array<{ webhookUrl: string; payload: MakeWebhookPayload }>
): Promise<WebhookResponse[]> {
  return Promise.all(
    calls.map(({ webhookUrl, payload }) => callMakeWebhook(webhookUrl, payload))
  );
}

/**
 * Helper: Call beacon scan webhook
 */
export async function notifyBeaconScan(payload: Omit<import('./make-webhook-types').BeaconScanPayload, 'eventType'>): Promise<WebhookResponse> {
  return callMakeWebhook(MAKE_WEBHOOKS.BEACON_SCAN, {
    eventType: 'beacon.scanned',
    ...payload,
  });
}

/**
 * Helper: Call order placed webhook
 */
export async function notifyOrderPlaced(payload: Omit<import('./make-webhook-types').OrderPlacedPayload, 'eventType'>): Promise<WebhookResponse> {
  return callMakeWebhook(MAKE_WEBHOOKS.ORDER_PLACED, {
    eventType: 'order.placed',
    ...payload,
  });
}

/**
 * Helper: Call user signup webhook
 */
export async function notifyUserSignup(payload: Omit<import('./make-webhook-types').UserSignupPayload, 'eventType'>): Promise<WebhookResponse> {
  return callMakeWebhook(MAKE_WEBHOOKS.USER_SIGNUP, {
    eventType: 'user.signup',
    ...payload,
  });
}

/**
 * Helper: Call ticket purchased webhook
 */
export async function notifyTicketPurchased(payload: Omit<import('./make-webhook-types').TicketPurchasedPayload, 'eventType'>): Promise<WebhookResponse> {
  return callMakeWebhook(MAKE_WEBHOOKS.TICKET_PURCHASED, {
    eventType: 'ticket.purchased',
    ...payload,
  });
}

/**
 * Helper: Call listing created webhook
 */
export async function notifyListingCreated(payload: Omit<import('./make-webhook-types').ListingCreatedPayload, 'eventType'>): Promise<WebhookResponse> {
  return callMakeWebhook(MAKE_WEBHOOKS.LISTING_CREATED, {
    eventType: 'listing.created',
    ...payload,
  });
}

/**
 * Helper: Call radio show start webhook
 */
export async function notifyRadioShowStart(payload: Omit<import('./make-webhook-types').RadioShowStartPayload, 'eventType'>): Promise<WebhookResponse> {
  return callMakeWebhook(MAKE_WEBHOOKS.RADIO_SHOW_START, {
    eventType: 'radio.show_start',
    ...payload,
  });
}

/**
 * Helper: Call record released webhook
 */
export async function notifyRecordReleased(payload: Omit<import('./make-webhook-types').RecordReleasedPayload, 'eventType'>): Promise<WebhookResponse> {
  return callMakeWebhook(MAKE_WEBHOOKS.RECORD_RELEASED, {
    eventType: 'record.released',
    ...payload,
  });
}

/**
 * Helper: Call abuse reported webhook
 */
export async function notifyAbuseReported(payload: Omit<import('./make-webhook-types').AbuseReportedPayload, 'eventType'>): Promise<WebhookResponse> {
  return callMakeWebhook(MAKE_WEBHOOKS.ABUSE_REPORTED, {
    eventType: 'abuse.reported',
    ...payload,
  });
}

/**
 * Helper: Call Stripe payout webhook
 */
export async function notifyStripePayout(payload: Omit<import('./make-webhook-types').StripePayoutPayload, 'eventType'>): Promise<WebhookResponse> {
  return callMakeWebhook(MAKE_WEBHOOKS.STRIPE_PAYOUT, {
    eventType: 'payout.paid',
    ...payload,
  });
}
