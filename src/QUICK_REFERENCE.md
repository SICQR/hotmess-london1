# HOTMESS LONDON - Quick Reference

**One-page cheat sheet for developers**

## ⚡ Quick Commands

```bash
# Development
pnpm dev                    # Start dev server (localhost:5173)
pnpm build                  # Production build
pnpm preview                # Preview build

# Testing
pnpm test                   # Run all tests
pnpm test:unit              # Unit tests only
pnpm test:e2e               # E2E tests only
pnpm test:e2e:ui            # Playwright UI mode

# Database
pnpm supabase:start         # Start local Supabase
pnpm supabase:reset         # Reset database
pnpm supabase:push          # Apply migrations
pnpm supabase:types         # Generate types

# Deployment
pnpm supabase:deploy        # Deploy Edge Functions
npx supabase db push --project-ref <id>  # Deploy migrations
```

## 🗂️ Project Structure

```
/
├── components/           # React components
│   ├── rightnow/        # RIGHT NOW module
│   ├── globe/           # 3D globe
│   └── ui/              # Radix primitives
├── lib/                 # Utilities
│   ├── supabase.ts     # ⚠️ Use this singleton!
│   └── rightNowClient.ts
├── supabase/
│   ├── functions/      # Edge Functions
│   │   └── right-now/  # Main RIGHT NOW API
│   └── migrations/     # Database migrations
├── tests/e2e/          # Playwright tests
└── src/test/           # Test utilities
```

## 🔐 Environment Variables

```bash
# Frontend (VITE_ prefix)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
VITE_MAPBOX_TOKEN=pk.xxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_xxx

# Backend (Server only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
STRIPE_SECRET_KEY=sk_xxx
OPENAI_API_KEY=sk-xxx
```

## 🎯 RIGHT NOW API

### GET Feed
```bash
curl "https://xxx.supabase.co/functions/v1/right-now?city=London&mode=hookup" \
  -H "apikey: your-anon-key"
```

### POST Create
```bash
curl -X POST "https://xxx.supabase.co/functions/v1/right-now" \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"mode":"hookup","headline":"Test","lat":51.5074,"lng":-0.1278}'
```

### DELETE Post
```bash
curl -X DELETE "https://xxx.supabase.co/functions/v1/right-now/post-id" \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer jwt-token"
```

## 🧪 Testing

### Run Specific Test
```bash
pnpm exec vitest run src/lib/rightNowClient.test.ts
pnpm exec playwright test tests/e2e/right-now.spec.ts
```

### Debug Test
```bash
pnpm exec playwright test --debug tests/e2e/auth.spec.ts
```

### Check Coverage
```bash
pnpm test:unit:coverage
open coverage/index.html
```

## 🗄️ Database

### Quick Queries
```sql
-- Check RIGHT NOW posts
SELECT * FROM right_now_active ORDER BY created_at DESC LIMIT 10;

-- Check user profile
SELECT * FROM profiles WHERE username = 'testuser';

-- Check XP events
SELECT * FROM xp_events WHERE user_id = 'xxx' ORDER BY created_at DESC;

-- Check heat bins
SELECT geo_bin, SUM(heat_value) as heat
FROM heat_bins
WHERE expires_at > NOW()
GROUP BY geo_bin
ORDER BY heat DESC
LIMIT 20;
```

### Create Test User
```sql
-- Insert test profile
INSERT INTO profiles (id, username, gender, dob, home_city, country)
VALUES (
  'test-user-id',
  'testuser',
  'man',
  '1995-01-01',
  'London',
  'UK'
);
```

## 🐛 Common Issues

### "Failed to load RIGHT NOW: 401"
```bash
# Solution: Deploy migration
npx supabase db push
```

### "Relation does not exist"
```bash
# Solution: Reset database
npx supabase db reset
```

### "Realtime not working"
✅ Check Edge Function has broadcast code (line 285)  
✅ Check channel subscription in client

### "Tests failing"
```bash
# Clean install
rm -rf node_modules
pnpm install

# Reset test database
npx supabase db reset
```

## 📱 Key Routes

```
/                         # Homepage
/right-now                # Live feed
/right-now/new            # Create post
/right-now/test-realtime  # Realtime dashboard
/beacons                  # Browse beacons
/l/:code                  # Scan beacon
/tickets                  # Ticket marketplace
/connect                  # Dating module
/records                  # Music releases
/admin                    # Admin panel
```

## 🎨 Design Tokens

```css
/* Colors */
--color-black: #000000
--color-white: #FFFFFF
--color-hotmess-red: #FF0066
--color-neon-pink: #FF00FF

/* Spacing */
--space-4: 1rem
--space-6: 1.5rem
--space-8: 2rem

/* Shadows */
--shadow-brutal: 4px 4px 0 0 var(--color-hotmess-red)
--shadow-neon: 0 0 20px rgba(255,0,102,0.5)
```

## 🔒 Security Checklist

- ✅ Never commit `.env` file
- ✅ Use `VITE_` prefix for client variables
- ✅ Service role key only in Edge Functions
- ✅ Auth bypass only in dev mode
- ✅ Validate all user inputs
- ✅ Use RLS policies on all tables

## 📚 Documentation

- **Setup**: `/README.md`
- **Contributing**: `/CONTRIBUTING.md`
- **Architecture**: `/COMPREHENSIVE_WEBAPP_AUDIT.md`
- **Design**: `/WHAT_I_INFERRED_FROM_FIGMA.md`
- **Implementation**: `/IMPLEMENTATION_COMPLETE.md`

## 🚀 Deploy Checklist

- [ ] Set environment variables
- [ ] Deploy Edge Functions: `pnpm supabase:deploy`
- [ ] Apply migrations: `npx supabase db push --project-ref <id>`
- [ ] Build frontend: `pnpm build`
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Test production URL
- [ ] Monitor error logs

## 💡 Tips

### Supabase Client
```typescript
// ✅ Always use singleton
import { supabase } from '@/lib/supabase'

// ❌ Never create new client
import { createClient } from '@supabase/supabase-js'
```

### Testing
```typescript
// Use test utilities
import { renderWithProviders } from '@/test/utils'

// Mock Supabase
import { createMockSupabaseClient } from '@/test/utils'
```

### Styling
```tsx
// ✅ Good
<div className="bg-black border-2 border-white p-6">

// ❌ Bad (locked in globals.css)
<div className="text-2xl font-bold">
```

---

**Need more help?** Check the full docs in `/README.md`
