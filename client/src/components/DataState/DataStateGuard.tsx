import { ReactNode } from 'react';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

interface DataStateGuardProps<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  emptyMessage: string;
  onRetry?: () => void;
  children: (data: T[]) => ReactNode;
  /** Custom loading UI (e.g. layout skeleton). Defaults to centered spinner. */
  loadingFallback?: ReactNode;
  loadingMinHeight?: string | number;
}

export function DataStateGuard<T>({
  data,
  isLoading,
  error,
  emptyMessage,
  onRetry,
  children,
  loadingFallback,
  loadingMinHeight,
}: DataStateGuardProps<T>) {
  if (isLoading) {
    if (loadingFallback) {
      return <>{loadingFallback}</>;
    }
    return <LoadingState minHeight={loadingMinHeight} />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return <>{children(data)}</>;
}
