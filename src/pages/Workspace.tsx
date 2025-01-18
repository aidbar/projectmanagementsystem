import { Button } from "../components/ui/button"
import { useNavigate, useParams } from "react-router-dom"
import { Header } from "../components/Header"
import { ProjectBoardsTable } from "../components/ProjectBoardsTable"
import { useEffect, useState } from "react"
import api from "../api"

export function Workspace() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [workspaceData, setWorkspaceData] = useState({ name: "", description: "", isPublic: false, createdAt: "", updatedAt: "", creatorUsername: "" })

  useEffect(() => {
    async function fetchWorkspaceData() {
      try {
        const response = await api.get(`/v1/Workspaces/${id}`)
        setWorkspaceData(response.data)
      } catch (error) {
        console.error("Failed to fetch workspace data:", error)
      }
    }

    fetchWorkspaceData()
  }, [id])

  return (
    <div>
      <Header />
      <div className="flex flex-col gap-10 h-screen p-[0.5rem]">
        {workspaceData ? (
          <div>
            <h1 className="text-2xl text-center p-4">{workspaceData.name}</h1>
            <p className="italic text-center">{workspaceData.description}</p>
            <div>
            <p>Created by: {workspaceData.creatorUsername}</p>
            <p>Created at: {new Date(workspaceData.createdAt).toLocaleString()}</p>
            <p>Last updated: {new Date(workspaceData.updatedAt).toLocaleString()}</p>
            <p>Visibility: <strong>{workspaceData.isPublic ? "Public" : "Private"}</strong></p>
            </div>
            <p>Workspace ID: {id}</p>
          </div>
        ) : (
          <p>Loading workspace data...</p>
        )}
        <Button className="w-1/6" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        <ProjectBoardsTable />
      </div>
    </div>
  )
}
