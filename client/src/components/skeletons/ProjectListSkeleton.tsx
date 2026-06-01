import { LoadingRegion } from '@/components/ui/Skeleton';
import { ProjectRowSkeleton } from './ProjectRowSkeleton';

interface ProjectListSkeletonProps {
  count?: number;
}

export function ProjectListSkeleton({ count = 3 }: ProjectListSkeletonProps) {
  return (
    <LoadingRegion label="טוען פרויקטים">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={i !== 0 ? 'py-5 lg:py-10' : 'py-5 lg:pb-10'}
        >
          <ProjectRowSkeleton reversed={i % 2 !== 0} />
        </div>
      ))}
    </LoadingRegion>
  );
}
