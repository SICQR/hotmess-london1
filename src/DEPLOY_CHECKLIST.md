# 🚀 HOTMESS LONDON - Production Deployment Checklist

**Use this checklist to ensure a smooth production deployment**

---

## Pre-Deployment

### 1. Environment Setup

- [ ] **Create production Supabase project**
  - Go to https://app.supabase.com
  - Create new project
  - Note project ID and region

- [ ] **Get API keys from Supabase**
  - Settings → API
  - Copy `Project URL`
  - Copy `anon public` key
  - Copy `service_role` key (KEEP SECRET!)

- [ ] **Get third-party API keys**
  - [ ] Mapbox token: https://account.mapbox.com/access-tokens/
  - [ ] Stripe keys: https://dashboard.stripe.com/apikeys
  - [ ] RadioKing (optional)
  - [ ] Last.fm (optional)
  - [ ] OpenAI (optional)

- [ ] **Set environment variables in deployment platform**
  ```bash
  VITE_SUPABASE_URL=https://xxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbG...
  VITE_MAPBOX_TOKEN=pk.xxx
  VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
  ```

### 2. Database Setup

- [ ] **Link to production project**
  ```bash
  npx supabase link --project-ref your-production-project-id
  ```

- [ ] **Apply all migrations**
  ```bash
  npx supabase db push --project-ref your-production-project-id
  ```

- [ ] **Verify migrations succeeded**
  - Go to Supabase Dashboard → Table Editor
  - Check tables exist:
    - [ ] `profiles`
    - [ ] `right_now_posts`
    - [ ] `right_now_active` (view)
    - [ ] `beacons`
    - [ ] `ticket_listings`
    - [ ] `ticket_threads`
    - [ ] `ticket_messages`

- [ ] **Verify RLS policies**
  - Go to Supabase Dashboard → Authentication → Policies
  - Check RLS is enabled on all tables
  - Verify policies exist for each table

- [ ] **Create storage buckets**
  - Go to Supabase Dashboard → Storage
  - Create buckets:
    - [ ] `beacons` (private)
    - [ ] `profiles` (public)
    - [ ] `records-audio` (private)
    - [ ] `records-artwork` (public)
    - [ ] `ticket-proofs` (private)

- [ ] **Set bucket policies**
  - Allow authenticated users to upload
  - Allow public read for public buckets
  - Require authentication for private buckets

### 3. Edge Functions Deployment

- [ ] **Set Supabase access token**
  ```bash
  export SUPABASE_ACCESS_TOKEN=your-access-token
  ```
  Get from: Supabase Dashboard → Settings → Access Tokens

- [ ] **Deploy all Edge Functions**
  ```bash
  npx supabase functions deploy right-now
  npx supabase functions deploy hotmess-concierge
  npx supabase functions deploy beacon-expiry-worker
  ```

- [ ] **Set Edge Function secrets**
  ```bash
  npx supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
  npx supabase secrets set OPENAI_API_KEY=sk-xxx
  npx supabase secrets set RADIOKING_API_KEY=xxx
  npx supabase secrets set LASTFM_API_KEY=xxx
  ```

- [ ] **Test Edge Functions**
  ```bash
  curl https://xxx.supabase.co/functions/v1/right-now \
    -H "apikey: your-anon-key"
  ```

### 4. Frontend Build

- [ ] **Run production build**
  ```bash
  pnpm build
  ```

- [ ] **Check build output**
  - Verify `dist/` folder created
  - Check bundle size (should be <5MB)
  - No errors in build log

- [ ] **Test production build locally**
  ```bash
  pnpm preview
  ```
  - Visit http://localhost:4173
  - Test key flows

### 5. CI/CD Setup (GitHub Actions)

- [ ] **Set GitHub Secrets**
  - Go to GitHub → Settings → Secrets → Actions
  - Add secrets:
    - [ ] `SUPABASE_ACCESS_TOKEN`
    - [ ] `SUPABASE_DB_PASSWORD`
    - [ ] `VITE_SUPABASE_URL`
    - [ ] `VITE_SUPABASE_ANON_KEY`
    - [ ] `LOCAL_SUPABASE_ANON_KEY` (for CI tests)
    - [ ] `VITE_MAPBOX_TOKEN`
    - [ ] `VITE_STRIPE_PUBLISHABLE_KEY`

- [ ] **Verify workflow file**
  - Check `.github/workflows/ci.yml` exists
  - Push to trigger CI
  - Verify all jobs pass

---

## Deployment

### Option A: Deploy to Vercel

1. **Connect GitHub repository**
   - Go to https://vercel.com
   - New Project → Import Git Repository

2. **Configure build settings**
   - Framework: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

3. **Set environment variables**
   - Add all `VITE_` prefixed variables
   - Don't add server-only variables!

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Get production URL

### Option B: Deploy to Netlify

1. **Connect GitHub repository**
   - Go to https://netlify.com
   - New Site → Import Project

2. **Configure build settings**
   - Build Command: `pnpm build`
   - Publish Directory: `dist`
   - Base Directory: (leave empty)

3. **Set environment variables**
   - Site Settings → Environment Variables
   - Add all `VITE_` prefixed variables

4. **Deploy**
   - Trigger deploy
   - Get production URL

### Option C: Deploy to Custom Server

1. **Build application**
   ```bash
   pnpm build
   ```

2. **Upload dist folder**
   ```bash
   rsync -avz dist/ user@server:/var/www/hotmess/
   ```

3. **Configure web server (nginx example)**
   ```nginx
   server {
     listen 80;
     server_name hotmess.london;
     root /var/www/hotmess;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

4. **Set up SSL**
   ```bash
   certbot --nginx -d hotmess.london
   ```

---

## Post-Deployment

### 1. Verify Deployment

- [ ] **Visit production URL**
  - Site loads without errors
  - No console errors in DevTools

- [ ] **Test age gate**
  - Clear cookies/localStorage
  - Refresh page
  - Age gate appears
  - Click ENTER → enters site

- [ ] **Test authentication**
  - [ ] Registration works
  - [ ] Email confirmation (if enabled)
  - [ ] Login works
  - [ ] Logout works

- [ ] **Test RIGHT NOW module**
  - [ ] Feed loads
  - [ ] Can create post (if authenticated)
  - [ ] Post appears in feed
  - [ ] Can delete own post
  - [ ] Realtime updates work

- [ ] **Test beacons**
  - [ ] Can scan beacon: `/l/GLO-001`
  - [ ] QR code generation works
  - [ ] Scan tracking works

- [ ] **Test tickets**
  - [ ] Can browse listings
  - [ ] Can create listing (if authenticated)
  - [ ] Messaging works

- [ ] **Test payments (Stripe)**
  - [ ] Can add item to cart
  - [ ] Checkout redirects to Stripe
  - [ ] Test mode works
  - [ ] Webhook receives events

### 2. Performance Check

- [ ] **Run Lighthouse audit**
  - Open DevTools → Lighthouse
  - Run audit for:
    - [ ] Performance > 70
    - [ ] Accessibility > 90
    - [ ] Best Practices > 80
    - [ ] SEO > 80

- [ ] **Check bundle size**
  ```bash
  npx vite-bundle-visualizer
  ```
  - Total bundle < 5MB
  - No duplicate libraries

- [ ] **Test on mobile**
  - iOS Safari
  - Android Chrome
  - Responsive design works

### 3. Set Up Monitoring

- [ ] **Configure error tracking (Sentry)**
  ```bash
  npm install @sentry/react
  ```
  - Add DSN to environment
  - Initialize in App.tsx

- [ ] **Set up analytics (PostHog/Google Analytics)**
  - Create account
  - Add tracking code
  - Test events fire

- [ ] **Set up uptime monitoring (UptimeRobot)**
  - Monitor production URL
  - Alert on downtime

- [ ] **Set up log aggregation**
  - View Supabase logs
  - Set up alerts for errors

### 4. Configure DNS & Domain

- [ ] **Point domain to deployment**
  - Add A/CNAME records
  - Wait for DNS propagation (up to 48h)

- [ ] **Enable SSL/TLS**
  - Most platforms auto-provision
  - Verify https:// works

- [ ] **Set up redirects**
  - www → non-www (or vice versa)
  - http → https

### 5. Create Backups

- [ ] **Enable Supabase backups**
  - Supabase Dashboard → Settings → Backups
  - Daily automatic backups

- [ ] **Export initial data**
  ```bash
  npx supabase db dump > backup.sql
  ```

- [ ] **Document restore procedure**
  ```bash
  psql -h db.xxx.supabase.co -U postgres < backup.sql
  ```

---

## Production Checklist

### Security

- [ ] All secrets in environment variables
- [ ] No API keys in code
- [ ] RLS enabled on all tables
- [ ] CORS configured properly
- [ ] HTTPS enforced
- [ ] Auth bypass disabled in production

### Performance

- [ ] Images optimized (WebP)
- [ ] Code splitting enabled
- [ ] Lazy loading for routes
- [ ] CDN configured
- [ ] Compression enabled (gzip/brotli)

### SEO

- [ ] Meta tags set
- [ ] Open Graph tags
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Favicon set

### Legal

- [ ] Terms of Service live
- [ ] Privacy Policy live
- [ ] Cookie consent banner
- [ ] Age gate (18+)
- [ ] Contact information

### Operations

- [ ] Error tracking configured
- [ ] Analytics tracking
- [ ] Uptime monitoring
- [ ] Log aggregation
- [ ] Backup strategy

---

## Post-Launch

### Week 1

- [ ] Monitor error logs daily
- [ ] Check analytics for issues
- [ ] Gather user feedback
- [ ] Fix critical bugs ASAP
- [ ] Performance monitoring

### Week 2-4

- [ ] Review user behavior
- [ ] Optimize slow pages
- [ ] Add missing features
- [ ] Improve based on feedback
- [ ] Plan next release

### Monthly

- [ ] Review analytics
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance review
- [ ] User satisfaction survey

---

## Rollback Procedure

**If something goes wrong:**

1. **Immediately rollback frontend**
   - Vercel: Deployments → Previous → Promote
   - Netlify: Deploys → Previous → Publish

2. **Rollback database** (if needed)
   ```bash
   # Restore from backup
   psql -h db.xxx.supabase.co -U postgres < backup.sql
   ```

3. **Rollback Edge Functions**
   ```bash
   # Deploy previous version
   git checkout <previous-commit>
   npx supabase functions deploy
   ```

4. **Notify users**
   - Post status update
   - Send email if critical

5. **Debug offline**
   - Check logs
   - Reproduce issue locally
   - Fix and redeploy

---

## Support Contacts

- **Supabase Support**: https://supabase.com/support
- **Vercel Support**: https://vercel.com/support
- **Stripe Support**: https://support.stripe.com
- **Mapbox Support**: https://support.mapbox.com

---

## Success Criteria

✅ Site is live and accessible  
✅ No console errors  
✅ All core features work  
✅ Mobile responsive  
✅ Fast load times (<3s)  
✅ Analytics tracking  
✅ Error monitoring active  
✅ Backups configured  
✅ SSL certificate valid  
✅ Legal pages live  

---

**🎉 Ready to launch!**

*Last updated: December 10, 2024*
