import { test as base, APIRequestContext } from '@playwright/test';
import { ApiClient } from '../../src/clients/api-client';
import { ReqResAuthService } from '../../src/services/reqres/auth.service';
import { ReqResUserService } from '../../src/services/reqres/user.service';
import { RealWorldAuthService } from '../../src/services/realworld/auth.service';
import { RealWorldArticleService } from '../../src/services/realworld/article.service';
import { RealWorldCommentService } from '../../src/services/realworld/comment.service';
import { RealWorldProfileService } from '../../src/services/realworld/profile.service';
import { MockServer } from '../../src/mocks/mock-server';
import { registerReqResMockHandlers } from '../../src/mocks/handlers/reqres.handler';
import { ENV } from '../../src/config/environment';
import { UserFactory } from '../../src/factories/user.factory';
import { RWUserResponse } from '../../src/types/realworld.types';

// -- Custom fixture types --

type ApiFixtures = {
  // Raw clients
  reqresClient: ApiClient;
  realworldClient: ApiClient;

  // ReqRes services
  reqresAuth: ReqResAuthService;
  reqresUsers: ReqResUserService;

  // RealWorld services (unauthenticated)
  rwAuth: RealWorldAuthService;
  rwArticles: RealWorldArticleService;
  rwComments: RealWorldCommentService;
  rwProfiles: RealWorldProfileService;

  // Pre-authenticated RealWorld context
  authenticatedRWClient: ApiClient;
  authedRWAuth: RealWorldAuthService;
  authedRWArticles: RealWorldArticleService;
  authedRWComments: RealWorldCommentService;
  authedRWProfiles: RealWorldProfileService;
  testUser: RWUserResponse['user'];

  // Mock server
  mockServer: MockServer;
  mockClient: ApiClient;
};

export const test = base.extend<ApiFixtures>({
  // --- ReqRes ---

  reqresClient: async ({ playwright }, use) => {
    const mockServer = new MockServer();
    registerReqResMockHandlers(mockServer);
    await mockServer.start(0);

    const ctx: APIRequestContext = await playwright.request.newContext({
      baseURL: mockServer.baseURL,
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    const client = new ApiClient(ctx);
    await use(client);
    await ctx.dispose();
    await mockServer.stop();
  },

  reqresAuth: async ({ reqresClient }, use) => {
    await use(new ReqResAuthService(reqresClient));
  },

  reqresUsers: async ({ reqresClient }, use) => {
    await use(new ReqResUserService(reqresClient));
  },

  // --- RealWorld (unauthenticated) ---

  realworldClient: async ({ playwright }, use) => {
    const ctx: APIRequestContext = await playwright.request.newContext({
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    const client = new ApiClient(ctx, ENV.REALWORLD_BASE_URL);
    await use(client);
    await ctx.dispose();
  },

  rwAuth: async ({ realworldClient }, use) => {
    await use(new RealWorldAuthService(realworldClient));
  },

  rwArticles: async ({ realworldClient }, use) => {
    await use(new RealWorldArticleService(realworldClient));
  },

  rwComments: async ({ realworldClient }, use) => {
    await use(new RealWorldCommentService(realworldClient));
  },

  rwProfiles: async ({ realworldClient }, use) => {
    await use(new RealWorldProfileService(realworldClient));
  },

  // --- RealWorld (pre-authenticated) ---

  authenticatedRWClient: async ({ playwright }, use) => {
    const ctx: APIRequestContext = await playwright.request.newContext({
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    const client = new ApiClient(ctx, ENV.REALWORLD_BASE_URL);

    // Register a fresh user and set the token on the client
    const payload = UserFactory.realworldRegister();
    const authService = new RealWorldAuthService(client);
    const res = await authService.register(payload);
    if (!res.ok) {
      // If registration failed (e.g. duplicate), try login
      const loginRes = await authService.login(
        UserFactory.realworldLogin(payload.user.email, payload.user.password),
      );
      if (!loginRes.ok) {
        throw new Error(`Pre-auth setup failed: ${JSON.stringify(loginRes.body)}`);
      }
    }

    await use(client);
    await ctx.dispose();
  },

  testUser: async ({ authenticatedRWClient }, use) => {
    const authService = new RealWorldAuthService(authenticatedRWClient);
    const res = await authService.getCurrentUser();
    if (!res.ok) throw new Error('Failed to fetch test user');
    await use(res.body.user);
  },

  authedRWAuth: async ({ authenticatedRWClient }, use) => {
    await use(new RealWorldAuthService(authenticatedRWClient));
  },

  authedRWArticles: async ({ authenticatedRWClient }, use) => {
    await use(new RealWorldArticleService(authenticatedRWClient));
  },

  authedRWComments: async ({ authenticatedRWClient }, use) => {
    await use(new RealWorldCommentService(authenticatedRWClient));
  },

  authedRWProfiles: async ({ authenticatedRWClient }, use) => {
    await use(new RealWorldProfileService(authenticatedRWClient));
  },

  // --- Mock Server ---

  mockServer: async ({}, use) => {
    const server = new MockServer();
    await server.start(0);
    await use(server);
    server.reset();
    await server.stop();
  },

  mockClient: async ({ playwright, mockServer }, use) => {
    const ctx: APIRequestContext = await playwright.request.newContext({
      baseURL: mockServer.baseURL,
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    const client = new ApiClient(ctx);
    await use(client);
    await ctx.dispose();
  },
});

export { expect } from '@playwright/test';