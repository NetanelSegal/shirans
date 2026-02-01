import { createContext, useContext, ReactNode } from 'react';
import { IProject, projects } from '@/data/shiran.projects';

interface ProjectsContextType {
  projects: IProject[];
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined,
);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ProjectsContext.Provider value={{ projects }}>
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
