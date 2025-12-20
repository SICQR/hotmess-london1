# HOTMESS LONDON

**A complete masculine nightlife OS for queer men 18+**

HOTMESS LONDON combines care-first principles with kink aesthetics, featuring a location-based social operating system with 3D globe interface, QR beacon system, real-time messaging, and comprehensive marketplace.

## 🌍 Core Features

### Night Pulse 3D Globe
- Interactive 3D globe powered by Mapbox GL JS
- Real-time location-based event discovery
- Heat maps showing nightlife activity across London

### HOTMESS QR Engine
- 4 production-ready QR code styles: RAW, HOTMESS, CHROME, STEALTH
- Signed payload system for secure hook-ups and ticket resale
- QR generation API with JWT verification
- Beacon resolve handlers for seamless check-ins

### Beacon System
- 6 beacon types: Venue, Event, Hook-up, Drop, Pop-up, Private Party
- Real-time beacon creation and management
- Location-based beacon discovery
- Admin UI for beacon moderation

### Commerce System
- Two-engine commerce: Shopify shop + Supabase marketplace
- Stripe Connect integration for peer-to-peer payments
- C2C ticket resale system
- Seller dashboard with analytics

### Trust & Safety
- GDPR/Privacy compliance hub
- Systematic consent gates
- User verification system
- Content moderation tools

### Social Features
- Real-time messaging
- Telegram integration
- XP and achievements system
- User profiles and connections

## 🎨 Design System

HOTMESS maintains a distinctive dark neon kink aesthetic:
- **Background**: Black (`#000000`)
- **Primary Accent**: Hot Pink (`#FF1493`)
- **Text**: White
- **Typography**: Custom font weights and sizes (no Tailwind text classes)

## 🏗️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase Edge Functions (Hono)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Stripe Connect
- **Maps**: Mapbox GL JS
- **Deployment**: Supabase Edge Functions

## 📦 Project Structure

```
/src
  /components          # React components
  /pages              # Page components
  /utils              # Utility functions
  /styles             # Global styles
  /supabase
    /functions
      /server         # Edge Functions (122+ routes)
        /routes       # API route modules
```

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see Supabase dashboard)

3. Run development server:
   ```bash
   npm run dev
   ```

4. Deploy Edge Functions:
   ```bash
   supabase functions deploy server --no-verify-jwt
   ```

## 🔑 Environment Variables

Required secrets (already configured in Supabase):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_RESTRICTED_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `BEACON_SECRET`
- `APP_BASE_URL`

## 📊 Current Progress

✅ Night Pulse 3D globe with Mapbox GL JS
✅ Complete beacon system (6 types)
✅ HOTMESS QR Engine (4 styles)
✅ Commerce system (Shopify + Stripe Connect)
✅ User authentication and profiles
✅ 122+ API routes
🚧 GDPR/Privacy compliance hub (Phase 1)
🚧 Systematic consent gates (Phase 2)

## 🎯 Roadmap

**Phase 1**: GDPR/Privacy Hub (legal compliance blocker)
**Phase 2**: Systematic Consent Gates
**Phase 3**: Real-time messaging and Telegram integration
**Phase 4**: Music streaming integration
**Phase 5**: Advanced trust & safety features

## 📄 License

Proprietary - All rights reserved

## 🔗 Links

- Production: [Coming Soon]
- Figma Design: [Internal]
- Supabase Dashboard: https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl

---

**Built with care for the queer nightlife community** 🖤💗
