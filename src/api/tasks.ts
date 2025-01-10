import api from "."
import { Task } from "src/components/ui/task-card"
import { taskReponseSchema } from "../schemas/tasks"

export default {
  findAll: async (): Promise<Task[]> => {
    const res = await api.get("https://jsonplaceholder.typicode.com/todos")

    const validatedTasks = taskReponseSchema.safeParse(res.data)
    console.log("validatedTasks:", validatedTasks)

    if (!validatedTasks.success) {
      throw new Error("Validation failed")
    }

    const mappedTasks = validatedTasks.data.map((task) => ({
      id: task.id,
      columnId: task.completed ? "done" : "WIP",
      content: task.title
    }))

    return mappedTasks as Task[]
  }
}
