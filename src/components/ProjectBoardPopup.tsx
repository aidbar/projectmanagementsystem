import React, { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import api from "../api"
import { ProjectBoard } from "./ProjectBoardsTable"
import { AxiosError } from "axios"
import { useLocation } from "react-router-dom"

interface ProjectBoardPopupProps {
  onClose: () => void
  onCreate: () => void
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
        await api.put(`/v1/ProjectBoards/${projectBoard.id}`, {
          name,
          description,
          isPublic,
          updatedAt,
          workspaceId
        })
      } else {
        await api.post("/v1/ProjectBoards", {
          name,
          description,
          isPublic,
          workspaceId
        })
      }
      onCreate()
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
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl mb-4">{projectBoard ? "Edit project board" : "Create a new project board"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {nameError && <p className="text-red-500 mb-2 italic">{nameError}</p>}
            <Input
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
              {projectBoard ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
