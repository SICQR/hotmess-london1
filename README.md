# HOTMESS Nightlife OS

**Men-only, 18+, nightlife-first operating system for queer cities.**

A real-time platform connecting queer nightlife through a 3D globe, XP economy, multi-vendor marketplace, and Telegram integration.

## Features

- 🌍 **3D Globe** — Real-time heat map of nightlife activity worldwide
- ⚡ **XP Economy** — Universal gamification across all platform actions
- 🛒 **Mess Market** — Multi-vendor marketplace with XP-gated drops
- 💬 **Telegram Integration** — Bot commands and encrypted rooms
- 🎯 **RIGHT NOW Feed** — Live community intent and availability
- 📡 **Beacon System** — QR rewards for events and venues
- 🎵 **Radio** — Live shows with listening rewards
- 🛡️ **Care Resources** — Safety support and crisis help
- 👨‍💼 **Admin War Room** — Control center for moderation and safety

## Setup

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SICQR/hotmess-london1.git
   cd hotmess-london1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and fill in your API keys and configuration
   ```
   
   **⚠️ IMPORTANT**: All credentials must be set via environment variables. Never commit secrets to the repository.
   
   **Required services:**
   - Shopify: Get Storefront API token from your Shopify store settings
   - Supabase: Create project at https://supabase.com and copy URL + anon key
   - Stripe: Get publishable key from https://dashboard.stripe.com/apikeys
   
   **Optional services:**
   - RadioKing: Get API token from https://manager.radioking.com/ for live listener data
   - Last.fm: Get API credentials from https://www.last.fm/api/account/create for scrobbling

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173` (Vite default port)

## Environment Variables

See `.env.example` for all required and optional environment variables.

**Required (App will not work without these):**
- `VITE_SHOPIFY_DOMAIN` - Your Shopify store domain (e.g., yourstore.myshopify.com)
- `VITE_SHOPIFY_STOREFRONT_TOKEN` - Shopify Storefront API token
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous/public key
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (pk_test_* or pk_live_*)

**Optional (Enhanced features):**
- `VITE_RADIOKING_TOKEN` - RadioKing API token for live listener counts (without this, mock data is used)
- `VITE_LASTFM_API_KEY` - Last.fm API key for music scrobbling (if implementing)
- `VITE_LASTFM_SHARED_SECRET` - Last.fm shared secret (if implementing)
- `VITE_MAPBOX_TOKEN` - Mapbox token for map features
- `HOTMESS_NEW_BOT_TOKEN` - Telegram bot token (server-side only)

**Supabase Edge Functions Configuration:**

RadioKing API credentials must also be set in Supabase Dashboard:
```
Navigate to: Supabase Dashboard → Edge Functions → Environment Variables
Add:
  RADIOKING_STATION_ID=736103
  RADIOKING_API_KEY=rk_live_your_token_here
```

**⚠️ Security Notes:**
- Never commit `.env` file to version control
- Use `pk_test_*` keys for development, `pk_live_*` for production
- Rotate all API keys regularly
- All hardcoded secrets have been removed from this codebase

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build (includes type checking)
- `npm run preview` - Preview production build locally
- `npm run lint` - Check for code quality issues
- `npm run lint:fix` - Automatically fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Validate TypeScript types

### Before Committing

Always run these commands before committing:

```bash
npm run type-check  # Ensure no TypeScript errors
npm run lint:fix    # Fix linting issues
npm run format      # Format code
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

## Documentation

See [HOTMESS_OS_COMPLETE.md](./HOTMESS_OS_COMPLETE.md) for comprehensive documentation including:
- Architecture overview
- Feature specifications
- API documentation
- Database schema
- Deployment guide
- Testing checklist

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase (Postgres + Auth + Edge Functions)
- **Maps**: MapLibre GL
- **Payments**: Stripe Connect
- **Messaging**: Telegram Bot API

## Project Status

✅ Core features implemented and tested
✅ Database schema complete (40+ tables)
✅ API layer functional
✅ TypeScript strict mode enabled
✅ ESLint + Prettier configured
✅ Production-ready build system
✅ All hardcoded secrets removed

**Ready for deployment to Vercel + Supabase**

### Post-Deployment Checklist

After deploying, ensure you:
1. **Rotate all API keys** - Any previously committed secrets should be regenerated
2. **Configure RadioKing** - Add API token to Supabase Edge Functions for live listener data
3. **Setup Shopify** - Upload products and create collections (superhung, hnh-mess, raw, hung, high, super)
4. **Test all integrations** - Verify Stripe, Shopify, and Supabase are working in production

---

Built with ❤️ for the queer nightlife community
  