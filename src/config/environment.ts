import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  REQRES_BASE_URL: process.env.REQRES_BASE_URL || 'https://reqres.in',
  REALWORLD_BASE_URL: process.env.REALWORLD_BASE_URL || 'https://api.realworld.show/api',
  MOCK_SERVER_PORT: parseInt(process.env.MOCK_SERVER_PORT || '9090', 10),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  CI: !!process.env.CI,
} as const;

// ReqRes ships a fixed set of valid credentials
export const REQRES_CREDENTIALS = {
  VALID_EMAIL: 'eve.holt@reqres.in',
  VALID_PASSWORD: 'cityslicka',
  REGISTER_EMAIL: 'eve.holt@reqres.in',
  REGISTER_PASSWORD: 'pistol',
} as const;