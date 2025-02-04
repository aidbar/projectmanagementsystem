import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/api';

interface Workspace {
  id: string;
  isPublic: boolean;
  description: string;
  name: string;
  creatorUserId: string;
}

interface WorkspacesContextType {
  workspaces: Workspace[];
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
  fetchWorkspaces: () => void;
  loading: boolean;
}

const WorkspacesContext = createContext<WorkspacesContextType | undefined>(undefined);

export const WorkspacesProvider = ({ children }: { children: ReactNode }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('userInfo') || '{}').id;
      const response = await api.get(`/Workspaces/user/${userId}`);
      console.log('Workspaces:', response.data);
      setWorkspaces(response.data);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <WorkspacesContext.Provider value={{ workspaces, setWorkspaces, fetchWorkspaces, loading }}>
      {children}
    </WorkspacesContext.Provider>
  );
};

export const useWorkspaces = () => {
  const context = useContext(WorkspacesContext);
  if (!context) {
    throw new Error('useWorkspaces must be used within a WorkspacesProvider');
  }
  return context;
};
