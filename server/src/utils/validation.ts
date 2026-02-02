import { ZodError } from 'zod';
import { HttpError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ERROR_MESSAGES } from '../constants/errorMessages';

/**
 * Format Zod validation errors into a user-friendly message
 * @param error - Zod validation error
 * @returns Formatted error message
 */
export function formatZodError(error: ZodError): string {
  const errors = error.issues.map((err) => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });
  return errors.join(', ');
}

/**
 * Validate request data with Zod schema and throw HttpError if invalid
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated and parsed data
 * @throws HttpError 400 if validation fails
 */
export function validateRequest<T>(
  schema: { parse: (data: unknown) => T },
  data: unknown
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpError(
        HTTP_STATUS.BAD_REQUEST,
        formatZodError(error) || ERROR_MESSAGES.VALIDATION.INVALID_INPUT
      );
    }
    throw error;
  }
}
