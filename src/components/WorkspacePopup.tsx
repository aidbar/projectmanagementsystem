import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import { Workspace } from "./WorkspacesTable"
import { useWorkspaces } from "@/context/WorkspacesContext"
import { handleSubmit } from "@/lib/workspaces"

interface WorkspacePopupProps {
  onClose: () => void
  onCreate: (success: boolean, isEdit: boolean) => void
  workspace?: Workspace
}

export function WorkspacePopup({ onClose, onCreate, workspace }: WorkspacePopupProps) {
  const { setWorkspaces } = useWorkspaces()
  const [name, setName] = useState(workspace?.name || "")
  const [description, setDescription] = useState(workspace?.description || "")
  const [isPublic, setIsPublic] = useState(workspace?.isPublic || false)
  const [nameError, setNameError] = useState("")

  useEffect(() => {
    if (workspace) {
      setName(workspace.name)
      setDescription(workspace.description)
      setIsPublic(workspace.isPublic)
    }
  }, [workspace])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" aria-label="Workspace Popup">
      <div className="bg-white p-6 rounded-md shadow-md" role="dialog" aria-labelledby="workspace-dialog-title">
        <h2 id="workspace-dialog-title" className="text-xl mb-4">{workspace ? "Edit workspace" : "Create a new workspace"}</h2>
        <form onSubmit={(e) => handleSubmit(e, workspace, name, description, isPublic, setNameError, setWorkspaces, onCreate, onClose)}>
          <div className="mb-4">
            <label className="text-sm block mb-1" htmlFor="workspace-name-input">
              Workspace name <span className="text-red-700">*</span>
            </label>
            {nameError && <p className="text-red-700 mb-2 italic">{nameError}</p>}
            <Input
              id="workspace-name-input"
              placeholder="Workspace name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                if (name.length === 0) {
                  setNameError("Workspace name is required.")
                } else if (name.length > 200) {
                  setNameError("Workspace name must not exceed 200 characters.")
                } else {
                  setNameError("")
                } 
              }}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-sm block mb-1" htmlFor="workspace-description-input">Description</label>
            <Input
              id="workspace-description-input"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <Checkbox
              id="public-checkbox"
              checked={isPublic}
              onCheckedChange={(value) => setIsPublic(!!value)}
              aria-label="Public"
            />
            <span className="ml-2" id="public-label">Public</span>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} aria-label="Cancel">
              Cancel
            </Button>
            <Button type="submit" disabled={name.length === 0 || name.length > 200} aria-label={workspace ? "Save" : "Create"}>
              {workspace ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
