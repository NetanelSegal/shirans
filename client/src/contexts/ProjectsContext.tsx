import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchProjects } from '@/services/projects.service';
import type { ProjectResponse } from '@shirans/shared';

interface ProjectsContextType {
  projects: ProjectResponse[];
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined,
);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = () => {
    setError(null);
    setIsLoading(true);
    fetchProjects()
      .then(setProjects)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const retry = () => loadProjects();

  return (
    <ProjectsContext.Provider value={{ projects, isLoading, error, retry }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
