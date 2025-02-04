import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Header } from '../components/Header';
import { ProjectBoardsTable, ProjectBoard } from '../components/ProjectBoardsTable';
import { ProjectBoardPopup } from '../components/ProjectBoardPopup';
import { DeleteConfirmationPopup } from '@/components/DeleteConfirmationPopup';
import { useWorkspaces } from '@/context/WorkspacesContext';
import { ProjectBoardsProvider, useProjectBoards } from '@/context/ProjectBoardsContext';
import * as Toast from "@radix-ui/react-toast";
import { Edit } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/dropdown';
import SidebarLayoutWrapper from '@/components/SidebarLayoutWrapper';
import { fetchWorkspaceData, handleSave, handleCreateOrEdit, handleSubmit } from '@/lib/workspaces';

export type ProjectBoardsTableRef = {
  fetchData: () => void;
};

const Workspace = () => {
  const navigate = useNavigate();
  const { setWorkspaces } = useWorkspaces();
  const { id = '' } = useParams<{ id: string }>();
  const [workspaceData, setWorkspaceData] = useState({
    name: '',
    description: '',
    isPublic: false,
    createdAt: '',
    updatedAt: '',
    creatorUsername: '',
  });
  const [fetchError, setFetchError] = useState('');

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editProjectBoard, setEditProjectBoard] = useState<ProjectBoard | undefined>(undefined);
  const [deleteProjectBoard, setDeleteProjectBoard] = useState<ProjectBoard | undefined>(undefined);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const projectBoardsTableRef = useRef<ProjectBoardsTableRef>(null);

  const { projectBoards, fetchProjectBoards, loading } = useProjectBoards();

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [hasError, setHasError] = useState(false);

  const [isEditing, setIsEditing] = useState({
    name: false,
    description: false,
    isPublic: false,
  });

  const [workspaceDetails, setWorkspaceDetails] = useState({
    name: workspaceData.name,
    description: workspaceData.description,
    isPublic: workspaceData.isPublic,
  });

  const handleEditToggle = (field: keyof typeof isEditing): void => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: { target: { name: any; value: any } }): void => {
    const { name, value } = e.target;
    setWorkspaceDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveWrapper = async (field: keyof typeof isEditing) => {
    const result = await handleSave(id, workspaceDetails, setWorkspaceData, setWorkspaceDetails, setIsEditing, setToastMessage, setToastOpen, setHasError);
    if (result) {
      setIsEditing((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleCreateOrEditWrapper = (success: boolean, isEdit: boolean) => {
    handleCreateOrEdit(success, isEdit, setToastMessage, setToastOpen, projectBoardsTableRef);
  };

  const handleEdit = (projectBoard: ProjectBoard) => {
    setEditProjectBoard(projectBoard);
    setIsPopupOpen(true);
  };

  const [deleteWorkspacePopupOpen, setDeleteWorkspacePopupOpen] = useState(false);

  useEffect(() => {
    fetchWorkspaceData(id, setWorkspaceData, setWorkspaceDetails, setFetchError, setToastMessage, setToastOpen);
  }, [id]);

  useEffect(() => {
    setWorkspaceDetails(workspaceData);
  }, [workspaceData]);

  useEffect(() => {
    if (id) {
      fetchProjectBoards(id);
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarLayoutWrapper>
      <div className="flex flex-col h-screen w-screen">
        <Header />
        <Toast.Provider>
          <Toast.Root open={toastOpen} onOpenChange={setToastOpen} className="bg-black text-white p-2 rounded" role="alert">
            <Toast.Title>{toastMessage}</Toast.Title>
          </Toast.Root>
          <Toast.Viewport className="fixed bottom-0 right-0 p-4" />
        </Toast.Provider>
        <div className="flex flex-col gap-10 h-screen p-[0.5rem]">
          {fetchError && <p className="text-red-700">{fetchError}</p>}
          {workspaceData ? (
            <div>
              <h1 className="text-2xl text-center p-4">
                {isEditing.name ? (
                  <div className="flex justify-center items-center">
                    <Input
                      type="text"
                      name="name"
                      value={workspaceDetails.name}
                      onChange={handleChange}
                      onBlur={() => handleSaveWrapper('name')}
                      className={`border border-gray-500 p-3 w-50 flex justify-center items-center ${hasError ? 'border-red-500' : ''}`}
                      aria-label="Workspace Name"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center items-center">
                    {workspaceDetails.name} <Button variant={"ghost"} onClick={() => handleEditToggle('name')} aria-label="Edit Workspace Name"><Edit /></Button>
                  </div>
                )}
              </h1>
              <div className="italic text-center">
                {isEditing.description ? (
                  <div className="flex justify-center items-center">
                    <Input
                      name="description"
                      value={workspaceDetails.description}
                      onChange={handleChange}
                      onBlur={() => handleSaveWrapper('description')}
                      className="border border-gray-500 p-3 w-50 flex justify-center items-center"
                      aria-label="Workspace Description"
                    />
                  </div>
                ) : (
                  <div className="italic text-center">
                    {workspaceDetails.description} <Button variant={"ghost"} onClick={() => handleEditToggle('description')} aria-label="Edit Workspace Description"><Edit /></Button>
                  </div>
                )}
              </div>
              <div>
                <p>
                  Created by: {workspaceData.creatorUsername || <em>username hidden from others</em>}
                </p>
                <p>Created at: {new Date(workspaceData.createdAt).toLocaleString()}</p>
                <p>Last updated: {new Date(workspaceData.updatedAt).toLocaleString()}</p>
                <p>
                  Visibility: <strong>{isEditing.isPublic ? (
                    <Select
                      value={workspaceDetails.isPublic ? "true" : "false"}
                      onValueChange={(value) => {
                        if (value == "true") {
                          setWorkspaceDetails((prev) => ({ ...prev, isPublic: true }));
                        } else {
                          setWorkspaceDetails((prev) => ({ ...prev, isPublic: false }));
                        }
                      }}
                    >
                      <SelectTrigger className="border border-gray-500 p-3 w-50 flex justify-center items-center" onBlur={() => handleSaveWrapper('isPublic')} aria-label="Workspace Visibility">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true" id="value-public">Public</SelectItem>
                        <SelectItem value="false" id="value-private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <>
                      {workspaceDetails.isPublic ? 'Public' : 'Private'} <Button variant={"ghost"} onClick={() => handleEditToggle('isPublic')} aria-label="Edit Workspace Visibility"><Edit /></Button>
                    </>
                  )}</strong>
                </p>
              </div>
              <p>Workspace ID: {id}</p>
            </div>
          ) : (
            <p>Loading workspace data...</p>
          )}
          <div className="flex items-center">
            <Button className="w-1/6" onClick={() => setIsPopupOpen(true)} aria-label="Create New Project Board">
              New project board
            </Button>
            <Button className="w-1/6 ml-auto" variant="destructive" onClick={() => setDeleteWorkspacePopupOpen(true)} aria-label="Delete Workspace">
              Delete workspace
            </Button>
          </div>
          <ProjectBoardsTable
            ref={projectBoardsTableRef}
            onEdit={handleEdit}
            setOpenPopup={setIsPopupOpen}
            setEditProjectBoard={setEditProjectBoard}
            workspaceId={id}
          />
        </div>
        {isPopupOpen && (
          <ProjectBoardPopup
            onClose={() => {
              setEditProjectBoard(undefined);
              setIsPopupOpen(false);
            }}
            onCreate={(success) => handleCreateOrEditWrapper(success, !!editProjectBoard)}
            projectBoard={editProjectBoard}
            workspaceId={id}
            aria-label="Project Board Popup"
          />
        )}
        {deleteWorkspacePopupOpen && (
          <DeleteConfirmationPopup
            onClose={() => setDeleteWorkspacePopupOpen(false)}
            deleteItem={{ id: id }}
            updateState={() => {
              navigate('/dashboard');
              setWorkspaces(prev => prev.filter(workspace => workspace.id !== id));
            }}
            itemName={workspaceData.name}
            entity="Workspaces"
            onDelete={() => {}}
            aria-label="Delete Confirmation Popup"
          />
        )}
        {/*deletePopupOpen && deleteProjectBoard && (
          <DeleteConfirmationPopup
            onClose={() => setDeletePopupOpen(false)}
            deleteItem={deleteProjectBoard}
            updateState={() => projectBoardsTableRef.current?.fetchData()}
            itemName={deleteProjectBoard.name}
            entity="ProjectBoards"
            aria-label="Delete Confirmation Popup"
          />
        )*/}
      </div>
    </SidebarLayoutWrapper>
  );
};

const WorkspacePage = () => (
  <ProjectBoardsProvider>
    <Workspace />
  </ProjectBoardsProvider>
);

export { WorkspacePage as Workspace };

//export default WorkspacePage;