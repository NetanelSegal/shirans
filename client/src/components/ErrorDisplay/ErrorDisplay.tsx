import { ErrorMessage } from '@/constants/errorMessages';

interface ErrorDisplayProps {
  message: ErrorMessage;
  className?: string;
}

export function ErrorDisplay({ message, className }: ErrorDisplayProps) {
  if (!message) return null;

  return (
    <div className={`error-display rounded-lg bg-red-50 p-3 text-red-700 ${className || ''}`} dir="rtl">
      <div className="error-message">{message}</div>
    </div>
  );
}
