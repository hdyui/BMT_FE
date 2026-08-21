"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  Eye,
  FilePenLine,
  FolderOpen,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { ImageField } from "@/features/admin/components/ImageField";
import { projectContentService } from "@/lib/admin/services/project-content.service";
import type {
  AdminProjectCard,
  ContentStatus,
  ViewState,
} from "@/lib/admin/types/content";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { Input } from "@/lib/components/ui/input";
import { Skeleton } from "@/lib/components/ui/skeleton";

function createEmptyCard(order: number): AdminProjectCard {
  return {
    id: `project-card-local-${Date.now()}`,
    title: "",
    slug: "",
    thumbnail: "/images/projects/project-01.png",
    imageAlt: "",
    category: "Nhà ở",
    href: "/du-an/nha-pho-2-tang-quan-9",
    status: "draft",
    order,
    createdAt: new Intl.DateTimeFormat("vi-VN").format(new Date()),
  };
}

function ProjectTableLoading() {
  return (
    <div className="p-5 sm:p-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border-b py-3 last:border-b-0"
        >
          <Skeleton className="size-11 shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-4 w-48 max-w-full" />
            <Skeleton className="mt-2 h-3 w-28" />
          </div>
          <Skeleton className="h-6 w-20" />
          <Skeleton className="hidden h-4 w-24 sm:block" />
        </div>
      ))}
    </div>
  );
}

function ProjectTableMessage({
  error,
  onCreate,
}: {
  error?: boolean;
  onCreate: () => void;
}) {
  return (
    <div className="grid min-h-72 place-items-center p-6 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-brand">
          {error ? (
            <AlertCircle className="size-5" />
          ) : (
            <FolderOpen className="size-5" />
          )}
        </span>
        <h3 className="mt-4 font-semibold">
          {error ? "Không thể tải danh sách dự án" : "Chưa có dự án nào"}
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {error
            ? "Đây là trạng thái lỗi mẫu để sẵn sàng nối API trong phase sau."
            : "Tạo nội dung Projects Page Card đầu tiên. Dữ liệu chỉ tồn tại trong phiên demo."}
        </p>
        <Button className="mt-4" onClick={onCreate}>
          {error ? <Check /> : <Plus />}
          {error ? "Thử lại" : "Tạo dự án"}
        </Button>
      </div>
    </div>
  );
}

export function ProjectListPanel({
  cards,
  categories,
  createOpen,
  onCreateOpenChange,
  onChange,
}: {
  cards: AdminProjectCard[];
  categories: string[];
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
  onChange: (cards: AdminProjectCard[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<"all" | ContentStatus>("all");
  const [viewState, setViewState] = useState<ViewState>("normal");
  const [selected, setSelected] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AdminProjectCard>(
    createEmptyCard(cards.length + 1),
  );
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminProjectCard | null>(null);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");
    return cards.filter((project) => {
      const matchesQuery =
        !normalizedQuery ||
        project.title.toLocaleLowerCase("vi").includes(normalizedQuery) ||
        project.slug.toLocaleLowerCase("vi").includes(normalizedQuery);
      const matchesCategory =
        category === "all" || project.category === category;
      const matchesStatus = status === "all" || project.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [cards, category, query, status]);

  const editorOpen = createOpen || editingId !== null;

  function openCreate() {
    setEditingId(null);
    setDraft(createEmptyCard(cards.length + 1));
    onCreateOpenChange(true);
  }

  function openEdit(project: AdminProjectCard) {
    onCreateOpenChange(false);
    setEditingId(project.id);
    setDraft(structuredClone(project));
  }

  function closeEditor() {
    onCreateOpenChange(false);
    setEditingId(null);
    setDraft(createEmptyCard(cards.length + 1));
  }

  async function saveProject() {
    setSaving(true);
    try {
      const saved = await projectContentService.saveCard(draft);
      const exists = cards.some((project) => project.id === saved.id);
      onChange(
        exists
          ? cards.map((project) => (project.id === saved.id ? saved : project))
          : [...cards, saved],
      );
      toast.success(exists ? "Đã cập nhật bản nháp" : "Đã tạo dự án cục bộ", {
        description: "Bản nháp sẽ mất khi tải lại trang.",
      });
      closeEditor();
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    onChange(cards.filter((project) => project.id !== deleteTarget.id));
    setSelected((current) =>
      current.filter((id) => id !== deleteTarget.id),
    );
    toast.success("Đã xóa khỏi danh sách cục bộ", {
      description: "Thay đổi chỉ tồn tại trong phiên hiện tại.",
    });
    setDeleteTarget(null);
  }

  function toggleSelected(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-[0_12px_36px_rgb(36_33_34/.035)]">
      <div className="border-b p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_190px_160px_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo tên hoặc slug..."
              className="h-10 pl-9"
            />
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
            aria-label="Lọc danh mục"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "all" | ContentStatus)
            }
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
            aria-label="Lọc trạng thái"
          >
            <option value="all">Mọi trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
          <select
            value={viewState}
            onChange={(event) => setViewState(event.target.value as ViewState)}
            className="h-10 rounded-lg border border-input bg-muted/50 px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
            aria-label="Mô phỏng trạng thái UI"
          >
            <option value="normal">Trạng thái: Normal</option>
            <option value="loading">Trạng thái: Loading</option>
            <option value="empty">Trạng thái: Empty</option>
            <option value="error">Trạng thái: Error</option>
          </select>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {filtered.length} nội dung Projects Page Card
            {selected.length > 0 && ` | ${selected.length} đã chọn`}
          </span>
          <span>Chế độ kiểm tra giúp xem trước Loading, Empty và Error.</span>
        </div>
      </div>

      {viewState === "loading" && <ProjectTableLoading />}
      {viewState === "empty" && (
        <ProjectTableMessage onCreate={openCreate} />
      )}
      {viewState === "error" && (
        <ProjectTableMessage error onCreate={() => setViewState("normal")} />
      )}
      {viewState === "normal" && filtered.length === 0 && (
        <ProjectTableMessage onCreate={openCreate} />
      )}
      {viewState === "normal" && filtered.length > 0 && (
        <div className="admin-scrollbar overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-muted/45 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      filtered.length > 0 &&
                      filtered.every((project) => selected.includes(project.id))
                    }
                    onChange={(event) =>
                      setSelected(
                        event.target.checked
                          ? Array.from(
                              new Set([
                                ...selected,
                                ...filtered.map((project) => project.id),
                              ]),
                            )
                          : selected.filter(
                              (id) =>
                                !filtered.some((project) => project.id === id),
                            ),
                      )
                    }
                    className="size-4 accent-[var(--brand)]"
                    aria-label="Chọn tất cả dự án"
                  />
                </th>
                <th className="px-3 py-3">Dự án</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thứ tự</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="w-14 px-4 py-3"><span className="sr-only">Thao tác</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => (
                <tr
                  key={project.id}
                  className="border-t transition-colors hover:bg-muted/40"
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.includes(project.id)}
                      onChange={() => toggleSelected(project.id)}
                      className="size-4 accent-[var(--brand)]"
                      aria-label={`Chọn ${project.title}`}
                    />
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={project.thumbnail}
                          alt={project.imageAlt}
                          fill
                          unoptimized={project.thumbnail.startsWith("blob:")}
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-[260px] truncate font-medium">
                          {project.title}
                        </p>
                        <p className="mt-0.5 max-w-[260px] truncate text-xs text-muted-foreground">
                          /{project.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {project.category}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge
                      variant={
                        project.status === "published" ? "success" : "warning"
                      }
                    >
                      {project.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-muted-foreground">
                    {String(project.order).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-muted-foreground">
                    {project.createdAt}
                  </td>
                  <td className="px-4 py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex size-8 items-center justify-center rounded-lg outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30"
                        aria-label={`Thao tác với ${project.title}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="admin-theme-surface w-40"
                      >
                        <DropdownMenuItem
                          render={
                            <Link href={project.href} target="_blank" />
                          }
                          className="py-2"
                        >
                          <Eye /> Xem website
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openEdit(project)}
                          className="py-2"
                        >
                          <FilePenLine /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleteTarget(project)}
                          className="py-2"
                        >
                          <Trash2 /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={editorOpen} onOpenChange={(open) => !open && closeEditor()}>
        <DialogContent className="admin-theme-surface w-[min(60rem,calc(100%-2rem))] max-w-none">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Chỉnh sửa Project Card" : "Thêm Project Card"}
            </DialogTitle>
            <DialogDescription>
              Form này chỉ chỉnh content của Projects Page Card. Project Detail
              được quản lý ở tab riêng.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,.8fr)]">
            <div className="grid content-start gap-4 rounded-2xl border p-4 sm:p-5">
              <label className="grid gap-1.5 text-xs font-semibold">
                Tên dự án
                <Input
                  value={draft.title}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  className="h-10"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-semibold">
                  Slug
                  <Input
                    value={draft.slug}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        slug: event.target.value,
                      }))
                    }
                    className="h-10"
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-semibold">
                  Thứ tự
                  <Input
                    type="number"
                    min={1}
                    value={draft.order}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        order: Number(event.target.value),
                      }))
                    }
                    className="h-10"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-semibold">
                  Danh mục
                  <select
                    value={draft.category}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        category: event.target.value,
                      }))
                    }
                    className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-xs font-semibold">
                  Trạng thái
                  <select
                    value={draft.status}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        status: event.target.value as ContentStatus,
                      }))
                    }
                    className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="published">Đã xuất bản</option>
                  </select>
                </label>
              </div>
              <label className="grid gap-1.5 text-xs font-semibold">
                Liên kết
                <Input
                  value={draft.href}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      href: event.target.value,
                    }))
                  }
                  className="h-10"
                />
              </label>
            </div>

            <ImageField
              label="Ảnh Project Card"
              value={draft.thumbnail}
              alt={draft.imageAlt}
              ratio="1.04:1"
              recommendedSize="1200 × 1150px"
              onChange={(value) =>
                setDraft((current) => ({ ...current, thumbnail: value }))
              }
              onAltChange={(value) =>
                setDraft((current) => ({ ...current, imageAlt: value }))
              }
            />
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
            <Button
              onClick={saveProject}
              disabled={saving || !draft.title.trim() || !draft.slug.trim()}
            >
              {saving ? "Đang lưu..." : "Save Draft"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="admin-theme-surface max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa Project Card?</DialogTitle>
            <DialogDescription>
              “{deleteTarget?.title}” sẽ bị xóa khỏi dữ liệu tạm của phiên này.
              Thao tác không xóa file hoặc dữ liệu thật.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 /> Xóa nội dung
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
