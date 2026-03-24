import { test, expect } from '@playwright/test';
import { SmartLocator } from '../../../core/SmartLocator';

/**
 * smart-locator.spec.ts
 *
 * ACADEMIC DEMONSTRATION: This test suite exists to PROVE that SmartLocator's
 * fallback mechanism works in a real browser environment.
 *
 * It does NOT test application features — it tests the FRAMEWORK ITSELF.
 * This is a key exhibit for the dissertation.
 */
test.describe('SmartLocator — Fallback Strategy Demonstration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test(
    'PROOF 1: SmartLocator finds login button using data-test strategy only',
    async ({ page }) => {
      /**
       * When the correct selector is the first strategy, SmartLocator
       * uses it immediately and logs: [SmartLocator] Found element using: data-test
       */
      const loginButton = await SmartLocator.findElement(page, [
        { name: 'data-test', selector: '[data-test="login-button"]' },
      ]);
      await expect(loginButton).toBeVisible();
    }
  );

  test(
    'PROOF 2: SmartLocator falls back to a valid strategy when the first one is fake/invalid',
    async ({ page }) => {
      /**
       * Strategy 0 is intentionally WRONG — no element has data-test="this-does-not-exist".
       * SmartLocator will time out on strategy 0, silently move to strategy 1,
       * find the real username field, and log:
       *   [SmartLocator] Found element using: real-data-test
       *
       * This proves resilience: one bad selector does NOT break the test.
       */
      const usernameField = await SmartLocator.findElement(
        page,
        [
          {
            name: 'FAKE-INVALID-SELECTOR',
            selector: '[data-test="this-does-not-exist-anywhere"]',
          },
          {
            name: 'real-data-test',
            selector: '[data-test="username"]',
          },
        ],
        1500 // shorter timeout per strategy so fallback runs quickly
      );

      await expect(usernameField).toBeVisible();
      await usernameField.fill('standard_user');
      // Field should now contain the typed text — proves the returned locator is real and interactive
      await expect(usernameField).toHaveValue('standard_user');
    }
  );
});
