#!/bin/bash

# 🔥 HOTMESS LONDON - Create Deployment ZIP
# Creates a ready-to-deploy package with all server files

echo "🔥 Creating HOTMESS LONDON deployment package..."

# Create temp directory
TEMP_DIR="hotmess-london-deploy"
ZIP_NAME="HOTMESS-LONDON-DEPLOY.zip"

# Clean up any existing files
rm -rf "$TEMP_DIR"
rm -f "$ZIP_NAME"

# Create directory structure
mkdir -p "$TEMP_DIR/supabase/functions/server/routes"
mkdir -p "$TEMP_DIR/docs"

echo "📦 Copying server files..."

# Copy main server file
if [ -f "supabase/functions/server/index.tsx" ]; then
    cp "supabase/functions/server/index.tsx" "$TEMP_DIR/supabase/functions/server/"
    echo "  ✅ index.tsx"
else
    echo "  ⚠️  index.tsx not found"
fi

# Copy config
if [ -f "supabase/functions/server/config.json" ]; then
    cp "supabase/functions/server/config.json" "$TEMP_DIR/supabase/functions/server/"
    echo "  ✅ config.json"
else
    echo "  ⚠️  config.json not found"
fi

# Copy QR system files
echo "📦 Copying QR Engine files..."
cp "supabase/functions/server/qr-styles.ts" "$TEMP_DIR/supabase/functions/server/" 2>/dev/null && echo "  ✅ qr-styles.ts" || echo "  ⚠️  qr-styles.ts not found"
cp "supabase/functions/server/beacon-signatures.ts" "$TEMP_DIR/supabase/functions/server/" 2>/dev/null && echo "  ✅ beacon-signatures.ts" || echo "  ⚠️  beacon-signatures.ts not found"
cp "supabase/functions/server/routes/qr.ts" "$TEMP_DIR/supabase/functions/server/routes/" 2>/dev/null && echo "  ✅ routes/qr.ts" || echo "  ⚠️  routes/qr.ts not found"
cp "supabase/functions/server/routes/l.ts" "$TEMP_DIR/supabase/functions/server/routes/" 2>/dev/null && echo "  ✅ routes/l.ts" || echo "  ⚠️  routes/l.ts not found"
cp "supabase/functions/server/routes/x.ts" "$TEMP_DIR/supabase/functions/server/routes/" 2>/dev/null && echo "  ✅ routes/x.ts" || echo "  ⚠️  routes/x.ts not found"

# Copy all other server files (.tsx and .ts)
echo "📦 Copying all API modules..."
for file in supabase/functions/server/*.tsx; do
    if [ -f "$file" ]; then
        cp "$file" "$TEMP_DIR/supabase/functions/server/"
        echo "  ✅ $(basename $file)"
    fi
done

for file in supabase/functions/server/*.ts; do
    if [ -f "$file" ] && [ "$(basename $file)" != "earth-routes.ts" ] && [ "$(basename $file)" != "auth-middleware.ts" ] && [ "$(basename $file)" != "make-integrations.ts" ]; then
        if [ ! -f "$TEMP_DIR/supabase/functions/server/$(basename $file)" ]; then
            cp "$file" "$TEMP_DIR/supabase/functions/server/"
            echo "  ✅ $(basename $file)"
        fi
    fi
done

# Copy remaining .ts files
cp "supabase/functions/server/earth-routes.ts" "$TEMP_DIR/supabase/functions/server/" 2>/dev/null
cp "supabase/functions/server/auth-middleware.ts" "$TEMP_DIR/supabase/functions/server/" 2>/dev/null
cp "supabase/functions/server/make-integrations.ts" "$TEMP_DIR/supabase/functions/server/" 2>/dev/null

echo "📄 Creating documentation..."

# Create README
cat > "$TEMP_DIR/README.md" << 'EOF'
# 🔥 HOTMESS LONDON

**Masculine nightlife OS for queer men 18+**

Location-based social operating system with QR beacon engine.

## ✨ What's Included

- **QR Engine** - 4 production-ready styles (RAW, HOTMESS, CHROME, STEALTH)
- **Beacon System** - Location-based check-ins with XP rewards
- **Signed Payloads** - HMAC authentication for hook-ups and ticket resale
- **Complete API** - 122+ routes including tickets, marketplace, XP, social features

## 🚀 Quick Deploy

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login and link project
supabase login
supabase link --project-ref rfoftonnlwudilafhfkl

# 3. Deploy!
supabase functions deploy server

# 4. Test
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/health
```

## 🔐 Set Environment Variables

In Supabase Dashboard → Settings → Edge Functions → Secrets:

```bash
# Generate a secure secret
openssl rand -base64 32

# Add to Supabase:
BEACON_SECRET=your_generated_secret_here
APP_BASE_URL=https://hotmess.london
```

## 🧪 Test QR Generation

```bash
# Generate HOTMESS style QR
curl -o test.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=hotmess&size=512"

# Open it
open test.svg
```

## 📚 Documentation

See `/docs` folder for:
- `DEPLOYMENT.md` - Complete deployment guide
- `API_REFERENCE.md` - API endpoints documentation
- `QR_STYLES.md` - QR code style guide

## 🎯 File Structure

```
supabase/functions/server/
├── index.tsx                  # Main server (122+ routes)
├── config.json                # Auth configuration
├── qr-styles.ts               # QR rendering engine
├── beacon-signatures.ts       # HMAC signing system
├── routes/
│   ├── qr.ts                  # QR generation API
│   ├── l.ts                   # Normal beacon resolve
│   └── x.ts                   # Signed beacon resolve
└── ... (40+ API modules)
```

---

**🔥 Ready to deploy!**

HOTMESS LONDON - Nightlife on Earth  
Dec 5, 2025
EOF

# Create deployment guide
cat > "$TEMP_DIR/docs/DEPLOYMENT.md" << 'EOF'
# 🔥 Deployment Guide

## Prerequisites

- Supabase account with project created
- Supabase CLI installed: `npm install -g supabase`
- Project ID: `rfoftonnlwudilafhfkl`

## Step 1: Deploy to Supabase

```bash
# Navigate to this directory
cd /path/to/hotmess-london-deploy

# Login
supabase login

# Link to project
supabase link --project-ref rfoftonnlwudilafhfkl

# Deploy server function
supabase functions deploy server

# Expected output:
# Deploying function server...
# Function deployed successfully!
```

## Step 2: Set Environment Variables

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl
2. Navigate to: Settings → Edge Functions → Secrets
3. Add the following secrets:

```bash
# Generate a secure secret first:
openssl rand -base64 32

# Then add in Supabase Dashboard:
BEACON_SECRET=<paste_your_generated_secret>
APP_BASE_URL=https://hotmess.london
```

The following are auto-configured (no need to set):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

## Step 3: Verify Deployment

```bash
# Test health endpoint
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/health

# Expected response:
{
  "status": "ok",
  "timestamp": 1733425678000,
  "version": "1.0.1",
  "secrets": {
    "BEACON_SECRET": true,
    "APP_BASE_URL": true
  }
}
```

## Step 4: Test QR Generation

```bash
# Generate RAW style
curl -o raw.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=raw&size=512"

# Generate HOTMESS style
curl -o hotmess.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=hotmess&size=512"

# Generate CHROME style
curl -o chrome.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=chrome&size=512"

# Generate STEALTH style
curl -o stealth.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=stealth&size=512"

# Open them
open *.svg
```

## Troubleshooting

### "Module not found" errors
✅ Already fixed! All imports use correct `.ts` extensions.

### "BEACON_SECRET not configured"
→ Set the secret in Supabase Dashboard (Step 2)

### CORS errors
✅ Already fixed! All routes have CORS enabled.

### QR codes not generating
→ Check function logs: Dashboard → Edge Functions → server → Logs

## Monitoring

View real-time logs:
- Dashboard → Edge Functions → server → Logs
- Monitor requests, responses, and errors
- Debug any issues in real-time

---

**✅ Deployment complete!**
EOF

# Create API reference
cat > "$TEMP_DIR/docs/API_REFERENCE.md" << 'EOF'
# 🔥 API Reference

Base URL: `https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824`

## Health Check

```
GET /health
```

Returns server status and configuration.

## QR Generation

### Generate QR Code

```
GET /qr/:code.svg?style={style}&size={size}
```

**Parameters:**
- `code` - Beacon code (alphanumeric)
- `style` - QR style: `raw`, `hotmess`, `chrome`, `stealth` (default: `raw`)
- `size` - QR size in pixels (default: `512`)

**Example:**
```bash
curl -o qr.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/ABC123.svg?style=hotmess&size=512"
```

### Generate Signed QR Code

```
GET /qr/signed/:payload.:signature.svg?style={style}&size={size}
```

For encrypted one-time codes (hook-ups, resale).

## Beacon Resolve

### Normal Beacon

```
GET /l/:code
```

Resolves a beacon and redirects to appropriate page.

**Example:**
```bash
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/l/ABC123
```

### Signed Beacon

```
GET /x/:payload.:signature
```

Resolves a signed beacon (hook-up, resale, private room).

## Beacons API

### List Beacons
```
GET /beacons
```

### Create Beacon
```
POST /beacons
```

### Get Beacon
```
GET /beacons/:id
```

### Update Beacon
```
PATCH /beacons/:id
```

### Delete Beacon
```
DELETE /beacons/:id
```

## XP System

### Get Profile
```
GET /xp/profile/:userId
```

### Grant XP
```
POST /xp/grant
```

### Leaderboard
```
GET /xp/leaderboard
```

## Tickets Marketplace

### List Tickets
```
GET /tickets/listings
```

### Create Listing
```
POST /tickets/listings
```

### Get Listing
```
GET /tickets/listings/:id
```

### Update Listing Status
```
PATCH /tickets/listings/:id/status
```

---

**More endpoints available!** See `index.tsx` for complete route list.
EOF

# Create QR styles guide
cat > "$TEMP_DIR/docs/QR_STYLES.md" << 'EOF'
# 🎨 QR Code Style Guide

HOTMESS QR Engine includes 4 production-ready styles.

## 1. RAW

**Use case:** High-contrast, print-safe (dark backrooms, stickers)

**Features:**
- Pure black & white
- Maximum contrast
- Best for low-light scanning
- Print-optimized

**Example:**
```bash
curl -o raw.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/CODE.svg?style=raw&size=512"
```

## 2. HOTMESS

**Use case:** Branded codes with neon aesthetic

**Features:**
- Hot pink glow effect
- HOTMESS logo in center
- Softened corners
- Brand-forward design

**Example:**
```bash
curl -o hotmess.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/CODE.svg?style=hotmess&size=512"
```

## 3. CHROME

**Use case:** RAW CONVICT aesthetic (metallic, gritty)

**Features:**
- Chrome metal frame
- Monochrome gradient
- Industrial look
- Premium feel

**Example:**
```bash
curl -o chrome.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/CODE.svg?style=chrome&size=512"
```

## 4. STEALTH

**Use case:** Discreet codes (hook-ups, private events)

**Features:**
- Low contrast
- Still scannable
- Subtle appearance
- Privacy-focused

**Example:**
```bash
curl -o stealth.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/CODE.svg?style=stealth&size=512"
```

## Size Recommendations

- **Mobile screens:** 256-512px
- **Print (stickers):** 512-1024px
- **Posters:** 1024-2048px
- **Digital displays:** 512-1024px

## Testing

Generate all 4 styles:

```bash
for style in raw hotmess chrome stealth; do
  curl -o "$style.svg" "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=$style&size=512"
done

open *.svg
```

---

**🔥 All styles are production-ready!**
EOF

# Create .gitignore
cat > "$TEMP_DIR/.gitignore" << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment
.env
.env.local
.env.*.local

# Supabase
.supabase/
supabase/.branches/
supabase/.temp/

# Test files
test-qr-*.svg
qr-test-*.svg
*.test.svg

# IDE
.vscode/
.idea/
*.swp
.DS_Store

# Logs
*.log

# Temp
*.tmp
.cache/
EOF

# Create LICENSE
cat > "$TEMP_DIR/LICENSE" << 'EOF'
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

echo "📦 Creating ZIP archive..."

# Create the zip file
zip -r "$ZIP_NAME" "$TEMP_DIR"

# Clean up temp directory
rm -rf "$TEMP_DIR"

echo ""
echo "✅ ZIP created: $ZIP_NAME"
echo ""
echo "📦 Package contents:"
unzip -l "$ZIP_NAME"
echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "Next steps:"
echo "1. Download $ZIP_NAME"
echo "2. Extract on your laptop"
echo "3. cd into hotmess-london-deploy/"
echo "4. Run: supabase link --project-ref rfoftonnlwudilafhfkl"
echo "5. Run: supabase functions deploy server"
echo ""
echo "🔥 Done!"
