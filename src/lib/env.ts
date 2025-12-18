// HOTMESS LONDON - Environment Variables
// Centralized access to env vars
//
// ⚠️ SECURITY: All credentials MUST be set via environment variables.
// No hardcoded secrets allowed in this file.
//
// Copy .env.example to .env and configure all required variables.

// Shopify - REQUIRED for store functionality
export const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || '';
export const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';

// RadioKing - OPTIONAL for live listener data
// If not set, radio will use mock data for listener counts
// Configure in Supabase Edge Functions: RADIOKING_STATION_ID=736103, RADIOKING_API_KEY=rk_live_xxx
export const RADIOKING_TOKEN = import.meta.env.VITE_RADIOKING_TOKEN || ''; // Frontend token (optional)
export const RADIOKING_RADIO_ID = '736103'; // Station ID (public)

// Supabase - REQUIRED for database and auth
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Stripe - REQUIRED for payments
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
export const STRIPE_SECRET_KEY = ''; // Server-side only (never exposed to frontend)
