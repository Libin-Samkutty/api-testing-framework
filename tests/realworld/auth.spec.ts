import { test, expect } from '../fixtures/api.fixture';
import { UserFactory } from '../../src/factories/user.factory';

test.describe('RealWorld - Authentication', () => {
  test('Register new user → returns user with token', async ({ rwAuth }) => {
    const payload = UserFactory.realworldRegister();
    const res = await rwAuth.register(payload);

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(payload.user.email);
    expect(res.body.user.username).toBe(payload.user.username);
    expect(res.body.user.token).toBeTruthy();
  });

  test('JWT lifecycle: register → login → get current user', async ({ rwAuth }) => {
    // 1. Register
    const payload = UserFactory.realworldRegister();
    const registerRes = await rwAuth.register(payload);
    expect(registerRes.status).toBe(201);
    const token = registerRes.body.user.token;
    expect(token).toBeTruthy();

    // 2. Login with same credentials
    const loginPayload = UserFactory.realworldLogin(payload.user.email, payload.user.password);
    const loginRes = await rwAuth.login(loginPayload);
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.user.token).toBeTruthy();

    // 3. Get current user (token was set by login)
    const currentRes = await rwAuth.getCurrentUser();
    expect(currentRes.status).toBe(200);
    expect(currentRes.body.user.email).toBe(payload.user.email);
  });

  test('Login with invalid credentials → error', async ({ rwAuth }) => {
    const payload = UserFactory.realworldLoginInvalid();
    const res = await rwAuth.loginExpectingError(payload);

    expect([401, 422]).toContain(res.status);
  });

  test('Unauthorized access without token → 401 or 403', async ({ realworldClient }) => {
    // Attempt to get current user without auth
    const res = await realworldClient.get('/user');

    expect([401, 403, 422]).toContain(res.status);
  });

  test('Duplicate registration → error', async ({ rwAuth }) => {
    const payload = UserFactory.realworldRegister();

    // First registration
    const first = await rwAuth.register(payload);
    expect(first.status).toBe(201);

    // Second registration with same credentials
    const second = await rwAuth.register(payload);
    expect([409, 422]).toContain(second.status);
  });
});