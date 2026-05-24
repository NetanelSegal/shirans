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

function normalizeProjects(projects: LegacyProjectPayload[]): ProjectResponse[] {
  return projects.map(normalizeProjectResponse);
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
