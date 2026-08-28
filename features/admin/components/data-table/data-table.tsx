"use client";

import * as React from "react";
import {
  flexRender,
  type Row,
  type Table as TanstackTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  isLoading?: boolean;
  pageSizeOptions?: number[];
  emptyState?: React.ReactNode;
  actionBar?: React.ReactNode;
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
}

export function DataTable<TData>({
  table,
  isLoading = false,
  pageSizeOptions,
  emptyState,
  actionBar,
  renderSubComponent,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-2.5 overflow-auto", className)} {...props}>
      {children}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                    className="bg-muted text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={`loading-${rowIndex}`} className="hover:bg-transparent">
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton className="h-5 w-full max-w-40" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length ? (
              rows.map((row, rowIndex) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    className={rowIndex % 2 !== 0 ? "bg-muted/60" : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && renderSubComponent ? (
                    <TableRow>
                      <TableCell colSpan={row.getVisibleCells().length} className="bg-muted/35 p-0">
                        {renderSubComponent({ row })}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={Math.max(visibleColumns.length, 1)} className="h-72 p-0 text-center">
                  {emptyState ?? (
                    <p className="text-sm text-muted-foreground">Không có dữ liệu phù hợp.</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
      {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 ? actionBar : null}
    </div>
  );
}
