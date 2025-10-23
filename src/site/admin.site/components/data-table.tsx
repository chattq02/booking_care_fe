import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type RowData,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import React from "react";
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    width?: string | number;
    fixed?: "left" | "right";
  }
}

export function DataTable({ columns, data }: { columns: any; data: any }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
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
  });

  const getStickyStyle = (
    index: number,
    headers: any[],
    meta: { width?: string | number; fixed?: "left" | "right" }
  ): React.CSSProperties => {
    if (!meta?.fixed) return {};

    const parseWidth = (val: string | number | undefined): number => {
      if (!val) return 0;
      if (typeof val === "number") return val;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 0 : parsed;
    };

    if (meta.fixed === "left") {
      const leftOffset = headers
        .slice(0, index)
        .reduce((sum: number, h: any) => {
          const w = h.column.columnDef.meta?.width;
          return sum + parseWidth(w);
        }, 0);

      return {
        position: "sticky" as const,
        left: `${leftOffset}px`,
        zIndex: 10,
        background: "white",
        boxShadow: "2px 0 0 0 #e5e7eb",
      };
    }

    if (meta.fixed === "right") {
      const rightOffset = headers
        .slice(index + 1)
        .reduce((sum: number, h: any) => {
          const w = h.column.columnDef.meta?.width;
          return sum + parseWidth(w);
        }, 0);

      return {
        position: "sticky" as const,
        right: `${rightOffset}px`,
        zIndex: 10,
        background: "white",
        boxShadow: "-2px 0 0 0 #e5e7eb",
      };
    }

    return {};
  };

  return (
    <div className="w-full">
      {/* Filter + column control */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
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
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border-l border-r border-gray-200">
        <Table className="w-full border-collapse border-l-0 text-sm bg-white">
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, i) => (
                  <TableHead
                    key={header.id}
                    className="border border-gray-200 px-4 py-1 text-gray-700 font-semibold"
                    style={{
                      width: header.column.columnDef.meta?.width,
                      minWidth: header.column.columnDef.meta?.width,
                      ...getStickyStyle(
                        i,
                        headerGroup.headers,
                        header.column.columnDef.meta || {}
                      ),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border border-gray-200 hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <TableCell
                      key={cell.id}
                      className="border border-gray-200 px-4 py-1 text-gray-800"
                      style={{
                        width: cell.column.columnDef.meta?.width,
                        minWidth: cell.column.columnDef.meta?.width,
                        ...getStickyStyle(
                          i,
                          table.getHeaderGroups()[0].headers,
                          cell.column.columnDef.meta || {}
                        ),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border border-gray-200">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </div>
  );
}
