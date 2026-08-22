"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Eye,
  FilePenLine,
  FolderOpen,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { LockedDesignNotice } from "@/features/admin/components/LockedDesignNotice";
import { AdminBreadcrumb } from "@/features/admin/components/editor/AdminBreadcrumb";
import { DeleteContentDialog } from "@/features/admin/components/editor/DeleteContentDialog";
import { useAdminCrud } from "@/features/admin/components/editor/AdminCrudProvider";
import type {
  AdminCrudRecord,
  AdminResourceConfig,
} from "@/lib/admin/types/crud";
import type { ViewState } from "@/lib/admin/types/content";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { Input } from "@/lib/components/ui/input";
import { Skeleton } from "@/lib/components/ui/skeleton";

export function ResourceListPage({ config }: { config: AdminResourceConfig }) {
  const { getRecords, removeRecord, reorderRecords } = useAdminCrud();
  const records = getRecords(config.key);
  const [query, setQuery] = useState("");
  const [viewState, setViewState] = useState<ViewState>("normal");
  const [deleteTarget, setDeleteTarget] = useState<AdminCrudRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);

  const baseHref = `/admin/${config.module}/${config.path}`;
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    if (!normalized) return records;
    return records.filter((item) =>
      String(item[config.titleField] ?? "")
        .toLocaleLowerCase("vi")
        .includes(normalized),
    );
  }, [config.titleField, query, records]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeRecord(config.key, deleteTarget.id);
      toast.success("Đã xóa nội dung", {
        description: "Repository adapter đã nhận thay đổi.",
      });
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  async function moveRecord(recordId: string, direction: -1 | 1) {
    const currentIndex = records.findIndex((item) => item.id === recordId);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= records.length)
      return;

    const next = [...records];
    [next[currentIndex], next[targetIndex]] = [
      next[targetIndex],
      next[currentIndex],
    ];
    const normalized = config.orderField
      ? next.map((item, index) => ({
          ...item,
          [config.orderField as string]: index + 1,
        }))
      : next;

    setReordering(true);
    try {
      await reorderRecords(config.key, normalized);
      toast.success("Đã cập nhật thứ tự");
    } finally {
      setReordering(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8">
      <AdminBreadcrumb
        items={[
          { label: config.moduleLabel, href: config.moduleHref },
          { label: config.title },
        ]}
      />
      <div className="mt-4">
        <AdminPageHeader
          title={config.title}
          description={config.description}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              {config.key === "projects/list" && (
                <Button variant="outline" nativeButton={false} render={<Link href="/admin/projects/details" />}>
                  Chi tiết dự án
                </Button>
              )}
              <Button nativeButton={false} render={<Link href={`${baseHref}/new`} />}>
                <Plus /> Thêm {config.singular.toLocaleLowerCase("vi")}
              </Button>
            </div>
          }
        />
      </div>
      <LockedDesignNotice className="mt-6" />

      <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-[0_12px_36px_rgb(36_33_34/.035)]">
        <div className="border-b p-4 sm:p-5">
          <div>
            <label className="relative block">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Tìm ${config.singular.toLocaleLowerCase("vi")}...`}
                className="h-10 pl-9"
              />
            </label>
          </div>
          <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
            <span>{filtered.length} bản ghi</span>
            <span>Persistence được giao tiếp qua repository adapter.</span>
          </div>
        </div>

        {viewState === "loading" && <ListLoading />}
        {viewState === "empty" && (
          <ListMessage
            title={`Chưa có ${config.singular}`}
            description="Tạo nội dung đầu tiên để đánh giá flow quản trị."
            actionLabel={`Thêm ${config.singular.toLocaleLowerCase("vi")}`}
            href={`${baseHref}/new`}
          />
        )}
        {viewState === "error" && (
          <ListMessage
            error
            title="Không thể tải nội dung"
            description="Trạng thái Error-ready cho giai đoạn tích hợp dữ liệu sau này."
            actionLabel="Thử lại"
            onAction={() => setViewState("normal")}
          />
        )}
        {viewState === "normal" && filtered.length === 0 && (
          <ListMessage
            title="Không tìm thấy nội dung"
            description="Thử từ khóa khác hoặc tạo nội dung mới."
            actionLabel={`Thêm ${config.singular.toLocaleLowerCase("vi")}`}
            href={`${baseHref}/new`}
          />
        )}
        {viewState === "normal" && filtered.length > 0 && (
          <div className="admin-scrollbar overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-muted/45 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                <tr>
                  <th className="w-16 px-5 py-3">#</th>
                  {config.previewField && <th className="w-20 px-3 py-3">Preview</th>}
                  <th className="px-4 py-3">Nội dung</th>
                  {config.enabledField && <th className="px-4 py-3">Trạng thái</th>}
                  {config.orderField && <th className="px-4 py-3">Thứ tự</th>}
                  <th className="w-36 px-4 py-3">Sắp xếp</th>
                  <th className="w-16 px-4 py-3">
                    <span className="sr-only">Thao tác</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, filteredIndex) => {
                  const sourceIndex = records.findIndex((record) => record.id === item.id);
                  const title = String(item[config.titleField] ?? config.singular);
                  const preview = config.previewField
                    ? String(item[config.previewField] ?? "")
                    : "";
                  const enabled = config.enabledField
                    ? Boolean(item[config.enabledField])
                    : true;

                  return (
                    <tr className="border-t transition-colors hover:bg-muted/35" key={item.id}>
                      <td className="px-5 py-3.5 text-xs tabular-nums text-muted-foreground">
                        {String(filteredIndex + 1).padStart(2, "0")}
                      </td>
                      {config.previewField && (
                        <td className="px-3 py-3.5">
                          <div className="relative size-12 overflow-hidden rounded-lg border bg-muted">
                            {preview ? (
                              <Image
                                src={preview}
                                alt={title}
                                fill
                                unoptimized={preview.startsWith("blob:")}
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <span className="grid size-full place-items-center text-[10px] text-muted-foreground">
                                No image
                              </span>
                            )}
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3.5">
                        <Link
                          href={`${baseHref}/${item.id}`}
                          className="font-medium hover:text-brand hover:underline hover:underline-offset-4"
                        >
                          {title}
                        </Link>
                        <p className="mt-1 text-xs text-muted-foreground">{item.id}</p>
                      </td>
                      {config.enabledField && (
                        <td className="px-4 py-3.5">
                          <Badge variant={enabled ? "success" : "secondary"}>
                            {enabled ? "Hiển thị" : "Đang ẩn"}
                          </Badge>
                        </td>
                      )}
                      {config.orderField && (
                        <td className="px-4 py-3.5 tabular-nums text-muted-foreground">
                          {String(item[config.orderField] ?? sourceIndex + 1).padStart(2, "0")}
                        </td>
                      )}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={reordering || sourceIndex === 0}
                            aria-label={`Di chuyển ${title} lên`}
                            onClick={() => moveRecord(item.id, -1)}
                          >
                            <ArrowUp />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={reordering || sourceIndex === records.length - 1}
                            aria-label={`Di chuyển ${title} xuống`}
                            onClick={() => moveRecord(item.id, 1)}
                          >
                            <ArrowDown />
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="inline-flex size-8 items-center justify-center rounded-lg outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30"
                            aria-label={`Thao tác với ${title}`}
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="admin-theme-surface w-44">
                            <DropdownMenuItem render={<Link href={`${baseHref}/${item.id}`} />}>
                              <Eye /> Xem / Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem render={<Link href={`${baseHref}/${item.id}`} />}>
                              <FilePenLine /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(item)}>
                              <Trash2 /> Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <DeleteContentDialog
        open={Boolean(deleteTarget)}
        title={`Xóa ${config.singular}?`}
        itemLabel={String(deleteTarget?.[config.titleField] ?? config.singular)}
        deleting={deleting}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function ListLoading() {
  return (
    <div className="space-y-1 p-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="flex items-center gap-4 border-b py-3 last:border-0" key={index}>
          <Skeleton className="size-11 shrink-0 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-4 w-48 max-w-full" />
            <Skeleton className="mt-2 h-3 w-28" />
          </div>
          <Skeleton className="h-7 w-20" />
        </div>
      ))}
    </div>
  );
}

function ListMessage({
  error,
  title,
  description,
  actionLabel,
  href,
  onAction,
}: {
  error?: boolean;
  title: string;
  description: string;
  actionLabel: string;
  href?: string;
  onAction?: () => void;
}) {
  return (
    <div className="grid min-h-72 place-items-center p-6 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-brand">
          {error ? <AlertCircle className="size-5" /> : <FolderOpen className="size-5" />}
        </span>
        <h3 className="mt-4 font-semibold">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        {href ? (
          <Button className="mt-4" nativeButton={false} render={<Link href={href} />}>
            {error ? <AlertCircle /> : <Plus />}
            {actionLabel}
          </Button>
        ) : (
          <Button className="mt-4" onClick={onAction}>
            {error ? <AlertCircle /> : <Plus />}
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
