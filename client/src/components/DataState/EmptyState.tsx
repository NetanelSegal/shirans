interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`flex min-w-full flex-col items-center justify-center py-16 text-center ${className}`}
      dir="rtl"
      data-testid="empty-state"
    >
      <p className="paragraph text-lg font-medium text-gray-600">{message}</p>
    </div>
  );
}
