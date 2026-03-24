import { BasePage } from '../../../core/BasePage';
import { SmartLocator } from '../../../core/SmartLocator';
import { LocatorStrategy } from '../../../types/index';

/**
 * ProductDetailPage — SauceDemo individual product detail page (/inventory-item.html)
 */
export class ProductDetailPage extends BasePage {
  // ─── Locator strategy arrays ─────────────────────────────────────────────

  private productNameStrategies: LocatorStrategy[] = [
    { name: 'css', selector: '.inventory_details_name' },
    { name: 'data-test', selector: '[data-test="inventory-item-name"]' },
    { name: 'css', selector: '.large_size' },
  ];

  private productPriceStrategies: LocatorStrategy[] = [
    { name: 'css', selector: '.inventory_details_price' },
    { name: 'data-test', selector: '[data-test="inventory-item-price"]' },
    { name: 'css', selector: '.price_container .inventory_item_price' },
  ];

  private productDescStrategies: LocatorStrategy[] = [
    { name: 'css', selector: '.inventory_details_desc' },
    { name: 'data-test', selector: '[data-test="inventory-item-desc"]' },
    { name: 'css', selector: '.inventory_item_desc' },
  ];

  private addToCartStrategies: LocatorStrategy[] = [
    { name: 'css', selector: '.btn_primary.btn_inventory' },
    { name: 'text', selector: 'text=Add to cart' },
    { name: 'data-test', selector: '[data-test^="add-to-cart"]' },
  ];

  private backButtonStrategies: LocatorStrategy[] = [
    { name: 'id', selector: '#back-to-products' },
    { name: 'data-test', selector: '[data-test="back-to-products"]' },
    { name: 'text', selector: 'text=Back to products' },
  ];

  // ─── Public actions ───────────────────────────────────────────────────────

  async getProductName(): Promise<string> {
    const el = await SmartLocator.findElement(this.page, this.productNameStrategies);
    return (await el.textContent()) ?? '';
  }

  async getProductPrice(): Promise<string> {
    const el = await SmartLocator.findElement(this.page, this.productPriceStrategies);
    return (await el.textContent()) ?? '';
  }

  async getProductDescription(): Promise<string> {
    const el = await SmartLocator.findElement(this.page, this.productDescStrategies);
    return (await el.textContent()) ?? '';
  }

  async addToCart(): Promise<void> {
    const btn = await SmartLocator.findElement(this.page, this.addToCartStrategies);
    await btn.click();
  }

  async goBack(): Promise<void> {
    const backBtn = await SmartLocator.findElement(this.page, this.backButtonStrategies);
    await backBtn.click();
  }
}
