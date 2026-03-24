# Implementation Plan
## Project: Resilient, Data-Driven UI Test Automation Framework
**Version:** 2.0

---

## Overview

| Phase | What You Build | Est. Time |
|---|---|---|
| Phase 1 | Project setup & config | 1–2 days |
| Phase 2 | Framework core (BasePage, SmartLocator, TestDataLoader) | 3–4 days |
| Phase 3 | SauceDemo — page objects | 2–3 days |
| Phase 4 | SauceDemo — test data + test suites | 3–4 days |
| Phase 5 | OrangeHRM — page objects + tests | 2–3 days |
| Phase 6 | CI/CD pipeline | 1 day |
| Phase 7 | Reporting, README, polish | 1–2 days |
| **Total** | | **~2.5–3 weeks** |

---

## Phase 1 — Project Setup

**Goal:** Scaffold the project structure. Run one smoke test successfully.

### Steps
1. Create folder: `ui-test-framework/`
2. Run `npm init -y`
3. Install: `npm install -D @playwright/test typescript @types/node`
4. Run `npx playwright install`
5. Create `tsconfig.json` with `strict: true`
6. Create `playwright.config.ts` with multi-project setup (both apps configured)
7. Create the full folder structure (`core/`, `apps/saucedemo/`, `apps/orangehrm/`, `types/`)
8. Write a smoke test for each app:
   - SauceDemo: assert title contains "Swag Labs"
   - OrangeHRM: assert login page loads

### ✅ Done When
- `npx playwright test` runs and two smoke tests pass
- Folder structure matches the PRD exactly

---

## Phase 2 — Framework Core

**Goal:** Build the three shared utilities that every page object will use.

### 2.1 `core/BasePage.ts`
- Abstract class with constructor accepting Playwright `Page`
- Methods: `navigate(path)`, `waitForPageLoad()`, `getTitle()`
- All page objects across both apps must extend this

### 2.2 `core/SmartLocator.ts`
- Define `LocatorStrategy` type: `{ name: string, selector: string }`
- Static `findElement(page, strategies[], timeout?)` method
- Tries each strategy with 2s timeout
- Logs winning strategy to console
- Throws descriptive error if all fail
- Helper `buildStrategies(dataTest?, id?, ariaLabel?, text?, css?)` factory

### 2.3 `core/TestDataLoader.ts`
- Static `load<T>(filepath: string): T[]`
- Uses `fs.readFileSync` + `JSON.parse`
- Throws descriptive error if file not found

### 2.4 `types/index.ts`
Define shared interfaces:
```typescript
export interface LoginUser {
  scenario: string;
  username: string;
  password: string;
  expectSuccess: boolean;
  expectedError?: string;
}

export interface ProductItem {
  scenario: string;
  productName: string;
  expectedPrice: string;
}

export interface LocatorStrategy {
  name: string;
  selector: string;
}
```

### ✅ Done When
- `core/` folder compiles with zero TypeScript errors
- SmartLocator test (written in Phase 4) passes

---

## Phase 3 — SauceDemo Page Objects

**Goal:** All 5 SauceDemo pages modelled as TypeScript classes extending BasePage.

### Files to Create
- `apps/saucedemo/pages/LoginPage.ts`
- `apps/saucedemo/pages/InventoryPage.ts`
- `apps/saucedemo/pages/ProductDetailPage.ts`
- `apps/saucedemo/pages/CartPage.ts`
- `apps/saucedemo/pages/CheckoutPage.ts`

### Rules for Every Page Object
- Must `extend BasePage`
- Private locators defined at the top of the class
- Public async action methods only (no assertions)
- Use SmartLocator for at least 3 elements per page

### Build Order
1. `LoginPage` first — every test depends on it
2. `InventoryPage` — main landing page
3. `CartPage`
4. `ProductDetailPage`
5. `CheckoutPage` — most complex (3 sub-steps)

### ✅ Done When
- All 5 classes compile without errors
- Can manually call `loginPage.login(...)` in a throwaway test and it works

---

## Phase 4 — SauceDemo Test Data + Test Suites

**Goal:** Full SauceDemo test coverage using data-driven parameterisation.

### Test Data Files
**`apps/saucedemo/test-data/users.json`**
```json
[
  { "scenario": "valid_login", "username": "standard_user", "password": "secret_sauce", "expectSuccess": true },
  { "scenario": "locked_user", "username": "locked_out_user", "password": "secret_sauce", "expectSuccess": false, "expectedError": "locked out" },
  { "scenario": "wrong_password", "username": "standard_user", "password": "wrongpass", "expectSuccess": false, "expectedError": "do not match" },
  { "scenario": "empty_username", "username": "", "password": "secret_sauce", "expectSuccess": false, "expectedError": "Username is required" },
  { "scenario": "empty_password", "username": "standard_user", "password": "", "expectSuccess": false, "expectedError": "Password is required" }
]
```

**`apps/saucedemo/test-data/products.json`** — product names, prices, sort scenarios

### Test Suites
- `auth.spec.ts` — loop over users.json; valid → inventory loads, invalid → error shown; logout test
- `inventory.spec.ts` — product count = 6; sort scenarios from data file
- `cart.spec.ts` — add/remove products, badge count
- `checkout.spec.ts` — full checkout flow; missing field validation

### SmartLocator Demonstration Test
Write one dedicated test in `apps/saucedemo/tests/smart-locator.spec.ts`:
- Use SmartLocator with a fake first strategy + valid fallback
- Assert the fallback strategy is logged in output
- This becomes a key exhibit in the dissertation

### ✅ Done When
- `npx playwright test --project=saucedemo` passes all tests
- At least 15 test cases across 4 suites
- SmartLocator fallback test passing and logging correctly

---

## Phase 5 — OrangeHRM Page Objects + Tests

**Goal:** Prove the framework is reusable. Minimum viable coverage against a completely different app.

### Page Objects
- `apps/orangehrm/pages/LoginPage.ts` — extends BasePage, login/logout methods
- `apps/orangehrm/pages/DashboardPage.ts` — check dashboard loads, navigate to modules
- `apps/orangehrm/pages/PimPage.ts` — employee search

### Test Data
**`apps/orangehrm/test-data/users.json`**
```json
[
  { "scenario": "valid_admin", "username": "Admin", "password": "admin123", "expectSuccess": true },
  { "scenario": "wrong_password", "username": "Admin", "password": "wrongpass", "expectSuccess": false },
  { "scenario": "empty_fields", "username": "", "password": "", "expectSuccess": false }
]
```

### Test Suites
- `auth.spec.ts` — same pattern as SauceDemo auth tests (loop over users.json)
- `navigation.spec.ts` — login → navigate to PIM → navigate to Admin → verify page titles

### Key Point to Note in Your Report
> The OrangeHRM page objects use the same `BasePage`, `SmartLocator`, and `TestDataLoader` as SauceDemo — zero changes to the core. Only the selectors and test data are different. This is the proof of reusability.

### ✅ Done When
- `npx playwright test --project=orangehrm` passes all tests
- At least 6 test cases across 2 suites
- `npx playwright test` (all projects) passes everything together

---

## Phase 6 — CI/CD Pipeline

**Goal:** Both test suites run automatically on GitHub on every push.

### File: `.github/workflows/test.yml`

```yaml
name: Playwright UI Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: test-results/
```

### Steps
1. Create GitHub repo, push your project
2. Add workflow file
3. Push and watch the Actions tab
4. Take a screenshot of the green build — this goes in your dissertation

### ✅ Done When
- GitHub Actions shows green checkmark
- Both SauceDemo and OrangeHRM suites visible in the Actions log
- HTML report downloadable from the Actions run

---

## Phase 7 — Reporting & Polish

**Goal:** Professional README. Clean, submission-ready codebase.

### README Must Include
- Project description and problem statement
- Features list (POM, SmartLocator, data-driven, multi-app, CI/CD)
- Tech stack table
- Prerequisites and installation steps
- How to run: all projects, one project, headed mode, UI mode
- Project structure with descriptions
- How SmartLocator works (2 paragraphs)
- How data-driven testing works (with example)
- CI/CD explanation
- Author section

### package.json Scripts
```json
{
  "scripts": {
    "test": "playwright test",
    "test:saucedemo": "playwright test --project=saucedemo",
    "test:orangehrm": "playwright test --project=orangehrm",
    "test:headed": "playwright test --headed",
    "test:report": "playwright show-report",
    "test:ui": "playwright test --ui"
  }
}
```

### Final Checklist
- [ ] All tests passing for both apps
- [ ] `/core` contains zero app-specific code
- [ ] SmartLocator fallback test passing and demonstrable
- [ ] Data-driven tests looping over JSON files
- [ ] GitHub Actions green for both suites
- [ ] `.gitignore` excludes `node_modules/`, `playwright-report/`, `test-results/`
- [ ] README allows a stranger to clone and run in under 5 minutes
- [ ] TypeScript strict mode, zero compile errors
