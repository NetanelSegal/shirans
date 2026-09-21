import { Quote } from 'lucide-react';
import type { TestimonialResponse } from '@shirans/shared';
import { EmptyState } from '@/components/DataState';
import { TestimonialsStripSkeleton } from '@/components/skeletons';
import { Card } from '@/components/ui/Card';
import { Carousel } from '@/components/ui/Carousel';
import { useTestimonials } from '@/hooks/useTestimonials';

function TestimonialCard({ name, message }: Pick<TestimonialResponse, 'name' | 'message'>) {
  return (
    <Card as='figure' className='flex h-full flex-col gap-5 p-7 md:p-9'>
      <Quote className='size-8 -scale-x-100 text-accent' strokeWidth={1.25} aria-hidden />
      <blockquote className='flex-1 text-body text-ink'>{message}</blockquote>
      <figcaption className='flex items-center gap-3 text-small font-semibold text-ink-muted'>
        <span aria-hidden className='h-px w-6 bg-accent' />
        {name}
      </figcaption>
    </Card>
  );
}

export default function Testimonials() {
  const { data, isLoading, isError } = useTestimonials();

  if (isLoading) return <TestimonialsStripSkeleton />;

  if (isError || !data?.length) {
    return <EmptyState message={isError ? 'לא ניתן לטעון את המשובים' : 'אין משובים להצגה'} className='my-8' />;
  }

  return (
    <Carousel
      label='המלצות'
      items={data}
      getKey={(testimonial, index) => `${testimonial.name}-${index}`}
      // Room for the card shadow inside the scroller's clip.
      className='[&>ul]:px-1 [&>ul]:py-3'
      itemClassName='basis-[88%] md:basis-[calc(50%-0.75rem)]'
      renderItem={({ name, message }) => <TestimonialCard name={name} message={message} />}
    />
  );
}
