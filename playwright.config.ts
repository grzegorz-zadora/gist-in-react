import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testMatch: /.*\.e2e\.ts/,
  testDir: "app",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 3,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    video: {
      mode: "on-first-retry",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], headless: Boolean(process.env.CI) },
    },
  ],
  webServer: {
    command: process.env.CI ? "npm run start" : "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
  reporter: [["html", { open: "never" }]],
});
