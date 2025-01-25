import { Button } from "../components/ui/button"
import { useNavigate, useParams } from "react-router-dom"
import { Header } from "../components/Header"
import { ProjectBoardsTable, ProjectBoard } from "../components/ProjectBoardsTable"
import { useEffect, useRef, useState } from "react"
import api from "../api"
import { AxiosError } from "axios"
import { ProjectBoardPopup } from "../components/ProjectBoardPopup"
import { DeleteConfirmationPopup } from "@/components/DeleteConfirmationPopup"

export type ProjectBoardsTableRef = {
  fetchData: () => void; 
};

export function Workspace() {
  const navigate = useNavigate()
  const { id = "" } = useParams<{ id: string }>()
  const [workspaceData, setProjectBoardData] = useState({ name: "", description: "", isPublic: false, createdAt: "", updatedAt: "", creatorUsername: "" })
  const [fetchError, setFetchError] = useState("")
    
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [editProjectBoard, setEditProjectBoard] = useState<ProjectBoard | undefined>(undefined)
  const [deleteProjectBoard, setDeleteProjectBoard] = useState<ProjectBoard | undefined>(undefined);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const projectBoardsTableRef = useRef<ProjectBoardsTableRef>(null)
  
  const handleCreate = () => {
      if (projectBoardsTableRef.current) {
        projectBoardsTableRef.current.fetchData()
      }
    }
  
  const handleEdit = (projectBoard: ProjectBoard) => {
      setEditProjectBoard(projectBoard)
      setIsPopupOpen(true)
    }

  useEffect(() => {
    async function fetchWorkspaceData() {
      setFetchError("")
      try {
        const response = await api.get(`/Workspaces/${id}`)
        setProjectBoardData(response.data)
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.data) {
            setFetchError(error.response.data)
          } else {
            setFetchError("Error fetching workspace data")
          }
        } else {
          setFetchError("An error occurred")
        }
        console.error("Failed to fetch workspace data:", error)
      }
    }

    fetchWorkspaceData()
  }, [id])

  return (
    <div>
      <Header />
      <div className="flex flex-col gap-10 h-screen p-[0.5rem]">
        {fetchError && <p className="text-red-500">{fetchError}</p>}
        {workspaceData ? (
          <div>
            <h1 className="text-2xl text-center p-4">{workspaceData.name}</h1>
            <p className="italic text-center">{workspaceData.description}</p>
            <div>
            <p>Created by: {workspaceData.creatorUsername || <em>username hidden from others</em>}</p>
            <p>Created at: {new Date(workspaceData.createdAt).toLocaleString()}</p>
            <p>Last updated: {new Date(workspaceData.updatedAt).toLocaleString()}</p>
            <p>Visibility: <strong>{workspaceData.isPublic ? "Public" : "Private"}</strong></p>
            </div>
            <p>Workspace ID: {id}</p>
          </div>
        ) : (
          <p>Loading workspace data...</p>
        )}
        <Button className="w-1/6" onClick={() => setIsPopupOpen(true)}>New project board</Button>
        <ProjectBoardsTable ref={projectBoardsTableRef}
              onEdit={handleEdit}
              setOpenPopup={setIsPopupOpen}
              setEditProjectBoard={setEditProjectBoard}
              workspaceId={id}
        />
      </div>
      {isPopupOpen && (
        <ProjectBoardPopup
          onClose={() => {
            setEditProjectBoard(undefined)
            setIsPopupOpen(false)
          }}
          onCreate={handleCreate}
          projectBoard={editProjectBoard}
          workspaceId={id}
        />
      )}
      {deletePopupOpen && deleteProjectBoard && (
        <DeleteConfirmationPopup
          onClose={() => setDeletePopupOpen(false)}
          deleteItem={deleteProjectBoard}
          updateState={() => projectBoardsTableRef.current?.fetchData()}
          itemName={deleteProjectBoard.name}
          entity="ProjectBoards"
        />
      )}
    </div>
  )
}