# Integrating Hookup Beacons into Deluxe QR Generator

Quick guide for adding the hookup beacon type to the existing QR generator UI.

---

## Current QR Generator Location

**File:** `/pages/Beacons.tsx` or wherever the "Deluxe QR Generator" lives

**Existing Beacon Types:**
- Check-in
- Event
- Drop
- Care
- Room
- Content/Release

**Add:** Hookup (Room & 1:1)

---

## UI Changes Needed

### Step 1: Beacon Type Selection

Add hookup option to the type picker:

```tsx
<button
  onClick={() => setBeaconType('hookup')}
  className={/* ... */}
>
  <Zap className="w-6 h-6" />
  <div>
    <h3>HOOK-UP / CHAT</h3>
    <p>Connect men in a zone or 1-on-1</p>
  </div>
</button>
```

### Step 2: Hookup Mode Selection

When `beaconType === 'hookup'`, show sub-mode picker:

```tsx
{beaconType === 'hookup' && (
  <div className="space-y-4">
    <h3>Choose Mode</h3>
    
    <button onClick={() => setHookupMode('room')}>
      <Users className="w-6 h-6" />
      <div>
        <h4>Room-Based</h4>
        <p>For venues, floors, zones (safer default)</p>
      </div>
    </button>
    
    <button onClick={() => setHookupMode('1to1')}>
      <MessageCircle className="w-6 h-6" />
      <div>
        <h4>1-on-1</h4>
        <p>Personal QR for direct connections</p>
      </div>
    </button>
  </div>
)}
```

### Step 3: Form Fields

**Room Mode:**
```tsx
{hookupMode === 'room' && (
  <>
    <Input label="Zone Name" placeholder="MEN ON THIS FLOOR TONIGHT" />
    <Input label="Venue" placeholder="Club XYZ" />
    <Input label="Zone" placeholder="basement, darkroom, main-floor" />
    <Input label="Telegram Room ID" placeholder="hotmess_london_hookups_basement" required />
  </>
)}
```

**1:1 Mode:**
```tsx
{hookupMode === '1to1' && (
  <>
    <Input label="Your Name" placeholder="Connect with me" />
    <Textarea label="Description" placeholder="Looking to connect. Let's chat." />
    <Input 
      type="number" 
      label="Max Connections Per Hour" 
      placeholder="10" 
      min={1} 
      max={50} 
    />
  </>
)}
```

### Step 4: Safety Notice

Always show this for hookup beacons:

```tsx
{beaconType === 'hookup' && (
  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
    <div className="flex items-start gap-3">
      <Shield className="w-5 h-5 text-white/60" />
      <div>
        <h4 className="text-white mb-1">Safety First</h4>
        <p className="text-sm text-white/60">
          Hookup beacons include consent checks, rate limiting, and 
          enhanced moderation. All users see safety reminders.
        </p>
      </div>
    </div>
  </div>
)}
```

---

## API Integration

When submitting the form:

```tsx
const handleCreate = async () => {
  if (beaconType === 'hookup') {
    // Use hookup API
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/hookup/beacon/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          mode: hookupMode, // 'room' or '1to1'
          name: formData.name,
          description: formData.description,
          city: formData.city,
          venue: formData.venue,
          zone: formData.zone,
          telegram_room_id: hookupMode === 'room' ? formData.telegram_room_id : undefined,
          target_user_id: hookupMode === '1to1' ? user.id : undefined,
          membership_required: formData.membership_required,
          max_connections_per_hour: formData.max_connections_per_hour,
        }),
      }
    );
    
    const data = await response.json();
    // data.qr_url, data.beacon, data.xp_earned
  } else {
    // Use existing beacon API
    // ...
  }
};
```

---

## QR Code Display

After creation, show the QR with hookup-specific messaging:

```tsx
{result?.beacon?.type === 'hookup' && (
  <div className="text-center">
    <QRCode value={result.qr_url} size={256} />
    
    <div className="mt-4">
      {result.beacon.mode === 'room' ? (
        <p className="text-white/60">
          Post this QR in your venue. Men scan to join the hook-up room.
        </p>
      ) : (
        <p className="text-white/60">
          Your personal connection QR. Add to phone case, profile, or sticker.
        </p>
      )}
    </div>
    
    <div className="mt-4 p-4 bg-white/5 rounded-lg">
      <div className="text-sm text-white/60 mb-2">Sample Copy:</div>
      <div className="text-xs text-white/40 font-mono">
        {result.beacon.mode === 'room' 
          ? `MEN ON THIS FLOOR TONIGHT\n\n[QR CODE]\n\nSCAN → JOIN HOOK-UP ROOM\nMen-only. 18+. Consent-first.`
          : `SCAN IF YOU WANT TO CONNECT\n\n[QR CODE]\n\n@${username}\nHOTMESS.LONDON`
        }
      </div>
    </div>
  </div>
)}
```

---

## Membership Gates

Show membership requirements in the UI:

```tsx
{hookupMode === '1to1' && (
  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
    <div className="flex items-start gap-3">
      <Lock className="w-5 h-5 text-yellow-400" />
      <div>
        <h4 className="text-white mb-1">PRO Feature</h4>
        <p className="text-sm text-white/60">
          Creating 1-on-1 hookup QRs requires PRO membership (£15/mo).
          <button 
            onClick={() => navigate('pricing')} 
            className="text-yellow-400 ml-1 underline"
          >
            Upgrade now
          </button>
        </p>
      </div>
    </div>
  </div>
)}
```

---

## Alternative: Standalone Page

Instead of adding to existing generator, you can keep the standalone page at:

`/?route=hookupCreate`

**Benefits:**
- Cleaner separation of concerns
- Hookup-specific messaging throughout
- Easier to add advanced features later
- No cluttering of existing generator

**Link from Generator:**
```tsx
<div className="text-center mt-8">
  <p className="text-white/60 mb-2">Looking to create connection QRs?</p>
  <button 
    onClick={() => navigate('hookupCreate')}
    className="text-hot underline"
  >
    Create Hook-Up Beacon →
  </button>
</div>
```

---

## Testing Checklist

- [ ] Hookup option appears in type picker
- [ ] Room/1:1 mode selection works
- [ ] Form fields appear correctly for each mode
- [ ] Telegram Room ID required for room mode
- [ ] Safety notice always visible
- [ ] Membership gate shown for 1:1 (if not PRO)
- [ ] API creates beacon successfully
- [ ] QR code generated with correct URL format
- [ ] XP awarded correctly (+100 room, +50 1:1)
- [ ] Can copy QR URL
- [ ] Sample microcopy shown

---

## Recommended Approach

**Use the standalone page** (`/?route=hookupCreate`) for now.

**Why:**
1. Already fully implemented and ready
2. Cleaner UX for sensitive feature
3. Easier to iterate and add features
4. Keeps consent/safety messaging prominent
5. No risk of cluttering existing generator

**Link to it from:**
- Community page
- Beacons page
- Profile/account menu
- After successful room join
- In PRO membership benefits

---

## Next Steps

1. Test `/?route=hookupCreate` route
2. Create test beacon (both modes)
3. Test scanning via `/?route=hookupScan&code=<beaconId>`
4. Add prominent link from Beacons page
5. Add to navigation if desired
6. Partner with 1-2 clubs for pilot
7. Collect feedback
8. Iterate

---

**Status:** Ready for integration ✅
