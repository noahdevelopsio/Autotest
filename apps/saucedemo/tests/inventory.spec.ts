import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { TestDataLoader } from '../../../core/TestDataLoader';

// Load product data — the products.json has a different shape (not a root array)
// so we read both sections directly
interface ProductsData {
  products: { scenario: string; productName: string; expectedPrice: string }[];
  sortScenarios: { scenario: string; sortOption: string; expectedFirstProduct: string }[];
}

// Read via fs directly since products.json has a root object (not array)
import * as fs from 'fs';
import * as path from 'path';
const productsData: ProductsData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'apps/saucedemo/test-data/products.json'), 'utf-8')
);

test.describe('SauceDemo — Inventory', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    expect(await inventoryPage.isLoaded()).toBe(true);
  });

  test('product count is exactly 6', async () => {
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  // Data-driven sort tests — loops over sort scenarios from products.json
  for (const scenario of productsData.sortScenarios) {
    test(`[${scenario.scenario}] first product after sort is "${scenario.expectedFirstProduct}"`, async () => {
      await inventoryPage.sortBy(scenario.sortOption as 'az' | 'za' | 'lohi' | 'hilo');
      const names = await inventoryPage.getProductNames();
      expect(names[0]).toBe(scenario.expectedFirstProduct);
    });
  }
});
