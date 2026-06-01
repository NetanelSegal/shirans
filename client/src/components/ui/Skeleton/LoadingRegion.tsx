import classNames from 'classnames';
import { ReactNode } from 'react';

interface LoadingRegionProps {
  children: ReactNode;
  className?: string;
  label?: string;
}

export function LoadingRegion({
  children,
  className,
  label = 'טוען תוכן',
}: LoadingRegionProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      dir="rtl"
      className={classNames('w-full', className)}
    >
      {children}
    </div>
  );
}
