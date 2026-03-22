import { MockHandler } from '../mock-server';

/** Simulates a successful notification dispatch */
export const notificationSuccessHandler: MockHandler = () => ({
  status: 200,
  body: {
    messageId: `msg_${Date.now()}`,
    status: 'sent',
    channel: 'email',
  },
});

/** Simulates a notification service failure */
export const notificationFailureHandler: MockHandler = () => ({
  status: 503,
  body: {
    error: 'Notification service unavailable',
    retryAfter: 60,
  },
});

/** Simulates a slow notification response (2 s) */
export const notificationDelayHandler: MockHandler = () => ({
  status: 200,
  body: {
    messageId: `msg_${Date.now()}`,
    status: 'queued',
  },
  delay: 2000,
});