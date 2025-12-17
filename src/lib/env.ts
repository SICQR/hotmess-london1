// HOTMESS LONDON - Environment Variables
// Centralized access to env vars with fallbacks

// Note: For production, environment variables should be properly configured
// The hardcoded values below are fallbacks for development/testing

// Shopify - Use env vars or fallback to hardcoded values
export const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || '1e0297-a4.myshopify.com';
export const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '77c7860ecca2f00853d68ec0cfb67558';

// RadioKing - Live listener data integration
// Add these to Supabase Edge Function environment variables:
// RADIOKING_STATION_ID=736103
// RADIOKING_API_KEY=your_api_key_here
export const RADIOKING_TOKEN = ''; // Not used in frontend
export const RADIOKING_RADIO_ID = '736103'; // Station ID

// SoundCloud - Optional (set in .env if needed)
export const SOUNDCLOUD_CLIENT_ID = '';
export const SOUNDCLOUD_USER_ID = '';

// Google Maps - Optional (set in .env if needed)
export const GOOGLE_MAPS_API_KEY = '';

// Supabase - Use env vars or fallback to hardcoded values
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://rfoftonnlwudilafhfkl.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmb2Z0b25ubHd1ZGlsYWZoZmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTg4MTAsImV4cCI6MjA2OTIzNDgxMH0.W4g28oa8m-KkaLhgpkoyHW2fo5Jec1K-vfeRVxAhFdI';

// Stripe - Use env vars or fallback to hardcoded values
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51RrKkrRffzKIfelwQC3WOi7Fkadm9d6xjr32kU9aWEDJtyIqqCt2tKde1asYrosgUTJxPYQoxMMy26Qrnwzxj2cp00PpOLxuhj';
export const STRIPE_SECRET_KEY = ''; // Server-side only
