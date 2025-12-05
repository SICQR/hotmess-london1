# ⚡ RadioKing API - 2 Minute Setup

## Get Real-Time Listener Data in 3 Steps

---

## Step 1: Get Your API Token

1. Go to https://www.radioking.com/admin
2. Click **Settings** → **API** 
3. Click **Generate New Token**
4. Copy the token (starts with `rk_live_...`)

---

## Step 2: Add Token to Code

Open `/lib/env.ts` and replace this line:

```typescript
export const RADIOKING_TOKEN = '';
```

With your actual token:

```typescript
export const RADIOKING_TOKEN = 'rk_live_abc123...';
```

---

## Step 3: Verify It Works

1. Save the file
2. Restart your dev server
3. Visit the Radio page (`/radio`)
4. You should see **real listener counts** updating every 30 seconds

---

## What You Get

### Real-Time Data:
- ✅ Live listener count (updates every 30s)
- ✅ Peak listeners today
- ✅ Current track playing
- ✅ Album artwork
- ✅ Show schedule
- ✅ Track history

### Where It Appears:
- Radio page hero section
- City OS intelligence panels
- Floating listener badge (top-right)
- Now playing bars across the site

---

## Troubleshooting

### Still seeing mock data?
- Check the token is copied correctly (no spaces)
- Verify your RadioKing account has API access enabled
- Check browser console for any API errors

### API rate limits?
The integration polls every **30 seconds** to stay well under RadioKing's limits (typically 60 requests/minute).

---

## Optional: Environment Variable (Production)

For production deployments, you can also set as an environment variable:

```bash
VITE_RADIOKING_TOKEN=rk_live_abc123...
```

Then update `/lib/env.ts`:

```typescript
export const RADIOKING_TOKEN = import.meta.env.VITE_RADIOKING_TOKEN || '';
```

---

## Need Help?

RadioKing API Docs: https://doc.radioking.com/api/  
Your Radio ID: **736103** (already configured)  
Stream URL: `https://listen.radioking.com/radio/736103/stream/802454`

---

**That's it!** Your radio intelligence is now pulling live data. 🎧🔥
