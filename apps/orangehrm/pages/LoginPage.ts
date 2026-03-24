import { BasePage } from '../../../core/BasePage';
import { SmartLocator } from '../../../core/SmartLocator';
import { LocatorStrategy } from '../../../types/index';

/**
 * OrangeHRM LoginPage — https://opensource-demo.orangehrmlive.com
 * Uses the SAME BasePage and SmartLocator as SauceDemo.
 * Only the selectors differ — the core is identical.
 */
export class LoginPage extends BasePage {
  // ─── Locator strategy arrays ─────────────────────────────────────────────

  private usernameStrategies: LocatorStrategy[] = [
    { name: 'name-attr', selector: 'input[name="username"]' },
    { name: 'placeholder', selector: 'input[placeholder="Username"]' },
    { name: 'css', selector: '.oxd-input:first-of-type' },
  ];

  private passwordStrategies: LocatorStrategy[] = [
    { name: 'name-attr', selector: 'input[name="password"]' },
    { name: 'type', selector: 'input[type="password"]' },
    { name: 'placeholder', selector: 'input[placeholder="Password"]' },
  ];

  private submitButtonStrategies: LocatorStrategy[] = [
    { name: 'type', selector: 'button[type="submit"]' },
    { name: 'text', selector: 'text=Login' },
    { name: 'css', selector: '.oxd-button--main' },
  ];

  private errorStrategies: LocatorStrategy[] = [
    { name: 'css', selector: '.oxd-alert-content-text' },
    { name: 'css', selector: '.oxd-input-field-error-message' },
    { name: 'css', selector: '[class*="alert"]' },
  ];

  private loginTitleStrategies: LocatorStrategy[] = [
    { name: 'css', selector: '.orangehrm-login-title' },
    { name: 'text', selector: 'text=Login' },
    { name: 'css', selector: 'h5' },
  ];

  // ─── Public actions ───────────────────────────────────────────────────────

  async navigate(): Promise<void> {
    await super.navigate('/web/index.php/auth/login');
    await this.waitForPageLoad();
  }

  async login(username: string, password: string): Promise<void> {
    const usernameField = await SmartLocator.findElement(this.page, this.usernameStrategies);
    await usernameField.fill(username);

    const passwordField = await SmartLocator.findElement(this.page, this.passwordStrategies);
    await passwordField.fill(password);

    const submitBtn = await SmartLocator.findElement(this.page, this.submitButtonStrategies);
    await submitBtn.click();
  }

  async getErrorMessage(): Promise<string> {
    const errorEl = await SmartLocator.findElement(this.page, this.errorStrategies);
    return (await errorEl.textContent()) ?? '';
  }

  async isLoginPageVisible(): Promise<boolean> {
    try {
      await SmartLocator.findElement(this.page, this.loginTitleStrategies);
      return true;
    } catch {
      return false;
    }
  }
}
