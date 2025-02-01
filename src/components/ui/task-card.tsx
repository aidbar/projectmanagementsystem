import type { UniqueIdentifier } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader } from "./card"
import { Button } from "@/components/ui/button"
import { cva } from "class-variance-authority"
import { GripVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ColumnId } from "@/components/KanbanBoard"
import React, { useState } from "react"
import { TaskCardPopup } from "../TaskCardPopup"
import { useColumns } from "@/context/ColumnsContext"
import { usePriorities } from "@/context/PrioritiesContext"
import { updateTaskColumnCard } from "@/lib/task-cards"
import * as Toast from "@radix-ui/react-toast"

export interface Status {
  id: UniqueIdentifier
  name: string
}

export interface Label {
  id: UniqueIdentifier
  name: string
}

export interface Task {
  id: UniqueIdentifier
  columnId: ColumnId
  title: string
  description: string
  listId: string
  createdAt: string
  updatedAt: string
  priorityId: string
  dueDate: string
  /*activities: any[]
  status: Status | null
  labels: Label[] | null*/
}

interface TaskCardProps {
  task: Task
  isOverlay?: boolean,
  onDelete?: (success: boolean) => void
}

export type TaskType = "Task"

export interface TaskDragData {
  type: TaskType
  task: Task
}

export function TaskCard({ task, isOverlay, onDelete = () => {} }: TaskCardProps) {
  const { columns } = useColumns()
  const { priorities } = usePriorities()
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task"
    }
  })

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  }

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary"
      },
      hover: {
        true: "bg-accent-foreground/10",
        false: ""
      }
    }
  })

  const handleClick = () => {
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
  }

  const handleMouseHoverEvents = (isHovered: boolean) => () => {
    setIsHovered(isHovered)
  }

  const handleSaveChangesToast = (success: boolean) => {
    setToastMessage(success ? "Changes saved" : "Failed to save changes")
    setToastOpen(true)
  }

  const handleDeleteToast = (success: boolean) => {
    setToastMessage(success ? "Task deleted successfully" : "Failed to delete task")
    setToastOpen(true)
  }

  return (
    <>
      <div onClick={handleClick} onMouseEnter={handleMouseHoverEvents(true)} onMouseLeave={handleMouseHoverEvents(false)}>
        <Card
          ref={setNodeRef}
          style={style}
          className={variants({
            dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
            hover: isHovered
          })}
        >
          <CardHeader className="px-3 py-3 space-between flex flex-row relative">
            <Button
              variant={"ghost"}
              {...attributes}
              {...listeners}
              className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
            >
              <span className="sr-only">Move task</span>
              <GripVertical />
            </Button>
            <Badge variant={"outline"} className="ml-auto font-semibold">
              Task
            </Badge>
          </CardHeader>
          <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
            {task.title}
          </CardContent>
        </Card>
      </div>
      {isPopupOpen && <TaskCardPopup task={task} onClose={handleClosePopup} onDelete={onDelete} onSave={handleSaveChangesToast} />}
      <Toast.Provider>
        <Toast.Root open={toastOpen} onOpenChange={setToastOpen} className="bg-black text-white p-2 rounded">
          <Toast.Title>{toastMessage}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 p-4" style={{ zIndex: 100 }} />
      </Toast.Provider>
    </>
  )
}
