import classNames from 'classnames';
import { Skeleton } from '@/components/ui/Skeleton';
import { SkeletonText } from '@/components/ui/Skeleton/SkeletonText';

interface ProjectRowSkeletonProps {
  reversed?: boolean;
}

export function ProjectRowSkeleton({ reversed = false }: ProjectRowSkeletonProps) {
  return (
    <div
      className={classNames(
        'flex flex-col gap-5 lg:flex-row',
        reversed && 'lg:flex-row-reverse',
      )}
      aria-hidden
    >
      <div className="lg:w-2/3">
        <Skeleton className="aspect-video w-full rounded-xl shadow-[0_0_5px_0_rgba(0,0,0,0.2)]" />
      </div>
      <div className="my-1 flex flex-col gap-3 px-2 lg:w-1/3">
        <SkeletonText variant="title" lines={1} />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <SkeletonText variant="paragraph" lines={3} />
        <Skeleton className="h-5 w-28" />
      </div>
    </div>
  );
}
