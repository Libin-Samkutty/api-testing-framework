const authorSchema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 1 },
    bio: { type: ['string', 'null'] },
    image: { type: ['string', 'null'] },
    following: { type: 'boolean' },
  },
  required: ['username', 'following'],
} as const;

export const rwArticleResponseSchema = {
  type: 'object',
  properties: {
    article: {
      type: 'object',
      properties: {
        slug: { type: 'string', minLength: 1 },
        title: { type: 'string' },
        description: { type: 'string' },
        body: { type: 'string' },
        tagList: { type: 'array', items: { type: 'string' } },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        favorited: { type: 'boolean' },
        favoritesCount: { type: 'integer', minimum: 0 },
        author: authorSchema,
      },
      required: [
        'slug', 'title', 'description', 'body',
        'tagList', 'createdAt', 'updatedAt',
        'favorited', 'favoritesCount', 'author',
      ],
    },
  },
  required: ['article'],
} as const;

export const rwArticlesListSchema = {
  type: 'object',
  properties: {
    articles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          body: { type: 'string' },
          tagList: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
          favorited: { type: 'boolean' },
          favoritesCount: { type: 'integer', minimum: 0 },
          author: authorSchema,
        },
        required: ['slug', 'title', 'description', 'author'],
      },
    },
    articlesCount: { type: 'integer', minimum: 0 },
  },
  required: ['articles', 'articlesCount'],
} as const;