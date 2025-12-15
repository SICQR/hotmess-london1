# 🎨 HOTMESS LONDON — DESIGN SYSTEM

**Dark Neon Kink Aesthetic • Brutalist Luxury • Care-First Principles**

---

## 📋 Table of Contents

1. [Brand Identity](#brand-identity)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Components](#components)
5. [Spacing & Layout](#spacing--layout)
6. [Animations](#animations)
7. [Usage Examples](#usage-examples)
8. [Do's and Don'ts](#dos-and-donts)

---

## 🎯 Brand Identity

### Core Principles

1. **Dark Neon Kink Aesthetic**
   - Black backgrounds with hot pink accents
   - High contrast for readability
   - Unapologetic, bold, sexy

2. **Brutalist Luxury**
   - Sharp edges, no rounded corners (except where functional)
   - Minimal decoration, maximum impact
   - Editorial typography with tight tracking

3. **Care-First Design**
   - Accessible to all users
   - Clear hierarchy and navigation
   - Safety information always visible

---

## 🎨 Color Palette

### Primary Colors

```css
--color-hot: #FF0080;              /* HOTMESS Hot Pink */
--color-hot-bright: #FF1694;       /* Bright Hot Pink */
--color-hot-dark: #E70F3C;         /* Deep Hot Pink/Red */
--color-black: #000000;            /* Pure Black */
--color-white: #ffffff;            /* Pure White */
```

**Usage:**
- `--color-hot` - Primary brand color, CTAs, links
- `--color-hot-bright` - Hover states, highlights
- `--color-hot-dark` - Danger states, urgent alerts
- `--color-black` - All backgrounds
- `--color-white` - All text

### Semantic Colors

```css
--color-success: #00C853;          /* Green */
--color-warning: #FFD600;          /* Yellow */
--color-danger: #FF1744;           /* Red */
--color-info: #00E5FF;             /* Cyan */
--color-purple: #7C4DFF;           /* Purple */
```

### Monochrome Scale

```css
--color-mono-950: #0a0a0a;         /* Near black */
--color-mono-900: #171717;         /* Very dark gray */
--color-mono-800: #262626;         /* Dark gray */
--color-mono-700: #404040;         /* Medium-dark gray */
--color-mono-600: #525252;         /* Medium gray */
--color-mono-500: #737373;         /* Mid gray */
--color-mono-400: #a3a3a3;         /* Light-medium gray */
--color-mono-300: #d4d4d4;         /* Light gray */
--color-mono-200: #e5e5e5;         /* Very light gray */
--color-mono-100: #f5f5f5;         /* Near white */
```

### Beacon Type Colors

```css
--color-beacon-checkin: #FF1744;   /* Red */
--color-beacon-drop: #FF10F0;      /* Magenta */
--color-beacon-event: #00E5FF;     /* Cyan */
--color-beacon-product: #FFD600;   /* Yellow */
--color-beacon-vendor: #7C4DFF;    /* Purple */
--color-beacon-chat: #00C853;      /* Green */
--color-beacon-reward: #FF6E40;    /* Orange */
--color-beacon-sponsor: #FFC107;   /* Amber */
--color-beacon-ticket: #00BCD4;    /* Teal */
```

### Color Usage Examples

```tsx
// Primary button
<button className="bg-hot text-black">BUY TICKETS</button>

// Secondary button
<button className="bg-transparent border border-brutal text-white">LEARN MORE</button>

// Danger button
<button className="bg-hot-dark text-white">DELETE</button>

// Success state
<div className="text-success">Payment confirmed</div>

// Beacon marker
<div className="bg-beacon-checkin">Check-in</div>
```

---

## 📝 Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 
             'SF Pro Display', 'SF Pro Text', 
             'Helvetica Neue', Arial, sans-serif;
```

### Hierarchy

| Element | Size | Weight | Letter Spacing | Transform | Use Case |
|---------|------|--------|----------------|-----------|----------|
| `h1` | 72px | 900 | -0.04em | UPPERCASE | Hero sections |
| `h2` | 48px | 700 | -0.03em | UPPERCASE | Page sections |
| `h3` | 32px | 700 | -0.02em | - | Subsections |
| `h4` | 24px | 600 | -0.01em | - | Card headers |
| `h5` | 18px | 600 | 0 | - | Small headers |
| `h6` | 16px | 600 | 0 | - | Micro headers |
| `p` | 16px | 400 | -0.01em | - | Body text |

### Typography Utilities

```css
.text-display      /* 900 weight, -0.04em tracking, UPPERCASE */
.text-heading      /* 700 weight, -0.02em tracking, UPPERCASE */
.text-label        /* 12px, 700 weight, 0.1em tracking, UPPERCASE */
.text-body         /* 16px, 400 weight, 1.6 line-height */
.text-small        /* 14px, 400 weight */
.text-xs           /* 12px, 400 weight */
```

### ⚠️ IMPORTANT: No Tailwind Text Classes

**DO NOT USE:** `text-lg`, `text-xl`, `text-2xl`, `font-bold`, `font-semibold`, etc.

**ALWAYS USE:** Inline styles with specific values

```tsx
// ❌ WRONG
<h1 className="text-4xl font-bold">HOTMESS</h1>

// ✅ CORRECT
<h1 style={{ fontSize: '72px', fontWeight: 900 }}>HOTMESS</h1>

// ✅ ALSO CORRECT
<h1>HOTMESS</h1> {/* Uses default h1 styles from globals.css */}
```

### Typography Examples

```tsx
// Hero display
<h1 className="text-display glow-text">
  HOTMESS LONDON
</h1>

// Section header
<h2 className="text-heading text-hot">
  TONIGHT'S EVENTS
</h2>

// Label
<span className="text-label text-white/60">
  BEACON TYPE
</span>

// Body text
<p className="text-body text-white/80">
  Your consent-first hookup platform for gay men 18+
</p>
```

---

## 🧩 Components

### Buttons

```tsx
// Primary button
<button className="btn btn-primary">
  BUY TICKETS
</button>

// Secondary button
<button className="btn btn-secondary">
  LEARN MORE
</button>

// Danger button
<button className="btn btn-danger">
  DELETE
</button>

// Ghost button
<button className="btn btn-ghost">
  CANCEL
</button>

// Small button
<button className="btn btn-primary btn-sm">
  CONFIRM
</button>

// Large button
<button className="btn btn-primary btn-lg">
  GET STARTED
</button>
```

**Button Classes:**
- `.btn` - Base button styles
- `.btn-primary` - Hot pink background, black text
- `.btn-secondary` - Transparent background, white text, border
- `.btn-danger` - Red background, white text
- `.btn-ghost` - No background, subtle text
- `.btn-sm` - Small size
- `.btn-lg` - Large size
- `.btn-disabled` - Disabled state

### Cards

```tsx
// Basic card
<div className="card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

// Hoverable card
<div className="card card-hover">
  <h3>Hover me</h3>
</div>

// Card with glow
<div className="card card-glow">
  <h3>Glowing card</h3>
</div>
```

**Card Classes:**
- `.card` - Base card with glass effect
- `.card-hover` - Lift effect on hover
- `.card-glow` - Hot pink glow on hover

### Inputs

```tsx
// Text input
<input 
  type="text" 
  className="input" 
  placeholder="Enter your email..."
/>

// Textarea
<textarea 
  className="input" 
  rows={4}
  placeholder="Message..."
/>

// Disabled input
<input 
  type="text" 
  className="input" 
  disabled
/>
```

### Badges

```tsx
// Hot pink badge
<span className="badge badge-hot">NEW</span>

// Cyan badge
<span className="badge badge-new">BETA</span>

// Pulsing live badge
<span className="badge badge-live">LIVE</span>

// PRO badge
<span className="badge badge-pro">PRO</span>

// ELITE badge
<span className="badge badge-elite">ELITE</span>
```

### Glass Morphism

```tsx
// Light glass effect
<div className="glass p-6">
  <p>Content with glass background</p>
</div>

// Strong glass effect
<div className="glass-strong p-6">
  <p>Stronger glass effect</p>
</div>

// Hot pink glass
<div className="glass-hot p-6">
  <p>Hot pink tinted glass</p>
</div>
```

### Neon Glow

```tsx
// Glow around element
<div className="glow-hot p-6">
  <p>Glowing container</p>
</div>

// Strong glow
<div className="glow-hot-strong p-6">
  <p>Intense glow</p>
</div>

// Glowing text
<h1 className="glow-text">HOTMESS</h1>
```

### Borders

```tsx
// Subtle border
<div className="border border-brutal p-4">
  Content
</div>

// Strong border
<div className="border border-brutal-strong p-4">
  Content
</div>

// Hot pink border
<div className="border border-hot p-4">
  Content
</div>

// Neon border
<div className="neon-border p-4">
  Neon glow border
</div>
```

---

## 📐 Spacing & Layout

### Spacing Scale

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 96px;
```

### Layout Classes

```tsx
// Editorial section padding
<section className="editorial-section">
  <h2>Section Title</h2>
  <p>Content with editorial margins</p>
</section>

// Narrow container
<div className="container-narrow">
  <p>Max width 800px, centered</p>
</div>

// Wide container
<div className="container-wide">
  <p>Max width 1400px, centered</p>
</div>

// Divider
<div className="divider" />

// Vertical divider
<div className="divider-vertical" />
```

### Responsive Breakpoints

```css
/* Mobile: < 640px */
/* Default styles */

/* Tablet: 640px - 1024px */
@media (min-width: 640px) { ... }

/* Desktop: > 1024px */
@media (min-width: 1024px) { ... }
```

---

## 🎬 Animations

### Animation Classes

```tsx
// Fade in from bottom
<div className="fade-in">
  <p>Fades in on load</p>
</div>

// Slide up
<div className="slide-up">
  <p>Slides up on load</p>
</div>

// Pulse (for LIVE badges)
<span className="pulse">LIVE</span>

// Spin (for loading)
<div className="spin">↻</div>
```

### Hover Effects

```tsx
// Lift on hover
<div className="hover-lift">
  Lifts 2px on hover
</div>

// Scale on hover
<div className="hover-scale">
  Scales to 102% on hover
</div>

// Glow on hover
<div className="hover-glow">
  Glows on hover
</div>
```

### Interactive States

```tsx
// Clickable element
<div className="clickable">
  Scales down on click
</div>

// Disabled element
<button className="disabled">
  Cannot be clicked
</button>
```

---

## 💡 Usage Examples

### Page Header

```tsx
<header className="editorial-section py-12 border-b border-brutal">
  <h1 className="text-display glow-text mb-4">
    HOTMESS LONDON
  </h1>
  <p className="text-body text-white/60 max-w-2xl">
    Your consent-first hookup platform for gay men 18+
  </p>
</header>
```

### Event Card

```tsx
<div className="card card-hover">
  <div className="flex items-center justify-between mb-3">
    <span className="badge badge-live">LIVE</span>
    <span className="text-label text-white/40">TONIGHT</span>
  </div>
  
  <h3 className="text-heading text-hot mb-2">
    HOTMESS MAIN FLOOR
  </h3>
  
  <p className="text-body text-white/60 mb-4">
    Heaven Nightclub • 22:00 - 04:00
  </p>
  
  <button className="btn btn-primary w-full">
    GET TICKETS
  </button>
</div>
```

### Form

```tsx
<form className="space-y-4">
  <div>
    <label className="text-label text-white/60 mb-2 block">
      EMAIL ADDRESS
    </label>
    <input 
      type="email" 
      className="input" 
      placeholder="your@email.com"
    />
  </div>
  
  <div>
    <label className="text-label text-white/60 mb-2 block">
      MESSAGE
    </label>
    <textarea 
      className="input" 
      rows={4}
      placeholder="Your message..."
    />
  </div>
  
  <button className="btn btn-primary w-full">
    SEND MESSAGE
  </button>
</form>
```

### Stats Dashboard

```tsx
<div className="grid grid-cols-3 gap-6">
  <div className="card text-center">
    <div className="text-4xl text-hot mb-2" style={{ fontWeight: 900 }}>
      2.8K
    </div>
    <div className="text-label text-white/40">
      TOTAL XP
    </div>
  </div>
  
  <div className="card text-center">
    <div className="text-4xl text-white mb-2" style={{ fontWeight: 900 }}>
      12
    </div>
    <div className="text-label text-white/40">
      LEVEL
    </div>
  </div>
  
  <div className="card text-center">
    <div className="text-4xl text-white mb-2" style={{ fontWeight: 900 }}>
      7
    </div>
    <div className="text-label text-white/40">
      STREAK
    </div>
  </div>
</div>
```

### Navigation Item

```tsx
<button className="flex items-center gap-3 w-full p-4 hover:bg-white/5 transition-colors">
  <div className="w-10 h-10 flex items-center justify-center bg-hot">
    <MapPin className="w-5 h-5 text-black" />
  </div>
  
  <div className="flex-1 text-left">
    <div className="text-white" style={{ fontWeight: 600, fontSize: '15px' }}>
      BEACONS
    </div>
    <div className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>
      Hookup zones near you
    </div>
  </div>
  
  <span className="badge badge-live">LIVE</span>
</button>
```

---

## ✅ Do's and Don'ts

### Typography

✅ **DO:**
- Use inline styles for font sizes and weights
- Use h1-h6 semantic HTML elements
- Use UPPERCASE for headings and labels
- Use tight letter spacing for display text

❌ **DON'T:**
- Use Tailwind text utility classes (text-xl, font-bold, etc.)
- Use rounded corners (except for functional elements like badges)
- Use decorative fonts
- Use center alignment for body text

### Colors

✅ **DO:**
- Use hot pink (#FF0080) for all primary actions
- Use pure black (#000000) for all backgrounds
- Use white text on black backgrounds
- Use semantic colors consistently (green = success, red = danger)

❌ **DON'T:**
- Use gradients (except bg-gradient-hot for special cases)
- Use colors other than the defined palette
- Use low-contrast color combinations
- Use colored backgrounds (only black)

### Layout

✅ **DO:**
- Use glass morphism for cards and overlays
- Use editorial-section for consistent padding
- Use grid layouts for dashboard stats
- Use flexbox for component alignment

❌ **DON'T:**
- Use rounded corners on cards
- Use drop shadows (use glow effects instead)
- Use excessive padding/margins
- Use overly complex layouts

### Components

✅ **DO:**
- Use the btn classes for all buttons
- Use badges for status indicators
- Use neon-border for special emphasis
- Use hover effects consistently

❌ **DON'T:**
- Create custom button styles
- Mix different button styles in the same context
- Overuse animations
- Use more than 2-3 badges per element

### Accessibility

✅ **DO:**
- Maintain high contrast (white on black)
- Use semantic HTML elements
- Provide focus states
- Support reduced motion preferences

❌ **DON'T:**
- Use color alone to convey information
- Remove focus outlines
- Use auto-playing animations
- Use small font sizes (<12px)

---

## 🎯 Quick Reference

### Most Common Classes

```css
/* Layout */
.editorial-section
.container-narrow
.container-wide

/* Buttons */
.btn .btn-primary
.btn .btn-secondary

/* Cards */
.card
.card-hover

/* Glass */
.glass
.glass-strong

/* Effects */
.glow-hot
.neon-border
.hover-lift

/* Typography */
.text-display
.text-heading
.text-label
.text-body

/* Colors */
.bg-hot
.text-hot
.border-hot

/* Badges */
.badge .badge-hot
.badge .badge-live
```

### Color Variables

```css
--color-hot: #FF0080
--color-hot-bright: #FF1694
--color-hot-dark: #E70F3C
--color-black: #000000
--color-white: #ffffff
```

### Spacing

```css
gap-2    /* 8px */
gap-4    /* 16px */
gap-6    /* 24px */
p-4      /* 16px padding */
p-6      /* 24px padding */
mb-4     /* 16px margin-bottom */
```

---

## 📚 Additional Resources

- **Figma File:** [Link to design file]
- **Storybook:** [Link to component library]
- **Brand Guidelines:** `/docs/BRAND_GUIDELINES.md`
- **Component Library:** `/components/`

---

**Built with 🖤 for the global queer nightlife community**

**Last Updated:** December 8, 2025  
**Version:** 2.0.0  
**Status:** ✅ Complete
