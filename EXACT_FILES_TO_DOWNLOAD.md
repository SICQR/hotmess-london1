# 🔥 Exact Files to Download from Figma Make

## You Need These 7 Files (Minimum for QR Engine)

Download these files from the Figma Make file browser and recreate this structure on your laptop:

```
HOTMESS-LONDON1/
└── supabase/
    └── functions/
        └── server/
            ├── index.tsx
            ├── config.json
            ├── qr-styles.ts
            ├── beacon-signatures.ts
            └── routes/
                ├── qr.ts
                ├── l.ts
                └── x.ts
```

### Download from Figma Make:

1. `/supabase/functions/server/index.tsx` → Save to your laptop
2. `/supabase/functions/server/config.json` → Save to your laptop
3. `/supabase/functions/server/qr-styles.ts` → Save to your laptop
4. `/supabase/functions/server/beacon-signatures.ts` → Save to your laptop
5. `/supabase/functions/server/routes/qr.ts` → Save to your laptop
6. `/supabase/functions/server/routes/l.ts` → Save to your laptop
7. `/supabase/functions/server/routes/x.ts` → Save to your laptop

---

## OR Download All 48 Server Files (Recommended)

Download entire `/supabase/functions/server/` directory:

### All .tsx files:
- admin_api.tsx
- beacon_api.tsx
- beacon_resolver.tsx
- beacon_routes.tsx
- beacon_store.tsx
- beacons.tsx
- connect_api.tsx
- drops_api.tsx
- earth_routes.tsx
- email_service.tsx
- heat_api.tsx
- hookup_api.tsx
- index.tsx
- intel_api.tsx
- kv_store.tsx
- map_api.tsx
- market_api.tsx
- market_listings_api.tsx
- market_orders_api.tsx
- market_sellers_api.tsx
- membership_api.tsx
- messmarket_api.tsx
- notifications_api.tsx
- qr-auth.tsx
- records_api.tsx
- saved_api.tsx
- search_api.tsx
- seed-data.tsx
- seller_dashboard_api.tsx
- stripe_api.tsx
- telegram_bot.tsx
- telegram_webhook.tsx
- tickets_api.tsx
- tickets_c2c_api.tsx
- users_api.tsx
- vendor_api.tsx

### All .ts files:
- auth-middleware.ts
- beacon-signatures.ts
- earth-routes.ts
- make-integrations.ts
- qr-styles.ts

### Routes directory:
- routes/qr.ts
- routes/l.ts
- routes/x.ts

### Config:
- config.json

---

## After Downloading

Create these additional files on your laptop:

### .gitignore
```
node_modules/
.env
.env.local
.supabase/
*.log
.DS_Store
test-qr-*.svg
```

### README.md
```markdown
# 🔥 HOTMESS LONDON

Masculine nightlife OS with QR beacon engine.

## Deploy
\`\`\`bash
supabase link --project-ref rfoftonnlwudilafhfkl
supabase functions deploy server
\`\`\`

## Set Secrets
Supabase Dashboard → Settings → Edge Functions → Secrets:
- BEACON_SECRET (generate: openssl rand -base64 32)
- APP_BASE_URL=https://hotmess.london

## Test
\`\`\`bash
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/health
\`\`\`
```

---

## Then Deploy

```bash
cd HOTMESS-LONDON1
git init
git add .
git commit -m "🔥 HOTMESS QR Engine"
git remote add origin https://github.com/SICQR/HOTMESS-LONDON1.git
git branch -M main
git push -u origin main

supabase link --project-ref rfoftonnlwudilafhfkl
supabase functions deploy server
```

---

🔥 Done!
