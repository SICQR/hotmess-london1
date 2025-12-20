# HOTMESS LONDON — Interaction & Animation Guide

**Version:** 1.0.0  
**Philosophy:** Sweaty, immediate, visceral. Every interaction should feel earned.

---

## 🔥 Core Interaction Principles

### 1. **Masculine Feedback**
- Hard, defined edges (not soft blurs)
- Sharp transitions (not floaty easing)
- Immediate response (< 100ms)
- Physical weight to actions

### 2. **Care Through Motion**
- Loading states prevent frustration
- Confirmations before destructive actions
- Clear success/error communication
- Never leave the user guessing

### 3. **Kink Aesthetics**
- Neon glow intensifies on interaction
- Beacon flare = attention pulse
- XP particles = reward dopamine hit
- Chrome shimmer = premium flex

---

## 🔥 Button Interactions

### **Primary Buttons** (Hot Red)

**Default State:**
```css
background: #E70F3C;
border: 2px solid #E70F3C;
box-shadow: 0 0 10px rgba(231, 15, 60, 0.3);
```

**Hover:**
```css
background: #FF622D; /* Heat */
box-shadow: 0 0 30px rgba(231, 15, 60, 0.6);
transform: translateY(-2px);
transition: all 0.3s ease;
```

**Active (Pressed):**
```css
transform: scale(0.98);
transition: transform 0.1s;
```

**Disabled:**
```css
background: #1a1a1a;
color: #666;
cursor: not-allowed;
opacity: 0.5;
```

**Focus (Keyboard):**
```css
outline: 2px solid #E70F3C;
outline-offset: 2px;
```

---

### **Secondary Buttons** (Outline)

**Default:**
```css
background: transparent;
border: 2px solid #E70F3C;
color: #E70F3C;
```

**Hover:**
```css
background: rgba(231, 15, 60, 0.2);
border-color: #FF622D;
color: #FF622D;
```

---

### **Ghost Buttons**

**Default:**
```css
background: transparent;
border: 1px solid rgba(255, 255, 255, 0.2);
color: rgba(255, 255, 255, 0.6);
```

**Hover:**
```css
border-color: rgba(255, 255, 255, 0.4);
color: rgba(255, 255, 255, 1);
```

---

## 🔥 Card Interactions

### **Product/Beacon/Reward Cards**

**Default:**
```css
border: 1px solid rgba(231, 15, 60, 0.3);
transition: all 0.3s ease;
```

**Hover:**
```css
border-color: #E70F3C;
box-shadow: 0 0 30px rgba(231, 15, 60, 0.6);
transform: translateY(-4px);
```

**Active/Selected:**
```css
background: rgba(231, 15, 60, 0.1);
border: 2px solid #E70F3C;
box-shadow: 0 0 40px rgba(231, 15, 60, 0.8);
```

---

## 🔥 Loading States

### **Skeleton Screens**

**Usage:** While fetching data (beacons, products, profile stats)

**Animation:**
```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.6; }
}

animation: skeleton-pulse 2s ease-in-out infinite;
background: #1a1a1a;
```

**Example:**
```tsx
{loading ? (
  <ProductCardSkeleton />
) : (
  <ProductCard {...product} />
)}
```

---

### **Spinners**

**Usage:** Short waits (< 3 seconds), button states

**Styles:**
- Hot red (#E70F3C)
- Smooth rotation
- 24px-48px size depending on context

---

### **Progress Bars**

**Usage:** XP gain, level progress, downloads

**Features:**
- Animated fill (0.5s ease-out)
- Glow effect on progress
- Pulsing when active
- Show percentage + numbers

**Component:** `<ProgressBar />`

---

## 🔥 Page Transitions

### **Page Enter:**
```css
@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

animation: page-enter 0.3s ease-out;
```

### **Page Exit:**
```css
@keyframes page-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

animation: page-exit 0.2s ease-in;
```

---

## 🔥 Modal/Dialog Interactions

### **Modal Enter:**
```css
Backdrop: fade in (0.2s)
Content: scale(0.9) → scale(1) + fade (0.3s)
```

### **Modal Exit:**
```css
Content: scale(1) → scale(0.95) + fade (0.2s)
Backdrop: fade out (0.2s)
```

### **Behavior:**
- Escape key closes
- Click outside closes (with confirmation if form dirty)
- Focus trap (keyboard nav stays inside)
- Return focus to trigger element on close

---

## 🔥 Toast Notifications

### **Enter:**
```css
Slide from top: translateY(-100%) → translateY(0)
Duration: 0.3s ease-out
```

### **Exit:**
```css
Slide up + fade: translateY(0) → translateY(-20px) + opacity 0
Duration: 0.3s ease-in
```

### **Auto-Dismiss:**
- Success: 3s
- Error: 5s
- Info: 4s
- Can be manually dismissed

### **Types:**
```tsx
toast.success("Done. Smooth as sweat.")
toast.error("Something broke. Try again.")
toast.info("Beacon in range...")
```

---

## 🔥 Scroll Interactions

### **Scroll-Triggered Animations**

**Usage:** Feature sections, stat cards on homepage

**Animation:**
```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Stagger:** Each element delays by 0.1s

---

### **Sticky Navigation**

**Desktop:** Fixed left sidebar (always visible)  
**Mobile:** Sticky top bar + hamburger menu

**Scroll Behavior:**
- Nav stays visible at all times
- Active page highlighted
- Smooth scroll to anchors (if applicable)

---

## 🔥 Form Interactions

### **Input Focus:**
```css
border: 2px solid #E70F3C;
box-shadow: 0 0 10px rgba(231, 15, 60, 0.3);
outline: none;
```

### **Input Error:**
```css
border-color: #ff3366;
animation: shake 0.3s;

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
```

### **Input Success:**
```css
border-color: #B2FF52;
```

### **Validation:**
- Real-time for format errors (email, phone)
- On blur for required fields
- On submit for form-level errors

---

## 🔥 Special Animations

### **1. Beacon Flare**

**Usage:** Live indicators, active beacons, hot items

```css
@keyframes beacon-flare {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
}

animation: beacon-flare 2s ease-in-out infinite;
```

**Apply:** `.beacon-flare` class

---

### **2. XP Particle Burst**

**Usage:** When XP is earned

**Behavior:**
- 12 particles spawn at center
- Fly outward in random directions
- Fade out as they move
- Center text counts up + glows

**Component:** `<XPParticles amount={50} />`

---

### **3. Radio Waveform**

**Usage:** Live radio player

**Behavior:**
- 32 bars update every 100ms
- Random heights (20%-100%)
- Gradient from hot to heat
- Pauses at 20% when not playing

**Component:** `<RadioWaveform isPlaying={true} />`

---

### **4. Powder Burst (Logo Enter)**

**Usage:** Homepage hero, splash screens

```css
@keyframes powder-burst {
  0% {
    transform: scale(0.8);
    opacity: 0;
    filter: blur(20px);
  }
  50% {
    opacity: 1;
    filter: blur(0px);
  }
  100% {
    transform: scale(1);
    opacity: 1;
    filter: blur(0px);
  }
}

animation: powder-burst 1s ease-out forwards;
```

---

### **5. Chrome Shimmer**

**Usage:** Premium elements, rewards, VIP badges

```css
@keyframes chrome-shimmer {
  0%, 100% {
    opacity: 0.3;
    transform: translateX(-100%);
  }
  50% {
    opacity: 0.6;
    transform: translateX(100%);
  }
}

animation: chrome-shimmer 3s ease-in-out infinite;
```

**Apply:** `.chrome-reflect` class

---

### **6. Wet Texture Shimmer**

**Usage:** Hero sections, feature cards

```css
.wet-texture::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(...);
  animation: wet-shimmer 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes wet-shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}
```

---

### **7. Glow Pulse Text**

**Usage:** Headlines, hot text, live status

```css
@keyframes pulse-glow {
  0%, 100% {
    text-shadow: 0 0 20px rgba(231, 15, 60, 0.6);
    opacity: 1;
  }
  50% {
    text-shadow: 0 0 40px rgba(231, 15, 60, 0.8),
                 0 0 80px rgba(231, 15, 60, 0.4);
    opacity: 0.9;
  }
}

animation: pulse-glow 3s ease-in-out infinite;
```

**Apply:** `.glow-text` or `.glow-intense`

---

## 🔥 Micro-Interactions

### **Icon Hover:**
```css
transform: scale(1.1);
transition: transform 0.2s ease;
```

### **Badge Pulse (Live indicators):**
```css
animation: beacon-flare 2s infinite;
```

### **Number Count-Up:**
```tsx
// On mount, count from 0 to value over 1s
useEffect(() => {
  // Increment by value/30 every 33ms
}, [value]);
```

### **Image Zoom on Hover:**
```css
img {
  transition: transform 0.5s ease;
}

.card:hover img {
  transform: scale(1.05);
}
```

---

## 🔥 Touch/Mobile Interactions

### **Tap Feedback:**
```css
/* Active state on touch */
:active {
  transform: scale(0.98);
  transition: transform 0.1s;
}
```

### **Swipe Gestures:**
- Mobile menu: Swipe right to open, left to close
- Image galleries: Swipe left/right to navigate
- Dismiss toasts: Swipe up

### **Touch Targets:**
- Minimum 44x44px for all interactive elements
- Adequate spacing between adjacent buttons

---

## 🔥 Keyboard Navigation

### **Tab Order:**
1. Skip to content link (hidden, appears on focus)
2. Navigation items
3. Page content (logical reading order)
4. Footer links

### **Shortcuts:**
- `Escape`: Close modal/drawer
- `Enter`/`Space`: Activate button
- Arrow keys: Navigate radio groups, dropdowns
- `/`: Focus search (if applicable)

---

## 🔥 Accessibility Considerations

### **Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### **Focus Indicators:**
- Always visible
- 2px solid red outline
- 2px offset from element
- High contrast

### **Screen Readers:**
- Loading states announced: `aria-live="polite"`
- Errors announced: `aria-live="assertive"`
- Button states: `aria-disabled`, `aria-pressed`
- Modals: `role="dialog"`, `aria-modal="true"`

---

## 🔥 Performance Guidelines

### **Animation Performance:**
- Use `transform` and `opacity` only (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly (only during animation)

### **Debouncing:**
- Search inputs: 300ms
- Resize events: 150ms
- Scroll events: 100ms

### **Throttling:**
- Scroll listeners: 16ms (60fps)
- Mouse move: 16ms

---

## 🔥 Testing Checklist

Before shipping an interaction:

- [ ] Works with mouse
- [ ] Works with touch
- [ ] Works with keyboard only
- [ ] Focus indicators visible
- [ ] Screen reader announces changes
- [ ] Respects reduced motion preference
- [ ] Performs smoothly (60fps)
- [ ] Feels immediate (< 100ms response)
- [ ] Provides clear feedback
- [ ] Has loading/error/success states

---

**Every interaction earned. Every motion matters. Care dressed as kink.**
