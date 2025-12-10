/**
 * E2E tests for Beacon scanning and QR flows
 */
import { test, expect } from '@playwright/test'

test.describe('Beacon Scanning', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('hotmess_age_verified', 'true')
      localStorage.setItem('hotmess_dev_auth_bypass', 'true')
    })
  })

  test('should navigate to beacons page', async ({ page }) => {
    await page.goto('/beacons')
    
    // Should show beacons page
    await expect(page.getByText(/beacons|scan/i)).toBeVisible()
  })

  test('should navigate to scan page with code in URL', async ({ page }) => {
    // Simulate scanning a QR code with beacon code
    await page.goto('/l/GLO-001')
    
    // Should process the beacon code
    await expect(page).toHaveURL(/\/l\/GLO-001/)
    
    // Should show beacon details or scan result
    // (Implementation depends on your beacon system)
  })

  test('should show beacon create form', async ({ page }) => {
    await page.goto('/beacons/create')
    
    // Should show create form
    await expect(page.getByText(/create beacon/i)).toBeVisible()
    
    // Should have required fields
    await expect(page.locator('input[name="title"]').or(page.locator('[data-testid="beacon-title"]'))).toBeVisible()
  })

  test('should handle invalid beacon code gracefully', async ({ page }) => {
    await page.goto('/l/INVALID-CODE-123')
    
    // Should show error or not found message
    await expect(
      page.getByText(/not found|invalid|doesn't exist/i)
    ).toBeVisible({ timeout: 5000 })
  })

  test('beacon scan demo flow', async ({ page }) => {
    await page.goto('/beacons/demo')
    
    // Should show demo page
    await expect(page.getByText(/demo|try it/i)).toBeVisible()
    
    // Click a demo beacon
    await page.click('button:has-text("Scan Demo"):first')
    
    // Should show scan result
    await expect(page.getByText(/scanned|success/i)).toBeVisible()
  })
})

test.describe('Beacon Management', () => {
  test('should list user beacons', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('hotmess_dev_auth_bypass', 'true')
    })

    await page.goto('/beacons')
    
    // Should show user's beacons or empty state
    const hasBeacons = await page.locator('[data-beacon-id]').count()
    
    if (hasBeacons === 0) {
      await expect(page.getByText(/no beacons|create your first/i)).toBeVisible()
    } else {
      expect(hasBeacons).toBeGreaterThan(0)
    }
  })
})
