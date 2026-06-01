import { LoadingRegion, Skeleton } from '@/components/ui/Skeleton';

export function FavoriteProjectsCarouselSkeleton() {
  return (
    <LoadingRegion label="טוען פרויקטים נבחרים">
      <Skeleton className="mx-auto mb-4 h-12 w-64" aria-hidden />
      <div className="mx-auto max-w-[900px]" aria-hidden>
        <Skeleton className="mb-2 aspect-video w-full rounded-xl" />
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <Skeleton className="h-10 w-32" />
          <div className="flex gap-2">
            <Skeleton className="size-10 rounded-xl" />
            <Skeleton className="size-10 rounded-xl" />
          </div>
        </div>
      </div>
    </LoadingRegion>
  );
}
