import { MockHandler } from '../mock-server';

/** Simulates a successful payment processing response */
export const paymentSuccessHandler: MockHandler = () => ({
  status: 200,
  body: {
    transactionId: `txn_${Date.now()}`,
    status: 'completed',
    amount: 29.99,
    currency: 'USD',
  },
});

/** Simulates a payment gateway timeout / failure */
export const paymentFailureHandler: MockHandler = () => ({
  status: 502,
  body: {
    error: 'Payment gateway unavailable',
    code: 'GATEWAY_TIMEOUT',
  },
});

/** Simulates a slow payment response (3 s) */
export const paymentDelayHandler: MockHandler = () => ({
  status: 200,
  body: {
    transactionId: `txn_${Date.now()}`,
    status: 'pending',
  },
  delay: 3000,
});