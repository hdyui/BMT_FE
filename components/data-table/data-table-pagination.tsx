"use client";

import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [5, 10, 20, 30, 50],
  className,
}: {
  table: Table<TData>;
  pageSizeOptions?: number[];
  className?: string;
}) {
  const selected = table.getFilteredSelectedRowModel().rows.length;
  const total = table.getFilteredRowModel().rows.length;
  const pageCount = Math.max(table.getPageCount(), 1);

  return (
    <div className={cn("flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8", className)}>
      <p className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
        {selected > 0 ? `${selected} / ${total} mục đã chọn` : `${total} mục`}
      </p>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-sm font-medium">Hiển thị</span>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-18">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top" sideOffset={6} align="end" alignItemWithTrigger={false} className="w-18 min-w-18">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={String(pageSize)}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="min-w-20 text-center text-sm font-medium">
          Trang {table.getState().pagination.pageIndex + 1} / {pageCount}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="hidden size-8 lg:inline-flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} aria-label="Trang đầu" title="Về trang đầu">
            <ChevronsLeft />
          </Button>
          <Button variant="outline" size="icon" className="size-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Trang trước" title="Lùi một trang">
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" className="size-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Trang sau" title="Tiến một trang">
            <ChevronRight />
          </Button>
          <Button variant="outline" size="icon" className="hidden size-8 lg:inline-flex" onClick={() => table.setPageIndex(pageCount - 1)} disabled={!table.getCanNextPage()} aria-label="Trang cuối" title="Đến trang cuối">
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
