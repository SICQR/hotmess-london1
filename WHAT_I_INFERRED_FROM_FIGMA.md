# What I Inferred from Figma Design

**Design Source**: https://www.figma.com/make/ZDnegUk6LijlDPt7vu7TWG/HM1?node-id=0-1

This document summarizes the entities, routes, features, and assumptions made during the implementation of HOTMESS LONDON from the Figma design file.

## 🎨 Design System

### Color Palette
From the design, I extracted:
- **Primary Black**: `#000000` - Background for all major surfaces
- **Pure White**: `#FFFFFF` - Text and borders
- **HOTMESS Red**: `#FF0066` - Primary brand color, CTAs, accents
- **Neon Pink**: `#FF00FF` - Secondary highlights
- **Electric Violet**: `#8B00FF` - Tertiary highlights

### Typography
The design showed a clear typographic hierarchy:
- **Headlines**: Uppercase, bold, sans-serif
- **Body**: Regular weight, high line-height for readability
- **Labels**: Small caps, tracked out for emphasis
- **Locked in globals.css**: Font sizes, weights, and line-heights are NOT configurable via Tailwind classes

### Component Patterns
I identified these recurring patterns:
- **Brutalist Cards**: Heavy borders, hard shadows, high contrast
- **Neon Buttons**: Glowing effects on primary CTAs
- **Glass Morphism**: Transparent overlays with backdrop blur
- **Kink Aesthetics**: Deliberate roughness, anti-polish

## 🏗️ Core Entities

### User/Profile
```typescript
interface Profile {
  id: string                    // UUID, references auth.users
  username: string              // Unique handle
  display_name: string          // Public name
  avatar_url?: string           // Profile picture
  bio?: string                  // User description
  gender: string                // 'man' required for RIGHT NOW
  dob: Date                     // 18+ verification
  home_city: string             // Required for location features
  country: string               // Default 'UK'
  xp_band: string               // 'fresh' | 'regular' | 'sinner' | 'icon'
  membership_tier: string       // 'free' | 'hnh' | 'sponsor' | 'icon'
  shadow_banned: boolean        // Trust & safety flag
}
```

### RIGHT NOW Posts
```typescript
interface RightNowPost {
  id: string
  user_id: string
  mode: 'hookup' | 'crowd' | 'drop' | 'ticket' | 'radio' | 'care'
  headline: string              // Max ~100 chars
  body?: string                 // Optional details
  city: string                  // Required
  country?: string
  geo_bin: string               // "51.5074_-0.1278_250m"
  lat?: number
  lng?: number
  membership_tier: string       // Copied from profile
  xp_band: string               // Copied from profile
  safety_flags: string[]        // ['verified_host', 'high_risk', etc.]
  near_party: boolean           // Within 500m of active party beacon
  sponsored: boolean            // Boosted visibility
  created_at: string            // ISO timestamp
  expires_at: string            // created_at + 1 hour
  score: number                 // Computed ranking
}
```

### Beacons
```typescript
interface Beacon {
  id: string
  code: string                  // e.g. "GLO-001", "SHO-042"
  type: string                  // 'event' | 'venue' | 'party' | 'hookup'
  title: string
  description?: string
  lat: number
  lng: number
  city: string
  venue_name?: string
  created_by: string            // User ID
  active: boolean
  start_time?: string
  end_time?: string
}
```

### Tickets (C2C Marketplace)
```typescript
interface TicketListing {
  id: string
  seller_id: string
  beacon_id: string             // Links to event beacon
  title: string
  description?: string
  price: number                 // In pence/cents
  quantity: number
  status: 'active' | 'sold' | 'cancelled'
}

interface TicketThread {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  status: 'pending' | 'accepted' | 'completed' | 'cancelled'
}

interface TicketMessage {
  id: string
  thread_id: string
  sender_id: string
  content: string
  removed_at?: string           // Soft delete for moderation
}
```

### Connect (Dating/Hookup)
```typescript
interface ConnectIntent {
  id: string
  user_id: string
  beacon_id?: string            // Optional venue context
  intent_type: string           // 'hookup' | 'date' | 'friends'
  anonymous: boolean            // Hide profile initially
  active_until: string          // Expiration
}

interface ConnectThread {
  id: string
  user_a: string
  user_b: string
  beacon_id?: string            // Where they matched
  status: 'active' | 'archived'
}
```

### Records (Music Label)
```typescript
interface RecordsRelease {
  id: string
  slug: string                  // URL-friendly
  title: string
  artist: string
  artwork_url: string
  soundcloud_url?: string       // Preview embed
  release_date: Date
  published: boolean
}

interface RecordsTrack {
  id: string
  release_id: string
  title: string
  track_number: number
  duration_seconds: number
}

interface RecordsTrackVersion {
  id: string
  track_id: string
  version_type: 'preview' | 'wav' | 'mp3_320' | 'flac'
  file_path: string             // Supabase Storage path
  file_size_bytes: number
}
```

## 🗺️ Routes

### Public Routes (No Auth Required)
```
/                           - Homepage
/beacons                    - Browse beacons
/tickets                    - Ticket marketplace
/records                    - Music releases
/radio                      - Live radio
/care                       - Care resources
/community                  - Community hub
/legal                      - Legal pages
/login                      - Sign in
/register                   - Sign up
```

### Protected Routes (Auth Required)
```
/right-now                  - Live feed
/right-now/new              - Create post
/connect                    - Dating module
/connect/create             - Create intent
/connect/threads            - Message threads
/my-tickets                 - Seller dashboard
/account                    - User settings
/saved                      - Saved content
```

### Admin Routes (Admin Role Required)
```
/admin                      - Admin dashboard
/admin/moderation           - Moderation queue
/admin/beacons              - Beacon management
/admin/users                - User management
/admin/records              - Release management
```

### Dynamic Routes
```
/l/:code                    - Scan beacon by code
/tickets/:beaconId          - Event tickets
/tickets/listing/:id        - Listing detail
/connect/thread/:id         - Chat thread
/records/releases/:slug     - Release page
```

## 🎯 Features Implemented

### 1. RIGHT NOW Module ✅
**Status**: Fully functional with realtime updates

**Features**:
- 6 posting modes (hookup, crowd, drop, ticket, radio, care)
- 1-hour post expiration (TTL)
- Real-time Supabase broadcast on create/delete
- Geo-based clustering with 250m bins
- Membership-based rate limiting (5/hour, 20/day for free)
- Score-based feed ranking
- City and mode filters
- Safe mode toggle (hide high_risk posts)

**Gates**:
- Must be authenticated
- Must be 18+ years old
- Must be male (gender === 'man')
- Must have city in profile
- Must not be shadow banned

### 2. Beacon System ✅
**Status**: Backend complete, QR flows working

**Features**:
- QR code generation with frames (Neon, Elite, Minimal, Violet Halo)
- Scan tracking with XP rewards
- Party/event/venue beacons
- Heat map integration
- `/l/:code` short URLs

### 3. Tickets C2C Marketplace ✅
**Status**: Functional with messaging

**Features**:
- Create listings for event tickets
- Real-time messaging between buyer/seller
- Proof upload system (photos of tickets)
- Template messages for quick responses
- Thread management

### 4. Connect Module ✅
**Status**: Production ready

**Features**:
- Anonymous intent creation at venues
- Consent-first matching
- Real-time chat
- Location-based discovery
- Profile reveal after match

### 5. Records Label ✅
**Status**: Complete with audio streaming

**Features**:
- SoundCloud preview embeds
- High-quality downloads (WAV/FLAC/MP3 320)
- Release management
- Download tracking
- Library for purchased releases

### 6. Globe/Heat Engine ✅
**Status**: 3D visualization working

**Features**:
- Mapbox GL 3D globe
- Heat bins from activity
- Beacon clustering
- City intelligence view

### 7. Radio Integration ✅
**Status**: Live streaming functional

**Features**:
- RadioKing API integration
- Live listener count
- Now playing display
- Last.fm metadata enrichment

### 8. Trust & Safety ✅
**Status**: Core features implemented

**Features**:
- Shadow banning system
- Report user/content
- Block/mute users
- Moderation queue
- Admin actions (cooldown, ban, remove content)

### 9. Membership Economy ✅
**Status**: 4-tier system active

**Tiers**:
- **Free**: Basic access, rate limits
- **HNH (Hand N Hand)**: Higher limits, verified badge, panic button
- **Sponsor**: Boosted posts, priority support
- **Icon**: Unlimited everything, custom badge

### 10. XP Gamification ✅
**Status**: Points system working

**XP Awards**:
- Post RIGHT NOW: 15-25 XP (based on mode)
- Scan beacon: 10 XP
- Buy ticket: 5 XP
- Complete profile: 50 XP
- Daily login: 1 XP

**XP Bands**:
- Fresh (0-99 XP)
- Regular (100-499 XP)
- Sinner (500-1999 XP)
- Icon (2000+ XP)

## 🔐 Authentication & Gates

### Age Gate
**First visit flow**:
1. Show splash screen (HOTMESS branding)
2. Show age gate popup (18+ verification)
3. User clicks ENTER or LEAVE
4. Store verification in localStorage
5. Never show again

### Auth Gates by Feature
```
RIGHT NOW posting:      18+ + Male + Authenticated + City
Connect intents:        18+ + Authenticated
Ticket selling:         18+ + Authenticated
Admin routes:           Authenticated + Admin role
Profile viewing:        Authenticated
```

### Development Auth Bypass
**Location**: `/App.tsx` line 21-26  
**Status**: Fixed - Only enabled in `import.meta.env.DEV`  
**Usage**: Auto-enables in dev mode for testing

## 🎨 Design Tokens

### Spacing
```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
```

### Borders
```css
--border-thin: 1px
--border-medium: 2px
--border-thick: 4px
--border-radius: 0px   /* Brutalist = no rounding */
```

### Shadows
```css
--shadow-brutal: 4px 4px 0 0 var(--color-hotmess-red)
--shadow-neon: 0 0 20px rgba(255, 0, 102, 0.5)
--shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.37)
```

## 🤔 Assumptions Made

### 1. Technology Choices
**Assumed**: React SPA with Vite (not Next.js SSR)  
**Rationale**: Figma Make environment suggests client-side rendering

### 2. Authentication
**Assumed**: Supabase Auth with JWT tokens  
**Rationale**: Supabase is the primary backend, auth is built-in

### 3. Real-time Strategy
**Assumed**: Supabase Realtime broadcast channels (not Postgres changes)  
**Rationale**: Broadcast is simpler for ephemeral data like RIGHT NOW

### 4. Membership Payment
**Assumed**: Stripe for subscription management  
**Rationale**: Industry standard, good docs, Supabase integration available

### 5. Geographic Scope
**Assumed**: UK-first, expandable globally  
**Rationale**: "London" in name, default country is 'UK'

### 6. Mobile Strategy
**Assumed**: Responsive web app (not native mobile)  
**Rationale**: Tailwind CSS responsive design, no native mentioned

### 7. Content Moderation
**Assumed**: Manual moderation queue + auto-flags  
**Rationale**: Queer platform needs human oversight, AI can assist

### 8. Data Retention
**Assumed**: 
- RIGHT NOW posts: Hard delete after 24 hours past expiry
- Messages: Soft delete (removed_at flag)
- User data: Keep until account deletion request

**Rationale**: Privacy-first approach, GDPR compliance

### 9. Rate Limiting
**Assumed**: Database-based (query count) not Redis  
**Rationale**: Simpler for MVP, Supabase-native

### 10. Image Storage
**Assumed**: Supabase Storage with CDN  
**Rationale**: Integrated solution, signed URLs for security

## 📊 Metrics & Analytics

From the design, I inferred these key metrics:

### Platform Health
- Active users (DAU/MAU)
- RIGHT NOW posts per hour
- Beacon scans per day
- Heat map density

### Engagement
- Average session duration
- Posts per user per day
- Messages per thread
- Beacon revisit rate

### Commerce
- Ticket listings created
- Successful ticket sales
- Record downloads
- Conversion to paid membership

### Trust & Safety
- Reports filed
- Moderation actions taken
- Shadow ban rate
- User blocks

## 🚧 Features NOT Implemented

These were mentioned or implied but not built:

1. **Telegram Bot Integration** - Rooms bridge mentioned but not wired
2. **Push Notifications** - Web push not configured
3. **Video Chat** - Care module video mentioned but not built
4. **AR Beacon Scanning** - Camera-based QR scanning (uses input only)
5. **Offline Mode** - Service worker not configured
6. **Multi-language** - i18n not implemented (English only)
7. **SMS Verification** - Phone number verification not built
8. **Social Sharing** - Share to Twitter/Instagram not wired
9. **Print QR Codes** - Beacon poster generator exists but not finalized
10. **Analytics Dashboard** - User-facing stats page not built

## 🔮 Future Considerations

Based on the design patterns, future features might include:

- **Club Mode** - Door scanner for venues (partially built)
- **Event Calendar** - Full calendar view of beacons
- **Friend System** - Add friends, see their activity
- **Stories** - Instagram-style temporal content
- **Voice Messages** - Audio in threads
- **Verification System** - ID verification for trust badges
- **Premium Radio** - Ad-free tier
- **Merch Store** - Expand shop beyond basics
- **API for Partners** - Venue integrations
- **White-label** - Other cities can deploy

---

**Summary**: The implementation stayed very close to the Figma design while making pragmatic technology choices for a production SPA. The core RIGHT NOW module is fully functional with all critical features, and the architecture supports easy expansion of additional modules as designed.
