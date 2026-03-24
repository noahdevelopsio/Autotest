/**
 * Shared TypeScript interfaces used across all apps in the framework.
 * This file is app-agnostic — it must never contain app-specific code.
 */

/**
 * A single selector strategy for SmartLocator.
 * 'name' is used for logging; 'selector' is the Playwright selector string.
 */
export interface LocatorStrategy {
  name: string;
  selector: string;
}

/**
 * Represents one row in a login test-data JSON file.
 * Used by both SauceDemo and OrangeHRM auth tests.
 */
export interface LoginUser {
  scenario: string;
  username: string;
  password: string;
  expectSuccess: boolean;
  expectedError?: string;
}

/**
 * Represents one product scenario in a product test-data JSON file.
 * Used by SauceDemo inventory and checkout tests.
 */
export interface ProductItem {
  scenario: string;
  productName: string;
  expectedPrice: string;
}

/**
 * Represents one sort scenario in a sort test-data JSON file.
 * Used by SauceDemo inventory tests.
 */
export interface SortScenario {
  scenario: string;
  sortOption: string;
  expectedFirstProduct: string;
}
