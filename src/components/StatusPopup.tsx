import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useColumns } from "@/context/ColumnsContext"
import { Column } from "./ui/board-column"
import { handleSave } from "../lib/status"

export function StatusPopup({ onClose, column }: { onClose: () => void, column?: Column }) {
  const [statusName, setStatusName] = useState(column?.title || "")
  const { setColumns } = useColumns()

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
          <Button onClick={() => handleSave(column, statusName, setColumns, onClose)} disabled={!statusName} aria-label="Save">Save</Button>
        </div>
      </div>
    </div>
  )
}
