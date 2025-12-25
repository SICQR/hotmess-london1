import { test, expect } from '@playwright/test';

test.describe('HOTMESS smoke', () => {
  test.beforeEach(async ({ page }) => {
    // Bypass splash + age gate for smoke tests.
    await page.addInitScript(() => {
      localStorage.setItem('hotmess_age_verified', 'true');
    });
  });

  test('auth routes render', async ({ page }) => {
    await page.goto('/?route=login');
    await expect(page.getByText(/welcome back/i)).toBeVisible();

    await page.goto('/?route=register');
    await expect(page.getByText(/join hotmess/i)).toBeVisible();

    await page.goto('/?route=passwordReset');
    await expect(page.getByText(/reset/i)).toBeVisible();

    // Set-new-password page may show an expired-link message without a real token; either is acceptable.
    await page.goto('/?route=setNewPassword');
    await expect(
      page.getByText(/set new password|link expired|invalid or expired reset link/i)
    ).toBeVisible();
  });

  test('privacy hub routes render', async ({ page }) => {
    await page.goto('/?route=dataPrivacy');
    await expect(page.getByText(/privacy|data/i)).toBeVisible();

    await page.goto('/?route=dataPrivacyDsar');
    await expect(page.getByText(/data subject access|dsar|request/i)).toBeVisible();

    await page.goto('/?route=dataPrivacyExport');
    await expect(page.getByText(/export|download/i)).toBeVisible();

    await page.goto('/?route=dataPrivacyDelete');
    await expect(page.getByText(/delete|erasure/i)).toBeVisible();
  });
});
