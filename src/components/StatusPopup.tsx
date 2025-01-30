import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import api from "../api"
import { useColumns } from "@/context/ColumnsContext"
import { Column } from "./ui/board-column"

export function StatusPopup({ onClose, column }: { onClose: () => void, column?: Column }) {
  const [statusName, setStatusName] = useState(column?.title || "")
  const { setColumns } = useColumns()

  const handleSave = async () => {
    try {
      if (column) {
        // Edit existing column
        const updatedColumn = { id: column.id.toString(), name: statusName }
        const response = await api.put(`/Status/${column.id}`, updatedColumn)

        if (response.status >= 200 && response.status < 300) {
          setColumns((prevColumns) =>
        prevColumns.map((col) => (col.id === column.id ? { ...col, title: statusName } : col))
          )
          onClose()
        } else {
          console.error("Failed to update the status column")
        }
      } else {
        // Create new column
        const newStatus = {
          id: crypto.randomUUID().toString(),
          name: statusName
        }
        const response = await api.post('/Status', newStatus)

        if (response.status >= 200 && response.status < 300) {
          setColumns((prevColumns) => [...prevColumns, { id: newStatus.id, title: newStatus.name }])
          onClose()
        } else {
          console.error("Failed to save the new status column")
        }
      }
    } catch (error) {
      console.error("Error saving the status column", error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg" role="dialog" aria-labelledby="status-popup-title">
        <h2 id="status-popup-title" className="text-xl mb-4">{column ? "Edit status column" : "New status column"}</h2>
        <label className="text-sm block mb-1" htmlFor="status-name-input">
          Status name <span className="text-red-700">*</span>
        </label>
        <Input
          id="status-name-input"
          type="text"
          value={statusName}
          onChange={(e) => setStatusName(e.target.value)}
          placeholder="Enter status name"
          className="border p-2 mb-4 w-full"
          aria-label="Status name"
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant={"secondary"} aria-label="Cancel">Cancel</Button>
          <Button onClick={handleSave} disabled={!statusName} aria-label="Save">Save</Button>
        </div>
      </div>
    </div>
  )
}
