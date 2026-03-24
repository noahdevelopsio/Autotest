# AI IDE Master Prompt
## Project: Resilient, Data-Driven UI Test Automation Framework
**Version:** 2.0 — Multi-App Edition

> **HOW TO USE THIS FILE:**  
> Paste each numbered prompt into your AI IDE (Cursor, Windsurf, GitHub Copilot Chat) ONE AT A TIME.  
> Build and verify each phase before moving to the next.  
> Never send all phases at once.

---

## ⚙️ PHASE 1 — Project Setup & Scaffold

```
Create a new Playwright + TypeScript test automation project called "ui-test-framework".

This framework will test TWO different web applications using the same core:
- App 1: SauceDemo at https://www.saucedemo.com
- App 2: OrangeHRM Demo at https://opensource-demo.orangehrmlive.com

Requirements:
- TypeScript with strict: true
- Playwright as the test runner
- Multi-project Playwright config — one project per app, each with its own baseURL and testDir
- Screenshot on failure, video on failure, trace on first retry
- Retries set to 1
- HTML reporter + list reporter
- Chromium and Firefox browser projects for SauceDemo; Chromium only for OrangeHRM

Create ALL of these files with full content:

1. package.json — with scripts: test, test:saucedemo, test:orangehrm, test:headed, test:report, test:ui
2. tsconfig.json — strict: true, target: ES2020, module: commonjs, paths configured
3. playwright.config.ts — full multi-project configuration as described
4. .gitignore — excludes node_modules/, playwright-report/, test-results/, .env

Also create the complete empty folder structure:
- core/
- types/
- apps/saucedemo/pages/
- apps/saucedemo/tests/
- apps/saucedemo/test-data/
- apps/orangehrm/pages/
- apps/orangehrm/tests/
- apps/orangehrm/test-data/

Finally create two smoke tests:
- apps/saucedemo/tests/smoke.spec.ts — navigate to base URL, assert title contains "Swag Labs"
- apps/orangehrm/tests/smoke.spec.ts — navigate to base URL, assert login heading is visible

Show all file contents. Do not create any other files yet.
```

---

## 🏗️ PHASE 2 — Framework Core (Shared Utilities)

```
I am building a multi-app Playwright TypeScript test framework. Now build the shared core layer.
These files must contain ZERO app-specific code — they must work for any web application.

=== core/BasePage.ts ===
Abstract base class that all page objects (for all apps) will extend.
- Constructor: accepts Playwright Page object, stores as protected this.page
- Methods:
  - async navigate(path: string): go to the given path
  - async waitForPageLoad(): wait for domcontentloaded
  - async getTitle(): return page title string
  - async getURL(): return current URL string
- Must be declared abstract (even if no abstract methods yet)

=== core/SmartLocator.ts ===
A utility for resilient element selection with automatic fallback.
- Import LocatorStrategy from types/index.ts
- Static async method: findElement(page: Page, strategies: LocatorStrategy[], timeoutMs = 2000): Promise<Locator>
  - Tries each strategy in order with the given timeout
  - If element is visible and attached, logs "[SmartLocator] Found element using: <name>" and returns the Locator
  - If strategy fails or times out, silently tries the next
  - If ALL strategies fail, throws Error listing every strategy name that was tried
- Static helper: buildStrategies(options: { dataTest?: string, id?: string, ariaLabel?: string, text?: string, css?: string }): LocatorStrategy[]
  - Returns array of LocatorStrategy in priority order, skipping any undefined values
  - Priority: dataTest → id → ariaLabel → text → css

=== core/TestDataLoader.ts ===
Generic typed JSON file loader.
- Static method: load<T>(filepath: string): T[]
  - Uses path.join(process.cwd(), filepath) to resolve the path
  - Uses fs.readFileSync to read the file
  - Parses and returns as T[]
  - Throws descriptive error if file not found or JSON is invalid

=== types/index.ts ===
Shared TypeScript interfaces used across both apps:
- LocatorStrategy: { name: string; selector: string }
- LoginUser: { scenario: string; username: string; password: string; expectSuccess: boolean; expectedError?: string }
- ProductItem: { scenario: string; productName: string; expectedPrice: string }

Show all 4 files with complete TypeScript code.
```

---

## 📄 PHASE 3 — SauceDemo Page Objects

```
I have a Playwright TypeScript framework with:
- core/BasePage.ts (abstract base class)
- core/SmartLocator.ts (multi-strategy locator)
- types/index.ts (shared types)

Now create the 5 SauceDemo page objects. Each must:
- Be in apps/saucedemo/pages/
- Extend BasePage from core/BasePage.ts
- Use SmartLocator for at least 3 elements per class
- Have private locator strategy arrays at the top of the class
- Expose only public async methods — NO assertions inside page objects
- Be fully typed with TypeScript

=== apps/saucedemo/pages/LoginPage.ts ===
Methods: navigate(), login(username, password), getErrorMessage(), isErrorVisible()
SauceDemo selectors: [data-test="username"], [data-test="password"], [data-test="login-button"], [data-test="error"]

=== apps/saucedemo/pages/InventoryPage.ts ===
Methods: isLoaded(), getProductNames(), getProductCount(), sortBy(option: 'az'|'za'|'lohi'|'hilo'),
addToCartByName(name), openProductByName(name), getCartBadgeCount(), goToCart(), openMenu(), logout()
Key selectors: [data-test="inventory-container"], [data-test="sort-container"], .inventory_item_name,
.shopping_cart_badge, #react-burger-menu-btn, #logout_sidebar_link

=== apps/saucedemo/pages/ProductDetailPage.ts ===
Methods: getProductName(), getProductPrice(), getProductDescription(), addToCart(), goBack()

=== apps/saucedemo/pages/CartPage.ts ===
Methods: getCartItems() returning {name, price}[], removeItemByName(name), getItemCount(),
proceedToCheckout(), continueShopping()

=== apps/saucedemo/pages/CheckoutPage.ts ===
Methods: fillPersonalInfo(firstName, lastName, zip), continueToOverview(), getOrderTotal(),
getItemNames(), finishOrder(), isOrderComplete(), getErrorMessage()

Show all 5 files with complete TypeScript code.
```

---

## 📦 PHASE 4 — SauceDemo Test Data + Test Suites

```
I have a Playwright TypeScript framework with core utilities and SauceDemo page objects.
Now create the test data files and all SauceDemo test suites.

=== apps/saucedemo/test-data/users.json ===
Array of 5 user scenarios:
1. valid_standard_user: username "standard_user", password "secret_sauce", expectSuccess true
2. locked_out_user: username "locked_out_user", password "secret_sauce", expectSuccess false, expectedError "locked out"
3. wrong_password: username "standard_user", password "wrongpassword", expectSuccess false, expectedError "do not match"
4. empty_username: username "", password "secret_sauce", expectSuccess false, expectedError "Username is required"
5. empty_password: username "standard_user", password "", expectSuccess false, expectedError "Password is required"

=== apps/saucedemo/test-data/products.json ===
Array of 3 product scenarios + array of 2 sort scenarios in same file:
Products: Sauce Labs Backpack ($29.99), Sauce Labs Bike Light ($9.99), Sauce Labs Bolt T-Shirt ($15.99)
Sort: az → first product "Sauce Labs Backpack", lohi → first product "Sauce Labs Bike Light"

=== apps/saucedemo/tests/auth.spec.ts ===
- Import TestDataLoader, LoginPage, InventoryPage
- Load users.json with TestDataLoader
- Loop over users: for expectSuccess true → verify inventory page loads; for false → verify expectedError in error message
- Separate test: successful logout flow
- Use test.describe, test.beforeEach for navigation

=== apps/saucedemo/tests/inventory.spec.ts ===
- beforeEach: login with standard_user
- Test: product count is exactly 6
- Load sort scenarios from products.json, loop and verify first product name after each sort

=== apps/saucedemo/tests/cart.spec.ts ===
- beforeEach: login with standard_user
- Test: add one product, badge shows "1"
- Test: add two products, go to cart, both appear in cart
- Test: add product, remove it, cart is empty

=== apps/saucedemo/tests/checkout.spec.ts ===
- beforeEach: login, add Sauce Labs Backpack to cart, go to cart
- Test: complete full checkout, verify "Thank you for your order" message
- Test: attempt checkout with empty first name, verify error message appears

=== apps/saucedemo/tests/smart-locator.spec.ts ===
This test PROVES the SmartLocator fallback works:
- Test 1: Use SmartLocator with ONLY data-test strategy on login page → should succeed, log "data-test"
- Test 2: Use SmartLocator where strategy[0] is a FAKE/INVALID selector, strategy[1] is the real one → 
  should succeed on strategy[1] and log which fallback was used
- This is a key academic demonstration — the test description should clearly state what it proves

Show all 6 files with complete code.
```

---

## 🌿 PHASE 5 — OrangeHRM Page Objects + Tests

```
I have a working Playwright framework that tests SauceDemo. Now I need to prove the framework is 
reusable by adding a SECOND completely different application: OrangeHRM Demo.

Base URL: https://opensource-demo.orangehrmlive.com
Valid credentials: username "Admin", password "admin123"

IMPORTANT: The page objects must use the SAME core utilities:
- Extend BasePage from core/BasePage.ts
- Use SmartLocator from core/SmartLocator.ts
- Test data loaded via TestDataLoader from core/TestDataLoader.ts

=== apps/orangehrm/test-data/users.json ===
Array of 3 scenarios:
1. valid_admin: username "Admin", password "admin123", expectSuccess true
2. wrong_password: username "Admin", password "wrongpassword", expectSuccess false
3. empty_fields: username "", password "", expectSuccess false

=== apps/orangehrm/pages/LoginPage.ts ===
Extends BasePage.
Methods: navigate(), login(username, password), getErrorMessage(), isLoginPageVisible()
OrangeHRM login selectors: input[name="username"], input[name="password"], button[type="submit"], .oxd-alert-content-text

=== apps/orangehrm/pages/DashboardPage.ts ===
Extends BasePage.
Methods: isDashboardLoaded(), getPageTitle(), navigateToPim(), navigateToAdmin()
Selectors: .oxd-topbar-header-breadcrumb, nav links by text

=== apps/orangehrm/pages/PimPage.ts ===
Extends BasePage.
Methods: isLoaded(), getPageTitle(), searchEmployee(name: string)
Selectors: .oxd-topbar-header-breadcrumb, search input, search button

=== apps/orangehrm/tests/auth.spec.ts ===
- Load users.json with TestDataLoader (same utility as SauceDemo)
- Loop over users: same pattern as SauceDemo auth tests
- For expectSuccess true → verify dashboard loads
- For expectSuccess false → verify error or stay on login page
- Add a comment at the top: "// Same framework core as SauceDemo — only page objects and test data differ"

=== apps/orangehrm/tests/navigation.spec.ts ===
- beforeEach: login with Admin credentials
- Test: dashboard loads and title is visible after login
- Test: navigate to PIM module, verify PIM page title
- Test: navigate to Admin module, verify Admin page title
- Add a comment: "// Proves the same BasePage.navigate() and SmartLocator work on a completely different app"

Show all 6 files. Make sure imports reference core/ and types/ correctly.
```

---

## 🚀 PHASE 6 — CI/CD Pipeline

```
Create a GitHub Actions CI/CD pipeline that runs BOTH app test suites.

File: .github/workflows/test.yml

Requirements:
- Workflow name: "Playwright UI Tests — SauceDemo & OrangeHRM"
- Trigger: push to main, pull_request to main
- Runner: ubuntu-latest
- Node.js version: 20 with npm cache
- Steps in order:
  1. Checkout code (actions/checkout@v4)
  2. Setup Node.js 20 with npm caching
  3. npm ci
  4. npx playwright install --with-deps
  5. Run ALL tests: npx playwright test (this runs both projects automatically)
  6. Upload playwright-report/ artifact named "playwright-report" — if: always()
  7. Upload test-results/ artifact named "test-results" — if: always()

Also add a second optional job that runs only SauceDemo tests (for reference):
  - name: test-saucedemo-only
  - command: npx playwright test --project=saucedemo
  - Make it optional (can be triggered manually or on specific branch)

Show the complete YAML file.
```

---

## 📋 PHASE 7 — README & Final Polish

```
Write a complete professional README.md for my final year project.

Project Name: Resilient, Data-Driven UI Test Automation Framework
Student: Oladeji Oluwalolope Paul | ID: 22010301053
Stack: Playwright, TypeScript, Page Object Model, GitHub Actions
Target Apps: SauceDemo (e-commerce) and OrangeHRM (HR system)

The README must include:

1. Project title + one strong paragraph describing what it is, what problem it solves, and what makes it different (multi-app reusability)

2. Key Features — use a short list:
   - Multi-app reusable architecture (same core, different apps)
   - SmartLocator: resilient multi-strategy element selection with fallback
   - Page Object Model with shared BasePage
   - Data-driven testing via external JSON files
   - Runs against two structurally different applications: SauceDemo and OrangeHRM
   - GitHub Actions CI/CD pipeline
   - Playwright HTML reports with screenshots on failure

3. Tech Stack table

4. Prerequisites: Node.js 18+, npm, Git

5. Installation:
   git clone ...
   npm install
   npx playwright install

6. Running Tests:
   npm test                          → run all tests (both apps)
   npm run test:saucedemo            → SauceDemo only
   npm run test:orangehrm            → OrangeHRM only
   npm run test:headed               → watch browser
   npm run test:report               → open HTML report
   npm run test:ui                   → Playwright interactive mode
   npx playwright test --project=saucedemo tests/auth.spec.ts  → single file

7. Project Structure — full folder tree with one-line description per item

8. How SmartLocator Works — 2 paragraphs explaining the fallback strategy and why it makes the framework resilient. Mention that it logs the winning strategy for debugging.

9. How Data-Driven Testing Works — explain JSON files + TestDataLoader + test loops. Include a short pseudocode example.

10. Multi-App Reusability — explain that the /core folder has zero app-specific code, and demonstrate this by describing what changes when adding a new app (only page objects + test data).

11. CI/CD — what the pipeline does and how to view the report artifact on GitHub

12. Author — name, student ID, institution

Make this README worthy of a final year project submission. Professional tone, clear structure.
```

---

## 🐛 DEBUGGING PROMPTS

### Flaky test:
```
My Playwright test is flaky — sometimes passes, sometimes fails with a timeout.

Test code:
[PASTE TEST]

Error:
[PASTE ERROR]

Fix this without changing the test logic. Use Playwright's built-in auto-wait instead of 
manual sleeps, and add explicit waitFor conditions where needed.
```

### TypeScript error:
```
I have a TypeScript compile error. Please fix it without changing the test logic.

Error: [PASTE ERROR]
File: [PASTE FILE CONTENTS]
```

### OrangeHRM selector not working:
```
My Playwright test for OrangeHRM cannot find an element. 

The page is: https://opensource-demo.orangehrmlive.com
I am trying to find: [DESCRIBE ELEMENT]
Current selector: [PASTE SELECTOR]

Suggest 3 alternative selectors I can use in my SmartLocator strategies array,
ordered from most stable to least stable.
```

### GitHub Actions failing:
```
My GitHub Actions pipeline failed. 

Workflow file: [PASTE workflow.yml]
Error from Actions log: [PASTE ERROR]

What is wrong and how do I fix it?
```
