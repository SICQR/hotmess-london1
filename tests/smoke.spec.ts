import { test, expect } from '@playwright/test';

test.describe('HOTMESS smoke', () => {
  test('auth routes render', async ({ page }) => {
    await page.goto('/?route=login');
    await expect(page.getByText(/welcome back/i)).toBeVisible();

    await page.goto('/?route=register');
    await expect(page.getByText(/join hotmess/i)).toBeVisible();

    await page.goto('/?route=passwordReset');
    await expect(page.getByRole('heading', { name: /reset/i })).toBeVisible();

    // Set-new-password page may show an expired-link message without a real token; either is acceptable.
    await page.goto('/?route=setNewPassword');
    await expect(
      page.getByText(/set new password|link expired|invalid or expired reset link/i)
    ).toBeVisible();
  });

  test('privacy hub routes render', async ({ page }) => {
    await page.goto('/?route=dataPrivacy');
    await expect(page.getByRole('heading', { name: /data.*privacy hub/i })).toBeVisible();

    await page.goto('/?route=dataPrivacyDsar');
    await expect(page.getByText(/data subject access|dsar|request/i)).toBeVisible();

    await page.goto('/?route=dataPrivacyExport');
    await expect(page.getByText(/export|download/i)).toBeVisible();

    await page.goto('/?route=dataPrivacyDelete');
    await expect(page.getByText(/delete|erasure/i)).toBeVisible();
  });
});
