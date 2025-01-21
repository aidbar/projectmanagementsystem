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
import { Column } from "./board-column"

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
  activities: any[]
  status: Status | null
  labels: Label[] | null
}

interface TaskCardProps {
  task: Task
  isOverlay?: boolean
  columnsData: Column[]
  priorities: { id: string, name: string }[] // Add priorities prop
}

export type TaskType = "Task"

export interface TaskDragData {
  type: TaskType
  task: Task
}

export function TaskCard({ task, isOverlay, columnsData, priorities }: TaskCardProps) {
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
      {isPopupOpen && <TaskCardPopup task={task} onClose={handleClosePopup} onDelete={() => { /* handle delete */ }} columnsData={columnsData} priorities={priorities} />}
    </>
  )
}
