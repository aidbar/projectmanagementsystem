import React, { useState, forwardRef } from "react" 
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { useNavigate } from "react-router-dom"
import * as Toast from "@radix-ui/react-toast"
import { DeleteConfirmationPopup } from "./DeleteConfirmationPopup"
import { useProjectBoards } from '@/context/ProjectBoardsContext'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Button } from "./ui/button"
import { ProjectBoardsTableRef } from "@/pages/Workspace"

export type ProjectBoard = {
  id: string
  isPublic: boolean
  description: string
  name: string
  creatorUserId: string,
  workspaceId: string
}

export const createColumns = (navigate: ReturnType<typeof useNavigate>, setEditProjectBoard: React.Dispatch<React.SetStateAction<ProjectBoard | undefined>>, setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>, setDeleteProjectBoard: React.Dispatch<React.SetStateAction<ProjectBoard | undefined>>, setDeletePopupOpen: React.Dispatch<React.SetStateAction<boolean>>): ColumnDef<ProjectBoard>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div>{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "isPublic",
    header: () => <div className="text-center">Public</div>,
    cell: ({ row }) => {

      const formatted = row.getValue("isPublic") ? "Yes" : "No"

      return <div className="text-center font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const projectBoard = row.original
      const [open, setOpen] = useState(false)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate(`/project-board/${projectBoard.id}`)}>
                Go to project board
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={JSON.parse(localStorage.getItem('userInfo') || '{}').id !== projectBoard.creatorUserId}
                onClick={(e) => {
                  e.stopPropagation()
                  setEditProjectBoard(projectBoard)
                  setOpenPopup(true)
                }}
              >
                Edit project board details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(projectBoard.id);
                  setOpen(true);
                }}
              >
                Copy project board ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-700"
                disabled={JSON.parse(localStorage.getItem('userInfo') || '{}').id !== projectBoard.creatorUserId}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteProjectBoard(projectBoard);
                  setDeletePopupOpen(true);
                }}
              >
                Delete project board
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Toast.Provider>
            <Toast.Root open={open} onOpenChange={setOpen} className="bg-black text-white p-2 rounded">
              <Toast.Title>Copied!</Toast.Title>
            </Toast.Root>
            <Toast.Viewport className="fixed bottom-0 right-0 p-4" />
          </Toast.Provider>
        </>
      )
    },
  },
]

type ProjectBoardsTableProps = {
  setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setEditProjectBoard: React.Dispatch<React.SetStateAction<ProjectBoard | undefined>>;
  workspaceId: string; 
};

export const ProjectBoardsTable = forwardRef<ProjectBoardsTableRef, ProjectBoardsTableProps>(({ setOpenPopup, setEditProjectBoard, workspaceId }, ref) => { // Added workspaceId to destructured props
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const { projectBoards, setProjectBoards, loading } = useProjectBoards()
  const [deleteProjectBoard, setDeleteProjectBoard] = useState<ProjectBoard | undefined>(undefined)
  const [deletePopupOpen, setDeletePopupOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const navigate = useNavigate()

  const handleDelete = (success: boolean) => {
    setToastMessage(success ? "Project board deleted" : "Failed to delete project board")
    setToastOpen(true)
  }


  const columns = createColumns(navigate, setEditProjectBoard, setOpenPopup, setDeleteProjectBoard, setDeletePopupOpen);
  const table = useReactTable({
    data: projectBoards,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => navigate(`/project-board/${row.original.id}`)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No project boards to show.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <Toast.Provider>
        <Toast.Root open={toastOpen} onOpenChange={setToastOpen} className="bg-black text-white p-2 rounded">
          <Toast.Title>{toastMessage}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 p-4" />
      </Toast.Provider>
      {deletePopupOpen && deleteProjectBoard && (
        <DeleteConfirmationPopup
          onClose={() => setDeletePopupOpen(false)}
          deleteItem={deleteProjectBoard}
          updateState={() => {
            setProjectBoards((prevProjectBoards) =>
              prevProjectBoards.filter((pb) => pb.id !== deleteProjectBoard.id)
            )
            setDeletePopupOpen(false)
          }}
          itemName={deleteProjectBoard.name}
          entity="ProjectBoards"
          onDelete={handleDelete}
        />
      )}
    </div>
  )
})
