import { test, expect } from '../fixtures/api.fixture';
import { ArticleFactory } from '../../src/factories/article.factory';

test.describe('RealWorld - Articles', () => {
  test('Create article → returns article with correct data', async ({ authedRWArticles }) => {
    const payload = ArticleFactory.create();
    const res = await authedRWArticles.create(payload);

    expect(res.status).toBe(201);
    expect(res.body.article.title).toBe(payload.article.title);
    expect(res.body.article.description).toBe(payload.article.description);
    expect(res.body.article.body).toBe(payload.article.body);
    expect(res.body.article.slug).toBeTruthy();
    expect(res.body.article.author).toBeDefined();

    // Cleanup
    await authedRWArticles.delete(res.body.article.slug);
  });

  test('Get article by slug', async ({ authedRWArticles }) => {
    const payload = ArticleFactory.create();
    const createRes = await authedRWArticles.create(payload);
    const slug = createRes.body.article.slug;

    const getRes = await authedRWArticles.get(slug);
    expect(getRes.status).toBe(200);
    expect(getRes.body.article.slug).toBe(slug);
    expect(getRes.body.article.title).toBe(payload.article.title);

    await authedRWArticles.delete(slug);
  });

  test('Update article → persists changes', async ({ authedRWArticles }) => {
    const createPayload = ArticleFactory.create();
    const createRes = await authedRWArticles.create(createPayload);
    const slug = createRes.body.article.slug;

    const updatePayload = ArticleFactory.update({ title: 'Completely New Title' });
    const updateRes = await authedRWArticles.update(slug, updatePayload);
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.article.title).toBe('Completely New Title');

    // Verify persistence
    const updatedSlug = updateRes.body.article.slug;
    const fetchRes = await authedRWArticles.get(updatedSlug);
    expect(fetchRes.body.article.title).toBe('Completely New Title');

    await authedRWArticles.delete(updatedSlug);
  });

  test('Delete article → no longer accessible', async ({ authedRWArticles }) => {
    const payload = ArticleFactory.create();
    const createRes = await authedRWArticles.create(payload);
    const slug = createRes.body.article.slug;

    const deleteRes = await authedRWArticles.delete(slug);
    expect(deleteRes.status).toBe(204);

    const getRes = await authedRWArticles.get(slug);
    expect([404, 422]).toContain(getRes.status);
  });

  test('List articles - returns array', async ({ authedRWArticles }) => {
    const res = await authedRWArticles.list({ limit: '5' });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.articles)).toBe(true);
    expect(typeof res.body.articlesCount).toBe('number');
  });

  test('Favorite / unfavorite article', async ({ authedRWArticles }) => {
    const payload = ArticleFactory.create();
    const createRes = await authedRWArticles.create(payload);
    const slug = createRes.body.article.slug;

    // Favorite
    const favRes = await authedRWArticles.favorite(slug);
    expect(favRes.status).toBe(200);
    expect(favRes.body.article.favorited).toBe(true);
    expect(favRes.body.article.favoritesCount).toBeGreaterThanOrEqual(1);

    // Unfavorite
    const unfavRes = await authedRWArticles.unfavorite(slug);
    expect(unfavRes.status).toBe(200);
    expect(unfavRes.body.article.favorited).toBe(false);

    await authedRWArticles.delete(slug);
  });
});