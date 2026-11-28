import { ReactNode, useRef } from 'react';
import { motion, MotionGlobalConfig, useScroll, useSpring, type Variants } from 'motion/react';
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

/** The site's --ease-out, for motion. */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/**
 * Each step settles in as it reaches the reader: the disc, then the words,
 * then the photo opening from the spine outward, like a drawing being
 * unrolled. Short distances and one easing, so it reads as calm, not busy.
 */
const STEP: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const DISC: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};
const TEXT: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};
/**
 * `onStart`: the photo sits on the start (right) side of the spine, so it
 * opens from its left edge toward the right; otherwise from its right edge.
 */
const PHOTO: Variants = {
  hidden: (onStart: boolean) => ({
    opacity: 0,
    clipPath: onStart ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)',
  }),
  show: {
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.1, ease: EASE_OUT, opacity: { duration: 0.4 } },
  },
};

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
  animated = false,
}: {
  variant?: 'compact' | 'full';
  aside?: (index: number) => ReactNode;
  /** Draw the spine with the scroll and bring each step in as it arrives. */
  animated?: boolean;
}) {
  const isFull = variant === 'full';
  const listRef = useRef<HTMLOListElement>(null);
  const motionOn = animated && !MotionGlobalConfig.skipAnimations;
  // A navy line follows the reader down the spine: it reaches each disc
  // as that step crosses the middle of the screen.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 55%', 'end 55%'] });
  const drawn = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const spine = cn('absolute bottom-6 top-6 w-px', isFull ? 'start-6 md:start-1/2' : 'start-6');
  const reveal = motionOn
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 } }
    : {};

  return (
    <ol ref={listRef} className='relative'>
      {/* The spine: under the discs, from the first to the last. */}
      <span aria-hidden className={cn(spine, 'bg-line')} />
      {motionOn && (
        <motion.span aria-hidden className={cn(spine, 'origin-top bg-accent')} style={{ scaleY: drawn }} />
      )}
      {PROCESS_STEPS.map((step, index) => {
        const time = duration(step.time);
        const flip = isFull && index % 2 === 1;
        return (
          <motion.li
            key={step.title}
            variants={STEP}
            {...reveal}
            className={cn(
              'relative grid grid-cols-[3rem_1fr] gap-x-5 md:gap-x-8',
              isFull ? 'py-8 md:grid-cols-[1fr_3rem_1fr] md:py-12' : 'py-5',
            )}
          >
            <motion.span variants={DISC} className={cn('relative z-10 self-start', isFull && 'md:col-start-2')}>
              <IconCircle variant='soft' className='text-body font-semibold'>
                <span dir='ltr'>{pad(index + 1)}</span>
              </IconCircle>
            </motion.span>

            <motion.div
              variants={TEXT}
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
            </motion.div>

            {isFull && aside && (
              <motion.div
                variants={PHOTO}
                custom={flip}
                className={cn(
                  'col-start-2 mt-6 md:row-start-1 md:mt-0',
                  flip ? 'md:col-start-1' : 'md:col-start-3',
                )}
              >
                {aside(index)}
              </motion.div>
            )}
          </motion.li>
        );
      })}
    </ol>
  );
}
