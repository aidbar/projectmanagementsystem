import { useState, useRef } from "react"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { WorkspacesTable, Workspace } from "../components/WorkspacesTable"
import { WorkspacePopup } from "../components/WorkspacePopup"
import { DeleteConfirmationPopup } from "../components/DeleteConfirmationPopup"
import api from "@/api"

export type WorkspacesTableRef = {
  fetchData: () => void;
};

export function Dashboard() {
  const navigate = useNavigate()
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [editWorkspace, setEditWorkspace] = useState<Workspace | undefined>(undefined)
  const [deleteWorkspace, setDeleteWorkspace] = useState<Workspace | undefined>(undefined);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const workspacesTableRef = useRef<WorkspacesTableRef>(null)

  const handleCreate = () => {
    if (workspacesTableRef.current) {
      workspacesTableRef.current.fetchData()
    }
  }

  const handleEdit = (workspace: Workspace) => {
    setEditWorkspace(workspace)
    setIsPopupOpen(true)
  }

  /*const handleDelete = async () => {
    if (deleteWorkspace) {
      try {
        await api.delete(`/v1/Workspaces/${deleteWorkspace.id}`);
        if (workspacesTableRef.current) {
          workspacesTableRef.current.fetchData();
        }
      } catch (error) {
        console.error("Error deleting workspace:", error);
      } finally {
        setDeletePopupOpen(false);
        setDeleteWorkspace(undefined);
      }
    }
  };*/

  return (
    <div>
        <Header />
        <div className="flex flex-col gap-10 h-screen p-[0.5rem]">
            <h1 className="text-2xl text-center p-4">Welcome, {JSON.parse(localStorage.getItem('userInfo') || '{}').firstName} {JSON.parse(localStorage.getItem('userInfo') || '{}').lastName}!</h1>
            <Button className="w-28" onClick={() => setIsPopupOpen(true)}>New workspace</Button>
            <WorkspacesTable
              ref={workspacesTableRef}
              onEdit={handleEdit}
              setOpenPopup={setIsPopupOpen}
              setEditWorkspace={setEditWorkspace}
            />
        </div>
        {isPopupOpen && (
          <WorkspacePopup
            onClose={() => {
              setEditWorkspace(undefined)
              setIsPopupOpen(false)
            }}
            onCreate={handleCreate}
            workspace={editWorkspace}
          />
        )}
        {deletePopupOpen && deleteWorkspace && (
          <DeleteConfirmationPopup
            onClose={() => setDeletePopupOpen(false)}
            deleteItem={deleteWorkspace}
            updateState={() => workspacesTableRef.current?.fetchData()}
            itemName={deleteWorkspace.name}
            entity="Workspaces"
          />
        )}
    </div>
  )
}
