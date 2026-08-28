import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  reporter: 'line',
  use: { baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:4173', viewport: { width: 390, height: 844 } },
  webServer: process.env.BASE_URL ? undefined : { command: 'npm run dev:site -- --host 127.0.0.1 --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: true }
});
