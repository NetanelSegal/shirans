import { RotateCcw } from 'lucide-react';
import { BUTTON_RESET } from './buttonReset';

interface ResumeBannerProps {
  onReset: () => void;
  onDismiss: () => void;
}

/**
 * Shown when a saved draft is restored. Landing mid-wizard without explanation is
 * disorienting, and starting over has to be one obvious click away.
 */
export function ResumeBanner({ onReset, onDismiss }: ResumeBannerProps) {
  return (
    <div
      className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/15 bg-white p-4"
      role="status"
    >
      <p className="text-sm text-primary">
        המשכנו מהמקום שבו הפסקתם — התשובות שלכם נשמרו.
      </p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onReset}
          className={`${BUTTON_RESET} flex items-center gap-1.5 text-sm font-bold text-primary underline`}
        >
          <RotateCcw className="size-4" aria-hidden />
          התחלה מחדש
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className={`${BUTTON_RESET} text-sm text-primary/70 underline`}
        >
          הבנתי
        </button>
      </div>
    </div>
  );
}
