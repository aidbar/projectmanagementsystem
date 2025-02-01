import React, { useState } from "react";
import { Button } from "./ui/button";
import { deleteEntity } from "@/lib/entity-deletion";

type DeleteConfirmationPopupProps = {
  onClose: () => void;
  deleteItem: { id: string };
  updateState: () => void;
  itemName: string;
  entity: string;
  onDelete: (success: boolean) => void;
};

export const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({ onClose, deleteItem, updateState, itemName, entity, onDelete }) => {
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    setDeleteError("");
    const success = await deleteEntity(entity, deleteItem.id, setDeleteError);
    onDelete(success);
    if (success) {
      updateState();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl mb-4">Confirm Deletion</h2>
        {deleteError && <p className="text-red-700 mb-2 italic">{deleteError}</p>}
        <p className="mb-4">Are you sure you want to delete <strong>{itemName}</strong>?</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </div>
    </div>
  );
};
