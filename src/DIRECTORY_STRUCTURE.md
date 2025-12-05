# 📁 HOTMESS LONDON - Directory Structure

This document shows what's included in the deployment.

---

## 📦 Root Directory

```
/
├── App.tsx                          # Main application entry point
├── README.md                        # Full product specification
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                   # Vite config
├── .gitignore                       # Git ignore rules
│
├── START_HERE.md                    # ⭐ START HERE for deployment
├── QUICKSTART.md                    # 60-second quick start
├── DEPLOYMENT_GUIDE.md              # Detailed deployment guide
├── DEPLOYMENT_CHECKLIST.md          # Pre-deployment checklist
├── PROJECT_STATUS.md                # Current project status
├── DIRECTORY_STRUCTURE.md           # This file
│
├── DEPLOY.sh                        # ⭐ Full deployment script (GitHub + Supabase)
├── PUSH_TO_GITHUB_SIMPLE.sh         # Simple GitHub push
└── PUSH_TO_GITHUB.sh                # Legacy GitHub push script
```

---

## 🔥 Server Function (Edge Function)

**Location:** `/supabase/functions/server/`

```
/supabase/functions/server/
│
├── index.tsx                        # ⭐ Main server (122+ routes)
├── config.json                      # Auth configuration (verify_jwt=false)
│
├── ━━━ QR SYSTEM ━━━
├── qr-auth.tsx                      # QR login flow (desktop ↔ phone)
├── qr-styles.ts                     # 4 QR styles (RAW, HOTMESS, CHROME, STEALTH)
├── beacon-signatures.ts             # HMAC signing for one-time codes
│
├── routes/
│   ├── qr.ts                        # QR generation endpoints
│   ├── l.ts                         # Standard beacon resolve (/l/:code)
│   └── x.ts                         # Signed beacon resolve (/x/:payload.:sig)
│
├── ━━━ BEACON SYSTEM ━━━
├── beacon_api.tsx                   # Beacon CRUD API
├── beacon_resolver.tsx              # Beacon resolution logic
├── beacon_routes.tsx                # Beacon scan system
├── beacon_store.tsx                 # Beacon database operations
├── beacons.tsx                      # Beacon management
│
├── ━━━ NIGHT PULSE GLOBE ━━━
├── earth-routes.ts                  # Globe API endpoints
├── earth_routes.tsx                 # Full Earth/Globe backend
├── map_api.tsx                      # Map heat/trail data
├── heat_api.tsx                     # Night Pulse heat map
│
├── ━━━ COMMERCE ━━━
├── market_api.tsx                   # Marketplace Stripe Connect
├── market_listings_api.tsx          # Listing management
├── market_orders_api.tsx            # Order processing
├── market_sellers_api.tsx           # Seller management
├── stripe_api.tsx                   # Stripe integration
├── tickets_api.tsx                  # First-party tickets
├── tickets_c2c_api.tsx              # C2C ticket resale
├── messmarket_api.tsx               # MessMarket API
├── seller_dashboard_api.tsx         # Seller dashboard stats
│
├── ━━━ COMMUNITY ━━━
├── connect_api.tsx                  # Connect module
├── hookup_api.tsx                   # Hookup/Chat beacons
├── telegram_bot.tsx                 # Telegram bot
├── telegram_webhook.tsx             # Telegram webhook
│
├── ━━━ PLATFORM ━━━
├── users_api.tsx                    # User profiles
├── auth-middleware.ts               # Auth middleware (requireAuth, requireAdmin)
├── xp.tsx                           # XP system
├── membership_api.tsx               # Tiered membership
├── notifications_api.tsx            # Notifications
├── saved_api.tsx                    # Saved content
├── search_api.tsx                   # Global search
├── admin_api.tsx                    # Admin console
│
├── ━━━ RECORDS & DROPS ━━━
├── records_api.tsx                  # RAW Convict Records
├── drops_api.tsx                    # Bot-powered drops
├── intel_api.tsx                    # Auto-Intel engine
│
├── ━━━ VENDOR ━━━
├── vendor_api.tsx                   # Vendor applications
│
├── ━━━ UTILITIES ━━━
├── kv_store.tsx                     # ⭐ Key-value storage (DO NOT EDIT)
├── make-integrations.ts             # Make.com webhooks
├── seed-data.tsx                    # Data seeding
└── email_service.tsx                # Email service
```

---

## 🎨 Frontend Components

**Location:** `/components/`

```
/components/
│
├── ━━━ ADMIN UI ━━━
├── AdminQRUI.tsx                    # QR generation admin interface
│
├── ━━━ NIGHT PULSE ━━━
├── NightPulseGlobe.tsx              # 3D globe with Mapbox GL JS
├── BeaconCreationPanel.tsx          # Beacon creation (6 types)
│
├── ━━━ PROTECTED ━━━
├── figma/
│   └── ImageWithFallback.tsx        # ⚠️  DO NOT EDIT (system file)
│
└── ... (100+ other components)
```

---

## 🎨 Styles

```
/styles/
└── globals.css                      # Global styles + typography system
```

---

## 🔧 Configuration Files

```
/
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                   # Vite bundler config
├── .gitignore                       # Git ignore rules
└── supabase/functions/server/config.json  # Edge Function config
```

---

## 📚 Documentation Files

```
/
├── README.md                        # Full product specification
├── START_HERE.md                    # ⭐ Deployment quick start
├── QUICKSTART.md                    # 60-second guide
├── DEPLOYMENT_GUIDE.md              # Detailed deployment instructions
├── DEPLOYMENT_CHECKLIST.md          # Pre-deployment checklist
├── PROJECT_STATUS.md                # Current project status
└── DIRECTORY_STRUCTURE.md           # This file
```

---

## 🚀 Deployment Scripts

```
/
├── DEPLOY.sh                        # ⭐ Full deployment (GitHub + Supabase)
├── PUSH_TO_GITHUB_SIMPLE.sh         # Simple GitHub push
└── PUSH_TO_GITHUB.sh                # Legacy push script
```

---

## ⚠️ Protected Files (DO NOT EDIT)

These files are managed by the Figma Make system:

```
/supabase/functions/server/kv_store.tsx
/utils/supabase/info.tsx
/components/figma/ImageWithFallback.tsx
```

---

## 🔑 Environment Secrets (Configured in Supabase)

**Already Set:**
- ✅ `SUPABASE_DB_URL`
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `STRIPE_RESTRICTED_KEY`
- ✅ `VITE_STRIPE_PUBLISHABLE_KEY`
- ✅ `STRIPE_SECRET_KEY`
- ✅ `BEACON_SECRET`
- ✅ `APP_BASE_URL`

---

## 📊 Total File Count

**Server Function Files:** 40+  
**Frontend Components:** 100+  
**Total Routes:** 122+  
**QR Styles:** 4  
**Beacon Types:** 6  

---

## 🎯 What Gets Deployed

### GitHub Push (`DEPLOY.sh`):
- ✅ All server function files
- ✅ All frontend components
- ✅ Configuration files
- ✅ Documentation
- ✅ Scripts
- ❌ node_modules (ignored)
- ❌ .env files (ignored)
- ❌ Test outputs (ignored)

### Supabase Deploy (`DEPLOY.sh`):
- ✅ `/supabase/functions/server/*` → Edge Function
- ✅ `config.json` → Function configuration
- ✅ Environment secrets (already configured)

---

## 📦 Total Deployment Size

**Estimated:**
- Server Function: ~500KB
- Frontend: ~2MB (after build)
- Total: ~2.5MB

---

## 🚀 Ready to Deploy!

Run:
```bash
./DEPLOY.sh
```

**See `/START_HERE.md` for step-by-step instructions.**

---

**🔥 HOTMESS LONDON - Nightlife on Earth**
