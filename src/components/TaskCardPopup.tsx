import React, { useState } from "react"
import { Task } from "./ui/task-card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "./ui/button"

interface TaskCardPopupProps {
  task: Task
  onClose: () => void
  onDelete: () => void
}

export function TaskCardPopup({ task, onClose, onDelete }: TaskCardPopupProps) {
  const [isEditing, setIsEditing] = useState({
    title: false,
    description: false,
    status: false,
    priority: false,
    dueDate: false,
    assignedUsers: false,
  });

  const [taskDetails, setTaskDetails] = useState({
    title: task.content, //task.title,
    description: task.content, //task.description,
    status: task.content, //task.columnId,
    priority: task.content, //task.priority,
    dueDate: task.content, //new Date(task.dueDate).toLocaleDateString(),
    assignedUsers: task.content, //task.assignedUsers.join(", "),
  });

  interface IsEditingState {
    title: boolean;
    description: boolean;
    status: boolean;
    priority: boolean;
    dueDate: boolean;
    assignedUsers: boolean;
  }

  interface TaskDetailsState {
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    assignedUsers: string;
  }

  const handleEditToggle = (field: keyof IsEditingState): void => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: { target: { name: any; value: any } }): void => {
    const { name, value } = e.target;
    setTaskDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (field: keyof IsEditingState) => {
    // Save changes to the backend or state management
    handleEditToggle(field);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 relative">
        <div className="flex justify-between items-center mb-4 absolute top-4 right-4">
          <Button onClick={onClose} className={buttonVariants({ variant: "secondary" })}>Close</Button>
        </div>
        <div className="mt-12 px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
          <div className="font-bold text-2xl">
            {isEditing.title ? (
              <input
                type="text"
                name="title"
                value={taskDetails.title}
                onChange={handleChange}
                onBlur={() => handleSave('title')}
              />
            ) : (
              <>
                {taskDetails.title} <span className="ml-2"><a href="#" className="italic underline" onClick={() => handleEditToggle('title')}>Edit</a></span>
              </>
            )}
          </div>
          <div className="mt-2 italic">
            {isEditing.description ? (
              <textarea
                name="description"
                value={taskDetails.description}
                onChange={handleChange}
                onBlur={() => handleSave('description')}
              />
            ) : (
              <>
                {taskDetails.description} <span className="ml-2"><a href="#" className="italic underline" onClick={() => handleEditToggle('description')}>Edit</a></span>
              </>
            )}
          </div>
          <div className="mt-6">
            <strong>Status: </strong>
            {isEditing.status ? (
              <input
                type="text"
                name="status"
                value={taskDetails.status}
                onChange={handleChange}
                onBlur={() => handleSave('status')}
              />
            ) : (
              <>
                {taskDetails.status} <span className="ml-2"><a href="#" className="italic underline" onClick={() => handleEditToggle('status')}>Edit</a></span>
              </>
            )}
          </div>
          <div className="mt-4">
            <strong>Priority: </strong>
            {isEditing.priority ? (
              <input
                type="text"
                name="priority"
                value={taskDetails.priority}
                onChange={handleChange}
                onBlur={() => handleSave('priority')}
              />
            ) : (
              <>
                {taskDetails.priority} <span className="ml-2"><a href="#" className="italic underline" onClick={() => handleEditToggle('priority')}>Edit</a></span>
              </>
            )}
          </div>
          <div className="mt-4">
            <strong>Due Date: </strong>
            {isEditing.dueDate ? (
              <input
                type="text"
                name="dueDate"
                value={taskDetails.dueDate}
                onChange={handleChange}
                onBlur={() => handleSave('dueDate')}
              />
            ) : (
              <>
                {taskDetails.dueDate} <span className="ml-2"><a href="#" className="italic underline" onClick={() => handleEditToggle('dueDate')}>Edit</a></span>
              </>
            )}
          </div>
          <div className="mt-4">
            <strong>Created At: </strong> { task.content /*new Date(task.createdAt).toLocaleString()*/}
          </div>
          <div className="mt-4">
            <strong>Updated At: </strong> {task.content /*new Date(task.updatedAt).toLocaleString()*/}
          </div>
          <div className="mt-4">
            <strong>Assigned Users: </strong>
            {isEditing.assignedUsers ? (
              <input
                type="text"
                name="assignedUsers"
                value={taskDetails.assignedUsers}
                onChange={handleChange}
                onBlur={() => handleSave('assignedUsers')}
              />
            ) : (
              <>
                {taskDetails.assignedUsers} <span className="ml-2"><a href="#" className="italic underline" onClick={() => handleEditToggle('assignedUsers')}>Edit</a></span>
              </>
            )}
          </div>
          <div className="mt-4 flex justify-start">
            <Button onClick={onDelete} className={buttonVariants({ variant: "destructive" })}>
              Delete Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
