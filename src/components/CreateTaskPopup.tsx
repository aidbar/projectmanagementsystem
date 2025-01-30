import React, { useState, useEffect } from "react"
import { Button, buttonVariants } from "./ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/dropdown"
import { Column } from "./ui/board-column"
import { useColumns } from "@/context/ColumnsContext"
import { usePriorities } from "@/context/PrioritiesContext"

interface CreateTaskPopupProps {
  onClose: () => void
  onCreate: (taskDetails: TaskDetailsState) => void
  defaultStatus: string // Add defaultStatus prop
}

export interface TaskDetailsState {
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
  assignedUsers: string
}

export function CreateTaskPopup({ onClose, onCreate, defaultStatus }: CreateTaskPopupProps) {
  const [taskDetails, setTaskDetails] = useState<TaskDetailsState>({
    title: "",
    description: "",
    status: defaultStatus, // Set default status
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
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const {columns} = useColumns()
  const {priorities} = usePriorities()

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
    } else if (name === "dueDate" && !date) { // Add due date validation
      error = "Due date is required."
    }

    setErrors((prev) => ({ ...prev, [name]: error }))
    setIsFormValid(
      !!taskDetails.title.trim() &&
      !!taskDetails.description.trim() &&
      taskDetails.description.length <= 500 &&
      !!taskDetails.priority.trim() &&
      !!taskDetails.status.trim() &&
      !!date && // Add due date validation
      !error
    )
  }

  useEffect(() => {
    setIsFormValid(
      !!taskDetails.title.trim() &&
      !!taskDetails.description.trim() &&
      taskDetails.description.length <= 500 &&
      !!taskDetails.priority.trim() &&
      !!taskDetails.status.trim() &&
      !!date && // Add due date validation
      !errors.title &&
      !errors.description &&
      !errors.priority &&
      !errors.status
    )
  }, [taskDetails, errors, date]) // Add date to dependency array

  const handleSave = () => {
    onCreate({ ...taskDetails, dueDate: date ? format(date, "yyyy-MM-dd") : "" })
    onClose()
  }

  const handleOpenDatePickerChange = (open: boolean) => {
    setIsDatePickerOpen(open)
    if (!open && !date) {
      setErrors((prev) => ({ ...prev, dueDate: "Due date is required." }))
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 relative" role="dialog" aria-labelledby="create-task-popup-title">
        <h2 id="create-task-popup-title" className="sr-only">Create Task Popup</h2>
        <div className="flex justify-between items-center mb-4 absolute top-4 right-4">
          <Button onClick={onClose} className={buttonVariants({ variant: "secondary" })} aria-label="Close">Close</Button>
        </div>
        <div className="mt-12 px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
          {errors.title && <p className="text-red-700 italic">{errors.title}</p>}
          <div className="font-bold text-2xl">
            <label className="text-sm block mb-1" htmlFor="task-title-input">
              Title <span className="text-red-700">*</span>
            </label>
            <input
              id="task-title-input"
              type="text"
              name="title"
              value={taskDetails.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Title"
              className="border border-gray-500 p-3 w-full"
              aria-label="Task Title"
            />
          </div>
          <div className="mt-2">
            {errors.description && <p className="text-red-700 italic">{errors.description}</p>}
            <label className="text-sm block mb-1" htmlFor="task-description-input">
              Description <span className="text-red-700">*</span>
            </label>
            <textarea
              id="task-description-input"
              name="description"
              value={taskDetails.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Description"
              className="border border-gray-500 p-3 w-full"
              aria-label="Task Description"
            />
          </div>
          <div className="mt-6">
            {errors.status && <p className="text-red-700 italic">{errors.status}</p>}
            <label className="text-sm block mb-1" htmlFor="task-status-select">
              Status <span className="text-red-700">*</span>
            </label>
            <Select
              value={taskDetails.status}
              onValueChange={(value) => setTaskDetails((prev) => ({ ...prev, status: value }))}>
              <SelectTrigger id="task-status-select" className="border border-gray-500 p-3 w-full" aria-label="Select Status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column.id} value={column.id.toString()}>
                    {column.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            {errors.priority && <p className="text-red-700 italic">{errors.priority}</p>}
            <label className="text-sm block mb-1" htmlFor="task-priority-select">
              Priority <span className="text-red-700">*</span>
            </label>
            <Select
              value={taskDetails.priority}
              onValueChange={(value) => setTaskDetails((prev) => ({ ...prev, priority: value }))}>
              <SelectTrigger id="task-priority-select" className="border border-gray-500 p-3 w-full" aria-label="Select Priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.id} value={priority.id}>
                    {priority.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <strong>Due Date: <span className="text-red-700">*</span></strong>
            <Popover open={isDatePickerOpen} onOpenChange={handleOpenDatePickerChange}>
              {errors.dueDate && <p className="text-red-700 italic">{errors.dueDate}</p>}
              <PopoverTrigger asChild>
                <Button
                  id="task-due-date"
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  aria-label="Select Due Date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate)
                    setErrors((prev) => ({ ...prev, dueDate: "" }))
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-4 flex justify-start">
            <Button
              onClick={handleSave}
              className={buttonVariants({ variant: "default" })}
              disabled={!isFormValid}
              aria-label="Create Task"
            >
              Create Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
