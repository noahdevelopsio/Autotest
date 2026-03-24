import { BasePage } from '../../../core/BasePage';
import { SmartLocator } from '../../../core/SmartLocator';
import { LocatorStrategy } from '../../../types/index';

/**
 * OrangeHRM PimPage — Employee Information module (/pim/viewPimModule)
 */
export class PimPage extends BasePage {
  // ─── Locator strategy arrays ─────────────────────────────────────────────

  private pimHeaderStrategies: LocatorStrategy[] = [
    { name: 'css', selector: '.oxd-topbar-header-breadcrumb' },
    { name: 'text', selector: 'text=PIM' },
    { name: 'css', selector: 'h6.oxd-text' },
  ];

  private searchInputStrategies: LocatorStrategy[] = [
    { name: 'placeholder', selector: 'input[placeholder="Type for hints..."]' },
    { name: 'css', selector: '.oxd-input.oxd-input--active' },
    { name: 'css', selector: '[class*="autocomplete"] input' },
  ];

  private searchButtonStrategies: LocatorStrategy[] = [
    { name: 'text', selector: 'text=Search' },
    { name: 'css', selector: 'button[type="submit"]' },
    { name: 'css', selector: '.oxd-button--secondary' },
  ];

  // ─── Public actions ───────────────────────────────────────────────────────

  async isLoaded(): Promise<boolean> {
    try {
      await SmartLocator.findElement(this.page, this.pimHeaderStrategies, 5000);
      return true;
    } catch {
      return false;
    }
  }

  async getPageTitle(): Promise<string> {
    const header = await SmartLocator.findElement(this.page, this.pimHeaderStrategies);
    return (await header.textContent()) ?? '';
  }

  async searchEmployee(name: string): Promise<void> {
    const searchInput = await SmartLocator.findElement(this.page, this.searchInputStrategies);
    await searchInput.fill(name);

    const searchBtn = await SmartLocator.findElement(this.page, this.searchButtonStrategies);
    await searchBtn.click();
    await this.waitForPageLoad();
  }
}
