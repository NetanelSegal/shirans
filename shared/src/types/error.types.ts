/**
 * API Error Response (matches backend format)
 * Shared type definition
 */
export interface ApiErrorResponse {
  error: string;
  message: string;
  errorKey?: string;
  stack?: string;
}
