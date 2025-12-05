#!/bin/bash

# 🔥 HOTMESS LONDON - GitHub Deployment Package Creator
# This script packages all necessary files for the HOTMESS-LONDON1 repo

echo "🔥 Creating HOTMESS LONDON deployment package..."

# Create package directory
PACKAGE_DIR="hotmess-london-package"
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

echo "📦 Copying Supabase Edge Functions..."

# Create directory structure
mkdir -p "$PACKAGE_DIR/supabase/functions/server/routes"
mkdir -p "$PACKAGE_DIR/.github/workflows"

# Copy ALL server function files
echo "  → Copying main server files..."
cp supabase/functions/server/index.tsx "$PACKAGE_DIR/supabase/functions/server/" 2>/dev/null || echo "    ⚠️  index.tsx not found"
cp supabase/functions/server/config.json "$PACKAGE_DIR/supabase/functions/server/" 2>/dev/null || echo "    ⚠️  config.json not found"

# Copy QR system files
echo "  → Copying QR Engine files..."
cp supabase/functions/server/qr-styles.ts "$PACKAGE_DIR/supabase/functions/server/" 2>/dev/null || echo "    ⚠️  qr-styles.ts not found"
cp supabase/functions/server/beacon-signatures.ts "$PACKAGE_DIR/supabase/functions/server/" 2>/dev/null || echo "    ⚠️  beacon-signatures.ts not found"
cp supabase/functions/server/routes/qr.ts "$PACKAGE_DIR/supabase/functions/server/routes/" 2>/dev/null || echo "    ⚠️  routes/qr.ts not found"
cp supabase/functions/server/routes/l.ts "$PACKAGE_DIR/supabase/functions/server/routes/" 2>/dev/null || echo "    ⚠️  routes/l.ts not found"
cp supabase/functions/server/routes/x.ts "$PACKAGE_DIR/supabase/functions/server/routes/" 2>/dev/null || echo "    ⚠️  routes/x.ts not found"

# Copy all other API files (40+)
echo "  → Copying all API modules..."
cp supabase/functions/server/*.tsx "$PACKAGE_DIR/supabase/functions/server/" 2>/dev/null || echo "    ⚠️  No .tsx files found"
cp supabase/functions/server/*.ts "$PACKAGE_DIR/supabase/functions/server/" 2>/dev/null || echo "    ⚠️  No .ts files found"

echo "📄 Creating README.md..."

cat > "$PACKAGE_DIR/README.md" << 'EOF'
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

## 🚀 Quick Deploy

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref rfoftonnlwudilafhfkl

# Deploy Edge Functions
supabase functions deploy server

# Test deployment
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/health
```

## 🔐 Environment Variables

Required secrets (set in Supabase Dashboard):
- `BEACON_SECRET` - HMAC signing key for signed QR codes
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Admin key for backend operations
- `APP_BASE_URL` - Production domain (https://hotmess.london)

## 📁 Project Structure

```
supabase/functions/server/
├── index.tsx                  # Main server (122+ routes)
├── config.json                # Auth configuration
├── qr-styles.ts               # QR code rendering (4 styles)
├── beacon-signatures.ts       # HMAC payload signing
├── routes/
│   ├── qr.ts                  # QR generation API
│   ├── l.ts                   # Beacon resolve (normal)
│   └── x.ts                   # Beacon resolve (signed)
├── beacon_api.tsx             # Beacon CRUD operations
├── tickets_api.tsx            # C2C ticket marketplace
├── stripe_api.tsx             # Payment processing
├── xp.tsx                     # XP & achievements
└── ... (40+ more API modules)
```

## 🧪 Test QR Generation

After deploying, test the QR engine:

```bash
# Generate RAW style QR
curl -o raw.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=raw&size=512"

# Generate HOTMESS style QR
curl -o hotmess.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=hotmess&size=512"

# Generate CHROME style QR
curl -o chrome.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=chrome&size=512"

# Generate STEALTH style QR
curl -o stealth.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=stealth&size=512"
```

## 📚 Documentation

- **QR Engine:** Complete system with 4 branded styles
- **Beacon System:** Location-based check-ins with XP rewards
- **Signed Beacons:** Encrypted one-time codes for hook-ups and resale
- **Marketplace:** C2C ticket sales with Stripe Connect

## 🔥 API Routes

### Health Check
```
GET /make-server-a670c824/health
```

### QR Generation
```
GET /make-server-a670c824/qr/:code.svg?style=hotmess&size=512
GET /make-server-a670c824/qr/signed/:payload.:sig.svg
```

### Beacon Resolve
```
GET /l/:code              # Normal beacon
GET /x/:payload.:sig      # Signed beacon (hook-ups, resale)
```

### Beacons API
```
GET    /make-server-a670c824/beacons
POST   /make-server-a670c824/beacons
GET    /make-server-a670c824/beacons/:id
PATCH  /make-server-a670c824/beacons/:id
DELETE /make-server-a670c824/beacons/:id
```

### XP System
```
GET  /make-server-a670c824/xp/profile/:userId
POST /make-server-a670c824/xp/grant
GET  /make-server-a670c824/xp/leaderboard
```

### Tickets Marketplace
```
GET    /make-server-a670c824/tickets/listings
POST   /make-server-a670c824/tickets/listings
GET    /make-server-a670c824/tickets/listings/:id
PATCH  /make-server-a670c824/tickets/listings/:id/status
```

## 🛠️ Development

```bash
# Run locally
supabase functions serve server

# Test locally
curl http://localhost:54321/functions/v1/server/make-server-a670c824/health
```

## 🔒 Security Notes

- All QR codes use HTTPS-only URLs
- Signed beacons use HMAC-SHA256 authentication
- Beacon scans are rate-limited and logged
- One-time codes expire after 6 hours (hook-ups) or event date (resale)

---

**🔥 Built with care for the community**

HOTMESS LONDON - Nightlife on Earth  
Dec 5, 2025
EOF

echo "📄 Creating .gitignore..."

cat > "$PACKAGE_DIR/.gitignore" << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment
.env
.env.local
.env.*.local
.env.production

# Supabase
.supabase/
supabase/.branches/
supabase/.temp/

# Build outputs
dist/
build/
.next/
out/

# Test files
test-qr-*.svg
qr-test-*.svg
*.test.svg
*.test.png

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
*.log

# Temporary
*.tmp
*.temp
.cache/

# OS
Thumbs.db
EOF

echo "📄 Creating DEPLOYMENT.md..."

cat > "$PACKAGE_DIR/DEPLOYMENT.md" << 'EOF'
# 🔥 HOTMESS LONDON - Deployment Guide

## Prerequisites

1. **Supabase CLI** installed: `npm install -g supabase`
2. **Supabase account** with project created
3. **GitHub account** (for version control)

## Step 1: Deploy to Supabase

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref rfoftonnlwudilafhfkl

# Deploy the server function
supabase functions deploy server

# Verify deployment
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": 1733425678000,
  "version": "1.0.1",
  "secrets": {
    "BEACON_SECRET": true,
    "APP_BASE_URL": true,
    "SUPABASE_URL": true,
    "SUPABASE_SERVICE_ROLE_KEY": true
  }
}
```

## Step 2: Set Environment Variables

In Supabase Dashboard → Settings → Edge Functions:

```bash
# BEACON_SECRET - Generate a secure random string
openssl rand -base64 32

# Then set in Supabase Dashboard:
BEACON_SECRET=your_generated_secret_here
APP_BASE_URL=https://hotmess.london
```

The following are auto-configured:
- `SUPABASE_URL` - Auto-set
- `SUPABASE_SERVICE_ROLE_KEY` - Auto-set
- `SUPABASE_ANON_KEY` - Auto-set

## Step 3: Test QR Generation

```bash
# Test RAW style
curl -o test-raw.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=raw&size=512"

# Test HOTMESS style
curl -o test-hotmess.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=hotmess&size=512"

# Open files
open test-raw.svg test-hotmess.svg
```

## Step 4: Test Beacon Resolve

```bash
# Create a test beacon in Supabase Dashboard (beacons_a670c824 table)
# Then test resolve:
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/l/YOUR_BEACON_CODE
```

## Troubleshooting

### Import Errors (Module not found)

If you see "Module not found" errors, ensure all imports use `.ts` or `.tsx` extensions:

```typescript
// ❌ Wrong
import qrRoutesApp from "./routes/qr";

// ✅ Correct
import qrRoutesApp from "./routes/qr.ts";
```

This is already fixed in the deployed code.

### BEACON_SECRET Not Set

If QR generation fails with "Server configuration error":

1. Go to Supabase Dashboard
2. Settings → Edge Functions → Secrets
3. Add `BEACON_SECRET` with a secure random value

### CORS Errors

All routes have CORS enabled. If you still see CORS errors, check that:
- Routes use `cors()` middleware
- Requests include proper headers

## Monitoring

View logs in Supabase Dashboard:
- Edge Functions → server → Logs
- Real-time error monitoring
- Request/response inspection

---

**Need help?** Check the logs or contact support.
EOF

echo "📄 Creating LICENSE..."

cat > "$PACKAGE_DIR/LICENSE" << 'EOF'
MIT License

Copyright (c) 2025 HOTMESS LONDON

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

echo ""
echo "✅ Package created: $PACKAGE_DIR/"
echo ""
echo "📦 Contents:"
find "$PACKAGE_DIR" -type f | sort

echo ""
echo "🚀 Next steps:"
echo ""
echo "1. Copy this package to your laptop HOTMESS-LONDON1 directory"
echo "2. Run these commands:"
echo ""
echo "   cd HOTMESS-LONDON1"
echo "   git add ."
echo "   git commit -m '🔥 HOTMESS QR Engine - Complete deployment'"
echo "   git remote add origin https://github.com/SICQR/HOTMESS-LONDON1.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Supabase:"
echo ""
echo "   supabase link --project-ref rfoftonnlwudilafhfkl"
echo "   supabase functions deploy server"
echo ""
echo "🔥 Done!"
