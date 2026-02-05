import { Testimonial } from '@prisma/client';

export interface TestimonialRequest {
  name: string;
  message: string;
  isPublished?: boolean;
  order?: number;
}

export interface TestimonialResponse {
  id: string;
  name: string;
  message: string;
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateTestimonialInput extends Partial<TestimonialRequest> {
  id: string;
}

export interface TestimonialFilters {
  isPublished?: boolean;
}
