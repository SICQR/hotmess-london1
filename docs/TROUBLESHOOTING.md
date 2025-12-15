# 🔧 TROUBLESHOOTING GUIDE — HOTMESS LONDON

**Date:** December 9, 2025

---

## 🚨 **COMMON ERRORS & FIXES**

---

### **❌ ERROR: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"**

**What it means:**
- Edge Function not deployed
- API endpoint returning HTML (404 page) instead of JSON

**Where it appears:**
- RIGHT NOW Feed
- Concierge Chat
- Any component calling Supabase Edge Functions

**Fix:**

```bash
# 1. Check which functions are deployed
supabase functions list

# 2. Deploy missing function
supabase functions deploy right-now-feed --no-verify-jwt
supabase functions deploy hotmess-concierge --no-verify-jwt

# 3. Verify deployment
supabase functions list
# Should show "Active" status
```

**Temporary workaround:**
- Components now fall back to mock data automatically
- No user-facing error, just console warning
- Deploy functions when ready for production

---

### **❌ ERROR: "OPENAI_API_KEY not found"**

**What it means:**
- Environment variable not set in Supabase

**Where it appears:**
- Concierge Edge Function
- Any AI-powered features

**Fix:**

```bash
# 1. Check if secret exists
supabase secrets list

# 2. Set the secret
supabase secrets set OPENAI_API_KEY=sk-...

# 3. Redeploy function
supabase functions deploy hotmess-concierge --no-verify-jwt
```

**Alternative (via Supabase Dashboard):**
1. Go to: Supabase Dashboard → Settings → Edge Functions
2. Click "Add Secret"
3. Name: `OPENAI_API_KEY`
4. Value: `sk-...`
5. Save
6. Redeploy function

---

### **❌ ERROR: "Failed to fetch" or "Network Error"**

**What it means:**
- CORS issue
- Function not responding
- Network connectivity problem

**Where it appears:**
- Any API call from frontend

**Fix:**

**1. Check CORS headers in Edge Function:**
```typescript
function cors(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  return new Response(res.body, { status: res.status, headers });
}
```

**2. Check OPTIONS handling:**
```typescript
if (req.method === "OPTIONS") {
  return cors(new Response("ok", { status: 200 }));
}
```

**3. Verify function is running:**
```bash
supabase functions serve right-now-feed
# Or check logs:
supabase functions logs right-now-feed
```

---

### **❌ ERROR: "projectId is not defined"**

**What it means:**
- Missing environment variable
- Import path wrong

**Where it appears:**
- Components using Supabase client

**Fix:**

**1. Check environment variables:**
```bash
# Verify .env file exists
cat .env

# Should contain:
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**2. Restart dev server:**
```bash
npm run dev
```

**3. Check import:**
```typescript
import { projectId, publicAnonKey } from '../utils/supabase/info';
```

---

### **❌ ERROR: "Cannot read property 'map' of undefined"**

**What it means:**
- API returned unexpected structure
- Data property missing

**Where it appears:**
- Feed components
- List rendering

**Fix:**

**1. Add null checks:**
```typescript
const items = data?.items || [];
items.map(item => ...)
```

**2. Add default values:**
```typescript
const { data } = await fetch(...);
const items = data?.items ?? [];
```

**3. Add error boundary:**
```typescript
try {
  const json = await res.json();
  setItems(json.items || []);
} catch (err) {
  setItems(getMockItems()); // Fallback
}
```

---

### **❌ ERROR: "Hydration failed"**

**What it means:**
- Server/client HTML mismatch
- Random values in SSR

**Where it appears:**
- React components with random IDs
- Components with Date.now()

**Fix:**

**1. Use useEffect for client-only code:**
```typescript
const [id, setId] = useState<string | null>(null);

useEffect(() => {
  setId(`id-${Date.now()}`);
}, []);
```

**2. Use stable keys:**
```typescript
// Bad:
<div key={Math.random()}>

// Good:
<div key={item.id}>
```

---

### **❌ ERROR: "Table 'right_now_posts' does not exist"**

**What it means:**
- Database schema not created
- Migration not run

**Where it appears:**
- Edge Functions querying database
- Supabase client queries

**Fix:**

```sql
-- Create table (example structure)
CREATE TABLE right_now_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  intent TEXT NOT NULL,
  text TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT,
  room_mode TEXT NOT NULL,
  crowd_count INT,
  host_beacon_id TEXT,
  show_on_globe BOOLEAN DEFAULT TRUE,
  allow_anon_signals BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_right_now_posts_expires ON right_now_posts(expires_at);
CREATE INDEX idx_right_now_posts_city ON right_now_posts(city);
CREATE INDEX idx_right_now_posts_created ON right_now_posts(created_at);
```

**See full schema in:** `/docs/RIGHT_NOW_DEPLOYMENT_GUIDE.md`

---

### **❌ ERROR: "Invalid CSS property value"**

**What it means:**
- Tailwind class conflict
- CSS variable not defined

**Where it appears:**
- Components with custom styles

**Fix:**

**1. Check Tailwind config:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'hotmess-pink': '#ff1694',
        'hotmess-red': '#FF1744',
      }
    }
  }
}
```

**2. Check global CSS:**
```css
/* styles/globals.css */
.hm-panel {
  /* ... */
}
```

**3. Use inline styles for dynamic values:**
```typescript
<div style={{ borderColor: color, color }}>
```

---

## 🔍 **DEBUGGING CHECKLIST**

### **When something breaks:**

1. **Check browser console**
   - F12 → Console tab
   - Look for red errors
   - Copy full error message

2. **Check network tab**
   - F12 → Network tab
   - Filter: Fetch/XHR
   - Look for failed requests (red)
   - Check response (should be JSON, not HTML)

3. **Check Supabase logs**
   ```bash
   supabase functions logs right-now-feed
   supabase functions logs hotmess-concierge
   ```

4. **Check environment variables**
   ```bash
   cat .env
   supabase secrets list
   ```

5. **Restart everything**
   ```bash
   # Kill dev server
   Ctrl+C
   
   # Restart
   npm run dev
   ```

---

## 🚀 **DEPLOYMENT ISSUES**

### **Build fails:**

```bash
# Clear cache
rm -rf node_modules .next dist
npm install
npm run build
```

### **Vercel deployment fails:**

```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing environment variables
# - Import path errors
# - TypeScript errors

# Fix locally first:
npm run build
# Should succeed before deploying
```

### **Edge Function won't deploy:**

```bash
# Check Supabase project linked
supabase status

# Link if needed
supabase link --project-ref your-project-id

# Deploy with verbose logging
supabase functions deploy right-now-feed --debug
```

---

## 📞 **STILL STUCK?**

### **Quick checks:**

1. ✅ Node version: `node -v` (should be 18+)
2. ✅ NPM version: `npm -v` (should be 9+)
3. ✅ Supabase CLI: `supabase --version`
4. ✅ Git status: `git status` (no uncommitted changes)
5. ✅ .env file exists and has correct values

### **Useful commands:**

```bash
# Clear everything and start fresh
rm -rf node_modules .next dist
npm install
npm run dev

# Check for TypeScript errors
npm run type-check

# Check for ESLint errors
npm run lint

# Build production bundle
npm run build

# Check Supabase status
supabase status

# Check function logs
supabase functions logs <function-name>
```

---

## ✅ **PREVENTION**

### **Before deploying:**

1. **Test locally:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Check all routes:**
   - Homepage: `/?route=home`
   - RIGHT NOW: `/?route=rightNowLivePage`
   - Concierge: Click pink bubble
   - Forms: Try creating post

3. **Check console:**
   - No red errors
   - Only warnings acceptable
   - Network requests succeed

4. **Check mobile:**
   - F12 → Toggle device toolbar
   - Try on phone
   - Check responsive layout

---

## 🖤 **FINAL NOTES**

**Most errors are:**
1. Missing environment variables (60%)
2. Functions not deployed (20%)
3. Database tables missing (10%)
4. Import path wrong (5%)
5. Everything else (5%)

**Before asking for help:**
1. Read error message fully
2. Check this guide
3. Check browser console
4. Check Supabase logs
5. Try restart

**Good luck! 🚀**

---

**Built with 🖤 • HOTMESS LONDON • Debug mode: ON**
