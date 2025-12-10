# RIGHT NOW — Membership Gates + Safety + Filters

## 🎯 Overview

This document describes the **membership-gated RIGHT NOW composer** that layers in:

- **Membership tiers** (FREE, HNH, VENDOR, SPONSOR, ICON)
- **XP tiers** (FRESH, REGULAR, SINNER, ICON)
- **Safety-first boundaries** and ground rules
- **AI-powered draft suggestions**
- **Dynamic entitlements** based on user status

## 📦 What's Been Added

### 1. **RightNowComposer Component**
Location: `/components/rightnow/RightNowComposer.tsx`

A new, membership-aware composer that replaces the old step-by-step flow with:
- Intent selection (Hookup, Crowd, Drop, Ticket, Radio, Care)
- Vibe input + AI draft suggestion
- Headline and post text (character limit based on tier)
- Boundaries/ground rules textbox
- Room mode (Solo, Duo, Small, Big)
- Crowd count
- Visibility radius (km, gated by membership)
- Safety disclaimer

### 2. **Entitlements System**
```typescript
export interface RightNowEntitlements {
  membership: MembershipTier;
  xpTier: XpTier;
  maxPostLength: number;
  maxRadiusKm: number;
  dailyPostLimit: number;
  canAttachMedia: boolean;
  canBoost: boolean;
}
```

#### Tier Breakdown

| Tier | Max Chars | Max Radius | Daily Posts | Media | Boost |
|------|-----------|------------|-------------|-------|-------|
| **FREE** | 200 | 5km | 3 | ❌ | ❌ |
| **HNH** | 400 | 15km | 10 | ✅ | ❌ |
| **VENDOR** | 500 | 20km | 30 | ✅ | ✅ |
| **SPONSOR** | 500 | 20km | 30 | ✅ | ✅ |
| **ICON** | 600 | 25km | 20 | ✅ | ✅ |

### 3. **New Utility Classes**
Location: `/styles/globals.css`

Added HOTMESS-compliant utility classes:
- `.hm-btn-primary` — white button with black text
- `.hm-btn-secondary` — transparent button with white border
- `.text-hotmess-pink` — hot pink accent color (#ff1694)
- `.hotmess-bg` — black background, white text

### 4. **Example Integration Page**
Location: `/pages/RightNowPageWithMembership.tsx`

A demo page showing:
- Two-column layout (Composer + Globe)
- Real-time entitlements calculation
- City selection via globe click
- MessConcierge AI widget integration
- Tier switcher for testing (demo only)

## 🔧 How to Use

### Basic Integration

```tsx
import {
  RightNowComposer,
  RightNowEntitlements,
  MembershipTier,
  XpTier,
} from '@/components/rightnow/RightNowComposer';

// Define entitlements based on user's membership
const entitlements: RightNowEntitlements = {
  membership: "hnh",
  xpTier: "regular",
  maxPostLength: 400,
  maxRadiusKm: 15,
  dailyPostLimit: 10,
  canAttachMedia: true,
  canBoost: false,
};

// Handle post submission
async function handleSubmit(payload: RightNowDraftPayload) {
  const res = await fetch(`${apiBase}/right-now-create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
}

// Render composer
<RightNowComposer
  apiBase="https://your-project.supabase.co/functions/v1"
  defaultCity="London"
  defaultCountry="United Kingdom"
  lat={51.5074}
  lng={-0.1278}
  entitlements={entitlements}
  onSubmit={handleSubmit}
/>
```

### Computing Entitlements

```typescript
function computeEntitlements(
  membership: MembershipTier,
  xpTier: XpTier,
): RightNowEntitlements {
  if (membership === "icon") {
    return {
      membership,
      xpTier,
      maxPostLength: 600,
      maxRadiusKm: 25,
      dailyPostLimit: 20,
      canAttachMedia: true,
      canBoost: true,
    };
  }
  
  if (membership === "hnh") {
    return {
      membership,
      xpTier,
      maxPostLength: 400,
      maxRadiusKm: 15,
      dailyPostLimit: 10,
      canAttachMedia: true,
      canBoost: false,
    };
  }
  
  // FREE tier
  return {
    membership,
    xpTier,
    maxPostLength: 200,
    maxRadiusKm: 5,
    dailyPostLimit: 3,
    canAttachMedia: false,
    canBoost: false,
  };
}
```

### Hydrating User Data

Later, replace hard-coded values with real user data from Supabase:

```typescript
// Example: Fetch from Supabase
const { data: profile } = await supabase
  .from('profiles')
  .select('membership_tier, xp_points')
  .eq('id', userId)
  .single();

const membership = profile.membership_tier as MembershipTier;
const xpTier = calculateXpTier(profile.xp_points); // Your XP logic

const entitlements = computeEntitlements(membership, xpTier);
```

## 🛡️ Safety Features

### 1. **Boundaries Field**
Every post includes a "Boundaries / ground rules" text box with default text:
> "Respect boundaries, no pressure, safe fun only."

Users can customize this to set clear expectations.

### 2. **Care Disclaimer**
At the bottom of every composer:
> "Men-only, 18+. Care, not clinic. We show heat and options, not medical or emergency advice. If you feel unsafe, step back and reach out to someone you trust or local services."

### 3. **AI Draft Safety Notes**
When using "AI SUGGEST", the AI can return a `safety_note` that replaces the default boundaries text with context-aware guidance.

## 🤖 AI Draft Integration

### Required Edge Function
You'll need a Supabase Edge Function at:
```
/supabase/functions/hotmess-right-now-draft/index.ts
```

Expected payload:
```json
{
  "city": "London",
  "intent": "hookup",
  "vibe": "At home in SE1, a bit wired, want something easy…",
  "boundaries": "Respect boundaries, no pressure, safe fun only.",
  "xpTier": "fresh",
  "membership": "free"
}
```

Expected response:
```json
{
  "title": "SE1 • Now • Low-key fun",
  "text": "At home in SE1. Little wired, want something chill and easy. No pressure, just vibes. Come through if you're nearby.",
  "safety_note": "Respect boundaries, no pressure, safe fun only. Meet in public first if possible."
}
```

## 🎨 Design System Alignment

All components follow HOTMESS design principles:

### Colors
- Background: `#000000` (black)
- Text: `#ffffff` (white)
- Primary accent: `#FF0080` (hot pink)
- Borders: `rgba(255, 255, 255, 0.1)` to `rgba(255, 255, 255, 0.6)`

### Typography
- Labels: `10px`, `uppercase`, `tracking-[0.32em]`
- Buttons: `12px`, `uppercase`, `tracking-[0.18em]`
- Body: `14px`, `normal case`

### Components
- `.hm-panel` — dark panel with blur and border
- `.hm-label` — tiny uppercase label
- `.hm-chip` — pill-shaped filter button
- `.hm-input` — dark input with subtle border
- `.hm-btn-primary` — white CTA button
- `.hm-btn-secondary` — outline button

## 📊 Server-Side Enforcement (Optional)

For production, mirror the entitlements logic in your backend:

```typescript
// In /supabase/functions/right-now-create/index.ts
const { membership, xpTier } = await getUserProfile(userId);
const entitlements = computeEntitlements(membership, xpTier);

// Validate post
if (payload.text.length > entitlements.maxPostLength) {
  return new Response('Post too long for your tier', { status: 400 });
}

if (payload.visibility_radius_m > entitlements.maxRadiusKm * 1000) {
  return new Response('Radius exceeds your tier limit', { status: 400 });
}

// Check daily limit
const todayCount = await countUserPostsToday(userId);
if (todayCount >= entitlements.dailyPostLimit) {
  return new Response('Daily post limit reached', { status: 429 });
}
```

## 🚀 Next Steps

### Phase 1: Core Wiring (Current)
- ✅ New RightNowComposer component
- ✅ Entitlements types and logic
- ✅ Utility classes
- ✅ Example integration page

### Phase 2: Backend Integration
- [ ] Create `hotmess-right-now-draft` edge function
- [ ] Mirror entitlements logic in `right-now-create` function
- [ ] Add daily post limit tracking in database
- [ ] Implement server-side validation

### Phase 3: Feed Integration
- [ ] Filter feed by membership tier
- [ ] Show boosted posts (for users who canBoost)
- [ ] Render media attachments (for users who canAttachMedia)
- [ ] Add radius visualization on map

### Phase 4: Upgrade Prompts
- [ ] Show upgrade CTAs when users hit limits
- [ ] Create membership comparison modal
- [ ] Add "Upgrade to HNH" flow within composer
- [ ] Track upgrade conversion events

## 📝 Testing the Demo

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the demo page:**
   - Add to your router: `/right-now-pro`
   - Import: `import RightNowPageWithMembership from '@/pages/RightNowPageWithMembership'`

3. **Test tier switching:**
   - Click the tier buttons (FREE, HNH, VENDOR, ICON)
   - Watch character limits, radius limits, and tier labels update
   - Try posting with different tiers

4. **Test AI suggestions** (requires backend):
   - Enter a vibe
   - Click "AI SUGGEST"
   - Watch the title and text populate

## 🎯 Summary

This system gives you:
- **Gated features** that incentivize membership upgrades
- **Safety-first design** with boundaries and disclaimers
- **AI-powered assistance** for better post quality
- **Globe integration** for location-based posting
- **Clean architecture** that's easy to extend

The UI feels like "Grindr-but-better" with HOTMESS's dark neon kink aesthetic, while the backend can enforce limits server-side to prevent abuse.

---

**Questions?** Check the code in:
- `/components/rightnow/RightNowComposer.tsx`
- `/pages/RightNowPageWithMembership.tsx`
- `/styles/globals.css` (utility classes)
