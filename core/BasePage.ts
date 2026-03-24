import { Page } from '@playwright/test';

/**
 * BasePage — Abstract base class for all page objects across all apps.
 *
 * Academic value: Classic OOP inheritance applied to test engineering.
 * Every page object in /apps/saucedemo/ and /apps/orangehrm/ extends this class,
 * meaning shared behaviour is defined once and never duplicated.
 */
export abstract class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a path. When called from an app page object,
   * Playwright prepends the project's baseURL automatically.
   */
  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Wait for the page DOM to finish loading.
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Return the current page title string.
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Return the current page URL string.
   */
  async getURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Take a screenshot and save it to the screenshots/ folder.
   * Useful for manual debugging; Playwright also captures on failure automatically.
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}
