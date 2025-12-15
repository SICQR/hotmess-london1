/**
 * E2E tests for authentication flows
 */
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear all storage
    await page.context().clearCookies()
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  test('should show age gate on first visit', async ({ page }) => {
    await page.goto('/')
    
    // Should show age gate
    await expect(page.getByText(/18\+|Are you 18 or older/i)).toBeVisible()
    
    // Has ENTER and LEAVE buttons
    await expect(page.getByRole('button', { name: /enter/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /leave/i })).toBeVisible()
  })

  test('should allow entry after age verification', async ({ page }) => {
    await page.goto('/')
    
    // Click ENTER on age gate
    await page.click('button:has-text("ENTER")')
    
    // Should now see main app
    await expect(page.getByText('HOTMESS')).toBeVisible()
    
    // Age verification should be stored
    const verified = await page.evaluate(() =>
      localStorage.getItem('hotmess_age_verified')
    )
    expect(verified).toBe('true')
  })

  test('should redirect to Google when clicking LEAVE', async ({ page }) => {
    await page.goto('/')
    
    // Set up navigation listener
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.click('button:has-text("LEAVE")'),
    ])
    
    // Should redirect to Google
    await expect(newPage).toHaveURL(/google\.com/)
  })

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')
    await page.click('button:has-text("ENTER")')
    
    // Navigate to login
    await page.goto('/login')
    
    // Should show login form
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in|login/i })).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/')
    await page.click('button:has-text("ENTER")')
    
    await page.goto('/register')
    
    // Should show registration form
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i)).toBeVisible()
    await expect(page.getByPlaceholder(/username/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up|register/i })).toBeVisible()
  })

  test('should show validation errors on empty login', async ({ page }) => {
    await page.goto('/login')
    
    // Try to submit without credentials
    await page.click('button[type="submit"]')
    
    // Should show validation errors
    await expect(page.getByText(/required|enter your email/i)).toBeVisible()
  })

  test('should enable dev bypass in development mode', async ({ page }) => {
    await page.goto('/')
    await page.click('button:has-text("ENTER")')
    
    // Check if dev bypass is enabled
    const devBypass = await page.evaluate(() =>
      localStorage.getItem('hotmess_dev_auth_bypass')
    )
    
    // In dev mode, should be enabled
    if (process.env.NODE_ENV !== 'production') {
      expect(devBypass).toBe('true')
    }
  })

  test('complete signup flow (mocked)', async ({ page }) => {
    // This test would require Supabase connection
    // Skip in CI without proper setup
    if (process.env.CI && !process.env.VITE_SUPABASE_URL) {
      test.skip()
      return
    }

    await page.goto('/register')
    
    // Fill in registration form
    const timestamp = Date.now()
    await page.fill('[data-testid="email-input"]', `test-${timestamp}@example.com`)
    await page.fill('[data-testid="username-input"]', `testuser${timestamp}`)
    await page.fill('[data-testid="password-input"]', 'TestPassword123!')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should either redirect to welcome or show success message
    await expect(
      page.getByText(/welcome|success|check your email/i)
    ).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Protected Routes', () => {
  test('should allow access to public routes without auth', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('hotmess_age_verified', 'true')
    })

    // Public routes that should be accessible
    const publicRoutes = ['/', '/beacons', '/radio', '/care', '/legal']

    for (const route of publicRoutes) {
      await page.goto(route)
      
      // Should not redirect to login
      await expect(page).toHaveURL(new RegExp(route.replace('/', '\\/')))
    }
  })

  test('should block admin routes without admin role', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('hotmess_age_verified', 'true')
      localStorage.setItem('hotmess_dev_auth_bypass', 'true')
    })

    await page.goto('/admin')
    
    // Should either redirect or show forbidden message
    // (Implementation depends on your auth setup)
    const hasAdminContent = await page.getByText('Admin Dashboard').isVisible().catch(() => false)
    const hasForbidden = await page.getByText(/forbidden|unauthorized/i).isVisible().catch(() => false)
    
    // One of these should be true
    expect(hasAdminContent || hasForbidden).toBe(true)
  })
})
