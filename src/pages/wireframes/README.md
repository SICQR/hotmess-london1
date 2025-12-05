# 🔥 HOTMESS LONDON — Page Wireframes

## Complete Page-Level Templates

All wireframes built using existing **hm/* components only**. No new components. No styling overrides. 
Mobile-first → Tablet → Desktop responsive.

---

## 📄 Pages Delivered

### **1. HomePage.tsx**
- Hero with pulsing HOTMESS title
- Primary action grid (Scan, Radio, Shop, Rewards)
- XP status bar
- Hot beacons grid
- Value props
- Quick links

**Components Used:**
- HMButton
- HMBeaconCard
- HMXPMeter
- BeaconScanner

---

### **2. ShopPage.tsx (Product Listing)**
- Header with title
- Search input
- Collection filter chips (All/RAW/HUNG/HIGH)
- Product grid (responsive 1-2-3-4 columns)
- Vendor CTA

**Components Used:**
- HMInput
- HMChip
- HMProductCard
- HMButton

---

### **3. ProductDetailPage.tsx**
- Back button
- Product image
- Product info (price, XP, collection)
- Size selector
- Quantity controls
- Add to cart + wishlist/share
- Tabs (Details/Sizing/Care)
- Related products

**Components Used:**
- HMButton
- HMProductCard
- HMTabs

---

### **4. RadioPage.tsx**
- Now playing hero with live indicator
- Waveform visualization
- Play/pause controls
- Volume slider
- Show schedule
- Past shows archive

**Components Used:**
- HMButton
- HMRadioShowCard
- HMSlider
- RadioWaveform

---

### **5. BeaconMapPage.tsx (Drops/Map)**
- Header + scan CTA
- Heat filter chips
- Map visualization placeholder
- Map legend with badges
- Beacon list grid
- How it works section

**Components Used:**
- HMButton
- HMBeaconCard
- HMBeaconBadge
- HMMapPin
- HMChip
- BeaconScanner

---

### **6. RewardsPage.tsx**
- Header with XP status
- XP meter
- Tabs (Available/Locked/Redeemed)
- Reward cards grid
- How to earn XP section
- Leaderboard preview

**Components Used:**
- HMXPMeter
- HMRewardCard
- HMTabs
- HMButton

---

### **7. ProfilePage.tsx**
- Profile header (avatar, stats, level)
- Current XP progress
- Tabs (Activity/Stats/Settings)
- Activity feed
- Stats breakdown
- Settings (account, privacy, notifications)

**Components Used:**
- HMXPMeter
- HMTabs
- HMInput
- HMToggle
- HMButton

---

### **8. MessMarketPage.tsx**
- Header with "List an Item" CTA
- Search and category filters
- Tabs (All Listings/My Listings/Saved)
- Community listing cards with seller info
- How it works section
- Marketplace guidelines
- Link to official shop

**Components Used:**
- HMButton
- HMInput
- HMChip
- HMTabs

---

### **9. CarePage.tsx (Hand N Hand)**
- Header with heart icon
- Emergency resources (crisis lines)
- Resource categories grid (Mental Health, Sexual Health, Housing, etc.)
- Care shows on radio
- In-person support
- Care ethos statement

**Components Used:**
- HMButton
- HMRadioShowCard

---

### **10. CommunityPage.tsx**
- Header with community stats
- Tabs (Feed/Events/Leaderboard)
- Post composer
- Feed posts with engagement
- Events list
- Leaderboard with rankings
- Community guidelines CTA

**Components Used:**
- HMButton
- HMTabs
- HMInput

---

### **11. VendorPortalPage.tsx**
- Dashboard stats (revenue, orders, products, growth)
- Tabs (Products/Orders/Analytics/Settings)
- Product management grid
- Orders list with status
- Analytics charts placeholder
- Settings (store info, toggles, payout)

**Components Used:**
- HMButton
- HMProductCard
- HMTabs
- HMInput
- HMToggle

---

### **12. AdminDashboardPage.tsx**
- Key metrics (users, scans, revenue, listeners)
- System status + maintenance toggle
- Tabs (Users/Beacons/Content/Reports/Settings)
- User management
- Beacon management
- Content management (shows, events)
- Report moderation
- System settings

**Components Used:**
- HMButton
- HMTabs
- HMInput
- HMToggle

---

### **13. LegalPage.tsx (Legal Hub)**
- Header with shield icon
- Quick links (Terms/Privacy/Guidelines/Report)
- Tabs with full legal documents
  - Terms of Service
  - Privacy Policy
  - Community Guidelines
  - Copyright & DMCA
- Report abuse CTA

**Components Used:**
- HMButton
- HMTabs

---

### **14. AboutPage.tsx**
- Hero with tagline
- Mission statement
- What we do (4 pillars)
- Values
- Team section
- Contact info
- Social links
- Final CTA

**Components Used:**
- HMButton

---

## 🎨 Design Principles

### ✅ Mobile-First Responsive
Every page adapts seamlessly:
- **Mobile:** Single column, stacked content, bottom nav
- **Tablet:** 2-column grids, more spacing
- **Desktop:** 3-4 column grids, sidebar nav

### ✅ Component Consistency
- **No new components** — Uses only hm/* library
- **No style overrides** — Respects component APIs
- **Token-based** — All spacing, colors, typography from design system

### ✅ Layout Patterns
- Grid systems: 1-2-3-4 columns (responsive)
- Sticky filters/search bars
- Section spacing: 16-64px (design tokens)
- Border separators: `border-hot/30`
- Background layers: `bg-black/50`, `bg-charcoal/50`

---

## 📦 Import Pages

```tsx
// Import wireframe pages
import { HomePage } from './pages/wireframes/HomePage';
import { ShopPage } from './pages/wireframes/ShopPage';
import { ProductDetailPage } from './pages/wireframes/ProductDetailPage';
import { RadioPage } from './pages/wireframes/RadioPage';
import { BeaconMapPage } from './pages/wireframes/BeaconMapPage';
import { RewardsPage } from './pages/wireframes/RewardsPage';
import { ProfilePage } from './pages/wireframes/ProfilePage';
import { MessMarketPage } from './pages/wireframes/MessMarketPage';
import { CarePage } from './pages/wireframes/CarePage';
import { CommunityPage } from './pages/wireframes/CommunityPage';
import { VendorPortalPage } from './pages/wireframes/VendorPortalPage';
import { AdminDashboardPage } from './pages/wireframes/AdminDashboardPage';
import { LegalPage } from './pages/wireframes/LegalPage';
import { AboutPage } from './pages/wireframes/AboutPage';
```

---

## 🔄 Next Steps

1. **Replace old pages** — Swap existing pages with wireframe versions
2. **Hook up navigation** — Update App.tsx routing
3. **Add real data** — Connect to backend/Supabase
4. **Test responsive** — Verify mobile → tablet → desktop
5. **Add animations** — Enhance with micro-interactions

---

**All wireframes complete. Ready for integration.** 🔥