# RIGHT NOW - E2E Testing Guide

**Edge Function:** `right-now-test`  
**Date:** December 9, 2024  
**Status:** ✅ Ready for Testing

---

## 🎯 Overview

Complete end-to-end testing suite for RIGHT NOW system:
- ✅ Create posts (respects RLS)
- ✅ Soft-delete posts
- ✅ Send realtime broadcasts
- ✅ Health check endpoint
- ✅ SQL seed data for manual testing

---

## 📋 Prerequisites

### 1. Edge Function Deployed
```bash
# Deploy via Supabase CLI
supabase functions deploy right-now-test

# Or via Dashboard:
# Functions → Deploy new function → Upload /supabase/functions/right-now-test/index.ts
```

### 2. Environment Variables
Automatically available in Supabase Edge Functions:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (for broadcasts)

### 3. User Authentication
You need a valid user token to create/delete posts:
```typescript
// Get token from Supabase auth
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token
```

---

## 🚀 API Endpoints

### Base URL
```
https://{PROJECT_ID}.supabase.co/functions/v1/right-now-test
```

Replace `{PROJECT_ID}` with your Supabase project ID.

---

## 📡 Endpoint Details

### 1. Health Check
**Route:** `GET /right-now-test/health`  
**Auth:** None required  
**Purpose:** Verify the function is running

**Request:**
```bash
curl https://{PROJECT_ID}.supabase.co/functions/v1/right-now-test/health
```

**Response:**
```json
{
  "status": "LIVE",
  "service": "RIGHT NOW Test Suite",
  "timestamp": "2024-12-09T12:34:56.789Z",
  "routes": [
    "POST /right-now-test/create",
    "POST /right-now-test/delete",
    "POST /right-now-test/broadcast",
    "GET /right-now-test/health"
  ]
}
```

---

### 2. Create Test Post
**Route:** `POST /right-now-test/create`  
**Auth:** Required (Bearer token)  
**Purpose:** Create a post respecting RLS

**Request:**
```bash
curl -X POST \
  https://{PROJECT_ID}.supabase.co/functions/v1/right-now-test/create \
  -H "Authorization: Bearer {YOUR_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "hookup",
    "headline": "Testing from Edge Function",
    "body": "This is a test post",
    "city": "London",
    "lat": 51.5074,
    "lng": -0.1278
  }'
```

**Request Body (all optional):**
```typescript
{
  mode?: 'hookup' | 'crowd' | 'drop' | 'care',  // Default: 'hookup'
  headline?: string,                             // Default: 'Test post from Edge Function'
  body?: string | null,                          // Default: null
  city?: string,                                 // Default: 'London'
  country?: string,                              // Default: 'UK'
  lat?: number,                                  // Default: 51.5074
  lng?: number,                                  // Default: -0.1278
  geo_bin?: string,                              // Default: '9c2838b'
  heat_bin_id?: string,                          // Default: '9c2838b'
  membership_tier?: string,                      // Default: 'GOLD'
  xp_band?: string,                              // Default: 'INSIDER'
  safety_flags?: string[],                       // Default: []
  near_party?: boolean,                          // Default: false
  sponsored?: boolean,                           // Default: false
  is_beacon?: boolean,                           // Default: true
  expires_at?: string | null,                    // Default: NOW() + 1 hour
}
```

**Success Response (201):**
```json
{
  "success": true,
  "post": {
    "id": "uuid-here",
    "user_id": "user-uuid",
    "mode": "hookup",
    "headline": "Testing from Edge Function",
    "body": "This is a test post",
    "city": "London",
    "lat": 51.5074,
    "lng": -0.1278,
    "created_at": "2024-12-09T12:34:56.789Z",
    "expires_at": "2024-12-09T13:34:56.789Z",
    ...
  },
  "message": "Test post created successfully",
  "expires_in": "1 hour"
}
```

**Error Response (401):**
```json
{
  "error": "Unauthorized - valid auth token required",
  "details": "JWT expired"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to create post",
  "details": "Error message here",
  "hint": "Check RLS policies on right_now_posts table"
}
```

---

### 3. Soft-Delete Post
**Route:** `POST /right-now-test/delete`  
**Auth:** Required (Bearer token)  
**Purpose:** Soft-delete a post (sets `deleted_at`)

**Request:**
```bash
curl -X POST \
  https://{PROJECT_ID}.supabase.co/functions/v1/right-now-test/delete \
  -H "Authorization: Bearer {YOUR_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": "uuid-of-post-to-delete"
  }'
```

**Request Body:**
```typescript
{
  post_id: string  // Required: UUID of post to delete
}
```

**Success Response (200):**
```json
{
  "success": true,
  "post": {
    "id": "uuid-here",
    "deleted_at": "2024-12-09T12:35:00.000Z",
    ...
  },
  "message": "Post soft-deleted successfully",
  "deleted_at": "2024-12-09T12:35:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "Missing post_id in request body"
}
```

**Error Response (404):**
```json
{
  "error": "Post not found or already deleted"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to delete post",
  "details": "Error message",
  "hint": "Post may not exist or you may not have permission"
}
```

**Note:** Users can only delete their own posts (enforced by RLS).

---

### 4. Send Broadcast
**Route:** `POST /right-now-test/broadcast`  
**Auth:** None required (uses service role key)  
**Purpose:** Send realtime broadcast to city channel

**Request:**
```bash
curl -X POST \
  https://{PROJECT_ID}.supabase.co/functions/v1/right-now-test/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "city": "London",
    "event": "test_event",
    "payload": {
      "message": "Test broadcast",
      "data": "any json data"
    }
  }'
```

**Request Body (all optional):**
```typescript
{
  city?: string,           // Default: 'London'
  event?: string,          // Default: 'test_broadcast'
  payload?: object,        // Default: { message: 'Test broadcast...' }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "channel": "city:london",
  "event": "test_event",
  "payload": {
    "message": "Test broadcast",
    "data": "any json data",
    "timestamp": "2024-12-09T12:34:56.789Z",
    "source": "right-now-test"
  },
  "message": "Broadcast sent to city:london",
  "result": "ok"
}
```

**Error Response (500):**
```json
{
  "error": "Service role key not configured",
  "hint": "SUPABASE_SERVICE_ROLE_KEY required for broadcasts"
}
```

---

## 🧪 Testing Workflows

### Test 1: Create and Verify Post
```bash
# 1. Create a post
RESPONSE=$(curl -X POST \
  https://{PROJECT_ID}.supabase.co/functions/v1/right-now-test/create \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"mode": "hookup", "headline": "Test Post"}')

# 2. Extract post ID
POST_ID=$(echo $RESPONSE | jq -r '.post.id')

# 3. Verify in database
curl https://{PROJECT_ID}.supabase.co/rest/v1/right_now_posts?id=eq.$POST_ID \
  -H "apikey: {ANON_KEY}"
```

### Test 2: Create and Delete Post
```bash
# 1. Create post (see above)
POST_ID="uuid-here"

# 2. Delete post
curl -X POST \
  https://{PROJECT_ID}.supabase.co/functions/v1/right-now-test/delete \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"post_id\": \"$POST_ID\"}"

# 3. Verify deleted_at is set
curl https://{PROJECT_ID}.supabase.co/rest/v1/right_now_posts?id=eq.$POST_ID \
  -H "apikey: {ANON_KEY}"
```

### Test 3: Realtime Broadcast
```bash
# 1. Subscribe to channel in frontend
const channel = supabase.channel('city:london')
channel.on('broadcast', { event: 'test_event' }, (payload) => {
  console.log('Received:', payload)
})
channel.subscribe()

# 2. Send broadcast from Edge Function
curl -X POST \
  https://{PROJECT_ID}.supabase.co/functions/v1/right-now-test/broadcast \
  -H "Content-Type: application/json" \
  -d '{"city": "London", "event": "test_event", "payload": {"test": true}}'

# 3. Verify frontend receives the broadcast
```

### Test 4: Multiple Post Modes
```bash
# Test all 4 modes
for mode in hookup crowd drop care; do
  curl -X POST \
    https://{PROJECT_ID}.supabase.co/functions/v1/right-now-test/create \
    -H "Authorization: Bearer {TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"mode\": \"$mode\", \"headline\": \"Test $mode post\"}"
done
```

---

## 🗄️ SQL Seed Data

### Apply Seed Migration
```bash
# Via Supabase Dashboard:
# SQL Editor → Paste /supabase/migrations/302_right_now_test_seed.sql → Run

# Or via CLI:
supabase db push
```

### What It Creates
- ✅ 8 test posts across all modes
- ✅ Test posts have `[TEST]` prefix in headline
- ✅ Various locations around London
- ✅ Mix of safety flags, scores, membership tiers

### Helper Functions

#### 1. Generate Random Test Post
```sql
-- Generate a test post for a user
SELECT generate_test_post(
  'user-uuid-here',  -- user_id
  'hookup',          -- mode
  'London',          -- city
  51.5074,           -- lat
  -0.1278            -- lng
);
```

#### 2. Cleanup Test Posts
```sql
-- Remove all test posts and posts older than 7 days
SELECT cleanup_test_posts();
-- Returns: number of posts deleted
```

---

## 🔍 Verification Queries

### Check All Test Posts
```sql
SELECT id, mode, headline, city, created_at, expires_at, deleted_at
FROM right_now_posts
WHERE headline LIKE '%[TEST]%'
ORDER BY created_at DESC;
```

### Check Active Test Posts
```sql
SELECT id, mode, headline, city
FROM right_now_posts
WHERE headline LIKE '%[TEST]%'
  AND deleted_at IS NULL
  AND expires_at > NOW()
ORDER BY created_at DESC;
```

### Check Posts by Mode
```sql
SELECT mode, COUNT(*) as count
FROM right_now_posts
WHERE headline LIKE '%[TEST]%'
  AND deleted_at IS NULL
GROUP BY mode;
```

### Check Posts by City
```sql
SELECT city, COUNT(*) as count
FROM right_now_posts
WHERE deleted_at IS NULL
  AND expires_at > NOW()
GROUP BY city;
```

---

## 🎨 Frontend Testing

### Test with React Hook
```typescript
import { useRightNowRealtime } from '@/lib/useRightNowRealtime'

function TestComponent() {
  useRightNowRealtime({
    city: 'London',
    onInsert: (post) => {
      console.log('✅ New post:', post)
    },
    onUpdate: (post) => {
      console.log('🔄 Updated post:', post)
    },
    onDelete: (postId) => {
      console.log('🗑️  Deleted post:', postId)
    },
  })

  const handleTestCreate = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    const res = await fetch(
      `https://${projectId}.supabase.co/functions/v1/right-now-test/create`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'hookup',
          headline: 'Frontend test post',
          city: 'London',
        }),
      }
    )
    
    const data = await res.json()
    console.log('Created:', data)
  }

  return (
    <button onClick={handleTestCreate}>
      Create Test Post
    </button>
  )
}
```

---

## 🐛 Common Issues

### Issue: 401 Unauthorized
**Cause:** Missing or invalid auth token  
**Fix:**
```typescript
// Get fresh token
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token

// Use in request
headers: { Authorization: `Bearer ${token}` }
```

### Issue: RLS Policy Violation
**Cause:** User doesn't have permission to insert/update  
**Fix:**
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'right_now_posts';

-- Enable insert for authenticated users
CREATE POLICY "Users can create posts"
ON right_now_posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

### Issue: Broadcast Not Received
**Cause:** Channel not subscribed or mismatch  
**Fix:**
```typescript
// Subscribe to correct channel
const channel = supabase.channel('city:london') // lowercase
channel.on('broadcast', { event: 'test_event' }, (payload) => {
  console.log('Received:', payload)
})
await channel.subscribe()

// Send to same channel
// POST /broadcast with { "city": "London" }
```

### Issue: Function Not Found
**Cause:** Function not deployed  
**Fix:**
```bash
# Deploy the function
supabase functions deploy right-now-test

# Verify deployment
supabase functions list
```

---

## 📊 Performance Testing

### Load Test: Create 100 Posts
```bash
# Bash script
TOKEN="your-token-here"
PROJECT_ID="your-project-id"

for i in {1..100}; do
  curl -X POST \
    https://$PROJECT_ID.supabase.co/functions/v1/right-now-test/create \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"headline\": \"Load test post $i\"}" &
done
wait
```

### Benchmark: Response Times
```bash
# Measure response time
time curl -X POST \
  https://{PROJECT_ID}.supabase.co/functions/v1/right-now-test/create \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"headline": "Benchmark post"}'
```

Expected times:
- Health check: < 100ms
- Create post: 200-500ms
- Delete post: 100-300ms
- Broadcast: < 200ms

---

## ✅ Testing Checklist

### Deployment
- [ ] Edge Function deployed
- [ ] Environment variables configured
- [ ] Health endpoint responds

### Authentication
- [ ] Can create post with valid token
- [ ] Cannot create post without token
- [ ] Cannot create post with expired token
- [ ] Can only delete own posts

### CRUD Operations
- [ ] Create post in each mode (hookup/crowd/drop/care)
- [ ] Posts appear in database
- [ ] Posts have correct user_id
- [ ] Posts have correct expires_at
- [ ] Soft delete sets deleted_at
- [ ] Deleted posts hidden from feeds

### Realtime
- [ ] Broadcast reaches subscribed channels
- [ ] Frontend receives broadcasts
- [ ] Channel names match (lowercase)
- [ ] Payload includes timestamp and source

### SQL Helpers
- [ ] Seed data creates 8 posts
- [ ] generate_test_post() works
- [ ] cleanup_test_posts() removes test data
- [ ] No orphaned data after cleanup

---

## 🎉 Success Criteria

✅ All endpoints return 200/201 for valid requests  
✅ Auth errors return 401 with helpful messages  
✅ Posts respect RLS (can't delete others' posts)  
✅ Broadcasts reach subscribers in < 500ms  
✅ Test data seeds successfully  
✅ Cleanup removes all test data  
✅ Frontend hooks receive realtime updates  

---

**Ready to test. Drop it. Right now. 🔥**
