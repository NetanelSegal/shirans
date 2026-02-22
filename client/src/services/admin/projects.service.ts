import apiClient from '../../utils/apiClient';
import { urls } from '../../constants/urls';
import { resolveImageUrl } from '../../utils/imageUrl';
import type {
  ProjectResponse,
  CreateProjectInput,
  UpdateProjectInput,
  UploadImagesInput,
  DeleteMainImageInput,
  DeleteImagesInput,
} from '@shirans/shared';

function resolveProjectImages(project: ProjectResponse): ProjectResponse {
  return {
    ...project,
    mainImage:
      typeof project.mainImage === 'string'
        ? resolveImageUrl(project.mainImage)
        : project.mainImage,
    images: project.images.map((img) =>
      typeof img === 'string' ? resolveImageUrl(img) : img,
    ),
    plans: project.plans?.map((plan) =>
      typeof plan === 'string' ? resolveImageUrl(plan) : plan,
    ),
  };
}

export async function fetchAllProjects(): Promise<ProjectResponse[]> {
  const { data } = await apiClient.get<ProjectResponse[]>(urls.projects);
  return data.map(resolveProjectImages);
}

export async function createProject(
  input: CreateProjectInput
): Promise<ProjectResponse> {
  const { data } = await apiClient.post<ProjectResponse>(urls.projects, input);
  return resolveProjectImages(data);
}

export async function updateProject(
  input: UpdateProjectInput
): Promise<ProjectResponse> {
  const { data } = await apiClient.put<ProjectResponse>(
    urls.updateProject,
    input
  );
  return resolveProjectImages(data);
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(urls.projects, { data: { id } });
}

export async function uploadProjectImages(
  input: UploadImagesInput
): Promise<ProjectResponse> {
  const { data } = await apiClient.post<ProjectResponse>(
    urls.uploadImgs,
    input
  );
  return resolveProjectImages(data);
}

export async function deleteMainImage(
  input: DeleteMainImageInput
): Promise<void> {
  await apiClient.delete(urls.deleteMainImage, { data: input });
}

export async function deleteProjectImages(
  input: DeleteImagesInput
): Promise<void> {
  await apiClient.delete(urls.deleteProjectImages, { data: input });
}
