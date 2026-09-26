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

import { DataTable } from "@/features/admin/components/data-table/data-table";
import { DataTableColumnHeader } from "@/features/admin/components/data-table/data-table-column-header";
import { DataTableViewOptions } from "@/features/admin/components/data-table/data-table-view-options";
import { Badge } from "@/features/admin/components/ui/badge";
import { Button } from "@/features/admin/components/ui/button";
import { Checkbox } from "@/features/admin/components/ui/checkbox";
import { Input } from "@/features/admin/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/admin/components/ui/select";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminBreadcrumb } from "@/features/admin/components/editor/AdminBreadcrumb";
import { DeleteContentDialog } from "@/features/admin/components/editor/DeleteContentDialog";
import { EmbeddedResourceEditor } from "@/features/admin/components/editor/EmbeddedResourceEditor";
import { useAdminCrud } from "@/features/admin/components/editor/AdminCrudProvider";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { getResourceBreadcrumb } from "@/features/admin/lib/content-navigation";
import { isSafeAdminImageSrc } from "@/features/admin/lib/safe-admin-image";
import type { AdminCrudRecord, AdminResourceConfig } from "@/features/admin/lib/types/crud";

const MAX_HIGHLIGHTED_PROJECTS_PER_CATEGORY = 8;
const MAX_HOME_HIGHLIGHTED_NEWS = 4;
const MAX_FEATURED_NEWS = 5;
const API_LIST_RESOURCE_KEYS = new Set([
  "projects/list",
  "news/list",
  "recruitment/jobs",
]);

type BooleanListFilter = "all" | "yes" | "no";

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
  const { getRecords, loadRecords, removeRecord, updateRecord } = useAdminCrud();
  const records = getRecords(config.key);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("all");
  const [projectHighlightFilter, setProjectHighlightFilter] =
    useState<BooleanListFilter>("all");
  const [newsFeaturedFilter, setNewsFeaturedFilter] =
    useState<BooleanListFilter>("all");
  const debouncedQuery = useDebounce(query, 350);
  const syncingFromUrlRef = useRef(false);
  const previousUrlQueryRef = useRef(urlQuery);
  const [deleteTarget, setDeleteTarget] = useState<AdminCrudRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const shouldLoadApiList = API_LIST_RESOURCE_KEYS.has(config.key);
  const [loadingApiList, setLoadingApiList] = useState(shouldLoadApiList);
  const [apiListError, setApiListError] = useState<string | null>(null);
  const imageManager = config.listMode === "image-manager";
  const mutableCollection = config.collectionMode === "dynamic";
  const baseHref = baseHrefOverride ?? `/admin/${config.module}/${config.path}`;

  useEffect(() => {
    if (!shouldLoadApiList) return;

    let active = true;
    void loadRecords(config.key)
      .catch((error: unknown) => {
        if (!active) return;
        const message =
          error instanceof Error
            ? error.message
            : "Không thể tải danh sách từ API.";
        setApiListError(message);
        toast.error("Không thể tải danh sách", { description: message });
      })
      .finally(() => {
        if (active) setLoadingApiList(false);
      });

    return () => {
      active = false;
    };
  }, [config.key, loadRecords, shouldLoadApiList]);
  const projectCategories = useMemo(
    () =>
      Array.from(
        new Set(
          records
            .map((record) => String(record.category ?? "").trim())
            .filter(Boolean),
        ),
      ),
    [records],
  );
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (config.key === "projects/list") {
        if (
          projectCategoryFilter !== "all" &&
          String(record.category ?? "") !== projectCategoryFilter
        ) {
          return false;
        }

        if (
          projectHighlightFilter !== "all" &&
          Boolean(record.highlight) !== (projectHighlightFilter === "yes")
        ) {
          return false;
        }
      }

      if (
        config.key === "news/list" &&
        newsFeaturedFilter !== "all" &&
        Boolean(record.featured) !== (newsFeaturedFilter === "yes")
      ) {
        return false;
      }

      return true;
    });
  }, [
    config.key,
    newsFeaturedFilter,
    projectCategoryFilter,
    projectHighlightFilter,
    records,
  ]);
  const hasResourceFilter =
    (config.key === "projects/list" &&
      (projectCategoryFilter !== "all" ||
        projectHighlightFilter !== "all")) ||
    (config.key === "news/list" && newsFeaturedFilter !== "all");

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
    const definitions: ColumnDef<AdminCrudRecord>[] = [];

    if (mutableCollection) {
      definitions.push({
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
      });
    }

    definitions.push({
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
      });

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
          const safePreview = isSafeAdminImageSrc(preview);
          return (
            <div className="relative size-12 overflow-hidden rounded-lg border bg-muted">
              {safePreview ? (
                <Image
                  src={preview}
                  alt={title}
                  fill
                  unoptimized={preview.startsWith("blob:") || preview.startsWith("data:")}
                  className="object-contain p-1"
                  sizes="48px"
                />
              ) : (
                <span className="grid size-full place-items-center px-1 text-center text-[9px] leading-tight text-muted-foreground">
                  {preview ? "Ảnh lỗi" : "Chưa có ảnh"}
                </span>
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
        const editHref = `${baseHref}/${row.original.id}`;
        return imageManager ? (
          <span className="font-medium">{title}</span>
        ) : (
          <Link href={editHref} className="font-medium hover:text-brand hover:underline hover:underline-offset-4">
            {title}
          </Link>
        );
      },
    });

    if (config.key === "projects/list") {
      definitions.push({
        id: "category",
        accessorFn: (item) => String(item.category ?? ""),
        size: 190,
        enableSorting: true,
        enableHiding: true,
        meta: { label: "Danh mục" },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Danh mục" />
        ),
        cell: ({ row }) => {
          const category = String(row.original.category ?? "");
          return category ? (
            <Badge variant="outline" className="font-medium">
              {category}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">Chưa phân loại</span>
          );
        },
      });

      definitions.push({
        id: "highlight",
        accessorFn: (item) => Boolean(item.highlight),
        size: 130,
        enableSorting: true,
        enableHiding: true,
        meta: { label: "Dự án tiêu biểu" },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tiêu biểu" />
        ),
        cell: ({ row }) => {
          const item = row.original;
          const highlighted = Boolean(item.highlight);
          return (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={highlighted}
                onCheckedChange={async (value) => {
                  const nextHighlight = Boolean(value);

                  if (nextHighlight && !highlighted) {
                    const category = String(item.category ?? "");
                    const highlightedInCategory = records.filter(
                      (record) =>
                        record.id !== item.id &&
                        String(record.category ?? "") === category &&
                        Boolean(record.highlight),
                    ).length;

                    if (
                      highlightedInCategory >=
                      MAX_HIGHLIGHTED_PROJECTS_PER_CATEGORY
                    ) {
                      toast.error(
                        `Danh mục "${category}" đã đủ ${MAX_HIGHLIGHTED_PROJECTS_PER_CATEGORY} dự án tiêu biểu`,
                        {
                          description:
                            "Bỏ đánh dấu một dự án tiêu biểu hiện tại trước khi chọn dự án khác.",
                        },
                      );
                      return;
                    }
                  }

                  await updateRecord(config.key, item.id, {
                    ...item,
                    highlight: nextHighlight,
                  });
                  toast.success(
                    nextHighlight
                      ? "Đã đánh dấu dự án tiêu biểu"
                      : "Đã bỏ đánh dấu dự án tiêu biểu",
                  );
                }}
                aria-label={
                  highlighted
                    ? "Bỏ đánh dấu dự án tiêu biểu"
                    : "Đánh dấu dự án tiêu biểu"
                }
              />
              <span className="text-xs text-muted-foreground">
                {highlighted ? "Có" : "Không"}
              </span>
            </div>
          );
        },
      });
    }

    if (config.key === "news/list") {
      definitions.push({
        id: "featured",
        accessorFn: (item) => Boolean(item.featured),
        size: 130,
        enableSorting: true,
        enableHiding: true,
        meta: { label: "Tin nổi bật" },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tin nổi bật" />
        ),
        cell: ({ row }) => {
          const item = row.original;
          const featured = Boolean(item.featured);
          return (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={featured}
                onCheckedChange={async (value) => {
                  const nextFeatured = Boolean(value);

                  if (nextFeatured && !featured) {
                    const featuredCount = records.filter(
                      (record) =>
                        record.id !== item.id &&
                        Boolean(record.featured),
                    ).length;

                    if (featuredCount >= MAX_FEATURED_NEWS) {
                      toast.error(
                        `Chỉ được chọn tối đa ${MAX_FEATURED_NEWS} tin nổi bật`,
                        {
                          description:
                            "Bỏ đánh dấu một tin nổi bật hiện tại trước khi chọn tin khác.",
                        },
                      );
                      return;
                    }
                  }

                  await updateRecord(config.key, item.id, {
                    ...item,
                    featured: nextFeatured,
                  });
                  toast.success(
                    nextFeatured
                      ? "Đã đánh dấu tin nổi bật"
                      : "Đã bỏ đánh dấu tin nổi bật",
                  );
                }}
                aria-label={
                  featured
                    ? "Bỏ đánh dấu tin nổi bật"
                    : "Đánh dấu tin nổi bật"
                }
              />
              <span className="text-xs text-muted-foreground">
                {featured ? "Có" : "Không"}
              </span>
            </div>
          );
        },
      });

      definitions.push({
        id: "highlightHome",
        accessorFn: (item) => Boolean(item.highlightHome),
        size: 150,
        enableSorting: true,
        enableHiding: true,
        meta: { label: "Trang chủ" },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Trang chủ" />
        ),
        cell: ({ row }) => {
          const item = row.original;
          const highlighted = Boolean(item.highlightHome);

          return (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={highlighted}
                onCheckedChange={async (value) => {
                  const nextHighlight = Boolean(value);

                  if (nextHighlight && !highlighted) {
                    const highlightedCount = records.filter(
                      (record) =>
                        record.id !== item.id &&
                        Boolean(record.highlightHome),
                    ).length;

                    if (highlightedCount >= MAX_HOME_HIGHLIGHTED_NEWS) {
                      toast.error(
                        `Trang chủ chỉ được chọn tối đa ${MAX_HOME_HIGHLIGHTED_NEWS} tin`,
                        {
                          description:
                            "Bỏ chọn một tin đang hiển thị trên Trang chủ trước khi chọn tin khác.",
                        },
                      );
                      return;
                    }
                  }

                  await updateRecord(config.key, item.id, {
                    ...item,
                    highlightHome: nextHighlight,
                  });
                  toast.success(
                    nextHighlight
                      ? "Đã thêm tin vào Trang chủ"
                      : "Đã bỏ tin khỏi Trang chủ",
                  );
                }}
                aria-label={
                  highlighted
                    ? "Bỏ tin khỏi Trang chủ"
                    : "Hiển thị tin trên Trang chủ"
                }
              />
              <span className="text-xs text-muted-foreground">
                {highlighted ? "Có" : "Không"}
              </span>
            </div>
          );
        },
      });
    }

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
            {mutableCollection ? (
              <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(item)}>
                <Trash2 /> Xóa
              </Button>
            ) : null}
          </div>
        );
      },
    });

    return definitions;
  }, [
    baseHref,
    config,
    imageManager,
    mutableCollection,
    records,
    replaceImage,
    updateRecord,
  ]);

  // TanStack Table intentionally returns mutable table methods.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredRecords,
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

  if (loadingApiList) {
    return <ResourceListPageFallback />;
  }

  if (apiListError) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center p-6 text-center">
        <div>
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-brand">
            <FolderOpen className="size-5" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">Không thể tải danh sách</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {apiListError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8">
      <AdminBreadcrumb items={[...getResourceBreadcrumb(config), { label: config.title }]} />
      <div className="mt-4">
        <AdminPageHeader
          title={config.title}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              {!imageManager && mutableCollection ? (
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
              title={debouncedQuery || hasResourceFilter ? "Không tìm thấy nội dung" : `Chưa có ${config.singular.toLocaleLowerCase("vi")}`}
              description={debouncedQuery || hasResourceFilter ? "Thử từ khóa khác hoặc xóa bộ lọc hiện tại." : mutableCollection ? "Thêm nội dung đầu tiên cho danh sách này." : "Danh sách cố định hiện chưa có dữ liệu để chỉnh sửa."}
              actionLabel={debouncedQuery || hasResourceFilter ? "Xóa bộ lọc" : mutableCollection ? `Thêm ${config.singular.toLocaleLowerCase("vi")}` : undefined}
              href={debouncedQuery || hasResourceFilter || !mutableCollection ? undefined : `${baseHref}/new`}
              onAction={
                debouncedQuery || hasResourceFilter
                  ? () => {
                      setQuery("");
                      setProjectCategoryFilter("all");
                      setProjectHighlightFilter("all");
                      setNewsFeaturedFilter("all");
                    }
                  : undefined
              }
            />
          }
        >
          <div role="toolbar" className="flex w-full flex-col items-start justify-between gap-2 p-1 lg:flex-row lg:items-center">
            {!imageManager ? (
              <div className="flex w-full flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap">
                <label className="relative block w-full sm:min-w-72 sm:max-w-md sm:flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Tìm ${config.singular.toLocaleLowerCase("vi")}...`} className="h-8 pl-9" />
                </label>

                {config.key === "news/list" ? (
                  <Select
                    value={newsFeaturedFilter}
                    onValueChange={(value) =>
                      setNewsFeaturedFilter(
                        (value ?? "all") as BooleanListFilter,
                      )
                    }
                  >
                    <SelectTrigger className="w-full sm:w-56">
                      <SelectValue>
                        {(selectedValue) =>
                          `Tin nổi bật: ${formatBooleanFilterLabel(
                            String(selectedValue ?? "all"),
                          )}`
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả tin</SelectItem>
                      <SelectItem value="yes">Tin nổi bật</SelectItem>
                      <SelectItem value="no">Không nổi bật</SelectItem>
                    </SelectContent>
                  </Select>
                ) : null}

                {config.key === "projects/list" ? (
                  <>
                    <Select
                      value={projectCategoryFilter}
                      onValueChange={(value) =>
                        setProjectCategoryFilter(value ?? "all")
                      }
                    >
                      <SelectTrigger className="w-full sm:w-64">
                        <SelectValue>
                          {(selectedValue) =>
                            `Danh mục: ${
                              String(selectedValue ?? "all") === "all"
                                ? "Tất cả"
                                : String(selectedValue)
                            }`
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả danh mục</SelectItem>
                        {projectCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={projectHighlightFilter}
                      onValueChange={(value) =>
                        setProjectHighlightFilter(
                          (value ?? "all") as BooleanListFilter,
                        )
                      }
                    >
                      <SelectTrigger className="w-full sm:w-52">
                        <SelectValue>
                          {(selectedValue) =>
                            `Tiêu biểu: ${formatBooleanFilterLabel(
                              String(selectedValue ?? "all"),
                            )}`
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả dự án</SelectItem>
                        <SelectItem value="yes">Dự án tiêu biểu</SelectItem>
                        <SelectItem value="no">Không tiêu biểu</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                ) : null}
              </div>
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

function formatBooleanFilterLabel(value: string) {
  if (value === "yes") return "Có";
  if (value === "no") return "Không";
  return "Tất cả";
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

function ListMessage({ title, description, actionLabel, href, onAction }: { title: string; description: string; actionLabel?: string; href?: string; onAction?: () => void }) {
  return (
    <div className="grid min-h-72 place-items-center p-6 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-brand"><FolderOpen className="size-5" /></span>
        <h3 className="mt-4 font-semibold">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
        {href && actionLabel ? (
          <Button className="mt-4" nativeButton={false} render={<Link href={href} />}><Plus /> {actionLabel}</Button>
        ) : onAction && actionLabel ? (
          <Button className="mt-4" onClick={onAction}><Search /> {actionLabel}</Button>
        ) : null}
      </div>
    </div>
  );
}
