# Resilient, Data-Driven UI Test Automation Framework

A modular, production-grade UI test automation framework built with **Playwright** and **TypeScript**. It is designed to be **reusable across multiple web applications** — demonstrated by running the same framework core against two structurally different applications: an e-commerce site (SauceDemo) and an HR management system (OrangeHRM). Only the page objects and test data change per app; the core never does.

---

## Key Features

- **Multi-app reusable architecture** — same `/core`, same utilities, different apps
- **SmartLocator** — resilient multi-strategy element selection with automatic fallback; never breaks on a single DOM change
- **Page Object Model** with shared `BasePage` abstract class
- **Data-driven testing** — test scenarios loaded from external JSON files
- **Runs against two structurally different applications**: SauceDemo (e-commerce) & OrangeHRM (HR system)
- **GitHub Actions CI/CD** — both suites run automatically on every push
- **Playwright HTML Reports** — screenshots, video, and trace on failure

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript (strict mode) |
| Test Runner | Playwright |
| Pattern | Page Object Model + Abstract Base Class |
| Data Layer | JSON files |
| CI/CD | GitHub Actions |
| Reporting | Playwright HTML Reporter |

---

## Prerequisites

- Node.js 18+
- npm
- Git

---

## Installation

```bash
git clone https://github.com/noahdevelopsio/ui-test-framework.git
cd ui-test-framework
npm install
npx playwright install
```

---

## Running Tests

```bash
npm test                          # Run all tests (both SauceDemo + OrangeHRM)
npm run test:saucedemo            # SauceDemo only
npm run test:orangehrm            # OrangeHRM only
npm run test:headed               # Watch tests run in browser
npm run test:report               # Open HTML report in browser
npm run test:ui                   # Interactive Playwright UI mode
npx playwright test --project=saucedemo apps/saucedemo/tests/auth.spec.ts  # Single file
```

---

## Project Structure

```
ui-test-framework/
├── .github/
│   └── workflows/
│       └── test.yml              # CI/CD — runs both app suites on push
│
├── core/                         # App-agnostic framework core (NEVER changes per app)
│   ├── BasePage.ts               # Abstract base class all page objects extend
│   ├── SmartLocator.ts           # Multi-strategy fallback locator
│   └── TestDataLoader.ts         # Generic typed JSON data loader
│
├── types/
│   └── index.ts                  # Shared TypeScript interfaces
│
├── apps/
│   ├── saucedemo/
│   │   ├── pages/                # LoginPage, InventoryPage, CartPage, ProductDetailPage, CheckoutPage
│   │   ├── tests/                # auth, inventory, cart, checkout, smart-locator specs
│   │   └── test-data/            # users.json, products.json
│   │
│   └── orangehrm/
│       ├── pages/                # LoginPage, DashboardPage, PimPage
│       ├── tests/                # auth, navigation specs
│       └── test-data/            # users.json
│
├── playwright.config.ts          # Multi-project config (saucedemo + orangehrm)
├── tsconfig.json
└── package.json
```

---

## How SmartLocator Works

Traditional test frameworks bind to a single selector — when a developer removes a `data-test` attribute or renames a CSS class, the test breaks. SmartLocator solves this by maintaining an **ordered array of selector strategies** for every element. It tries each strategy in priority order with a per-strategy timeout. The moment it finds a visible, attached element, it logs the winning strategy and returns the locator. If every strategy fails, it throws a descriptive error listing every strategy that was tried.

The priority order is: `data-test` (most stable, set by developers for testing) → `id` → `aria-label` → `text content` → `css` (least stable, last resort). This hierarchy reflects real-world stability — a `data-test` attribute is unlikely to change, while a CSS class can change with a design update. The framework's resilience is not a claim — it is demonstrated by a dedicated test (`smart-locator.spec.ts`) that deliberately uses an invalid first strategy and proves the fallback to the second strategy succeeds.

---

## How Data-Driven Testing Works

Test inputs are stored as external JSON files under each app's `test-data/` folder. The `TestDataLoader` utility reads and parses them into typed arrays at runtime. Tests then loop over the data and generate one test case per row — meaning adding a new scenario is as simple as adding a JSON entry.

```
// Pseudocode
const users = TestDataLoader.load<LoginUser>('apps/saucedemo/test-data/users.json');

for each user in users:
  test(`login: ${user.scenario}`) {
    loginPage.login(user.username, user.password)
    if user.expectSuccess → assert inventory page loads
    else → assert error message contains user.expectedError
  }
```

The exact same `TestDataLoader` call is used in both SauceDemo and OrangeHRM auth tests — only the file path changes.

---

## Multi-App Reusability

The `/core` folder contains **zero mentions of SauceDemo or OrangeHRM**. When a third application needs to be tested:

1. Create `/apps/newapp/pages/` — extend `BasePage`, use `SmartLocator`
2. Create `/apps/newapp/test-data/` — add JSON files
3. Create `/apps/newapp/tests/` — import `TestDataLoader`, loop over data
4. Add a new `project` entry to `playwright.config.ts`

Nothing in `/core`, `types/`, or `.github/` changes. That is the proof of reusability.

---

## CI/CD

The GitHub Actions pipeline (`.github/workflows/test.yml`) triggers on every push to `main` and every pull request. It installs Node.js 20, runs `npm ci`, installs Playwright browsers with system dependencies, and then executes the full test suite across all projects. After the run — whether passing or failing — the HTML report and raw test results are uploaded as downloadable artifacts. To view them: open the run in GitHub Actions → scroll to **Artifacts** → download `playwright-report`.

---

## Author

**Oladeji Oluwalolope Paul**  
Student ID: 22010301053  
Stack: Playwright · TypeScript · Page Object Model · GitHub Actions
