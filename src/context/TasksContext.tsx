import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/api';
import {Task} from '@/components/ui/task-card';

interface TasksContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (newTask: Task) => void;
  updateTasks: (updatedTasks: Task[]) => void;
  removeTask: (taskId: string) => void;
}

const TasksContext = createContext<TasksContextType>({
  tasks: [],
  setTasks: () => {},
  addTask: () => {},
  updateTasks: () => {},
  removeTask: () => {}
});

export const TasksProvider = ({ children } : {children : ReactNode}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await api.get('/TaskCard');
        const tasksData = response.data.data.map((task : any) => ({
          id: task.id,
          columnId: task.statusId,
          title: task.title,
          description: task.description,
          priorityId: task.priorityId,
          listId: task.listId,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          dueDate: task.dueDate
        }));
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
    fetchTasks();
  }, []);

  const addTask = (newTask : Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTasks = (updatedTasks : Task[]) => {
    setTasks(updatedTasks);
  };

  const removeTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
  };

  return (
    <TasksContext.Provider value={{ tasks, setTasks, addTask, updateTasks, removeTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
