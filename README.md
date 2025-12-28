# HOTMESS Nightlife OS

[![CI](https://github.com/SICQR/hotmess-london1/actions/workflows/ci.yml/badge.svg)](https://github.com/SICQR/hotmess-london1/actions/workflows/ci.yml)
[![Security Scan](https://github.com/SICQR/hotmess-london1/actions/workflows/security.yml/badge.svg)](https://github.com/SICQR/hotmess-london1/actions/workflows/security.yml)
[![Deploy to Production](https://github.com/SICQR/hotmess-london1/actions/workflows/deploy.yml/badge.svg)](https://github.com/SICQR/hotmess-london1/actions/workflows/deploy.yml)

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

- Node.js 22.12.0 or higher (required by `engines.node` in package.json)
  - Use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) to manage Node versions
  - The repository includes `.nvmrc` and `.node-version` files for automatic version selection
  - Run `nvm use` or `fnm use` in the project directory to use the correct version
- pnpm (included via `packageManager` field in package.json)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SICQR/hotmess-london1.git
   cd hotmess-london1
   ```

2. **Install dependencies**
   ```bash
   # Enable corepack (built into Node.js) for automatic pnpm management
   corepack enable

   # Install project dependencies
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example file to create your local environment file
   cp .env.example .env.local
   # Edit .env.local and fill in your API keys and configuration
   ```
   
   **Note:** The project uses `.env.local` (which is gitignored). Never commit `.env.local` to version control.

4. **Start development server**
   ```bash
   pnpm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:3000`

## Environment Variables

See `.env.example` for all required and optional environment variables.

**Required:**
- `VITE_SHOPIFY_DOMAIN` - Your Shopify store domain
- `VITE_SHOPIFY_STOREFRONT_TOKEN` - Shopify Storefront API token
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

**Optional:**
- `VITE_MAPBOX_TOKEN` - For map features
- `HOTMESS_NEW_BOT_TOKEN` - For Telegram bot integration

## Development

### Available Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Create production build (includes type checking)
- `pnpm run preview` - Preview production build locally
- `pnpm run lint` - Check for code quality issues
- `pnpm run lint:fix` - Automatically fix linting issues
- `pnpm run format` - Format code with Prettier
- `pnpm run format:check` - Check code formatting
- `pnpm run type-check` - Validate TypeScript types
- `pnpm run test` - Run tests in watch mode
- `pnpm run test:run` - Run tests once
- `pnpm run test:coverage` - Run tests with coverage report

### Before Committing

Always run these commands before committing:

```bash
pnpm run type-check  # Ensure no TypeScript errors
pnpm run lint:fix    # Fix linting issues
pnpm run format      # Format code
pnpm run test:run    # Run tests
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

## CI/CD Pipeline

### Automated Checks (on every PR):
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Unit tests (Vitest)
- ✅ Build verification
- ✅ Security scanning (CodeQL, dependency audit, secret scanning)
- ✅ Performance audits (Lighthouse)

### Deployments:
- **Preview:** Automatic on PR (Vercel preview environment)
- **Production:** Automatic on merge to `main` (Vercel + Supabase Edge Functions)

**Vercel Node.js Configuration:**
To ensure consistency between local development and production, configure your Vercel project settings to use Node.js 22.12.0 or higher:
1. Go to your Vercel project settings → General → Node.js Version
2. Select `22.x` or specify `22.12.0` if available
3. The repository's `.nvmrc` and `.node-version` files will also be automatically detected by Vercel

### Running Checks Locally:
```bash
pnpm run lint          # Check code style
pnpm run type-check    # Check types
pnpm run test:run      # Run tests
pnpm run build         # Test build
```

### Branch Protection:
The `main` branch requires:
- ✅ Pull request with 1 approval
- ✅ All status checks passing (lint, typecheck, test, build)
- ✅ Branch up to date with main

### Setup CI/CD:
See [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md) for instructions on configuring required GitHub secrets for the CI/CD pipeline.

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
- **Maps**: Mapbox GL
- **Payments**: Stripe Connect
- **Messaging**: Telegram Bot API

## Project Status

✅ Core features implemented and tested
✅ Database schema complete (40+ tables)
✅ API layer functional
✅ TypeScript strict mode enabled
✅ ESLint + Prettier configured
✅ Production-ready build system

**Ready for deployment to Vercel + Supabase**

---

Built with ❤️ for the queer nightlife community
  