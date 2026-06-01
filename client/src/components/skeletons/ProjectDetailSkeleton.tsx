import { LoadingRegion, Skeleton } from '@/components/ui/Skeleton';
import { SkeletonText } from '@/components/ui/Skeleton/SkeletonText';

export function ProjectDetailSkeleton() {
  return (
    <LoadingRegion label="טוען פרויקט">
      <div className="breakout-x-padding relative mb-10" aria-hidden>
        <Skeleton className="h-[75vh] w-full rounded-none shadow-[0_0_5px_0_rgba(0,0,0,0.2)]" />
        <Skeleton className="absolute bottom-5 start-0 mx-page-all h-10 w-2/3 max-w-lg" />
      </div>
      <div className="px-page-all space-y-10" aria-hidden>
        <div className="space-y-4">
          <SkeletonText variant="title" lines={1} />
          <SkeletonText variant="paragraph" lines={4} />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="aspect-video w-full max-w-4xl" />
        </div>
      </div>
    </LoadingRegion>
  );
}
