# 🔥 HOTMESS LONDON - Server Files Checklist

## Priority 1: QR Engine (7 files) ✅

These 7 files are **REQUIRED** for the QR Engine to work:

- [ ] `supabase/functions/server/index.tsx` (Main server, 122+ routes)
- [ ] `supabase/functions/server/config.json` (Auth configuration)
- [ ] `supabase/functions/server/qr-styles.ts` (QR rendering - 4 styles)
- [ ] `supabase/functions/server/beacon-signatures.ts` (HMAC signing)
- [ ] `supabase/functions/server/routes/qr.ts` (QR generation API)
- [ ] `supabase/functions/server/routes/l.ts` (Normal beacon resolve)
- [ ] `supabase/functions/server/routes/x.ts` (Signed beacon resolve)

**If you only copy these 7 files, the QR system will work!**

---

## Priority 2: Core API Modules (15 files)

For full beacon functionality:

- [ ] `supabase/functions/server/beacon_api.tsx` (Beacon CRUD)
- [ ] `supabase/functions/server/beacon_routes.tsx` (Beacon routing)
- [ ] `supabase/functions/server/beacon_store.tsx` (Beacon storage)
- [ ] `supabase/functions/server/beacon_resolver.tsx` (Beacon resolution)
- [ ] `supabase/functions/server/beacons.tsx` (Beacon utilities)
- [ ] `supabase/functions/server/xp.tsx` (XP & achievements)
- [ ] `supabase/functions/server/map_api.tsx` (Map/location API)
- [ ] `supabase/functions/server/heat_api.tsx` (Heatmap data)
- [ ] `supabase/functions/server/earth-routes.ts` (Globe API)
- [ ] `supabase/functions/server/earth_routes.tsx` (Legacy globe)
- [ ] `supabase/functions/server/make-integrations.ts` (External integrations)
- [ ] `supabase/functions/server/auth-middleware.ts` (Auth helpers)
- [ ] `supabase/functions/server/kv_store.tsx` (KV database utilities)
- [ ] `supabase/functions/server/qr-auth.tsx` (QR login system)
- [ ] `supabase/functions/server/seed-data.tsx` (Demo data)

---

## Priority 3: Tickets & Marketplace (10 files)

For C2C ticket marketplace:

- [ ] `supabase/functions/server/tickets_api.tsx` (Tickets API)
- [ ] `supabase/functions/server/tickets_c2c_api.tsx` (C2C marketplace)
- [ ] `supabase/functions/server/market_api.tsx` (Market core)
- [ ] `supabase/functions/server/market_listings_api.tsx` (Listings)
- [ ] `supabase/functions/server/market_orders_api.tsx` (Orders)
- [ ] `supabase/functions/server/market_sellers_api.tsx` (Sellers)
- [ ] `supabase/functions/server/messmarket_api.tsx` (MessMarket)
- [ ] `supabase/functions/server/stripe_api.tsx` (Stripe payments)
- [ ] `supabase/functions/server/seller_dashboard_api.tsx` (Seller portal)
- [ ] `supabase/functions/server/vendor_api.tsx` (Vendor management)

---

## Priority 4: Social & Communication (8 files)

For messaging and community:

- [ ] `supabase/functions/server/connect_api.tsx` (Connect/matching)
- [ ] `supabase/functions/server/hookup_api.tsx` (Hook-up beacons)
- [ ] `supabase/functions/server/telegram_bot.tsx` (Telegram bot)
- [ ] `supabase/functions/server/telegram_webhook.tsx` (Telegram webhooks)
- [ ] `supabase/functions/server/intel_api.tsx` (Auto-intel system)
- [ ] `supabase/functions/server/notifications_api.tsx` (Push notifications)
- [ ] `supabase/functions/server/email_service.tsx` (Email service)
- [ ] `supabase/functions/server/users_api.tsx` (User profiles)

---

## Priority 5: Additional Features (8 files)

Nice-to-have features:

- [ ] `supabase/functions/server/drops_api.tsx` (Product drops)
- [ ] `supabase/functions/server/records_api.tsx` (Music releases)
- [ ] `supabase/functions/server/membership_api.tsx` (Membership tiers)
- [ ] `supabase/functions/server/admin_api.tsx` (Admin panel)
- [ ] `supabase/functions/server/saved_api.tsx` (Saved content)
- [ ] `supabase/functions/server/search_api.tsx` (Search)

---

## All 48 Server Files (Complete List)

```
supabase/functions/server/
├── index.tsx                       # Main server (REQUIRED)
├── config.json                     # Auth config (REQUIRED)
│
├── QR SYSTEM (REQUIRED):
├── qr-styles.ts                    # QR rendering
├── beacon-signatures.ts            # HMAC signing
├── routes/
│   ├── qr.ts                       # QR generation
│   ├── l.ts                        # Normal resolve
│   └── x.ts                        # Signed resolve
│
├── BEACON CORE:
├── beacon_api.tsx
├── beacon_routes.tsx
├── beacon_store.tsx
├── beacon_resolver.tsx
├── beacons.tsx
├── xp.tsx
│
├── MAP & GLOBE:
├── map_api.tsx
├── heat_api.tsx
├── earth-routes.ts
├── earth_routes.tsx
│
├── TICKETS & MARKETPLACE:
├── tickets_api.tsx
├── tickets_c2c_api.tsx
├── market_api.tsx
├── market_listings_api.tsx
├── market_orders_api.tsx
├── market_sellers_api.tsx
├── messmarket_api.tsx
├── stripe_api.tsx
├── seller_dashboard_api.tsx
├── vendor_api.tsx
│
├── SOCIAL:
├── connect_api.tsx
├── hookup_api.tsx
├── telegram_bot.tsx
├── telegram_webhook.tsx
├── intel_api.tsx
├── notifications_api.tsx
├── email_service.tsx
├── users_api.tsx
│
├── ADDITIONAL:
├── drops_api.tsx
├── records_api.tsx
├── membership_api.tsx
├── admin_api.tsx
├── saved_api.tsx
├── search_api.tsx
│
└── UTILITIES:
    ├── auth-middleware.ts
    ├── kv_store.tsx
    ├── qr-auth.tsx
    ├── make-integrations.ts
    └── seed-data.tsx
```

---

## Deployment Size Comparison

| Option | Files | Features | Deploy Time |
|--------|-------|----------|-------------|
| **Minimal (QR Only)** | 7 | QR Engine only | ~30 sec |
| **Core** | 22 | QR + Beacons + XP | ~1 min |
| **Full** | 48 | Everything | ~2 min |

---

## Recommended Deployment Strategy

### Phase 1: QR Engine (Now) ✅
Deploy the 7 priority files to get QR generation working immediately.

### Phase 2: Core Features (Next)
Add the 15 core API modules for full beacon functionality.

### Phase 3: Marketplace (Later)
Add tickets and marketplace when ready to launch C2C sales.

### Phase 4: Social (Optional)
Add connect, telegram, and intel when launching social features.

---

## Quick Copy Commands

### Minimal (7 files):
```bash
cd HOTMESS-LONDON1
mkdir -p supabase/functions/server/routes
cp /figma-make/supabase/functions/server/index.tsx supabase/functions/server/
cp /figma-make/supabase/functions/server/config.json supabase/functions/server/
cp /figma-make/supabase/functions/server/qr-styles.ts supabase/functions/server/
cp /figma-make/supabase/functions/server/beacon-signatures.ts supabase/functions/server/
cp /figma-make/supabase/functions/server/routes/qr.ts supabase/functions/server/routes/
cp /figma-make/supabase/functions/server/routes/l.ts supabase/functions/server/routes/
cp /figma-make/supabase/functions/server/routes/x.ts supabase/functions/server/routes/
```

### Full (All 48 files):
```bash
cd HOTMESS-LONDON1
mkdir -p supabase/functions
cp -r /figma-make/supabase/functions/server supabase/functions/
```

---

## Files Available in This Figma Make Project

All 48 files are ready at:
```
/supabase/functions/server/
```

You can browse them in the Figma Make file explorer or download the project.

---

**🔥 Ready to deploy? Start with the 7 Priority 1 files!**
