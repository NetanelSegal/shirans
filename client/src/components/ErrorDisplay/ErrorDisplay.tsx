import { AppError } from '@/types/error.types';

interface ErrorDisplayProps {
  error: AppError | null;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({ error, onRetry, className }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className={`error-display ${className || ''}`} dir="rtl">
      <div className="error-message">{error.message}</div>
      {onRetry && error.isNetworkError && (
        <button onClick={onRetry} className="retry-button">
          נסה שוב
        </button>
      )}
    </div>
  );
}
