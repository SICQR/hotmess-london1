# 🔥 HOTMESS LONDON - Deployment Guide

This guide walks you through deploying the HOTMESS QR Engine and server functions.

---

## 🚀 Quick Start (3 commands)

```bash
# 1. Make scripts executable
chmod +x DEPLOY.sh PUSH_TO_GITHUB_SIMPLE.sh

# 2. Push to GitHub + Deploy to Supabase (full pipeline)
./DEPLOY.sh

# OR: Just push to GitHub (manual Supabase deploy)
./PUSH_TO_GITHUB_SIMPLE.sh
```

---

## 📋 Prerequisites

### Required:
- ✅ Git installed (`git --version`)
- ✅ GitHub account (SICQR)
- ✅ GitHub Personal Access Token (for push)

### Optional (for auto-deploy):
- Supabase CLI (`supabase --version`)

---

## 🔑 GitHub Personal Access Token

**You need a token to push to GitHub:**

1. Go to: https://github.com/settings/tokens/new
2. Name: `HOTMESS Deploy Token`
3. Expiration: `90 days` (or custom)
4. Scopes: ✅ **repo** (full control)
5. Click **Generate token**
6. **Copy the token** (you'll use this as your password)

**When pushing:**
- Username: `SICQR`
- Password: `paste your token`

---

## 📦 Option 1: Full Pipeline (Recommended)

**Pushes to GitHub AND deploys to Supabase:**

```bash
chmod +x DEPLOY.sh
./DEPLOY.sh
```

**What it does:**
1. ✅ Initializes git repository
2. ✅ Commits all files
3. ✅ Pushes to https://github.com/SICQR/HOTMESS-NEXT
4. ✅ Deploys `server` function to Supabase
5. ✅ Tests QR generation endpoints

**Requirements:**
- Git
- GitHub Personal Access Token
- Supabase CLI (optional - prompts to skip if not installed)

---

## 📤 Option 2: GitHub Only (Simple)

**Just pushes to GitHub (manual Supabase deploy):**

```bash
chmod +x PUSH_TO_GITHUB_SIMPLE.sh
./PUSH_TO_GITHUB_SIMPLE.sh
```

**What it does:**
1. ✅ Initializes git repository
2. ✅ Commits all files
3. ✅ Pushes to https://github.com/SICQR/HOTMESS-NEXT

**Then manually deploy from Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/functions
2. Click **"New Function"** → **"Deploy from GitHub"**
3. Select **HOTMESS-NEXT** repo
4. Select **server** function
5. Click **Deploy**

---

## 🧪 Testing After Deployment

### Test Health Endpoint:
```bash
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/health | jq
```

**Expected response:**
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

### Test QR Generation:

**RAW style:**
```bash
curl -o qr-raw.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=raw&size=512"
open qr-raw.svg
```

**HOTMESS style:**
```bash
curl -o qr-hotmess.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=hotmess&size=512"
open qr-hotmess.svg
```

**CHROME style:**
```bash
curl -o qr-chrome.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=chrome&size=512"
open qr-chrome.svg
```

**STEALTH style:**
```bash
curl -o qr-stealth.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=stealth&size=512"
open qr-stealth.svg
```

### Test Beacon Resolve:

**Standard beacon:**
```bash
curl "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/l/TEST123" \
  -H "Accept: application/json" | jq
```

**Signed beacon:**
```bash
# First, generate a signed payload using the Admin UI
# Then test:
curl "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/x/PAYLOAD.SIGNATURE" \
  -H "Accept: application/json" | jq
```

---

## 🔧 Troubleshooting

### Push fails with 403 error:
**Problem:** GitHub Personal Access Token missing or incorrect scopes

**Solution:**
1. Create new token: https://github.com/settings/tokens/new
2. Enable **repo** scope (full control)
3. Use token as password when pushing

---

### Push fails with "Authentication failed":
**Problem:** Incorrect username or token

**Solution:**
```bash
# Try with explicit credentials
git push https://SICQR:YOUR_TOKEN_HERE@github.com/SICQR/HOTMESS-NEXT.git main --force
```

---

### Supabase CLI not found:
**Problem:** Supabase CLI not installed

**Solution:**
```bash
# macOS
brew install supabase/tap/supabase

# npm (all platforms)
npm install -g supabase

# Verify
supabase --version
```

---

### Function deploy fails:
**Problem:** Supabase project link missing

**Solution:**
```bash
supabase link --project-ref rfoftonnlwudilafhfkl
supabase functions deploy server
```

---

### QR generation returns 500 error:
**Problem:** Missing environment secrets

**Solution:**
1. Go to: https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/settings/vault
2. Verify these secrets exist:
   - `BEACON_SECRET`
   - `APP_BASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

---

## 📊 Monitoring

### Function Logs:
https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/logs/edge-functions

### Function Invocations:
https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/functions

### Database:
https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/editor

---

## 🎯 Next Steps

After successful deployment:

1. ✅ **Test QR generation** in the Admin UI (`/admin-qr-ui`)
2. ✅ **Create test beacons** in the database
3. ✅ **Scan QR codes** to verify beacon resolve
4. ✅ **Monitor function logs** for errors
5. ✅ **Configure Night Pulse globe** with live beacon data

---

## 📞 Support

**GitHub Repo:** https://github.com/SICQR/HOTMESS-NEXT

**Supabase Project:** https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl

**Documentation:** See /README.md for full feature list

---

**🔥 HOTMESS LONDON - Nightlife on Earth**
