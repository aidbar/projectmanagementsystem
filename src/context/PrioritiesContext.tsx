import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/api';

// Define Context
interface Priority {
  id: string;
  name: string;
}

interface PrioritiesContextType {
  priorities: Priority[];
  setPriorities: React.Dispatch<React.SetStateAction<Priority[]>>;
}

const PrioritiesContext = createContext<PrioritiesContextType | undefined>(undefined);

// Provider Component
export const PrioritiesProvider = ({ children }: { children: ReactNode }) => {
  const [priorities, setPriorities] = useState<Priority[]>([]);

  // Fetch priorities data when provider is mounted
  useEffect(() => {
    async function fetchPriorities() {
      try {
        const response = await api.get('/Priority');
        const prioritiesData = response.data.data.map((priority: any) => ({
          id: priority.id,
          name: priority.name,
        }));
        setPriorities(prioritiesData);
      } catch (error) {
        console.error('Error fetching priorities:', error);
      }
    }
    fetchPriorities();
  }, []);

  return (
    <PrioritiesContext.Provider value={{ priorities, setPriorities }}>
      {children}
    </PrioritiesContext.Provider>
  );
};

// Custom Hook for Consuming Context
export const usePriorities = () => {
  const context = useContext(PrioritiesContext);
  if (!context) {
    throw new Error('usePriorities must be used within a PrioritiesProvider');
  }
  return context;
};
