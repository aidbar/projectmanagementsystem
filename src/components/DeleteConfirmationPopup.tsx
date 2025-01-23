import React, { useState } from "react";
import { Button } from "./ui/button";
import api from "@/api";
import { AxiosError } from "axios";

type DeleteConfirmationPopupProps = {
  onClose: () => void;
  deleteItem: { id: string };
  updateState: () => void;
  itemName: string;
  entity: string;
};

export const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({ onClose, deleteItem, updateState, itemName, entity }) => {
  const [deleteError, setDeleteError] = useState("");

const handleDelete = async () => {
    setDeleteError("");
    try {
        await api.delete(`/v1/${entity}/${deleteItem.id}`);
        updateState();
        onClose();
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
    }
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl mb-4">Confirm Deletion</h2>
        {deleteError && <p className="text-red-500 mb-2 italic">{deleteError}</p>}
        <p className="mb-4">Are you sure you want to delete <strong>{itemName}</strong>?</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </div>
    </div>
  );
};
