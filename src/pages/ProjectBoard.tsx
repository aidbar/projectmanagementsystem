import { Button } from "../components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { KanbanBoard } from "@/components/KanbanBoard";
import { useEffect, useState } from "react";
import { fetchProjectBoardData, handleSave } from "@/lib/project-boards";
import { StatusPopup } from "../components/StatusPopup";
import { ColumnsProvider } from "@/context/ColumnsContext";
import { PrioritiesProvider } from "@/context/PrioritiesContext";
import { TasksProvider } from "@/context/TasksContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/dropdown";
import { Edit } from "lucide-react";
import SidebarLayoutWrapper from "@/components/SidebarLayoutWrapper";
import { DeleteConfirmationPopup } from '@/components/DeleteConfirmationPopup';
import * as Toast from "@radix-ui/react-toast";

export function ProjectBoard() {
  const navigate = useNavigate();
  const { id = '' } = useParams<{ id: string }>();
  const [projectBoardData, setProjectBoardData] = useState({ name: "", description: "", isPublic: false, createdAt: "", updatedAt: "", creatorUsername: "" });
  const [fetchError, setFetchError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState({
    name: false,
    description: false,
    isPublic: false,
  });

  const [projectBoardDetails, setProjectBoardDetails] = useState({
    name: projectBoardData.name,
    description: projectBoardData.description,
    isPublic: projectBoardData.isPublic,
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [hasError, setHasError] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState(""); // Add workspaceId state

  const handleEditToggle = (field: keyof typeof isEditing): void => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: { target: { name: any; value: any } }): void => {
    const { name, value } = e.target;
    setProjectBoardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveWrapper = async (field: keyof typeof isEditing) => {
    const result = await handleSave(id, projectBoardDetails, setProjectBoardData, setProjectBoardDetails, setIsEditing, setToastMessage, setToastOpen, setHasError, workspaceId);
    if (result) {
      setIsEditing((prev) => ({ ...prev, [field]: false }));
    }
  };

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await fetchProjectBoardData(id);
      if (error) {
        setFetchError(error);
      } else if (data) {
        setProjectBoardData({
          name: data.name,
          description: data.description,
          isPublic: data.isPublic,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          creatorUsername: data.creatorUserId || "",
        });
        setWorkspaceId(data.workspaceId); // Set workspaceId from the fetched data
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    setProjectBoardDetails(projectBoardData);
  }, [projectBoardData]);

  return (
    <SidebarLayoutWrapper>
      <div className="flex flex-col w-screen h-screen">
        <Header />
        <Toast.Provider>
          <Toast.Root open={toastOpen} onOpenChange={setToastOpen} className="bg-black text-white p-2 rounded" role="alert">
            <Toast.Title>{toastMessage}</Toast.Title>
          </Toast.Root>
          <Toast.Viewport className="fixed bottom-0 right-0 p-4" />
        </Toast.Provider>
        <div className="flex flex-col gap-10 h-screen p-[0.5rem]">
          {fetchError && <p className="text-red-700">{fetchError}</p>}
          {projectBoardData ? (
            <div>
              <h1 className="text-2xl text-center p-4">
                {isEditing.name ? (
                  <div className="flex justify-center items-center">
                    <Input
                      type="text"
                      name="name"
                      value={projectBoardDetails.name}
                      onChange={handleChange}
                      onBlur={() => handleSaveWrapper('name')}
                      className={`border border-gray-500 p-3 w-50 flex justify-center items-center ${hasError ? 'border-red-500' : ''}`}
                      aria-label="Project Board Name"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center items-center">
                    {projectBoardDetails.name} <Button variant={"ghost"} onClick={() => handleEditToggle('name')} aria-label="Edit Project Board Name"><Edit /></Button>
                  </div>
                )}
              </h1>
              <div className="italic text-center">
                {isEditing.description ? (
                  <div className="flex justify-center items-center">
                    <Input
                      name="description"
                      value={projectBoardDetails.description}
                      onChange={handleChange}
                      onBlur={() => handleSaveWrapper('description')}
                      className="border border-gray-500 p-3 w-50 flex justify-center items-center"
                      aria-label="Project Board Description"
                    />
                  </div>
                ) : (
                  <div className="italic text-center">
                    {projectBoardDetails.description} <Button variant={"ghost"} onClick={() => handleEditToggle('description')} aria-label="Edit Project Board Description"><Edit /></Button>
                  </div>
                )}
              </div>
              <div>
                <p>Created at: {new Date(projectBoardData.createdAt).toLocaleString()}</p>
                <p>Last updated: {new Date(projectBoardData.updatedAt).toLocaleString()}</p>
                <p>
                  Visibility: <strong>{isEditing.isPublic ? (
                    <Select
                      value={projectBoardDetails.isPublic ? "true" : "false"}
                      onValueChange={(value) => {
                        if (value == "true") {
                          setProjectBoardDetails((prev) => ({ ...prev, isPublic: true }));
                        } else {
                          setProjectBoardDetails((prev) => ({ ...prev, isPublic: false }));
                        }
                      }}
                    >
                      <SelectTrigger className="border border-gray-500 p-3 w-50 flex justify-center items-center" onBlur={() => handleSaveWrapper('isPublic')} aria-label="Project Board Visibility">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Public</SelectItem>
                        <SelectItem value="false">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <>
                      {projectBoardDetails.isPublic ? 'Public' : 'Private'} <Button variant={"ghost"} onClick={() => handleEditToggle('isPublic')} aria-label="Edit Project Board Visibility"><Edit /></Button>
                    </>
                  )}</strong>
                </p>
              </div>
              <p>Project Board ID: {id}</p>
            </div>
          ) : (
            <p>Loading project board data...</p>
          )}
          <ColumnsProvider>
            <div className="flex items-center">
              <Button className="w-1/6" onClick={() => setIsPopupOpen(true)} aria-label="Create New Status Column">
                New status column
              </Button>
              <Button className="w-1/6 ml-auto" variant="destructive" onClick={() => setDeletePopupOpen(true)} aria-label="Delete Project Board">
                Delete project board
              </Button>
            </div>
            <PrioritiesProvider>
              <TasksProvider projectBoardId={id}>
                <div id="kanban-board">
                  <KanbanBoard />
                </div>
              </TasksProvider>
            </PrioritiesProvider>
            {isPopupOpen && <StatusPopup onClose={() => setIsPopupOpen(false)} aria-label="Status Popup" />}
            {deletePopupOpen && (
              <DeleteConfirmationPopup
                onClose={() => setDeletePopupOpen(false)}
                deleteItem={{ id: id }}
                updateState={() => navigate(-1) }
                itemName={projectBoardData.name}
                entity="ProjectBoards"
                onDelete={() => {}}
                aria-label="Delete Confirmation Popup"
              />
            )}
          </ColumnsProvider>
        </div>
      </div>
    </SidebarLayoutWrapper>
  )
}
