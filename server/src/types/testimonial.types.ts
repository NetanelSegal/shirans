// Re-export shared types for convenience
export type { TestimonialResponse } from '@shirans/shared';

export interface TestimonialRequest {
  name: string;
  message: string;
  isPublished?: boolean;
  order?: number;
}

export interface UpdateTestimonialInput {
  id: string;
  name?: string;
  message?: string;
  isPublished?: boolean;
  order?: number;
}

export interface TestimonialFilters {
  isPublished?: boolean;
}
