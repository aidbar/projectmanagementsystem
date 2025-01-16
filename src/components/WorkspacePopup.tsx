import React, { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import api from "../api"

interface WorkspacePopupProps {
  onClose: () => void
  onCreate: () => void
}

export function WorkspacePopup({ onClose, onCreate }: WorkspacePopupProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [nameError, setNameError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameError("")
    try {
      //const userId = JSON.parse(localStorage.getItem('userInfo') || '{}').id
      await api.post("/v1/Workspaces", {
        "name": name,
        "description": description,
        "isPublic": isPublic
      })
      onCreate()
      onClose()
    } catch (error) {
      console.error("Error creating workspace:", error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl mb-4">Create a new workspace</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
