import { MockServer } from './mock-server';
import { registerReqResMockHandlers } from './handlers/reqres.handler';
import {
  paymentSuccessHandler,
  paymentFailureHandler,
  paymentDelayHandler,
} from './handlers/payment.handler';
import {
  notificationSuccessHandler,
  notificationFailureHandler,
  notificationDelayHandler,
} from './handlers/notification.handler';
import { ENV } from '../config/environment';

const server = new MockServer();

// ReqRes mock endpoints (mirrors the real reqres.in API — used because reqres.in is
// protected by Cloudflare and blocks automated clients like Newman)
registerReqResMockHandlers(server);

// Payment scenarios — each on its own path so all three are available simultaneously
server.register('POST', '/api/payments/charge',      paymentSuccessHandler);
server.register('POST', '/api/payments/charge/fail', paymentFailureHandler);
server.register('POST', '/api/payments/charge/slow', paymentDelayHandler);

// Notification scenarios
server.register('POST', '/api/notifications/send',        notificationSuccessHandler);
server.register('POST', '/api/notifications/send/fail',   notificationFailureHandler);
server.register('POST', '/api/notifications/send/slow',   notificationDelayHandler);

const port = ENV.MOCK_SERVER_PORT;

server.start(port).then(() => {
  console.log(`\nMock server running on http://localhost:${port}\n`);
  console.log('Endpoints:');
  console.log(`  POST /api/login                  → 200 { token } / 400 { error }`);
  console.log(`  POST /api/register               → 200 { id, token } / 400 { error }`);
  console.log(`  GET  /api/users                  → 200 user list (page 1)`);
  console.log(`  GET  /api/users/2                → 200 single user`);
  console.log(`  GET  /api/users/9999             → 404`);
  console.log(`  POST /api/users                  → 201 created user`);
  console.log(`  PUT  /api/users/2                → 200 updated user`);
  console.log(`  DELETE /api/users/2              → 204`);
  console.log(`  POST /api/payments/charge        → 200 { status: "completed" }`);
  console.log(`  POST /api/payments/charge/fail   → 502 { code: "GATEWAY_TIMEOUT" }`);
  console.log(`  POST /api/payments/charge/slow   → 200 { status: "pending" }  (3 s delay)`);
  console.log(`  POST /api/notifications/send      → 200 { status: "sent" }`);
  console.log(`  POST /api/notifications/send/fail → 503 { retryAfter: 60 }`);
  console.log(`  POST /api/notifications/send/slow → 200 { status: "queued" }  (2 s delay)`);
  console.log('\nPress Ctrl+C to stop.\n');
});

process.on('SIGINT', async () => {
  await server.stop();
  process.exit(0);
});
