import { ReactNode } from 'react';
import { content as PROCESS_STEPS } from '@/data/process-info';
import { IconCircle } from '@/components/ui/LineIcon';
import { cn } from '@/lib/cn';

/** "**word**" in the process copy marks emphasis. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*.*?\*\*)/).map((part, index) =>
        part.startsWith('**') ? (
          <strong key={index} className='font-semibold text-ink'>
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** "1-2 חודשים". An ASCII hyphen: an en dash between numbers flips them in RTL. */
function duration(time?: { min: number; max: number }) {
  return time ? `${time.min}-${time.max} חודשים` : null;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The five steps on a vertical hairline, each marked by a numbered disc.
 *
 * - `compact` (home): one column, the short copy.
 * - `full` (process page): the long copy, alternating sides on desktop, with
 *   `aside(index)` filling the opposite side.
 */
export function ProcessTimeline({
  variant = 'compact',
  aside,
}: {
  variant?: 'compact' | 'full';
  aside?: (index: number) => ReactNode;
}) {
  const isFull = variant === 'full';

  return (
    <ol className='relative'>
      {/* The spine: under the discs, from the first to the last. */}
      <span
        aria-hidden
        className={cn(
          'absolute bottom-6 top-6 w-px bg-line',
          isFull ? 'start-6 md:start-1/2' : 'start-6',
        )}
      />
      {PROCESS_STEPS.map((step, index) => {
        const time = duration(step.time);
        const flip = isFull && index % 2 === 1;
        return (
          <li
            key={step.title}
            className={cn(
              'relative grid grid-cols-[3rem_1fr] gap-x-5 md:gap-x-8',
              isFull ? 'py-8 md:grid-cols-[1fr_3rem_1fr] md:py-12' : 'py-5',
            )}
          >
            <IconCircle
              variant='soft'
              className={cn('relative z-10 self-start text-body font-semibold', isFull && 'md:col-start-2')}
            >
              <span dir='ltr'>{pad(index + 1)}</span>
            </IconCircle>

            <div
              className={cn(
                'flex flex-col gap-2 pt-2',
                isFull && 'md:row-start-1',
                isFull && (flip ? 'md:col-start-3' : 'md:col-start-1 md:text-end'),
              )}
            >
              <div className={cn('flex flex-wrap items-baseline gap-x-3 gap-y-1', isFull && !flip && 'md:justify-end')}>
                <h3 className='text-h3 text-ink'>{step.title}</h3>
                {time && <span className='text-small text-accent-strong'>{time}</span>}
              </div>
              <p className={cn('text-body text-ink-muted', isFull ? 'max-w-xl' : 'max-w-measure', isFull && !flip && 'md:ms-auto')}>
                <RichText text={isFull ? step.longText : step.shortText} />
              </p>
            </div>

            {isFull && aside && (
              <div
                className={cn(
                  'col-start-2 mt-6 md:row-start-1 md:mt-0',
                  flip ? 'md:col-start-1' : 'md:col-start-3',
                )}
              >
                {aside(index)}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
