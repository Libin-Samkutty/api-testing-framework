import { test, expect } from '../fixtures/api.fixture';
import { ArticleFactory } from '../../src/factories/article.factory';

test.describe('RealWorld - Comments', () => {
  test('Add comment to article', async ({ authedRWArticles, authedRWComments }) => {
    // Create an article first
    const articlePayload = ArticleFactory.create();
    const articleRes = await authedRWArticles.create(articlePayload);
    const slug = articleRes.body.article.slug;

    // Add comment
    const commentPayload = ArticleFactory.comment({ body: 'Great article!' });
    const commentRes = await authedRWComments.create(slug, commentPayload);

    expect(commentRes.status).toBe(201);
    expect(commentRes.body.comment.body).toBe('Great article!');
    expect(commentRes.body.comment.id).toBeDefined();
    expect(commentRes.body.comment.author).toBeDefined();

    // Cleanup
    await authedRWArticles.delete(slug);
  });

  test('List comments on article', async ({ authedRWArticles, authedRWComments }) => {
    const articlePayload = ArticleFactory.create();
    const articleRes = await authedRWArticles.create(articlePayload);
    const slug = articleRes.body.article.slug;

    // Add two comments
    await authedRWComments.create(slug, ArticleFactory.comment({ body: 'Comment 1' }));
    await authedRWComments.create(slug, ArticleFactory.comment({ body: 'Comment 2' }));

    // List
    const listRes = await authedRWComments.list(slug);
    expect(listRes.status).toBe(200);
    expect(listRes.body.comments.length).toBeGreaterThanOrEqual(2);

    await authedRWArticles.delete(slug);
  });

  test('Delete own comment', async ({ authedRWArticles, authedRWComments }) => {
    const articlePayload = ArticleFactory.create();
    const articleRes = await authedRWArticles.create(articlePayload);
    const slug = articleRes.body.article.slug;

    const commentPayload = ArticleFactory.comment({ body: 'To be deleted' });
    const commentRes = await authedRWComments.create(slug, commentPayload);
    const commentId = commentRes.body.comment.id;

    // Delete
    const deleteRes = await authedRWComments.delete(slug, commentId);
    expect(deleteRes.status).toBe(204);

    // Verify removal
    const listRes = await authedRWComments.list(slug);
    const found = listRes.body.comments.find((c) => c.id === commentId);
    expect(found).toBeUndefined();

    await authedRWArticles.delete(slug);
  });
});