// Same framework core as SauceDemo — only page objects and test data differ

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TestDataLoader } from '../../../core/TestDataLoader';
import { LoginUser } from '../../../types/index';

const users = TestDataLoader.load<LoginUser>('apps/orangehrm/test-data/users.json');

test.describe('OrangeHRM — Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  // Data-driven login tests — same TestDataLoader + loop pattern as SauceDemo
  for (const user of users) {
    test(`[${user.scenario}] login with username="${user.username}"`, async ({ page }) => {
      await loginPage.login(user.username, user.password);

      if (user.expectSuccess) {
        const dashboardPage = new DashboardPage(page);
        expect(await dashboardPage.isDashboardLoaded()).toBe(true);
      } else {
        // For failed logins, we expect to remain on the login page
        // or see an error — either way the dashboard should NOT load
        const dashboardPage = new DashboardPage(page);
        expect(await dashboardPage.isDashboardLoaded()).toBe(false);
      }
    });
  }
});
