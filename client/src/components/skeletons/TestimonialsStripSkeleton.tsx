import { LoadingRegion, Skeleton } from '@/components/ui/Skeleton';
import { SkeletonText } from '@/components/ui/Skeleton/SkeletonText';

const CARD_COUNT = 3;

export function TestimonialsStripSkeleton() {
  return (
    <LoadingRegion label="טוען משובים" className="my-8">
      <div className="relative mt-20 flex overflow-hidden" aria-hidden>
        {Array.from({ length: CARD_COUNT }, (_, i) => (
          <div
            key={i}
            className="relative mr-36 max-w-72 shrink-0 md:mr-64 md:max-w-64 lg:mr-96 lg:max-w-96"
          >
            <Skeleton className="absolute -right-3 -top-3 h-[86px] w-[120px] rounded-lg opacity-50" />
            <div className="z-10 flex min-h-[180px] flex-col gap-3">
              <SkeletonText variant="title" lines={1} />
              <SkeletonText variant="paragraph" lines={2} />
              <div className="mt-auto flex gap-1">
                {Array.from({ length: 5 }, (_, j) => (
                  <Skeleton key={j} className="size-6 rounded-sm" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </LoadingRegion>
  );
}
