export const reqresUserListSchema = {
  type: 'object',
  properties: {
    page: { type: 'integer' },
    per_page: { type: 'integer' },
    total: { type: 'integer' },
    total_pages: { type: 'integer' },
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          email: { type: 'string', format: 'email' },
          first_name: { type: 'string' },
          last_name: { type: 'string' },
          avatar: { type: 'string', format: 'uri' },
        },
        required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
        additionalProperties: false,
      },
    },
    support: {
      type: 'object',
      properties: {
        url: { type: 'string', format: 'uri' },
        text: { type: 'string' },
      },
      required: ['url', 'text'],
      additionalProperties: false,
    },
  },
  required: ['page', 'per_page', 'total', 'total_pages', 'data', 'support'],
  additionalProperties: false,
} as const;

export const reqresSingleUserSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        email: { type: 'string', format: 'email' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        avatar: { type: 'string', format: 'uri' },
      },
      required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
      additionalProperties: false,
    },
    support: {
      type: 'object',
      properties: {
        url: { type: 'string', format: 'uri' },
        text: { type: 'string' },
      },
      required: ['url', 'text'],
      additionalProperties: false,
    },
  },
  required: ['data', 'support'],
  additionalProperties: false,
} as const;