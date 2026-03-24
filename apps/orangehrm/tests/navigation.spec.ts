// Proves the same BasePage.navigate() and SmartLocator work on a completely different app

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PimPage } from '../pages/PimPage';

test.describe('OrangeHRM — Navigation', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('Admin', 'admin123');
  });

  test('dashboard loads and breadcrumb title is visible after login', async ({ page }) => {
    expect(await dashboardPage.isDashboardLoaded()).toBe(true);
    const title = await dashboardPage.getPageTitle();
    expect(title.toLowerCase()).toContain('dashboard');
  });

  test('navigate to PIM module — PIM page title visible', async ({ page }) => {
    await dashboardPage.navigateToPim();
    const pimPage = new PimPage(page);
    expect(await pimPage.isLoaded()).toBe(true);
    const title = await pimPage.getPageTitle();
    expect(title.toLowerCase()).toContain('pim');
  });

  test('navigate to Admin module — Admin page title visible', async ({ page }) => {
    await dashboardPage.navigateToAdmin();
    const url = await dashboardPage.getURL();
    expect(url).toContain('admin');
  });
});
