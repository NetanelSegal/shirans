import Button from '@/components/ui/Button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  message,
  onRetry,
  retryLabel = 'נסה שוב',
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`flex min-w-full flex-col items-center justify-center gap-4 py-16 text-center ${className}`}
      dir="rtl"
      data-testid="error-state"
    >
      <p className="paragraph text-lg font-medium text-red-600">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
