import apiClient from '../utils/apiClient';
import { urls } from '../constants/urls';
import { resolveImageUrl } from '../utils/imageUrl';
import type { ProjectResponse } from '@shirans/shared';

/**
 * Resolves all image URLs in a project response from relative server paths
 * to full absolute URLs.
 */
function resolveProjectImages(project: ProjectResponse): ProjectResponse {
  return {
    ...project,
    mainImage: typeof project.mainImage === 'string'
      ? resolveImageUrl(project.mainImage)
      : project.mainImage,
    images: project.images.map((img) =>
      typeof img === 'string' ? resolveImageUrl(img) : img,
    ),
    plans: project.plans?.map((plan) =>
      typeof plan === 'string' ? resolveImageUrl(plan) : plan,
    ),
    // Videos are already absolute YouTube URLs, no resolution needed
  };
}

export async function fetchProjects(): Promise<ProjectResponse[]> {
  const { data } = await apiClient.get<ProjectResponse[]>(urls.projects);
  return data.map(resolveProjectImages);
}

export async function fetchFavouriteProjects(): Promise<ProjectResponse[]> {
  const { data } = await apiClient.get<ProjectResponse[]>(urls.favProjects);
  return data.map(resolveProjectImages);
}

export async function fetchProject(id: string): Promise<ProjectResponse> {
  const { data } = await apiClient.get<ProjectResponse>(urls.singleProject, {
    params: { id },
  });
  return resolveProjectImages(data);
}
