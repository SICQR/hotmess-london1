# Deploy (GitHub → Vercel + Supabase)

This repo is designed to be pushed to GitHub and deployed on Vercel, with server-side secrets stored in Supabase Edge Function secrets.

## Local run

```bash
npm install
npm run dev
```

> Note: This environment does not include vendored dependencies. You need normal internet access for `npm install`.

## Vercel environment variables (required)

Set these in **Vercel → Project Settings → Environment Variables** (Production, Preview, and Development as appropriate):

- `VITE_SHOPIFY_DOMAIN`
- `VITE_SHOPIFY_STOREFRONT_TOKEN`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`

Optional (feature-dependent):

- `VITE_RADIOKING_RADIO_ID`
- `VITE_MAPBOX_PUBLIC_TOKEN`
- `VITE_SOUNDCLOUD_CLIENT_ID`
- `VITE_SOUNDCLOUD_USER_ID`
- `VITE_GOOGLE_MAPS_API_KEY`

## Supabase Edge Function secrets (required)

Set these in **Supabase → Edge Functions → Secrets**:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

If you enable Stripe Connect / Marketplace modules, also set the corresponding Connect secrets used by those functions.

## Verify configuration

In the running app, go to:

- **Admin → Integrations** (`/admin/integrations`)

This page reports:

- Which Vercel `VITE_*` variables are present
- Whether the Supabase Edge Function healthcheck responds

## Vercel build settings

This repo includes `vercel.json` with:

- Build: `npm run build`
- Output: `dist`
