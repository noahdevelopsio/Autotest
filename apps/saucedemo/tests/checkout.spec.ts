import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('SauceDemo — Checkout Flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Pre-condition: login, add Sauce Labs Backpack, go to cart
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    await inventoryPage.goToCart();
  });

  test('complete full checkout flow — order confirmation shown', async () => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillPersonalInfo('Enemali', 'Noah', '100001');
    await checkoutPage.continueToOverview();

    const total = await checkoutPage.getOrderTotal();
    expect(total).toContain('$');

    await checkoutPage.finishOrder();
    expect(await checkoutPage.isOrderComplete()).toBe(true);
  });

  test('checkout with empty first name shows validation error', async () => {
    await cartPage.proceedToCheckout();
    // Submit without filling first name
    await checkoutPage.fillPersonalInfo('', 'Noah', '100001');
    await checkoutPage.continueToOverview();

    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('First Name is required');
  });
});
