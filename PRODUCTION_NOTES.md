# Hotmess London — Production Notes (Vite React)

This repo is configured as a **Vite + React (SPA)** build for Vercel.

## Deploy
- Build Command: `npm run build`
- Output Directory: `dist`
- SPA rewrites are configured in `vercel.json`.

## Local
```bash
npm install
npm run dev
```

If you previously deployed as Next.js, ensure the Vercel project Framework is set to **Vite** (or "Other") and uses `dist` as output.
