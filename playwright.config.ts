import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PORT ?? 3100);

/**
 * Smoke tests against the production build. Run `npm run build` first;
 * the web server below serves it with `next start`.
 * Locally you can reuse an installed browser instead of downloading one:
 *   PW_CHANNEL=msedge npm run test:e2e   (or chrome)
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    channel: process.env.PW_CHANNEL,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: process.env.PW_CHANNEL } },
  ],
  webServer: {
    command: `npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
