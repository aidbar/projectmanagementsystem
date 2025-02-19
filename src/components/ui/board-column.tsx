import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useMemo } from "react"
import { TaskCard } from "./task-card" //Task
import { cva } from "class-variance-authority"
import { Card, CardContent, CardHeader } from "./card"
import { Button } from "./button"
import { GripVertical, Edit, Plus } from "lucide-react"
import { ScrollArea, ScrollBar } from "./scroll-area"
import { useTasks } from "../../context/TasksContext"

export interface Column {
  id: UniqueIdentifier
  title: string
}

export type ColumnType = "Column"

export interface ColumnDragData {
  type: ColumnType
  column: Column
}

interface BoardColumnProps {
  column: Column
  isOverlay?: boolean
  onAddTask?: (columnId: UniqueIdentifier) => void
  onEditColumn?: () => void,
  onDeleteTask: (success: boolean) => void
}

export function BoardColumn({ column, isOverlay, onAddTask, onEditColumn, onDeleteTask }: BoardColumnProps) {
  const { tasks } = useTasks() 

  const tasksInColumn = useMemo(() => {
    return tasks.filter((task) => task.columnId === column.id)
  }, [tasks, column.id])

  const tasksIds = useMemo(() => {
    return tasksInColumn.map((task) => task.id)
  }, [tasksInColumn])

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`
    }
  })

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  }

  const variants = cva(
    "h-[500px] max-h-[500px] w-[350px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary"
        }
      }
    }
  )

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined
      })}
    >
      <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className=" p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
          aria-label={`Move column: ${column.title}`}
        >
          <span className="sr-only">{`Move column: ${column.title}`}</span>
          <GripVertical />
        </Button>
        <Button onClick={() => onAddTask?.(column.id)} variant={"ghost"} className="mt-2" aria-label="Add Task">
          <Plus />
        </Button>
        <h2 className="ml-auto font-bold"> {column.title}</h2>
        <Button onClick={onEditColumn} variant={"ghost"} className="ml-2" aria-label="Edit Column">
          <Edit />
        </Button>
      </CardHeader>
      <ScrollArea>
        <CardContent className="flex flex-grow flex-col gap-2 p-2">
          <SortableContext items={tasksIds}>
            {tasksInColumn.map((task) => (
              <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  )
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext()

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none"
      }
    }
  })

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default"
      })}
    >
      <div className="flex gap-4 items-center flex-row justify-center">{children}</div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
