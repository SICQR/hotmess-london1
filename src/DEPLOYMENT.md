# HOTMESS LONDON - Deployment Guide

This guide covers deploying HOTMESS LONDON to production with Supabase Edge Functions and Vercel/other hosting platforms.

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
Ensure all required secrets are configured in Supabase:

```bash
# Core Supabase
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_DB_URL

# Stripe
STRIPE_SECRET_KEY
STRIPE_RESTRICTED_KEY
VITE_STRIPE_PUBLISHABLE_KEY

# HOTMESS
BEACON_SECRET
APP_BASE_URL

# Integrations
LASTFM_API_KEY
LASTFM_SHARED_SECRET
```

### 2. Database Status
- ✅ All migrations run successfully
- ✅ RLS policies enabled
- ✅ Storage buckets created
- ✅ KV store operational

### 3. Code Quality
- [ ] No console errors in production build
- [ ] All TypeScript errors resolved
- [ ] Auth flows tested end-to-end
- [ ] Mobile responsive verified
- [ ] API routes functional

## 🚀 Deployment Steps

### Step 1: Deploy Edge Functions

Deploy the Hono server to Supabase Edge Functions:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref rfoftonnlwudilafhfkl

# Deploy the server function
supabase functions deploy server --no-verify-jwt

# Verify deployment
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/make-server-a670c824/health
```

### Step 2: Verify Environment Variables

Check all secrets are set in Supabase dashboard:
```
https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/settings/functions
```

### Step 3: Build Frontend

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally
npm run preview
```

### Step 4: Deploy Frontend

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
# Add VITE_STRIPE_PUBLISHABLE_KEY and other client-side variables
```

#### Option B: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy to Netlify
netlify deploy --prod

# Configure environment variables in Netlify dashboard
```

#### Option C: Static Hosting
```bash
# Build creates /dist folder
npm run build

# Upload /dist to your hosting provider
# (Cloudflare Pages, AWS S3, etc.)
```

### Step 5: Configure Domain

1. **Point domain to hosting**:
   - Update DNS records for `hotmessldn.com`
   - Add CNAME or A record as required by host

2. **Update CORS settings** in Supabase:
   - Go to Authentication > URL Configuration
   - Add `https://hotmessldn.com` to allowed origins

3. **Update APP_BASE_URL**:
   ```bash
   supabase secrets set APP_BASE_URL=https://hotmessldn.com
   ```

### Step 6: SSL Certificate

Ensure SSL/TLS is properly configured:
- Vercel/Netlify handle this automatically
- For custom hosting, use Let's Encrypt or Cloudflare

## 🔍 Post-Deployment Verification

### Critical Paths to Test

1. **Authentication**:
   - [ ] Sign up flow
   - [ ] Login flow
   - [ ] Password reset
   - [ ] OAuth (if applicable)

2. **Commerce**:
   - [ ] Shopify products loading
   - [ ] Stripe checkout working
   - [ ] Seller dashboard accessible
   - [ ] Payment processing

3. **Features**:
   - [ ] Beacon creation and scanning
   - [ ] QR code generation
   - [ ] Map/Globe rendering
   - [ ] Radio playback
   - [ ] Records downloads
   - [ ] Ticket marketplace

4. **Performance**:
   - [ ] Page load times < 3s
   - [ ] API response times < 500ms
   - [ ] No memory leaks
   - [ ] Images optimized

### Monitoring

Set up monitoring for:
- **Error tracking**: Sentry or similar
- **Analytics**: Google Analytics, Plausible, etc.
- **Uptime monitoring**: UptimeRobot, Pingdom
- **API monitoring**: Check Edge Function health

## 🔧 Troubleshooting

### Issue: Edge Functions Not Responding
```bash
# Check function logs
supabase functions logs server

# Redeploy
supabase functions deploy server --no-verify-jwt
```

### Issue: CORS Errors
- Verify `APP_BASE_URL` matches production domain
- Check CORS headers in server code
- Update Supabase Auth URL configuration

### Issue: Auth Errors
- Verify environment variables are set correctly
- Check Supabase Auth settings
- Ensure redirect URLs are whitelisted

### Issue: Stripe Integration
- Verify webhook endpoints are configured
- Check Stripe API keys (test vs live mode)
- Ensure Stripe Connect is set up correctly

### Issue: 404 on Page Refresh
For SPA routing:
- Add `_redirects` file (Netlify) or `vercel.json` (Vercel)
- Configure hosting to serve `index.html` for all routes

Example `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## 🔄 Update Workflow

### Updating Edge Functions
```bash
# Make changes to server code
# Test locally

# Deploy updated function
supabase functions deploy server --no-verify-jwt

# Verify deployment
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/make-server-a670c824/health
```

### Updating Frontend
```bash
# Make changes to frontend code
# Test locally

# Build
npm run build

# Deploy
vercel --prod  # or your hosting command
```

### Database Changes
⚠️ **Important**: Do NOT write migration files in the Make environment.

For schema changes:
1. Use Supabase dashboard SQL editor
2. Document changes in CHANGELOG.md
3. Update RLS policies if needed

## 📊 Performance Optimization

### Frontend
- Use lazy loading for components
- Optimize images (WebP format)
- Minimize bundle size
- Enable Gzip/Brotli compression

### Backend
- Monitor Edge Function cold starts
- Optimize database queries
- Use connection pooling
- Cache frequently accessed data

### Database
- Add indexes on commonly queried fields
- Monitor slow queries
- Use materialized views if needed
- Regular VACUUM operations

## 🔐 Security Checklist

- [ ] Environment variables secured
- [ ] Service role key NEVER exposed to frontend
- [ ] RLS policies enabled on all tables
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] XSS protection enabled
- [ ] HTTPS enforced
- [ ] Security headers configured

## 🌐 DNS Configuration

### Recommended DNS Records

```
Type    Name    Value                           TTL
A       @       [Your hosting IP]              3600
CNAME   www     hotmessldn.com                 3600
TXT     @       [Domain verification]          3600
```

### Cloudflare Setup (Recommended)
- Enable proxy (orange cloud)
- SSL/TLS set to "Full (strict)"
- Enable "Always Use HTTPS"
- Configure page rules for caching

## 📈 Scaling Considerations

### Current Limits
- Supabase: 500MB database, 2GB storage (Free tier)
- Edge Functions: 500K invocations/month (Free tier)

### Upgrade Triggers
- Database > 400MB: Upgrade to Pro
- Edge Functions > 400K/month: Upgrade to Pro
- Need more concurrent connections: Enable connection pooler

## 🆘 Rollback Procedure

If deployment fails:

1. **Revert Edge Functions**:
   ```bash
   # Deploy previous working version
   supabase functions deploy server --no-verify-jwt
   ```

2. **Revert Frontend**:
   ```bash
   # Use Vercel/Netlify deployment history
   # Or redeploy from previous git commit
   ```

3. **Database Rollback**:
   - Use Supabase point-in-time recovery (Pro plan)
   - Or restore from backup

## 📞 Support Contacts

- **Supabase Support**: https://supabase.com/support
- **Stripe Support**: https://support.stripe.com
- **Domain Issues**: Contact your DNS provider

## ✅ Production Readiness

Before going live, ensure:
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] Team trained on deployment process
- [ ] Incident response plan ready
- [ ] Legal compliance verified (GDPR, etc.)

---

## 🚀 Go Live!

Once all checks pass:
1. Deploy to production
2. Monitor for 24 hours
3. Announce launch
4. Celebrate 🎉

**Built with care for the queer nightlife community** 🖤💗
