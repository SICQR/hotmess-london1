// HOTMESS LONDON - Environment Variables
// Centralized access to env vars with runtime validation
//
// 🔒 SECURITY: All production credentials REQUIRE environment variables.
// No hardcoded fallbacks are provided for sensitive keys.
// Set these in your .env.local file (see .env.example for reference)

// Shopify - REQUIRED for store functionality
// Add these to .env.local:
//   VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
//   VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token
export const SHOPIFY_DOMAIN = (import.meta.env.VITE_SHOPIFY_DOMAIN as string | undefined) ?? '';

export const SHOPIFY_STOREFRONT_TOKEN =
  (import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined) ?? '';

export const SHOPIFY_CONFIGURED = Boolean(SHOPIFY_DOMAIN && SHOPIFY_STOREFRONT_TOKEN);

if (!SHOPIFY_CONFIGURED) {
  console.warn(
    '[hotmess] Shopify is not configured. Store features will be unavailable until you set VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN.'
  );
}

// RadioKing - Live listener data integration
// 🔓 SAFE: This is a public station ID, not a secret
export const RADIOKING_TOKEN = ''; // Not used in frontend, server-side only
export const RADIOKING_RADIO_ID = '736103'; // Public station ID - safe to hardcode

// SoundCloud - Optional third-party integration
// 🔓 SAFE: Empty defaults for optional features
export const SOUNDCLOUD_CLIENT_ID = import.meta.env.VITE_SOUNDCLOUD_CLIENT_ID || '';
export const SOUNDCLOUD_USER_ID = import.meta.env.VITE_SOUNDCLOUD_USER_ID || '';

// Google Maps - Optional feature
// 🔓 SAFE: Empty default for optional feature
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Supabase - REQUIRED for database and authentication
// 🔒 SECURITY: These credentials are required and must be set in .env.local
// Add these to .env.local:
//   VITE_SUPABASE_URL=https://your-project.supabase.co
//   VITE_SUPABASE_ANON_KEY=your_anon_key
function normalizeEnvValue(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/^['"]|['"]$/g, '');
}

function normalizeUrl(value: unknown): string {
  return normalizeEnvValue(value).replace(/\/+$/g, '');
}

export const SUPABASE_URL = (() => {
  const url = normalizeUrl(import.meta.env.VITE_SUPABASE_URL);
  if (!url) {
    throw new Error(
      'VITE_SUPABASE_URL is required. Add it to .env.local\n' +
      'Example: VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
      'Get it from: Supabase Dashboard > Settings > API\n' +
      'If this is a Vercel deploy, set it in Vercel Project Settings → Environment Variables (Preview/Production) and redeploy.'
    );
  }
  return url;
})();

export const SUPABASE_ANON_KEY = (() => {
  const key = normalizeEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY);
  if (!key) {
    throw new Error(
      'VITE_SUPABASE_ANON_KEY is required. Add it to .env.local\n' +
      'Get it from: Supabase Dashboard > Settings > API > Project API keys > anon public\n' +
      '⚠️  SECURITY: After fixing this issue, rotate the exposed anon key in Supabase Dashboard\n' +
      'If this is a Vercel deploy, set it in Vercel Project Settings → Environment Variables (Preview/Production) and redeploy.'
    );
  }
  return key;
})();

// Stripe - REQUIRED for payments
// 🔒 SECURITY: Production Stripe key is required and must be set in .env.local
// Add this to .env.local:
//   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key (production) or pk_test_your_key (development)
const STRIPE_KEY_PREFIXES = ['pk_test_', 'pk_live_'] as const;

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const stripeKeyNormalized = normalizeEnvValue(stripeKey);
const stripeHasValidPrefix = Boolean(
  stripeKeyNormalized && STRIPE_KEY_PREFIXES.some((prefix) => stripeKeyNormalized.startsWith(prefix))
);

export const STRIPE_CONFIGURED = stripeHasValidPrefix;

if (!stripeKeyNormalized) {
  console.warn(
    '[hotmess] Stripe is not configured. Payment features will be unavailable until you set VITE_STRIPE_PUBLISHABLE_KEY.'
  );
} else if (!stripeHasValidPrefix) {
  // Do not log the key value.
  console.warn(
    `[hotmess] Stripe is misconfigured. VITE_STRIPE_PUBLISHABLE_KEY must start with ${STRIPE_KEY_PREFIXES.join(' or ')}.`
  );
}

export const STRIPE_PUBLISHABLE_KEY = stripeHasValidPrefix ? stripeKeyNormalized : '';

export function requireStripeConfigured(featureLabel = 'Payments') {
  if (STRIPE_CONFIGURED) return;
  throw new Error(
    `${featureLabel} are not configured. Set VITE_STRIPE_PUBLISHABLE_KEY (pk_test_... or pk_live_...) to enable Stripe.`
  );
}

export const STRIPE_SECRET_KEY = ''; // Server-side only, never exposed to frontend
