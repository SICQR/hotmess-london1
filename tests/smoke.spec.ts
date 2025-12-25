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
    await expect(page.getByRole('heading', { level: 1, name: /welcome back/i })).toBeVisible();

    await page.goto('/?route=register');
    await expect(page.getByRole('heading', { level: 1, name: /join hotmess/i })).toBeVisible();

    await page.goto('/?route=passwordReset');
    await expect(page.getByRole('heading', { level: 1, name: /reset password/i })).toBeVisible();

    // Set-new-password page may show an expired-link message without a real token; either is acceptable.
    await page.goto('/?route=setNewPassword');
    await expect(
      page.getByRole('heading', { level: 1, name: /set new password|link expired/i })
    ).toBeVisible();
  });

  test('privacy hub routes render', async ({ page }) => {
    await page.goto('/?route=dataPrivacy');
    await expect(page.getByRole('heading', { level: 1, name: /data\s*&\s*privacy hub/i })).toBeVisible();

    await page.goto('/?route=dataPrivacyDsar');
    await expect(page.getByRole('heading', { level: 1, name: /data subject access request/i })).toBeVisible();

    await page.goto('/?route=dataPrivacyExport');
    await expect(page.getByRole('heading', { level: 1, name: /export my data/i })).toBeVisible();

    await page.goto('/?route=dataPrivacyDelete');
    await expect(page.getByRole('heading', { level: 1, name: /delete my data/i })).toBeVisible();
  });
});
