# HOTMESS LONDON

> A masculine nightlife operating system for queer men 18+

Complete web application combining care-first principles with kink aesthetics, featuring location-based social features, QR beacon system, real-time messaging, trust & safety infrastructure, and comprehensive membership economy.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment variables

# Edit .env with your credentials

# Link to Supabase project
npx supabase link --project-ref your-project-id

# Apply database migrations
npx supabase db push

# Start development server
pnpm dev
```

Visit `http://localhost:5173` and you're ready to go!

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Features](#features)
- [Troubleshooting](#troubleshooting)

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite 6.3.5** - Build tool & dev server
- **Tailwind CSS v4** - Styling with custom design tokens
- **React Router v6** - Client-side routing

### Backend
- **Supabase** - Complete backend platform
  - PostgreSQL with PostGIS
  - Row Level Security (RLS)
  - Realtime subscriptions
  - Authentication
  - File storage
- **Deno + Hono** - Edge Functions runtime

### Integrations
- **Mapbox GL JS** - Maps and 3D globe
- **Three.js** - 3D visualizations
- **Stripe** - Payment processing
- **RadioKing** - Live radio streaming
- **SoundCloud** - Music previews
- **Last.fm** - Music metadata

## 📁 Project Structure

```
/
├── app/                    # Next.js app router (unused in Vite build)
├── components/             # React components
│   ├── rightnow/          # RIGHT NOW module components
│   ├── globe/             # 3D globe components
│   ├── ui/                # Radix UI primitives
│   └── ...
├── lib/                    # Utilities and helpers
│   ├── supabase.ts        # Supabase client singleton
│   ├── rightNowClient.ts  # RIGHT NOW API client
│   └── ...
├── pages/                  # Page components (legacy router)
├── src/                    # Source files for Vite build
│   └── test/              # Test utilities
├── styles/                 # Global styles and tokens
│   └── globals.css        # Design system tokens
├── supabase/
│   ├── functions/         # Edge Functions
│   │   ├── right-now/     # RIGHT NOW API
│   │   └── server/        # Main Hono server
│   └── migrations/        # Database migrations
├── tests/
│   └── e2e/               # Playwright E2E tests
├──            # Environment variables template
├── vitest.config.ts       # Vitest configuration
├── playwright.config.ts   # Playwright configuration
└── vite.config.ts         # Vite configuration
```

## 🔐 Environment Setup

### Required Environment Variables

#### Frontend (VITE_* prefix for client exposure)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_MAPBOX_TOKEN=pk.your-mapbox-token
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_or_live
```

#### Server-Only (Edge Functions)
```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_test_or_live
RADIOKING_API_KEY=your-radioking-key
LASTFM_API_KEY=your-lastfm-key
OPENAI_API_KEY=sk-your-openai-key
```

### Getting API Keys

1. **Supabase**: Create project at [supabase.com](https://supabase.com) → Settings → API
2. **Mapbox**: [account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens/)
3. **Stripe**: [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
4. **RadioKing**: Contact RadioKing support
5. **Last.fm**: [last.fm/api/account/create](https://www.last.fm/api/account/create)
6. **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## 💻 Development

### Available Scripts

```bash
# Start development server (port 5173)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run unit tests
pnpm test:unit

# Run E2E tests (headless)
pnpm test:e2e

# Run E2E tests (headed/debug)
pnpm test:e2e:ui

# Type check
pnpm typecheck

# Lint code
pnpm lint

# Generate Supabase types
pnpm supabase:types
```

### Database Commands

```bash
# Link to Supabase project
npx supabase link --project-ref your-project-id

# Apply migrations
npx supabase db push

# Reset local database (destructive!)
npx supabase db reset

# Generate TypeScript types from database
npx supabase gen types typescript --local > src/types/supabase.ts

# Create new migration
npx supabase migration new migration_name
```

### Edge Functions

```bash
# Deploy all functions
npx supabase functions deploy

# Deploy specific function
npx supabase functions deploy right-now

# View function logs
npx supabase functions logs right-now --tail

# Test function locally
curl -i http://localhost:54321/functions/v1/right-now \
  -H "apikey: your-anon-key"
```

## 🧪 Testing

### Unit & Integration Tests (Vitest)

```bash
# Run all unit tests
pnpm test:unit

# Run with coverage
pnpm test:unit --coverage

# Run in watch mode
pnpm test:unit --watch

# Run specific test file
pnpm test:unit src/components/rightnow/RightNowCard.test.tsx
```

### E2E Tests (Playwright)

```bash
# Install browsers (first time only)
pnpm exec playwright install

# Run all E2E tests
pnpm test:e2e

# Run with UI (debug mode)
pnpm test:e2e:ui

# Run specific test file
pnpm exec playwright test tests/e2e/right-now.spec.ts

# Run in headed mode (see browser)
pnpm exec playwright test --headed

# Debug a specific test
pnpm exec playwright test --debug tests/e2e/auth.spec.ts
```

### Test Database Setup

E2E tests require a local Supabase instance:

```bash
# Start Supabase locally
npx supabase start

# Apply migrations
npx supabase db reset

# Run tests
pnpm test:e2e

# Stop Supabase
npx supabase stop
```

## 🚢 Deployment

### Prerequisites

1. Create Supabase project
2. Set up environment variables in deployment platform
3. Configure CI/CD secrets

### Deploy to Production

```bash
# Build application
pnpm build

# Deploy Edge Functions
npx supabase functions deploy --project-ref your-project-id

# Apply database migrations
npx supabase db push --project-ref your-project-id
```

### CI/CD

GitHub Actions workflow automatically:
- ✅ Runs linting and type checks
- ✅ Runs unit tests with coverage
- ✅ Spins up local Supabase for E2E tests
- ✅ Runs Playwright tests
- ✅ Deploys Edge Functions on main branch
- ✅ Scans for security vulnerabilities

See `.github/workflows/ci.yml` for details.

## ✨ Features

### Core Modules

#### 1. **RIGHT NOW** - Temporal Social Feed
- 6 modes: hookup, crowd, drop, ticket, radio, care
- 1-hour post expiration (TTL)
- Real-time updates via Supabase broadcast
- Geo-based clustering with heat bins
- Rate limiting by membership tier
- Scoring algorithm for feed ranking

**Status**: ✅ Fully functional

**Routes**:
- `/right-now` - Main feed
- `/right-now/new` - Create post
- `/right-now/test-realtime` - Realtime dashboard

#### 2. **Beacons** - QR Code System
- Physical-to-digital bridge
- Party/venue/event beacons
- Scan tracking with XP rewards
- Heat map visualization

**Status**: ✅ Backend complete

**Routes**:
- `/beacons` - Browse beacons
- `/beacons/create` - Create new beacon
- `/l/:code` - Scan beacon by code

#### 3. **Tickets** - C2C Marketplace
- Peer-to-peer ticket trading
- Real-time messaging between buyers/sellers
- Proof upload system
- Trust & safety integration

**Status**: ✅ Functional

**Routes**:
- `/tickets` - Browse listings
- `/tickets/:beaconId` - Event-specific tickets
- `/my-tickets` - Seller dashboard

#### 4. **Connect** - Dating/Hookup Module
- Consent-first matching
- Anonymous intents at venues
- Real-time chat
- Location-based discovery

**Status**: ✅ Production ready

**Routes**:
- `/connect` - Main hub
- `/connect/create` - Create intent
- `/connect/threads` - View conversations

#### 5. **Records** - Music Label
- SoundCloud preview integration
- High-quality downloads (WAV/FLAC/MP3)
- Release management
- Download tracking

**Status**: ✅ Complete

**Routes**:
- `/records` - Browse releases
- `/records/releases/:slug` - Release detail
- `/records/library` - User's library

#### 6. **Globe/Heat Engine**
- 3D Mapbox globe
- Real-time activity heatmaps
- City intelligence clustering
- Beacon visualization

**Status**: ✅ Implemented

**Routes**:
- `/night-pulse` - 3D globe view
- `/map` - 2D map view

### Authentication & Membership

- **18+ age gate** - Verified on first visit
- **Men-only gate** - Gender check for RIGHT NOW
- **4-tier membership**:
  - Free (5 posts/hour, 20/day)
  - HNH (20/hour, 100/day + panic button)
  - Sponsor (boosted visibility)
  - Icon (unlimited everything)

### Trust & Safety

- Shadow banning
- Report/block/mute users
- Moderation queue
- Admin dashboard
- Care resources
- HNH panic system

## 🐛 Troubleshooting

### "Failed to load RIGHT NOW: 401"

**Cause**: Database migration not deployed

**Fix**:
```bash
npx supabase db push
```

Or manually run `/supabase/migrations/300_right_now_production.sql` in SQL Editor

### "Relation 'right_now_active' does not exist"

**Cause**: Database view not created

**Fix**: The Edge Function will automatically fall back to querying the table directly. To create the view:

```sql
CREATE OR REPLACE VIEW public.right_now_active AS
SELECT * FROM public.right_now_posts
WHERE deleted_at IS NULL
  AND expires_at > NOW()
  AND shadow_banned = false;
```

### Realtime not working

**Cause**: Posts created but not broadcast

**Fix**: Ensure Edge Function has broadcast code (see `/supabase/functions/right-now/index.ts` line 285)

### Geolocation errors in browser

**Cause**: Permission denied or insecure context

**Fix**: Posts can still be created without location. Location is optional for RIGHT NOW.

### TypeScript errors after database changes

**Fix**: Regenerate types
```bash
npx supabase gen types typescript --local > src/types/supabase.ts
```

### Tests failing in CI

**Common causes**:
1. Supabase not started: Check CI logs for `supabase start` errors
2. Migrations not applied: Ensure `db reset` ran successfully
3. Environment variables missing: Check GitHub Secrets

### Build errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
pnpm install
pnpm build
```

## 📖 Documentation

- [Comprehensive Audit](/COMPREHENSIVE_WEBAPP_AUDIT.md) - Full system analysis
- [RIGHT NOW System](/RIGHT_NOW_WHAT_ACTUALLY_WORKS.md) - RIGHT NOW module deep dive
- [Deployment Guide](/DEPLOYMENT.md) - Production deployment
- [Architecture](/docs/ARCHITECTURE.md) - System architecture
- [API Reference](/docs/API.md) - Backend API documentation

## 🤝 Contributing

See [CONTRIBUTING.md](/CONTRIBUTING.md) for guidelines.

## 📄 License

See [LICENSE.md](/LICENSE.md)

## 🔗 Links

- **Production**: TBD
- **Staging**: TBD
- **Supabase**: https://app.supabase.com/project/rfoftonnlwudilafhfkl
- **Figma Design**: https://www.figma.com/make/ZDnegUk6LijlDPt7vu7TWG/HM1

---

**Built with ❤️ for the queer community**


### Configuration (no .env files)
This repo is intended to open and run without creating local env files. Configuration values are centralized in **`src/lib/env.ts`**. Third‑party integrations that require server secrets (e.g. Stripe webhooks, Connect payouts) must be configured in the deployment environment (Supabase Edge Function secrets) and will show explicit “unavailable” states when not configured.


## Production configuration (Vercel + Supabase)

Set these in Vercel (Project → Settings → Environment Variables):
- VITE_SHOPIFY_DOMAIN
- VITE_SHOPIFY_STOREFRONT_TOKEN
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_STRIPE_PUBLISHABLE_KEY

Supabase Edge Function secrets (Dashboard → Edge Functions → Secrets):
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

You can verify runtime config in Admin → Integrations.
