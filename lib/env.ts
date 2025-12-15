// HOTMESS LONDON — Runtime configuration
// Values are provided by Vercel (frontend) and Supabase (Edge Functions).
// No secrets are committed to the repo.
//
// IMPORTANT:
// - Browser-exposed values must be prefixed with VITE_ (Vite convention).
// - Missing values must never fail silently: UI should surface "Integration unavailable" states.

type EnvSource = string | undefined | null;

export type EnvStatus = {
  name: string;
  valuePresent: boolean;
  scope: "vercel" | "supabase";
  required: boolean;
  note: string;
};

function read(name: string): string {
  return ((import.meta as any).env?.[name] as EnvSource ?? "") as string;
}

function req(name: string): string {
  // Do NOT throw at module import time — we want the app to boot and show status.
  // Gate the specific feature flows instead.
  return read(name);
}

// ===== Required: Vercel (frontend) =====
export const SHOPIFY_DOMAIN = req("VITE_SHOPIFY_DOMAIN");
export const SHOPIFY_STOREFRONT_TOKEN = req("VITE_SHOPIFY_STOREFRONT_TOKEN");
export const SUPABASE_URL = req("VITE_SUPABASE_URL");
export const SUPABASE_ANON_KEY = req("VITE_SUPABASE_ANON_KEY");
export const STRIPE_PUBLISHABLE_KEY = req("VITE_STRIPE_PUBLISHABLE_KEY");

// ===== Optional: Vercel (frontend) =====
export const RADIOKING_RADIO_ID = read("VITE_RADIOKING_RADIO_ID");
export const SOUNDCLOUD_CLIENT_ID = read("VITE_SOUNDCLOUD_CLIENT_ID");
export const SOUNDCLOUD_USER_ID = read("VITE_SOUNDCLOUD_USER_ID");
export const GOOGLE_MAPS_API_KEY = read("VITE_GOOGLE_MAPS_API_KEY");
export const MAPBOX_PUBLIC_TOKEN = read("VITE_MAPBOX_PUBLIC_TOKEN");

// ===== Status registry =====
// This is the single truth used by Admin → Integrations.
export function getEnvStatus(): EnvStatus[] {
  return [
    { name: "VITE_SHOPIFY_DOMAIN", valuePresent: !!SHOPIFY_DOMAIN, scope: "vercel", required: true, note: "Shop catalogue reads" },
    { name: "VITE_SHOPIFY_STOREFRONT_TOKEN", valuePresent: !!SHOPIFY_STOREFRONT_TOKEN, scope: "vercel", required: true, note: "Shopify Storefront API token" },
    { name: "VITE_SUPABASE_URL", valuePresent: !!SUPABASE_URL, scope: "vercel", required: true, note: "Supabase project URL" },
    { name: "VITE_SUPABASE_ANON_KEY", valuePresent: !!SUPABASE_ANON_KEY, scope: "vercel", required: true, note: "Supabase anon key (public)" },
    { name: "VITE_STRIPE_PUBLISHABLE_KEY", valuePresent: !!STRIPE_PUBLISHABLE_KEY, scope: "vercel", required: true, note: "Stripe checkout (publishable)" },

    { name: "VITE_RADIOKING_RADIO_ID", valuePresent: !!RADIOKING_RADIO_ID, scope: "vercel", required: false, note: "RadioKing station ID (optional UI)" },
    { name: "VITE_MAPBOX_PUBLIC_TOKEN", valuePresent: !!MAPBOX_PUBLIC_TOKEN, scope: "vercel", required: false, note: "Mapbox visuals (optional)" },
    { name: "VITE_SOUNDCLOUD_CLIENT_ID", valuePresent: !!SOUNDCLOUD_CLIENT_ID, scope: "vercel", required: false, note: "SoundCloud embeds (optional)" },
    { name: "VITE_GOOGLE_MAPS_API_KEY", valuePresent: !!GOOGLE_MAPS_API_KEY, scope: "vercel", required: false, note: "Google Maps embeds (optional)" },

    // Supabase Edge Function secrets are not readable from the frontend; we expose status via a backend healthcheck (see AdminIntegrations).
    { name: "STRIPE_SECRET_KEY", valuePresent: true, scope: "supabase", required: true, note: "Set in Supabase Edge Function secrets (not visible here)" },
    { name: "STRIPE_WEBHOOK_SECRET", valuePresent: true, scope: "supabase", required: true, note: "Set in Supabase Edge Function secrets (not visible here)" },
  ];
}
