import React, { useState } from "react"
import { Task } from "./ui/task-card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "./ui/button"
import { Column } from "./ui/board-column"

interface TaskCardPopupProps {
  task: Task
  onClose: () => void
  onDelete: () => void
  columnsData: Column[] //{ id: string, title: string }[] // Add columnsData prop
}

export function TaskCardPopup({ task, onClose, onDelete, columnsData }: TaskCardPopupProps) {
  const [isEditing, setIsEditing] = useState({
    title: false,
    description: false,
    status: false,
    priority: false,
    dueDate: false,
    assignedUsers: false,
  });

  const [taskDetails, setTaskDetails] = useState({
    title: task.title,
    description: task.description,
    status: task.columnId, //.status || "",
    priority: task.priorityId,
    dueDate: new Date(task.dueDate).toLocaleDateString(),
    assignedUsers: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
    assignedUsers: "",
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
    let error = "";
    if (field === 'title' && !taskDetails.title.trim()) {
      error = 'Title is required and cannot be empty.';
    } else if (field === 'description' && (!taskDetails.description.trim() || taskDetails.description.length > 500)) {
      error = 'Description is required and its maximum length is 500.';
    } else if (field === 'priority' && !taskDetails.priority.trim()) {
      error = 'Priority is required and cannot be empty.';
    } else if (field === 'status' && !taskDetails.status.toString().trim()) {
      error = 'Status is required and cannot be empty.';
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
      return;
    }

    setErrors((prev) => ({ ...prev, [field]: "" }));
    handleEditToggle(field);
  };

  const getStatusTitle = (statusId: string) => {
    const status = columnsData.find(col => col.id === statusId);
    return status ? status.title : "Unknown Status";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 relative">
        <div className="flex justify-between items-center mb-4 absolute top-4 right-4">
          <Button onClick={onClose} className={buttonVariants({ variant: "secondary" })}>Close</Button>
        </div>
        <div className="mt-12 px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
          {errors.title && <p className="text-red-500 italic">{errors.title}</p>}
          <div className="font-bold text-2xl">
            {isEditing.title ? (
              <>
                <input
                  type="text"
                  name="title"
                  value={taskDetails.title}
                  onChange={handleChange}
                  onBlur={() => handleSave('title')}
                  className="border border-gray-500 p-3"
                />
              </>
            ) : (
              <>
                {taskDetails.title} <span className="ml-2"><a href="#" className="italic underline" onClick={() => handleEditToggle('title')}>Edit</a></span>
              </>
            )}
          </div>
          <div className="mt-2">
            {errors.description && <p className="text-red-500 italic">{errors.description}</p>}
            {isEditing.description ? (
              <>
                <textarea
                  name="description"
                  value={taskDetails.description}
                  onChange={handleChange}
                  onBlur={() => handleSave('description')}
                  className="border border-gray-500 p-3"
                />
              </>
            ) : (
              <>
                {taskDetails.description} <span className="ml-2 italic"><a href="#" className="italic underline" onClick={() => handleEditToggle('description')}>Edit</a></span>
              </>
            )}
          </div>
          <div className="mt-6">
            {errors.status && <p className="text-red-500 italic">{errors.status}</p>}
            <strong>Status: </strong>
            {isEditing.status ? (
              <>
                <input
                  type="text"
                  name="status"
                  value={taskDetails.status.toString()}
                  onChange={handleChange}
                  onBlur={() => handleSave('status')}
                  className="border border-gray-500 p-3"
                />
              </>
            ) : (
              <>
                {getStatusTitle(taskDetails.status.toString())} <span className="ml-2"><a href="#" className="italic underline" onClick={() => handleEditToggle('status')}>Edit</a></span>
              </>
            )}
          </div>
          <div className="mt-4">
            {errors.priority && <p className="text-red-500 italic">{errors.priority}</p>}
            <strong>Priority: </strong>
            {isEditing.priority ? (
              <>
                <input
                  type="text"
                  name="priority"
                  value={taskDetails.priority}
                  onChange={handleChange}
                  onBlur={() => handleSave('priority')}
                  className="border border-gray-500 p-3"
                />
              </>
            ) : (
              <>
                {taskDetails.priority} <span className="ml-2"><a href="#" className="italic underline" onClick={() => handleEditToggle('priority')}>Edit</a></span>
              </>
            )}
          </div>
          <div className="mt-4">
            <strong>Due Date: </strong>
            {isEditing.dueDate ? (
              <>
                <input
                  type="text"
                  name="dueDate"
                  value={taskDetails.dueDate}
                  onChange={handleChange}
                  onBlur={() => handleSave('dueDate')}
                  className="border border-gray-500 p-3"
                />
              </>
            ) : (
              <>
                {taskDetails.dueDate} <span className="ml-2"><a href="#" className="italic underline" onClick={() => handleEditToggle('dueDate')}>Edit</a></span>
              </>
            )}
          </div>
          <div className="mt-4">
            <strong>Created At: </strong> { new Date(task.createdAt).toLocaleString() }
          </div>
          <div className="mt-4">
            <strong>Updated At: </strong> { new Date(task.updatedAt).toLocaleString() }
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
