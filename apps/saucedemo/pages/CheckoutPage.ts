import { BasePage } from '../../../core/BasePage';
import { SmartLocator } from '../../../core/SmartLocator';
import { LocatorStrategy } from '../../../types/index';

/**
 * CheckoutPage — SauceDemo checkout flow (3 sub-pages: step-one, step-two, complete)
 * All steps handled in one page object since they share the same test context.
 */
export class CheckoutPage extends BasePage {
  // ─── Locator strategy arrays ─────────────────────────────────────────────

  private firstNameStrategies: LocatorStrategy[] = [
    { name: 'data-test', selector: '[data-test="firstName"]' },
    { name: 'id', selector: '#first-name' },
    { name: 'css', selector: 'input[placeholder="First Name"]' },
  ];

  private lastNameStrategies: LocatorStrategy[] = [
    { name: 'data-test', selector: '[data-test="lastName"]' },
    { name: 'id', selector: '#last-name' },
    { name: 'css', selector: 'input[placeholder="Last Name"]' },
  ];

  private zipStrategies: LocatorStrategy[] = [
    { name: 'data-test', selector: '[data-test="postalCode"]' },
    { name: 'id', selector: '#postal-code' },
    { name: 'css', selector: 'input[placeholder="Zip/Postal Code"]' },
  ];

  private continueButtonStrategies: LocatorStrategy[] = [
    { name: 'data-test', selector: '[data-test="continue"]' },
    { name: 'id', selector: '#continue' },
    { name: 'css', selector: '.cart_button' },
  ];

  private finishButtonStrategies: LocatorStrategy[] = [
    { name: 'data-test', selector: '[data-test="finish"]' },
    { name: 'id', selector: '#finish' },
    { name: 'text', selector: 'text=Finish' },
  ];

  private orderCompleteStrategies: LocatorStrategy[] = [
    { name: 'css', selector: '.complete-header' },
    { name: 'data-test', selector: '[data-test="complete-header"]' },
    { name: 'text', selector: 'text=Thank you for your order' },
  ];

  private totalStrategies: LocatorStrategy[] = [
    { name: 'css', selector: '.summary_total_label' },
    { name: 'data-test', selector: '[data-test="total-label"]' },
    { name: 'css', selector: '[class*="total"]' },
  ];

  private errorStrategies: LocatorStrategy[] = [
    { name: 'data-test', selector: '[data-test="error"]' },
    { name: 'css', selector: '.error-message-container h3' },
    { name: 'css', selector: '[class*="error"]' },
  ];

  // ─── Public actions ───────────────────────────────────────────────────────

  async fillPersonalInfo(firstName: string, lastName: string, zip: string): Promise<void> {
    const firstNameField = await SmartLocator.findElement(this.page, this.firstNameStrategies);
    await firstNameField.fill(firstName);

    const lastNameField = await SmartLocator.findElement(this.page, this.lastNameStrategies);
    await lastNameField.fill(lastName);

    const zipField = await SmartLocator.findElement(this.page, this.zipStrategies);
    await zipField.fill(zip);
  }

  async continueToOverview(): Promise<void> {
    const continueBtn = await SmartLocator.findElement(this.page, this.continueButtonStrategies);
    await continueBtn.click();
  }

  async getOrderTotal(): Promise<string> {
    const totalEl = await SmartLocator.findElement(this.page, this.totalStrategies);
    return (await totalEl.textContent()) ?? '';
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async finishOrder(): Promise<void> {
    const finishBtn = await SmartLocator.findElement(this.page, this.finishButtonStrategies);
    await finishBtn.click();
  }

  async isOrderComplete(): Promise<boolean> {
    try {
      await SmartLocator.findElement(this.page, this.orderCompleteStrategies);
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<string> {
    const errorEl = await SmartLocator.findElement(this.page, this.errorStrategies);
    return (await errorEl.textContent()) ?? '';
  }
}
