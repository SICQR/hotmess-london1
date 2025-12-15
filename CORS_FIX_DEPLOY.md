# CORS Fix - Deploy Now

## The Problems

### Problem 1: CORS Headers Missing on DELETE
The RIGHT NOW Edge Function was missing CORS headers on the DELETE response, causing requests from the Figma iframe to fail.

```
Access to fetch at 'https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/right-now?city=London' 
from origin 'https://dd4745b2-0e3e-477a-8d6c-02e08c818d53-v2-figmaiframepreview.figma.site' 
has been blocked by CORS policy
```

### Problem 2: Missing apikey Header
The client wasn't sending the Supabase `apikey` header, causing 401 Unauthorized errors.

```
GET https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/right-now?city=London 401 (Unauthorized)
```

## What I Fixed

### Backend Fix (Needs Deploy)
Updated `/supabase/functions/right-now/index.ts`:

1. **DELETE response now includes CORS headers**:
   ```typescript
   return new Response(null, { 
     status: 204,
     headers: {
       'Access-Control-Allow-Origin': '*',
     },
   })
   ```

### Frontend Fix (Already Live)
Updated `/lib/rightNowClient.ts`:

2. **All requests now include apikey header**:
   ```typescript
   headers: {
     'Content-Type': 'application/json',
     'apikey': publicAnonKey,  // ← Added this
     ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
   }
   ```

## Deploy the Backend Fix

### Option 1: Supabase CLI (Recommended)

```bash
# Make sure you're in the project root
cd /path/to/hotmess-london

# Deploy just the right-now function
npx supabase functions deploy right-now

# Or deploy all functions
npx supabase functions deploy
```

### Option 2: Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl
2. Click **Edge Functions** in sidebar
3. Click **right-now** function
4. Click **Deploy**
5. Copy/paste the contents of `/supabase/functions/right-now/index.ts`
6. Click **Deploy Function**

### Option 3: GitHub Actions (if set up)

Push to main branch - the CI/CD pipeline should auto-deploy.

## Test After Deploy

1. **Refresh the app** in Figma
2. **Click on homepage**: Scroll to bottom → "RIGHT NOW Testing"
3. **Click "Live Feed"**
4. **Check console**: Should see successful requests instead of CORS errors

### Expected Console (Good)

```
✅ Fetching RIGHT NOW posts...
✅ Loaded 15 posts from London
```

### Previous Console (Bad)

```
❌ Access to fetch... blocked by CORS policy
❌ No 'Access-Control-Allow-Origin' header is present
```

## What This Fixes

- ✅ RIGHT NOW feed loads
- ✅ Post creation works
- ✅ Post deletion works
- ✅ Realtime updates work
- ✅ 3D globe populates

## Files Changed

- `/supabase/functions/right-now/index.ts` - Added CORS to DELETE response

## Deploy Command (Quick Copy-Paste)

```bash
npx supabase functions deploy right-now
```

---

**Status**: Ready to deploy
**Priority**: HIGH - Blocks all RIGHT NOW functionality
**Time**: ~30 seconds to deploy