import api from "../api"
import { AxiosError } from "axios"
import { ProjectBoard } from "@/components/ProjectBoardsTable"
import { ProjectBoard as ProjectBoardType } from "@/context/ProjectBoardsContext"
import { Dispatch, SetStateAction } from "react"

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

export async function fetchProjectBoardData(id: string): Promise<{ data: ProjectBoardType | null, error: string }> {
  try {
    const response = await api.get(`/ProjectBoards/${id}`)
    return { data: { ...response.data, workspaceId: response.data.workspaceId }, error: "" }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        return { data: null, error: error.response.data }
      } else {
        return { data: null, error: "Error fetching project board data" }
      }
    } else {
      return { data: null, error: "An error occurred" }
    }
  }
}

export async function saveProjectBoardDetails(id: string, projectBoardDetails: Partial<ProjectBoardType> & { workspaceId: string }): Promise<{ data: ProjectBoardType | null, error: string }> {
  try {
    const response = await api.put(`/ProjectBoards/${id}`, projectBoardDetails)
    return { data: response.data.data, error: "" }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        return { data: null, error: error.response.data }
      } else {
        return { data: null, error: "Failed to save changes" }
      }
    } else {
      return { data: null, error: "An error occurred" }
    }
  }
}

export const handleSave = async (
  id: string,
  projectBoardDetails: any,
  setProjectBoardData: Dispatch<SetStateAction<any>>,
  setProjectBoardDetails: Dispatch<SetStateAction<any>>,
  setIsEditing: Dispatch<SetStateAction<any>>,
  setToastMessage: Dispatch<SetStateAction<string>>,
  setToastOpen: Dispatch<SetStateAction<boolean>>,
  setHasError: Dispatch<SetStateAction<boolean>>,
  workspaceId: string
) => {
  setHasError(false);

  if (projectBoardDetails.name.length === 0) {
    console.log("Project board name is required.");
    setHasError(true);
    setToastMessage("Project board name is required.");
    setToastOpen(true);
    return false;
  } else if (projectBoardDetails.name.length > 200) {
    setHasError(true);
    setToastMessage("Project board name must not exceed 200 characters.");
    setToastOpen(true);
    return false;
  }

  const { data, error } = await saveProjectBoardDetails(id, {
    ...projectBoardDetails,
    workspaceId, // Include workspaceId in the request body
  });
  if (error) {
    setToastMessage(error);
    setToastOpen(true);
    return false;
  }

  if (data) {
    console.log("Changes saved:", data);
    setProjectBoardData((prev: ProjectBoard) => ({
      ...prev,
      name: data.name,
      description: data.description,
      isPublic: data.isPublic,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));
    setProjectBoardDetails((prev : ProjectBoard) => ({
      ...prev,
      name: data.name,
      description: data.description,
      isPublic: data.isPublic,
    }));
    setToastMessage("Changes saved");
    setToastOpen(true);
    return true;
  }
  return false;
};
