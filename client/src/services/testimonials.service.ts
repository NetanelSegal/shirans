import apiClient from '../utils/apiClient';
import { urls } from '../constants/urls';
import { USE_FILE_DATA } from '../constants/dataSource';
import { fetchWithFallback } from '../utils/fetchWithFallback';
import type { TestimonialResponse } from '@shirans/shared';

async function getFileTestimonials(): Promise<TestimonialResponse[]> {
  const { fallbackTestimonials } = await import('../data/shiran.testimonials');
  return fallbackTestimonials.map((t, i) => ({
    id: `fallback-${i}`,
    name: t.name,
    message: t.message,
    isPublished: true,
    order: i,
    createdAt: '',
    updatedAt: '',
  }));
}

export async function fetchPublishedTestimonials(): Promise<TestimonialResponse[]> {
  if (USE_FILE_DATA) {
    return getFileTestimonials();
  }
  const { data } = await fetchWithFallback(
    () =>
      apiClient
        .get<TestimonialResponse[]>(urls.testimonials.published)
        .then((r) => r.data),
    await getFileTestimonials(),
  );
  return data;
}
