# 🔥 HOTMESS LONDON
**Care-first nightlife OS for queer men 18+**  
A single landing point for global nightlife: a living 3D globe with venues, events, partner pins, beacons, tickets, commerce, radio, and community.

[![18+](https://img.shields.io/badge/Age-18%2B-red)]()
[![License](https://img.shields.io/badge/License-Proprietary-blue)]()
[![Status](https://img.shields.io/badge/Status-Beta-yellow)]()

**Design north star:** open the site → spin the globe → zoom to a city → see what's hot → take action (tickets / beacons / connect) → earn XP → land safely (care + reporting always available).

---

## 📌 Non-Negotiables (Product + Safety)
- **Men-only, 18+**
- **Consent prompts** before high-risk actions: enabling location, creating hookup beacons, opening discovery grid, messaging first contact, uploading proofs/attachments.
- **Aftercare is information/support only (not medical advice)** and requires a visible **Care Disclaimer** anywhere aftercare is referenced.
- **Privacy-first location**: default to approximate location, opt-in precision, and user-controlled visibility.
- **Trust & Safety everywhere**: block, mute, report, moderation queue, cooldowns, admin tools.
- **No orphan pages**: every route cross-links to Home + Globe + Tickets + Shop + Radio + Care + Legal.

---

## 🧭 Core Experience (What the user can do)
1. **Land:** See the 3D globe with live nightlife signals.
2. **Zoom:** World → city → venue → beacon.
3. **Find:** Venues/partners, events, drops, hot zones, nearby beacons.
4. **Signal:** Create time-limited QR beacons (3/6/9 hours).
5. **Connect:** Tier-gated discovery (grid + chat) with safety tools.
6. **Buy:** Tickets (first party) + resale marketplace; shop merch; music releases.
7. **Earn:** XP, streaks, leaderboards, achievements.
8. **Care:** Aftercare info + safety landing. Always accessible.

---

## ✅ Feature Set (End-to-End)

### 1) Global Nightlife Globe (Primary Surface)
- 3D globe with pins (venues/partners/events/beacons) and layers (heat/trails).
- Click a pin → detail panel → action CTA (Tickets / Drop Beacon / Join Chat / Save / Share).
- City zoom "hotline": what's trending, verified venues, active beacons, tonight's tickets.

**Layers**
- **Beacons:** active QR signals, clustered by zoom.
- **Venues/Partners:** verified locations + promos.
- **Events/Tickets:** tonight, weekend, featured.
- **Heat:** aggregated activity intensity (privacy-safe).
- **Trails:** aggregated movement cues (opt-in + privacy-safe).

### 2) Beacons (QR = traffic + revenue + connection)
- Beacon types: club / hookup / event / music / drop.
- Create beacon with **duration 3/6/9 hours**, visibility, location mode, optional venue association.
- QR code + shortlink resolver `/l/:code`.
- Scan → XP reward → optional tier-gated "open grid" + message bridge.
- Anti-spam: daily scan caps, cooldowns, abuse reporting.
- Analytics: scans, saves, conversion to chat/tickets.

### 3) Tickets (First-Party + C2C Resale)
**First-party**
- Event creation, ticket sales, per-ticket QR, door verification, entry logs, analytics.

**C2C resale**
- List, browse, purchase, buyer/seller chat, proof upload, secure transfer, disputes.
- Safety hooks: verified sellers, warnings, reporting.

### 4) Commerce
**Shopify**
- Merch store, collections (HIGH/HUNG/RAW/SUPER), cart persistence, checkout redirect.

**MessMarket (Stripe Connect)**
- Listings, search, checkout, onboarding, payouts, seller dashboard, admin moderation.

### 5) Radio
- 24/7 live player; mini-player bar; show schedule; episode pages.
- Integrate RadioKing when available; fallback gracefully.

### 6) RAW Convict Records
- Releases, tracks, versions, streaming preview, purchase + downloads, library, analytics, fan opt-ins.

### 7) Messaging + Community
- Threads (tickets/resale + general), realtime messages, attachments.
- Telegram distribution: QR beacons posted into Telegram rooms to drive scans.
- Bots + automation hooks (Make.com) for lifecycle tasks.

### 8) Trust & Safety
- Block, mute, report (users/listings/messages/beacons).
- Admin moderation desk: remove, warn, cooldown, ban; evidence trails; audit logs.
- Clear "Report abuse" path everywhere.

### 9) Membership
- Free / Starter / Pro / Elite
- Tier benefits: grid visibility, scan multipliers, beacon creation limits, advanced filters, priority support, etc.
- Upgrades via Stripe billing.

---

## 🧱 Required Platform Pages (No Orphans)
These routes must exist and be cross-linked sitewide (header/footer + context links):

- **Home**
- **Globe (Nightlife Earth)**
- **Tickets**
- **Shop** (Collections: RAW / HUNG / HIGH / SUPER)
- **MessMarket**
- **HNH MESS**
- **Radio**
- **Records (RAW Convict Records)**
- **Affiliate**
- **Care (Hand N Hand)** + **Care Disclaimer**
- **Community**
- **About**
- **Legal**
  - Privacy Policy
  - Terms
  - Cookie Policy
  - Care Disclaimer
  - 18+ Terms / Age Gate
- **Press Room**
- **Accessibility**
- **Data & Privacy Hub** (GDPR): DSAR/export, deletion, cookies, consent logs
- **UGC/Moderation**
- **Abuse & Safety** (Reporting)
- **DMCA/Takedown**
- **Age Verification**
- **Sponsorship Disclosures**
- **Creator Onboarding**
- **Partner Integrations**

---

## 🔁 Critical Flows (No Dead Ends)

### A) Globe → City → Action
Home → Globe → select city → view venue/beacon/event → choose:
- Buy tickets
- Drop beacon (3/6/9h)
- Open grid (tier-gated)
- Save/Share
- Go to Care / Report

### B) QR Scan (Any QR)
Scan QR → `/l/:code` → Consent gate (if needed) → Beacon detail → XP →
- Open grid (tier-gated) **or**
- Open chat thread **or**
- View venue/event/tickets

### C) "Out Tonight" Beacon Creation (3/6/9 hours)
Create → choose duration + privacy mode → generate QR → share to Telegram → scans arrive →
chat/discovery → expires → cleanup → archive stats.

### D) Ticket Resale
Listing → buyer scans QR (or web) → chat → proof upload → transfer → dispute if needed.

---

## 🔐 Consent & Privacy Patterns (Must Implement)
**Consent prompts appear BEFORE:**
- enabling GPS/location precision
- creating hookup beacons
- opening grid discovery
- messaging first contact
- uploading proof/attachments (especially tickets)

**Location Modes**
- Off (manual city selection)
- Approximate (city/area)
- Precise (opt-in; reversible)

**Care Disclaimer**
- Always present in Care pages and any "aftercare" surface.
- Language: "Aftercare content is informational and support-oriented; it is not medical advice."

---

## ⚙️ Stack Assumptions (for build continuity)
- React + Vite + Tailwind + ShadCN UI
- Supabase (Postgres + PostGIS + Auth + Storage + Realtime)
- Edge functions (Deno + Hono)
- Stripe + Stripe Connect + Stripe Billing
- Shopify Storefront API
- Telegram Bot API + Make.com webhooks

---

## 🗄️ Data Model (Minimal Required)
- profiles, subscriptions, subscription_tiers
- beacons, scans, saved_beacons
- hookup_beacons, hookup_check_ins
- tickets, ticket_listings, ticket_purchases, ticket_transfers
- threads, messages, thread_attachments
- market_listings, market_orders, market_sellers, market_payouts
- records_releases, records_tracks, records_track_versions, records_downloads, records_plays, records_library
- blocks, mutes, reports, moderation_actions, cooldowns
- earth_locations (or equivalent), plus aggregated tables for heat/trails

---

## 🌡️ Heat / Trails (Privacy-Safe Requirements)
- Heat must be **aggregated** by tile + time bucket (no raw user trails exposed).
- Trails must be **opt-in** and **coarsened** (city-level or large grid), never showing an individual's path.
- Nearby endpoints must be rate-limited and abuse-resistant.

---

## 📻 Radio Integration Requirements
- Must support: now playing, schedule, listener count (if API available), mini-player persistence, fallback if API down.
- Must not block site usage if RadioKing is unavailable.

---

## 🤖 Automation + Telegram (Core Growth Loop)
**Growth loop:** create beacon → generate QR → post to Telegram → scan → action → XP → share again.

Automation triggers (Make.com or equivalent):
- Beacon created
- Beacon scanned
- Beacon expired cleanup
- Ticket purchased
- Marketplace order placed
- Abuse report filed
- Weekly digest (top cities, top venues, top beacons)

---

## 🧨 Security & Moderation Rules (Must)
- RLS everywhere; service role never in frontend.
- Webhook signature checks for Stripe/Shopify.
- Abuse reporting available at: beacon, message, listing, profile, event.
- Admin audit logs for moderation actions.
- Attachment upload scanning policy (size/type limits) and secure signed URLs.

---

## 🧪 Testing (Minimum)
- Auth flows (email + OAuth + QR auth) smoke tests
- QR scan → XP award → streak update
- Beacon expiry cleanup
- Ticket purchase + verify + entry log
- Resale purchase → chat → proof upload → transfer
- Report → moderation action → cooldown enforcement
- GDPR export/delete flows

---

# ✅ EXECUTION PLAN (What the AI should build next)

## NEXT 3 STEPS (Hard Priority)
### 1) Ship **Settings + Data & Privacy Hub** (GDPR blocker)
**Routes**
- /settings
- /privacy (hub)
- /privacy/export (DSAR)
- /privacy/delete
- /privacy/cookies
- /privacy/consent-log

**Must include**
- Location consent toggles (approx/precise/off)
- Marketing opt-in/out
- Data export request + download
- Account deletion request + confirmation
- Cookie preferences

### 2) Replace Heat/Trails mock with real privacy-safe aggregation
**Add endpoints**
- GET /earth/heat?window=...&zoom=...
- GET /earth/trails?window=...&zoom=...

**Backend logic**
- Aggregate scans/tickets/check-ins into tiles/time buckets
- Clamp low counts (k-anonymity style) to avoid re-identification
- Strict limits for "nearby" and "heat" query frequency

### 3) Deploy Telegram + Automation Hooks for Beacon Lifecycle
**Minimum**
- Webhook endpoint for Telegram bot
- "Create beacon" command flow → returns QR + shortlink
- "Top cities / hot now" digest command
- Automation for beacon expiry and weekly digest

---

## FOLLOW-ON STEPS (Build Order)
4) **RadioKing integration** (now playing, schedule, listener count) + resilient fallback  
5) **Door camera scanner** (Club Mode) production-ready  
6) **Connect module** (tier-gated grid + consent-first flows)  
7) **Achievement system completion** + rewards surfaces (drops, perks, boosts)  
8) **Partner venue portal** (applications, verification, promo placements, analytics)  
9) **Unified analytics dashboard** (globe interactions → conversion funnels)  
10) **Mobile-first performance pass** (globe LOD, caching, offline-ish city cards)

---

## 🧾 Global UI Copy Pack (for consistency)

### Globe Landing
- Hero: **"Nightlife on Earth."**
- Subhead: **"Spin the globe. Find the heat. Land safely."**
- CTA 1: **"Spin the globe"**
- CTA 2: **"Drop a beacon (3/6/9h)"**
- Microcopy: "Beacons expire automatically. You control what you share."

### Consent Prompt (Location)
- Title: **"Share location?"**
- Body: "Choose approximate or precise. You can switch it off anytime."
- Buttons: "Approximate", "Precise", "Not now"

### Aftercare (always include disclaimer)
- Header: **"Land safe."**
- Line: "Aftercare here is informational support, not medical advice."

### Safety Menu (always visible in high-risk flows)
- "Block"
- "Mute"
- "Report"
- "Get support"

---

## 📈 KPIs
- Globe activation rate (spin/zoom/click within 60s)
- Beacon creation rate + scan-to-action conversion
- Ticket GMV + resale take-rate
- Membership upgrade conversion
- Safety: report response time, repeat-abuse suppression
- Retention: streak continuation + weekly active scanners

---

## 📄 License
Proprietary — All Rights Reserved.
HOTMESS LONDON © 2024–2025.
