import { JSONSchemaType } from 'ajv';

export const reqresRegisterSuccessSchema: JSONSchemaType<{ id: number; token: string }> = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    token: { type: 'string', minLength: 1 },
  },
  required: ['id', 'token'],
  additionalProperties: false,
};