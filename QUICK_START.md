# HOTMESS LONDON - Quick Start Guide

Get HOTMESS LONDON running locally in 5 minutes.

## ⚡ Quick Setup

### 1. Prerequisites
- Node.js 20+ installed
- npm or yarn
- Supabase CLI (optional, for Edge Functions)

### 2. Clone & Install
```bash
# Install dependencies
npm install
```

### 3. Environment Setup
All environment variables are already configured in Supabase:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY`
- `LASTFM_API_KEY`
- And more...

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎯 Key Features to Test

### 1. Authentication
- Visit `/login` or `/register`
- Test sign up and login flows
- Try password reset at `/forgot-password`

### 2. Night Pulse Globe
- Visit `/map` to see the 3D globe
- Explore beacons across London
- Click markers for details

### 3. Beacons
- Visit `/beacons` to browse all beacons
- Create a beacon (requires auth)
- Scan QR codes

### 4. Shop (Shopify)
- Visit `/shop` to see real Shopify products
- Browse collections
- Test checkout flow

### 5. Records (Music Platform)
- Visit `/records` for music releases
- Stream tracks
- Download music (requires auth)

### 6. Radio
- Visit `/radio` for HOTMESS Radio
- Live streaming 24/7
- Connect Last.fm account
- See real-time listener count

### 7. Tickets (C2C Marketplace)
- Visit `/tickets` to browse events
- Create ticket listings (requires auth)
- Purchase tickets

### 8. MessMarket
- Visit `/messmarket` for peer-to-peer marketplace
- Browse listings
- Create listings (requires seller account)

---

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build           # Production build

# Supabase
supabase login          # Login to Supabase
supabase link           # Link to project
supabase functions deploy server --no-verify-jwt  # Deploy Edge Functions
```

---

## 📁 Project Structure

```
/
├── app/                    # Next.js app router pages
├── components/            # React components
├── lib/                   # Utilities and services
├── supabase/functions/    # Edge Functions (122+ routes)
├── styles/                # Global styles
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript definitions
└── docs/                  # Documentation
```

---

## 🎨 Design System

### Colors
- **Hot Pink**: `#E70F3C` (Primary)
- **Heat Orange**: `#FF622D` (Secondary)
- **Neon Lime**: `#B2FF52` (Accent)
- **Cyan Static**: `#29E2FF` (Accent)

### Typography Rules
- ❌ NO Tailwind text classes
- ✅ Use inline styles: 
  ```tsx
  <h1 style={{ fontSize: '32px', fontWeight: 700 }}>Title</h1>
  ```

---

## 🔐 Test Accounts

### Admin Account
Create an admin account by:
1. Signing up normally
2. Manually promoting user to admin role in Supabase

### Seller Account
1. Sign up normally
2. Complete Stripe Connect onboarding at `/seller/dashboard`

---

## 🚀 API Routes

All routes are prefixed with:
```
/make-server-a670c824/
```

### Test API Health
```bash
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/make-server-a670c824/health
```

### Common Endpoints
- `GET /beacons` - Get all beacons
- `GET /records/releases` - Get music releases
- `GET /radio/status` - Radio live status
- `GET /shop/products` - Shopify products
- `GET /tickets/browse` - Browse tickets

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Auth Errors
- Check Supabase URL configuration
- Verify environment variables
- Clear browser cookies

### API Not Responding
```bash
# Check Edge Functions status
supabase functions logs server
```

---

## 📚 Documentation

- **Full README**: `/README.md`
- **API Reference**: `/API.md`
- **Contributing**: `/CONTRIBUTING.md`
- **Deployment**: `/DEPLOYMENT.md`
- **Changelog**: `/CHANGELOG.md`

---

## 🆘 Need Help?

1. Check `/docs` folder for detailed documentation
2. Review error logs in browser console
3. Check Supabase Edge Function logs
4. Refer to troubleshooting guides

---

## ✅ Feature Checklist

Test these features after setup:

- [ ] Homepage loads
- [ ] Can sign up / login
- [ ] Map displays correctly
- [ ] Beacons are visible
- [ ] Shop shows products
- [ ] Radio plays audio
- [ ] Records page loads
- [ ] Tickets browsing works
- [ ] MessMarket displays
- [ ] Admin panel accessible (admin only)

---

## 🎉 Ready to Build!

You're all set! HOTMESS LONDON should now be running locally.

### Next Steps:
1. Explore the codebase
2. Test all features
3. Read `/CONTRIBUTING.md` for development guidelines
4. Check `/docs` for detailed feature documentation

---

**Built with care for the queer nightlife community** 🖤💗

*For detailed information, see `/README.md`*
