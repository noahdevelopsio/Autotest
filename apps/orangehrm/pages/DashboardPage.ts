import { BasePage } from '../../../core/BasePage';
import { SmartLocator } from '../../../core/SmartLocator';
import { LocatorStrategy } from '../../../types/index';

/**
 * OrangeHRM DashboardPage — the main page after successful login
 */
export class DashboardPage extends BasePage {
  // ─── Locator strategy arrays ─────────────────────────────────────────────

  private dashboardHeaderStrategies: LocatorStrategy[] = [
    { name: 'css', selector: '.oxd-topbar-header-breadcrumb' },
    { name: 'text', selector: 'text=Dashboard' },
    { name: 'css', selector: '.oxd-layout-context' },
  ];

  private pimNavStrategies: LocatorStrategy[] = [
    { name: 'text', selector: 'text=PIM' },
    { name: 'css', selector: 'a[href="/web/index.php/pim/viewPimModule"]' },
    { name: 'css', selector: '.oxd-main-menu-item:nth-child(3)' },
  ];

  private adminNavStrategies: LocatorStrategy[] = [
    { name: 'text', selector: 'text=Admin' },
    { name: 'css', selector: 'a[href="/web/index.php/admin/viewAdminModule"]' },
    { name: 'css', selector: '.oxd-main-menu-item:first-child' },
  ];

  // ─── Public actions ───────────────────────────────────────────────────────

  async isDashboardLoaded(): Promise<boolean> {
    try {
      await SmartLocator.findElement(this.page, this.dashboardHeaderStrategies, 5000);
      return true;
    } catch {
      return false;
    }
  }

  async getPageTitle(): Promise<string> {
    const header = await SmartLocator.findElement(this.page, this.dashboardHeaderStrategies);
    return (await header.textContent()) ?? '';
  }

  async navigateToPim(): Promise<void> {
    const pimLink = await SmartLocator.findElement(this.page, this.pimNavStrategies);
    await pimLink.click();
    await this.waitForPageLoad();
  }

  async navigateToAdmin(): Promise<void> {
    const adminLink = await SmartLocator.findElement(this.page, this.adminNavStrategies);
    await adminLink.click();
    await this.waitForPageLoad();
  }
}
