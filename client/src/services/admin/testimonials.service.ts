import apiClient from '../../utils/apiClient';
import { urls } from '../../constants/urls';
import type {
  TestimonialResponse,
  CreateTestimonialInput,
} from '@shirans/shared';

export async function fetchAllTestimonials(): Promise<TestimonialResponse[]> {
  const { data } = await apiClient.get<TestimonialResponse[]>(
    urls.testimonials.getAll
  );
  return data;
}

export async function createTestimonial(
  input: CreateTestimonialInput
): Promise<TestimonialResponse> {
  const { data } = await apiClient.post<TestimonialResponse>(
    urls.testimonials.create,
    input
  );
  return data;
}

export async function updateTestimonial(
  id: string,
  input: Partial<CreateTestimonialInput>
): Promise<TestimonialResponse> {
  const { data } = await apiClient.put<TestimonialResponse>(
    urls.testimonials.update(id),
    input
  );
  return data;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await apiClient.delete(urls.testimonials.delete(id));
}

export async function updateTestimonialOrder(
  id: string,
  order: number
): Promise<TestimonialResponse> {
  const { data } = await apiClient.patch<TestimonialResponse>(
    urls.testimonials.updateOrder(id),
    { order }
  );
  return data;
}
