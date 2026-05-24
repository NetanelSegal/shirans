import apiClient from '../../utils/apiClient';
import { urls } from '../../constants/urls';
import {
  normalizeProjectResponse,
  type LegacyProjectPayload,
  type ProjectResponse,
  type CreateProjectInput,
  type UpdateProjectInput,
  type DeleteMainImageInput,
  type DeleteImagesInput,
  type ReorderImagesInput,
  type UploadImageMetadata,
} from '@shirans/shared';

function normalizeProject(data: LegacyProjectPayload): ProjectResponse {
  return normalizeProjectResponse(data);
}

export async function fetchAllProjects(): Promise<ProjectResponse[]> {
  const { data } = await apiClient.get<LegacyProjectPayload[]>(urls.projects);
  return data.map(normalizeProject);
}

export async function createProject(
  input: CreateProjectInput,
): Promise<ProjectResponse> {
  const { data } = await apiClient.post<LegacyProjectPayload>(urls.projects, input);
  return normalizeProject(data);
}

export async function updateProject(
  input: UpdateProjectInput,
): Promise<ProjectResponse> {
  const { data } = await apiClient.put<LegacyProjectPayload>(
    urls.updateProject,
    input,
  );
  return normalizeProject(data);
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

  const { data } = await apiClient.post<LegacyProjectPayload>(
    urls.uploadImgs,
    formData,
    { timeout: 120_000 },
  );
  return normalizeProject(data);
}

export async function deleteMainImage(
  input: DeleteMainImageInput,
): Promise<ProjectResponse> {
  const { data } = await apiClient.delete<LegacyProjectPayload>(
    urls.deleteMainImage,
    { data: input },
  );
  return normalizeProject(data);
}

export async function deleteProjectImages(
  input: DeleteImagesInput,
): Promise<ProjectResponse> {
  const { data } = await apiClient.delete<LegacyProjectPayload>(
    urls.deleteProjectImages,
    { data: input },
  );
  return normalizeProject(data);
}

export async function reorderImages(
  input: ReorderImagesInput,
): Promise<ProjectResponse> {
  const { data } = await apiClient.patch<LegacyProjectPayload>(
    urls.reorderImages,
    input,
  );
  return normalizeProject(data);
}
