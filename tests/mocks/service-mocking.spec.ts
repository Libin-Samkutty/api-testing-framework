import { test, expect } from '../fixtures/api.fixture';
import {
  paymentSuccessHandler,
  paymentFailureHandler,
  paymentDelayHandler,
} from '../../src/mocks/handlers/payment.handler';
import {
  notificationSuccessHandler,
  notificationFailureHandler,
  notificationDelayHandler,
} from '../../src/mocks/handlers/notification.handler';

test.describe('Service Mocking - Payment Gateway', () => {
  test('Successful payment processing', async ({ mockServer, mockClient }) => {
    mockServer.register('POST', '/api/payments/charge', paymentSuccessHandler);

    const res = await mockClient.post('/api/payments/charge', { amount: 29.99 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('transactionId');
    expect((res.body as Record<string, unknown>).status).toBe('completed');
  });

  test('Payment gateway failure → fallback behavior', async ({ mockServer, mockClient }) => {
    mockServer.register('POST', '/api/payments/charge', paymentFailureHandler);

    const res = await mockClient.post('/api/payments/charge', { amount: 29.99 });

    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty('error');
    expect((res.body as Record<string, unknown>).code).toBe('GATEWAY_TIMEOUT');
  });

  test('Payment gateway slow response', async ({ mockServer, mockClient }) => {
    mockServer.register('POST', '/api/payments/charge', paymentDelayHandler);

    const start = Date.now();
    const res = await mockClient.post('/api/payments/charge', { amount: 29.99 });
    const elapsed = Date.now() - start;

    expect(res.status).toBe(200);
    expect(elapsed).toBeGreaterThanOrEqual(2500); // ~3s delay
    expect((res.body as Record<string, unknown>).status).toBe('pending');
  });
});

test.describe('Service Mocking - Notification Service', () => {
  test('Successful notification dispatch', async ({ mockServer, mockClient }) => {
    mockServer.register('POST', '/api/notifications/send', notificationSuccessHandler);

    const res = await mockClient.post('/api/notifications/send', {
      to: 'user@test.com',
      subject: 'Welcome',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('messageId');
    expect((res.body as Record<string, unknown>).status).toBe('sent');
  });

  test('Notification service unavailable', async ({ mockServer, mockClient }) => {
    mockServer.register('POST', '/api/notifications/send', notificationFailureHandler);

    const res = await mockClient.post('/api/notifications/send', {
      to: 'user@test.com',
      subject: 'Welcome',
    });

    expect(res.status).toBe(503);
    expect(res.body).toHaveProperty('retryAfter');
  });

  test('Notification service delayed response', async ({ mockServer, mockClient }) => {
    mockServer.register('POST', '/api/notifications/send', notificationDelayHandler);

    const start = Date.now();
    const res = await mockClient.post('/api/notifications/send', {
      to: 'user@test.com',
      subject: 'Welcome',
    });
    const elapsed = Date.now() - start;

    expect(res.status).toBe(200);
    expect(elapsed).toBeGreaterThanOrEqual(1500); // ~2s delay
    expect((res.body as Record<string, unknown>).status).toBe('queued');
  });
});

test.describe('Service Mocking - ReqRes as Deterministic Fallback', () => {
  test('Use ReqRes response as mock dependency data', async ({ reqresUsers }) => {
    // Simulate using ReqRes as a controlled fallback for an unstable dependency
    const res = await reqresUsers.listUsers(1);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);

    // The deterministic data can be used as seed/fixture data
    const users = res.body.data;
    expect(users[0].email).toMatch(/@reqres\.in$/);
    expect(users[0]).toHaveProperty('first_name');
    expect(users[0]).toHaveProperty('last_name');
  });
});