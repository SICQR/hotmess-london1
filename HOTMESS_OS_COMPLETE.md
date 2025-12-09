# HOTMESS Nightlife OS — Complete Implementation

**Men-only, 18+, nightlife-first operating system for queer cities.**

Everything feeds the heat: Globe → RIGHT NOW → XP → Mess Market → Telegram → Admin War Room → Care.

---

## System Overview

This is the first full-stack version of the HOTMESS OS, implementing a real-time nightlife platform with:

- **3D nightlife globe** with real-time heat
- **Full XP economy** wired into all actions
- **Multi-vendor Mess Market** with XP-gated drops
- **Telegram bot + rooms** integrated into every flow
- **Admin War Room** for safety, incidents, and control
- **RIGHT NOW feed** for live community intent
- **Beacons system** for QR-based check-ins and rewards
- **Radio integration** with live shows and listening rewards
- **Care resources** for safety and support

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (for payments)
- Telegram Bot Token (for bot features)
- Mapbox access token (for globe features)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file with:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Stripe
VITE_STRIPE_PUBLIC_KEY=your_stripe_key

# Telegram
HOTMESS_NEW_BOT_TOKEN=your_bot_token

# Mapbox
VITE_MAPBOX_TOKEN=pk.your_mapbox_token_here
```

---

## Architecture

### Frontend

- **React 18** + **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Radix UI** for accessible components
- **Mapbox GL** for 3D globe
- **React Map GL** for map wrapper

### Backend

- **Supabase** (Postgres + Auth + Edge Functions)
- **Stripe Connect** for multi-vendor payments
- **Telegram Bot API** for bot integration
- **Mapbox** for geocoding and maps

### Database

40+ tables across 9 migration files covering:

- Events (geo-located events, attendance, check-ins)
- XP / Gamification (ledger, levels, streaks, achievements)
- Beacons (QR codes, scan logs, rewards)
- RIGHT NOW (posts, intents, likes, comments)
- Radio (shows, schedules, listeners)
- Shop (products, orders, affiliates)
- Care (resources, safety reports)
- Mess Market (vendors, products, drops, orders)
- Telegram (user mapping, rooms, bot commands)
- Admin War Room (moderation, incidents, system health)

---

## Key Features

### 1. 3D Globe — The Nervous System

**Location**: `/src/components/globe/MapboxGlobe.tsx`, `/src/pages/NightPulse.tsx`

- Mapbox-powered 3D globe with HOTMESS styling
- Heat visualization based on events + purchases + scans
- Beacon markers for events, drops, care, radio, incidents
- Click-to-detail cards for events and products
- Real-time heat updates

**Usage**:
```tsx
<MapboxGlobe 
  beacons={eventBeacons.concat(productBeacons)}
  showHeat={true}
  showBeacons={true}
  onBeaconClick={handleBeaconClick}
/>
```

### 2. RIGHT NOW Feed — Live Community Intent

**Location**: `/src/pages/CommunityOverview.tsx`, `/src/pages/CommunityPostCreate.tsx`

- Live, intent-based posts for "right now" availability
- Ephemeral posts with XP tie-ins
- Engagement: likes, claims, comments
- XP rewards for activity
- Wired to Mess Market drops and Telegram broadcasts

### 3. XP Economy — Universal Gamification

**Location**: `/src/lib/xp-system.ts`, `/src/pages/XPProfileNew.tsx`, `/src/lib/api/xp.ts`

**XP Earn Paths**:
- Beacon scans (10 XP)
- Event attendance (50 XP)
- RIGHT NOW posts/claims (15 XP)
- Market purchases (1 XP per £)
- Radio listening (5 XP)
- Daily login streak (5 XP)
- Referrals (200 XP)
- Safety reports (varies)

**XP Spend Paths**:
- Priority boosts (100 XP)
- Anonymous mode (75 XP)
- Telegram broadcasts (150 XP)
- Vendor discounts (200 XP)
- Ticket queue jump (300 XP)
- Custom skins (500 XP)
- Aftercare unlocks (50 XP)

**Features**:
- Level system with tier progression
- Daily streaks with multipliers
- Leaderboards (global + city)
- Achievement system
- Membership tier multipliers (2x-5x)

### 4. Mess Market — Multi-Vendor Marketplace

**Location**: `/src/pages/MessMarketBrowse.tsx`, `/src/pages/MessMarketProduct.tsx`, `/src/lib/api/messmarket.ts`

**Features**:
- Multi-vendor marketplace with Stripe Connect payouts
- XP-gated drops (blurred until XP threshold met)
- Scheduled drops with countdown timers
- QR beacon auto-generation per product
- Product states: Locked, Live Drop, Low Stock, Sold Out, Owned
- Stripe checkout with Apple/Google Pay

**Revenue Streams**:
- Platform commission: 12–20% per sale
- Fast-track XP purchases
- Sponsorship drops: £500-£5,000
- White-label fulfilment
- Membership upsells

### 5. Telegram Integration — Distribution Spine

**Location**: `/src/supabase/functions/server/telegram_bot.tsx`, `/src/supabase/functions/server/telegram_webhook.tsx`

**Bot Commands**:
- `/rightnow` — latest RIGHT NOW feed
- `/london`, `/berlin` — city feeds
- `/drops` — active product drops
- `/scan CODE` — simulate QR beacon scan
- `/xp` — current XP and tier
- `/admin incidents` — admin-only incident feed

**Rooms**:
- City rooms (geo-specific)
- VIP rooms (XP-gated)
- Care rooms (safe spaces, moderated)
- Event rooms (temporary, tied to events)
- Vendor rooms (brand-specific communities)

**Integration**:
- RIGHT NOW posts mirrored into city rooms
- Drops announced via bots with purchase links
- QR codes distributed for beacon unlocks
- Group invites on product purchase or XP threshold
- Incident alerts into admin channels

### 6. Admin War Room — Control Center

**Location**: `/src/pages/admin/AdminOverview.tsx`, `/src/pages/admin/AdminGlobeView.tsx`

**Dashboard**:
- Real-time system stats (active users, posts, beacons, orders)
- Revenue tracking with growth metrics
- XP issuance monitoring
- Vendor performance analytics
- Active incident tracking

**Kill Switches** (to be fully implemented):
- Global: disable all RIGHT NOW + beacons
- City: disable a single city
- Feature-level: RIGHT NOW / beacons / market
- Vendor: suspend all vendor products
- Beacon-level: deactivate individual beacon
- Auto-restore windows for temporary shutdown

**Incident Management** (to be fully implemented):
- Incident log with geolocation + severity
- Categories (safety, violence, overdose, police, venue)
- Heatmap generation for Globe visualization
- Auto-escalation for critical incidents
- Full audit trail

**Moderation Queue**:
- Reported content review
- User management (suspend, ban)
- Vendor verification
- DSAR request handling

### 7. Beacon System — QR Rewards & Check-ins

**Location**: `/src/lib/api/beacons.ts`, `/src/pages/BeaconScanFlow.tsx`

**Features**:
- QR code generation for events, products, venues
- Scan logging with XP rewards
- Auto-check-in to events
- Beacon analytics (scans, unique users, conversion)
- Location-based validation
- Time-window restrictions

**API**:
```typescript
// Scan a beacon
const result = await scanBeacon(code, accessToken);
// Returns: { xp_earned, event_checked_in, product_unlocked, ... }

// Create a beacon
const beacon = await createBeacon({
  type: 'event',
  name: 'Pride Party',
  xp_reward: 50,
  location: { lat, lng }
}, accessToken);
```

### 8. Radio Integration

**Location**: `/src/pages/RadioNew.tsx`, `/src/pages/RadioShowDetail.tsx`

- Live radio shows with schedules
- Now playing bar with XP rewards
- Listener count aggregation
- Radio heat contribution to globe
- Show archives and playlists

### 9. Care Resources

**Location**: `/src/pages/CareHub.tsx`, `/src/pages/SafePlaces.tsx`

- Directory of resources and helplines
- Safety reporting system
- Crisis contacts
- Safe place locator
- XP rewards for care participation

---

## Database Schema

### Core Tables

**users** — User profiles, XP, membership tiers
**cities** — City definitions for City OS
**events** — Geo-located events with categories
**beacons** — QR codes with rewards and rules
**beacon_scans** — Scan logs with XP awards
**xp_ledger** — Complete XP transaction history
**xp_rewards** — Available XP redemption items
**posts** (RIGHT NOW) — Live community feed
**market_vendors** — Mess Market seller accounts
**market_products** — Products with XP gates
**market_orders** — Order tracking
**telegram_users** — User–Telegram ID mapping
**telegram_rooms** — Room registry
**admin_actions** — Moderation log

### Business Logic Functions

- `award_xp()` — Central XP issuance
- `scan_beacon()` — Validate QR, apply rewards
- `checkin_to_event()` — Auto-attendance from beacon
- `process_order_completion()` — Post-purchase XP + fulfilment
- `check_achievements()` — Unlock badges + bonuses
- `can_purchase_product()` — XP, stock, drop-time checks
- `process_market_order()` — Mess Market payment + XP logic
- `create_product_beacon()` — Auto-QR generation
- `activate_kill_switch()` — Scoped shutdown (to be implemented)
- `get_system_stats()` — Admin dashboard metrics

---

## XP Addiction Loop

1. See heat on globe
2. Scan a beacon
3. Respond via RIGHT NOW
4. Earn XP
5. Spend XP on boosts/drops
6. Unlock Mess Market products
7. Join Telegram rooms + share
8. More heat on globe

**Every module is wired into this loop.**

---

## API Endpoints

### Beacon API

```
POST /v2/beacons/:code/scan — Scan beacon
GET  /v2/beacons/:code — Get beacon details
GET  /v2/beacons — List beacons (with filters)
POST /v2/beacons — Create beacon
PUT  /v2/beacons/:id — Update beacon
```

### XP API

```
GET  /v2/xp/profile — Get user XP profile
GET  /v2/xp/history — Transaction history
GET  /v2/xp/leaderboard — Global/city leaderboard
GET  /v2/xp/rewards — Available rewards
POST /v2/xp/rewards/:id/redeem — Redeem reward
POST /v2/xp/award — Award XP (internal)
```

### Market API

```
GET  /v2/market/products — Browse products
GET  /v2/market/products/:id — Product details
POST /v2/market/checkout — Create checkout session
GET  /v2/market/orders — User orders
POST /v2/market/vendors/onboard — Vendor onboarding
```

### Admin API

```
GET  /api/admin/stats/overview — Dashboard stats
GET  /api/admin/beacons/all — All beacons
GET  /api/admin/users — User management
POST /api/admin/moderation — Moderation actions
```

---

## Deployment

### Vercel Deployment

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Supabase Setup

1. Create project in Supabase
2. Run migrations in `/src/supabase/migrations/`
3. Deploy Edge Functions from `/src/supabase/functions/`
4. Set up RLS policies
5. Enable Realtime for live features

### Stripe Connect

1. Create Stripe Connect application
2. Enable Standard or Express accounts
3. Set webhook URL for payment events
4. Configure commission rates

### Telegram Bot

1. Create bot via @BotFather
2. Set webhook URL to Edge Function
3. Configure bot commands
4. Create rooms and get invite links

---

## Security

### Authentication

- Supabase Auth with email/password
- QR login flow for mobile
- Session management with JWT
- Role-based access control (user, vendor, admin)

### Row Level Security (RLS)

All tables protected with RLS policies:
- Users can only see their own data
- Public data (events, products) is read-only
- Admins have elevated permissions
- Vendors can manage their own products

### Payment Security

- Stripe Checkout for PCI compliance
- Server-side payment validation
- Webhook signature verification
- No card data stored locally

### Content Moderation

- Report system for inappropriate content
- Admin moderation queue
- Automated content filtering
- User blocking and banning

---

## Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Beacon scanning and XP awards
- [ ] Event creation and check-in
- [ ] Product purchase flow
- [ ] XP reward redemption
- [ ] Telegram bot commands
- [ ] Admin dashboard access
- [ ] Globe heat visualization
- [ ] RIGHT NOW post creation
- [ ] Vendor onboarding

### Key User Flows

1. **New User Onboarding**
   - Sign up → age verification → consent → first scan → XP earned

2. **Event Attendance**
   - See event on globe → scan beacon → auto check-in → earn XP → post to RIGHT NOW

3. **Product Purchase**
   - Browse Mess Market → check XP requirement → purchase → earn XP → receive product

4. **XP Redemption**
   - View XP profile → browse rewards → redeem → receive benefit

5. **Telegram Integration**
   - Connect Telegram → join room → receive notifications → scan via bot

---

## Known Limitations & Future Work

### To Be Implemented

- [ ] Kill switch UI and logic in Admin War Room
- [ ] Incident management system with heatmap
- [ ] Full Telegram bot command suite
- [ ] Product beacon auto-generation on product creation
- [ ] Heat calculation formula refinement
- [ ] Time-window playback for globe
- [ ] XP storm visualization
- [ ] Radio listener overlays on globe

### Performance Optimizations

- [ ] Implement Redis caching for hot data
- [ ] Optimize beacon scan queries
- [ ] Add pagination to leaderboards
- [ ] Lazy load globe markers
- [ ] Compress images and assets

### Feature Enhancements

- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode customization

---

## Support & Contact

For technical support or questions:
- GitHub Issues: https://github.com/SICQR/hotmess-london1
- Telegram: @HotmessRoomsBot

---

## License

Proprietary — All Rights Reserved

---

**Built with ❤️ for the queer nightlife community**
