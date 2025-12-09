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

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

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

## Environment Setup

Create a `.env` file with required API keys:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
HOTMESS_NEW_BOT_TOKEN=your_telegram_bot_token
VITE_MAPBOX_TOKEN=your_mapbox_token
```

## Project Status

✅ Core features implemented and tested
✅ Database schema complete (40+ tables)
✅ API layer functional
✅ Build passes cleanly

**Ready for deployment to Vercel + Supabase**

---

Built with ❤️ for the queer nightlife community
  