# 🔥 HOTMESS LONDON - Manual Deployment Instructions

The GitHub MCP connector doesn't have write access to the repository, so you'll need to deploy manually via the Supabase Dashboard.

---

## ✅ **GOOD NEWS: Deployment is simple!**

You don't need to push to GitHub. You can deploy directly from your local files to Supabase.

---

## 🚀 **Option 1: Deploy via Supabase Dashboard (Recommended)**

### Step 1: Copy the Server Function Files

All your server function files are ready in:
```
/supabase/functions/server/
```

### Step 2: Go to Supabase Dashboard

Open: https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/functions

### Step 3: Deploy Using CLI or Dashboard

**Method A: Using Supabase CLI (if installed)**
```bash
# Link to project
supabase link --project-ref rfoftonnlwudilafhfkl

# Deploy server function
supabase functions deploy server

# Done!
```

**Method B: Using Dashboard (no CLI needed)**
1. Click "New Function"
2. Name: `server`
3. Upload/paste your `index.tsx` file
4. Click "Deploy"
5. Upload the rest of the files one by one

---

## 🧪 **Option 2: Test Import Paths First (Critical Fix Already Applied)**

I've already fixed the Deno import errors in `/supabase/functions/server/index.tsx`:

✅ Fixed: `./earth-routes` → `./earth-routes.ts`  
✅ Fixed: `./make-integrations` → `./make-integrations.ts`  
✅ Fixed: `./routes/qr` → `./routes/qr.ts`  
✅ Fixed: `./routes/l` → `./routes/l.ts`  
✅ Fixed: `./routes/x` → `./routes/x.ts`  

These were causing the "Module not found" errors.

---

## 📁 **Files to Deploy**

### Core Files (Required):
- `supabase/functions/server/index.tsx` (main server)
- `supabase/functions/server/config.json` (auth config)

### QR System (Required for QR codes):
- `supabase/functions/server/routes/qr.ts`
- `supabase/functions/server/routes/l.ts`
- `supabase/functions/server/routes/x.ts`
- `supabase/functions/server/qr-styles.ts`
- `supabase/functions/server/beacon-signatures.ts`

### Other API Files (40+ files):
- All other `.tsx` and `.ts` files in `/supabase/functions/server/`

---

## 🔥 **Fastest Path: Download & Deploy**

###  Step 1: Download Files from Figma Make

Since you're in Figma Make, you can either:
- Export the project files
- Or copy-paste each file individually from the file browser

### Step 2: Deploy to Supabase

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref rfoftonnlwudilafhfkl

# Deploy
cd /path/to/your/project
supabase functions deploy server
```

---

## ✅ **Verify Deployment**

After deployment, test the health endpoint:

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
    "APP_BASE_URL": true,
    "SUPABASE_URL": true,
    "SUPABASE_SERVICE_ROLE_KEY": true
  }
}
```

---

## 🧪 **Test QR Generation**

```bash
curl -o test.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=hotmess&size=512"

open test.svg  # macOS
xdg-open test.svg  # Linux
```

---

## 🔧 **Alternative: Use the Deploy Scripts**

The deploy scripts (`DEPLOY.sh`, `PUSH_TO_GITHUB_SIMPLE.sh`) are still available, but they require:
1. Git installed
2. GitHub Personal Access Token
3. Supabase CLI installed

If you prefer this method, follow the instructions in `/DEPLOYMENT_GUIDE.md`.

---

## 🎯 **Summary**

**Easiest path:**
1. Install Supabase CLI: `npm install -g supabase`
2. Navigate to project directory
3. Run: `supabase link --project-ref rfoftonnlwudilafhfkl`
4. Run: `supabase functions deploy server`
5. Test: `curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/health`

**That's it!** 🔥

---

**Need help?** Check:
- Supabase Functions Docs: https://supabase.com/docs/guides/functions
- Project Dashboard: https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl
- Function Logs: https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/logs/edge-functions

---

**🔥 HOTMESS LONDON - Nightlife on Earth**
