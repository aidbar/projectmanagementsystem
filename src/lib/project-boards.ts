import api from "../api"
import { AxiosError } from "axios"
import { ProjectBoard } from "@/components/ProjectBoardsTable"
import { ProjectBoard as ProjectBoardType } from "@/context/ProjectBoardsContext"

interface CreateOrUpdateProjectBoardParams {
  projectBoard?: ProjectBoard
  name: string
  description: string
  isPublic: boolean
  workspaceId: string
  setProjectBoards: React.Dispatch<React.SetStateAction<ProjectBoardType[]>>
}

export async function createOrUpdateProjectBoard({
  projectBoard,
  name,
  description,
  isPublic,
  workspaceId,
  setProjectBoards,
}: CreateOrUpdateProjectBoardParams): Promise<{ success: boolean, error?: string }> {
  try {
    if (projectBoard) {
      const updatedAt = new Date().toISOString()
      await api.put(`/ProjectBoards/${projectBoard.id}`, {
        name,
        description,
        isPublic,
        updatedAt,
        workspaceId
      })
      setProjectBoards(prev => prev.map(pb => pb.id === projectBoard.id ? { ...pb, name, description, isPublic, updatedAt } : pb))
      return { success: true }
    } else {
      const newProjectBoard = await api.post("/ProjectBoards", {
        name,
        description,
        isPublic,
        workspaceId
      })
      setProjectBoards(prev => [...prev, newProjectBoard.data])
      return { success: true }
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        return { success: false, error: error.response.data }
      } else {
        return { success: false, error: "ProjectBoard edit failed" }
      }
    } else {
      return { success: false, error: "An error occurred" }
    }
  }
}
