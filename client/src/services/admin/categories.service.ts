import apiClient from '../../utils/apiClient';
import { urls } from '../../constants/urls';
import type {
  CategoryResponse,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@shirans/shared';

export async function fetchAllCategories(): Promise<CategoryResponse[]> {
  const { data } = await apiClient.get<CategoryResponse[]>(
    urls.categories.getAll
  );
  return data;
}

export async function createCategory(
  input: CreateCategoryInput
): Promise<CategoryResponse> {
  const { data } = await apiClient.post<CategoryResponse>(
    urls.categories.create,
    input
  );
  return data;
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput
): Promise<CategoryResponse> {
  const { data } = await apiClient.put<CategoryResponse>(
    urls.categories.update(id),
    input
  );
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(urls.categories.delete(id));
}
