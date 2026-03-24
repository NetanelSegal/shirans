import { useQuery } from '@tanstack/react-query';
import { fetchPublishedTestimonials } from '@/services/testimonials.service';
import { queryKeys } from '@/constants/queryKeys';
import type { TestimonialResponse } from '@shirans/shared';

export function useTestimonials() {
  return useQuery<TestimonialResponse[]>({
    queryKey: queryKeys.testimonials,
    queryFn: fetchPublishedTestimonials,
  });
}
