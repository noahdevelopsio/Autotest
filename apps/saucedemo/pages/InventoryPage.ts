import { BasePage } from '../../../core/BasePage';
import { SmartLocator } from '../../../core/SmartLocator';
import { LocatorStrategy } from '../../../types/index';

/**
 * InventoryPage — SauceDemo product listing page (/inventory.html)
 */
export class InventoryPage extends BasePage {
  // ─── Locator strategy arrays ─────────────────────────────────────────────

  private inventoryContainerStrategies: LocatorStrategy[] = [
    { name: 'data-test', selector: '[data-test="inventory-container"]' },
    { name: 'id', selector: '#inventory_container' },
    { name: 'css', selector: '.inventory_list' },
  ];

  private sortContainerStrategies: LocatorStrategy[] = [
    { name: 'data-test', selector: '[data-test="sort-container"]' },
    { name: 'css', selector: '.product_sort_container' },
    { name: 'aria-label', selector: '[aria-label="Product Sort Container"]' },
  ];

  private cartBadgeStrategies: LocatorStrategy[] = [
    { name: 'css', selector: '.shopping_cart_badge' },
    { name: 'data-test', selector: '[data-test="shopping-cart-badge"]' },
    { name: 'aria-label', selector: '[aria-label="cart badge"]' },
  ];

  private cartIconStrategies: LocatorStrategy[] = [
    { name: 'css', selector: '.shopping_cart_link' },
    { name: 'id', selector: '#shopping_cart_container' },
    { name: 'data-test', selector: '[data-test="shopping-cart-link"]' },
  ];

  private menuButtonStrategies: LocatorStrategy[] = [
    { name: 'id', selector: '#react-burger-menu-btn' },
    { name: 'aria-label', selector: '[aria-label="Open Menu"]' },
    { name: 'css', selector: '.bm-burger-button button' },
  ];

  private logoutLinkStrategies: LocatorStrategy[] = [
    { name: 'id', selector: '#logout_sidebar_link' },
    { name: 'text', selector: 'text=Logout' },
    { name: 'css', selector: 'a[href="/"]' },
  ];

  // ─── Public actions ───────────────────────────────────────────────────────

  async isLoaded(): Promise<boolean> {
    try {
      await SmartLocator.findElement(this.page, this.inventoryContainerStrategies);
      return true;
    } catch {
      return false;
    }
  }

  async getProductNames(): Promise<string[]> {
    await SmartLocator.findElement(this.page, this.inventoryContainerStrategies);
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getProductCount(): Promise<number> {
    await SmartLocator.findElement(this.page, this.inventoryContainerStrategies);
    return this.page.locator('.inventory_item').count();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    const sortMap: Record<string, string> = {
      az: 'az',
      za: 'za',
      lohi: 'lohi',
      hilo: 'hilo',
    };
    const sortSelect = await SmartLocator.findElement(this.page, this.sortContainerStrategies);
    await sortSelect.selectOption(sortMap[option]);
  }

  async addToCartByName(name: string): Promise<void> {
    // Build the data-test attribute value from the product name
    const dataTestId = `add-to-cart-${name.toLowerCase().replace(/\s+/g, '-')}`;
    await this.page.locator(`[data-test="${dataTestId}"]`).click();
  }

  async openProductByName(name: string): Promise<void> {
    await this.page.locator('.inventory_item_name', { hasText: name }).click();
  }

  async getCartBadgeCount(): Promise<string> {
    const badge = await SmartLocator.findElement(this.page, this.cartBadgeStrategies);
    return (await badge.textContent()) ?? '0';
  }

  async goToCart(): Promise<void> {
    const cartIcon = await SmartLocator.findElement(this.page, this.cartIconStrategies);
    await cartIcon.click();
  }

  async openMenu(): Promise<void> {
    const menuBtn = await SmartLocator.findElement(this.page, this.menuButtonStrategies);
    await menuBtn.click();
    await this.page.waitForSelector('#logout_sidebar_link', { state: 'visible' });
  }

  async logout(): Promise<void> {
    await this.openMenu();
    const logoutLink = await SmartLocator.findElement(this.page, this.logoutLinkStrategies);
    await logoutLink.click();
  }
}
