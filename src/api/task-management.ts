import { useQuery } from "@tanstack/react-query"

import TaskService from "./tasks"
import { Task } from "src/components/ui/task-card"

const QUERY_KEY = "tasks"
export function taskQueryKey(id?: string) {
  if (id) {
    return [QUERY_KEY, id]
  }

  return [QUERY_KEY]
}

export function useTasksFindAll() {
  const { isPending, data, error } = useQuery<Task[]>({
    queryKey: taskQueryKey(),
    queryFn: TaskService.findAll
  })

  return {
    isPending,
    tasks: data ?? [],
    error
  }
}
