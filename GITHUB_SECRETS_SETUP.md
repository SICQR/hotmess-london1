# GitHub Secrets Configuration Guide

This document lists all the GitHub secrets that need to be configured for the CI/CD pipeline to work properly.

## Required Secrets

Configure these in: **GitHub Repository Settings → Secrets and variables → Actions**

### Core Application Secrets (Required)

#### Supabase
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key for production
- `VITE_SUPABASE_URL_STAGING` - Supabase URL for preview deployments
- `VITE_SUPABASE_ANON_KEY_STAGING` - Supabase anonymous key for preview deployments
- `SUPABASE_ACCESS_TOKEN` - Supabase CLI access token for deploying Edge Functions
- `SUPABASE_PROJECT_REF` - Supabase project reference ID

#### Stripe
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

#### Shopify
- `VITE_SHOPIFY_DOMAIN` - Your Shopify store domain
- `VITE_SHOPIFY_STOREFRONT_TOKEN` - Shopify Storefront API token

#### Mapbox
- `VITE_MAPBOX_TOKEN` - Mapbox access token for map features

#### Vercel
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

## Optional Secrets

These secrets are optional. The CI/CD pipeline will work without them, but some features will be disabled.

#### Error Tracking (Sentry)
- `SENTRY_AUTH_TOKEN` - Sentry authentication token
- `SENTRY_ORG` - Sentry organization name
- `SENTRY_PROJECT` - Sentry project name

#### Security Scanning (Snyk)
- `SNYK_TOKEN` - Snyk API token for enhanced security scanning

#### Notifications (Slack)
- `SLACK_WEBHOOK_URL` - Slack webhook URL for deployment notifications

## How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name (exactly as listed above)
5. Enter the secret value
6. Click **Add secret**

## Verification

After adding secrets, you can verify they're configured correctly by:

1. Pushing a commit to a PR branch
2. Checking the Actions tab to see if workflows run successfully
3. Looking for any errors related to missing environment variables

## Security Best Practices

- Never commit secrets to the repository
- Rotate secrets regularly
- Use different secrets for staging and production environments
- Limit access to secrets to only those who need them
- Review secret usage in workflow logs (values are automatically masked)
