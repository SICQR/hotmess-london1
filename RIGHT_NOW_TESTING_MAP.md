# 🗺️ RIGHT NOW Testing - Complete System Map

## Visual Guide to Your Testing Infrastructure

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HOMEPAGE (/)                                 │
│                                                                      │
│  [Hero Section]                                                     │
│  [Tonight in London]                                                │
│  [City Drops]                                                       │
│  [HOTMESS Radio]                                                    │
│  [HNH MESS]                                                         │
│  [Care]                                                             │
│  [Leaderboard]                                                      │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  ⚡ RIGHT NOW Testing                                      │   │
│  │                                                             │   │
│  │  End-to-end testing infrastructure for the                 │   │
│  │  RIGHT NOW hookup engine                                   │   │
│  │                                                             │   │
│  │  4 endpoints • Realtime updates • SQL seed data •          │   │
│  │  Production ready                                          │   │
│  │                                                             │   │
│  │  ┌───────────┐ ┌───────────┐ ┌──────────┐                │   │
│  │  │⚡ Test    │ │ Test      │ │ Guide    │                │   │
│  │  │ Dashboard │ │ Panel     │ │          │                │   │
│  │  └─────┬─────┘ └─────┬─────┘ └────┬─────┘                │   │
│  └────────┼─────────────┼────────────┼────────────────────────┘   │
└───────────┼─────────────┼────────────┼────────────────────────────┘
            │             │            │
            ▼             ▼            ▼
    ┌───────────────┐ ┌──────────────┐ ┌────────────────┐
    │  Test         │ │  Test        │ │  Testing       │
    │  Dashboard    │ │  Panel       │ │  Guide         │
    └───────┬───────┘ └──────┬───────┘ └───────┬────────┘
            │                │                  │
            │                │                  │
┌───────────▼────────────────▼──────────────────▼──────────────┐
│                                                               │
│                    TESTING ECOSYSTEM                          │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Test Dashboard (/right-now/test-dashboard)         │    │
│  │  • Live health check                                │    │
│  │  • System status (LIVE/ERROR)                       │    │
│  │  • 4 API endpoints overview                         │    │
│  │  • 4 post modes display                             │    │
│  │  • Quick stats                                      │    │
│  │  • Links to all tools                               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Test Panel (/right-now/test)                       │    │
│  │  • Create posts (all 4 modes)                       │    │
│  │  • Delete posts                                     │    │
│  │  • Send broadcasts                                  │    │
│  │  • Realtime logs                                    │    │
│  │  • Success/error feedback                           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Testing Guide (/right-now/testing-guide)           │    │
│  │  • 3-step quick start                               │    │
│  │  • 3 complete workflows                             │    │
│  │  • 4 post modes explained                           │    │
│  │  • Quick access links                               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Live Feed (/right-now/live)                        │    │
│  │  • Production RIGHT NOW feed                        │    │
│  │  • 3D globe with heat clusters                      │    │
│  │  • Realtime updates                                 │    │
│  │  • All 4 modes rendered                             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Demo Feed (/right-now/demo)                        │    │
│  │  • Mock data version                                │    │
│  │  • No auth required                                 │    │
│  │  • Same UI as Live Feed                             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        │ Makes requests to
                        ▼
┌────────────────────────────────────────────────────────────────┐
│                    EDGE FUNCTION                               │
│                                                                │
│  right-now-test                                               │
│  https://{PROJECT_ID}.supabase.co/functions/v1/right-now-test│
│                                                                │
│  ┌────────────────────────────────────────────────────┐      │
│  │  GET /health                                       │      │
│  │  • No auth required                                │      │
│  │  • Returns: status, service, timestamp, routes     │      │
│  └────────────────────────────────────────────────────┘      │
│                                                                │
│  ┌────────────────────────────────────────────────────┐      │
│  │  POST /create                                      │      │
│  │  • Requires auth token                             │      │
│  │  • Creates test post                               │      │
│  │  • Returns: post object with ID                    │      │
│  └────────────────────────────────────────────────────┘      │
│                                                                │
│  ┌────────────────────────────────────────────────────┐      │
│  │  POST /delete                                      │      │
│  │  • Requires auth token                             │      │
│  │  • Soft-deletes post (sets deleted_at)             │      │
│  │  • Returns: updated post object                    │      │
│  └────────────────────────────────────────────────────┘      │
│                                                                │
│  ┌────────────────────────────────────────────────────┐      │
│  │  POST /broadcast                                   │      │
│  │  • No auth required                                │      │
│  │  • Sends realtime broadcast                        │      │
│  │  • Returns: channel, event, payload                │      │
│  └────────────────────────────────────────────────────┘      │
│                                                                │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         │ Writes to / Reads from
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                      DATABASE                                  │
│                                                                │
│  Table: right_now_posts                                       │
│                                                                │
│  ┌────────────────────────────────────────────────────┐      │
│  │  Seed Data (8 posts)                               │      │
│  │  • 2 hookup posts                                  │      │
│  │  • 2 crowd posts                                   │      │
│  │  • 2 drop posts                                    │      │
│  │  • 2 care posts                                    │      │
│  │                                                     │      │
│  │  Location: supabase/migrations/                    │      │
│  │            302_right_now_test_seed.sql             │      │
│  └────────────────────────────────────────────────────┘      │
│                                                                │
│  ┌────────────────────────────────────────────────────┐      │
│  │  Realtime Triggers                                 │      │
│  │  • on_insert → broadcast to city channel           │      │
│  │  • on_update → broadcast to city channel           │      │
│  │  • on_delete → broadcast to city channel           │      │
│  └────────────────────────────────────────────────────┘      │
│                                                                │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         │ Broadcasts to
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                    REALTIME CHANNELS                           │
│                                                                │
│  Channel: city:london                                         │
│  • INSERT events → New posts appear instantly                 │
│  • UPDATE events → Post changes appear instantly              │
│  • DELETE events → Deleted posts disappear instantly          │
│                                                                │
│  Subscribed by:                                               │
│  • Test Panel (/right-now/test)                              │
│  • Live Feed (/right-now/live)                               │
│  • Any page using useRightNowRealtime hook                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Post Modes Color Code

```
┌─────────────────────────────────────────────────────────┐
│  Mode: hookup  │  ⚡ Zap  │  #FF1744 (Hot Pink)        │
├─────────────────────────────────────────────────────────┤
│  Mode: crowd   │  👥 Users │  #00E5FF (Cyan)           │
├─────────────────────────────────────────────────────────┤
│  Mode: drop    │  💧 Drop  │  #FF10F0 (Magenta)        │
├─────────────────────────────────────────────────────────┤
│  Mode: care    │  ❤️ Heart │  #7C4DFF (Purple)         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### Creating a Post

```
User clicks "Test Create"
        ↓
Test Panel (/right-now/test)
        ↓
POST request to Edge Function
        ↓
right-now-test/create endpoint
        ↓
Insert into right_now_posts table
        ↓
Database trigger fires
        ↓
Broadcast to city:london channel
        ↓
Live Feed receives broadcast
        ↓
Post appears instantly ✨
```

### Deleting a Post

```
User clicks "Delete"
        ↓
Test Panel (/right-now/test)
        ↓
POST request to Edge Function
        ↓
right-now-test/delete endpoint
        ↓
Update right_now_posts (set deleted_at)
        ↓
Database trigger fires
        ↓
Broadcast to city:london channel
        ↓
Live Feed receives broadcast
        ↓
Post disappears instantly ✨
```

---

## 📂 File Structure

```
/
├── app/
│   ├── page.tsx                              # Homepage with test section
│   └── right-now/
│       ├── test-dashboard/
│       │   └── page.tsx                      # Test Dashboard page
│       ├── test/
│       │   └── page.tsx                      # Test Panel page
│       ├── testing-guide/
│       │   └── page.tsx                      # Testing Guide page
│       ├── live/
│       │   └── page.tsx                      # Live Feed page
│       └── demo/
│           └── page.tsx                      # Demo Feed page
│
├── components/
│   ├── RightNowTestDashboard.tsx             # Dashboard component
│   ├── RightNowTestPanel.tsx                 # Test panel component
│   ├── RightNowTestStatus.tsx                # Health status badge
│   └── FloatingTestBadge.tsx                 # Quick access badge
│
├── supabase/
│   ├── functions/
│   │   └── right-now-test/
│   │       └── index.ts                      # Edge Function
│   └── migrations/
│       └── 302_right_now_test_seed.sql       # Seed data
│
├── scripts/
│   └── test-right-now.sh                     # Bash test script
│
├── docs/
│   └── RIGHT_NOW_E2E_TESTING.md              # Full documentation
│
├── lib/
│   └── useRightNowRealtime.ts                # Realtime hook
│
└── Documentation/
    ├── START_HERE_RIGHT_NOW_TESTING.md       # Quick start (this file)
    ├── RIGHT_NOW_TESTING_QUICK_START.md      # Quick start guide
    ├── RIGHT_NOW_TESTING_LOCATIONS.md        # File locations
    ├── WHERE_IS_RIGHT_NOW_TESTING.md         # Finding the UI
    └── RIGHT_NOW_TESTING_MAP.md              # System map (this file)
```

---

## 🎯 Testing Journey Map

```
START
  ↓
Homepage (/)
  ↓
Scroll to "RIGHT NOW Testing" section
  ↓
Click "Test Dashboard" button
  ↓
Verify ✅ LIVE status
  ↓
Click "Test Panel" button
  ↓
Select mode: hookup
  ↓
Click "Test Create"
  ↓
See ✅ success in logs
  ↓
Note Post ID
  ↓
Open new tab → /right-now/live
  ↓
See post in feed with 3D globe
  ↓
Back to Test Panel
  ↓
Click "Delete"
  ↓
Watch post disappear from Live Feed
  ↓
COMPLETE ✅
```

---

## 🛠️ Component Relationships

```
RightNowTestDashboard
  ├── Calls: right-now-test/health
  ├── Shows: System status
  └── Links to: Test Panel, Live Feed, Guide

RightNowTestPanel
  ├── Uses: useRightNowRealtime hook
  ├── Calls: right-now-test/create
  ├── Calls: right-now-test/delete
  ├── Calls: right-now-test/broadcast
  └── Shows: Realtime logs

Live Feed
  ├── Uses: useRightNowRealtime hook
  ├── Reads: right_now_posts table
  ├── Subscribes: city:london channel
  └── Renders: 3D globe + feed

useRightNowRealtime hook
  ├── Subscribes to: Realtime channels
  ├── Listens for: INSERT, UPDATE, DELETE
  └── Callbacks: onInsert, onUpdate, onDelete
```

---

## 🔐 Authentication Flow

```
Test Panel (needs auth)
        ↓
Get session from Supabase
        ↓
Extract access_token
        ↓
Send in Authorization header
        ↓
Edge Function receives token
        ↓
Validates with Supabase auth
        ↓
Gets user ID
        ↓
Uses for RLS policies
        ↓
Creates/deletes post
```

---

## 📊 System Health States

```
┌──────────────────────────────────────┐
│  ✅ LIVE                             │
│  • Edge Function responding          │
│  • All endpoints available           │
│  • Last check < 5 minutes ago        │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  ⏳ CHECKING                         │
│  • Health check in progress          │
│  • Waiting for response              │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  ❌ ERROR                            │
│  • Edge Function not responding      │
│  • Network error                     │
│  • Needs redeployment                │
└──────────────────────────────────────┘
```

---

## 🎨 UI Component Hierarchy

```
Homepage
└── BrutalistCard (variant="section")
    ├── Zap icon (hot pink)
    ├── Heading: "RIGHT NOW Testing"
    ├── Description text
    ├── Feature bullets
    └── Button group
        ├── Test Dashboard button (hot pink)
        ├── Test Panel button (white)
        └── Guide button (white)

Test Dashboard
├── Header
├── Health Status Card
│   ├── Status indicator (✅/⏳/❌)
│   ├── Timestamp
│   └── Refresh button
├── Test Routes Grid
│   ├── Test Panel card
│   ├── Live Feed card
│   ├── Demo Feed card
│   └── Globe View card
├── Post Modes Grid
│   ├── Hookup (⚡ hot pink)
│   ├── Crowd (👥 cyan)
│   ├── Drop (💧 magenta)
│   └── Care (❤️ purple)
├── API Endpoints List
│   ├── GET /health
│   ├── POST /create
│   ├── POST /delete
│   └── POST /broadcast
└── Quick Stats

Test Panel
├── Mode Selector
│   ├── Hookup button
│   ├── Crowd button
│   ├── Drop button
│   └── Care button
├── Action Buttons
│   ├── Test Create
│   ├── Delete
│   └── Broadcast
└── Logs Section
    └── Realtime log entries
```

---

## 🔄 Realtime Event Flow

```
Event: New Post Created
    ↓
Database trigger fires
    ↓
Broadcast sent to: city:london
    ↓
All subscribers receive:
    ├── Test Panel → Adds log entry
    ├── Live Feed → Adds post to feed
    └── Globe View → Adds marker

Event: Post Deleted
    ↓
Database trigger fires
    ↓
Broadcast sent to: city:london
    ↓
All subscribers receive:
    ├── Test Panel → Adds log entry
    ├── Live Feed → Removes from feed
    └── Globe View → Removes marker
```

---

## 📱 Responsive Breakpoints

```
Mobile (< 768px)
└── Single column layout
    ├── Buttons stack vertically
    ├── Cards full width
    └── Globe adapts to screen

Tablet (768px - 1024px)
└── Two column layout
    ├── Buttons in 2 rows
    ├── Cards in 2 columns
    └── Globe medium size

Desktop (> 1024px)
└── Multi column layout
    ├── Buttons in single row
    ├── Cards in 3-4 columns
    └── Globe full size
```

---

## ✅ Quick Reference

### URLs
```
Homepage:       /
Dashboard:      /right-now/test-dashboard
Panel:          /right-now/test
Guide:          /right-now/testing-guide
Live:           /right-now/live
Demo:           /right-now/demo
```

### Edge Function
```
Base:           https://{PROJECT_ID}.supabase.co/functions/v1/right-now-test
Health:         GET  /health
Create:         POST /create
Delete:         POST /delete
Broadcast:      POST /broadcast
```

### Channels
```
London:         city:london
Events:         INSERT, UPDATE, DELETE
```

### Files
```
Homepage:       /app/page.tsx (lines 332-371)
Dashboard:      /components/RightNowTestDashboard.tsx
Panel:          /components/RightNowTestPanel.tsx
Edge Function:  /supabase/functions/right-now-test/index.ts
Seed Data:      /supabase/migrations/302_right_now_test_seed.sql
```

---

**Status**: ✅ **MAPPED & READY**

Use this map to understand the complete system architecture. 🗺️
