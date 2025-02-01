import api from "../api"
import { Column } from "../components/ui/board-column"
import { Column as ColumnType } from "@/context/ColumnsContext"

export async function saveStatus(column: Column | undefined, statusName: string, setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>): Promise<boolean> {
  try {
    if (column) {
      // Edit existing column
      const updatedColumn = { id: column.id.toString(), name: statusName }
      const response = await api.put(`/Status/${column.id}`, updatedColumn)

      if (response.status >= 200 && response.status < 300) {
        setColumns((prevColumns) =>
          prevColumns.map((col) => (col.id === column.id ? { ...col, title: statusName } : col))
        )
        return true
      } else {
        console.error("Failed to update the status column")
        return false
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
        return true
      } else {
        console.error("Failed to save the new status column")
        return false
      }
    }
  } catch (error) {
    console.error("Error saving the status column", error)
    return false
  }
}
