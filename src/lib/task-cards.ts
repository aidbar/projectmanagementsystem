import type { UniqueIdentifier } from "@dnd-kit/core"
import { ColumnId } from "@/components/KanbanBoard"
import api from "@/api"
import { Task } from "@/components/ui/task-card"

export const updateTaskColumnCard = async (taskId: UniqueIdentifier, newColumnId: ColumnId, task: Task) => {
  try {
    await api.put(`/TaskCard/${taskId}`, { statusId: newColumnId, title: task.title, description: task.description, priorityId: task.priorityId, dueDate: task.dueDate });
  } catch (error) {
    console.error("Error updating task column:", error);
  }
};

export const saveTaskChanges = async (taskId: UniqueIdentifier, taskDetails: Task, date: Date) => {
  try {
    const response = await api.put(`/TaskCard/${taskId}`, {
      description: taskDetails.description,
      title: taskDetails.title,
      priorityId: taskDetails.priorityId,
      dueDate: date.toISOString(),
      statusId: taskDetails.columnId
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error saving changes:", error);
    return { success: false, error };
  }
};
