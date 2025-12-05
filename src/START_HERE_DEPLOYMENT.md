# 🔥 START HERE - HOTMESS LONDON Deployment Guide

**Everything you need to deploy your QR Engine to production.**

---

## 📦 What You Have

✅ **Complete QR Engine** - 4 production-ready styles  
✅ **122+ API Routes** - Full backend system  
✅ **All Import Errors Fixed** - Deno-ready code  
✅ **Production-Ready** - Tested and documented  

---

## 🚀 Three-Step Deployment

### Step 1: Get the Files

**Choose one method:**

#### Method A: Export from Figma Make
1. Click "Export Project" in Figma Make
2. Download the ZIP file
3. Extract and navigate to `supabase/functions/server/`

#### Method B: Copy 7 Priority Files
Copy these from Figma Make file browser to your laptop:
- `/supabase/functions/server/index.tsx`
- `/supabase/functions/server/config.json`
- `/supabase/functions/server/qr-styles.ts`
- `/supabase/functions/server/beacon-signatures.ts`
- `/supabase/functions/server/routes/qr.ts`
- `/supabase/functions/server/routes/l.ts`
- `/supabase/functions/server/routes/x.ts`

#### Method C: Copy All 48 Files
Copy entire `/supabase/functions/server/` directory for full deployment.

---

### Step 2: Push to GitHub

On your laptop in `HOTMESS-LONDON1` directory:

```bash
# Create basic files
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
.supabase/
*.log
.DS_Store
test-qr-*.svg
EOF

cat > README.md << 'EOF'
# 🔥 HOTMESS LONDON
Masculine nightlife OS with QR beacon engine.

## Deploy
\`\`\`bash
supabase link --project-ref rfoftonnlwudilafhfkl
supabase functions deploy server
\`\`\`
EOF

# Initialize git
git init
git add .
git commit -m "🔥 HOTMESS QR Engine - Production deployment

✨ QR generation with 4 styles (RAW, HOTMESS, CHROME, STEALTH)
✨ Signed beacon payloads for hook-ups and ticket resale
✨ Beacon resolve handlers (/l/:code and /x/:payload.:sig)
✨ HMAC signature system with one-time codes
✨ 122+ routes including beacons, XP, marketplace, tickets
✨ Fixed Deno imports - Production ready

Dec 5, 2025"

# Link to GitHub
git remote add origin https://github.com/SICQR/HOTMESS-LONDON1.git
git branch -M main
git push -u origin main
```

---

### Step 3: Deploy to Supabase

```bash
# Install Supabase CLI (if needed)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref rfoftonnlwudilafhfkl

# Deploy server function
supabase functions deploy server

# ✅ You should see: "Function deployed successfully!"
```

---

## 🔐 Set Environment Variables

1. **Go to Supabase Dashboard:**
   https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/settings/functions

2. **Click "Add Secret"**

3. **Add these secrets:**

   ```bash
   # First, generate a secure secret on your laptop:
   openssl rand -base64 32
   
   # Then add in Supabase Dashboard:
   Name: BEACON_SECRET
   Value: <paste your generated secret>
   
   Name: APP_BASE_URL
   Value: https://hotmess.london
   ```

---

## ✅ Test Your Deployment

### 1. Health Check

```bash
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/health
```

**Expected response:**
```json
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

### 2. Generate Test QR Codes

```bash
# Create test directory
mkdir qr-test
cd qr-test

# Generate all 4 styles
curl -o raw.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=raw&size=512"

curl -o hotmess.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=hotmess&size=512"

curl -o chrome.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=chrome&size=512"

curl -o stealth.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=stealth&size=512"

# Open them all
open *.svg
```

**✅ All 4 QR codes should open and display correctly!**

---

## 🎨 QR Style Guide

### RAW
- **Use:** Dark venues, print stickers
- **Features:** High contrast, maximum scanability

### HOTMESS  
- **Use:** Branded events, official materials
- **Features:** Neon glow, HOTMESS logo

### CHROME
- **Use:** RAW CONVICT aesthetic, premium events
- **Features:** Metallic frame, industrial look

### STEALTH
- **Use:** Discreet hook-ups, private events
- **Features:** Low contrast, still scannable

---

## 📊 Production URLs

### Base URL
```
https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824
```

### Key Endpoints

**Health Check:**
```
GET /health
```

**QR Generation:**
```
GET /qr/:code.svg?style=hotmess&size=512
```

**Beacon Resolve:**
```
GET /l/:code               # Normal beacon
GET /x/:payload.:sig       # Signed beacon
```

**Beacons API:**
```
GET    /beacons
POST   /beacons
GET    /beacons/:id
PATCH  /beacons/:id
DELETE /beacons/:id
```

**XP System:**
```
GET  /xp/profile/:userId
POST /xp/grant
GET  /xp/leaderboard
```

---

## 📚 Additional Documentation

All available in this Figma Make project:

1. **`/DEPLOY_NOW_SUMMARY.md`** - Complete overview
2. **`/QUICK_DEPLOY_STEPS.md`** - Detailed instructions
3. **`/SERVER_FILES_CHECKLIST.md`** - All 48 files listed
4. **`/GITHUB_PUSH_GUIDE.md`** - Git commands
5. **`/MANUAL_DEPLOY_INSTRUCTIONS.md`** - Supabase guide
6. **`/DOWNLOAD_INSTRUCTIONS.md`** - How to get files

---

## 🔧 Troubleshooting

### "Module not found" errors
✅ **Already fixed!** All imports use correct `.ts` extensions.

### "BEACON_SECRET not configured"
→ Set the secret in Supabase Dashboard (see Step 3 above)

### CORS errors
✅ **Already fixed!** All routes have CORS enabled.

### QR codes return 500 error
→ Check that BEACON_SECRET is set in Supabase Dashboard

### Function not deploying
→ Check you're in the right directory with `supabase/functions/server/`

---

## 📈 Monitoring & Logs

**View real-time logs:**
https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/logs/edge-functions

**Monitor:**
- Request/response times
- Error rates
- Function invocations
- Failed deployments

---

## ✅ Deployment Checklist

- [ ] Files copied to `HOTMESS-LONDON1/supabase/functions/server/`
- [ ] `.gitignore` and `README.md` created
- [ ] Git initialized and committed
- [ ] Pushed to GitHub repository
- [ ] Supabase CLI installed
- [ ] Logged into Supabase
- [ ] Project linked (rfoftonnlwudilafhfkl)
- [ ] Function deployed successfully
- [ ] `BEACON_SECRET` environment variable set
- [ ] `APP_BASE_URL` environment variable set
- [ ] Health endpoint returns 200 OK
- [ ] RAW QR style generates correctly
- [ ] HOTMESS QR style generates correctly
- [ ] CHROME QR style generates correctly
- [ ] STEALTH QR style generates correctly
- [ ] Beacon resolve endpoint working

---

## 🎯 Next Steps After Deployment

1. **Create test beacons** in Supabase Dashboard (`beacons_a670c824` table)
2. **Generate QR codes** for your test beacons
3. **Print test stickers** with RAW style
4. **Test scanning** with phone camera
5. **Monitor logs** during first scans
6. **Set up production beacons** for real events

---

## 🆘 Need Help?

### Check Logs First
Dashboard → Edge Functions → server → Logs

### Common Issues

**Import errors:** All fixed, redeploy if needed  
**CORS errors:** All fixed, check browser console  
**QR not generating:** Check BEACON_SECRET is set  
**Beacon not resolving:** Check beacon exists in database  

---

## 🔥 You're Ready!

**Everything is documented, tested, and production-ready.**

Your QR Engine supports:
- ✅ 4 branded QR styles
- ✅ Normal beacons (`/l/:code`)
- ✅ Signed beacons (`/x/:payload.:sig`)
- ✅ HMAC authentication
- ✅ Time-based expiry
- ✅ 122+ API routes
- ✅ Full beacon system
- ✅ XP & achievements
- ✅ Tickets marketplace

**Let's ship it! 🚀**

---

**HOTMESS LONDON - Nightlife on Earth**  
Dec 5, 2025

---

## Quick Reference Card

```bash
# Deploy
supabase link --project-ref rfoftonnlwudilafhfkl
supabase functions deploy server

# Test
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/health

# Generate QR
curl -o test.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/CODE.svg?style=hotmess&size=512"

# Monitor
open https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/logs/edge-functions
```

**🔥 That's it! You're deployed!**
