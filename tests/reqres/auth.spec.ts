import { test, expect } from '../fixtures/api.fixture';
import { UserFactory } from '../../src/factories/user.factory';

test.describe('ReqRes - Authentication', () => {
  test('Login success → returns token', async ({ reqresAuth }) => {
    const payload = UserFactory.reqresValidLogin();
    const res = await reqresAuth.login(payload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
    expect(res.body.token.length).toBeGreaterThan(0);
  });

  test('Login failure - missing password → returns error', async ({ reqresAuth }) => {
    const payload = UserFactory.reqresLoginMissingPassword();
    const res = await reqresAuth.loginExpectingError(payload);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Missing password');
  });

  test('Login failure - missing email → returns error', async ({ reqresAuth }) => {
    const res = await reqresAuth.loginExpectingError({ email: '' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('Register success → returns id and token', async ({ reqresAuth }) => {
    const payload = UserFactory.reqresValidRegister();
    const res = await reqresAuth.register(payload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.id).toBe('number');
    expect(typeof res.body.token).toBe('string');
  });

  test('Register failure - missing password → returns error', async ({ reqresAuth }) => {
    const payload = UserFactory.reqresRegisterMissingPassword();
    const res = await reqresAuth.registerExpectingError(payload);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Missing password');
  });

  test('Invalid payload - empty body → returns error', async ({ reqresClient }) => {
    const res = await reqresClient.post('/api/login', {});

    expect(res.status).toBe(400);
  });
});