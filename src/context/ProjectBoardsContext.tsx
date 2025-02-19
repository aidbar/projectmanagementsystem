import React, { createContext, useContext, useState, ReactNode } from 'react';
import api from '@/api';

export interface ProjectBoard {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  creatorUserId: string;
}

interface ProjectBoardsContextType {
  projectBoards: ProjectBoard[];
  setProjectBoards: React.Dispatch<React.SetStateAction<ProjectBoard[]>>;
  fetchProjectBoards: (workspaceId: string) => void;
  loading: boolean;
}

const ProjectBoardsContext = createContext<ProjectBoardsContextType | undefined>(undefined);

export const ProjectBoardsProvider = ({ children }: { children: ReactNode }) => {
  const [projectBoards, setProjectBoards] = useState<ProjectBoard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjectBoards = async (workspaceId: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/ProjectBoards/workspace/${workspaceId}`);
      setProjectBoards(response.data);
    } catch (error) {
      console.error('Error fetching project boards:', error);
      setProjectBoards([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectBoardsContext.Provider value={{ projectBoards, setProjectBoards, fetchProjectBoards, loading }}>
      {children}
    </ProjectBoardsContext.Provider>
  );
};

export const useProjectBoards = () => {
  const context = useContext(ProjectBoardsContext);
  if (!context) {
    throw new Error('useProjectBoards must be used within a ProjectBoardsProvider');
  }
  return context;
};
