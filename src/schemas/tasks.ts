import { z } from "zod"

export const taskSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  listId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  title: z.string(),
  priorityId: z.string().uuid(),
  dueDate: z.string().datetime(),
  statusId: z.string().uuid(),
  activities: z.array(z.unknown()),
  status: z.null(),
  labels: z.null()
})

export const taskReponseSchema = z.array(taskSchema)

export const taskCreateSchema = taskSchema.omit({ id: true })

export type Task = z.infer<typeof taskSchema>
export type TaskCreate = z.infer<typeof taskCreateSchema>
