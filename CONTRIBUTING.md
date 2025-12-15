# Contributing to HOTMESS LONDON

Thank you for your interest in contributing! This document provides guidelines and instructions for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Architecture Guidelines](#architecture-guidelines)

## Code of Conduct

HOTMESS LONDON is a care-first platform for queer men 18+. We expect all contributors to:

- ✅ Treat everyone with respect and dignity
- ✅ Use inclusive language
- ✅ Welcome constructive criticism
- ✅ Focus on what's best for the community
- ✅ Show empathy towards others

❌ Unacceptable behavior includes:
- Harassment, discrimination, or hate speech
- Trolling or inflammatory comments
- Publishing others' private information
- Sexualized language or advances (even in queer context)
- Other conduct inappropriate for a professional setting

## Getting Started

### Prerequisites

- Node.js 20+ (LTS)
- pnpm 8+
- Git
- Supabase account (for backend development)
- Supabase CLI (for database work)

### Setup

1. **Fork the repository**
   ```bash
   # On GitHub, click "Fork" button
   git clone https://github.com/YOUR-USERNAME/hotmess-london.git
   cd hotmess-london
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment**
   ```bash
   
   # Edit .env with your credentials
   ```

4. **Link to Supabase** (optional, for backend work)
   ```bash
   npx supabase link --project-ref your-project-id
   npx supabase db push
   ```

5. **Start development**
   ```bash
   pnpm dev
   ```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Creating a Feature

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Write code
   - Add tests
   - Update documentation

3. **Test locally**
   ```bash
   pnpm typecheck
   pnpm test:unit
   pnpm test:e2e
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(right-now): add realtime broadcast on post creation
fix(auth): resolve 401 error on GET /right-now
docs(readme): update deployment instructions
test(beacons): add E2E tests for QR scan flow
```

## Coding Standards

### TypeScript

- ✅ **Always use TypeScript** - No plain JS files
- ✅ **Define types** - Avoid `any` unless absolutely necessary
- ✅ **Use interfaces for objects** - Clear data structures
- ✅ **Export types** - Make types reusable

```typescript
// ✅ Good
interface RightNowPost {
  id: string
  mode: 'hookup' | 'crowd' | 'drop' | 'ticket' | 'radio' | 'care'
  headline: string
  body?: string
}

// ❌ Bad
const post: any = { ... }
```

### React Components

- ✅ **Functional components** - No class components
- ✅ **TypeScript props** - Define prop interfaces
- ✅ **Hooks over HOCs** - Prefer hooks for logic reuse
- ✅ **Named exports** - Easier to find and refactor

```typescript
// ✅ Good
interface RightNowCardProps {
  post: RightNowPost
  onDelete: (id: string) => void
}

export function RightNowCard({ post, onDelete }: RightNowCardProps) {
  return <div>...</div>
}

// ❌ Bad
export default function Card(props: any) { ... }
```

### Tailwind CSS

- ✅ **Use utility classes** - Don't write custom CSS unless necessary
- ❌ **NO font-size/weight/line-height classes** - These are locked in globals.css
- ✅ **Use design tokens** - Consistent with HOTMESS aesthetic
- ✅ **Mobile-first** - Start with mobile, then use `md:` `lg:` etc.

```tsx
// ✅ Good
<div className="bg-black border-2 border-white p-4 md:p-6">

// ❌ Bad - using font classes
<div className="text-2xl font-bold leading-tight">

// ❌ Bad - custom CSS
<div style={{ fontSize: '24px', fontWeight: 'bold' }}>
```

### File Organization

- ✅ **One component per file**
- ✅ **Colocate tests** - `Component.tsx` + `Component.test.tsx`
- ✅ **Group by feature** - Not by type
- ✅ **Use index files** - Export from feature modules

```
components/
  rightnow/
    RightNowCard.tsx
    RightNowCard.test.tsx
    RightNowFeed.tsx
    RightNowFeed.test.tsx
    index.ts              # Export all components
```

### Naming Conventions

- **Components**: PascalCase - `RightNowCard`
- **Files**: PascalCase for components - `RightNowCard.tsx`
- **Utilities**: camelCase - `rightNowClient.ts`
- **Types**: PascalCase - `RightNowPost`
- **Constants**: SCREAMING_SNAKE_CASE - `RATE_LIMIT_HOURLY`

## Testing Requirements

All new code must include tests. No exceptions.

### Unit Tests (Vitest)

- **Cover utilities and hooks**
- **Mock external dependencies**
- **Test edge cases**

```typescript
// lib/rightNowClient.test.ts
import { describe, it, expect, vi } from 'vitest'
import { fetchRightNowFeed } from './rightNowClient'

describe('fetchRightNowFeed', () => {
  it('should fetch posts successfully', async () => {
    // Test implementation
  })

  it('should handle errors gracefully', async () => {
    // Test error case
  })
})
```

### Component Tests (@testing-library/react)

- **Test user interactions**
- **Test accessibility**
- **Test error states**

```typescript
// components/rightnow/RightNowCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { RightNowCard } from './RightNowCard'

describe('RightNowCard', () => {
  it('should render post headline', () => {
    render(<RightNowCard post={mockPost} />)
    expect(screen.getByText('Looking for fun')).toBeInTheDocument()
  })

  it('should call onDelete when delete button clicked', async () => {
    const onDelete = vi.fn()
    render(<RightNowCard post={mockPost} onDelete={onDelete} />)
    
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledWith(mockPost.id)
  })
})
```

### E2E Tests (Playwright)

- **Test critical user flows**
- **Test authentication gates**
- **Test error handling**

```typescript
// tests/e2e/right-now.spec.ts
import { test, expect } from '@playwright/test'

test('should create and delete RIGHT NOW post', async ({ page }) => {
  await page.goto('/right-now/new')
  
  // Fill form
  await page.fill('[data-testid="headline"]', 'Test post')
  await page.click('[data-testid="submit"]')
  
  // Verify post appears
  await expect(page.getByText('Test post')).toBeVisible()
  
  // Delete post
  await page.click('[data-testid="delete"]')
  await expect(page.getByText('Test post')).not.toBeVisible()
})
```

### Coverage Requirements

- **Minimum 80% coverage** for new code
- **100% coverage** for critical paths (auth, payments, trust & safety)
- **Run coverage before PR**: `pnpm test:unit --coverage`

## Pull Request Process

### Before Submitting

1. ✅ **Code compiles** - `pnpm build` succeeds
2. ✅ **Types check** - `pnpm typecheck` passes
3. ✅ **Tests pass** - `pnpm test:unit && pnpm test:e2e` green
4. ✅ **Linting clean** - `pnpm lint` no errors
5. ✅ **Documentation updated** - If adding features
6. ✅ **Migration created** - If changing database schema

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added
- [ ] E2E tests added
- [ ] Manual testing completed

## Screenshots (if UI changes)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] All tests pass
```

### Review Process

1. **Submit PR** - Against `develop` branch
2. **CI checks** - Must pass automatically
3. **Code review** - At least 1 approval required
4. **Address feedback** - Make requested changes
5. **Merge** - Squash and merge to keep history clean

### PR Guidelines

- ✅ **Keep PRs small** - <500 lines changed ideal
- ✅ **One feature per PR** - Easy to review
- ✅ **Clear description** - Explain what and why
- ✅ **Link issues** - `Fixes #123`
- ❌ **No unrelated changes** - Stay focused

## Architecture Guidelines

### Supabase Client

**Always use the singleton** - Do NOT create multiple clients

```typescript
// ✅ Good
import { supabase } from '@/lib/supabase'

// ❌ Bad - creates duplicate client
import { createClient } from '@supabase/supabase-js'
const myClient = createClient(...)
```

### Edge Functions

- **Use Deno runtime** - Not Node.js
- **Import with `jsr:` or `npm:`** - Explicit protocol
- **Service role key only** - Never expose to frontend
- **Handle errors gracefully** - Return proper status codes
- **Log important events** - Use `console.log()`

```typescript
// ✅ Good Edge Function
import { Hono } from 'npm:hono'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const app = new Hono()

app.post('/example', async (c) => {
  try {
    const body = await c.req.json()
    // ... logic
    return c.json({ success: true }, 201)
  } catch (error) {
    console.error('Error:', error)
    return c.json({ error: error.message }, 500)
  }
})

Deno.serve(app.fetch)
```

### Database Migrations

- **Idempotent** - Can run multiple times safely
- **Use IF NOT EXISTS** - For tables, indexes, functions
- **Include rollback** - Document how to undo
- **Test locally first** - `npx supabase db reset`

```sql
-- ✅ Good migration
CREATE TABLE IF NOT EXISTS public.my_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE INDEX IF NOT EXISTS idx_my_table_created
  ON public.my_table (created_at DESC);

-- ❌ Bad migration
CREATE TABLE public.my_table (...);  -- Will fail if exists
```

### Security

- ❌ **Never commit secrets** - Use .env
- ✅ **Use RLS policies** - On every table
- ✅ **Validate inputs** - On both client and server
- ✅ **Sanitize user content** - Prevent XSS
- ❌ **Never trust client data** - Validate server-side

### Performance

- ✅ **Lazy load components** - Use `React.lazy()`
- ✅ **Optimize images** - WebP format, proper sizes
- ✅ **Index database queries** - Check with EXPLAIN
- ✅ **Limit API responses** - Max 200 items
- ✅ **Cache when possible** - Use React Query or similar

## Questions?

- **Discord**: [Join our community](#)
- **Email**: dev@hotmess.london
- **Issues**: [GitHub Issues](https://github.com/hotmess-london/webapp/issues)

---

Thank you for contributing to HOTMESS LONDON! 🔥


### Configuration (no .env files)
This repo is intended to open and run without creating local env files. Configuration values are centralized in **`src/lib/env.ts`**. Third‑party integrations that require server secrets (e.g. Stripe webhooks, Connect payouts) must be configured in the deployment environment (Supabase Edge Function secrets) and will show explicit “unavailable” states when not configured.
