# 🔥 Push HOTMESS LONDON to GitHub

Since the GitHub MCP doesn't have write permissions, push manually from your laptop.

---

## 📦 **Step 1: Download All Files from Figma Make**

You need to get all the files from this Figma Make project to your laptop.

**Option A: If you have local file access to Figma Make workspace**
```bash
# Copy the entire project directory to your laptop
```

**Option B: Manually copy each critical file**

### Critical Server Function Files:

1. **`supabase/functions/server/index.tsx`** (main server, 122+ routes)
2. **`supabase/functions/server/config.json`** (auth config)
3. **`supabase/functions/server/qr-styles.ts`** (QR generation)
4. **`supabase/functions/server/beacon-signatures.ts`** (HMAC signing)
5. **`supabase/functions/server/routes/qr.ts`** (QR API)
6. **`supabase/functions/server/routes/l.ts`** (beacon resolve)
7. **`supabase/functions/server/routes/x.ts`** (signed beacons)

### All Other Server Files (40+):
- `beacon_api.tsx`
- `beacon_routes.tsx`
- `beacon_store.tsx`
- `earth_routes.tsx`
- `tickets_api.tsx`
- `stripe_api.tsx`
- `xp.tsx`
- ... and 30+ more

---

## 🚀 **Step 2: Initialize Git and Push**

On your laptop, in the `HOTMESS-LONDON1` directory:

```bash
# Navigate to your project directory
cd /path/to/HOTMESS-LONDON1

# Initialize git (if not already done)
git init

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment
.env
.env.local
.env.*.local

# Production
dist/
build/
.next/
out/

# Supabase
.supabase/
supabase/.branches/
supabase/.temp/

# Test outputs
test-qr-*.svg
qr-test-*.svg
*.test.svg

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Temp
*.tmp
*.temp
.cache/
EOF

# Create README
cat > README.md << 'EOF'
# 🔥 HOTMESS LONDON

**Masculine nightlife OS for queer men 18+**

Location-based social operating system combining care-first principles with kink aesthetics.

## ✨ Features

- **Night Pulse** - 3D globe interface with real-time beacon tracking
- **QR Beacon System** - 4 production-ready styles (RAW, HOTMESS, CHROME, STEALTH)
- **Signed Payloads** - HMAC authentication for hook-ups and ticket resale
- **XP & Achievements** - Gamified nightlife rewards
- **C2C Marketplace** - Ticket resale with Stripe Connect
- **Telegram Integration** - Bot-powered notifications and intel

## 💾 Technology Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Mapbox GL JS
- **Backend:** Supabase Edge Functions (Deno), Hono framework
- **Database:** Supabase Postgres
- **Payments:** Stripe Connect + Shopify
- **Auth:** Supabase Auth with social login

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start dev server
npm run dev
\`\`\`

## 📦 Deploy

\`\`\`bash
# Deploy Edge Functions to Supabase
supabase link --project-ref rfoftonnlwudilafhfkl
supabase functions deploy server
\`\`\`

## 🔐 Environment Variables

Required secrets:
- \`BEACON_SECRET\` - HMAC signing key
- \`SUPABASE_URL\` - Supabase project URL  
- \`SUPABASE_SERVICE_ROLE_KEY\` - Admin key
- \`APP_BASE_URL\` - Production domain (https://hotmess.london)

---

**🔥 Built with care for the community**

Dec 5, 2025
EOF

# Add all files
git add .

# Commit
git commit -m "🔥 HOTMESS QR Engine - Complete Server Function

✨ QR generation with 4 styles (RAW, HOTMESS, CHROME, STEALTH)
✨ Signed beacon payloads for hook-ups and ticket resale
✨ Beacon resolve handlers (/l/:code and /x/:payload.:sig)
✨ HMAC signature system for one-time codes
✨ Fixed Deno import paths with .ts extensions
✨ 122+ routes including beacons, XP, marketplace, tickets

Deployment: Dec 5, 2025"

# Add remote (if not already added)
git remote add origin https://github.com/SICQR/HOTMESS-LONDON1.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## ✅ **Step 3: Verify Push**

Check GitHub to confirm files are uploaded:
```
https://github.com/SICQR/HOTMESS-LONDON1
```

---

## 🔧 **Alternative: Use GitHub Desktop**

If you prefer a GUI:

1. **Install GitHub Desktop** - https://desktop.github.com
2. **Clone the empty repo:**
   - File → Clone Repository
   - Select `SICQR/HOTMESS-LONDON1`
   - Choose local path
3. **Copy all files** from Figma Make to the cloned folder
4. **Commit & Push:**
   - Write commit message
   - Click "Commit to main"
   - Click "Push origin"

---

## 📋 **File Structure to Push**

```
HOTMESS-LONDON1/
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx (MAIN - 122+ routes)
│           ├── config.json
│           ├── qr-styles.ts
│           ├── beacon-signatures.ts
│           ├── routes/
│           │   ├── qr.ts
│           │   ├── l.ts
│           │   └── x.ts
│           ├── beacon_api.tsx
│           ├── beacon_routes.tsx
│           ├── beacon_store.tsx
│           ├── earth_routes.tsx
│           ├── tickets_api.tsx
│           ├── stripe_api.tsx
│           ├── xp.tsx
│           └── ... (40+ more files)
├── .gitignore
└── README.md
```

---

## 🎯 **Priority Files (Must Push)**

If you can only push a few files initially, start with these:

1. `supabase/functions/server/index.tsx` (main server)
2. `supabase/functions/server/config.json` (auth config)
3. `supabase/functions/server/qr-styles.ts` (QR generation)
4. `supabase/functions/server/beacon-signatures.ts` (signing)
5. `supabase/functions/server/routes/qr.ts` (QR API)
6. `supabase/functions/server/routes/l.ts` (beacon resolve)
7. `supabase/functions/server/routes/x.ts` (signed beacons)

These 7 files contain the complete QR Engine functionality.

---

## 🔥 **After Pushing: Deploy to Supabase**

```bash
# From your laptop, in the HOTMESS-LONDON1 directory
supabase link --project-ref rfoftonnlwudilafhfkl
supabase functions deploy server
```

---

**Need the files?** They're all ready in this Figma Make project. You can:
1. Download the project export
2. Or copy-paste each file from the Figma Make file browser

Let me know if you need me to generate a zip archive or provide the files in a different format!

---

**🔥 HOTMESS LONDON - Nightlife on Earth**
