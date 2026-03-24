import { BasePage } from '../../../core/BasePage';
import { SmartLocator } from '../../../core/SmartLocator';
import { LocatorStrategy } from '../../../types/index';

/**
 * LoginPage — SauceDemo login page (https://www.saucedemo.com)
 * Extends BasePage for shared navigate/wait behaviour.
 * Uses SmartLocator for resilient element selection.
 */
export class LoginPage extends BasePage {
  // ─── Locator strategy arrays ─────────────────────────────────────────────

  private usernameStrategies: LocatorStrategy[] = [
    { name: 'data-test', selector: '[data-test="username"]' },
    { name: 'id', selector: '#user-name' },
    { name: 'css', selector: 'input[placeholder="Username"]' },
  ];

  private passwordStrategies: LocatorStrategy[] = [
    { name: 'data-test', selector: '[data-test="password"]' },
    { name: 'id', selector: '#password' },
    { name: 'css', selector: 'input[type="password"]' },
  ];

  private loginButtonStrategies: LocatorStrategy[] = [
    { name: 'data-test', selector: '[data-test="login-button"]' },
    { name: 'id', selector: '#login-button' },
    { name: 'css', selector: 'input[type="submit"]' },
  ];

  private errorStrategies: LocatorStrategy[] = [
    { name: 'data-test', selector: '[data-test="error"]' },
    { name: 'css', selector: '.error-message-container h3' },
    { name: 'aria-label', selector: '[aria-label="Error message"]' },
  ];

  // ─── Public actions ───────────────────────────────────────────────────────

  async navigate(): Promise<void> {
    await super.navigate('/');
    await this.waitForPageLoad();
  }

  async login(username: string, password: string): Promise<void> {
    const usernameField = await SmartLocator.findElement(this.page, this.usernameStrategies);
    await usernameField.fill(username);

    const passwordField = await SmartLocator.findElement(this.page, this.passwordStrategies);
    await passwordField.fill(password);

    const loginButton = await SmartLocator.findElement(this.page, this.loginButtonStrategies);
    await loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    const errorEl = await SmartLocator.findElement(this.page, this.errorStrategies);
    return (await errorEl.textContent()) ?? '';
  }

  async isErrorVisible(): Promise<boolean> {
    try {
      await SmartLocator.findElement(this.page, this.errorStrategies);
      return true;
    } catch {
      return false;
    }
  }
}
