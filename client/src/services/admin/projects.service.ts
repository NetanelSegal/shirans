import apiClient from '../../utils/apiClient';
import { urls } from '../../constants/urls';
import type {
  ProjectResponse,
  CreateProjectInput,
  UpdateProjectInput,
  DeleteMainImageInput,
  DeleteImagesInput,
  ReorderImagesInput,
  UploadImageMetadata,
} from '@shirans/shared';

export async function fetchAllProjects(): Promise<ProjectResponse[]> {
  const { data } = await apiClient.get<ProjectResponse[]>(urls.projects);
  return data;
}

export async function createProject(
  input: CreateProjectInput,
): Promise<ProjectResponse> {
  const { data } = await apiClient.post<ProjectResponse>(urls.projects, input);
  return data;
}

export async function updateProject(
  input: UpdateProjectInput,
): Promise<ProjectResponse> {
  const { data } = await apiClient.put<ProjectResponse>(
    urls.updateProject,
    input,
  );
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(urls.projects, { data: { id } });
}

export interface UploadProjectImagesInput {
  projectId: string;
  files: File[];
  metadata: UploadImageMetadata[];
}

export async function uploadProjectImages(
  input: UploadProjectImagesInput,
): Promise<ProjectResponse> {
  const formData = new FormData();
  formData.append('id', input.projectId);
  input.files.forEach((f) => formData.append('files', f));
  formData.append('metadata', JSON.stringify(input.metadata));

  const { data } = await apiClient.post<ProjectResponse>(
    urls.uploadImgs,
    formData,
    { timeout: 120_000 },
  );
  return data;
}

export async function deleteMainImage(
  input: DeleteMainImageInput,
): Promise<void> {
  await apiClient.delete(urls.deleteMainImage, { data: input });
}

export async function deleteProjectImages(
  input: DeleteImagesInput,
): Promise<void> {
  await apiClient.delete(urls.deleteProjectImages, { data: input });
}

export async function reorderImages(
  input: ReorderImagesInput,
): Promise<ProjectResponse> {
  const { data } = await apiClient.patch<ProjectResponse>(
    urls.reorderImages,
    input,
  );
  return data;
}
