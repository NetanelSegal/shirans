import { Skeleton } from '@/components/ui/Skeleton';
import { Container, Section } from '@/components/ui/Section';

/** Stands in for the blog listing: a lead article, then a grid of three. */
export function ArticleListSkeleton() {
  return (
    <div className='flex flex-col gap-10 md:gap-14'>
      <div className='grid gap-8 md:grid-cols-2 md:gap-0'>
        <Skeleton className='aspect-[4/3] w-full rounded-none' />
        <div className='flex flex-col gap-4 p-7 md:p-12'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-9 w-3/4' />
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-5/6' />
        </div>
      </div>
      <ul className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className='flex flex-col gap-3'>
            <Skeleton className='aspect-[16/10] w-full rounded-none' />
            <Skeleton className='h-6 w-2/3' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-4/5' />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Stands in for a single article while it loads. */
export function ArticleDetailSkeleton() {
  return (
    <>
      <Section spacing='tight' container='narrow' className='pt-[calc(var(--nav-height)+2rem)]'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='mt-6 h-12 w-full' />
        <Skeleton className='mt-3 h-12 w-2/3' />
        <Skeleton className='mt-6 h-5 w-full' />
        <Skeleton className='mt-2 h-5 w-4/5' />
      </Section>
      <Container width='narrow'>
        <Skeleton className='aspect-[16/9] w-full rounded-none' />
      </Container>
      <Section spacing='tight' container='narrow'>
        <div className='flex flex-col gap-3'>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className={i % 4 === 3 ? 'h-4 w-2/3' : 'h-4 w-full'} />
          ))}
        </div>
      </Section>
    </>
  );
}
