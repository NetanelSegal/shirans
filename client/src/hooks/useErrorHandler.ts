import { useCallback } from 'react';
import { transformError, logError } from '../utils/errorHandler';
import { AppError } from '../types/error.types';

/**
 * Hook for handling errors in components
 */
export function useErrorHandler() {
  const handleError = useCallback((error: unknown, context?: string): AppError => {
    logError(error, context);
    return transformError(error);
  }, []);

  return { handleError };
}
