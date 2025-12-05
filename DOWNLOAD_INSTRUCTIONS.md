# 🔥 HOTMESS LONDON - Download Package Instructions

## ⚡ Quick Download Method

Since Figma Make doesn't support creating ZIP files directly, here are your options:

---

## Option 1: Export Entire Project (Recommended)

1. **In Figma Make interface:**
   - Look for "Export" or "Download Project" button
   - This will download the entire project as a ZIP
   
2. **Extract and navigate:**
   ```bash
   unzip figma-make-export.zip
   cd figma-make-export
   ```

3. **The server files are in:**
   ```
   supabase/functions/server/
   ```

---

## Option 2: Manual File Copy (7 Priority Files)

Copy these 7 files from the Figma Make file browser to your laptop:

### Create this structure on your laptop:

```
HOTMESS-LONDON1/
└── supabase/
    └── functions/
        └── server/
            ├── index.tsx
            ├── config.json
            ├── qr-styles.ts
            ├── beacon-signatures.ts
            └── routes/
                ├── qr.ts
                ├── l.ts
                └── x.ts
```

### Files to copy:

1. **`/supabase/functions/server/index.tsx`**
   - Main server file (122+ routes)
   - ~4,500 lines

2. **`/supabase/functions/server/config.json`**
   - Auth configuration
   - ~3 lines

3. **`/supabase/functions/server/qr-styles.ts`**
   - QR rendering engine (4 styles)
   - ~265 lines

4. **`/supabase/functions/server/beacon-signatures.ts`**
   - HMAC signature system
   - ~175 lines

5. **`/supabase/functions/server/routes/qr.ts`**
   - QR generation API
   - ~90 lines

6. **`/supabase/functions/server/routes/l.ts`**
   - Normal beacon resolve
   - ~90 lines

7. **`/supabase/functions/server/routes/x.ts`**
   - Signed beacon resolve
   - ~115 lines

---

## Option 3: Copy All 48 Server Files

If you want the complete deployment (recommended for production):

### Copy entire directory:

```
/supabase/functions/server/ → HOTMESS-LONDON1/supabase/functions/server/
```

### This includes:

**QR Engine (7 files):**
- index.tsx, config.json
- qr-styles.ts, beacon-signatures.ts
- routes/qr.ts, routes/l.ts, routes/x.ts

**Core APIs (15 files):**
- beacon_api.tsx, beacon_routes.tsx, beacon_store.tsx
- beacon_resolver.tsx, beacons.tsx
- xp.tsx, map_api.tsx, heat_api.tsx
- earth-routes.ts, earth_routes.tsx
- auth-middleware.ts, kv_store.tsx
- qr-auth.tsx, seed-data.tsx, make-integrations.ts

**Marketplace (10 files):**
- tickets_api.tsx, tickets_c2c_api.tsx
- market_api.tsx, market_listings_api.tsx
- market_orders_api.tsx, market_sellers_api.tsx
- messmarket_api.tsx, stripe_api.tsx
- seller_dashboard_api.tsx, vendor_api.tsx

**Social (8 files):**
- connect_api.tsx, hookup_api.tsx
- telegram_bot.tsx, telegram_webhook.tsx
- intel_api.tsx, notifications_api.tsx
- email_service.tsx, users_api.tsx

**Additional (8 files):**
- drops_api.tsx, records_api.tsx
- membership_api.tsx, admin_api.tsx
- saved_api.tsx, search_api.tsx

---

## After Downloading Files

### 1. Add Documentation Files

Create these files in your `HOTMESS-LONDON1` directory:

**README.md:**
```markdown
# 🔥 HOTMESS LONDON

**Masculine nightlife OS for queer men 18+**

## Quick Deploy

\`\`\`bash
supabase link --project-ref rfoftonnlwudilafhfkl
supabase functions deploy server
\`\`\`

## Set Secrets

In Supabase Dashboard → Settings → Edge Functions → Secrets:
- \`BEACON_SECRET\` - Generate with: \`openssl rand -base64 32\`
- \`APP_BASE_URL\` - Set to: \`https://hotmess.london\`

## Test

\`\`\`bash
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/health
\`\`\`
```

**.gitignore:**
```
node_modules/
.env
.env.local
.supabase/
*.log
.DS_Store
test-qr-*.svg
```

### 2. Push to GitHub

```bash
cd HOTMESS-LONDON1
git init
git add .
git commit -m "🔥 HOTMESS QR Engine - Complete deployment"
git remote add origin https://github.com/SICQR/HOTMESS-LONDON1.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Supabase

```bash
supabase link --project-ref rfoftonnlwudilafhfkl
supabase functions deploy server
```

### 4. Set Environment Variables

Go to: https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/settings/functions

Add secrets:
```bash
BEACON_SECRET=<generate with: openssl rand -base64 32>
APP_BASE_URL=https://hotmess.london
```

### 5. Test Deployment

```bash
# Health check
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/health

# Generate QR
curl -o test.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=hotmess&size=512"

# Open it
open test.svg
```

---

## File Sizes Reference

| File | Lines | Description |
|------|-------|-------------|
| index.tsx | ~4,500 | Main server (122+ routes) |
| qr-styles.ts | ~265 | QR rendering engine |
| beacon-signatures.ts | ~175 | HMAC signing |
| beacon_api.tsx | ~375 | Beacon CRUD |
| tickets_api.tsx | ~430 | Tickets API |
| stripe_api.tsx | ~662 | Stripe integration |
| xp.tsx | ~451 | XP system |
| ... | ... | 40+ more modules |

**Total server code:** ~15,000+ lines

---

## Need Help?

Read these guides in the Figma Make project:
1. `/DEPLOY_NOW_SUMMARY.md` - Complete overview
2. `/QUICK_DEPLOY_STEPS.md` - Step-by-step guide
3. `/SERVER_FILES_CHECKLIST.md` - File inventory
4. `/GITHUB_PUSH_GUIDE.md` - Git commands
5. `/MANUAL_DEPLOY_INSTRUCTIONS.md` - Supabase deployment

---

## ✅ Checklist

- [ ] Download/copy server files
- [ ] Create README.md and .gitignore
- [ ] Push to GitHub
- [ ] Deploy to Supabase
- [ ] Set BEACON_SECRET
- [ ] Test health endpoint
- [ ] Generate test QR codes
- [ ] Verify all 4 styles work

---

**🔥 Ready to ship!**

HOTMESS LONDON - Nightlife on Earth  
Dec 5, 2025
