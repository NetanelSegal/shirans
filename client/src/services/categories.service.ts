import apiClient from '../utils/apiClient';
import { urls } from '../constants/urls';
import { USE_FILE_DATA } from '../constants/dataSource';
import type { CategoryResponse } from '@shirans/shared';

async function getFileCategories(): Promise<CategoryResponse[]> {
  const { categories } = await import('../data/shiran.categories');
  return categories.map((cat) => ({
    ...cat,
    createdAt: '',
    updatedAt: '',
  }));
}

export async function fetchCategories(): Promise<CategoryResponse[]> {
  if (USE_FILE_DATA) {
    return getFileCategories();
  }
  const { data } = await apiClient.get<CategoryResponse[]>(urls.categories.getAll);
  return data;
}
