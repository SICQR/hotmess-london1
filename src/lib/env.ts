// HOTMESS LONDON - Environment Variables
// Centralized access to env vars
//
// ⚠️ SECURITY: All credentials MUST be set via environment variables.
// No hardcoded secrets allowed in this file.
//
// Copy .env.example to .env and configure all required variables.

// Helper function to get required env var with better error message
function getRequiredEnvVar(key: string, description: string): string {
  const value = import.meta.env[key];
  if (!value) {
    const errorMsg = `Missing required environment variable: ${key}\n${description}\nSee .env.example for setup instructions.`;
    // In development, warn but allow empty; in production, this will cause failures
    if (import.meta.env.DEV) {
      console.warn(errorMsg);
      return '';
    }
    throw new Error(errorMsg);
  }
  return value;
}

// Shopify - REQUIRED for store functionality
export const SHOPIFY_DOMAIN = getRequiredEnvVar('VITE_SHOPIFY_DOMAIN', 'Your Shopify store domain (e.g., yourstore.myshopify.com)');
export const SHOPIFY_STOREFRONT_TOKEN = getRequiredEnvVar('VITE_SHOPIFY_STOREFRONT_TOKEN', 'Shopify Storefront API access token');

// RadioKing - OPTIONAL for live listener data
// If not set, radio will use mock data for listener counts
// Configure in Supabase Edge Functions: RADIOKING_STATION_ID=736103, RADIOKING_API_KEY=rk_live_xxx
export const RADIOKING_TOKEN = import.meta.env.VITE_RADIOKING_TOKEN || ''; // Frontend token (optional)
export const RADIOKING_RADIO_ID = '736103'; // Station ID (public)

// Supabase - REQUIRED for database and auth
export const SUPABASE_URL = getRequiredEnvVar('VITE_SUPABASE_URL', 'Your Supabase project URL (e.g., https://xxx.supabase.co)');
export const SUPABASE_ANON_KEY = getRequiredEnvVar('VITE_SUPABASE_ANON_KEY', 'Supabase anonymous/public key');

// Stripe - REQUIRED for payments
export const STRIPE_PUBLISHABLE_KEY = getRequiredEnvVar('VITE_STRIPE_PUBLISHABLE_KEY', 'Stripe publishable key (pk_test_* or pk_live_*)');
export const STRIPE_SECRET_KEY = ''; // Server-side only (never exposed to frontend)
