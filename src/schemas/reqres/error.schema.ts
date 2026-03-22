export const reqresErrorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string', minLength: 1 },
  },
  required: ['error'],
  additionalProperties: false,
} as const;