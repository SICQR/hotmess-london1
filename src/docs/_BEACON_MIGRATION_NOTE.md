# 🔥 BEACON SYSTEM MIGRATION NOTE

**Date:** 2024-12-05  
**Action:** Complete beacon system specification rebuild

---

## What Changed

The beacon system has been **completely rewritten** from scattered hookup-specific docs into a unified, production-ready master specification.

### Old Approach (Deprecated)

- Multiple fragmented docs focused only on "hookup beacons"
- Unclear type hierarchy
- Ambiguous geo handling
- Messy XP rules
- No clear universal flow
- Separate docs for tickets, products, check-ins

**Old Docs (Now Superseded):**
- `HOOKUP_BEACONS.md` - Focused only on social/hookup use case
- Various scattered beacon references across system

### New Approach (Active)

**⭐ Single Source of Truth:**
- **[BEACON_SYSTEM_MASTER.md](./BEACON_SYSTEM_MASTER.md)** - Complete specification

**What's Different:**

1. **4 Master Types** (everything else is metadata):
   - **PRESENCE** — Check-ins, venues, saunas, events
   - **TRANSACTION** — Tickets, resale, products, drops, affiliates
   - **SOCIAL** — Person QR, rooms, hook-ups
   - **CARE** — Hand N Hand, aftercare, resources

2. **Universal Pipeline:**
   - `QR → /l/:code → gates → consent → resolve → type flow → XP + map + bots`
   - Same flow for EVERY beacon type

3. **Strict Geo Privacy Modes:**
   - `none` — No location data
   - `venue` — Must be at venue, aggregated display
   - `city` — Fuzzy ~1-5km
   - `exact_fuzzed` — Jittered before display

4. **Clear XP Economy:**
   - Defined sources, sinks, caps
   - Anti-abuse rules
   - Membership multipliers

5. **Complete Type Flows:**
   - Every subtype (check-in, ticket, resale, person, room, care) fully documented
   - Database schema included
   - API endpoints specified
   - Testing scenarios provided

---

## Migration Path

### For Developers

1. **Read:** [BEACON_SYSTEM_MASTER.md](./BEACON_SYSTEM_MASTER.md)
2. **Update:** All beacon creation code to use 4 master types
3. **Implement:** Universal scan pipeline (Section 3)
4. **Map:** Old beacon types to new master types (Section 15)
5. **Test:** Use testing scenarios (Section 13)

### For Product/PM

1. **Read:** Executive Summary (Section 1)
2. **Understand:** 4 master types (Section 4)
3. **Review:** XP economy (Section 6)
4. **Plan:** Implementation checklist (Section 10)

### For Operations

1. **Understand:** Each beacon type now has clear purpose
2. **Know:** Geo privacy rules (Section 5)
3. **Use:** Same QR system powers everything

---

## What Still Works

All **existing hookup/social beacon functionality** is preserved. It's now just one subtype (`social/person` and `social/room`) within the unified system.

**Legacy hookup docs remain for reference:**
- [HOOKUP_BEACONS.md](./HOOKUP_BEACONS.md) - Still valid for social/hookup use case
- [HOOKUP_QUICK_START.md](./HOOKUP_QUICK_START.md) - User guide still applies
- All operational guides (hosts, ambassadors, etc.) — still valid

But the **master spec** is now the architectural truth.

---

## Key Benefits

✅ **One system, not fragments**  
✅ **Clear type hierarchy**  
✅ **Privacy-first geo handling**  
✅ **Defined XP rules**  
✅ **Production-ready DB schema**  
✅ **Complete API docs**  
✅ **Testable scenarios**  

---

## Action Items

### Immediate
- [ ] All new beacon implementations use master spec
- [ ] Update API routes to match Section 11
- [ ] Implement universal pipeline (Section 3)

### Short-term
- [ ] Migrate existing beacons to new schema (Section 12)
- [ ] Update bot commands to use new types (Section 8)
- [ ] Implement geo privacy modes (Section 5)

### Medium-term
- [ ] Deploy full XP economy (Section 6)
- [ ] Integrate with 3D globe (Section 7)
- [ ] Build admin dashboards

---

## Questions?

**Read first:** [BEACON_SYSTEM_MASTER.md](./BEACON_SYSTEM_MASTER.md)

**Still unclear?** Contact platform team or open issue.

---

**The old hookup-specific beacon system was proof-of-concept.**  
**The new unified beacon system is production architecture.**

Ship it. 🚀
