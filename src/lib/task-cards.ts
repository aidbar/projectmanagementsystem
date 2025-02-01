import type { UniqueIdentifier } from "@dnd-kit/core"
import { ColumnId } from "@/components/KanbanBoard"
import api from "@/api"
import { Task } from "@/components/ui/task-card"

export const updateTaskColumn = async (taskId: UniqueIdentifier, newColumnId: ColumnId, task: Task) => {
  try {
    await api.put(`/TaskCard/${taskId}`, { statusId: newColumnId, title: task.title, description: task.description, priorityId: task.priorityId, dueDate: task.dueDate });
  } catch (error) {
    console.error("Error updating task column:", error);
  }
};
