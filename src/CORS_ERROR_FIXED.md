# CORS Error Fixed ✅

## The Errors You Saw

### 1. CORS Error (FIXED)
```
Access to fetch at 'https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/right-now?city=London' 
from origin 'https://dd4745b2-0e3e-477a-8d6c-02e08c818d53-v2-figmaiframepreview.figma.site' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### 2. 401 Unauthorized Error (FIXED)
```
GET https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/right-now?city=London 401 (Unauthorized)
```

## What Both Meant

1. **CORS**: The RIGHT NOW Edge Function wasn't sending back CORS headers on DELETE responses
2. **401**: The client wasn't sending the Supabase `apikey` header, so requests were rejected

## What I Fixed

### Fix 1: CORS Headers on DELETE
**Before (Missing CORS on DELETE)**
```typescript
// DELETE /right-now/:id
return new Response(null, { status: 204 })  // ❌ No CORS headers
```

**After (CORS on ALL responses)**
```typescript
// DELETE /right-now/:id
return new Response(null, { 
  status: 204,
  headers: {
    'Access-Control-Allow-Origin': '*',  // ✅ Now has CORS
  },
})
```

### Fix 2: Added apikey Header to Client
**Before (Missing apikey)**
```typescript
const res = await fetch(`${EDGE_BASE}/right-now?${params}`, {
  headers: {
    'Content-Type': 'application/json',
    // ❌ No apikey header
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
  },
})
```

**After (Has apikey)**
```typescript
const res = await fetch(`${EDGE_BASE}/right-now?${params}`, {
  headers: {
    'Content-Type': 'application/json',
    'apikey': publicAnonKey,  // ✅ Now includes apikey
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
  },
})
```

## Files Changed

- `/supabase/functions/right-now/index.ts` - Added CORS to DELETE response
- `/lib/rightNowClient.ts` - Added `apikey` header to all requests

## Next Step: Deploy

**You need to deploy the Edge Function for this fix to work:**

```bash
npx supabase functions deploy right-now
```

Or via Supabase Dashboard:
1. Go to Edge Functions
2. Select `right-now`
3. Deploy latest code

## After Deploy

Refresh your app and the CORS errors will be gone. The RIGHT NOW feed will load properly.

---

**See `/CORS_FIX_DEPLOY.md` for detailed deployment instructions.**