# 🎨 HOTMESS LONDON — UI FIX GUIDE

**Complete Page-by-Page Design System Implementation**

---

## 📋 Overview

This document provides **hyper-detailed, copy-paste ready instructions** for implementing the HOTMESS LONDON design system across all 120+ pages.

**Design System Reference:** `/docs/DESIGN_SYSTEM.md`  
**Global Styles:** `/styles/globals.css`

---

## ⚠️ CRITICAL RULES

### 1. **NO TAILWIND TEXT CLASSES**

```tsx
// ❌ NEVER DO THIS
<h1 className="text-4xl font-bold">Title</h1>
<p className="text-lg font-semibold">Text</p>

// ✅ ALWAYS DO THIS
<h1 style={{ fontSize: '72px', fontWeight: 900 }}>Title</h1>
<p style={{ fontSize: '18px', fontWeight: 600 }}>Text</p>

// ✅ OR USE DEFAULT STYLES
<h1>Title</h1> {/* Uses h1 defaults from globals.css */}
```

### 2. **COLOR PALETTE**

```tsx
// ❌ WRONG COLORS
className="bg-red-600"
className="text-blue-500"
className="border-green-400"

// ✅ CORRECT COLORS
className="bg-hot"           // #FF0080
className="bg-hot-bright"    // #FF1694
className="bg-hot-dark"      // #E70F3C
className="text-hot"
className="border-hot"
className="bg-black"         // #000000
className="text-white"       // #ffffff
```

### 3. **COMPONENT CLASSES**

```tsx
// Use design system classes
className="btn btn-primary"
className="card card-hover"
className="glass"
className="glow-hot"
className="badge badge-live"
```

---

## 🏠 CORE PAGES

### Homepage (`/pages/Homepage.tsx`)

**Current Issues:**
- Inconsistent heading sizes
- Non-standard button styles
- Missing glass effects on cards
- Incorrect color usage

**Fixes:**

#### Hero Section
```tsx
// ❌ BEFORE
<h1 className="text-6xl font-black text-white mb-4">
  HOTMESS LONDON
</h1>
<p className="text-xl text-gray-400">
  Gay male nightlife OS
</p>

// ✅ AFTER
<h1 className="text-display glow-text" style={{ fontSize: '72px', fontWeight: 900 }}>
  HOTMESS LONDON
</h1>
<p className="text-body text-white/60" style={{ fontSize: '20px', fontWeight: 400 }}>
  Gay male nightlife OS for 18+ men
</p>
```

#### CTA Buttons
```tsx
// ❌ BEFORE
<button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-8 rounded-lg">
  GET STARTED
</button>

// ✅ AFTER
<button className="btn btn-primary btn-lg">
  GET STARTED
</button>
```

#### Feature Cards
```tsx
// ❌ BEFORE
<div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:shadow-lg">
  <h3 className="text-2xl font-bold mb-2">Beacons</h3>
  <p className="text-gray-400">Find hookups nearby</p>
</div>

// ✅ AFTER
<div className="card card-hover">
  <h3 className="text-heading" style={{ fontSize: '24px', fontWeight: 700 }}>
    BEACONS
  </h3>
  <p className="text-body text-white/60" style={{ fontSize: '14px', fontWeight: 400 }}>
    Find hookups nearby
  </p>
</div>
```

#### Stats Section
```tsx
// ❌ BEFORE
<div className="bg-gray-800 p-8 rounded-lg text-center">
  <div className="text-4xl font-bold text-pink-500">2.8K</div>
  <div className="text-sm text-gray-400 uppercase">Active Users</div>
</div>

// ✅ AFTER
<div className="card text-center">
  <div className="text-hot" style={{ fontSize: '48px', fontWeight: 900 }}>
    2.8K
  </div>
  <div className="text-label text-white/40">
    ACTIVE USERS
  </div>
</div>
```

---

### About Page (`/pages/About.tsx`)

**Current Issues:**
- Inconsistent spacing
- Wrong heading hierarchy
- Missing dividers

**Fixes:**

#### Page Header
```tsx
// ❌ BEFORE
<div className="mb-12">
  <h1 className="text-5xl font-bold mb-4">About HOTMESS</h1>
  <p className="text-lg text-gray-300">Learn about our mission</p>
</div>

// ✅ AFTER
<div className="editorial-section py-12 border-b border-brutal">
  <h1 style={{ fontSize: '72px', fontWeight: 900 }}>
    ABOUT HOTMESS
  </h1>
  <p className="text-body text-white/60 mt-4" style={{ fontSize: '18px', fontWeight: 400 }}>
    Learn about our mission
  </p>
</div>
```

#### Content Sections
```tsx
// ❌ BEFORE
<div className="mb-16">
  <h2 className="text-3xl font-bold mb-6">Our Story</h2>
  <p className="text-gray-300 leading-relaxed">
    HOTMESS started in 2024...
  </p>
</div>

// ✅ AFTER
<section className="editorial-section py-16">
  <h2 style={{ fontSize: '48px', fontWeight: 700 }}>
    OUR STORY
  </h2>
  <div className="divider" />
  <p className="text-body text-white/80 max-w-3xl" style={{ fontSize: '16px', fontWeight: 400, lineHeight: '1.6' }}>
    HOTMESS started in 2024...
  </p>
</section>
```

---

### Global OS (`/pages/GlobalOS.tsx`)

**Current Issues:**
- Inconsistent globe controls styling
- Stats overlay needs glass effect
- City list needs proper card styles

**Fixes:**

#### Stats Overlay
```tsx
// ❌ BEFORE
<div className="absolute top-8 left-8 bg-black/80 backdrop-blur-md p-6 rounded-lg">
  <div className="text-sm text-gray-400 uppercase mb-2">Active Cities</div>
  <div className="text-4xl font-bold text-white">12</div>
</div>

// ✅ AFTER
<div className="absolute top-8 left-8 glass-strong p-6">
  <div className="text-label text-white/40 mb-2">
    ACTIVE CITIES
  </div>
  <div className="text-white" style={{ fontSize: '48px', fontWeight: 900 }}>
    12
  </div>
</div>
```

#### City Cards
```tsx
// ❌ BEFORE
<div className="bg-gray-900 border border-gray-700 p-4 cursor-pointer hover:bg-gray-800">
  <div className="font-bold text-lg">London</div>
  <div className="text-sm text-gray-400">145 scans</div>
</div>

// ✅ AFTER
<div className="card card-hover clickable">
  <div className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
    LONDON
  </div>
  <div className="text-white/40" style={{ fontSize: '12px', fontWeight: 400 }}>
    145 scans
  </div>
</div>
```

---

### City OS (`/pages/CityOS.tsx`)

**Current Issues:**
- Tab styles inconsistent
- Event cards need proper styling
- Missing badges

**Fixes:**

#### Tab Navigation
```tsx
// ❌ BEFORE
<button className={`px-6 py-3 ${active ? 'bg-pink-600 text-white' : 'text-gray-400'}`}>
  Tonight
</button>

// ✅ AFTER
<button className={`px-6 py-3 uppercase transition-all ${
  active 
    ? 'bg-hot text-black' 
    : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
}`} style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}>
  TONIGHT
</button>
```

#### Event Cards
```tsx
// ❌ BEFORE
<div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
  <div className="text-xs text-pink-500 uppercase mb-2">Live</div>
  <h3 className="text-xl font-bold mb-2">HOTMESS Main Floor</h3>
  <p className="text-gray-400 text-sm">Heaven Nightclub • 22:00</p>
  <button className="mt-4 w-full bg-pink-600 text-white py-2 rounded">
    Get Tickets
  </button>
</div>

// ✅ AFTER
<div className="card card-hover">
  <div className="flex items-center justify-between mb-3">
    <span className="badge badge-live">LIVE</span>
    <span className="text-label text-white/40">TONIGHT</span>
  </div>
  
  <h3 className="text-heading text-hot mb-2" style={{ fontSize: '20px', fontWeight: 700 }}>
    HOTMESS MAIN FLOOR
  </h3>
  
  <p className="text-body text-white/60 mb-4" style={{ fontSize: '14px', fontWeight: 400 }}>
    Heaven Nightclub • 22:00
  </p>
  
  <button className="btn btn-primary w-full">
    GET TICKETS
  </button>
</div>
```

---

## 🎯 BEACON PAGES

### Beacons (`/pages/Beacons.tsx`)

**Current Issues:**
- Map container needs proper styling
- Beacon list cards inconsistent
- Filter buttons wrong style

**Fixes:**

#### Filter Pills
```tsx
// ❌ BEFORE
<button className={`px-4 py-2 rounded-full ${active ? 'bg-pink-600' : 'bg-gray-700'}`}>
  All
</button>

// ✅ AFTER
<button className={`px-4 py-2 uppercase transition-all ${
  active ? 'bg-hot text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'
}`} style={{ fontWeight: 700, fontSize: '12px' }}>
  ALL
</button>
```

#### Beacon Cards
```tsx
// ❌ BEFORE
<div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
  <div className="flex items-center gap-2 mb-2">
    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
    <span className="font-bold">Check-in Beacon</span>
  </div>
  <p className="text-sm text-gray-400">Heaven Nightclub</p>
  <p className="text-xs text-gray-500">145 scans</p>
</div>

// ✅ AFTER
<div className="card card-hover">
  <div className="flex items-center gap-3 mb-2">
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-beacon-checkin)' }}></div>
    <span className="text-white" style={{ fontSize: '14px', fontWeight: 700 }}>
      CHECK-IN BEACON
    </span>
  </div>
  <p className="text-white/60" style={{ fontSize: '14px', fontWeight: 400 }}>
    Heaven Nightclub
  </p>
  <p className="text-white/40" style={{ fontSize: '12px', fontWeight: 400 }}>
    145 scans
  </p>
</div>
```

### Beacon Create (`/pages/BeaconCreate.tsx`)

**Current Issues:**
- Form inputs need consistent styling
- Step indicators wrong style
- Missing glass effects

**Fixes:**

#### Form Inputs
```tsx
// ❌ BEFORE
<input 
  type="text"
  className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white"
  placeholder="Beacon name"
/>

// ✅ AFTER
<input 
  type="text"
  className="input"
  placeholder="Beacon name"
/>
```

#### Step Indicators
```tsx
// ❌ BEFORE
<div className={`w-8 h-8 rounded-full flex items-center justify-center ${
  current ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-400'
}`}>
  1
</div>

// ✅ AFTER
<div className={`w-10 h-10 flex items-center justify-center border transition-all ${
  current 
    ? 'bg-hot border-hot text-black' 
    : 'bg-transparent border-white/20 text-white/60'
}`} style={{ fontWeight: 700, fontSize: '14px' }}>
  1
</div>
```

---

## 🎵 RADIO PAGES

### Radio (`/pages/RadioNew.tsx`)

**Current Issues:**
- Player controls inconsistent
- Show cards need proper styling
- Now playing needs glass effect

**Fixes:**

#### Now Playing Card
```tsx
// ❌ BEFORE
<div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-xl">
  <img src={artwork} className="w-full rounded-lg mb-4" />
  <h2 className="text-2xl font-bold mb-2">{showName}</h2>
  <p className="text-gray-400">{djName}</p>
</div>

// ✅ AFTER
<div className="glass-strong p-8">
  <img src={artwork} className="w-full mb-4" />
  <h2 className="text-heading" style={{ fontSize: '32px', fontWeight: 700 }}>
    {showName}
  </h2>
  <p className="text-white/60" style={{ fontSize: '16px', fontWeight: 400 }}>
    {djName}
  </p>
</div>
```

#### Player Controls
```tsx
// ❌ BEFORE
<button className="w-16 h-16 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center">
  <Play className="w-8 h-8" />
</button>

// ✅ AFTER
<button className="w-16 h-16 bg-hot hover:bg-hot-bright flex items-center justify-center transition-all hover-glow">
  <Play className="w-8 h-8 text-black" />
</button>
```

#### Show Grid
```tsx
// ❌ BEFORE
<div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
  <img src={cover} className="w-full h-48 object-cover" />
  <div className="p-4">
    <h3 className="font-bold text-lg">{title}</h3>
    <p className="text-sm text-gray-400">{time}</p>
  </div>
</div>

// ✅ AFTER
<div className="card card-hover overflow-hidden">
  <img src={cover} className="w-full h-48 object-cover" />
  <div className="p-4">
    <h3 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
      {title.toUpperCase()}
    </h3>
    <p className="text-white/60" style={{ fontSize: '14px', fontWeight: 400 }}>
      {time}
    </p>
  </div>
</div>
```

---

## 🛍️ SHOP PAGES

### Shop (`/pages/Shop.tsx`)

**Current Issues:**
- Product grid cards inconsistent
- Category filters wrong style
- Add to cart buttons need proper styling

**Fixes:**

#### Category Pills
```tsx
// ❌ BEFORE
<button className={`px-6 py-2 rounded-full ${
  active ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300'
}`}>
  All Products
</button>

// ✅ AFTER
<button className={`px-6 py-2 uppercase transition-all ${
  active 
    ? 'bg-hot text-black' 
    : 'bg-white/10 text-white/60 hover:bg-white/20'
}`} style={{ fontWeight: 700, fontSize: '12px' }}>
  ALL PRODUCTS
</button>
```

#### Product Cards
```tsx
// ❌ BEFORE
<div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-pink-600">
  <img src={image} className="w-full h-64 object-cover" />
  <div className="p-4">
    <div className="text-xs text-pink-500 uppercase mb-1">New</div>
    <h3 className="font-bold text-lg mb-2">{name}</h3>
    <p className="text-2xl font-bold text-white mb-4">£{price}</p>
    <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded">
      Add to Cart
    </button>
  </div>
</div>

// ✅ AFTER
<div className="card card-hover overflow-hidden">
  <img src={image} className="w-full h-64 object-cover" />
  <div className="p-4">
    <span className="badge badge-hot mb-2">NEW</span>
    <h3 className="text-white mb-2" style={{ fontSize: '18px', fontWeight: 700 }}>
      {name.toUpperCase()}
    </h3>
    <p className="text-hot mb-4" style={{ fontSize: '24px', fontWeight: 900 }}>
      £{price}
    </p>
    <button className="btn btn-primary w-full">
      ADD TO CART
    </button>
  </div>
</div>
```

### Cart (`/pages/Cart.tsx`)

**Current Issues:**
- Cart items need proper card styling
- Quantity controls wrong style
- Checkout button needs emphasis

**Fixes:**

#### Cart Item
```tsx
// ❌ BEFORE
<div className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex gap-4">
  <img src={image} className="w-24 h-24 object-cover rounded" />
  <div className="flex-1">
    <h3 className="font-bold mb-1">{name}</h3>
    <p className="text-sm text-gray-400 mb-2">{variant}</p>
    <div className="flex items-center gap-2">
      <button className="bg-gray-700 w-8 h-8 rounded">-</button>
      <span className="w-12 text-center">{qty}</span>
      <button className="bg-gray-700 w-8 h-8 rounded">+</button>
    </div>
  </div>
  <div className="text-right">
    <p className="text-xl font-bold">£{total}</p>
  </div>
</div>

// ✅ AFTER
<div className="card flex gap-4">
  <img src={image} className="w-24 h-24 object-cover" />
  <div className="flex-1">
    <h3 className="text-white mb-1" style={{ fontSize: '16px', fontWeight: 700 }}>
      {name.toUpperCase()}
    </h3>
    <p className="text-white/60 mb-2" style={{ fontSize: '14px', fontWeight: 400 }}>
      {variant}
    </p>
    <div className="flex items-center gap-2">
      <button className="btn btn-ghost btn-sm">-</button>
      <span className="w-12 text-center text-white" style={{ fontWeight: 600 }}>
        {qty}
      </span>
      <button className="btn btn-ghost btn-sm">+</button>
    </div>
  </div>
  <div className="text-right">
    <p className="text-hot" style={{ fontSize: '24px', fontWeight: 900 }}>
      £{total}
    </p>
  </div>
</div>
```

#### Checkout Summary
```tsx
// ❌ BEFORE
<div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
  <div className="flex justify-between mb-4">
    <span className="text-gray-400">Subtotal</span>
    <span className="font-bold">£50.00</span>
  </div>
  <div className="flex justify-between mb-4">
    <span className="text-gray-400">Shipping</span>
    <span className="font-bold">£5.00</span>
  </div>
  <div className="border-t border-gray-700 pt-4 mb-6">
    <div className="flex justify-between">
      <span className="text-lg font-bold">Total</span>
      <span className="text-2xl font-bold text-pink-500">£55.00</span>
    </div>
  </div>
  <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-lg font-bold">
    Checkout
  </button>
</div>

// ✅ AFTER
<div className="glass-strong p-6">
  <div className="flex justify-between mb-4">
    <span className="text-white/60" style={{ fontSize: '14px', fontWeight: 400 }}>
      Subtotal
    </span>
    <span className="text-white" style={{ fontSize: '14px', fontWeight: 700 }}>
      £50.00
    </span>
  </div>
  <div className="flex justify-between mb-4">
    <span className="text-white/60" style={{ fontSize: '14px', fontWeight: 400 }}>
      Shipping
    </span>
    <span className="text-white" style={{ fontSize: '14px', fontWeight: 700 }}>
      £5.00
    </span>
  </div>
  <div className="divider" />
  <div className="flex justify-between mb-6">
    <span className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
      TOTAL
    </span>
    <span className="text-hot" style={{ fontSize: '32px', fontWeight: 900 }}>
      £55.00
    </span>
  </div>
  <button className="btn btn-primary w-full btn-lg glow-hot">
    CHECKOUT
  </button>
</div>
```

---

## 👤 USER PAGES

### Profile (`/pages/Profile.tsx`)

**Current Issues:**
- Stats cards need consistent styling
- Avatar container wrong style
- Activity feed cards inconsistent

**Fixes:**

#### Profile Header
```tsx
// ❌ BEFORE
<div className="bg-gradient-to-b from-gray-900 to-black p-8">
  <div className="flex items-center gap-6">
    <img src={avatar} className="w-32 h-32 rounded-full border-4 border-pink-600" />
    <div>
      <h1 className="text-4xl font-bold mb-2">{username}</h1>
      <p className="text-gray-400">Level 12 • PRO Member</p>
    </div>
  </div>
</div>

// ✅ AFTER
<div className="glass-strong p-8">
  <div className="flex items-center gap-6">
    <div className="relative">
      <img src={avatar} className="w-32 h-32" />
      <div className="absolute inset-0 border-2 border-hot glow-hot"></div>
    </div>
    <div>
      <h1 style={{ fontSize: '48px', fontWeight: 900 }}>
        {username.toUpperCase()}
      </h1>
      <p className="text-white/60" style={{ fontSize: '16px', fontWeight: 400 }}>
        Level 12 • <span className="text-hot">PRO</span> Member
      </p>
    </div>
  </div>
</div>
```

#### Stats Grid
```tsx
// ❌ BEFORE
<div className="grid grid-cols-4 gap-4">
  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
    <div className="text-3xl font-bold text-pink-500 mb-2">2.8K</div>
    <div className="text-sm text-gray-400 uppercase">Total XP</div>
  </div>
  {/* More stats... */}
</div>

// ✅ AFTER
<div className="grid grid-cols-4 gap-6">
  <div className="card text-center">
    <div className="text-hot mb-2" style={{ fontSize: '48px', fontWeight: 900 }}>
      2.8K
    </div>
    <div className="text-label text-white/40">
      TOTAL XP
    </div>
  </div>
  {/* More stats... */}
</div>
```

### Settings (`/pages/Settings.tsx`)

**Current Issues:**
- Section headers inconsistent
- Toggle switches wrong style
- Save button needs emphasis

**Fixes:**

#### Section Headers
```tsx
// ❌ BEFORE
<h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-4">
  Account Settings
</h2>

// ✅ AFTER
<h2 style={{ fontSize: '32px', fontWeight: 700 }}>
  ACCOUNT SETTINGS
</h2>
<div className="divider" />
```

#### Setting Rows
```tsx
// ❌ BEFORE
<div className="flex items-center justify-between py-4 border-b border-gray-800">
  <div>
    <h3 className="font-bold mb-1">Email Notifications</h3>
    <p className="text-sm text-gray-400">Receive updates via email</p>
  </div>
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" />
    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
  </label>
</div>

// ✅ AFTER
<div className="card flex items-center justify-between">
  <div className="flex-1">
    <h3 className="text-white mb-1" style={{ fontSize: '16px', fontWeight: 700 }}>
      EMAIL NOTIFICATIONS
    </h3>
    <p className="text-white/60" style={{ fontSize: '14px', fontWeight: 400 }}>
      Receive updates via email
    </p>
  </div>
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" />
    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-hot rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hot"></div>
  </label>
</div>
```

---

## 🎟️ TICKETS PAGES

### Tickets Browse (`/pages/tickets/TicketsBrowse.tsx`)

**Current Issues:**
- Event cards need proper styling
- Date filters wrong style
- Buy button needs emphasis

**Fixes:**

#### Date Filter
```tsx
// ❌ BEFORE
<button className={`px-4 py-2 rounded ${
  active ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400'
}`}>
  Tonight
</button>

// ✅ AFTER
<button className={`px-4 py-2 uppercase transition-all ${
  active 
    ? 'bg-hot text-black' 
    : 'bg-white/10 text-white/60 hover:bg-white/20'
}`} style={{ fontWeight: 700, fontSize: '12px' }}>
  TONIGHT
</button>
```

#### Event Cards
```tsx
// ❌ BEFORE
<div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
  <img src={poster} className="w-full h-48 object-cover" />
  <div className="p-4">
    <div className="text-xs text-pink-500 uppercase mb-2">Live Event</div>
    <h3 className="text-xl font-bold mb-2">{eventName}</h3>
    <p className="text-sm text-gray-400 mb-4">{venue} • {time}</p>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold text-white">£{price}</span>
      <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded">
        Buy
      </button>
    </div>
  </div>
</div>

// ✅ AFTER
<div className="card card-hover overflow-hidden">
  <img src={poster} className="w-full h-48 object-cover" />
  <div className="p-4">
    <span className="badge badge-live mb-2">LIVE EVENT</span>
    <h3 className="text-heading mb-2" style={{ fontSize: '20px', fontWeight: 700 }}>
      {eventName.toUpperCase()}
    </h3>
    <p className="text-white/60 mb-4" style={{ fontSize: '14px', fontWeight: 400 }}>
      {venue} • {time}
    </p>
    <div className="flex items-center justify-between">
      <span className="text-hot" style={{ fontSize: '32px', fontWeight: 900 }}>
        £{price}
      </span>
      <button className="btn btn-primary">
        BUY TICKETS
      </button>
    </div>
  </div>
</div>
```

### My Tickets (`/pages/MyTickets.tsx`)

**Current Issues:**
- QR code container needs glass effect
- Ticket cards inconsistent
- Transfer button wrong style

**Fixes:**

#### Ticket Card
```tsx
// ❌ BEFORE
<div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
  <div className="flex justify-between items-start mb-6">
    <div>
      <h3 className="text-xl font-bold mb-2">{eventName}</h3>
      <p className="text-sm text-gray-400">{venue}</p>
      <p className="text-sm text-gray-400">{date} • {time}</p>
    </div>
    <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded">
      VALID
    </div>
  </div>
  <div className="bg-white p-4 rounded-lg mb-4">
    <QRCode value={ticketId} size={200} />
  </div>
  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded">
    Transfer
  </button>
</div>

// ✅ AFTER
<div className="glass-hot p-6">
  <div className="flex justify-between items-start mb-6">
    <div>
      <h3 className="text-white mb-2" style={{ fontSize: '24px', fontWeight: 700 }}>
        {eventName.toUpperCase()}
      </h3>
      <p className="text-white/60" style={{ fontSize: '14px', fontWeight: 400 }}>
        {venue}
      </p>
      <p className="text-white/60" style={{ fontSize: '14px', fontWeight: 400 }}>
        {date} • {time}
      </p>
    </div>
    <span className="badge" style={{ backgroundColor: 'var(--color-success)', color: '#000' }}>
      VALID
    </span>
  </div>
  <div className="bg-white p-4 mb-4">
    <QRCode value={ticketId} size={200} />
  </div>
  <button className="btn btn-secondary w-full">
    TRANSFER TICKET
  </button>
</div>
```

---

## ⚙️ ADMIN PAGES

### Admin Dashboard (`/pages/admin/AdminDashboard.tsx`)

**Current Issues:**
- Stat cards need consistent styling
- Navigation sidebar wrong style
- Action buttons inconsistent

**Fixes:**

#### Stat Cards
```tsx
// ❌ BEFORE
<div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
  <div className="flex items-center justify-between mb-4">
    <span className="text-sm text-gray-400 uppercase">Total Users</span>
    <Users className="w-5 h-5 text-gray-400" />
  </div>
  <div className="text-3xl font-bold text-white mb-2">12,847</div>
  <div className="text-sm text-green-400">+12% this month</div>
</div>

// ✅ AFTER
<div className="card">
  <div className="flex items-center justify-between mb-4">
    <span className="text-label text-white/40">TOTAL USERS</span>
    <Users className="w-5 h-5 text-white/40" />
  </div>
  <div className="text-white mb-2" style={{ fontSize: '48px', fontWeight: 900 }}>
    12,847
  </div>
  <div className="text-success" style={{ fontSize: '14px', fontWeight: 600 }}>
    +12% this month
  </div>
</div>
```

#### Action Buttons
```tsx
// ❌ BEFORE
<button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
  Ban User
</button>

// ✅ AFTER
<button className="btn btn-danger">
  BAN USER
</button>
```

---

## 📄 LEGAL PAGES

### All Legal Pages (`/pages/Legal*.tsx`)

**Current Issues:**
- Content spacing inconsistent
- Section headers wrong hierarchy
- Missing dividers

**Fixes:**

#### Legal Page Template
```tsx
// ❌ BEFORE
<div className="max-w-4xl mx-auto p-8">
  <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
  <p className="text-gray-400 mb-8">Last updated: Jan 2024</p>
  
  <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
  <p className="text-gray-300 mb-6 leading-relaxed">
    Your privacy is important to us...
  </p>
</div>

// ✅ AFTER
<div className="editorial-section py-12">
  <div className="container-narrow">
    <h1 style={{ fontSize: '72px', fontWeight: 900 }}>
      PRIVACY POLICY
    </h1>
    <p className="text-white/40 mt-4" style={{ fontSize: '14px', fontWeight: 400 }}>
      Last updated: January 2024
    </p>
    
    <div className="divider" />
    
    <section className="mb-12">
      <h2 style={{ fontSize: '32px', fontWeight: 700 }}>
        1. INTRODUCTION
      </h2>
      <p className="text-body text-white/80 mt-4" style={{ fontSize: '16px', fontWeight: 400, lineHeight: '1.6' }}>
        Your privacy is important to us...
      </p>
    </section>
  </div>
</div>
```

---

## 🔐 AUTH PAGES

### Login (`/pages/AuthPages.tsx`)

**Current Issues:**
- Form container needs glass effect
- Input styling inconsistent
- Submit button wrong emphasis

**Fixes:**

#### Login Form
```tsx
// ❌ BEFORE
<div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
  <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
  
  <form>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Email</label>
      <input 
        type="email"
        className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-3"
        placeholder="your@email.com"
      />
    </div>
    
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Password</label>
      <input 
        type="password"
        className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-3"
        placeholder="••••••••"
      />
    </div>
    
    <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-bold">
      Sign In
    </button>
  </form>
</div>

// ✅ AFTER
<div className="glass-strong p-8 max-w-md mx-auto">
  <h1 className="text-center mb-6" style={{ fontSize: '48px', fontWeight: 900 }}>
    SIGN IN
  </h1>
  
  <form className="space-y-4">
    <div>
      <label className="text-label text-white/60 mb-2 block">
        EMAIL
      </label>
      <input 
        type="email"
        className="input"
        placeholder="your@email.com"
      />
    </div>
    
    <div>
      <label className="text-label text-white/60 mb-2 block">
        PASSWORD
      </label>
      <input 
        type="password"
        className="input"
        placeholder="••••••••"
      />
    </div>
    
    <button className="btn btn-primary w-full btn-lg glow-hot">
      SIGN IN
    </button>
  </form>
</div>
```

---

## 🔧 GLOBAL COMPONENTS

### Navigation (`/components/Navigation.tsx`)

**Current Issues:**
- Menu items need consistent hover states
- Logo needs proper styling
- Mobile menu needs glass effect

**Fixes:**

#### Desktop Logo
```tsx
// ❌ BEFORE
<div className="text-2xl font-black text-white">
  HOTMESS
</div>

// ✅ AFTER
<div className="text-white uppercase tracking-tight leading-none" 
     style={{ fontWeight: 700, fontSize: '26px', letterSpacing: '-0.04em' }}>
  HOTMESS
</div>
```

#### Nav Items
```tsx
// ❌ BEFORE
<button className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded">
  Beacons
</button>

// ✅ AFTER
<button className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-all uppercase" 
        style={{ fontWeight: 600, fontSize: '14px' }}>
  BEACONS
</button>
```

#### Mobile Menu
```tsx
// ❌ BEFORE
<div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50">
  {/* Menu content */}
</div>

// ✅ AFTER
<div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50">
  <div className="glass-strong p-6">
    {/* Menu content */}
  </div>
</div>
```

---

## 📊 TESTING CHECKLIST

After implementing fixes, verify:

### Typography
- [ ] No Tailwind text classes (text-xl, font-bold, etc.)
- [ ] All headings use inline styles or default h1-h6
- [ ] All labels are UPPERCASE
- [ ] Consistent font weights (400, 600, 700, 900 only)

### Colors
- [ ] Only #FF0080, #FF1694, #E70F3C for hot pink
- [ ] Pure black (#000000) backgrounds
- [ ] Pure white (#ffffff) text
- [ ] Semantic colors used correctly (success, warning, danger)

### Components
- [ ] All buttons use .btn classes
- [ ] All cards use .card classes
- [ ] Glass effects on overlays (.glass, .glass-strong)
- [ ] Badges use .badge classes

### Spacing
- [ ] Consistent gap spacing (gap-2, gap-4, gap-6)
- [ ] editorial-section for page padding
- [ ] Proper use of dividers

### Effects
- [ ] Glow effects on CTAs (.glow-hot)
- [ ] Hover states on interactive elements
- [ ] Neon borders where appropriate

---

## 🚀 DEPLOYMENT

1. **Run full build** to check for errors
2. **Visual QA** each page category
3. **Test responsive** on mobile/tablet/desktop
4. **Verify accessibility** (contrast, focus states)
5. **Performance check** (no layout shifts)

---

## 📚 RESOURCES

- **Design System:** `/docs/DESIGN_SYSTEM.md`
- **Global Styles:** `/styles/globals.css`
- **Component Examples:** `/docs/DESIGN_SYSTEM.md#usage-examples`

---

**Built with 🖤 for HOTMESS LONDON**

**Last Updated:** December 8, 2025  
**Version:** 1.0.0  
**Pages Covered:** 120+
