import React, { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import api from "../api"
import { Workspace } from "./WorkspacesTable"
import { AxiosError } from "axios"

interface WorkspacePopupProps {
  onClose: () => void
  onCreate: () => void
  workspace?: Workspace /*{
    id: string
    name: string
    description: string
    isPublic: boolean
  }*/
}

export function WorkspacePopup({ onClose, onCreate, workspace }: WorkspacePopupProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameError("")
    try {
      if (workspace) {
        const updatedAt = new Date().toISOString()
        await api.put(`/v1/Workspaces/${workspace.id}`, {
          name,
          description,
          isPublic,
          updatedAt
        })
      } else {
        await api.post("/v1/Workspaces", {
          name,
          description,
          isPublic
        })
      }
      onCreate()
      onClose()
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          setNameError(error.response.data)
        } else {
          setNameError("Workspace edit failed")
        }
      } else {
        setNameError("An error occurred")
      }
      console.error("Error creating/updating workspace:", error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl mb-4">{workspace ? "Edit workspace" : "Create a new workspace"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-sm block mb-1">
              Workspace name <span className="text-red-500">*</span>
            </label>
            {nameError && <p className="text-red-500 mb-2 italic">{nameError}</p>}
            <Input
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
            <label className="text-sm block mb-1">Description</label>
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <Checkbox
              checked={isPublic}
              onCheckedChange={(value) => setIsPublic(!!value)}
            />
            <span className="ml-2">Public</span>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={name.length === 0 || name.length > 200}>
              {workspace ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
