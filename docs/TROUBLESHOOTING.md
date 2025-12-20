# Troubleshooting Guide

## Build Failures

### CSS Template Literal Errors

**Error:** `Expected identifier but found whitespace` or `Unexpected "$"` in CSS minification

**Example:**
```
[esbuild css minify] ERROR at line 6031
--tw-rotate: ${rotation}deg;
           ^^^^^^^^^ JavaScript template literal in CSS context
```

**Cause:** JavaScript template literals used in CSS context, particularly with dynamic Tailwind classes like `rotate-[${rotation}deg]`

**Fix:** 
Use inline styles or CSS custom properties instead:

```tsx
// ❌ WRONG - Template literal in dynamic Tailwind class
const rotationStyle = rotation !== 0 ? `rotate-[${rotation}deg]` : '';

// ✅ CORRECT - Use inline CSS transform
const getRotationStyle = (): CSSProperties => {
  if (rotation !== 0) {
    return { transform: `rotate(${rotation}deg)` };
  }
  return {};
};

// Apply in JSX
<h1 className="text-4xl" style={getRotationStyle()}>
  {headline}
</h1>
```

### Missing Environment Variables

**Error:** Build succeeds but runtime errors occur, or missing required environment variables

**Fix:** 
1. Check `.env.example` for all required variables
2. Create `.env.local` with required values:
   ```bash
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
3. Never commit `.env` files to version control

### TypeScript Errors

**Error:** `npm run type-check` fails with multiple errors

**Common Issues:**

1. **Deno types in Supabase Functions**
   - Supabase Edge Functions use Deno runtime
   - Type errors in `src/supabase/functions/` are expected if Deno types aren't configured
   - These don't affect the Vite build

2. **Missing type declarations**
   - Install missing `@types/` packages
   - Add type declarations for third-party libraries

3. **Import.meta.env errors**
   ```typescript
   // ❌ WRONG
   const url = import.meta.env.VITE_SUPABASE_URL;
   
   // ✅ CORRECT - Add type declaration or use optional chaining
   const url = import.meta.env?.VITE_SUPABASE_URL as string;
   ```

### Build Output Directory Mismatch

**Error:** CI workflow fails with "No files were found with the provided path: dist/"

**Cause:** Build output directory in `vite.config.ts` doesn't match CI expectations

**Fix:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    outDir: 'dist', // Should match CI workflow artifact path
  },
});
```

---

## Runtime Issues

### Supabase Connection Errors

**Error:** "Failed to fetch" or "Invalid Supabase URL"

**Checklist:**
1. Verify `VITE_SUPABASE_URL` is set correctly
2. Verify `VITE_SUPABASE_ANON_KEY` is set correctly
3. Check Supabase project is not paused
4. Verify network connectivity

### Authentication Issues

**Error:** "Invalid JWT" or "User not authenticated"

**Solutions:**
1. Clear browser local storage and cookies
2. Check Supabase Auth settings
3. Verify JWT secret is correct
4. Try logging in again

---

## Development Setup

### Clean Install

If you encounter persistent issues, try a clean install:

```bash
# Remove dependencies and build artifacts
rm -rf node_modules dist build

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Run build
npm run build
```

### Common Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

---

## CI/CD Issues

### GitHub Actions Workflow Failures

**Build Job Fails:**
1. Check workflow logs for specific errors
2. Verify all required secrets are configured in GitHub
3. Test build locally: `npm run build`
4. Ensure `dist/` directory is created

**Type Check Job Fails:**
1. Run locally: `npm run type-check`
2. Fix type errors or update TypeScript configuration
3. Consider excluding Deno-specific files if needed

**Lint Job Fails:**
1. Run locally: `npm run lint`
2. Auto-fix: `npm run lint:fix`
3. Fix remaining errors manually

### Required GitHub Secrets

**Critical (Build-blocking):**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**Deployment:**
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `SUPABASE_ACCESS_TOKEN` - Supabase access token
- `SUPABASE_PROJECT_ID` - Supabase project ID

**Optional:**
- `CODECOV_TOKEN` - Code coverage reporting
- `SNYK_TOKEN` - Security scanning
- `SENTRY_AUTH_TOKEN` - Error tracking
- `SLACK_WEBHOOK_URL` - Notifications

---

## Performance Issues

### Large Bundle Size

**Warning:** "Some chunks are larger than 500 kB after minification"

**Solutions:**
1. Use dynamic imports for code splitting:
   ```typescript
   const Component = lazy(() => import('./Component'));
   ```

2. Configure manual chunks in `vite.config.ts`:
   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           vendor: ['react', 'react-dom'],
           // Add more chunk configurations
         }
       }
     }
   }
   ```

3. Analyze bundle: `npm run build -- --mode analyze`

---

## Getting Help

If you're still experiencing issues:

1. Check existing GitHub issues
2. Review recent commit history for breaking changes
3. Consult the main README.md for setup instructions
4. Create a new issue with:
   - Error message/screenshot
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)
   - Relevant code snippets
