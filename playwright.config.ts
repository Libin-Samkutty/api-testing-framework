import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 1,

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'reports/html' }],
    ['json', { outputFile: 'reports/results.json' }],
  ],

  projects: [
    {
      name: 'reqres-api',
      testMatch: /tests\/reqres\/.+\.spec\.ts$/,
      use: {
        baseURL: process.env.REQRES_BASE_URL || 'https://reqres.in',
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      },
    },
    {
      name: 'realworld-api',
      testMatch: /tests\/realworld\/.+\.spec\.ts$/,
      use: {
        baseURL: process.env.REALWORLD_BASE_URL || 'https://api.realworld.show/api',
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      },
    },
    {
      name: 'mock-scenarios',
      testMatch: /tests\/mocks\/.+\.spec\.ts$/,
      use: {
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      },
    },
  ],
});