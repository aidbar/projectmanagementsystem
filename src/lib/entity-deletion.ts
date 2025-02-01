import api from "@/api";
import { AxiosError } from "axios";

export const deleteEntity = async (entity: string, id: string, setDeleteError: (error: string) => void): Promise<boolean> => {
  try {
    await api.delete(`/${entity}/${id}`);
    return true;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        setDeleteError(error.response.data);
      } else {
        setDeleteError("Error deleting item");
      }
    } else {
      setDeleteError("An error occurred");
    }
    console.error("Error deleting item:", error);
    return false;
  }
};
