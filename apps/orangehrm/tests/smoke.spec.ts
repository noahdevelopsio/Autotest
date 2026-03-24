import { test, expect } from '@playwright/test';

test('OrangeHRM smoke test — login heading is visible', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');
  const loginHeading = page.locator('.orangehrm-login-title');
  await expect(loginHeading).toBeVisible();
});
