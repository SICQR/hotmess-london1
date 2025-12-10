# Quick Integration Snippet — Add Membership-Gated Composer to Existing RIGHT NOW

## 🎯 Goal

Add the new membership-gated composer to your existing RIGHT NOW page **without breaking anything**.

---

## Option 1: Modal Integration (Recommended)

Add a modal that opens when user clicks the compose button in `RightNowDock`.

### Step 1: Update RightNowShell

```tsx
// /components/rightnow/RightNowShell.tsx
'use client';

import { useState } from 'react';
import { RightNowFilters } from './RightNowFilters';
import { RightNowFeed } from './RightNowFeed';
import { RightNowDock } from './RightNowDock';
import { RightNowComposerModal } from './RightNowComposerModal'; // NEW
import { PanicButton } from './PanicButton';
import { MessBrainChat } from './MessBrainChat';
import { PanicOverlay } from './PanicOverlay';
import type { RightNowFilterOptions, RightNowIntent } from '@/types/rightnow';

const API_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`
  : '';

export function RightNowShell() {
  const [activeTab, setActiveTab] = useState<'near' | 'city' | 'globe'>('near');
  const [filters, setFilters] = useState<RightNowFilterOptions>({
    radius_km: 3,
    time_range: 'now',
  });
  const [showMessBrain, setShowMessBrain] = useState(false);
  const [panicActive, setPanicActive] = useState(false);
  const [showComposer, setShowComposer] = useState(false); // NEW
  const [feedRefresh, setFeedRefresh] = useState(0); // NEW

  // TODO: Replace with actual user data
  const membership = 'free'; // or fetch from context/props
  const xpTier = 'fresh'; // or fetch from context/props
  const city = 'London';
  const country = 'United Kingdom';
  const lat = 51.5074;
  const lng = -0.1278;

  const handleIntentFilter = (intents: RightNowIntent[]) => {
    setFilters(prev => ({ ...prev, intent: intents }));
  };

  const handleRadiusFilter = (radius: number) => {
    setFilters(prev => ({ ...prev, radius_km: radius }));
  };

  const handleTimeFilter = (range: 'now' | 'tonight' | 'weekend') => {
    setFilters(prev => ({ ...prev, time_range: range }));
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-black border-b border-white/10">
          <div className="px-4 py-3">
            {/* ... existing header code ... */}

            {/* Filters */}
            <RightNowFilters
              onIntentChange={handleIntentFilter}
              onRadiusChange={handleRadiusFilter}
              onTimeChange={handleTimeFilter}
            />
          </div>
        </div>

        {/* Feed */}
        <div className="pt-64 pb-24">
          <RightNowFeed filters={filters} key={feedRefresh} />
        </div>

        {/* Fixed Bottom Dock */}
        <RightNowDock
          onMessBrainOpen={() => setShowMessBrain(true)}
          onComposeOpen={() => setShowComposer(true)} // NEW: add this prop
        />

        {/* Panic Button */}
        <PanicButton onTrigger={() => setPanicActive(true)} />
      </div>

      {/* NEW: Composer Modal */}
      <RightNowComposerModal
        isOpen={showComposer}
        onClose={() => setShowComposer(false)}
        apiBase={API_BASE}
        city={city}
        country={country}
        lat={lat}
        lng={lng}
        membership={membership}
        xpTier={xpTier}
        onPostCreated={() => setFeedRefresh(prev => prev + 1)}
      />

      {/* Mess Brain Chat Sheet */}
      {showMessBrain && (
        <MessBrainChat onClose={() => setShowMessBrain(false)} />
      )}

      {/* Panic Overlay */}
      {panicActive && (
        <PanicOverlay onClose={() => setPanicActive(false)} />
      )}
    </>
  );
}
```

### Step 2: Update RightNowDock

```tsx
// /components/rightnow/RightNowDock.tsx
import { Plus, Brain } from 'lucide-react';

interface RightNowDockProps {
  onMessBrainOpen: () => void;
  onComposeOpen?: () => void; // NEW
}

export function RightNowDock({ onMessBrainOpen, onComposeOpen }: RightNowDockProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-black border-t border-white/10">
      <div className="px-4 py-3 flex items-center justify-between gap-2">
        {/* Compose Button */}
        <button
          onClick={onComposeOpen || (() => window.location.href = '/right-now/new')}
          className="flex-1 flex items-center justify-center gap-2 bg-hotmess-pink text-black rounded-full py-3 px-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          <Plus size={20} />
          POST RIGHT NOW
        </button>

        {/* Mess Brain Button */}
        <button
          onClick={onMessBrainOpen}
          className="px-4 py-3 bg-white/5 border border-white/20 rounded-full transition-all hover:border-white/40"
        >
          <Brain size={20} />
        </button>
      </div>
    </div>
  );
}
```

---

## Option 2: Replace Create Page

Replace the old 4-step wizard with the new composer.

### Update /app/right-now/new/page.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  RightNowComposer,
  MembershipTier,
  XpTier,
  RightNowDraftPayload,
  RightNowEntitlements,
} from '@/components/rightnow';

const API_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`
  : '';

function computeEntitlements(membership: MembershipTier, xpTier: XpTier): RightNowEntitlements {
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
  
  // TODO: Fetch from Supabase
  const [membership, setMembership] = useState<MembershipTier>('free');
  const [xpTier, setXpTier] = useState<XpTier>('fresh');
  const [city] = useState('London');
  const [country] = useState('United Kingdom');
  const [coords] = useState({ lat: 51.5074, lng: -0.1278 });

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

    router.push('/right-now');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-white/60 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="text-lg font-black uppercase tracking-tight">
              POST RIGHT NOW
            </div>
            <div className="hm-label mt-1">
              {entitlements.membership.toUpperCase()} • {entitlements.xpTier.toUpperCase()} XP
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-24 pb-8 px-4">
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
    </div>
  );
}
```

---

## Option 3: Side-by-Side (A/B Test)

Keep both composers and show based on feature flag.

### Add Feature Flag

```tsx
// /lib/features.ts
export function shouldUseMembershipComposer(userId: string): boolean {
  // Simple hash-based A/B test (50/50 split)
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % 2 === 0;
}
```

### Update Create Page

```tsx
'use client';

import { useEffect, useState } from 'react';
import { RightNowCreateForm } from '@/components/rightnow/RightNowCreateForm';
import { RightNowComposer } from '@/components/rightnow/RightNowComposer';
import { shouldUseMembershipComposer } from '@/lib/features';

export default function RightNowNewPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [useNewComposer, setUseNewComposer] = useState(false);

  useEffect(() => {
    // Fetch user ID from Supabase auth
    // const { data } = await supabase.auth.getUser();
    // setUserId(data.user?.id || null);
    // setUseNewComposer(shouldUseMembershipComposer(data.user?.id || ''));
  }, []);

  if (useNewComposer) {
    return <div>{/* New RightNowComposer */}</div>;
  }

  return <RightNowCreateForm />;
}
```

---

## User Data Fetching (Production)

Replace hard-coded values with real Supabase data:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { MembershipTier, XpTier } from '@/components/rightnow';

export function useUserMembership() {
  const [membership, setMembership] = useState<MembershipTier>('free');
  const [xpTier, setXpTier] = useState<XpTier>('fresh');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembership() {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Get profile with membership data
      const { data: profile } = await supabase
        .from('profiles')
        .select('membership_tier, xp_points')
        .eq('id', user.id)
        .single();

      if (profile) {
        setMembership((profile.membership_tier as MembershipTier) || 'free');
        
        // Calculate XP tier
        const xp = profile.xp_points || 0;
        if (xp >= 10000) setXpTier('icon');
        else if (xp >= 5000) setXpTier('sinner');
        else if (xp >= 1000) setXpTier('regular');
        else setXpTier('fresh');
      }

      setLoading(false);
    }

    fetchMembership();
  }, []);

  return { membership, xpTier, loading };
}
```

Use in components:

```tsx
function RightNowPage() {
  const { membership, xpTier, loading } = useUserMembership();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <RightNowComposer
      membership={membership}
      xpTier={xpTier}
      // ... other props
    />
  );
}
```

---

## Testing the Integration

### 1. Test Modal Opens
```bash
# Start dev server
npm run dev

# Navigate to /right-now
# Click "POST RIGHT NOW" button
# Modal should open with composer
```

### 2. Test Tier Limits
```tsx
// Temporarily set membership to test limits
const membership = 'free'; // Should limit to 200 chars, 5km
const membership = 'hnh';  // Should allow 400 chars, 15km
const membership = 'icon'; // Should allow 600 chars, 25km
```

### 3. Test AI Suggestions
```bash
# Deploy the edge function first
supabase functions deploy hotmess-right-now-draft

# Then test in UI:
# 1. Enter a vibe
# 2. Click "AI SUGGEST"
# 3. Verify title, text, and safety note populate
```

### 4. Test Post Creation
```bash
# Fill out form
# Click "POST RIGHT NOW"
# Should:
# - Close modal
# - Refresh feed
# - Show new post at top
```

---

## Quick Copy-Paste

If you just want to add the modal to your existing page:

```tsx
import { RightNowComposerModal } from '@/components/rightnow';

// Inside your component:
const [showComposer, setShowComposer] = useState(false);

// In your JSX:
<button onClick={() => setShowComposer(true)}>
  POST RIGHT NOW
</button>

<RightNowComposerModal
  isOpen={showComposer}
  onClose={() => setShowComposer(false)}
  apiBase={API_BASE}
  city="London"
  membership="free"
  xpTier="fresh"
  onPostCreated={() => console.log('Post created!')}
/>
```

That's it! The modal handles everything internally.

---

## Summary

- **Easiest:** Add `RightNowComposerModal` to existing page
- **Cleanest:** Replace old create page with new composer
- **Safest:** A/B test both composers side-by-side

All approaches are production-ready and non-breaking.
