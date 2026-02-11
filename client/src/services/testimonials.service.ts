import apiClient from '../utils/apiClient';
import { urls } from '../constants/urls';
import type { TestimonialResponse } from '@shirans/shared';

export async function fetchPublishedTestimonials(): Promise<TestimonialResponse[]> {
  const { data } = await apiClient.get<TestimonialResponse[]>(urls.testimonials.published);
  return data;
}
