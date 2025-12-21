# HOTMESS Monorepo Migration Guide

## Overview

The HOTMESS platform has been transformed from a single-app repository into a monorepo architecture using Turborepo and pnpm workspaces. This enables:

1. **Independent deployment** of features
2. **Code sharing** via packages
3. **Cross-feature promotions** through intelligent package
4. **Scalable development** for growing teams

## What Changed

### Before (Single App)
```
hotmess-london1/
├── src/
│   ├── components/
│   ├── lib/
│   ├── pages/
│   └── ...
├── package.json
└── vite.config.ts
```

### After (Monorepo)
```
hotmess-platform/
├── apps/
│   ├── main/              # Main app (moved from root)
│   └── music/             # New RAW Convict Records app
├── packages/
│   ├── ui/                # Shared React components
│   ├── design-system/     # Brand tokens & UX writing
│   ├── database/          # Supabase client
│   ├── beacons/           # Beacon SDK
│   ├── telegram/          # Telegram SDK
│   ├── xp-engine/         # XP system
│   └── cross-promotions/  # Cross-feature intelligence
├── package.json           # Root workspace
├── turbo.json            # Turborepo config
└── pnpm-workspace.yaml   # PNPM workspace config
```

## Key Changes

### 1. Package Structure

All shared code has been extracted into reusable packages in `packages/`:

- **@hotmess/ui** - All UI components from `src/components/ui/`
- **@hotmess/design-system** - Design tokens from `src/design-system/`
- **@hotmess/database** - Supabase client from `src/lib/supabase.ts`
- **@hotmess/beacons** - Beacon system from `src/lib/beacon-system.ts`
- **@hotmess/xp-engine** - XP system from `src/lib/xp-system.ts`
- **@hotmess/telegram** - New Telegram SDK (placeholder)
- **@hotmess/cross-promotions** - New cross-feature intelligence engine

### 2. Import Paths

If you were importing from local paths, you'll now import from packages:

**Before:**
```typescript
import { Button } from './components/ui/button';
import { DESIGN_TOKENS } from './design-system/design-tokens';
import { supabase } from './lib/supabase';
```

**After:**
```typescript
import { Button } from '@hotmess/ui';
import { DESIGN_TOKENS } from '@hotmess/design-system';
import { supabase } from '@hotmess/database';
```

### 3. Commands

**Before:**
```bash
npm install
npm run dev
npm run build
```

**After:**
```bash
pnpm install              # Install all dependencies
pnpm dev                  # Run all apps in dev mode
pnpm build                # Build all apps and packages
pnpm --filter @hotmess/main dev   # Run only main app
pnpm --filter @hotmess/music dev  # Run only music app
```

### 4. New Apps

A new app has been created for RAW Convict Records:
- Location: `apps/music/`
- Purpose: Standalone music app with releases, artist profiles, SoundCloud integration
- Shares: UI components, design tokens, database client, XP engine, cross-promotions

## Migration Steps (Already Done)

✅ **Step 1:** Created monorepo structure with `apps/` and `packages/` directories

✅ **Step 2:** Moved existing code to `apps/main/`

✅ **Step 3:** Extracted shared code into packages:
  - UI components → `@hotmess/ui`
  - Design tokens → `@hotmess/design-system`
  - Supabase client → `@hotmess/database`
  - Beacon system → `@hotmess/beacons`
  - XP system → `@hotmess/xp-engine`

✅ **Step 4:** Created new packages:
  - `@hotmess/telegram` - Telegram SDK
  - `@hotmess/cross-promotions` - Cross-feature intelligence engine

✅ **Step 5:** Created new music app in `apps/music/`

✅ **Step 6:** Configured Turborepo and pnpm workspaces

✅ **Step 7:** Fixed all build errors and TypeScript issues

✅ **Step 8:** Verified all packages build successfully

## Next Steps (For Team)

### 1. Update Existing Imports

In `apps/main/`, update imports to use the new packages:

```typescript
// Old imports (still work for now but should be updated)
import { Button } from '../components/ui/button';

// New imports (recommended)
import { Button } from '@hotmess/ui';
```

### 2. Use Cross-Promotion Engine

In any app, you can now use the cross-promotion engine:

```typescript
import { crossPromotionEngine } from '@hotmess/cross-promotions';

const context = {
  currentFeature: 'beacon',
  location: { lat: 51.5074, lng: -0.1278 },
  profile: user.profile,
  recentActivity: user.activity,
  timeOfDay: 'night',
  dayOfWeek: 'Friday',
};

const promotion = await crossPromotionEngine.getPromotion(context);
// Display promotion to user
```

### 3. Develop New Features

Create new apps in `apps/` that share the same packages:

```bash
cd apps
mkdir new-feature
cd new-feature
# Copy package.json from apps/music as template
# Add workspace dependencies:
# "@hotmess/ui": "workspace:*"
# "@hotmess/design-system": "workspace:*"
```

### 4. Add to Existing Packages

When adding new shared UI components:

```bash
cd packages/ui/src
# Add your component
# Export it from packages/ui/src/index.ts
```

When adding new design tokens:

```bash
cd packages/design-system/src
# Update tokens.ts or design-tokens.ts
```

## Benefits

### 1. Code Reuse
All apps share the same UI components, design tokens, and business logic through packages.

### 2. Independent Deployment
Each app can be deployed independently:
- Main app: Vercel, Netlify, etc.
- Music app: Separate deployment with own domain

### 3. Cross-Feature Intelligence
The `@hotmess/cross-promotions` package enables smart promotions:
- Beacon scanners see music promotions
- Radio listeners see beacon notifications
- High XP users see shop promotions

### 4. Scalable Development
Teams can work on different apps without conflicts:
- Team A: Main platform features
- Team B: Music app features
- Both: Share packages

### 5. Type Safety
TypeScript paths are configured so imports are type-safe across packages.

## Troubleshooting

### "Cannot find module '@hotmess/...'"

Run `pnpm install` in the root directory to install all workspace dependencies.

### Build errors in packages

Run `pnpm --filter "@hotmess/*" build` to build all packages first.

### Dev server not starting

Make sure you're running commands from the root directory, or use:
```bash
cd apps/main && pnpm dev
```

### Import errors after migration

Check that package.json in your app includes the workspace dependencies:
```json
{
  "dependencies": {
    "@hotmess/ui": "workspace:*",
    "@hotmess/design-system": "workspace:*",
    "@hotmess/database": "workspace:*"
  }
}
```

## Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Monorepo README](./MONOREPO_README.md)
- [Cross-Promotions Package](./packages/cross-promotions/README.md)
- [Design System Package](./packages/design-system/README.md)

## Questions?

Contact the dev team or check the package READMEs for more details.

---

**HOTMESS** — care dressed as kink, built for the men who survived enough to want more.
