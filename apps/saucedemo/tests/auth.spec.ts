import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { TestDataLoader } from '../../../core/TestDataLoader';
import { LoginUser } from '../../../types/index';

const users = TestDataLoader.load<LoginUser>('apps/saucedemo/test-data/users.json');

test.describe('SauceDemo — Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  // Data-driven login tests — loops over all 5 user scenarios in users.json
  for (const user of users) {
    test(`[${user.scenario}] login with username="${user.username}"`, async ({ page }) => {
      await loginPage.login(user.username, user.password);

      if (user.expectSuccess) {
        const inventoryPage = new InventoryPage(page);
        expect(await inventoryPage.isLoaded()).toBe(true);
      } else {
        expect(await loginPage.isErrorVisible()).toBe(true);
        const errorText = await loginPage.getErrorMessage();
        expect(errorText.toLowerCase()).toContain(user.expectedError!.toLowerCase());
      }
    });
  }

  test('successful logout clears session', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');

    const inventoryPage = new InventoryPage(page);
    expect(await inventoryPage.isLoaded()).toBe(true);

    await inventoryPage.logout();

    // After logout, we should be back on the login page
    await expect(page).toHaveURL('/');
    expect(await loginPage.isErrorVisible()).toBe(false);
  });
});
