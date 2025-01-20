import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import api from "../api"

export function StatusPopup({ onClose }: { onClose: () => void }) {
  const [statusName, setStatusName] = useState("")

  const handleSave = async () => {
    try {
      const response = await api.post('/Status', {
        id: crypto.randomUUID(),
        name: statusName
      });

    if (response.status >= 200 && response.status < 300) {
        console.log("New status column:", statusName);
        onClose();
      } else {
        console.error("Failed to save the new status column");
      }
    } catch (error) {
      console.error("Error saving the new status column", error);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl mb-4">New status column</h2>
        <Input
          type="text"
          value={statusName}
          onChange={(e) => setStatusName(e.target.value)}
          placeholder="Enter status name"
          className="border p-2 mb-4 w-full"
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant={"secondary"}>Cancel</Button>
          <Button onClick={handleSave} disabled={!statusName}>Save</Button>
        </div>
      </div>
    </div>
  )
}
