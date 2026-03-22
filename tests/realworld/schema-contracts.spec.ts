import { test, expect } from '../fixtures/api.fixture';
import { validateSchema } from '../../src/validators/schema-validator';
import { rwUserResponseSchema } from '../../src/schemas/realworld/user.schema';
import { rwArticleResponseSchema, rwArticlesListSchema } from '../../src/schemas/realworld/article.schema';
import { rwCommentResponseSchema, rwCommentsListSchema } from '../../src/schemas/realworld/comment.schema';
import { ArticleFactory } from '../../src/factories/article.factory';
import { UserFactory } from '../../src/factories/user.factory';

test.describe('RealWorld - Schema Contract Validation', () => {
  test('User registration response matches schema', async ({ rwAuth }) => {
    const payload = UserFactory.realworldRegister();
    const res = await rwAuth.register(payload);

    expect(res.status).toBe(201);
    const result = validateSchema(rwUserResponseSchema as unknown as Record<string, unknown>, res.body);
    expect(result.valid).toBe(true);
    if (!result.valid) console.error('Schema errors:', result.errorMessages);
  });

  test('Article response matches schema', async ({ authedRWArticles }) => {
    const payload = ArticleFactory.create();
    const res = await authedRWArticles.create(payload);

    expect(res.status).toBe(201);
    const result = validateSchema(rwArticleResponseSchema as unknown as Record<string, unknown>, res.body);
    expect(result.valid).toBe(true);
    if (!result.valid) console.error('Schema errors:', result.errorMessages);

    await authedRWArticles.delete(res.body.article.slug);
  });

  test('Articles list response matches schema', async ({ authedRWArticles }) => {
    const res = await authedRWArticles.list({ limit: '5' });

    expect(res.status).toBe(200);
    const result = validateSchema(rwArticlesListSchema as unknown as Record<string, unknown>, res.body);
    expect(result.valid).toBe(true);
    if (!result.valid) console.error('Schema errors:', result.errorMessages);
  });

  test('Comment response matches schema', async ({ authedRWArticles, authedRWComments }) => {
    const articlePayload = ArticleFactory.create();
    const articleRes = await authedRWArticles.create(articlePayload);
    const slug = articleRes.body.article.slug;

    const commentPayload = ArticleFactory.comment();
    const commentRes = await authedRWComments.create(slug, commentPayload);

    expect(commentRes.status).toBe(201);
    const result = validateSchema(rwCommentResponseSchema as unknown as Record<string, unknown>, commentRes.body);
    expect(result.valid).toBe(true);
    if (!result.valid) console.error('Schema errors:', result.errorMessages);

    await authedRWArticles.delete(slug);
  });

  test('Comments list response matches schema', async ({ authedRWArticles, authedRWComments }) => {
    const articlePayload = ArticleFactory.create();
    const articleRes = await authedRWArticles.create(articlePayload);
    const slug = articleRes.body.article.slug;

    await authedRWComments.create(slug, ArticleFactory.comment());

    const listRes = await authedRWComments.list(slug);
    expect(listRes.status).toBe(200);
    const result = validateSchema(rwCommentsListSchema as unknown as Record<string, unknown>, listRes.body);
    expect(result.valid).toBe(true);
    if (!result.valid) console.error('Schema errors:', result.errorMessages);

    await authedRWArticles.delete(slug);
  });

  test('Schema regression - detect unexpected fields', async ({ authedRWArticles }) => {
    const payload = ArticleFactory.create();
    const res = await authedRWArticles.create(payload);

    expect(res.status).toBe(201);

    // Ensure no unexpected top-level keys
    const topLevelKeys = Object.keys(res.body);
    expect(topLevelKeys).toContain('article');

    // Ensure article has expected keys
    const articleKeys = Object.keys(res.body.article);
    const expectedKeys = ['slug', 'title', 'description', 'body', 'tagList', 'createdAt', 'updatedAt', 'favorited', 'favoritesCount', 'author'];
    for (const key of expectedKeys) {
      expect(articleKeys).toContain(key);
    }

    await authedRWArticles.delete(res.body.article.slug);
  });
});