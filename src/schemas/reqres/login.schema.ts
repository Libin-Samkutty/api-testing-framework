import { JSONSchemaType } from 'ajv';

export const reqresLoginSuccessSchema: JSONSchemaType<{ token: string }> = {
  type: 'object',
  properties: {
    token: { type: 'string', minLength: 1 },
  },
  required: ['token'],
  additionalProperties: false,
};

export const reqresLoginErrorSchema: JSONSchemaType<{ error: string }> = {
  type: 'object',
  properties: {
    error: { type: 'string', minLength: 1 },
  },
  required: ['error'],
  additionalProperties: false,
};