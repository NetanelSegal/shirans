import apiClient from '../utils/apiClient';
import { urls } from '../constants/urls';
import { USE_FILE_DATA } from '../constants/dataSource';
import { fetchWithFallback } from '../utils/fetchWithFallback';
import {
  normalizeProjectResponse,
  type LegacyProjectPayload,
  type ProjectResponse,
} from '@shirans/shared';

async function getFileProjects(): Promise<ProjectResponse[]> {
  const { projects } = await import('../data/shiran.projects');
  return projects;
}

/** When the API sent the project; it does, though the shared type leaves it out. */
const createdAt = (project: LegacyProjectPayload) =>
  (project as LegacyProjectPayload & { createdAt?: string }).createdAt ?? '';

/**
 * Newest first, so the latest project (Greece, 23.9.2026) leads the home page
 * and the projects page. The server sorts the same way, but this also holds
 * while a server change waits to deploy.
 */
function normalizeProjects(projects: LegacyProjectPayload[]): ProjectResponse[] {
  return [...projects]
    .sort((a, b) => createdAt(b).localeCompare(createdAt(a)))
    .map(normalizeProjectResponse);
}

export async function fetchProjects(): Promise<ProjectResponse[]> {
  if (USE_FILE_DATA) {
    return getFileProjects();
  }
  const { data } = await fetchWithFallback(
    async () => {
      const res = await apiClient.get<LegacyProjectPayload[]>(urls.projects);
      return normalizeProjects(res.data);
    },
    await getFileProjects(),
  );
  return data;
}

export async function fetchFavouriteProjects(): Promise<ProjectResponse[]> {
  if (USE_FILE_DATA) {
    const projects = await getFileProjects();
    return projects.filter((p) => p.favourite);
  }
  const fallback = (await getFileProjects()).filter((p) => p.favourite);
  const { data } = await fetchWithFallback(async () => {
    const res = await apiClient.get<LegacyProjectPayload[]>(urls.favProjects);
    return normalizeProjects(res.data);
  }, fallback);
  return data;
}

export async function fetchProject(id: string): Promise<ProjectResponse> {
  if (USE_FILE_DATA) {
    const projects = await getFileProjects();
    const project = projects.find((p) => p.id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }
  const fallbackProjects = await getFileProjects();
  const fallback = fallbackProjects.find((p) => p.id === id);
  if (!fallback) {
    const { data } = await apiClient.get<LegacyProjectPayload>(
      urls.singleProject,
      {
        params: { id },
      },
    );
    return normalizeProjectResponse(data);
  }
  const { data } = await fetchWithFallback(async () => {
    const res = await apiClient.get<LegacyProjectPayload>(urls.singleProject, {
      params: { id },
    });
    return normalizeProjectResponse(res.data);
  }, fallback);
  return data;
}
