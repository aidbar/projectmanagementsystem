import React, { useState } from "react"
import { Button, buttonVariants } from "./ui/button"

interface CreateTaskPopupProps {
  onClose: () => void
  onCreate: (taskDetails: TaskDetailsState) => void
}

export interface TaskDetailsState {
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
  assignedUsers: string
}

export function CreateTaskPopup({ onClose, onCreate }: CreateTaskPopupProps) {
  const [taskDetails, setTaskDetails] = useState<TaskDetailsState>({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
    assignedUsers: "",
  })

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
    assignedUsers: "",
  })

  const [isFormValid, setIsFormValid] = useState(false)

  const handleChange = (e: { target: { name: any; value: any } }): void => {
    const { name, value } = e.target
    setTaskDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleBlur = (e: { target: { name: string; value: string } }): void => {
    const { name, value } = e.target
    let error = ""

    if (name === "title" && !value.trim()) {
      error = "Title is required and cannot be empty."
    } else if (name === "description" && (!value.trim() || value.length > 500)) {
      error = "Description is required and its maximum length is 500."
    } else if (name === "priority" && !value.trim()) {
      error = "Priority is required and cannot be empty."
    } else if (name === "status" && !value.trim()) {
      error = "Status is required and cannot be empty."
    }

    setErrors((prev) => ({ ...prev, [name]: error }))
    setIsFormValid(
      !!taskDetails.title.trim() &&
      !!taskDetails.description.trim() &&
      taskDetails.description.length <= 500 &&
      !!taskDetails.priority.trim() &&
      !!taskDetails.status.trim() &&
      !error
    )
  }

  const handleSave = () => {
    onCreate(taskDetails)
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 relative">
        <div className="flex justify-between items-center mb-4 absolute top-4 right-4">
          <Button onClick={onClose} className={buttonVariants({ variant: "secondary" })}>Close</Button>
        </div>
        <div className="mt-12 px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
          {errors.title && <p className="text-red-500 italic">{errors.title}</p>}
          <div className="font-bold text-2xl">
            <input
              type="text"
              name="title"
              value={taskDetails.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Title"
              className="border border-gray-500 p-3 w-full"
            />
          </div>
          <div className="mt-2">
            {errors.description && <p className="text-red-500 italic">{errors.description}</p>}
            <textarea
              name="description"
              value={taskDetails.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Description"
              className="border border-gray-500 p-3 w-full"
            />
          </div>
          <div className="mt-6">
            {errors.status && <p className="text-red-500 italic">{errors.status}</p>}
            <strong>Status: </strong>
            <input
              type="text"
              name="status"
              value={taskDetails.status}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Status"
              className="border border-gray-500 p-3 w-full"
            />
          </div>
          <div className="mt-4">
            {errors.priority && <p className="text-red-500 italic">{errors.priority}</p>}
            <strong>Priority: </strong>
            <input
              type="text"
              name="priority"
              value={taskDetails.priority}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Priority"
              className="border border-gray-500 p-3 w-full"
            />
          </div>
          <div className="mt-4">
            <strong>Due Date: </strong>
            <input
              type="text"
              name="dueDate"
              value={taskDetails.dueDate}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Due Date"
              className="border border-gray-500 p-3 w-full"
            />
          </div>
          <div className="mt-4">
            <strong>Assigned Users: </strong>
            <input
              type="text"
              name="assignedUsers"
              value={taskDetails.assignedUsers}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Assigned Users"
              className="border border-gray-500 p-3 w-full"
            />
          </div>
          <div className="mt-4 flex justify-start">
            <Button
              onClick={handleSave}
              className={buttonVariants({ variant: "default" })}
              disabled={!isFormValid}
            >
              Create Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
