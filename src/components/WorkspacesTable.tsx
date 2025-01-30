import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react"
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
import api from "../api"
import * as Toast from "@radix-ui/react-toast"
import { DeleteConfirmationPopup } from "./DeleteConfirmationPopup"
import { useWorkspaces } from "@/context/WorkspacesContext"

// import { Checkbox } from "./ui/checkbox"
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
import { set } from "zod"
import { WorkspacesTableRef } from "@/pages/Dashboard"

export type Workspace = {
  id: string
  isPublic: boolean
  description: string
  name: string
  creatorUserId: string
}

export const createColumns = (navigate: ReturnType<typeof useNavigate>, setEditWorkspace: React.Dispatch<React.SetStateAction<Workspace | undefined>>, setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>, setDeleteWorkspace: React.Dispatch<React.SetStateAction<Workspace | undefined>>, setDeletePopupOpen: React.Dispatch<React.SetStateAction<boolean>>): ColumnDef<Workspace>[] => [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label="Sort by Name"
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

      // Format the isPublic as a dollar isPublic
      const formatted = row.getValue("isPublic") ? "Yes" : "No"

      return <div className="text-center font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const workspace = row.original
      const [open, setOpen] = useState(false)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" aria-label={`Open menu for workspace ${workspace.name}`}>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate(`/workspace/${workspace.id}`)}>
                Go to workspace
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={JSON.parse(localStorage.getItem('userInfo') || '{}').id !== workspace.creatorUserId}
                onClick={(e) => {
                  e.stopPropagation()
                  setEditWorkspace(workspace)
                  setOpenPopup(true)
                }}
              >
                Edit workspace details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(workspace.id);
                  setOpen(true);
                }}
              >
                Copy workspace ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-700"
                disabled={JSON.parse(localStorage.getItem('userInfo') || '{}').id !== workspace.creatorUserId}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteWorkspace(workspace);
                  setDeletePopupOpen(true);
                }}
              >
                Delete workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Toast.Provider>
            <Toast.Root open={open} onOpenChange={setOpen} className="bg-black text-white p-2 rounded" role="alert">
              <Toast.Title>Copied!</Toast.Title>
            </Toast.Root>
            <Toast.Viewport className="fixed bottom-0 right-0 p-4" />
          </Toast.Provider>
        </>
      )
    },
  },
]

type WorkspacesTableProps = {
  onEdit: (workspace: Workspace) => void;
  setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setEditWorkspace: React.Dispatch<React.SetStateAction<Workspace | undefined>>;
};

export const WorkspacesTable = forwardRef<WorkspacesTableRef, WorkspacesTableProps>(({ onEdit, setOpenPopup, setEditWorkspace }, ref) => {
  const { workspaces, setWorkspaces, fetchWorkspaces, loading } = useWorkspaces()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const workspacesTableRef = useRef<WorkspacesTableRef>(null)
  const [deleteWorkspace, setDeleteWorkspace] = useState<Workspace | undefined>(undefined)
  const [deletePopupOpen, setDeletePopupOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const navigate = useNavigate()

  const handleDelete = (success: boolean) => {
    setToastMessage(success ? "Workspace deleted" : "Failed to delete workspace")
    setToastOpen(true)
  }

  /*function handleUpdate() {
    if (workspacesTableRef.current) {
      workspacesTableRef.current.fetchData()
    }
  }*/

  //const navigate = useNavigate()

  /*useImperativeHandle(ref, () => ({
    fetchData: fetchWorkspaces
  }))*/

  /*useEffect(() => {
    fetchWorkspaces()
  }, [])*/

  /*const handleDelete = async () => {
    if (deleteWorkspace) {
      try {
        await api.delete(`/Workspaces/${deleteWorkspace.id}`);
        fetchWorkspaces();
      } catch (error) {
        console.error("Error deleting workspace:", error);
      } finally {
        setDeletePopupOpen(false);
        setDeleteWorkspace(undefined);
      }
    }
  };*/

  const columns = createColumns(navigate, setEditWorkspace, setOpenPopup, setDeleteWorkspace, setDeletePopupOpen);
  const table = useReactTable({
    data: workspaces,
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
        aria-label="Filter names"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto" aria-label="Toggle columns">
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
            onClick={() => navigate(`/workspace/${row.original.id}`)}
            className="cursor-pointer"
            aria-label={`Workspace ${row.original.name}`}
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
            No workspaces to show.
          </TableCell>
          </TableRow>
        )}
        </TableBody>
      </Table>
      </div>
      {/* <div className="flex-1 text-sm text-muted-foreground">
      {table.getFilteredSelectedRowModel().rows.length} of{" "}
      {table.getFilteredRowModel().rows.length} row(s) selected.
      </div> */}
      <div className="flex items-center justify-end space-x-2 py-4">
      <div className="space-x-2">
        <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        aria-label="Previous page"
        >
        Previous
        </Button>
        <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        aria-label="Next page"
        >
        Next
        </Button>
      </div>
      </div>
      <Toast.Provider>
        <Toast.Root open={toastOpen} onOpenChange={setToastOpen} className="bg-black text-white p-2 rounded" role="alert">
          <Toast.Title>{toastMessage}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 p-4" />
      </Toast.Provider>
      {deletePopupOpen && deleteWorkspace && (
      <DeleteConfirmationPopup
        onClose={() => setDeletePopupOpen(false)}
        deleteItem={deleteWorkspace}
        updateState={() => {
        setWorkspaces((prevWorkspaces) =>
          prevWorkspaces.filter((workspace) => workspace.id !== deleteWorkspace.id)
        );
        setDeletePopupOpen(false);
        }}
        itemName={deleteWorkspace.name}
        entity="Workspaces"
        onDelete={handleDelete}
        aria-label="Delete Confirmation Popup"
      />
      )}
    </div>
  )
})
