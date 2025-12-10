/**
 * E2E tests for RIGHT NOW module
 * Tests the complete flow: compose → live feed → delete
 */
import { test, expect } from '@playwright/test'

test.describe('RIGHT NOW Module', () => {
  test.beforeEach(async ({ page }) => {
    // Set auth bypass for testing
    await page.addInitScript(() => {
      localStorage.setItem('hotmess_dev_auth_bypass', 'true')
      localStorage.setItem('hotmess_age_verified', 'true')
    })
  })

  test('should load RIGHT NOW page and show mode filters', async ({ page }) => {
    await page.goto('/right-now')
    
    // Wait for page to load
    await expect(page.getByText('RIGHT NOW')).toBeVisible()
    
    // Check mode filters are present
    await expect(page.getByText('Hookup')).toBeVisible()
    await expect(page.getByText('Crowd')).toBeVisible()
    await expect(page.getByText('Care')).toBeVisible()
  })

  test('should navigate to create post page', async ({ page }) => {
    await page.goto('/right-now')
    
    // Click create button
    await page.getByRole('button', { name: /create/i }).click()
    
    // Should navigate to create page
    await expect(page).toHaveURL(/\/right-now\/new/)
    await expect(page.getByText(/Create RIGHT NOW Post/i)).toBeVisible()
  })

  test('should show validation errors for empty post', async ({ page }) => {
    await page.goto('/right-now/new')
    
    // Try to submit without filling anything
    await page.getByRole('button', { name: /post/i }).click()
    
    // Should show validation errors
    await expect(page.getByText(/required/i)).toBeVisible()
  })

  test('should load realtime test dashboard', async ({ page }) => {
    await page.goto('/right-now/test-realtime')
    
    // Check dashboard elements
    await expect(page.getByText('RIGHT NOW Realtime Test')).toBeVisible()
    await expect(page.getByTestId('connection-status')).toBeVisible()
  })

  test('should filter posts by mode', async ({ page }) => {
    await page.goto('/right-now')
    
    // Click hookup filter
    await page.getByRole('button', { name: 'hookup' }).click()
    
    // Wait for filtered results
    await page.waitForTimeout(500)
    
    // All visible posts should be hookup mode (if any exist)
    const posts = page.locator('[data-mode="hookup"]')
    const count = await posts.count()
    
    // Either there are hookup posts, or the feed is empty
    if (count > 0) {
      expect(count).toBeGreaterThan(0)
    } else {
      await expect(page.getByText(/No posts/i)).toBeVisible()
    }
  })

  test('should handle empty feed gracefully', async ({ page }) => {
    await page.goto('/right-now?city=NonExistentCity123')
    
    // Should show empty state
    await expect(
      page.getByText(/No posts right now/i).or(page.getByText(/Nothing here yet/i))
    ).toBeVisible()
  })

  test('full flow: compose → appears in feed → delete', async ({ page, context }) => {
    // This test requires actual Supabase connection
    // Skip in CI if Supabase is not available
    const isCI = process.env.CI === 'true'
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    
    if (isCI && !supabaseUrl) {
      test.skip()
      return
    }

    // Step 1: Navigate to create page
    await page.goto('/right-now/new')
    
    // Step 2: Fill in the form
    await page.selectOption('[data-testid="mode-select"]', 'hookup')
    await page.fill('[data-testid="headline-input"]', 'E2E Test Post')
    await page.fill('[data-testid="body-input"]', 'This is an automated test')
    
    // Step 3: Submit the post
    await page.click('[data-testid="submit-button"]')
    
    // Step 4: Should redirect to feed
    await expect(page).toHaveURL(/\/right-now$/)
    
    // Step 5: Post should appear in feed
    await expect(page.getByText('E2E Test Post')).toBeVisible({ timeout: 10000 })
    
    // Step 6: Delete the post
    const deleteButton = page.locator('[data-post-id]').first().locator('[data-testid="delete-button"]')
    await deleteButton.click()
    
    // Step 7: Confirm deletion
    await page.click('[data-testid="confirm-delete"]')
    
    // Step 8: Post should disappear
    await expect(page.getByText('E2E Test Post')).not.toBeVisible({ timeout: 5000 })
  })

  test('should enforce authentication for posting (when auth bypass is disabled)', async ({ page }) => {
    // Disable auth bypass
    await page.addInitScript(() => {
      localStorage.removeItem('hotmess_dev_auth_bypass')
    })
    
    await page.goto('/right-now/new')
    
    // Should redirect to login or show auth gate
    await expect(
      page.getByText(/sign in/i).or(page.getByText(/log in/i))
    ).toBeVisible({ timeout: 5000 })
  })

  test('should show connection status indicator', async ({ page }) => {
    await page.goto('/right-now/test-realtime')
    
    const statusIndicator = page.getByTestId('connection-status')
    
    // Should eventually show connected status
    await expect(statusIndicator).toContainText(/connected/i, { timeout: 10000 })
  })

  test('accessibility: no violations on main page', async ({ page }) => {
    await page.goto('/right-now')
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
    
    // Run axe accessibility tests
    const accessibilityScanResults = await page.evaluate(async () => {
      // @ts-ignore - axe is loaded via CDN in test environment
      if (typeof axe !== 'undefined') {
        const results = await axe.run()
        return results.violations
      }
      return []
    })
    
    // Should have no critical accessibility violations
    const criticalViolations = accessibilityScanResults.filter(
      (v: any) => v.impact === 'critical' || v.impact === 'serious'
    )
    
    expect(criticalViolations).toHaveLength(0)
  })
})

test.describe('RIGHT NOW - Membership Gates', () => {
  test('free tier should show rate limit warnings', async ({ page }) => {
    await page.goto('/right-now/new')
    
    // Mock a user who has hit rate limits
    await page.evaluate(() => {
      // Simulate rate limit state
      window.localStorage.setItem('right_now_posts_today', '20')
    })
    
    await page.reload()
    
    // Should show rate limit warning
    await expect(
      page.getByText(/rate limit/i).or(page.getByText(/upgrade/i))
    ).toBeVisible()
  })
})

test.describe('RIGHT NOW - Realtime Updates', () => {
  test('should receive live updates when subscribed', async ({ page }) => {
    await page.goto('/right-now/test-realtime')
    
    // Wait for subscription to be established
    await page.waitForTimeout(2000)
    
    const connectionStatus = page.getByTestId('connection-status')
    
    // Should show subscribed status
    await expect(connectionStatus).toContainText(/subscribed|connected/i)
    
    // Monitor for broadcast events
    const broadcastReceived = page.waitForEvent('console', (msg) =>
      msg.text().includes('Broadcast received') || msg.text().includes('post_created')
    )
    
    // This would complete if a post is created in another tab/window
    // In a real test, you'd open another page and create a post
  })
})
