import { test, expect } from '../fixtures/api.fixture';
import { validateSchema } from '../../src/validators/schema-validator';
import { reqresLoginSuccessSchema, reqresLoginErrorSchema } from '../../src/schemas/reqres/login.schema';
import { reqresRegisterSuccessSchema } from '../../src/schemas/reqres/register.schema';
import { reqresUserListSchema, reqresSingleUserSchema } from '../../src/schemas/reqres/user-list.schema';
import { reqresErrorSchema } from '../../src/schemas/reqres/error.schema';
import { UserFactory } from '../../src/factories/user.factory';

test.describe('ReqRes - Schema Contract Validation', () => {
  test('Login success response matches schema', async ({ reqresAuth }) => {
    const res = await reqresAuth.login(UserFactory.reqresValidLogin());

    expect(res.status).toBe(200);
    const result = validateSchema(reqresLoginSuccessSchema as unknown as Record<string, unknown>, res.body);
    expect(result.valid).toBe(true);
  });

  test('Login error response matches schema', async ({ reqresAuth }) => {
    const res = await reqresAuth.loginExpectingError(UserFactory.reqresLoginMissingPassword());

    expect(res.status).toBe(400);
    const result = validateSchema(reqresLoginErrorSchema as unknown as Record<string, unknown>, res.body);
    expect(result.valid).toBe(true);
  });

  test('Register success response matches schema', async ({ reqresAuth }) => {
    const res = await reqresAuth.register(UserFactory.reqresValidRegister());

    expect(res.status).toBe(200);
    const result = validateSchema(reqresRegisterSuccessSchema as unknown as Record<string, unknown>, res.body);
    expect(result.valid).toBe(true);
  });

  test('User list response matches schema', async ({ reqresUsers }) => {
    const res = await reqresUsers.listUsers(1);

    expect(res.status).toBe(200);
    const result = validateSchema(reqresUserListSchema as unknown as Record<string, unknown>, res.body);
    expect(result.valid).toBe(true);
    if (!result.valid) {
      console.error('Schema errors:', result.errorMessages);
    }
  });

  test('Single user response matches schema', async ({ reqresUsers }) => {
    const res = await reqresUsers.getUser(2);

    expect(res.status).toBe(200);
    const result = validateSchema(reqresSingleUserSchema as unknown as Record<string, unknown>, res.body);
    expect(result.valid).toBe(true);
  });

  test('Error response matches error schema', async ({ reqresAuth }) => {
    const res = await reqresAuth.registerExpectingError(UserFactory.reqresRegisterMissingPassword());

    expect(res.status).toBe(400);
    const result = validateSchema(reqresErrorSchema as unknown as Record<string, unknown>, res.body);
    expect(result.valid).toBe(true);
  });
});