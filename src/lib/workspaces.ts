import api from "@/api";
import { AxiosError } from "axios";
import { Workspace } from "@/components/WorkspacesTable";
import { Dispatch, SetStateAction } from "react";

export const fetchWorkspaceData = async (
  id: string,
  setWorkspaceData: Dispatch<SetStateAction<any>>,
  setWorkspaceDetails: Dispatch<SetStateAction<any>>,
  setFetchError: Dispatch<SetStateAction<string>>,
  setToastMessage: Dispatch<SetStateAction<string>>,
  setToastOpen: Dispatch<SetStateAction<boolean>>
) => {
  setFetchError('');
  try {
    const response = await api.get(`/Workspaces/${id}`);
    setWorkspaceData(response.data);
    setWorkspaceDetails(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        setFetchError(error.response.data);
      } else {
        setFetchError('Error fetching workspace data');
      }
    } else {
      setFetchError('An error occurred');
    }
    console.error('Failed to fetch workspace data:', error);
    setToastMessage('Error fetching workspace data');
    setToastOpen(true);
  }
};

export const handleSave = async (
  id: string,
  workspaceDetails: any,
  setWorkspaceData: Dispatch<SetStateAction<any>>,
  setWorkspaceDetails: Dispatch<SetStateAction<any>>,
  setIsEditing: Dispatch<SetStateAction<any>>,
  setToastMessage: Dispatch<SetStateAction<string>>,
  setToastOpen: Dispatch<SetStateAction<boolean>>,
  setHasError: Dispatch<SetStateAction<boolean>>
) => {
  setHasError(false);

  try {
    if (workspaceDetails.name.length === 0) {
      setHasError(true);
      setToastMessage("Workspace name is required.");
      setToastOpen(true);
      return false;
    } else if (workspaceDetails.name.length > 200) {
      setHasError(true);
      setToastMessage("Workspace name must not exceed 200 characters.");
      setToastOpen(true);
      return false;
    }

    const response = await api.put(`/Workspaces/${id}`, {
      ...workspaceDetails,
    });
    const data = response.data.data;
    console.log("Changes saved:", data);
    setWorkspaceData((prev: Workspace) => ({
      ...prev,
      name: data.name,
      description: data.description,
      isPublic: data.isPublic,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      creatorUsername: data.creatorUsername || prev.creatorUserId,
    }));
    setWorkspaceDetails((prev : Workspace) => ({
      ...prev,
      name: data.name,
      description: data.description,
      isPublic: data.isPublic,
    }));
    setToastMessage("Changes saved");
    setToastOpen(true);
    return true;
  } catch (error) {
    console.error("Error saving changes:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        setToastMessage(error.response.data);
      } else {
        setToastMessage("Failed to save changes");
      }
    } else {
      setToastMessage("An error occurred");
    }
    setToastOpen(true);
    return false;
  }
};

export const handleCreateOrEdit = (
  success: boolean,
  isEdit: boolean,
  setToastMessage: Dispatch<SetStateAction<string>>,
  setToastOpen: Dispatch<SetStateAction<boolean>>,
  projectBoardsTableRef: React.RefObject<any>
) => {
  setToastMessage(success ? (isEdit ? "Changes saved" : "Project board created") : (isEdit ? "Failed to save changes" : "Failed to create project board"));
  setToastOpen(true);
  projectBoardsTableRef.current?.fetchData();
};

export const updateWorkspace = async (workspace: Workspace, name: string, description: string, isPublic: boolean) => {
  try {
    const updatedAt = new Date().toISOString();
    await api.put(`/Workspaces/${workspace.id}`, {
      name,
      description,
      isPublic,
      updatedAt
    });
    return { success: true, updatedAt };
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      return { success: false, error: error.response.data };
    }
    return { success: false, error: "Workspace edit failed" };
  }
};

export const createWorkspace = async (name: string, description: string, isPublic: boolean) => {
  try {
    const response = await api.post("/Workspaces", {
      name,
      description,
      isPublic
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      return { success: false, error: error.response.data };
    }
    return { success: false, error: "An error occurred" };
  }
};

export const handleSubmit = async (
  e: React.FormEvent,
  workspace: Workspace | undefined,
  name: string,
  description: string,
  isPublic: boolean,
  setNameError: Dispatch<SetStateAction<string>>,
  setWorkspaces: Dispatch<SetStateAction<Workspace[]>>,
  onCreate: (success: boolean, isEdit: boolean) => void,
  onClose: () => void
) => {
  e.preventDefault();
  setNameError("");
  try {
    if (workspace) {
      const result = await updateWorkspace(workspace, name, description, isPublic);
      if (result.success) {
        setWorkspaces(prev => prev.map(w => w.id === workspace.id ? { ...w, name, description, isPublic, updatedAt: result.updatedAt } : w));
        onCreate(true, true);
      } else {
        setNameError(result.error);
        onCreate(false, true);
      }
    } else {
      const result = await createWorkspace(name, description, isPublic);
      if (result.success) {
        setWorkspaces(prev => [...prev, result.data]);
        onCreate(true, false);
      } else {
        setNameError(result.error);
        onCreate(false, false);
      }
    }
    onClose();
  } catch (error) {
    setNameError("An error occurred");
    onCreate(false, !!workspace);
    console.error("Error creating/updating workspace:", error);
  }
};
