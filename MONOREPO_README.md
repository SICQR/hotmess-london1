# HOTMESS Platform — Monorepo

**Multi-layer nightlife OS with 8+ interconnected features**

A real-time platform connecting queer nightlife through a 3D globe, XP economy, multi-vendor marketplace, and cross-feature promotions.

## 🏗️ Monorepo Structure

```
hotmess-platform/
├── apps/
│   ├── main/              # Main HOTMESS application
│   └── music/             # RAW Convict Records standalone app
├── packages/
│   ├── ui/                # Shared React components
│   ├── design-system/     # Brand tokens, colors, typography
│   ├── database/          # Supabase types & client
│   ├── beacons/           # Beacon system SDK
│   ├── telegram/          # Telegram bot SDK
│   ├── xp-engine/         # Universal XP system
│   └── cross-promotions/  # 🔥 Cross-feature intelligence
├── package.json           # Root workspace config
├── turbo.json            # Turborepo config
└── pnpm-workspace.yaml   # PNPM workspaces
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 10.26.1+
- Git

### Installation

```bash
# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install

# Start all apps in development mode
pnpm dev

# Build all apps
pnpm build

# Run linting
pnpm lint

# Run type checking
pnpm type-check
```

## 📦 Packages

### @hotmess/ui
Shared React components built on Radix UI. All UI components are reusable across apps.

```typescript
import { Button, Card, Badge } from '@hotmess/ui';
```

### @hotmess/design-system
Brand tokens, colors, typography, and UX writing system.

```typescript
import { DESIGN_TOKENS, BUTTONS, XP } from '@hotmess/design-system';
```

### @hotmess/database
Supabase client and database types.

```typescript
import { supabase } from '@hotmess/database';
```

### @hotmess/beacons
Beacon system SDK supporting 6 beacon types (Venue, Event, Hook-up, Drop, Pop-up, Private).

```typescript
import { scanBeacon, resolveBeacon, BeaconType } from '@hotmess/beacons';
```

### @hotmess/telegram
Telegram bot SDK for bots, rooms, and 1:1 threads.

```typescript
import { createBot, createRoom, createThread } from '@hotmess/telegram';
```

### @hotmess/xp-engine
Universal XP system tracking all user actions across features.

```typescript
import { awardXP, checkLevel, getAchievements } from '@hotmess/xp-engine';
```

### @hotmess/cross-promotions 🔥
**THE MAGIC** — Intelligence engine for cross-feature promotions.

```typescript
import { crossPromotionEngine, UserContext } from '@hotmess/cross-promotions';

const promotion = await crossPromotionEngine.getPromotion(context);
```

Analyzes user context (current feature, location, activity, time) and suggests relevant promotions for other features.

## 🎯 Features

### Main App (`apps/main`)
- 🏠 Core Platform (Night Pulse Globe, XP, Profiles)
- 🛒 Mess Market (Multi-vendor marketplace, Stripe Connect)
- 📍 Beacons (6 types: Venue, Event, Hook-up, Drop, Pop-up, Private)
- 💬 Telegram Integration (Bots, Rooms, 1:1 Threads)
- 🎯 RIGHT NOW Feed (Location-based social)
- 🎵 Radio (Live stream, RAW Convict Radio)
- 🛍️ Shopify Shop (RAW, HUNG, HIGH, SUPER HUNG collections)
- 🎟️ Tickets (Primary sales + C2C resale)
- 🛡️ Care & Safety (Hand N Hand, Resources)

### Music App (`apps/music`)
- 🎧 RAW Convict Records (Music releases, SoundCloud)
- 🎵 Artist Profiles
- 💿 Live Stream Integration
- 🎯 XP Rewards for Streaming
- 🔥 Cross-Promotion with Main Platform

## 🔧 Development

### Running Individual Apps

```bash
# Main app only
cd apps/main
pnpm dev

# Music app only
cd apps/music
pnpm dev
```

### Building Packages

```bash
# Build all packages
pnpm --filter "@hotmess/*" build

# Build specific package
pnpm --filter @hotmess/ui build
```

### Adding Dependencies

```bash
# Add to workspace root
pnpm add <package> -w

# Add to specific app
pnpm add <package> --filter @hotmess/main

# Add to specific package
pnpm add <package> --filter @hotmess/ui
```

## 📝 Scripts

- `pnpm dev` — Start all apps in development mode
- `pnpm build` — Build all apps and packages
- `pnpm lint` — Lint all apps and packages
- `pnpm type-check` — Type check all apps and packages
- `pnpm format` — Format code with Prettier
- `pnpm format:check` — Check code formatting

## 🎨 Cross-Feature Promotions

The `@hotmess/cross-promotions` package is the intelligence layer that connects all features:

1. **Beacon Scanner → Music** - Promotes RAW Convict Records to active scanners
2. **Radio Listener → Beacons** - Promotes beacon scanning to radio listeners at night
3. **High XP → Shop** - Promotes shop to users who've earned the right
4. **Care Reminder** - Periodic reminders to visit Hand N Hand
5. **Venue Visitor → Tickets** - Promotes tickets to frequent venue visitors

Add custom rules to enhance cross-promotion intelligence.

## 🔒 Environment Variables

Each app has its own environment configuration:

```bash
# Main app
apps/main/.env.local

# Music app
apps/music/.env.local
```

Copy `.env.example` to `.env.local` in each app and configure.

## 🛠️ Tech Stack

- **Build System:** Turborepo + pnpm workspaces
- **Frontend:** React 18, TypeScript, Vite
- **UI:** Radix UI, Tailwind CSS
- **Database:** Supabase
- **Payments:** Stripe Connect
- **Real-time:** Supabase Realtime
- **Maps:** MapLibre GL

## 📚 Documentation

- [Design System](./packages/design-system/README.md)
- [Cross-Promotions](./packages/cross-promotions/README.md)
- [Contributing](./CONTRIBUTING.md)

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## 📄 License

Proprietary. All rights reserved.

---

**HOTMESS** — care dressed as kink, built for the men who survived enough to want more.
