import classNames from 'classnames';
import { Skeleton } from './Skeleton';

type SkeletonTextVariant = 'title' | 'paragraph' | 'chip';

const lineWidths: Record<SkeletonTextVariant, string[]> = {
  title: ['w-3/4', 'w-1/2'],
  paragraph: ['w-full', 'w-full', 'w-5/6', 'w-2/3'],
  chip: ['w-20'],
};

interface SkeletonTextProps {
  variant?: SkeletonTextVariant;
  lines?: number;
  className?: string;
}

export function SkeletonText({
  variant = 'paragraph',
  lines,
  className,
}: SkeletonTextProps) {
  const widths = lineWidths[variant];
  const count = lines ?? widths.length;

  return (
    <div className={classNames('flex flex-col gap-2', className)} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton
          key={i}
          className={classNames(
            'h-4',
            variant === 'title' && i === 0 && 'h-8',
            variant === 'chip' && 'h-6 rounded-full',
            widths[i % widths.length],
          )}
        />
      ))}
    </div>
  );
}
