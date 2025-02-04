import React, { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import { ProjectBoard } from "./ProjectBoardsTable"
import { useProjectBoards } from "@/context/ProjectBoardsContext"
import { createOrUpdateProjectBoard } from "../lib/project-boards" 

interface ProjectBoardPopupProps {
  onClose: () => void
  onCreate: (success: boolean, isEdit: boolean) => void
  projectBoard?: ProjectBoard
  workspaceId: string
}

export function ProjectBoardPopup({ onClose, onCreate, projectBoard, workspaceId }: ProjectBoardPopupProps) {
  const [name, setName] = useState(projectBoard?.name || "")
  const [description, setDescription] = useState(projectBoard?.description || "")
  const [isPublic, setIsPublic] = useState(projectBoard?.isPublic || false)
  const [nameError, setNameError] = useState("")

  const { setProjectBoards } = useProjectBoards()

  useEffect(() => {
    if (projectBoard) {
      setName(projectBoard.name)
      setDescription(projectBoard.description)
      setIsPublic(projectBoard.isPublic)
    }
  }, [projectBoard])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameError("")
    const result = await createOrUpdateProjectBoard({
      projectBoard,
      name,
      description,
      isPublic,
      workspaceId,
      setProjectBoards,
    })
    if (result.success) {
      onCreate(true, !!projectBoard)
      onClose()
    } else {
      setNameError(result.error || "An error occurred")
      onCreate(false, !!projectBoard)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md" role="dialog" aria-labelledby="project-board-dialog-title">
        <h2 id="project-board-dialog-title" className="text-xl mb-4">{projectBoard ? "Edit project board" : "Create a new project board"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-sm block mb-1" htmlFor="project-board-name-input">
              Project board name <span className="text-red-700">*</span>
            </label>
            {nameError && <p className="text-red-700 mb-2 italic">{nameError}</p>}
            <Input
              id="project-board-name-input"
              placeholder="Project board name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                if (name.length === 0) {
                  setNameError("Project board name is required.")
                } else if (name.length > 60) {
                  setNameError("Project board name must not exceed 60 characters.")
                } else {
                  setNameError("")
                } 
              }}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-sm block mb-1" htmlFor="project-board-description-input">Description</label>
            <Input
              id="project-board-description-input"
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
            <Button type="submit" disabled={name.length === 0 || name.length > 60} aria-label={projectBoard ? "Save" : "Create"}>
              {projectBoard ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
