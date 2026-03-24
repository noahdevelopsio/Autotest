import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe('SauceDemo — Shopping Cart', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    expect(await inventoryPage.isLoaded()).toBe(true);
  });

  test('adding one product shows badge count of 1', async () => {
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    const badge = await inventoryPage.getCartBadgeCount();
    expect(badge).toBe('1');
  });

  test('adding two products — both appear in cart', async () => {
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    await inventoryPage.addToCartByName('sauce-labs-bike-light');
    await inventoryPage.goToCart();

    const items = await cartPage.getCartItems();
    expect(items.length).toBe(2);

    const names = items.map((i) => i.name);
    expect(names).toContain('Sauce Labs Backpack');
    expect(names).toContain('Sauce Labs Bike Light');
  });

  test('removing an item leaves cart empty', async () => {
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    await inventoryPage.goToCart();

    const beforeCount = await cartPage.getItemCount();
    expect(beforeCount).toBe(1);

    await cartPage.removeItemByName('sauce-labs-backpack');

    const afterCount = await cartPage.getItemCount();
    expect(afterCount).toBe(0);
  });
});
