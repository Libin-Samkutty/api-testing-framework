import { test, expect } from '../fixtures/api.fixture';
import { UserFactory } from '../../src/factories/user.factory';
import { ArticleFactory } from '../../src/factories/article.factory';
import { ApiClient } from '../../src/clients/api-client';
import { RealWorldAuthService } from '../../src/services/realworld/auth.service';
import { RealWorldArticleService } from '../../src/services/realworld/article.service';
import { RealWorldCommentService } from '../../src/services/realworld/comment.service';
import { ENV } from '../../src/config/environment';

test.describe('RealWorld - End-to-End Workflows', () => {
  test('Full lifecycle: register → login → create article → delete', async ({ rwAuth, rwArticles }) => {
    // Register a fresh user
    const registerPayload = UserFactory.realworldRegister();
    const registerRes = await rwAuth.register(registerPayload);
    expect(registerRes.status).toBe(201);

    // Login (sets token on the shared realworldClient)
    const loginPayload = UserFactory.realworldLogin(
      registerPayload.user.email,
      registerPayload.user.password,
    );
    const loginRes = await rwAuth.login(loginPayload);
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.user.token).toBeTruthy();

    // Create article using the same authenticated client
    const articlePayload = ArticleFactory.create();
    const articleRes = await rwArticles.create(articlePayload);
    expect(articleRes.status).toBe(201);

    // Delete article
    const deleteRes = await rwArticles.delete(articleRes.body.article.slug);
    expect(deleteRes.status).toBe(204);
  });

  test('Multi-user interaction: author vs non-author permissions', async ({ playwright }) => {
    // ── User A (author) ──
    const ctxA = await playwright.request.newContext({
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    const clientA = new ApiClient(ctxA, ENV.REALWORLD_BASE_URL);
    const authA = new RealWorldAuthService(clientA);
    const articlesA = new RealWorldArticleService(clientA);

    const userAPayload = UserFactory.realworldRegister();
    await authA.register(userAPayload);

    // User A creates an article
    const articlePayload = ArticleFactory.create();
    const articleRes = await articlesA.create(articlePayload);
    expect(articleRes.status).toBe(201);
    const slug = articleRes.body.article.slug;

    // ── User B (non-author) ──
    const ctxB = await playwright.request.newContext({
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    const clientB = new ApiClient(ctxB, ENV.REALWORLD_BASE_URL);
    const authB = new RealWorldAuthService(clientB);
    const articlesB = new RealWorldArticleService(clientB);

    const userBPayload = UserFactory.realworldRegister();
    await authB.register(userBPayload);

    // User B tries to update User A's article → should fail
    const updateRes = await articlesB.update(slug, ArticleFactory.update({ title: 'Hijacked!' }));
    expect([403, 404, 422]).toContain(updateRes.status);

    // User B tries to delete User A's article → should fail
    const deleteRes = await articlesB.delete(slug);
    expect([403, 404, 422]).toContain(deleteRes.status);

    // User B attempts to add a comment (201 per spec; api.realworld.show may return 404)
    const commentService = new RealWorldCommentService(clientB);
    const commentRes = await commentService.create(slug, ArticleFactory.comment({ body: 'Nice post!' }));
    expect([201, 404]).toContain(commentRes.status);

    // Cleanup: User A deletes their article
    await articlesA.delete(slug);

    await ctxA.dispose();
    await ctxB.dispose();
  });

  test('Article feed requires authentication', async ({ realworldClient }) => {
    const res = await realworldClient.get('/articles/feed');

    expect([401, 403, 422]).toContain(res.status);
  });
});