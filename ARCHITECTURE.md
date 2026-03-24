# Architecture Document
## Project: Resilient, Data-Driven UI Test Automation Framework
**Version:** 2.0

---

## 1. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Language | TypeScript | Type safety, better IDE support, industry standard |
| Test Runner | Playwright | Best async handling, multi-browser, multi-project config |
| Pattern | Page Object Model + Base Class | Reusable, maintainable, industry standard |
| Data Layer | JSON files | Human-readable, version-controlled |
| CI/CD | GitHub Actions | Free, native GitHub integration |
| Reporting | Playwright HTML Reporter | Built-in, screenshots, video, trace |

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRAMEWORK CORE                           │
│              (app-agnostic — never changes per app)             │
│                                                                 │
│   BasePage.ts   │   SmartLocator.ts   │   TestDataLoader.ts    │
└────────────────────────────┬────────────────────────────────────┘
                             │ extends / uses
          ┌──────────────────┴──────────────────┐
          ▼                                     ▼
┌──────────────────────┐             ┌──────────────────────┐
│   apps/saucedemo/    │             │   apps/orangehrm/    │
│                      │             │                      │
│  pages/              │             │  pages/              │
│  ├── LoginPage       │             │  ├── LoginPage       │
│  ├── InventoryPage   │             │  ├── DashboardPage   │
│  ├── CartPage        │             │  └── PimPage         │
│  └── CheckoutPage    │             │                      │
│                      │             │  tests/              │
│  tests/              │             │  ├── auth.spec       │
│  ├── auth.spec       │             │  └── navigation.spec │
│  ├── inventory.spec  │             │                      │
│  ├── cart.spec       │             │  test-data/          │
│  └── checkout.spec   │             │  └── users.json      │
│                      │             └──────────────────────┘
│  test-data/          │
│  ├── users.json      │
│  └── products.json   │
└──────────────────────┘
          │                                     │
          └──────────────┬──────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PLAYWRIGHT ENGINE                             │
│        Chromium / Firefox  ◄──►  Target Web App                │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              REPORTING & CI/CD                                  │
│     HTML Reports  │  Screenshots  │  GitHub Actions             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

### 3.1 BasePage (`core/BasePage.ts`)

The abstract foundation every page object inherits from. Contains shared behaviour so it never has to be repeated:

```typescript
export abstract class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string) {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}

// App-specific page object just extends it:
export class LoginPage extends BasePage {
  async login(user: string, pass: string) { ... }
}
```

**Academic value:** This is the classic OOP inheritance pattern applied to test engineering. Supervisors will recognise this immediately.

---

### 3.2 SmartLocator (`core/SmartLocator.ts`)

The core innovation. Tries multiple selector strategies so one DOM change doesn't break tests:

```
Priority 1: [data-test="submit"]     ← set by developers specifically for testing
Priority 2: #submit-btn              ← stable if maintained
Priority 3: [aria-label="Submit"]    ← accessibility attribute
Priority 4: text="Submit"            ← visible text content
Priority 5: .btn-primary             ← fragile CSS class, last resort
```

If Priority 1 fails, it silently tries Priority 2, and so on. This is what makes the framework **resilient**.

```typescript
// Usage in any page object:
const button = await SmartLocator.findElement(this.page, [
  { name: 'data-test', selector: '[data-test="login-button"]' },
  { name: 'id',        selector: '#login-btn' },
  { name: 'text',      selector: 'text=Sign In' },
]);
await button.click();
// Console: [SmartLocator] Found element using: data-test
```

---

### 3.3 TestDataLoader (`core/TestDataLoader.ts`)

Generic typed file reader. Same utility works for both apps — just point it at different JSON files:

```typescript
// SauceDemo test:
const users = TestDataLoader.load<SauceUser>('apps/saucedemo/test-data/users.json');

// OrangeHRM test:
const users = TestDataLoader.load<HrmUser>('apps/orangehrm/test-data/users.json');

// Same function. Different data. That's data-driven + reusability together.
```

---

### 3.4 Multi-Project Playwright Config

The key config feature that runs both apps from one command:

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'saucedemo',
      testDir: './apps/saucedemo/tests',
      use: { baseURL: 'https://www.saucedemo.com' },
    },
    {
      name: 'orangehrm',
      testDir: './apps/orangehrm/tests',
      use: { baseURL: 'https://opensource-demo.orangehrmlive.com' },
    },
  ],
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  retries: 1,
  reporter: [['html'], ['list']],
});
```

Run all: `npx playwright test`  
Run one app: `npx playwright test --project=saucedemo`

---

## 4. Data Flow

```
Test file (e.g. auth.spec.ts)
  │
  ├── loads test data → TestDataLoader.load('users.json')
  │     └── returns typed array of user scenarios
  │
  └── loops over scenarios → for each user:
        │
        ├── calls page object → loginPage.login(user, pass)
        │     │
        │     └── page object uses SmartLocator → findElement(page, strategies)
        │           │
        │           ├── try strategy 1 → found? return Locator
        │           ├── try strategy 2 → found? return Locator
        │           └── all fail? throw descriptive Error
        │
        └── test asserts result
              │
              ├── PASS → continue
              └── FAIL → Playwright captures screenshot → HTML report updated
```

---

## 5. Why Two Apps Proves the Architecture Works

| What the Supervisor Sees | What It Proves |
|---|---|
| `/core` folder has zero mentions of SauceDemo or OrangeHRM | Framework core is truly app-agnostic |
| Both apps use `BasePage`, `SmartLocator`, `TestDataLoader` | Core is genuinely reusable |
| OrangeHRM page objects are much simpler but still use the same core | Adding a new app is low-effort |
| Same CI/CD pipeline runs both | Framework scales without infrastructure changes |
| Different DOM structures handled by same SmartLocator | Resilience is real, not just claimed |

---

## 6. Key Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Playwright vs Cypress | Playwright | Multi-project config, better TypeScript, no iframe limits |
| One config file vs two | One multi-project config | Cleaner, demonstrates framework unity |
| BasePage abstract class | Yes | Forces consistency across all page objects |
| OrangeHRM as second app | Yes | Different enough to be meaningful; public demo, no auth setup needed |
| JSON for test data | Yes | Simple, version-controllable, readable by non-developers |
