# HOTMESS LONDON — DESIGN SYSTEM v2.0.0

**Dark Neon Kink Aesthetic • Brutalist Luxury • Care-First Principles**

## Implementation Status

✅ **COMPLETE** - Full design system implemented in `src/styles/globals.css`

---

## 🎯 Core Principles

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

### Semantic Colors
```css
--color-success: #00C853;          /* Green */
--color-warning: #FFD600;          /* Yellow */
--color-danger: #FF1744;           /* Red */
--color-info: #00E5FF;             /* Cyan */
--color-purple: #7C4DFF;           /* Purple */
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
--color-beacon-panic: #FF1744;     /* Red */
```

---

## 📝 Typography

### ⚠️ CRITICAL RULE: No Tailwind Text Classes

**DO NOT USE:**
- `text-lg`, `text-xl`, `text-2xl`, `text-4xl`
- `font-bold`, `font-semibold`, `font-medium`

**ALWAYS USE:**
- Semantic HTML elements (`h1`, `h2`, `h3`, etc.)
- Inline styles with specific px values
- Design system utility classes (`.text-display`, `.text-heading`, `.text-label`)

### Hierarchy

| Element | Size | Weight | Letter Spacing | Transform |
|---------|------|--------|----------------|-----------|
| `h1` | 72px | 900 | -0.04em | UPPERCASE |
| `h2` | 48px | 700 | -0.03em | UPPERCASE |
| `h3` | 32px | 700 | -0.02em | - |
| `h4` | 24px | 600 | -0.01em | - |
| `h5` | 18px | 600 | 0 | - |
| `h6` | 16px | 600 | 0 | - |
| `p` | 16px | 400 | -0.01em | - |

### Utility Classes

```css
.text-display      /* 900 weight, -0.04em tracking, UPPERCASE */
.text-heading      /* 700 weight, -0.02em tracking, UPPERCASE */
.text-label        /* 12px, 700 weight, 0.1em tracking, UPPERCASE */
.text-body         /* 16px, 400 weight, 1.6 line-height */
.text-small        /* 14px, 400 weight */
.text-xs           /* 12px, 400 weight */
```

### Example Usage

```tsx
// ❌ WRONG
<h1 className="text-4xl font-bold">HOTMESS</h1>

// ✅ CORRECT
<h1>HOTMESS</h1>

// ✅ ALSO CORRECT
<h1 style={{ fontSize: '72px', fontWeight: 900 }}>HOTMESS</h1>

// ✅ CORRECT - Using utility
<h1 className="text-display glow-text">HOTMESS</h1>
```

---

## 🧩 Components

### Buttons

```tsx
// Primary button
<button className="btn btn-primary">BUY TICKETS</button>

// Secondary button
<button className="btn btn-secondary">LEARN MORE</button>

// Danger button
<button className="btn btn-danger">DELETE</button>

// Ghost button
<button className="btn btn-ghost">CANCEL</button>

// Sizes
<button className="btn btn-primary btn-sm">SMALL</button>
<button className="btn btn-primary btn-lg">LARGE</button>
```

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

### Inputs

```tsx
// Text input
<input type="text" className="input" placeholder="Enter text..." />

// Textarea
<textarea className="input" rows={4} placeholder="Message..." />
```

### Badges

```tsx
<span className="badge badge-hot">NEW</span>
<span className="badge badge-new">BETA</span>
<span className="badge badge-live">LIVE</span>
<span className="badge badge-pro">PRO</span>
<span className="badge badge-elite">ELITE</span>
```

### Glass Morphism

```tsx
<div className="glass p-6">Light glass effect</div>
<div className="glass-strong p-6">Strong glass effect</div>
<div className="glass-hot p-6">Hot pink glass</div>
```

### Neon Glow

```tsx
<div className="glow-hot p-6">Glowing container</div>
<div className="glow-hot-strong p-6">Intense glow</div>
<h1 className="glow-text">HOTMESS</h1>
```

---

## 📐 Layout

### Containers

```tsx
// Editorial section padding
<section className="editorial-section">
  <h2>Section Title</h2>
</section>

// Narrow container (800px max)
<div className="container-narrow">
  <p>Centered narrow content</p>
</div>

// Wide container (1400px max)
<div className="container-wide">
  <p>Centered wide content</p>
</div>
```

### Dividers

```tsx
<div className="divider" />              {/* Horizontal */}
<div className="divider-vertical" />     {/* Vertical */}
```

---

## 🎬 Animations

```tsx
<div className="fade-in">Fades in on load</div>
<div className="slide-up">Slides up on load</div>
<span className="pulse">LIVE</span>
<div className="spin">↻</div>
```

### Hover Effects

```tsx
<div className="hover-lift">Lifts on hover</div>
<div className="hover-scale">Scales on hover</div>
<div className="hover-glow">Glows on hover</div>
```

---

## ✅ Do's and Don'ts

### Typography

✅ **DO:**
- Use semantic HTML elements (h1-h6)
- Use inline styles for font sizes and weights
- Use UPPERCASE for headings and labels
- Use tight letter spacing for display text

❌ **DON'T:**
- Use Tailwind text utility classes
- Use rounded corners (except functional elements)
- Use decorative fonts
- Use center alignment for body text

### Colors

✅ **DO:**
- Use hot pink (#FF0080) for all primary actions
- Use pure black (#000000) for all backgrounds
- Use white text on black backgrounds
- Use semantic colors consistently

❌ **DON'T:**
- Use gradients (except bg-gradient-hot for special cases)
- Use colors outside the defined palette
- Use low-contrast combinations
- Use colored backgrounds (only black)

### Layout

✅ **DO:**
- Use glass morphism for cards and overlays
- Use editorial-section for consistent padding
- Use flexbox/grid for component alignment

❌ **DON'T:**
- Use rounded corners on cards
- Use drop shadows (use glow effects instead)
- Use excessive padding/margins

---

## 🎯 Quick Reference

### Most Common Classes

```css
/* Layout */
.editorial-section, .container-narrow, .container-wide

/* Buttons */
.btn, .btn-primary, .btn-secondary

/* Cards */
.card, .card-hover

/* Glass */
.glass, .glass-strong

/* Effects */
.glow-hot, .neon-border, .hover-lift

/* Typography */
.text-display, .text-heading, .text-label, .text-body

/* Colors */
.bg-hot, .text-hot, .border-hot

/* Badges */
.badge, .badge-hot, .badge-live
```

---

## 📚 Files

- **Implementation**: `src/styles/globals.css`
- **This Guide**: `DESIGN_SYSTEM.md`

---

**Built with 🖤 for the global queer nightlife community**

**Last Updated:** December 9, 2025  
**Version:** 2.0.0  
**Status:** ✅ Complete
