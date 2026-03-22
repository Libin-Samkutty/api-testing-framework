export const rwUserResponseSchema = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        token: { type: 'string', minLength: 1 },
        username: { type: 'string', minLength: 1 },
        bio: { type: ['string', 'null'] },
        image: { type: ['string', 'null'] },
      },
      required: ['email', 'token', 'username'],
      additionalProperties: false,
    },
  },
  required: ['user'],
  additionalProperties: false,
} as const;