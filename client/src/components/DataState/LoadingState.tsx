import Loader from '@/components/Loader';

interface LoadingStateProps {
  /** Minimum height to prevent layout shift during loading */
  minHeight?: string | number;
  className?: string;
}

export function LoadingState({ minHeight = '12rem', className = '' }: LoadingStateProps) {
  return (
    <div
      className={`flex min-w-full items-center justify-center py-12 ${className}`}
      style={{ minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }}
      dir="rtl"
      data-testid="loading-state"
    >
      <Loader />
    </div>
  );
}
