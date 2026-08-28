"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  functionalUpdate,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from "@tanstack/react-table";
import { Eye, FilePenLine, FolderOpen, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/features/admin/components/data-table/data-table";
import { DataTableColumnHeader } from "@/features/admin/components/data-table/data-table-column-header";
import { DataTableViewOptions } from "@/features/admin/components/data-table/data-table-view-options";
import { Badge } from "@/features/admin/components/ui/badge";
import { Button } from "@/features/admin/components/ui/button";
import { Checkbox } from "@/features/admin/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/features/admin/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/admin/components/ui/dropdown-menu";
import { Input } from "@/features/admin/components/ui/input";
import { Label } from "@/features/admin/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/admin/components/ui/select";
import { ImageField } from "@/features/admin/components/ImageField";
import { projectContentService } from "@/features/admin/services/project-content.service";
import type { AdminProjectCard, ContentStatus } from "@/features/admin/lib/types/content";

function createEmptyCard(order: number): AdminProjectCard {
  return {
    id: `project-card-local-${Date.now()}`,
    title: "",
    slug: "",
    thumbnail: "/images/projects/project-01.png",
    imageAlt: "",
    category: "Nhà ở",
    href: "/projects/nha-pho-2-tang-quan-9",
    status: "draft",
    order,
    createdAt: new Intl.DateTimeFormat("vi-VN").format(new Date()),
  };
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
  const [selected, setSelected] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AdminProjectCard>(createEmptyCard(cards.length + 1));
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminProjectCard | null>(null);

  const filtered = cards.filter((project) => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");
    const matchesQuery =
      !normalizedQuery ||
      project.title.toLocaleLowerCase("vi").includes(normalizedQuery) ||
      project.slug.toLocaleLowerCase("vi").includes(normalizedQuery);
    return (
      matchesQuery &&
      (category === "all" || project.category === category) &&
      (status === "all" || project.status === status)
    );
  });

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
      onChange(exists ? cards.map((project) => (project.id === saved.id ? saved : project)) : [...cards, saved]);
      toast.success(exists ? "Đã cập nhật bản nháp" : "Đã tạo dự án");
      closeEditor();
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    onChange(cards.filter((project) => project.id !== deleteTarget.id));
    setSelected((current) => current.filter((id) => id !== deleteTarget.id));
    toast.success("Đã xóa dự án khỏi danh sách");
    setDeleteTarget(null);
  }

  const columns: ColumnDef<AdminProjectCard>[] = [
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
          aria-label="Chọn tất cả dự án trên trang"
        />
      ),
      cell: ({ row }) => (
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(Boolean(value))} aria-label={`Chọn ${row.original.title}`} />
      ),
    },
    {
      id: "project",
      accessorFn: (project) => project.title,
      meta: { label: "Dự án" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Dự án" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border bg-muted">
            <Image
              src={row.original.thumbnail}
              alt={row.original.imageAlt}
              fill
              unoptimized={row.original.thumbnail.startsWith("blob:")}
              className="object-contain p-1"
              sizes="48px"
            />
          </div>
          <div className="min-w-0">
            <p className="max-w-[280px] truncate font-medium">{row.original.title}</p>
            <p className="mt-0.5 max-w-[280px] truncate text-xs text-muted-foreground">/{row.original.slug}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      enableSorting: false,
      meta: { label: "Danh mục" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Danh mục" />,
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.category}</span>,
    },
    {
      accessorKey: "status",
      enableSorting: false,
      meta: { label: "Trạng thái" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "published" ? "default" : "secondary"}
          className={row.original.status === "published" ? "bg-emerald-600 text-white" : undefined}
        >
          {row.original.status === "published" ? "Đã xuất bản" : "Bản nháp"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      enableSorting: false,
      meta: { label: "Ngày tạo" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
      cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{row.original.createdAt}</span>,
    },
    {
      id: "actions",
      size: 56,
      enableSorting: false,
      enableHiding: true,
      meta: { label: "Thao tác" },
      header: ({ column }) => (
        <div className="flex justify-center">
          <DataTableColumnHeader column={column} title="Thao tác" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />} aria-label={`Thao tác với ${row.original.title}`}>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem render={<Link href={row.original.href} target="_blank" />}><Eye /> Xem website</DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEdit(row.original)}><FilePenLine /> Chỉnh sửa</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(row.original)}><Trash2 /> Xóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const rowSelection: RowSelectionState = Object.fromEntries(selected.map((id) => [id, true]));
  // TanStack Table intentionally returns mutable table methods.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filtered,
    columns,
    state: { rowSelection },
    onRowSelectionChange: (updater) => {
      const next = functionalUpdate(updater, rowSelection);
      setSelected(Object.keys(next).filter((id) => next[id]));
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  return (
    <section>
      <DataTable
        table={table}
        emptyState={<ProjectTableMessage queryActive={Boolean(query || category !== "all" || status !== "all")} onCreate={openCreate} onReset={() => { setQuery(""); setCategory("all"); setStatus("all"); }} />}
      >
        <div role="toolbar" className="flex w-full flex-col items-start justify-between gap-2 p-1 lg:flex-row lg:items-center">
          <div className="grid flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(240px,1fr)_190px_170px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên hoặc đường dẫn..." className="h-8 pl-9" />
            </label>
            <Select value={category} onValueChange={(value) => setCategory(value ?? "all")}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(value) => setStatus((value ?? "all") as "all" | ContentStatus)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Mọi trạng thái</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DataTableViewOptions table={table} />
        </div>
      </DataTable>

      <Dialog open={editorOpen} onOpenChange={(open) => !open && closeEditor()}>
        <DialogContent className="admin-theme-surface w-[min(60rem,calc(100%-2rem))] max-w-none">
          <DialogHeader>
            <DialogTitle>{editingId ? "Chỉnh sửa dự án" : "Thêm dự án"}</DialogTitle>
            <DialogDescription>Cập nhật thông tin hiển thị trong danh sách dự án.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,.8fr)]">
            <div className="grid content-start gap-4 rounded-xl border p-4 sm:p-5">
              <div className="grid gap-2">
                <Label htmlFor="project-title">Tên dự án</Label>
                <Input id="project-title" value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-slug">Đường dẫn</Label>
                <Input id="project-slug" value={draft.slug} onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Danh mục</Label>
                  <Select value={draft.category} onValueChange={(value) => value && setDraft((current) => ({ ...current, category: value }))}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Trạng thái</Label>
                  <Select value={draft.status} onValueChange={(value) => value && setDraft((current) => ({ ...current, status: value as ContentStatus }))}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                      <SelectItem value="published">Đã xuất bản</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-link">Liên kết</Label>
                <Input id="project-link" value={draft.href} onChange={(event) => setDraft((current) => ({ ...current, href: event.target.value }))} />
              </div>
            </div>
            <ImageField
              label="Ảnh đại diện dự án"
              value={draft.thumbnail}
              alt={draft.imageAlt}
              ratio="1.04:1"
              recommendedSize="1200 × 1150px"
              onChange={(value) => setDraft((current) => ({ ...current, thumbnail: value }))}
            />
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
            <Button onClick={saveProject} disabled={saving || !draft.title.trim() || !draft.slug.trim()}>
              {saving ? "Đang lưu..." : "Lưu bản nháp"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="admin-theme-surface max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa dự án?</DialogTitle>
            <DialogDescription>
              “{deleteTarget?.title}” sẽ bị xóa khỏi dữ liệu tạm của phiên này. Thao tác không xóa file hoặc dữ liệu thật.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
            <Button variant="destructive" onClick={confirmDelete}><Trash2 /> Xóa nội dung</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ProjectTableMessage({ queryActive, onCreate, onReset }: { queryActive: boolean; onCreate: () => void; onReset: () => void }) {
  return (
    <div className="grid min-h-72 place-items-center p-6 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-brand"><FolderOpen className="size-5" /></span>
        <h3 className="mt-4 font-semibold">{queryActive ? "Không tìm thấy dự án" : "Chưa có dự án nào"}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {queryActive ? "Thử từ khóa khác hoặc xóa các bộ lọc hiện tại." : "Thêm dự án đầu tiên vào danh sách."}
        </p>
        <Button className="mt-4" onClick={queryActive ? onReset : onCreate}>
          {queryActive ? <Search /> : <Plus />} {queryActive ? "Xóa bộ lọc" : "Tạo dự án"}
        </Button>
      </div>
    </div>
  );
}
