import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [['dot'], ['html']] : [['html']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  expect: {
    toHaveScreenshot: {
      // https://github.com/microsoft/playwright/issues/20097#issuecomment-1382672908
      //@ts-expect-error experimental
      _comparator: 'ssim-cie94',
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'dev server',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:8080/',
      },
    },
    {
      name: 'prod build',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
    },
  ],

  /* It's a bit silly that we start these in parallel, but ok */
  webServer: [
    {
      command: 'pnpm run dev',
      url: 'http://localhost:8080/',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm run preview',
      url: 'http://localhost:3000/',
      reuseExistingServer: !process.env.CI,
    },
  ],
});
