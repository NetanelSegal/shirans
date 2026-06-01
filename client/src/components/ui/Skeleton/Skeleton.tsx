import classNames from 'classnames';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={classNames(
        'rounded-xl bg-secondary/70 motion-reduce:animate-none animate-pulse',
        className,
      )}
    />
  );
}
