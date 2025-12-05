# HOTMESS LONDON — Component Documentation

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Voice:** Masc, sweaty, care-first, kink-with-a-wink

---

## 🔥 Core Interactive Components

### BeaconScanner
**Location:** `/components/BeaconScanner.tsx`

**Purpose:** Full-screen QR code scanning interface with camera simulation and success animations.

**Props:**
- `onScanSuccess: (beaconId: string, xp: number) => void` - Callback when scan succeeds
- `onClose: () => void` - Close the scanner

**States:**
- Scanning (animated QR reticle with scan line)
- Success (green checkmark + XP burst trigger)
- Error (not implemented)

**Animations:**
- Pulsing border during scan
- Moving scan line
- Success checkmark fade-in

**Usage:**
```tsx
<BeaconScanner
  onScanSuccess={(id, xp) => console.log(`Scanned ${id}, earned ${xp} XP`)}
  onClose={() => setOpen(false)}
/>
```

---

### XPParticles
**Location:** `/components/XPParticles.tsx`

**Purpose:** Particle burst animation when XP is earned.

**Props:**
- `amount: number` - XP amount to display
- `onComplete?: () => void` - Callback when animation finishes

**Behavior:**
- Generates 12 random particles
- Center text shows +XP amount with glow
- Particles fly outward with Zap icons
- Auto-completes after 1s

**Usage:**
```tsx
<XPParticles amount={50} onComplete={() => closeModal()} />
```

---

### RadioWaveform
**Location:** `/components/RadioWaveform.tsx`

**Purpose:** Animated waveform visualization for radio player.

**Props:**
- `isPlaying: boolean` - Controls animation state
- `barCount?: number` - Number of bars (default: 32)

**States:**
- Playing: Random height animation (updates every 100ms)
- Paused: Static bars at 20% height

**Colors:** Gradient from hot to heat

**Usage:**
```tsx
<RadioWaveform isPlaying={radioPlaying} barCount={32} />
```

---

### CountdownTimer
**Location:** `/components/CountdownTimer.tsx`

**Purpose:** Live countdown for Drops with urgency states.

**Props:**
- `targetDate: Date` - When countdown ends
- `onComplete?: () => void` - Callback when time expires

**States:**
- Normal: White text
- Urgent (< 1 min): Orange text
- Critical (< 10s): Red text + pulse animation

**Display:** HH:MM:SS format with labels

**Usage:**
```tsx
<CountdownTimer
  targetDate={new Date('2025-12-01T20:00:00')}
  onComplete={() => setDropLive(true)}
/>
```

---

### ProgressBar
**Location:** `/components/ProgressBar.tsx`

**Purpose:** Animated progress indicator with glow effects.

**Props:**
- `current: number` - Current value
- `max: number` - Maximum value
- `label?: string` - Optional label above bar
- `showPercentage?: boolean` - Show % on right
- `color?: 'hot' | 'heat' | 'lime' | 'cyan'` - Color theme
- `size?: 'sm' | 'md' | 'lg'` - Height
- `animated?: boolean` - Pulse animation (default: true)

**Usage:**
```tsx
<ProgressBar
  current={2847}
  max={5000}
  label="Next Level"
  showPercentage
  color="hot"
  size="lg"
/>
```

---

### StatCard
**Location:** `/components/StatCard.tsx`

**Purpose:** Animated stat display with count-up effect.

**Props:**
- `icon: LucideIcon` - Icon component
- `label: string` - Stat name
- `value: number` - Numeric value
- `suffix?: string` - Unit suffix (e.g., "XP", "m")
- `sublabel?: string` - Italic subtext
- `color?: 'hot' | 'heat' | 'lime' | 'cyan' | 'gray'`
- `trend?: 'up' | 'down' | 'neutral'` - Trend arrow
- `trendValue?: string` - Trend label (e.g., "+12%")
- `animate?: boolean` - Count-up animation (default: true)

**Usage:**
```tsx
<StatCard
  icon={Zap}
  label="Total XP"
  value={2847}
  suffix="XP"
  sublabel="earned in sweat."
  color="hot"
  trend="up"
  trendValue="+24%"
/>
```

---

### Badge
**Location:** `/components/Badge.tsx`

**Purpose:** Status indicators, achievement badges, labels.

**Props:**
- `icon?: LucideIcon` - Optional icon
- `label: string` - Badge text
- `variant?: 'default' | 'hot' | 'heat' | 'lime' | 'cyan' | 'locked'`
- `size?: 'sm' | 'md' | 'lg'`
- `pulse?: boolean` - Beacon flare animation

**Usage:**
```tsx
<Badge icon={Zap} label="Live" variant="hot" pulse />
<Badge label="Level 12" variant="lime" size="lg" />
<Badge label="Locked" variant="locked" />
```

---

## 🔥 Loading States

### LoadingSkeleton
**Location:** `/components/LoadingSkeleton.tsx`

**Components:**
- `ProductCardSkeleton` - For shop grid
- `BeaconCardSkeleton` - For map/beacon lists
- `ProfileStatSkeleton` - For profile stats
- `ListItemSkeleton` - For generic lists

**Usage:**
```tsx
{loading ? (
  <ProductCardSkeleton />
) : (
  <ProductCard {...product} />
)}
```

---

## 🔥 Navigation

### Navigation
**Location:** `/components/Navigation.tsx`

**Features:**
- Desktop: Fixed left sidebar
- Mobile: Top bar + slide-out menu
- Active state highlighting
- Icons + labels + subtitles

**Props:**
- `currentPage: string` - Active page ID
- `onNavigate: (page: string) => void` - Page change handler

---

## 🔥 Gates

### AgeGate
**Location:** `/components/AgeGate.tsx`

**Copy:** Token-driven from `design-system/tokens.ts`
- Headline: "Men only. 18+."
- Buttons: ENTER / LEAVE

### ConsentGate
**Location:** `/components/ConsentGate.tsx`

**Copy:** Token-driven
- 4 checkboxes (all must be checked)
- Disabled button until consent given

---

## 🔥 Empty/Error States

### EmptyState
**Location:** `/components/EmptyState.tsx`

**Usage:**
```tsx
<EmptyState
  icon={Package}
  title="Cart empty."
  message="You hesitated."
/>
```

### ErrorState
**Location:** `/components/ErrorState.tsx`

**Usage:**
```tsx
<ErrorState
  title="Something broke."
  message="The servers are sweating. Try again."
  retry={() => fetchData()}
/>
```

### LoadingState
**Location:** `/components/LoadingState.tsx`

**Usage:**
```tsx
<LoadingState message="Loading beacons..." />
```

---

## 🔥 Design Tokens

### Colors
```css
--color-hot: #E70F3C
--color-heat: #FF622D
--color-neon-lime: #B2FF52
--color-cyan-static: #29E2FF
--color-charcoal: #0E0E0F
--color-wet-black: #000000
--color-steel: #9BA1A6
```

### Animations
```css
.beacon-flare - 2s infinite pulse
.xp-spark - 0.6s particle burst
.radio-pulse - 1s waveform pulse
.powder-burst - 1s logo entrance
.hover-glow - hover effect with shadow
.glow-text - pulsing neon text
.wet-texture - liquid chrome overlay
```

### Utility Classes
```css
.neon-border - Red border with glow
.uppercase-track - Uppercase + letter spacing
.chrome-reflect - Liquid shimmer gradient
```

---

## 🔥 Animation Guidelines

**Entrance:**
- Pages: fade-in 0.3s
- Modals: scale + fade 0.4s
- Toasts: slide from top 0.3s

**Exit:**
- Modals: fade 0.2s
- Toasts: slide + fade 0.3s

**Hover:**
- Buttons: 0.3s ease
- Cards: 0.3s ease + glow
- Icons: scale 1.1 (0.2s)

**Loading:**
- Skeletons: pulse
- Spinners: rotate infinite
- Progress: ease-out 0.5s

**Motion Reduction:**
All animations respect `prefers-reduced-motion` and fall back to instant state changes.

---

## 🔥 Accessibility

**Focus States:**
- 2px red outline (`--color-hot`)
- 2px offset
- High contrast

**ARIA:**
- All interactive elements have labels
- Modals use `role="dialog"`
- Live regions for dynamic content

**Keyboard:**
- Tab navigation works everywhere
- Escape closes modals
- Enter/Space activates buttons

**Screen Readers:**
- Descriptive alt text
- Status announcements
- Semantic HTML

---

## 🔥 Responsive Breakpoints

```css
Mobile: 375px - 767px
Tablet: 768px - 1023px
Desktop: 1024px+
Large: 1440px+
```

**Grid:**
- Mobile: 4 columns
- Tablet: 8 columns
- Desktop: 12 columns

---

## 🔥 Component Checklist

Before shipping a new component:

- [ ] Props documented
- [ ] TypeScript types defined
- [ ] Responsive (mobile-first)
- [ ] Accessible (WCAG AA)
- [ ] Tokens used (no hardcoded values)
- [ ] Loading state included
- [ ] Error state included
- [ ] Empty state included
- [ ] Hover effects applied
- [ ] Focus states visible
- [ ] Animations respect motion preferences
- [ ] UX copy from token system

---

**Care dressed as kink. Components built for brotherhood.**
