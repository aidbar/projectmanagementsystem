import React, { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import api from "../api"
import { ProjectBoard } from "./ProjectBoardsTable"
import { AxiosError } from "axios"
import { useLocation } from "react-router-dom"
import { useProjectBoards } from "@/context/ProjectBoardsContext"; // Import useProjectBoards

interface ProjectBoardPopupProps {
  onClose: () => void
  onCreate: (success: boolean, isEdit: boolean) => void // Update onCreate prop type
  projectBoard?: ProjectBoard
  workspaceId: string // Add workspaceId to props
}

export function ProjectBoardPopup({ onClose, onCreate, projectBoard, workspaceId }: ProjectBoardPopupProps) {
  const [name, setName] = useState(projectBoard?.name || "")
  const [description, setDescription] = useState(projectBoard?.description || "")
  const [isPublic, setIsPublic] = useState(projectBoard?.isPublic || false)
  const [nameError, setNameError] = useState("")

  const location = useLocation()
  // Remove the following line as workspaceId is now passed as a prop
  // const workspaceId = new URLSearchParams(location.search).get("workspaceId")

  const { setProjectBoards } = useProjectBoards(); // Use global state functions

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
    try {
      if (projectBoard) {
        const updatedAt = new Date().toISOString()
        await api.put(`/ProjectBoards/${projectBoard.id}`, {
          name,
          description,
          isPublic,
          updatedAt,
          workspaceId
        })
        setProjectBoards(prev => prev.map(pb => pb.id === projectBoard.id ? { ...pb, name, description, isPublic, updatedAt } : pb)) // Update global state
        onCreate(true, true); // Pass true on success and true for edit
      } else {
        const newProjectBoard = await api.post("/ProjectBoards", {
          name,
          description,
          isPublic,
          workspaceId
        })
        setProjectBoards(prev => [...prev, newProjectBoard.data]) // Add new project board to global state
        onCreate(true, false); // Pass true on success and false for create
      }
      onClose()
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          setNameError(error.response.data)
        } else {
          setNameError("ProjectBoard edit failed")
        }
      } else {
        setNameError("An error occurred")
      }
      console.error("Error creating/updating projectBoard:", error)
      onCreate(false, !!projectBoard); // Pass false on failure and whether it was an edit
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
