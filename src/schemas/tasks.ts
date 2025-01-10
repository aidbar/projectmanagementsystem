import { z } from "zod"

export const taskSchema = z.object({
  id: z.number(),
  completed: z.boolean(),
  title: z.string(),
  userId: z.number()
})

export const taskReponseSchema = z.array(taskSchema)

export const taskCreateSchema = taskSchema.omit({ id: true })

export type Task = z.infer<typeof taskSchema>
export type TaskCreate = z.infer<typeof taskCreateSchema>
