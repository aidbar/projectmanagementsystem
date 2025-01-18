import { Button } from "../components/ui/button"
import { useNavigate, useParams } from "react-router-dom"
import { Header } from "../components/Header"
import { KanbanBoard } from "@/components/KanbanBoard"
import { useEffect, useState } from "react"
import api from "../api"
import { AxiosError } from "axios"

export function ProjectBoard() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [projectBoardData, setProjectBoardData] = useState({ name: "", description: "", isPublic: false, createdAt: "", updatedAt: "", creatorUsername: "" })
  const [fetchError, setFetchError] = useState("")

  useEffect(() => {
    async function fetchProjectBoardData() {
      setFetchError("")
      try {
        const response = await api.get(`/v1/ProjectBoards/${id}`)
        setProjectBoardData(response.data)
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.data) {
            setFetchError(error.response.data)
          } else {
            setFetchError("Error fetching project board data")
          }
        } else {
          setFetchError("An error occurred")
        }
        console.error("Failed to fetch project board data:", error)
      }
    }

    fetchProjectBoardData()
  }, [id])

  return (
    <div>
      <Header />
      <div className="flex flex-col gap-10 h-screen p-[0.5rem]">
        {fetchError && <p className="text-red-500">{fetchError}</p>}
        {projectBoardData ? (
          <div>
            <h1 className="text-2xl text-center p-4">{projectBoardData.name}</h1>
            <p className="italic text-center">{projectBoardData.description}</p>
            <div>
              <p>Created at: {new Date(projectBoardData.createdAt).toLocaleString()}</p>
              <p>Last updated: {new Date(projectBoardData.updatedAt).toLocaleString()}</p>
              <p>Visibility: <strong>{projectBoardData.isPublic ? "Public" : "Private"}</strong></p>
            </div>
            <p>Project Board ID: {id}</p>
          </div>
        ) : (
          <p>Loading project board data...</p>
        )}
        <Button className="w-1/6" onClick={() => navigate(-1)}>
          New status column
        </Button>
        <KanbanBoard />
      </div>
    </div>
  )
}
