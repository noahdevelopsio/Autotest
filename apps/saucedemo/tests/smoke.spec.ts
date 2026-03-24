import { test, expect } from '@playwright/test';

test('SauceDemo smoke test — title contains Swag Labs', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Swag Labs/);
});
