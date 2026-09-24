import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Surfaces a section can sit on. `dark` flips text to cream, so everything
 * inside that reads `text-ink` needs a tone-aware component (SectionHeading,
 * FeatureStrip and friends take `tone`).
 */
const TONES = {
  surface: 'bg-surface text-ink',
  soft: 'bg-surface-soft text-ink',
  sunken: 'bg-surface-sunken text-ink',
  raised: 'bg-surface-raised text-ink',
  dark: 'bg-primary-deep text-on-dark',
  none: '',
} as const;

const SPACING = {
  default: 'py-section',
  tight: 'py-section-tight',
  none: '',
} as const;

const WIDTHS = {
  default: 'max-w-container',
  narrow: 'max-w-4xl',
  full: 'max-w-none',
} as const;

export type SectionTone = keyof typeof TONES;

interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  width?: keyof typeof WIDTHS;
  /** Drop the side gutters, e.g. for a full-bleed image row. */
  bleed?: boolean;
}

/** The content column: centered, capped, with the page gutters. */
export function Container({ width = 'default', bleed, className, ...rest }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full', WIDTHS[width], !bleed && 'px-gutter', className)}
      {...rest}
    />
  );
}

type SectionProps<T extends ElementType> = {
  as?: T;
  tone?: SectionTone;
  spacing?: keyof typeof SPACING;
  /** Width of the inner column; `false` renders children without one. */
  container?: keyof typeof WIDTHS | false;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

/**
 * A full-width band of the page. Every page is a stack of these; the vertical
 * rhythm and the gutters live here, so no page sets its own.
 */
export function Section<T extends ElementType = 'section'>({
  as,
  tone = 'surface',
  spacing = 'default',
  container = 'default',
  children,
  className,
  containerClassName,
  ...rest
}: SectionProps<T>) {
  const Tag = as ?? 'section';
  return (
    <Tag className={cn('relative', TONES[tone], SPACING[spacing], className)} {...rest}>
      {container === false ? (
        children
      ) : (
        <Container width={container} className={containerClassName}>
          {children}
        </Container>
      )}
    </Tag>
  );
}
