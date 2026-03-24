import { BasePage } from '../../../core/BasePage';
import { SmartLocator } from '../../../core/SmartLocator';
import { LocatorStrategy } from '../../../types/index';

/**
 * CartPage — SauceDemo shopping cart page (/cart.html)
 */
export class CartPage extends BasePage {
  // ─── Locator strategy arrays ─────────────────────────────────────────────

  private cartListStrategies: LocatorStrategy[] = [
    { name: 'data-test', selector: '[data-test="cart-list"]' },
    { name: 'id', selector: '#cart_contents_container' },
    { name: 'css', selector: '.cart_list' },
  ];

  private checkoutButtonStrategies: LocatorStrategy[] = [
    { name: 'data-test', selector: '[data-test="checkout"]' },
    { name: 'id', selector: '#checkout' },
    { name: 'css', selector: '.checkout_button' },
  ];

  private continueShoppingStrategies: LocatorStrategy[] = [
    { name: 'data-test', selector: '[data-test="continue-shopping"]' },
    { name: 'id', selector: '#continue-shopping' },
    { name: 'css', selector: '.cart_cancel_link' },
  ];

  // ─── Public actions ───────────────────────────────────────────────────────

  async getCartItems(): Promise<{ name: string; price: string }[]> {
    await SmartLocator.findElement(this.page, this.cartListStrategies);
    const items = this.page.locator('.cart_item');
    const count = await items.count();
    const results: { name: string; price: string }[] = [];

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const name = (await item.locator('.inventory_item_name').textContent()) ?? '';
      const price = (await item.locator('.inventory_item_price').textContent()) ?? '';
      results.push({ name, price });
    }

    return results;
  }

  async removeItemByName(name: string): Promise<void> {
    const dataTestId = `remove-${name.toLowerCase().replace(/\s+/g, '-')}`;
    await this.page.locator(`[data-test="${dataTestId}"]`).click();
  }

  async getItemCount(): Promise<number> {
    await SmartLocator.findElement(this.page, this.cartListStrategies);
    return this.page.locator('.cart_item').count();
  }

  async proceedToCheckout(): Promise<void> {
    const checkoutBtn = await SmartLocator.findElement(this.page, this.checkoutButtonStrategies);
    await checkoutBtn.click();
  }

  async continueShopping(): Promise<void> {
    const continueBtn = await SmartLocator.findElement(this.page, this.continueShoppingStrategies);
    await continueBtn.click();
  }
}
