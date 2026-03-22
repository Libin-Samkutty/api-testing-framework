const commentAuthorSchema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 1 },
    bio: { type: ['string', 'null'] },
    image: { type: ['string', 'null'] },
    following: { type: 'boolean' },
  },
  required: ['username'],
} as const;

export const rwCommentResponseSchema = {
  type: 'object',
  properties: {
    comment: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        body: { type: 'string', minLength: 1 },
        author: commentAuthorSchema,
      },
      required: ['id', 'body', 'author'],
    },
  },
  required: ['comment'],
} as const;

export const rwCommentsListSchema = {
  type: 'object',
  properties: {
    comments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
          body: { type: 'string' },
          author: commentAuthorSchema,
        },
        required: ['id', 'body', 'author'],
      },
    },
  },
  required: ['comments'],
} as const;