# Shopify Integration Setup Guide

## Overview

The HOTMESS platform uses Shopify's Storefront API for product management and checkout. This guide will help you set up the Shopify integration from scratch.

## Prerequisites

- A Shopify account (free trial available at [shopify.com](https://www.shopify.com))
- Access to your Shopify Admin panel
- Basic understanding of environment variables

## Setup Steps

### 1. Create or Access Your Shopify Store

If you don't have a Shopify store yet:
1. Go to [shopify.com](https://www.shopify.com)
2. Sign up for a free trial
3. Complete the store setup wizard
4. Note your store domain (e.g., `your-store.myshopify.com`)

### 2. Create a Custom App for Storefront API Access

1. Log in to your Shopify Admin
2. Navigate to **Settings → Apps and sales channels**
3. Click **Develop apps**
4. Click **Create an app**
5. Name it "HOTMESS Frontend" or similar
6. Click **Create app**

### 3. Configure Storefront API Scopes

1. In your app settings, click **Configure Storefront API scopes**
2. Enable the following scopes:
   - `unauthenticated_read_product_listings` - Read products and collections
   - `unauthenticated_write_checkouts` - Create checkouts
   - `unauthenticated_read_checkouts` - Read checkout data
   - `unauthenticated_write_customers` - Create customer records
3. Click **Save**

### 4. Install the App and Get Access Token

1. Click **Install app** (confirm the installation)
2. Go to **API credentials** tab
3. Under **Storefront API access token**, click **Reveal token once**
4. **IMPORTANT:** Copy this token immediately - you won't be able to see it again
5. Store it securely

### 5. Configure Environment Variables

#### For Local Development

Create a `.env.local` file in the project root:

```bash
# Shopify Configuration
VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token_here
```

Replace:
- `your-store.myshopify.com` with your actual Shopify store domain
- `your_storefront_access_token_here` with the token from step 4

#### For Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add these variables:
   - Name: `VITE_SHOPIFY_DOMAIN`, Value: `your-store.myshopify.com`
   - Name: `VITE_SHOPIFY_STOREFRONT_TOKEN`, Value: `your_token_here`
4. Make sure to add them for all environments (Production, Preview, Development)
5. Redeploy your application

#### For GitHub Actions

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Add these secrets:
   - `VITE_SHOPIFY_DOMAIN`
   - `VITE_SHOPIFY_STOREFRONT_TOKEN`

### 6. Create Collections in Shopify

The HOTMESS platform uses four product collections:

1. In Shopify Admin, go to **Products → Collections**
2. Create these collections (case-insensitive):
   - **raw** - Foundation pieces, vests, tees
   - **hung** - Body-conscious pieces
   - **high** - Statement pieces
   - **super** - Extreme designs

Collection handles must match these exact names (lowercase).

### 7. Add Products to Collections

1. Go to **Products** in Shopify Admin
2. Click **Add product**
3. Fill in product details:
   - Title
   - Description
   - Images
   - Price
   - Variants (sizes, colors)
4. Under **Product organization**, add the product to one of your collections
5. Click **Save**

#### Optional: Add Custom Metafields

For enhanced product data, you can add custom metafields:

```
Namespace: custom
- xp_reward (number) - XP points earned on purchase
- aftercare_note (text) - Special care instructions
- care_instructions (text) - Washing/care details
- materials (JSON) - Array of materials
- features (JSON) - Array of product features
```

### 8. Configure Storefront Settings

1. In Shopify Admin, go to **Settings → Checkout**
2. Under **Customer accounts**, select **Optional** (not required)
3. Go to **Online Store → Preferences**
4. Make sure password protection is disabled for storefront
5. Click **Save**

### 9. Test the Integration

1. Restart your development server: `npm run dev`
2. Navigate to the Shop page
3. You should see products loading from Shopify
4. Test:
   - Viewing products
   - Adding to cart
   - Checkout flow

## Troubleshooting

### Products Not Loading

**Error:** "Shopify is not configured"
- **Solution:** Check that environment variables are set correctly
- Verify `VITE_SHOPIFY_DOMAIN` includes `.myshopify.com`
- Ensure `VITE_SHOPIFY_STOREFRONT_TOKEN` is the Storefront API token (not Admin API)

**Error:** "Failed to load products"
- **Solution:** Verify your Storefront API scopes are enabled
- Check that collections exist in Shopify with correct handles
- Ensure products are assigned to collections

### Checkout 401 Error

**Error:** 401 on `/private_access_tokens` during checkout
- **Solution:** In Shopify Admin → Settings → Checkout
- Set customer accounts to "Optional" (not "Required")
- Disable password protection on storefront

### Empty Collections

**Issue:** Collections load but show 0 products
- **Solution:** 
  - Verify products are added to the collections in Shopify
  - Check collection handles match exactly: `raw`, `hung`, `high`, `super`
  - Ensure products are published to "Online Store" sales channel

### Token Issues

**Error:** "Invalid API token"
- **Solution:**
  - Regenerate the Storefront API access token in Shopify
  - Update your environment variables
  - Restart your development server or redeploy

## API Limits

Shopify Storefront API has rate limits:
- **Regular plans:** 50 requests per second per IP
- **Plus plans:** 100 requests per second per IP

The integration automatically handles basic rate limiting, but for high-traffic sites, consider:
- Implementing caching
- Using a CDN for product images
- Batching product requests

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Rotate tokens** regularly (every 90 days recommended)
3. **Use separate tokens** for development and production
4. **Monitor API usage** in Shopify Admin
5. **Enable 2FA** on your Shopify account

## Additional Resources

- [Shopify Storefront API Documentation](https://shopify.dev/docs/api/storefront)
- [Shopify Custom Apps Guide](https://help.shopify.com/en/manual/apps/app-types/custom-apps)
- [GraphQL Storefront API Reference](https://shopify.dev/docs/api/storefront/reference)
- [Environment Variables in Vercel](https://vercel.com/docs/environment-variables)

## Support

If you encounter issues not covered in this guide:
1. Check the [GitHub Issues](https://github.com/SICQR/hotmess-london1/issues)
2. Review Shopify's [status page](https://status.shopify.com)
3. Contact Shopify support for store-specific issues

## Summary

✅ Shopify store created  
✅ Custom app configured  
✅ Storefront API scopes enabled  
✅ Access token obtained  
✅ Environment variables set  
✅ Collections created  
✅ Products added  
✅ Storefront settings configured  
✅ Integration tested  

Once all steps are complete, your HOTMESS shop will be fully functional with real-time product data from Shopify and secure checkout flows.
