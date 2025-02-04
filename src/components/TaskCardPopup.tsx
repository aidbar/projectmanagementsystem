import React, { useState, useEffect } from "react"
import axios from "axios"
import { Task } from "./ui/task-card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "./ui/button"
import { Column } from "./ui/board-column"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/dropdown"
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import api from "@/api"
import { DeleteConfirmationPopup } from "./DeleteConfirmationPopup"
import { useColumns } from "@/context/ColumnsContext"
import { usePriorities } from "@/context/PrioritiesContext"
import { useTasks } from "../context/TasksContext"
import * as Toast from "@radix-ui/react-toast"
import { saveTaskChanges } from "@/lib/task-cards"

interface TaskCardPopupProps {
  task: Task
  onClose: () => void
  onDelete: (success: boolean) => void
  onSave: (success: boolean) => void // Add this line
}

export function TaskCardPopup({ task, onClose, onDelete, onSave }: TaskCardPopupProps) { // Add onSave to destructured props
  const { columns } = useColumns()
  const { priorities } = usePriorities()
  const { tasks, setTasks } = useTasks() // Use global state for tasks
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
    status: task.columnId as `${string}-${string}-${string}-${string}-${string}`, //.status || "",
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

  const [date, setDate] = useState<Date>(new Date(task.dueDate));
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  useEffect(() => {
    const hasChanges = 
      taskDetails.title !== task.title ||
      taskDetails.description !== task.description ||
      taskDetails.status !== task.columnId ||
      taskDetails.priority !== task.priorityId ||
      taskDetails.dueDate !== new Date(task.dueDate).toLocaleDateString() ||
      (date ? date.toLocaleDateString() !== new Date(task.dueDate).toLocaleDateString() : false);

    const isValid = 
      taskDetails.title.trim() !== "" &&
      taskDetails.description.trim() !== "" &&
      taskDetails.description.length <= 500 &&
      taskDetails.priority.trim() !== "" &&
      taskDetails.status.trim() !== "" &&
      taskDetails.dueDate.trim() !== "";

    setIsSaveEnabled(hasChanges && isValid);
  }, [taskDetails, task, date]);

  const handleSaveChanges = async () => {
    const result = await saveTaskChanges(task.id, { ...task, ...taskDetails, dueDate: date.toISOString(), columnId: taskDetails.status }, date);
    if (result.success) {
      console.log("Changes saved:", result.data);
      setTasks((prevTasks) => prevTasks.map(t => t.id === task.id ? { ...t, ...taskDetails, dueDate: date.toISOString(), columnId: taskDetails.status } : t));
      onSave(true); // Call onSave with true
    } else {
      onSave(false); // Call onSave with false
    }
  };

  /*const fetchData = async () => {
    const result = await fetchTaskData();
    if (result.success) {
      const updatedColumnsData = result.data;
      console.log("Data fetched successfully:", updatedColumnsData);
      // Update the columnsData state or prop here
      // setColumnsData(updatedColumnsData); // Uncomment and use this if columnsData is a state
      //columnsData = updatedColumnsData; // Use this if columnsData is a prop
    }
  };*/

  const updateState = async () => {
    setTasks((prevTasks) => prevTasks.filter(t => t.id !== task.id))
  }

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
    const status = columns.find(col => col.id === statusId);
    return status ? status.title : "Unknown Status";
  };

  const getPriorityName = (priorityId: string) => {
    const priority = priorities.find(p => p.id === priorityId);
    return priority ? priority.name : "Unknown Priority";
  };

  const handleDelete = () => {
    setIsDeletePopupOpen(true)
  }

  const handleCloseDeletePopup = () => {
    setIsDeletePopupOpen(false)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 relative" role="dialog" aria-labelledby="task-card-popup-title">
        <h2 id="task-card-popup-title" className="sr-only">Task</h2>
        <div className="flex justify-between items-center mb-4 absolute top-4 right-4">
          <Button onClick={onClose} className={buttonVariants({ variant: "secondary" })} aria-label="Close">Close</Button>
        </div>
        <div className="mt-12 px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
          {errors.title && <p className="text-red-700 italic">{errors.title}</p>}
          <div className="font-bold text-2xl">
            <label className="font-bold text-sm block mb-1" htmlFor="task-title-input">
              Title {isEditing.title && <span className="text-red-700">*</span>}
            </label>
            {isEditing.title ? (
              <input
                id="task-title-input"
                type="text"
                name="title"
                value={taskDetails.title}
                onChange={handleChange}
                onBlur={() => handleSave('title')}
                className="border border-gray-500 p-3"
                aria-label="Task Title"
              />
            ) : (
              <>
                {taskDetails.title} <span className="ml-2"><a href="#" className="text-sm italic underline" onClick={() => handleEditToggle('title')} aria-label="Edit Title">Edit</a></span>
              </>
            )}
          </div>
          <div className="mt-2">
            {errors.description && <p className="text-red-700 italic">{errors.description}</p>}
            <label className="font-bold text-sm block mb-1" htmlFor="task-description-input">
              Description {isEditing.description && <span className="text-red-700">*</span>}
            </label>
            {isEditing.description ? (
              <textarea
                id="task-description-input"
                name="description"
                value={taskDetails.description}
                onChange={handleChange}
                onBlur={() => handleSave('description')}
                className="border border-gray-500 p-3"
                aria-label="Task Description"
              />
            ) : (
              <>
                {taskDetails.description} <span className="ml-2 italic"><a href="#" className="italic underline" onClick={() => handleEditToggle('description')} aria-label="Edit Description">Edit</a></span>
              </>
            )}
          </div>
          <div className="mt-6">
            {errors.status && <p className="text-red-700 italic">{errors.status}</p>}
            <label className="font-bold text-sm block mb-1" htmlFor="task-status-select">
              Status {isEditing.status && <span className="text-red-700">*</span>}
            </label>
            {isEditing.status ? (
              <Select
                value={taskDetails.status}
                onValueChange={(value) => setTaskDetails((prev) => ({ ...prev, status: value as `${string}-${string}-${string}-${string}-${string}` }))}>
                <SelectTrigger id="task-status-select" className="border border-gray-500 p-3" aria-label="Select Status">
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
            ) : (
              <>
                {getStatusTitle(taskDetails.status.toString())} <span className="ml-2"><a href="#" className="italic underline" onClick={() => handleEditToggle('status')} aria-label="Edit Status">Edit</a></span>
              </>
            )}
          </div>
          <div className="mt-4">
            {errors.priority && <p className="text-red-700 italic">{errors.priority}</p>}
            <label className="font-bold text-sm block mb-1" htmlFor="task-priority-select">
              Priority {isEditing.priority && <span className="text-red-700">*</span>}
            </label>
            {isEditing.priority ? (
              <Select
                value={taskDetails.priority}
                onValueChange={(value) => setTaskDetails((prev) => ({ ...prev, priority: value }))}>
                <SelectTrigger id="task-priority-select" className="border border-gray-500 p-3" aria-label="Select Priority">
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
            ) : (
              <>
                {getPriorityName(taskDetails.priority)} <span className="ml-2"><a href="#" className="italic underline" onClick={() => handleEditToggle('priority')} aria-label="Edit Priority">Edit</a></span>
              </>
            )}
          </div>
          <div className="mt-4">
            <label className="font-bold text-sm block mb-1" htmlFor="task-due-date">
              Due Date {isEditing.dueDate && <span className="text-red-700">*</span>}
            </label>
            {isEditing.dueDate ? (
              <Popover>
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
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) setDate(selectedDate)
                      setTaskDetails((prev) => ({ ...prev, dueDate: selectedDate ? selectedDate.toLocaleDateString() : "" }))
                    }}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <>
                {taskDetails.dueDate} <span className="ml-2"><a href="#" className="italic underline" onClick={() => handleEditToggle('dueDate')} aria-label="Edit Due Date">Edit</a></span>
              </>
            )}
          </div>
          <br />
          <div className="mt-4 italic">
            <strong>Created At: </strong> { new Date(task.createdAt).toLocaleString() }
          </div>
          <div className="mt-4 italic">
            <strong>Updated At: </strong> { new Date(task.updatedAt).toLocaleString() }
          </div>
          <div className="mt-4 flex justify-between">
            <Button onClick={handleDelete} className={buttonVariants({ variant: "destructive" })} aria-label="Delete Task">
              Delete Task
            </Button>
            <Button onClick={handleSaveChanges} disabled={!isSaveEnabled} className={buttonVariants({ variant: "secondary" })} aria-label="Save Changes">
              Save changes
            </Button>
          </div>
        </div>
      </div>
      <Toast.Provider>
        <Toast.Root open={toastOpen} onOpenChange={setToastOpen} className="bg-black text-white p-2 rounded" role="alert">
          <Toast.Title>{toastMessage}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 p-4" />
      </Toast.Provider>
      {isDeletePopupOpen && <DeleteConfirmationPopup onClose={handleCloseDeletePopup} deleteItem={{ id: task.id.toString() }} updateState={updateState} itemName={task.title} entity="TaskCard" onDelete={onDelete} aria-label="Delete Confirmation Popup" />}
    </div>
  )
}
