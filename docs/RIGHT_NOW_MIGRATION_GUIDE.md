# RIGHT NOW Membership Gates — Migration Guide

## 🎯 Goal

Replace the old 4-step `RightNowCreateForm` with the new membership-gated `RightNowComposer` that includes safety features, AI suggestions, and dynamic entitlements.

## 📋 Current vs New

### Current (Old)
- **Component:** `RightNowCreateForm` (4-step wizard)
- **Location:** `/components/rightnow/RightNowCreateForm.tsx`
- **Used in:** `/app/right-now/new/page.tsx`
- **Character limit:** Fixed at 120 chars
- **Radius:** No radius control
- **Membership:** Not gated

### New (Membership-Gated)
- **Component:** `RightNowComposer` (single-page form)
- **Location:** `/components/rightnow/RightNowComposer.tsx`
- **Character limit:** 200-600 chars (based on tier)
- **Radius:** 5-25km (based on tier)
- **Membership:** Fully gated with entitlements
- **Features:** AI draft suggestions, boundaries field, safety disclaimer

## 🚀 Migration Steps

### Step 1: Update the Main RIGHT NOW Page

**File:** `/app/right-now/page.tsx`

Option A: Keep existing shell, add composer button
```tsx
import { RightNowShell } from '@/components/rightnow/RightNowShell';
import { RightNowComposer } from '@/components/rightnow/RightNowComposer';

// ... add composer in a modal or side panel
```

Option B: Replace entire page with new layout
```tsx
import RightNowPageWithMembership from '@/pages/RightNowPageWithMembership';

export default function RightNowPage() {
  return <RightNowPageWithMembership />;
}
```

### Step 2: Update the Create Route

**File:** `/app/right-now/new/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  RightNowComposer,
  MembershipTier,
  XpTier,
  RightNowEntitlements,
  RightNowDraftPayload,
} from '@/components/rightnow/RightNowComposer';

const API_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`
  : '';

// TODO: Replace with real user data
function computeEntitlements(
  membership: MembershipTier,
  xpTier: XpTier,
): RightNowEntitlements {
  if (membership === 'icon') {
    return { membership, xpTier, maxPostLength: 600, maxRadiusKm: 25, dailyPostLimit: 20, canAttachMedia: true, canBoost: true };
  }
  if (membership === 'hnh') {
    return { membership, xpTier, maxPostLength: 400, maxRadiusKm: 15, dailyPostLimit: 10, canAttachMedia: true, canBoost: false };
  }
  if (membership === 'vendor' || membership === 'sponsor') {
    return { membership, xpTier, maxPostLength: 500, maxRadiusKm: 20, dailyPostLimit: 30, canAttachMedia: true, canBoost: true };
  }
  return { membership, xpTier, maxPostLength: 200, maxRadiusKm: 5, dailyPostLimit: 3, canAttachMedia: false, canBoost: false };
}

export default function RightNowNewPage() {
  const router = useRouter();
  const [membership, setMembership] = useState<MembershipTier>('free');
  const [xpTier, setXpTier] = useState<XpTier>('fresh');
  const [city, setCity] = useState('London');
  const [country, setCountry] = useState('United Kingdom');
  const [coords, setCoords] = useState({ lat: 51.5074, lng: -0.1278 });

  // TODO: Fetch real user data
  useEffect(() => {
    // Example:
    // const user = await supabase.auth.getUser();
    // const profile = await supabase.from('profiles').select().eq('id', user.id).single();
    // setMembership(profile.membership_tier);
    // setXpTier(calculateXpTier(profile.xp_points));
  }, []);

  const entitlements = computeEntitlements(membership, xpTier);

  async function handleSubmit(payload: RightNowDraftPayload) {
    const res = await fetch(`${API_BASE}/right-now-create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    // Success! Redirect to feed
    router.push('/right-now');
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        <RightNowComposer
          apiBase={API_BASE}
          defaultCity={city}
          defaultCountry={country}
          lat={coords.lat}
          lng={coords.lng}
          entitlements={entitlements}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
```

### Step 3: Deploy the AI Draft Function

**File:** `/supabase/functions/hotmess-right-now-draft/index.ts` (already created)

Deploy it:
```bash
supabase functions deploy hotmess-right-now-draft
```

Test it:
```bash
curl -X POST \
  https://your-project.supabase.co/functions/v1/hotmess-right-now-draft \
  -H "Content-Type: application/json" \
  -d '{
    "city": "London",
    "intent": "hookup",
    "vibe": "At home in SE1, a bit wired, want something easy",
    "xpTier": "fresh",
    "membership": "free"
  }'
```

### Step 4: Update Backend Validation

**File:** `/supabase/functions/right-now-create/index.ts`

Add server-side entitlements enforcement:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

function computeEntitlements(membership: string, xpTier: string) {
  // Same logic as frontend
  if (membership === 'icon') return { maxPostLength: 600, maxRadiusKm: 25, dailyPostLimit: 20 };
  if (membership === 'hnh') return { maxPostLength: 400, maxRadiusKm: 15, dailyPostLimit: 10 };
  return { maxPostLength: 200, maxRadiusKm: 5, dailyPostLimit: 3 };
}

serve(async (req: Request) => {
  try {
    const payload = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    // Get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader?.replace('Bearer ', '')
    );
    
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('membership_tier, xp_points')
      .eq('id', user.id)
      .single();

    const membership = profile?.membership_tier || 'free';
    const xpTier = calculateXpTier(profile?.xp_points || 0);
    const entitlements = computeEntitlements(membership, xpTier);

    // VALIDATE: Post length
    if (payload.text.length > entitlements.maxPostLength) {
      return new Response(
        JSON.stringify({ error: `Post too long. Your ${membership} tier allows max ${entitlements.maxPostLength} chars.` }),
        { status: 400 }
      );
    }

    // VALIDATE: Radius
    const radiusKm = payload.visibility_radius_m / 1000;
    if (radiusKm > entitlements.maxRadiusKm) {
      return new Response(
        JSON.stringify({ error: `Radius too large. Your ${membership} tier allows max ${entitlements.maxRadiusKm}km.` }),
        { status: 400 }
      );
    }

    // VALIDATE: Daily limit
    const { count } = await supabase
      .from('right_now_posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

    if (count && count >= entitlements.dailyPostLimit) {
      return new Response(
        JSON.stringify({ error: `Daily post limit reached (${entitlements.dailyPostLimit} posts). Upgrade for more.` }),
        { status: 429 }
      );
    }

    // Insert post
    const { data, error } = await supabase.from('right_now_posts').insert({
      user_id: user.id,
      intent: payload.intent,
      title: payload.title,
      text: payload.text,
      city: payload.city,
      country: payload.country,
      lat: payload.lat,
      lng: payload.lng,
      room_mode: payload.room_mode,
      crowd_count: payload.crowd_count,
      visibility_radius_m: payload.visibility_radius_m,
    }).select().single();

    if (error) throw error;

    return new Response(JSON.stringify({ post: data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating RIGHT NOW post:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
});
```

### Step 5: Add Membership to Database

**Migration:** `/supabase/migrations/150_membership_tiers.sql`

```sql
-- Add membership_tier to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS membership_tier TEXT DEFAULT 'free'
CHECK (membership_tier IN ('free', 'hnh', 'vendor', 'sponsor', 'icon'));

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_membership_tier 
ON profiles(membership_tier);

-- Add XP tracking (if not exists)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS xp_points INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_profiles_xp_points 
ON profiles(xp_points);
```

Run migration:
```bash
supabase db push
```

## 🎨 Design Checklist

- [x] `.hm-panel` — dark glass panel
- [x] `.hm-label` — tiny uppercase labels
- [x] `.hm-chip` / `.hm-chip-on` / `.hm-chip-off` — filter pills
- [x] `.hm-input` — dark input fields
- [x] `.hm-btn-primary` — white CTA button
- [x] `.hm-btn-secondary` — outline button
- [x] `.text-hotmess-pink` — hot pink accent
- [x] `.hotmess-bg` — black background

All classes are in `/styles/globals.css`.

## 🧪 Testing

### 1. Test UI in Isolation
```bash
npm run dev
# Navigate to /pages/RightNowPageWithMembership.tsx demo
```

### 2. Test Tier Switching
- Switch between FREE → HNH → ICON
- Verify character limits change (200 → 400 → 600)
- Verify radius limits change (5km → 15km → 25km)

### 3. Test AI Drafts
- Enter a vibe
- Click "AI SUGGEST"
- Verify title, text, and safety notes populate

### 4. Test Backend Validation
- Try posting with text longer than tier allows
- Try setting radius larger than tier allows
- Try posting more than daily limit
- Verify all return appropriate error messages

## 🚨 Breaking Changes

### Removed
- ❌ Old 4-step wizard flow (`RightNowCreateForm`)
- ❌ Fixed 120 character limit
- ❌ No location type selection (home/venue/street)

### Added
- ✅ Single-page composer with all options visible
- ✅ Dynamic character limits (200-600)
- ✅ Radius control (5-25km)
- ✅ Boundaries field
- ✅ AI draft suggestions
- ✅ Room mode (solo/duo/small/big)
- ✅ Crowd count
- ✅ Safety disclaimer

### Unchanged
- ✅ Intent selection (hookup, crowd, drop, etc.)
- ✅ TTL (time-to-live) logic
- ✅ XP rewards
- ✅ Panic button
- ✅ Feed display
- ✅ Globe integration

## 📚 Documentation

- **Main Guide:** `/docs/RIGHT_NOW_MEMBERSHIP_GATES.md`
- **This Guide:** `/docs/RIGHT_NOW_MIGRATION_GUIDE.md`
- **Component Code:** `/components/rightnow/RightNowComposer.tsx`
- **Example Page:** `/pages/RightNowPageWithMembership.tsx`
- **AI Function:** `/supabase/functions/hotmess-right-now-draft/index.ts`

## 💡 Tips

1. **Start with the demo page** to understand the flow before modifying production routes
2. **Test locally** with different tier values before deploying backend validation
3. **Add upgrade CTAs** when users hit limits (e.g., "Upgrade to HNH for 400 characters")
4. **Track metrics** on how many users hit each limit type
5. **A/B test** old vs new composer to measure conversion

## ✅ Rollout Plan

### Phase 1: Soft Launch (Week 1)
- Deploy new composer behind feature flag
- Show to 10% of users
- Collect feedback on UX

### Phase 2: Beta (Week 2-3)
- Deploy to all users
- Keep old composer as fallback
- Monitor error rates and completion rates

### Phase 3: Full Launch (Week 4)
- Remove old composer
- Deploy backend validation
- Add upgrade prompts
- Monitor membership conversion

### Phase 4: Optimization (Week 5+)
- A/B test different character limits
- Test AI prompt variations
- Add more intent types based on usage
- Implement media attachments for paid tiers

---

**Questions?** Ping the team or check the main docs.
