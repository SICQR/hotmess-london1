# 🔥 HOTMESS LONDON - Quick Deploy Steps

## Option 1: Run the Package Creator Script (Recommended)

If you have shell access to this Figma Make environment:

```bash
# Make script executable
chmod +x CREATE_GITHUB_PACKAGE.sh

# Run it
./CREATE_GITHUB_PACKAGE.sh

# This creates: hotmess-london-package/
# Copy that folder to your laptop
```

---

## Option 2: Manual File Copy (If script doesn't work)

Copy these 7 critical files from Figma Make to your laptop `HOTMESS-LONDON1` directory:

### Structure:
```
HOTMESS-LONDON1/
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx
│           ├── config.json
│           ├── qr-styles.ts
│           ├── beacon-signatures.ts
│           └── routes/
│               ├── qr.ts
│               ├── l.ts
│               └── x.ts
├── README.md
├── .gitignore
└── DEPLOYMENT.md
```

### Files to copy:

1. **`/supabase/functions/server/index.tsx`** - Main server (122+ routes)
2. **`/supabase/functions/server/config.json`** - Auth config
3. **`/supabase/functions/server/qr-styles.ts`** - QR generation
4. **`/supabase/functions/server/beacon-signatures.ts`** - HMAC signing
5. **`/supabase/functions/server/routes/qr.ts`** - QR API
6. **`/supabase/functions/server/routes/l.ts`** - Beacon resolve
7. **`/supabase/functions/server/routes/x.ts`** - Signed beacons

---

## Option 3: Copy ALL Server Files (Full Deployment)

If you want the complete 40+ file server:

```bash
# Copy entire server directory
cp -r /path/to/figma-make/supabase/functions/server HOTMESS-LONDON1/supabase/functions/
```

---

## After Copying Files to Your Laptop

### On Your Laptop Terminal:

```bash
# Navigate to project
cd /path/to/HOTMESS-LONDON1

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
.supabase/
*.log
.DS_Store
test-qr-*.svg
EOF

# Create README.md (copy from GITHUB_PUSH_GUIDE.md)

# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "🔥 HOTMESS QR Engine - Complete deployment

✨ QR generation with 4 styles (RAW, HOTMESS, CHROME, STEALTH)
✨ Signed beacon payloads for hook-ups and ticket resale
✨ Beacon resolve handlers (/l/:code and /x/:payload.:sig)
✨ HMAC signature system
✨ 122+ routes including beacons, XP, marketplace, tickets
✨ Fixed Deno import paths with .ts extensions

Dec 5, 2025"

# Link to GitHub
git remote add origin https://github.com/SICQR/HOTMESS-LONDON1.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Deploy to Supabase

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref rfoftonnlwudilafhfkl

# Deploy!
supabase functions deploy server

# Test
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": 1733425678000,
  "version": "1.0.1"
}
```

---

## Set Environment Variable

In Supabase Dashboard → Settings → Edge Functions → Secrets:

```bash
# Generate a secret
openssl rand -base64 32

# Add to Supabase:
BEACON_SECRET=your_generated_secret_here
APP_BASE_URL=https://hotmess.london
```

---

## Test QR Generation

```bash
# Generate test QR codes
curl -o raw.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=raw&size=512"

curl -o hotmess.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=hotmess&size=512"

curl -o chrome.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=chrome&size=512"

curl -o stealth.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=stealth&size=512"

# Open them
open *.svg
```

---

## ✅ You're Done!

**GitHub:** https://github.com/SICQR/HOTMESS-LONDON1  
**Supabase:** https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl  
**Health Check:** https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/health

---

**🔥 HOTMESS LONDON - Nightlife on Earth**
