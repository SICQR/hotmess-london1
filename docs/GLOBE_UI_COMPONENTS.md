# 🌍 HOTMESS GLOBE UI COMPONENTS

**Brutalist Design System for 3D Globe Interface**

---

## 🎨 Design Philosophy

**Cockpit-Inspired HUD:** Glass panels, pill-shaped stamps, minimal chrome  
**Monochrome Brutalism:** Near-black backgrounds, subtle white lines, single red accent  
**Production-Ready:** Complete variable system, smooth animations, accessibility

---

## 📦 Component Library

### 1. Base Container

```tsx
<div className="hm-globe-wrap">
  {/* Globe canvas here */}
</div>
```

**Specs:**
- Background: `--hm-ink` (#050505)
- Full width/height
- Overflow hidden

---

### 2. HUD Panels

```tsx
// Standard panel
<div className="hm-panel hm-panel--pad">
  <h3>ACTIVE CITIES</h3>
  <p>12 cities live</p>
</div>

// Tight padding
<div className="hm-panel hm-panel--tight">
  Content
</div>
```

**Specs:**
- Background: `rgba(0,0,0,.68)` with 14px blur
- Border: `1px solid rgba(255,255,255,.22)`
- Border radius: `22px`
- Box shadow: `0 10px 40px rgba(0,0,0,.55)`

---

### 3. Stamps (Labels/Badges)

```tsx
// Basic stamp
<div className="hm-stamp">
  <div className="hm-dot-live"></div>
  LIVE
</div>

// Dimmed stamp
<div className="hm-stamp hm-stamp--dim">
  OFFLINE
</div>

// Live stamp
<div className="hm-stamp hm-stamp--live">
  <div className="hm-dot-live"></div>
  145 SCANS
</div>
```

**Specs:**
- Font size: `10px`
- Letter spacing: `.28em`
- UPPERCASE
- Pill-shaped (`999px` border radius)
- Live dot: 6px with red glow

---

### 4. Buttons

```tsx
// Standard button
<button className="hm-btn">
  TOGGLE HEAT
</button>

// Primary button
<button className="hm-btn hm-btn--primary">
  CONFIRM
</button>

// Danger button
<button className="hm-btn hm-btn--danger">
  DELETE
</button>

// Active state (toggle)
<button className="hm-btn" aria-pressed="true">
  ACTIVE
</button>
```

**Specs:**
- Font size: `12px`
- Letter spacing: `.20em`
- UPPERCASE
- Smooth scale on hover (1.02x)
- Scale down on click (.98x)

---

### 5. Filter Chips

```tsx
<div className="hm-chiprow">
  <button className="hm-chip" aria-pressed="true">
    ALL
  </button>
  <button className="hm-chip">
    CLUBS
  </button>
  <button className="hm-chip">
    BARS
  </button>
  <button className="hm-chip">
    SAUNAS
  </button>
</div>
```

**Specs:**
- Font size: `11px`
- Letter spacing: `.20em`
- UPPERCASE
- Pill-shaped
- Active state: bright border + background

---

### 6. Search Input

```tsx
<input 
  type="text" 
  className="hm-search" 
  placeholder="Search cities..."
/>
```

**Specs:**
- Placeholder: Uppercase, letter-spacing `.18em`
- Focus: Brightened border + subtle shadow
- Border radius: `14px`

---

### 7. Timebar (Scrubber)

```tsx
<div className="hm-timebar">
  <span style={{ fontSize: '10px', letterSpacing: '.28em' }}>
    00:00
  </span>
  <input 
    type="range" 
    className="hm-scrub" 
    min="0" 
    max="24" 
    step="0.5"
  />
  <span style={{ fontSize: '10px', letterSpacing: '.28em' }}>
    24:00
  </span>
</div>
```

**Specs:**
- Grid layout: `auto 1fr auto`
- Positioned at bottom
- Custom styled range slider
- 14px blur backdrop

---

### 8. Drawer (Side Panel)

```tsx
<div className="hm-drawer">
  <h3>FILTERS</h3>
  
  <div className="hm-row">
    <button className="hm-chip">LONDON</button>
    <button className="hm-chip">BERLIN</button>
    <button className="hm-chip">NYC</button>
  </div>
  
  <input 
    type="text" 
    className="hm-search" 
    placeholder="Search..."
  />
  
  <p className="hm-copy">
    Filter beacons by city, type, or activity level.
  </p>
</div>
```

**Specs:**
- Max width: `420px`
- Positioned top-right
- Scrollable
- Dark glass background

---

### 9. City Labels (3D Globe Markers)

```tsx
<div className="hm-city-stamp">
  <div className="hm-city-pill">
    <div className="hm-city-dot"></div>
    <span className="hm-city-name">LONDON</span>
  </div>
</div>

// Active city
<div className="hm-city-stamp">
  <div className="hm-city-pill hm-city-pill--active">
    <div className="hm-city-dot hm-city-dot--active"></div>
    <span className="hm-city-name">LONDON</span>
  </div>
</div>
```

**Specs:**
- Transform: `translate(-50%, -50%)`
- Pointer events: `auto`
- Active state: Red border + red dot glow
- Hover: Brighter border

---

### 10. Layer Toggles

```tsx
<div className="hm-toggles">
  <button className="hm-btn" aria-pressed="true">
    HEAT
  </button>
  <button className="hm-btn">
    BEACONS
  </button>
  <button className="hm-btn">
    TRAILS
  </button>
</div>
```

**Specs:**
- Positioned top-right
- Vertical stack
- 8px gap

---

### 11. HUD Stats

```tsx
<div className="hm-hud">
  <div className="hm-panel hm-panel--pad">
    <div className="hm-stamp hm-stamp--dim">
      ACTIVE CITIES
    </div>
    <div style={{ 
      fontSize: '32px', 
      fontWeight: 900, 
      color: 'var(--hm-white)',
      marginTop: '8px' 
    }}>
      12
    </div>
  </div>
</div>
```

**Specs:**
- Positioned top-left
- Min width: `180px`
- z-index: 10

---

## 🎨 CSS Variables Reference

### Colors

```css
--hm-ink: #050505;              /* Background */
--hm-coal: #111111;             /* Panels */
--hm-coal2: #1a1a1a;            /* Land plate */
--hm-ash: rgba(255,255,255,.08);
--hm-line: rgba(255,255,255,.22);
--hm-line-strong: rgba(255,255,255,.45);
--hm-text: rgba(255,255,255,.92);
--hm-text-dim: rgba(255,255,255,.68);
--hm-white: #ffffff;
--hm-live: #ff1744;             /* Red accent */
```

### Glass/Blur

```css
--hm-glass: rgba(0,0,0,.68);
--hm-glass2: rgba(0,0,0,.84);
--hm-blur: 14px;
```

### Radius

```css
--hm-r-xl: 22px;                /* Panels */
--hm-r-pill: 999px;             /* Buttons/stamps */
```

### Typography

```css
--hm-stamp-size: 10px;
--hm-stamp-track: .28em;
--hm-body-size: 14px;
```

### Motion

```css
--hm-ease: cubic-bezier(.22,1,.36,1);
--hm-fast: 220ms;
--hm-med: 320ms;
```

---

## 🎯 Complete Example

```tsx
function GlobeInterface() {
  const [showHeat, setShowHeat] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <div className="hm-globe-wrap">
      {/* 3D Globe Canvas */}
      <canvas ref={canvasRef} />

      {/* HUD - Top Left */}
      <div className="hm-hud">
        <div className="hm-panel hm-panel--pad">
          <div className="hm-stamp hm-stamp--live">
            <div className="hm-dot-live"></div>
            LIVE
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 900, 
            marginTop: '8px',
            color: 'var(--hm-white)'
          }}>
            12
          </div>
          <div style={{ 
            fontSize: '10px', 
            letterSpacing: '.28em',
            textTransform: 'uppercase',
            color: 'var(--hm-text-dim)',
            marginTop: '4px'
          }}>
            CITIES
          </div>
        </div>
      </div>

      {/* Layer Toggles - Top Right */}
      <div className="hm-toggles">
        <button 
          className="hm-btn" 
          aria-pressed={showHeat}
          onClick={() => setShowHeat(!showHeat)}
        >
          HEAT
        </button>
        <button className="hm-btn">
          BEACONS
        </button>
      </div>

      {/* Drawer - Right Side */}
      {selectedCity && (
        <div className="hm-drawer">
          <h3>{selectedCity.name}</h3>
          
          <div className="hm-stamp hm-stamp--live">
            <div className="hm-dot-live"></div>
            {selectedCity.scans} SCANS
          </div>

          <div className="hm-chiprow">
            <button className="hm-chip" aria-pressed="true">
              TONIGHT
            </button>
            <button className="hm-chip">
              WEEKEND
            </button>
            <button className="hm-chip">
              MONTH
            </button>
          </div>

          <input 
            type="text" 
            className="hm-search" 
            placeholder="Search venues..."
          />

          <p className="hm-copy">
            {selectedCity.venueCount} venues active in {selectedCity.name}
          </p>
        </div>
      )}

      {/* Timebar - Bottom */}
      <div className="hm-timebar">
        <span style={{ fontSize: '10px', letterSpacing: '.28em' }}>
          NOW
        </span>
        <input 
          type="range" 
          className="hm-scrub" 
          min="0" 
          max="24" 
          step="0.5"
        />
        <span style={{ fontSize: '10px', letterSpacing: '.28em' }}>
          +24H
        </span>
      </div>
    </div>
  );
}
```

---

## 🎨 Design Principles

### 1. **Minimal Chrome**
- Use glass panels sparingly
- Only 1-2 overlays visible at once
- Prefer HUD corners over center overlays

### 2. **Uppercase Typography**
- All UI text is UPPERCASE
- Generous letter-spacing (.18em - .28em)
- Small sizes (10px - 12px)

### 3. **Single Accent Color**
- Only use red (`--hm-live`) for:
  - Live indicators
  - Active states
  - Danger actions
- Everything else is monochrome

### 4. **Smooth Interactions**
- All buttons scale on hover/click
- Use `--hm-ease` for natural motion
- 220ms transitions for instant feel

### 5. **Glass Effects**
- 14px blur backdrop
- Dark glass (68-84% opacity black)
- Subtle white borders (22% opacity)

---

## ✅ Do's and Don'ts

### ✅ DO

```tsx
// Use brutalist stamps
<div className="hm-stamp">LONDON</div>

// Use pill-shaped buttons
<button className="hm-btn">FILTER</button>

// Use monochrome colors
style={{ color: 'var(--hm-text-dim)' }}

// Use uppercase text
<span>ACTIVE CITIES</span>
```

### ❌ DON'T

```tsx
// Don't use rounded corners (except pills)
<div style={{ borderRadius: '8px' }}>...</div>

// Don't use multiple colors
<span style={{ color: '#00E5FF' }}>...</span>

// Don't use lowercase UI text
<span>Active Cities</span>

// Don't use heavy fonts
style={{ fontWeight: 900 }}  // Only for large numbers
```

---

## 📱 Responsive Behavior

```tsx
// Mobile: Drawer becomes full-width bottom sheet
@media (max-width: 640px) {
  .hm-drawer {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 60vh;
    border-radius: 22px 22px 0 0;
  }
}
```

---

## 🚀 Performance Tips

1. **Use `will-change` sparingly**
   ```css
   .hm-city-stamp {
     will-change: transform, opacity;
   }
   ```

2. **Batch DOM updates**
   - Update all city labels in one pass
   - Use `requestAnimationFrame`

3. **Optimize blur**
   - Only apply to visible panels
   - Use `backdrop-filter: none` when hidden

4. **Minimize repaints**
   - Animate transform/opacity only
   - Avoid animating width/height

---

**Built with 🖤 • Production-Ready Brutalist Globe System**

**Last Updated:** December 8, 2025  
**Version:** 1.0.0  
**Status:** ✅ Complete
