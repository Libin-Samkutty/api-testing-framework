import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export interface ValidationResult {
  valid: boolean;
  errors: ErrorObject[] | null;
  errorMessages: string[];
}

/**
 * Validate `data` against a JSON Schema object.
 * Returns a structured result; never throws.
 */
export function validateSchema(schema: Record<string, unknown>, data: unknown): ValidationResult {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  const errors = validate.errors ?? null;
  const errorMessages = (errors ?? []).map(
    (e) => `${e.instancePath || '/'} ${e.message ?? 'unknown error'}`,
  );
  return { valid, errors, errorMessages };
}

/**
 * Assert helper - throws if validation fails (for use inside `expect`-free contexts).
 */
export function assertSchema(schema: Record<string, unknown>, data: unknown, label = 'Response'): void {
  const result = validateSchema(schema, data);
  if (!result.valid) {
    throw new Error(
      `${label} schema validation failed:\n${result.errorMessages.map((m) => `  - ${m}`).join('\n')}`,
    );
  }
}