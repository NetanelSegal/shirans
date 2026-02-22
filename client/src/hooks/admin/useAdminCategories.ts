import { useState, useEffect, useCallback } from 'react';
import * as adminCategoriesService from '../../services/admin/categories.service';
import type {
  CategoryResponse,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@shirans/shared';

export function useAdminCategories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setError(null);
    setIsLoading(true);
    adminCategoriesService
      .fetchAllCategories()
      .then(setCategories)
      .catch((err) => setError(err?.message ?? 'שגיאה בטעינת הקטגוריות'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: CreateCategoryInput) => {
      const created = await adminCategoriesService.createCategory(input);
      setCategories((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const update = useCallback(
    async (id: string, input: UpdateCategoryInput) => {
      const updated = await adminCategoriesService.updateCategory(id, input);
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      return updated;
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    await adminCategoriesService.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    categories,
    isLoading,
    error,
    refresh,
    create,
    update,
    delete: remove,
  };
}
