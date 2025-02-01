import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/api';

// Define Context
export interface Column {
  id: string;
  title: string;
}

interface ColumnsContextType {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
}

const ColumnsContext = createContext<ColumnsContextType | undefined>(undefined);

// Provider Component
export const ColumnsProvider = ({ children }: { children: ReactNode }) => {
  const [columns, setColumns] = useState<Column[]>([]);

  // Fetch columns data when provider is mounted
  useEffect(() => {
    async function fetchColumns() {
      try {
        const response = await api.get('/Status');
        const columnsData = response.data.data.map((col: any) => ({
          id: col.id,
          title: col.name,
        }));
        setColumns(columnsData);
      } catch (error) {
        console.error('Error fetching columns:', error);
      }
    }
    fetchColumns();
  }, []);

  return (
    <ColumnsContext.Provider value={{ columns, setColumns }}>
      {children}
    </ColumnsContext.Provider>
  );
};

// Custom Hook for Consuming Context
export const useColumns = () => {
  const context = useContext(ColumnsContext);
  if (!context) {
    throw new Error('useColumns must be used within a ColumnsProvider');
  }
  return context;
};
