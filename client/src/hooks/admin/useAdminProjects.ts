import { useState, useEffect, useCallback } from 'react';
import * as adminProjectsService from '../../services/admin/projects.service';
import type {
  ProjectResponse,
  CreateProjectInput,
  UpdateProjectInput,
  UploadImagesInput,
  DeleteMainImageInput,
  DeleteImagesInput,
} from '@shirans/shared';

export function useAdminProjects() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setError(null);
    setIsLoading(true);
    adminProjectsService
      .fetchAllProjects()
      .then(setProjects)
      .catch((err) => setError(err?.message ?? 'שגיאה בטעינת הפרויקטים'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: CreateProjectInput) => {
      const created = await adminProjectsService.createProject(input);
      setProjects((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const update = useCallback(
    async (input: UpdateProjectInput) => {
      const updated = await adminProjectsService.updateProject(input);
      setProjects((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      return updated;
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    await adminProjectsService.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const uploadImages = useCallback(
    async (input: UploadImagesInput) => {
      const updated = await adminProjectsService.uploadProjectImages(input);
      setProjects((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      return updated;
    },
    []
  );

  const deleteMainImage = useCallback(
    async (input: DeleteMainImageInput) => {
      await adminProjectsService.deleteMainImage(input);
      await refresh();
    },
    [refresh]
  );

  const deleteProjectImages = useCallback(
    async (input: DeleteImagesInput) => {
      await adminProjectsService.deleteProjectImages(input);
      await refresh();
    },
    [refresh]
  );

  return {
    projects,
    isLoading,
    error,
    refresh,
    create,
    update,
    delete: remove,
    uploadImages,
    deleteMainImage,
    deleteProjectImages,
  };
}
