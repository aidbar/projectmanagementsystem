import React from "react"
import { Task } from "./ui/task-card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "./ui/button"

interface TaskCardPopupProps {
  task: Task
  onClose: () => void
  onDelete: () => void
}

export function TaskCardPopup({ task, onClose, onDelete }: TaskCardPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 relative">
        <div className="flex justify-between items-center mb-4 absolute top-4 right-4">
          <Button onClick={onClose} className={buttonVariants({ variant: "secondary" })}>Close</Button>
        </div>
        <div className="mt-12 px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
          <div className="font-bold text-lg">{task.content /*task.title*/}</div>
            <div className="mt-2 italic">{task.content /*task.description*/}</div>
          <div className="mt-6">
            <strong>Status:</strong> {task.columnId} <span className="ml-2"><a href="#" className="italic underline">Edit</a></span>
          </div>
          <div className="mt-4">
            <strong>Priority:</strong> {task.content /*task.priority*/} <span className="ml-2"><a href="#" className="italic underline">Edit</a></span>
          </div>
          <div className="mt-4">
            <strong>Due Date:</strong> {task.content /*new Date(task.dueDate).toLocaleDateString()*/} <span className="ml-2"><a href="#" className="italic underline">Edit</a></span>
          </div>
          <div className="mt-4">
            <strong>Created At:</strong> {task.content /*new Date(task.createdAt).toLocaleString()*/}
          </div>
          <div className="mt-4">
            <strong>Updated At:</strong> {task.content /*new Date(task.updatedAt).toLocaleString()*/}
          </div>
          <div className="mt-4">
            <strong>Assigned Users:</strong> {task.content /*task.assignedUsers.join(", ")*/} <span className="ml-2"><a href="#" className="italic underline">Edit</a></span>
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
