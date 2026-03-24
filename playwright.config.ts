import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Global settings
  retries: 1,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html'], ['list']],
  timeout: 60000,

  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    // ─── SauceDemo — Chromium ────────────────────────────────────────────────
    {
      name: 'saucedemo',
      testDir: './apps/saucedemo/tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
      },
    },
    // ─── SauceDemo — Firefox ─────────────────────────────────────────────────
    {
      name: 'saucedemo-firefox',
      testDir: './apps/saucedemo/tests',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'https://www.saucedemo.com',
      },
    },
    // ─── OrangeHRM — Chromium only ───────────────────────────────────────────
    {
      name: 'orangehrm',
      testDir: './apps/orangehrm/tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://opensource-demo.orangehrmlive.com',
      },
    },
  ],
});
