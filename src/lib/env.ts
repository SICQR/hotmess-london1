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
export const SHOPIFY_DOMAIN = (() => {
  const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
  if (!domain) {
    throw new Error(
      'VITE_SHOPIFY_DOMAIN is required. Add it to .env.local\n' +
      'Example: VITE_SHOPIFY_DOMAIN=your-store.myshopify.com'
    );
  }
  return domain;
})();

export const SHOPIFY_STOREFRONT_TOKEN = (() => {
  const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
  if (!token) {
    throw new Error(
      'VITE_SHOPIFY_STOREFRONT_TOKEN is required. Add it to .env.local\n' +
      'Get your token from: Shopify Admin > Apps > Develop apps > Create storefront access token'
    );
  }
  return token;
})();

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
export const SUPABASE_URL = (() => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url) {
    throw new Error(
      'VITE_SUPABASE_URL is required. Add it to .env.local\n' +
      'Example: VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
      'Get it from: Supabase Dashboard > Settings > API'
    );
  }
  return url;
})();

export const SUPABASE_ANON_KEY = (() => {
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      'VITE_SUPABASE_ANON_KEY is required. Add it to .env.local\n' +
      'Get it from: Supabase Dashboard > Settings > API > Project API keys > anon public\n' +
      '⚠️  SECURITY: After fixing this issue, rotate the exposed anon key in Supabase Dashboard'
    );
  }
  return key;
})();

// Stripe - REQUIRED for payments
// 🔒 SECURITY: Production Stripe key is required and must be set in .env.local
// Add this to .env.local:
//   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key (production) or pk_test_your_key (development)
export const STRIPE_PUBLISHABLE_KEY = (() => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error(
      'VITE_STRIPE_PUBLISHABLE_KEY is required. Add it to .env.local\n' +
      'Get it from: Stripe Dashboard > Developers > API keys > Publishable key\n' +
      'Use pk_test_xxx for development or pk_live_xxx for production\n' +
      '⚠️  SECURITY: After fixing this issue, rotate the exposed Stripe key in Stripe Dashboard'
    );
  }
  if (!key.startsWith('pk_test_') && !key.startsWith('pk_live_')) {
    throw new Error(
      'VITE_STRIPE_PUBLISHABLE_KEY must start with pk_test_ or pk_live_\n' +
      'Current value does not appear to be a valid Stripe publishable key'
    );
  }
  return key;
})();

export const STRIPE_SECRET_KEY = ''; // Server-side only, never exposed to frontend
