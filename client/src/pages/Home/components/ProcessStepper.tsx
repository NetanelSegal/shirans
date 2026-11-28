import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { content as PROCESS_STEPS } from '@/data/process-info';
import { RichText } from '@/components/Process/ProcessTimeline';
import { Photo } from '@/components/ui/Photo';
import { SITE_IMAGES, type SiteImage } from '@/constants/siteImages';
import { cn } from '@/lib/cn';

const STEP_IMAGES: SiteImage[] = [
  SITE_IMAGES.processStep1,
  SITE_IMAGES.processStep2,
  SITE_IMAGES.processStep3,
  SITE_IMAGES.processStep4,
  SITE_IMAGES.processStep5,
];

/** A step without its own duration (the first meeting) still gets a sliver of the bar. */
const weight = (index: number) => PROCESS_STEPS[index].time?.max ?? 1;

const pad = (n: number) => String(n).padStart(2, '0');

/** "1-2 חודשים". An ASCII hyphen: an en dash between numbers flips them in RTL. */
const duration = (time?: { min: number; max: number }) =>
  time ? `${time.min}-${time.max} חודשים` : 'פגישה אחת';

/**
 * The home page's process: pick a step and see it, instead of reading five
 * paragraphs. A bar sized by each step's months shows where the time goes;
 * the steps are tabs (keyboard: arrows), the panel swaps photo and copy.
 */
export function ProcessStepper() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const step = PROCESS_STEPS[active];
  const tabsRef = useRef<HTMLDivElement>(null);

  // Keep the chosen tab in view on a phone, where the row scrolls sideways.
  // Scrolls the row only, never the page.
  useEffect(() => {
    const row = tabsRef.current;
    const tab = document.getElementById(`process-tab-${active}`);
    if (!row || !tab) return;
    // Rect math, not offsetLeft: it works the same in RTL, where scrollLeft runs negative.
    const rowBox = row.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    const shift = tabBox.left + tabBox.width / 2 - (rowBox.left + rowBox.width / 2);
    row.scrollBy({ left: shift, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [active, reduceMotion]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    // RTL: the visual "next" is to the left.
    const delta = event.key === 'ArrowLeft' ? 1 : event.key === 'ArrowRight' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (active + delta + PROCESS_STEPS.length) % PROCESS_STEPS.length;
    setActive(next);
    document.getElementById(`process-tab-${next}`)?.focus();
  };

  return (
    <div className='flex flex-col gap-8'>
      {/* Where the time goes: one segment per step, as wide as its months. */}
      <div>
        <div className='flex h-2 w-full gap-1 overflow-hidden rounded-full' aria-hidden>
          {PROCESS_STEPS.map((s, index) => (
            <button
              key={s.title}
              type='button'
              tabIndex={-1}
              onClick={() => setActive(index)}
              style={{ flexGrow: weight(index) }}
              className={cn(
                'h-full basis-0 transition-colors duration-300 ease-out motion-reduce:transition-none',
                index <= active ? 'bg-primary' : 'bg-line',
              )}
            />
          ))}
        </div>
        <p className='mt-3 text-small text-ink-muted'>
          מהפגישה הראשונה ועד המפתח: <strong className='font-semibold text-ink'>בערך שנתיים עד שלוש</strong>
        </p>
      </div>

      {/* The steps, as tabs. Scrolls sideways on a phone. */}
      <div
        ref={tabsRef}
        role='tablist'
        aria-label='שלבי התהליך'
        onKeyDown={onKeyDown}
        className='-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]'
      >
        {PROCESS_STEPS.map((s, index) => {
          const selected = index === active;
          return (
            <button
              key={s.title}
              id={`process-tab-${index}`}
              type='button'
              role='tab'
              aria-selected={selected}
              aria-controls='process-panel'
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-small font-semibold',
                'transition-colors duration-200 ease-out motion-reduce:transition-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                selected
                  ? 'border-primary bg-primary text-on-dark'
                  : 'border-line bg-surface-raised text-ink hover-capable:hover:border-primary',
              )}
            >
              <span dir='ltr' className={selected ? 'text-on-dark/70' : 'text-ink-muted'}>
                {pad(index + 1)}
              </span>
              {s.title}
            </button>
          );
        })}
      </div>

      {/* The chosen step. */}
      <div
        id='process-panel'
        role='tabpanel'
        aria-labelledby={`process-tab-${active}`}
        className='overflow-hidden rounded-panel bg-surface-raised shadow-card'
      >
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={active}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(8px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className='grid sm:grid-cols-[1fr_1.1fr]'
          >
            <Photo
              image={STEP_IMAGES[active]}
              sizes='(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw'
              className='aspect-[4/3] w-full sm:aspect-auto sm:h-full sm:min-h-72'
            />
            <div className='flex flex-col gap-3 p-6 md:p-8'>
              <p className='text-eyebrow font-semibold tracking-wide text-ink-muted'>
                שלב <span dir='ltr'>{pad(active + 1)}</span> מתוך <span dir='ltr'>{pad(PROCESS_STEPS.length)}</span> ·{' '}
                {duration(step.time)}
              </p>
              <h3 className='text-h3 text-ink'>{step.title}</h3>
              <p className='text-body text-ink-muted'>
                <RichText text={step.shortText} />
              </p>
              {active < PROCESS_STEPS.length - 1 && (
                <button
                  type='button'
                  onClick={() => setActive(active + 1)}
                  className='mt-2 self-start text-small font-semibold text-ink underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                >
                  לשלב הבא: {PROCESS_STEPS[active + 1].title} ←
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
