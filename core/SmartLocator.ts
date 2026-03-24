import { Page, Locator } from '@playwright/test';
import { LocatorStrategy } from '../types/index';

/**
 * SmartLocator — Core innovation of this framework.
 *
 * Instead of binding to a single selector, SmartLocator tries multiple
 * strategies in priority order. If the first selector fails (e.g. a
 * developer removed a data-test attribute), it silently falls back to
 * the next strategy. This is what makes the framework RESILIENT to DOM changes.
 *
 * Priority order (most stable → least stable):
 *   1. data-test  — set by devs specifically for testing
 *   2. id         — stable if maintained
 *   3. aria-label — accessibility attribute
 *   4. text       — visible text content
 *   5. css        — fragile class, last resort
 */
export class SmartLocator {
  /**
   * Try each strategy in order. Return the first visible, attached Locator found.
   * Logs which strategy succeeded so you can trace it in the test output.
   *
   * @param page         - Playwright Page object
   * @param strategies   - Ordered array of LocatorStrategy to try
   * @param timeoutMs    - Per-strategy timeout (default 2000ms)
   * @throws Error listing every strategy name that was tried if all fail
   */
  static async findElement(
    page: Page,
    strategies: LocatorStrategy[],
    timeoutMs = 5000
  ): Promise<Locator> {
    for (const strategy of strategies) {
      try {
        const locator = page.locator(strategy.selector);
        await locator.waitFor({ state: 'visible', timeout: timeoutMs });
        console.log(`[SmartLocator] Found element using: ${strategy.name}`);
        return locator;
      } catch {
        // Strategy failed — silently try the next one
      }
    }

    const tried = strategies.map((s) => `"${s.name}"`).join(', ');
    throw new Error(
      `[SmartLocator] Element not found. Tried strategies: ${tried}`
    );
  }

  /**
   * Factory helper — builds a LocatorStrategy array from named options.
   * Pass only the selectors you know. Undefined values are skipped.
   * Returns strategies in the standard priority order.
   *
   * @example
   * const strategies = SmartLocator.buildStrategies({
   *   dataTest: 'login-button',
   *   id: 'login-btn',
   *   text: 'Sign In',
   * });
   */
  static buildStrategies(options: {
    dataTest?: string;
    id?: string;
    ariaLabel?: string;
    text?: string;
    css?: string;
  }): LocatorStrategy[] {
    const strategies: LocatorStrategy[] = [];

    if (options.dataTest) {
      strategies.push({ name: 'data-test', selector: `[data-test="${options.dataTest}"]` });
    }
    if (options.id) {
      strategies.push({ name: 'id', selector: `#${options.id}` });
    }
    if (options.ariaLabel) {
      strategies.push({ name: 'aria-label', selector: `[aria-label="${options.ariaLabel}"]` });
    }
    if (options.text) {
      strategies.push({ name: 'text', selector: `text=${options.text}` });
    }
    if (options.css) {
      strategies.push({ name: 'css', selector: options.css });
    }

    return strategies;
  }
}
