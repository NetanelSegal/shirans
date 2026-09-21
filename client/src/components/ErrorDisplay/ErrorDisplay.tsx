import { ErrorMessage } from '@/constants/errorMessages';

interface ErrorDisplayProps {
  message: ErrorMessage;
  className?: string;
}

export function ErrorDisplay({ message, className }: ErrorDisplayProps) {
  if (!message) return null;

  return (
    <div className={`error-display rounded-card bg-danger-soft p-3 text-danger ${className || ''}`} dir="rtl">
      <div className="error-message">{message}</div>
    </div>
  );
}
