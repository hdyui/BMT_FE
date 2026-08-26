"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { FilePenLine, FolderOpen, Images, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminBreadcrumb } from "@/features/admin/components/editor/AdminBreadcrumb";
import { DeleteContentDialog } from "@/features/admin/components/editor/DeleteContentDialog";
import { EmbeddedResourceEditor } from "@/features/admin/components/editor/EmbeddedResourceEditor";
import { useAdminCrud } from "@/features/admin/components/editor/AdminCrudProvider";
import { useDebounce } from "@/hooks/use-debounce";
import { getResourceBreadcrumb } from "@/lib/admin/content-navigation";
import type { AdminCrudRecord, AdminResourceConfig } from "@/lib/admin/types/crud";

export function ResourceListPage({
  config,
  companionConfig,
  baseHref,
}: {
  config: AdminResourceConfig;
  companionConfig?: AdminResourceConfig;
  baseHref?: string;
}) {
  return (
    <Suspense fallback={<ResourceListPageFallback />}>
      <ResourceListPageContent
        config={config}
        companionConfig={companionConfig}
        baseHref={baseHref}
      />
    </Suspense>
  );
}

function ResourceListPageContent({
  config,
  companionConfig,
  baseHref: baseHrefOverride,
}: {
  config: AdminResourceConfig;
  companionConfig?: AdminResourceConfig;
  baseHref?: string;
}) {
  const { getRecords, removeRecord, updateRecord } = useAdminCrud();
  const records = getRecords(config.key);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const debouncedQuery = useDebounce(query, 350);
  const syncingFromUrlRef = useRef(false);
  const previousUrlQueryRef = useRef(urlQuery);
  const [deleteTarget, setDeleteTarget] = useState<AdminCrudRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const imageManager = config.listMode === "image-manager";
  const baseHref = baseHrefOverride ?? `/admin/${config.module}/${config.path}`;

  useEffect(() => {
    if (previousUrlQueryRef.current === urlQuery) return;
    previousUrlQueryRef.current = urlQuery;
    if (urlQuery !== query) {
      syncingFromUrlRef.current = true;
      setQuery(urlQuery);
    }
  }, [query, urlQuery]);

  useEffect(() => {
    if (syncingFromUrlRef.current) {
      if (debouncedQuery === urlQuery) syncingFromUrlRef.current = false;
      return;
    }

    const normalizedQuery = debouncedQuery.trim();
    if (normalizedQuery === urlQuery) return;

    const params = new URLSearchParams(searchParams.toString());
    if (normalizedQuery) params.set("q", normalizedQuery);
    else params.delete("q");

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }, [debouncedQuery, pathname, router, searchParams, urlQuery]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeRecord(config.key, deleteTarget.id);
      toast.success("Đã xóa nội dung");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  const replaceImage = useCallback(async (record: AdminCrudRecord, dataUrl: string) => {
    if (!config.previewField) return;
    await updateRecord(config.key, record.id, { ...record, [config.previewField]: dataUrl });
    toast.success("Đã đổi ảnh");
  }, [config.key, config.previewField, updateRecord]);

  const columns = useMemo<ColumnDef<AdminCrudRecord>[]>(() => {
    const definitions: ColumnDef<AdminCrudRecord>[] = [
      {
        id: "select",
        size: 44,
        enableSorting: false,
        enableHiding: true,
        meta: { label: "Chọn" },
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
            aria-label="Chọn tất cả mục trên trang"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
            aria-label={`Chọn ${String(row.original[config.titleField] ?? config.singular)}`}
          />
        ),
      },
      {
        id: "index",
        accessorFn: (item) => records.findIndex((record) => record.id === item.id) + 1,
        size: 80,
        enableSorting: true,
        enableHiding: true,
        meta: { label: "Thứ tự" },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Thứ tự" />,
        cell: ({ row }) => (
          <span className="text-xs tabular-nums text-muted-foreground">
            {String(row.getValue<number>("index")).padStart(2, "0")}
          </span>
        ),
      },
    ];

    if (config.previewField) {
      definitions.push({
        id: "preview",
        size: 82,
        enableSorting: false,
        meta: { label: "Hình ảnh" },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Hình ảnh" />,
        cell: ({ row }) => {
          const sourceIndex = records.findIndex((record) => record.id === row.original.id);
          const title = imageManager
            ? `${config.itemLabel ?? "Ảnh"} ${sourceIndex + 1}`
            : String(row.original[config.titleField] ?? config.singular);
          const preview = String(row.original[config.previewField!] ?? "");
          return (
            <div className="relative size-12 overflow-hidden rounded-lg border bg-muted">
              {preview ? (
                <Image
                  src={preview}
                  alt={title}
                  fill
                  unoptimized={preview.startsWith("blob:") || preview.startsWith("data:")}
                  className="object-contain p-1"
                  sizes="48px"
                />
              ) : (
                <span className="grid size-full place-items-center text-[10px] text-muted-foreground">Chưa có ảnh</span>
              )}
            </div>
          );
        },
      });
    }

    definitions.push({
      id: "title",
      accessorFn: (item) => String(item[config.titleField] ?? ""),
      meta: { label: imageManager ? "Vị trí" : "Tiêu đề" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={imageManager ? "Vị trí" : "Tiêu đề"} />
      ),
      cell: ({ row }) => {
        const sourceIndex = records.findIndex((record) => record.id === row.original.id);
        const title = imageManager
          ? `${config.itemLabel ?? "Ảnh"} ${sourceIndex + 1}`
          : String(row.original[config.titleField] ?? config.singular);
        return imageManager ? (
          <span className="font-medium">{title}</span>
        ) : (
          <Link href={`${baseHref}/${row.original.id}`} className="font-medium hover:text-brand hover:underline hover:underline-offset-4">
            {title}
          </Link>
        );
      },
    });

    if (config.enabledField) {
      definitions.push({
        id: "enabled",
        accessorFn: (item) => Boolean(item[config.enabledField!]),
        enableSorting: false,
        meta: { label: "Trạng thái" },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
          const enabled = Boolean(row.original[config.enabledField!]);
          return (
            <Badge variant={enabled ? "default" : "secondary"} className={enabled ? "bg-emerald-600 text-white" : undefined}>
              {enabled ? "Hiển thị" : "Đang ẩn"}
            </Badge>
          );
        },
      });
    }

    definitions.push({
      id: "actions",
      size: imageManager ? 220 : 170,
      enableSorting: false,
      enableHiding: true,
      meta: { label: "Thao tác" },
      header: ({ column }) => (
        <div className="flex justify-center">
          <DataTableColumnHeader column={column} title="Thao tác" />
        </div>
      ),
      cell: ({ row }) => {
        const item = row.original;
        const sourceIndex = records.findIndex((record) => record.id === item.id);
        const title = imageManager
          ? `${config.itemLabel ?? "Ảnh"} ${sourceIndex + 1}`
          : String(item[config.titleField] ?? config.singular);
        return (
          <div className="flex items-center justify-center gap-2 whitespace-nowrap">
            {imageManager ? (
              <ReplaceImageButton label={title} onSelect={(dataUrl) => replaceImage(item, dataUrl)} />
            ) : (
              <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`${baseHref}/${item.id}`} />}>
                <FilePenLine /> Chỉnh sửa
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(item)}>
              <Trash2 /> Xóa
            </Button>
          </div>
        );
      },
    });

    return definitions;
  }, [baseHref, config, imageManager, records, replaceImage]);

  // TanStack Table intentionally returns mutable table methods.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: records,
    columns,
    state: { globalFilter: debouncedQuery },
    globalFilterFn: (row, _columnId, value) =>
      String(row.original[config.titleField] ?? "").toLocaleLowerCase("vi").includes(String(value).trim().toLocaleLowerCase("vi")),
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: config.key === "news/list" ? 5 : 10 } },
  });

  return (
    <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8">
      <AdminBreadcrumb items={[...getResourceBreadcrumb(config), { label: config.title }]} />
      <div className="mt-4">
        <AdminPageHeader
          title={config.title}
          description={config.description}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              {!imageManager ? (
                <Button nativeButton={false} render={<Link href={`${baseHref}/new`} />}><Plus /> Thêm {config.singular.toLocaleLowerCase("vi")}</Button>
              ) : null}
            </div>
          }
        />
      </div>
      {companionConfig ? <EmbeddedResourceEditor config={companionConfig} /> : null}

      <section className="mt-6">
        <DataTable
          table={table}
          emptyState={
            <ListMessage
              title={debouncedQuery ? "Không tìm thấy nội dung" : `Chưa có ${config.singular.toLocaleLowerCase("vi")}`}
              description={debouncedQuery ? "Thử từ khóa khác hoặc xóa bộ lọc hiện tại." : "Thêm nội dung đầu tiên cho danh sách này."}
              actionLabel={debouncedQuery ? "Xóa tìm kiếm" : `Thêm ${config.singular.toLocaleLowerCase("vi")}`}
              href={debouncedQuery ? undefined : `${baseHref}/new`}
              onAction={debouncedQuery ? () => setQuery("") : undefined}
            />
          }
        >
          <div role="toolbar" className="flex w-full flex-col items-start justify-between gap-2 p-1 sm:flex-row sm:items-center">
            {!imageManager ? (
              <label className="relative block w-full sm:min-w-72 sm:max-w-md">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Tìm ${config.singular.toLocaleLowerCase("vi")}...`} className="h-8 pl-9" />
              </label>
            ) : <span className="text-sm font-medium">{records.length} ảnh</span>}
            <DataTableViewOptions table={table} />
          </div>
        </DataTable>
      </section>

      <DeleteContentDialog
        open={Boolean(deleteTarget)}
        title={`Xóa ${config.singular.toLocaleLowerCase("vi")}?`}
        itemLabel={String(deleteTarget?.[config.titleField] ?? config.singular)}
        deleting={deleting}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function ResourceListPageFallback() {
  return (
    <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8">
      <div className="h-5 w-48 animate-pulse rounded-md bg-muted" />
      <div className="mt-8 h-9 w-72 animate-pulse rounded-md bg-muted" />
      <div className="mt-8 h-96 animate-pulse rounded-2xl border bg-card" />
    </div>
  );
}

function ReplaceImageButton({ label, onSelect }: { label: string; onSelect: (dataUrl: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  function readImage(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") onSelect(reader.result);
    });
    reader.readAsDataURL(file);
  }

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}><Images /> Đổi ảnh</Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        aria-label={`Đổi ${label}`}
        className="sr-only"
        onChange={(event) => {
          readImage(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </>
  );
}

function ListMessage({ title, description, actionLabel, href, onAction }: { title: string; description: string; actionLabel: string; href?: string; onAction?: () => void }) {
  return (
    <div className="grid min-h-72 place-items-center p-6 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-brand"><FolderOpen className="size-5" /></span>
        <h3 className="mt-4 font-semibold">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
        {href ? (
          <Button className="mt-4" nativeButton={false} render={<Link href={href} />}><Plus /> {actionLabel}</Button>
        ) : (
          <Button className="mt-4" onClick={onAction}><Search /> {actionLabel}</Button>
        )}
      </div>
    </div>
  );
}
