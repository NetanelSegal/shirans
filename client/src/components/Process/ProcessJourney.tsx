import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, type Transition } from 'motion/react';
import { content as PROCESS_STEPS } from '@/data/process-info';
import { RichText } from '@/components/Process/ProcessTimeline';
import { cn } from '@/lib/cn';

/*
 * The process as a journey: a house drawn in isometric lines builds itself as
 * the reader scrolls through the five steps. Plot, then building lines, then
 * walls on paper, then the committee's stamp, then the finished house in colour.
 * Plain SVG and transforms only, so it stays light on phones.
 */

// ── Isometric geometry ──────────────────────────────────────────────────────
const U = 22; // one grid unit, in px
const CX = 200;
const CY = 150;
const COS = 0.866;

/** A point on the plot (x, y on the ground, z up) to SVG coordinates. */
function iso(x: number, y: number, z = 0): [number, number] {
  return [CX + (x - y) * U * COS, CY + (x + y) * U * 0.5 - z * U];
}
const pts = (...p: [number, number, number?][]) => p.map(([x, y, z]) => iso(x, y, z ?? 0).join(',')).join(' ');

/** The visible faces of a box: top, the +y face (front) and the +x face (side). */
function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  return {
    top: pts([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]),
    front: pts([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]),
    side: pts([x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]),
  };
}

const PLOT = pts([0, 0], [10, 0], [10, 8], [0, 8]);
const SETBACK = pts([2, 1], [9, 1], [9, 7], [2, 7]);
const GROUND = box(3, 8, 2, 6, 0, 3);
const UPPER = box(3, 6.5, 2, 6, 3, 5.6);

/** Windows: on the front (+y) face, as [x0, x1, z0, z1]; on the side (+x) face, as [y0, y1, z0, z1]. */
const FRONT_WINDOWS: [number, number, number, number][] = [
  [3.6, 5.6, 0.4, 2.5],
  [6.2, 7.5, 1.2, 2.5],
  [3.6, 6, 3.5, 5.1],
];
const SIDE_WINDOWS: [number, number, number, number][] = [
  [2.6, 5.4, 0.4, 2.5],
  [2.6, 4.2, 3.5, 5.1],
];
const frontWindow = ([x0, x1, z0, z1]: number[]) => pts([x0, 6, z0], [x1, 6, z0], [x1, 6, z1], [x0, 6, z1]);
const upperSideWindow = ([y0, y1, z0, z1]: number[]) =>
  pts([6.5, y0, z0], [6.5, y1, z0], [6.5, y1, z1], [6.5, y0, z1]);
const groundSideWindow = ([y0, y1, z0, z1]: number[]) => pts([8, y0, z0], [8, y1, z0], [8, y1, z1], [8, y0, z1]);

const TREES: [number, number][] = [
  [1, 6.8],
  [9.2, 1.2],
  [8.8, 7.2],
];

// ── The drawing ─────────────────────────────────────────────────────────────
function HouseDrawing({ stage, reduceMotion }: { stage: number; reduceMotion: boolean }) {
  const t = (delay = 0): Transition =>
    reduceMotion ? { duration: 0 } : { duration: 0.9, delay, ease: [0.23, 1, 0.32, 1] };
  const draw = (on: boolean, delay = 0) => ({
    initial: false as const,
    animate: { pathLength: on ? 1 : 0, opacity: on ? 1 : 0 },
    transition: t(delay),
  });
  const fade = (on: boolean, delay = 0) => ({
    initial: false as const,
    animate: { opacity: on ? 1 : 0 },
    transition: t(delay),
  });

  const lines = stage >= 2; // walls on paper
  const built = stage >= 4; // the finished house

  const faces = (b: ReturnType<typeof box>, delay: number) => (
    <>
      <motion.polygon points={b.side} className='fill-surface-sunken' {...fade(built, delay)} />
      <motion.polygon points={b.front} className='fill-surface-raised' {...fade(built, delay)} />
      <motion.polygon points={b.top} className='fill-line' {...fade(built, delay + 0.1)} />
      {(['side', 'front', 'top'] as const).map((face, i) => (
        <motion.polygon
          key={face}
          points={b[face]}
          className='fill-none stroke-primary'
          strokeWidth={1.25}
          strokeLinejoin='round'
          {...draw(lines, delay + i * 0.15)}
        />
      ))}
    </>
  );

  return (
    <svg viewBox='0 0 400 380' className='h-full w-full' role='img' aria-label='איור של בית שנבנה שלב אחרי שלב'>
      {/* 01 — the plot */}
      <motion.polygon points={PLOT} className='fill-success/10' {...fade(built)} />
      <motion.polygon
        points={PLOT}
        className='fill-none stroke-primary'
        strokeWidth={1.5}
        strokeLinejoin='round'
        {...draw(stage >= 0)}
      />

      {/* 02 — the building lines from the info file */}
      <motion.polygon
        points={SETBACK}
        className='fill-none stroke-primary'
        strokeWidth={1}
        strokeDasharray='5 5'
        {...fade(stage >= 1 && !built)}
      />
      <motion.text
        x={iso(9, 1)[0] + 6}
        y={iso(9, 1)[1] - 6}
        className='fill-ink-muted text-[10px]'
        {...fade(stage === 1 || stage === 2)}
      >
        קו בניין
      </motion.text>

      {/* 03 — walls on paper, then 05 — built */}
      {faces(GROUND, 0)}
      {faces(UPPER, 0.35)}

      {/* Windows: drawn with the walls, glazed when built */}
      {FRONT_WINDOWS.map((w, i) => (
        <motion.polygon
          key={`f${i}`}
          points={frontWindow(w)}
          className={cn('stroke-primary', built ? 'fill-primary/80' : 'fill-none')}
          strokeWidth={1}
          {...draw(lines, 0.6 + i * 0.1)}
        />
      ))}
      <motion.polygon
        points={groundSideWindow(SIDE_WINDOWS[0])}
        className={cn('stroke-primary', built ? 'fill-primary/70' : 'fill-none')}
        strokeWidth={1}
        {...draw(lines, 0.8)}
      />
      <motion.polygon
        points={upperSideWindow(SIDE_WINDOWS[1])}
        className={cn('stroke-primary', built ? 'fill-primary/70' : 'fill-none')}
        strokeWidth={1}
        {...draw(lines, 0.9)}
      />
      {/* A wood panel by the door, once built */}
      <motion.polygon
        points={pts([5.8, 6, 0], [6.1, 6, 0], [6.1, 6, 3], [5.8, 6, 3])}
        className='fill-warning/50'
        {...fade(built, 0.5)}
      />

      {/* Trees: sketched on the plot, green when built */}
      {TREES.map(([x, y], i) => {
        const [tx, ty] = iso(x, y);
        return (
          <g key={i}>
            <motion.line x1={tx} y1={ty} x2={tx} y2={ty - 18} className='stroke-primary' strokeWidth={1.25} {...fade(stage >= 0, 0.3)} />
            <motion.circle
              cx={tx}
              cy={ty - 26}
              r={11}
              className={cn('stroke-primary', built ? 'fill-success/60' : 'fill-none')}
              strokeWidth={1.25}
              {...draw(stage >= 0, 0.4 + i * 0.1)}
            />
          </g>
        );
      })}

      {/* 04 — the committee's stamp */}
      <motion.g
        initial={false}
        animate={
          stage === 3
            ? { opacity: 1, scale: 1, rotate: -12 }
            : { opacity: 0, scale: reduceMotion ? 1 : 1.6, rotate: -12 }
        }
        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 18 }}
        style={{ transformOrigin: '320px 70px' }}
      >
        <circle cx={320} cy={70} r={38} className='fill-surface-raised/80 stroke-success' strokeWidth={3} />
        <circle cx={320} cy={70} r={31} className='fill-none stroke-success' strokeWidth={1} />
        <text x={320} y={66} textAnchor='middle' className='fill-success text-[15px] font-semibold'>
          אושר
        </text>
        <text x={320} y={84} textAnchor='middle' className='fill-success text-[9px]'>
          היתר בנייה
        </text>
      </motion.g>
    </svg>
  );
}

// ── The page section ────────────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, '0');
const duration = (time?: { min: number; max: number }) => (time ? `${time.min}-${time.max} חודשים` : null);

/**
 * The steps scroll by; the drawing stays in view (beside them on desktop,
 * above them on a phone) and follows whichever step is in the middle of the screen.
 */
export function ProcessJourney() {
  const [stage, setStage] = useState(0);
  const reduceMotion = !!useReducedMotion();
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setStage(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      // A thin band across the middle of the screen: the step crossing it is the current one.
      { rootMargin: '-45% 0px -45% 0px' },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className='grid gap-x-16 md:grid-cols-2'>
      {/* The drawing. On a phone it sits under the navbar while the steps pass beneath it. */}
      <div className='sticky top-[var(--nav-height)] z-10 self-start -mx-[var(--gutter)] h-[34svh] bg-surface/95 px-[var(--gutter)] py-2 backdrop-blur-sm md:top-[calc(var(--nav-height)+2rem)] md:mx-0 md:h-[70svh] md:bg-transparent md:p-0 md:backdrop-blur-none'>
        <HouseDrawing stage={stage} reduceMotion={reduceMotion} />
        {/* Where we are: five dots under the drawing. */}
        <ol className='absolute inset-x-0 bottom-1 flex justify-center gap-2 md:bottom-4' aria-hidden>
          {PROCESS_STEPS.map((s, i) => (
            <li
              key={s.title}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500 ease-out motion-reduce:transition-none',
                i === stage ? 'w-6 bg-primary' : i < stage ? 'w-1.5 bg-primary/60' : 'w-1.5 bg-line',
              )}
            />
          ))}
        </ol>
      </div>

      {/* The steps. Each is tall enough to hold the drawing on its stage for a while. */}
      <ol className='md:col-start-1 md:row-start-1'>
        {PROCESS_STEPS.map((step, index) => {
          const time = duration(step.time);
          const current = index === stage;
          return (
            <li
              key={step.title}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              data-step={index}
              className='flex min-h-[70svh] flex-col justify-center gap-3 py-10'
            >
              <p
                className={cn(
                  'text-eyebrow font-semibold tracking-wide transition-colors duration-500 motion-reduce:transition-none',
                  current ? 'text-ink' : 'text-ink-muted',
                )}
              >
                שלב <span dir='ltr'>{pad(index + 1)}</span>
                {time && <> · {time}</>}
              </p>
              <h2
                className={cn(
                  'text-h2 transition-colors duration-500 motion-reduce:transition-none',
                  current ? 'text-ink' : 'text-ink-muted',
                )}
              >
                {step.title}
              </h2>
              <p className='max-w-xl text-body text-ink-muted'>
                <RichText text={step.longText} />
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
