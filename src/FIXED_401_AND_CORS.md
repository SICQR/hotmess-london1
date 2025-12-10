# ✅ FIXED: 401 Unauthorized + CORS Errors

## Summary

Fixed **TWO critical bugs** blocking RIGHT NOW functionality:

1. **401 Unauthorized** - Client wasn't sending the Supabase `apikey` header
2. **CORS Error** - Edge Function wasn't sending CORS headers on DELETE responses

## What Was Broken

### Error 1: 401 Unauthorized
```
GET https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/right-now?city=London 401 (Unauthorized)
```

**Root Cause**: `/lib/rightNowClient.ts` wasn't sending the `apikey` header. Supabase Edge Functions require EITHER a valid JWT token OR the anon key. Without auth (when no user is logged in), requests were rejected.

### Error 2: CORS Blocked
```
Access to fetch... blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**Root Cause**: `/supabase/functions/right-now/index.ts` DELETE endpoint returned a Response without CORS headers.

## What Was Fixed

### Frontend Fix (✅ Already Live)

**File**: `/lib/rightNowClient.ts`

Added `'apikey': publicAnonKey` to all three functions:
- `fetchRightNowFeed()` - GET request
- `createRightNowPost()` - POST request  
- `deleteRightNowPost()` - DELETE request

**Before**:
```typescript
headers: {
  'Content-Type': 'application/json',
  ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
}
```

**After**:
```typescript
headers: {
  'Content-Type': 'application/json',
  'apikey': publicAnonKey,  // ← Added this!
  ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
}
```

### Backend Fix (⚠️ NEEDS DEPLOY)

**File**: `/supabase/functions/right-now/index.ts`

Added CORS headers to DELETE response (line 302):

**Before**:
```typescript
return new Response(null, { status: 204 })
```

**After**:
```typescript
return new Response(null, { 
  status: 204,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
})
```

## What Still Needs To Happen

### 🚨 YOU MUST DEPLOY THE EDGE FUNCTION

The frontend fix is already live in Figma Make, but the backend fix requires deploying the Edge Function:

```bash
npx supabase functions deploy right-now
```

**Without this deploy, you'll still see CORS errors on DELETE requests.**

## After You Deploy

1. Refresh the Figma Make app
2. Go to Homepage → scroll to bottom → "RIGHT NOW Testing"
3. Click "Live Feed"
4. Should see posts load successfully (no 401 errors)
5. Should be able to delete posts (no CORS errors)

## Files Changed

- ✅ `/lib/rightNowClient.ts` - Added `apikey` header (Frontend - Live)
- ⚠️ `/supabase/functions/right-now/index.ts` - Added CORS headers (Backend - Needs Deploy)

## Notes

### About the apikey Header

Supabase Edge Functions use Row Level Security (RLS) and require authentication via:
- **Option 1**: `Authorization: Bearer <user-jwt-token>` (for logged-in users)
- **Option 2**: `apikey: <anon-key>` (for public/anonymous access)

The RIGHT NOW GET endpoint is public (doesn't require a logged-in user), but Supabase still needs the `apikey` header to know this is a legitimate request.

When a user IS logged in, we send BOTH:
- `apikey` - Proves the request is from our app
- `Authorization` - Identifies the specific user

### Pattern Inconsistency Across Codebase

I found **50+ other fetch calls** in the codebase that use this pattern:
```typescript
headers: { Authorization: `Bearer ${publicAnonKey}` }
```

This is **WRONG** - they should use:
```typescript
headers: { 
  'apikey': publicAnonKey,
  Authorization: `Bearer ${publicAnonKey}` 
}
```

But fixing all of them is a bigger refactor. For now, the RIGHT NOW client is correct.

---

**Status**: Frontend ✅ Live | Backend ⚠️ Needs Deploy  
**Deploy Command**: `npx supabase functions deploy right-now`  
**Time to Deploy**: ~30 seconds
