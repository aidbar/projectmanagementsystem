import api from "@/api";
import { Task } from "@/components/ui/task-card";
import { ColumnId } from "@/components/KanbanBoard";

export const updateTaskColumnCard = async (taskId: string, newColumnId: ColumnId, task: Task) => {
  try {
    await api.put(`/TaskCard/${taskId}`, {
      statusId: newColumnId,
      title: task.title,
      description: task.description,
      priorityId: task.priorityId,
      dueDate: task.dueDate,
    });
  } catch (error) {
    console.error("Error updating task column:", error);
  }
};

export const createTask = async (taskData: any) => {
  try {
    const response = await api.post('/TaskCard', taskData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const fetchTasks = async () => {
  try {
    const response = await api.get('/TaskCard');
    return response.data.data.map((task: any) => ({
      id: task.id,
      columnId: task.statusId,
      title: task.title,
      description: task.description,
      priorityId: task.priorityId,
      listId: task.listId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      dueDate: task.dueDate,
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};
