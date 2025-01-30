import { useState } from "react"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { WorkspacesTable, Workspace } from "../components/WorkspacesTable"
import { WorkspacePopup } from "../components/WorkspacePopup"
import { DeleteConfirmationPopup } from "../components/DeleteConfirmationPopup"
import { useWorkspaces } from "@/context/WorkspacesContext"
import * as Toast from "@radix-ui/react-toast"
import SidebarLayoutWrapper from "@/components/SidebarLayoutWrapper"

export type WorkspacesTableRef = {
  fetchData: () => void;
};

export function Dashboard() {
  const navigate = useNavigate()
  const { setWorkspaces } = useWorkspaces()
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [editWorkspace, setEditWorkspace] = useState<Workspace | undefined>(undefined)
  const [deleteWorkspace, setDeleteWorkspace] = useState<Workspace | undefined>(undefined)
  const [deletePopupOpen, setDeletePopupOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const handleEdit = (workspace: Workspace) => {
    setEditWorkspace(workspace)
    setIsPopupOpen(true)
  }

  const handleCreate = (success: boolean, isEdit: boolean) => {
    setToastMessage(success ? (isEdit ? "Changes saved" : "Workspace created") : (isEdit ? "Failed to save changes" : "Failed to create workspace"))
    setToastOpen(true)
  }

  return (
    <SidebarLayoutWrapper>
      <div className="flex flex-col h-screen w-screen">
        <Header />
        <div className="flex flex-col gap-10 h-screen p-4">
          <h1 className="text-2xl text-center p-4">Welcome, {JSON.parse(localStorage.getItem('userInfo') || '{}').firstName} {JSON.parse(localStorage.getItem('userInfo') || '{}').lastName}!</h1>
          <Button className="w-28" onClick={() => setIsPopupOpen(true)} aria-label="Create New Workspace">New workspace</Button>
          <WorkspacesTable
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
            aria-label="Workspace Popup"
          />
        )}
        <Toast.Provider>
          <Toast.Root open={toastOpen} onOpenChange={setToastOpen} className="bg-black text-white p-2 rounded" role="alert">
            <Toast.Title>{toastMessage}</Toast.Title>
          </Toast.Root>
          <Toast.Viewport className="fixed bottom-0 right-0 p-4" />
        </Toast.Provider>
        {/*deletePopupOpen && deleteWorkspace && (
        <DeleteConfirmationPopup
          onClose={() => setDeletePopupOpen(false)}
          deleteItem={deleteWorkspace}
          updateState={(deletedWorkspace : Workspace) => setWorkspaces(prev => prev.filter(workspace => workspace.id !== deletedWorkspace.id))}
          itemName={deleteWorkspace.name}
          entity="Workspaces"
          aria-label="Delete Confirmation Popup"
        />
        )*/}
      </div>
    </SidebarLayoutWrapper>
  )
}
