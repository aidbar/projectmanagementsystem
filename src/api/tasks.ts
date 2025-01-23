import api from "."
import { Task } from "src/components/ui/task-card"
import { taskReponseSchema } from "../schemas/tasks"

export default {
  findAll: async (): Promise<Task[]> => {
    const res = await api.get("/v1/TaskCard")

    const validatedTasks = taskReponseSchema.safeParse(res.data.data)
    console.log("validatedTasks:", validatedTasks)

    if (!validatedTasks.success) {
      throw new Error("Validation failed")
    }

    const mappedTasks = validatedTasks.data.map((task) => ({
      id: task.id,
      columnId: task.statusId, // Map statusId to columnId
      title: task.title,
      description: task.description,
      listId: task.listId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      priorityId: task.priorityId,
      dueDate: task.dueDate,
      /*activities: task.activities,
      status: task.status,
      labels: task.labels*/
    }))

    return mappedTasks as Task[]
  }
}
