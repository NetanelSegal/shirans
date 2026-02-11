import apiClient from '../utils/apiClient';
import { urls } from '../constants/urls';
import type { CategoryResponse } from '@shirans/shared';

export async function fetchCategories(): Promise<CategoryResponse[]> {
  const { data } = await apiClient.get<CategoryResponse[]>(urls.categories.getAll);
  return data;
}
