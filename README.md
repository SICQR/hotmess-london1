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

4. **Start development server**
   ```bash
   npm run dev
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

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build (includes type checking)
- `npm run preview` - Preview production build locally
- `npm run lint` - Check for code quality issues
- `npm run lint:fix` - Automatically fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Validate TypeScript types
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Open test UI
- `npm run test:coverage` - Generate coverage report

### Testing

Run tests:
```bash
npm test              # Watch mode
npm run test:run      # Run once
npm run test:ui       # Open UI
npm run test:coverage # Generate coverage report
```

Write tests in:
- `src/__tests__/unit/` - Pure logic tests
- `src/__tests__/integration/` - Feature tests
- `src/__tests__/components/` - Component tests

### Before Committing

Always run these commands before committing:

```bash
npm run type-check  # Ensure no TypeScript errors
npm run lint:fix    # Fix linting issues
npm run format      # Format code
npm test:run        # Run tests
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
✅ Testing framework with Vitest
✅ Unit, integration, and component tests

**Ready for deployment to Vercel + Supabase**

---

Built with ❤️ for the queer nightlife community
  