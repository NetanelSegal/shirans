import { BACKEND_URL } from '../constants/urls';
import type { ProjectResponse } from '@shirans/shared';

/**
 * Resolves a relative image URL (from the API) to a full URL by prepending BACKEND_URL.
 * Absolute URLs (e.g., Cloudinary, YouTube) are returned as-is.
 */
export function resolveImageUrl(url: string): string {
  if (url.startsWith('http')) return url;
  return `${BACKEND_URL}${url}`;
}

/**
 * Resolves all image URLs in a project response to absolute URLs.
 * Shared between public and admin service layers.
 */
export function resolveProjectImages(project: ProjectResponse): ProjectResponse {
  return {
    ...project,
    mainImage: resolveImageUrl(project.mainImage),
    images: project.images.map(resolveImageUrl),
    plans: project.plans?.map(resolveImageUrl),
    videos: project.videos?.map(resolveImageUrl),
  };
}
