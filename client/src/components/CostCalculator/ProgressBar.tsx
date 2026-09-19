import { BUTTON_RESET } from './buttonReset';

interface ProgressBarProps {
  current: number;
  total: number;
  /** Highest step the visitor may jump to — everything beyond is still locked. */
  maxAllowedIndex: number;
  onJump: (index: number) => void;
}

export function ProgressBar({
  current,
  total,
  maxAllowedIndex,
  onJump,
}: ProgressBarProps) {
  const percent = ((current + 1) / total) * 100;

  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="shrink-0 text-sm font-bold text-primary/70">
        {current + 1}/{total}
      </span>
      <div
        className="relative h-1.5 flex-1 rounded-full bg-primary/10"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`שלב ${current + 1} מתוך ${total}`}
      >
        {/* Width only — `all` here would also animate the colour and corner radius
            for no reason. 320ms because the bar is feedback the eye follows, not
            something it waits on. */}
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-[320ms] ease-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
        <div className="absolute inset-0 flex">
          {Array.from({ length: total }, (_, i) => {
            const reachable = i <= maxAllowedIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => reachable && onJump(i)}
                disabled={!reachable}
                aria-label={`מעבר לשלב ${i + 1}`}
                className={`${BUTTON_RESET} h-full flex-1 rounded-none ${
                  reachable ? 'cursor-pointer' : 'cursor-default'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
