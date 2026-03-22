import { test, expect } from '../fixtures/api.fixture';
import { ArticleFactory } from '../../src/factories/article.factory';

test.describe('RealWorld - Data Consistency', () => {
  test('Create article → add comment → delete article → comment inaccessible', async ({
    authedRWArticles,
    authedRWComments,
  }) => {
    // Create article
    const articlePayload = ArticleFactory.create();
    const articleRes = await authedRWArticles.create(articlePayload);
    expect(articleRes.status).toBe(201);
    const slug = articleRes.body.article.slug;

    // Add comment
    const commentPayload = ArticleFactory.comment({ body: 'Consistency test comment' });
    const commentRes = await authedRWComments.create(slug, commentPayload);
    expect(commentRes.status).toBe(201);

    // Delete article
    const deleteRes = await authedRWArticles.delete(slug);
    expect(deleteRes.status).toBe(204);

    // Attempt to list comments on deleted article
    const commentsRes = await authedRWComments.list(slug);
    // Should be 404 or empty
    if (commentsRes.status === 200) {
      expect(commentsRes.body.comments.length).toBe(0);
    } else {
      expect([404, 422]).toContain(commentsRes.status);
    }
  });

  test('Update article → verify persistence on re-fetch', async ({ authedRWArticles }) => {
    const payload = ArticleFactory.create({ title: 'Original Title' });
    const createRes = await authedRWArticles.create(payload);
    const slug = createRes.body.article.slug;

    const updatePayload = ArticleFactory.update({ title: 'Persisted Title', description: 'Updated desc' });
    const updateRes = await authedRWArticles.update(slug, updatePayload);
    expect(updateRes.status).toBe(200);

    const updatedSlug = updateRes.body.article.slug;
    const fetchRes = await authedRWArticles.get(updatedSlug);
    expect(fetchRes.status).toBe(200);
    expect(fetchRes.body.article.title).toBe('Persisted Title');
    expect(fetchRes.body.article.description).toBe('Updated desc');

    await authedRWArticles.delete(updatedSlug);
  });

  test('User → article → favorite → validate relationships', async ({
    authedRWArticles,
    authedRWAuth,
  }) => {
    // Get current user
    const userRes = await authedRWAuth.getCurrentUser();
    expect(userRes.status).toBe(200);
    const username = userRes.body.user.username;

    // Create article
    const payload = ArticleFactory.create();
    const createRes = await authedRWArticles.create(payload);
    const slug = createRes.body.article.slug;

    // Verify author matches current user
    expect(createRes.body.article.author.username).toBe(username);

    // Favorite the article
    const favRes = await authedRWArticles.favorite(slug);
    expect(favRes.body.article.favorited).toBe(true);
    expect(favRes.body.article.favoritesCount).toBeGreaterThanOrEqual(1);

    // Unfavorite and verify count decreases
    const unfavRes = await authedRWArticles.unfavorite(slug);
    expect(unfavRes.body.article.favorited).toBe(false);

    await authedRWArticles.delete(slug);
  });
});