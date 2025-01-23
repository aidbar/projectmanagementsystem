import { useMemo, useRef, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import axios from "axios"
//import styled from "styled-components"

import { BoardColumn, BoardContainer } from "./ui/board-column"
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  Announcements,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor
} from "@dnd-kit/core"
import { SortableContext, arrayMove } from "@dnd-kit/sortable"
import { type Task, TaskCard } from "./ui/task-card"
import type { Column } from "./ui/board-column"
import { hasDraggableData } from "../lib/utils"
import { coordinateGetter } from "../lib/dnd"
import { useQuery } from "@tanstack/react-query"
import { useTasksFindAll } from "../api/task-management"
import { z } from "zod"
import { CreateTaskPopup, TaskDetailsState } from "./CreateTaskPopup"
import api from "@/api"

const defaultCols = [
  {
    id: crypto.randomUUID(),
    title: "WIP"
  }/*,
  {
    id: crypto.randomUUID(),
    name: "Done"
  }*/
] satisfies Column[]

export type ColumnId = (typeof defaultCols)[number]["id"]

export interface Priority {
  id: string
  name: string
}

export function KanbanBoard() {
  console.log("KanbanBoard")
  const { tasks } = useTasksFindAll()
  console.log("data:", tasks)

  const [columns, setColumns] = useState<Column[]>(defaultCols)
  const pickedUpTaskColumn = useRef<ColumnId | null>(null)
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns])

  const [tasksLegacy, setTasks] = useState<Task[]>(tasks) //initialTasks

  const [activeColumn, setActiveColumn] = useState<Column | null>(null)

  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const [showCreateTaskPopup, setShowCreateTaskPopup] = useState(false)
  const [newTaskColumnId, setNewTaskColumnId] = useState<ColumnId | null>(null)

  const [priorities, setPriorities] = useState<Priority[]>([])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter
    })
  )

  useEffect(() => {
    async function fetchColumns() {
      try {
        const response = await api.get('/Status')
        const columnsData = response.data.data.map((col: { id: string, name: string }) => ({
          id: col.id as ColumnId,
          title: col.name
        }))
        console.log("columnsData", columnsData)
        setColumns(columnsData)
      } catch (error) {
        console.error("Error fetching columns:", error)
      }
    }
    fetchColumns()
  }, [])

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await api.get('/TaskCard')
        console.log("fetchTasks response.data.data", response.data.data)
        const tasksData = response.data.data.map((task: any) => ({
          id: task.id,
          columnId: task.statusId,
          title: task.title,
          description: task.description,
          priorityId: task.priorityId,
          listId: task.listId,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          dueDate: task.dueDate
        }))
        setTasks(tasksData)
        console.log("tasksData", tasksData)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      }
    }
    fetchTasks()
  }, [])

  useEffect(() => {
    async function fetchPriorities() {
      try {
        const response = await api.get('/Priority')
        const prioritiesData = response.data.data.map((priority: { id: string, name: string }) => ({
          id: priority.id,
          name: priority.name
        }))
        setPriorities(prioritiesData)
        console.log("prioritiesData", prioritiesData)
      } catch (error) {
        console.error("Error fetching priorities:", error)
      }
    }
    fetchPriorities()
  }, [])

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
    const tasksInColumn = tasks.filter((task) => task.columnId === columnId)
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId)
    const column = columns.find((col) => col.id === columnId)
    return {
      tasksInColumn,
      taskPosition,
      column
    }
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id)
        const startColumn = columns[startColumnIdx]
        return `Picked up Column ${startColumn?.title} at position: ${startColumnIdx + 1} of ${
          columnsId.length
        }`
      } else if (active.data.current?.type === "Task") {
        pickedUpTaskColumn.current = active.data.current.task.columnId
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current
        )
        return `Picked up Task ${active.data.current.task.title} at position: ${
          taskPosition + 1
        } of ${tasksInColumn.length} in column ${column?.title}`
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return

      if (active.data.current?.type === "Column" && over.data.current?.type === "Column") {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id)
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`
      } else if (active.data.current?.type === "Task" && over.data.current?.type === "Task") {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        )
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task ${active.data.current.task.title} was moved over column ${
            column?.title
          } in position ${taskPosition + 1} of ${tasksInColumn.length}`
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null
        return
      }
      if (active.data.current?.type === "Column" && over.data.current?.type === "Column") {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id)

        return `Column ${active.data.current.column.title} was dropped into position ${
          overColumnPosition + 1
        } of ${columnsId.length}`
      } else if (active.data.current?.type === "Task" && over.data.current?.type === "Task") {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        )
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`
      }
      pickedUpTaskColumn.current = null
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null
      if (!hasDraggableData(active)) return
      return `Dragging ${active.data.current?.type} cancelled.`
    }
  }

  function handleAddTask(columnId: UniqueIdentifier) {
    setNewTaskColumnId(columnId as ColumnId)
    setShowCreateTaskPopup(true)
  }

  function handleCreateTask(taskDetails: TaskDetailsState) {
    if (newTaskColumnId) {
      const taskData = {
        description: taskDetails.description || "",
        listId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        title: taskDetails.title,
        priorityId: taskDetails.priority || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        statusId: newTaskColumnId,
        dueDate: taskDetails.dueDate ? new Date(taskDetails.dueDate).toISOString() : null // Convert to UTC for Postgres
      }

      api.post('/TaskCard', taskData)
        .then(response => {
          const task = response.data.data
          const newTask: Task = {
            id: task.id,
            columnId: task.statusId,
            title: task.title,
            description: task.description,
            listId: task.listId,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            dueDate: task.dueDate,
            priorityId: task.priorityId,
            activities: task.activities,
            labels: task.labels,
            status: task.status
          }
          setTasks((prevTasks) => [...prevTasks, newTask])
        })
        .catch(error => {
          console.error("Error creating task:", error)
        })
    }
  }

  return (
    <>
      <DndContext
        accessibility={{
          announcements
        }}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <BoardContainer>
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <BoardColumn
                key={col.id}
                column={col}
                tasks={tasksLegacy.filter((task) => task.columnId === col.id)}
                onAddTask={handleAddTask}
                columnsData={columns}
                priorities={priorities}
              />
            ))}
          </SortableContext>
        </BoardContainer>

        {"document" in window &&
          createPortal(
            <DragOverlay>
              {activeColumn && (
                <BoardColumn
                  isOverlay
                  column={activeColumn}
                  tasks={tasksLegacy.filter((task) => task.columnId === activeColumn.id)}
                  columnsData={columns}
                  priorities={priorities}
                />
              )}
              {activeTask && <TaskCard task={activeTask} isOverlay columnsData={columns} priorities={priorities} />}
            </DragOverlay>,
            document.body
          )}
      </DndContext>

      {showCreateTaskPopup && (
        <CreateTaskPopup
          onClose={() => setShowCreateTaskPopup(false)}
          onCreate={handleCreateTask}
          columnsData={columns}
          defaultStatus={newTaskColumnId || ""}
          priorities={priorities}
        />
      )}
    </>
  )

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return
    const data = event.active.data.current
    if (data?.type === "Column") {
      setActiveColumn(data.column)
      return
    }

    if (data?.type === "Task") {
      setActiveTask(data.task)
      return
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null)
    setActiveTask(null)

    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (!hasDraggableData(active)) return

    const activeData = active.data.current

    if (activeId === overId) return

    const isActiveAColumn = activeData?.type === "Column"
    if (isActiveAColumn) {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex((col) => col.id === activeId)
        const overColumnIndex = columns.findIndex((col) => col.id === overId)
        return arrayMove(columns, activeColumnIndex, overColumnIndex)
      })
      return
    }

    const isActiveATask = activeData?.type === "Task"
    if (isActiveATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const overIndex = tasks.findIndex((t) => t.id === overId)
        const activeTask = tasks[activeIndex]
        const overTask = tasks[overIndex]
        if (activeTask && overTask && activeTask.columnId !== overTask.columnId) {
          activeTask.columnId = overTask.columnId
          return arrayMove(tasks, activeIndex, overIndex - 1)
        }
        return arrayMove(tasks, activeIndex, overIndex)
      })
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    if (!hasDraggableData(active) || !hasDraggableData(over)) return

    const activeData = active.data.current
    const overData = over.data.current

    const isActiveATask = activeData?.type === "Task"
    const isOverATask = overData?.type === "Task"

    if (!isActiveATask) return

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const overIndex = tasks.findIndex((t) => t.id === overId)
        const activeTask = tasks[activeIndex]
        const overTask = tasks[overIndex]
        if (activeTask && overTask && activeTask.columnId !== overTask.columnId) {
          activeTask.columnId = overTask.columnId
          return arrayMove(tasks, activeIndex, overIndex - 1)
        }
        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverAColumn = overData?.type === "Column"

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const activeTask = tasks[activeIndex]
        if (activeTask) {
          activeTask.columnId = overId as ColumnId
          return arrayMove(tasks, activeIndex, activeIndex)
        }
        return tasks
      })
    }
  }
}
