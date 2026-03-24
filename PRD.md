# Product Requirements Document (PRD)
## Project: Resilient, Data-Driven UI Test Automation Framework
**Author:** Oladeji Oluwalolope Paul | **Student ID:** 22010301053  
**Version:** 2.0 | **Last Updated:** 2026

---

## 1. Project Overview

### 1.1 Summary
A modular, production-grade UI test automation framework built with Playwright and TypeScript. The framework is designed to be **reusable across multiple web applications** — demonstrated by executing test suites against two structurally different target applications using the same framework core, with only page objects and test data swapped per app.

### 1.2 Problem Being Solved
Traditional UI test scripts are tightly coupled to one application — change the app, rewrite everything. This project solves that by:
- Separating framework core (SmartLocator, TestDataLoader, BasePage) from app-specific code (page objects, test data)
- Using multi-attribute smart locators that survive DOM changes
- Proving reusability by running the same framework against two completely different web applications

### 1.3 The Reusability Proof — The Core Academic Argument
The same framework core runs against both target apps. Only these things change per app:
- Page Object classes (`/apps/<appname>/pages/`)
- Test data JSON files (`/apps/<appname>/test-data/`)
- Test spec files (`/apps/<appname>/tests/`)

Nothing in `/core/`, `playwright.config.ts`, or `.github/` changes between apps.  
**This separation IS the contribution of the project.**

---

## 2. Target Applications

| # | Application | URL | Domain | Why Chosen |
|---|---|---|---|---|
| 1 | **SauceDemo** | https://www.saucedemo.com | E-commerce | Login, product listing, cart, checkout — rich UI flows |
| 2 | **OrangeHRM Demo** | https://opensource-demo.orangehrmlive.com | HR Management | Completely different domain and DOM structure — proves framework is not app-specific |

**OrangeHRM Credentials:** username: `Admin`, password: `admin123`

---

## 3. Functional Requirements

### 3.1 Framework Core (Shared — App-Agnostic)
- [ ] `BasePage.ts` — abstract base class all page objects extend
- [ ] `SmartLocator.ts` — multi-attribute fallback locator strategy
- [ ] `TestDataLoader.ts` — generic typed JSON file loader
- [ ] `playwright.config.ts` — multi-project config supporting both apps
- [ ] Shared TypeScript type definitions in `/types/`

### 3.2 Smart Locator Strategy
- [ ] Attempts selectors in this priority order:
  1. `data-test` attribute (most stable)
  2. `id` attribute
  3. `aria-label` / accessible name
  4. Text content
  5. CSS class (last resort)
- [ ] Logs which strategy succeeded for every interaction
- [ ] Fallback behaviour demonstrated in a dedicated test

### 3.3 Data-Driven Testing
- [ ] Test inputs stored in external JSON files per app
- [ ] One test function runs multiple scenarios by looping over data
- [ ] Both valid and negative/invalid data included

### 3.4 Test Coverage — SauceDemo (Primary App)

| Suite | Scenarios |
|---|---|
| Authentication | Valid login, invalid password, locked-out user, empty fields |
| Product Listing | Products load, sort by price/name, product count |
| Shopping Cart | Add item, remove item, cart badge count |
| Checkout Flow | Full checkout with valid data, missing fields validation |
| Logout | Successful logout, session cleared |

### 3.5 Test Coverage — OrangeHRM (Reusability Demonstration)

| Suite | Scenarios |
|---|---|
| Authentication | Valid login, invalid credentials, empty fields |
| Dashboard | Loads after login, key widgets visible |
| Navigation | Navigate to PIM and Admin modules |

> OrangeHRM coverage is intentionally lighter — it exists to **prove reusability**, not to be a full regression suite.

### 3.6 CI/CD Integration
- [ ] GitHub Actions runs both suites on every push to `main` and every PR
- [ ] HTML reports uploaded as build artifacts
- [ ] Failing tests block the build

### 3.7 Reporting
- [ ] Playwright HTML Report after every run
- [ ] Failed tests include: screenshot, error message, step log
- [ ] Reports labelled per app

---

## 4. Project Folder Structure

```
ui-test-framework/
├── .github/
│   └── workflows/
│       └── test.yml                  # CI/CD — runs both app suites
│
├── core/                             # App-agnostic framework core (NEVER touch for new apps)
│   ├── BasePage.ts                   # Abstract base class for all page objects
│   ├── SmartLocator.ts               # Multi-attribute fallback locator
│   └── TestDataLoader.ts             # Generic typed JSON data loader
│
├── types/                            # Shared TypeScript interfaces
│   └── index.ts
│
├── apps/
│   ├── saucedemo/
│   │   ├── pages/
│   │   │   ├── LoginPage.ts
│   │   │   ├── InventoryPage.ts
│   │   │   ├── CartPage.ts
│   │   │   ├── ProductDetailPage.ts
│   │   │   └── CheckoutPage.ts
│   │   ├── tests/
│   │   │   ├── auth.spec.ts
│   │   │   ├── inventory.spec.ts
│   │   │   ├── cart.spec.ts
│   │   │   └── checkout.spec.ts
│   │   └── test-data/
│   │       ├── users.json
│   │       └── products.json
│   │
│   └── orangehrm/
│       ├── pages/
│       │   ├── LoginPage.ts
│       │   ├── DashboardPage.ts
│       │   └── PimPage.ts
│       ├── tests/
│       │   ├── auth.spec.ts
│       │   └── navigation.spec.ts
│       └── test-data/
│           └── users.json
│
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 5. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Full suite time (both apps) | < 3 minutes |
| Flakiness rate | < 5% with 1 retry |
| Browser support | Chromium (primary), Firefox (secondary) |
| TypeScript strict mode | Enabled |
| Core reuse between apps | 100% — zero core changes |

---

## 6. Success Criteria

- Both app test suites pass consistently
- `/core` folder contains zero app-specific code
- SmartLocator fallback demonstrated by a dedicated test
- GitHub Actions runs green for both suites
- Supervisor can clearly see the same framework core powering two different applications
