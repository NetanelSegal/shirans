import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'light' | 'dark';

/** A short bronze hairline — the site's signature ornament. */
export function Rule({ className }: { className?: string }) {
  return <span aria-hidden className={cn('block h-px w-12 shrink-0 bg-accent', className)} />;
}

/** Only Latin labels are tracked out: spacing Hebrew letters breaks the words apart. */
const isLatin = (node: ReactNode) => typeof node === 'string' && /^[\sA-Za-z&'-]+$/.test(node);

/**
 * The small label above a heading ("נעים להכיר", "MY VISION"). With `rule`, a
 * hairline leads into it.
 */
export function Eyebrow({
  children,
  rule = false,
  tone = 'light',
  className,
}: {
  children: ReactNode;
  rule?: boolean;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 text-eyebrow',
        isLatin(children) ? 'uppercase tracking-[0.24em]' : 'text-small font-semibold',
        tone === 'dark' ? 'text-on-dark/80' : 'text-accent-strong',
        className,
      )}
    >
      {rule && <Rule className={cn('w-8', tone === 'dark' && 'bg-on-dark/60')} />}
      {children}
    </p>
  );
}

interface SectionHeadingProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  subtitle?: ReactNode;
  /**
   * `center` flanks the title with hairlines (—— השירותים שלי ——);
   * `start` sets a hairline after it, running toward the content.
   */
  align?: 'center' | 'start';
  /** The heading level; the look stays the same. */
  as?: 'h1' | 'h2' | 'h3';
  size?: 'h1' | 'h2';
  tone?: Tone;
  id?: string;
  /** Rendered at the far end of the title row, e.g. "לכל הפרויקטים ←". */
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({
  title,
  eyebrow,
  subtitle,
  align = 'center',
  as: Tag = 'h2',
  size = 'h2',
  tone = 'light',
  id,
  action,
  className,
}: SectionHeadingProps) {
  const isCenter = align === 'center';
  const ruleClass = tone === 'dark' ? 'bg-on-dark/40' : 'bg-accent/70';

  return (
    <header
      className={cn(
        'flex flex-col gap-3',
        isCenter ? 'items-center text-center' : 'items-start text-start',
        className,
      )}
    >
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}

      <div className={cn('flex w-full items-center gap-5 md:gap-8', isCenter && 'justify-center')}>
        {isCenter && <Rule className={cn('hidden flex-1 sm:block sm:max-w-40', ruleClass)} />}
        <Tag
          id={id}
          className={cn(
            size === 'h1' ? 'text-h1' : 'text-h2',
            'text-balance',
            tone === 'dark' ? 'text-on-dark' : 'text-ink',
          )}
        >
          {title}
        </Tag>
        {isCenter ? (
          <Rule className={cn('hidden flex-1 sm:block sm:max-w-40', ruleClass)} />
        ) : (
          <Rule className={cn('hidden w-auto max-w-32 flex-1 sm:block', ruleClass)} />
        )}
        {action && <div className='ms-auto shrink-0'>{action}</div>}
      </div>

      {subtitle && (
        <p
          className={cn(
            'max-w-measure text-lead',
            tone === 'dark' ? 'text-on-dark/80' : 'text-ink-muted',
          )}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
