"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/admin/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <span className={className}>{title}</span>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn("-ml-2 inline-flex h-8 items-center gap-1 rounded-md px-2 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40", className)}
      >
        {title}
        {column.getCanSort() ? (
          column.getIsSorted() === "asc" ? <ArrowUp className="size-3" /> : column.getIsSorted() === "desc" ? <ArrowDown className="size-3" /> : <ChevronsUpDown className="size-3" />
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {column.getCanSort() ? (
          <>
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}><ArrowUp /> Tăng dần</DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}><ArrowDown /> Giảm dần</DropdownMenuItem>
          </>
        ) : null}
        {column.getCanSort() && column.getCanHide() ? <DropdownMenuSeparator /> : null}
        {column.getCanHide() ? (
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}><EyeOff /> Ẩn cột</DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
