"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowDown, ArrowUp, FilePenLine, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ImageField } from "@/features/admin/components/ImageField";
import type { AdminRelatedProject } from "@/lib/admin/types/content";
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
import { Input } from "@/lib/components/ui/input";

export function RelatedProjectsPanel({
  projects,
  onChange,
}: {
  projects: AdminRelatedProject[];
  onChange: (projects: AdminRelatedProject[]) => void;
}) {
  const [draft, setDraft] = useState<AdminRelatedProject | null>(null);

  function move(id: string, direction: -1 | 1) {
    const index = projects.findIndex((project) => project.id === id);
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    const currentItem = next[index];
    const targetItem = next[target];
    next[index] = { ...targetItem, order: index + 1 };
    next[target] = { ...currentItem, order: target + 1 };
    onChange(next);
  }

  function addProject() {
    setDraft({
      id: `related-project-local-${Date.now()}`,
      title: "Dự án liên quan mới",
      image: "/images/projects/project-01.png",
      imageAlt: "",
      href: "/du-an/nha-pho-2-tang-quan-9",
      order: projects.length + 1,
    });
  }

  function save() {
    if (!draft) return;
    const exists = projects.some((project) => project.id === draft.id);
    onChange(
      exists
        ? projects.map((project) =>
            project.id === draft.id ? draft : project,
          )
        : [...projects, draft],
    );
    toast.success("Đã cập nhật Related Projects trong local state");
    setDraft(null);
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-[0_12px_36px_rgb(36_33_34/.035)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Related Projects</h2>
            <Badge variant="secondary">P2</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Danh sách này không tự động liên kết với Project list hoặc detail
          </p>
        </div>
        <Button variant="outline" onClick={addProject}>
          <Plus /> Thêm nội dung
        </Button>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
        {projects.map((project, index) => (
          <article
            key={project.id}
            className="group overflow-hidden rounded-2xl border bg-background"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                unoptimized={project.image.startsWith("blob:")}
                className="object-cover transition-transform duration-200 group-hover:scale-[1.025]"
                sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 25vw"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-[11px] font-bold text-brand">
                  {String(project.order).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                    {project.title}
                  </h3>
                  <p className="mt-1 truncate text-[11px] text-muted-foreground">
                    {project.href}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end gap-1 border-t pt-3">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => move(project.id, -1)}
                  disabled={index === 0}
                  aria-label={`Di chuyển ${project.title} lên`}
                >
                  <ArrowUp />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => move(project.id, 1)}
                  disabled={index === projects.length - 1}
                  aria-label={`Di chuyển ${project.title} xuống`}
                >
                  <ArrowDown />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDraft(structuredClone(project))}
                  aria-label={`Chỉnh sửa ${project.title}`}
                >
                  <FilePenLine />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    onChange(projects.filter((item) => item.id !== project.id));
                    toast.success("Đã xóa khỏi local state");
                  }}
                  aria-label={`Xóa ${project.title}`}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={draft !== null} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="admin-theme-surface w-[min(58rem,calc(100%-2rem))] max-w-none">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa dự án liên quan</DialogTitle>
            <DialogDescription>
              Content này được lưu riêng, không cập nhật Project Card hoặc
              Project Detail cùng tên.
            </DialogDescription>
          </DialogHeader>
          {draft && (
            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
              <div className="grid content-start gap-4 rounded-2xl border p-4 sm:p-5">
                <label className="grid gap-1.5 text-xs font-semibold">
                  Tiêu đề
                  <Input
                    value={draft.title}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? { ...current, title: event.target.value }
                          : current,
                      )
                    }
                    className="h-10"
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-semibold">
                  Liên kết
                  <Input
                    value={draft.href}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? { ...current, href: event.target.value }
                          : current,
                      )
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
                      setDraft((current) =>
                        current
                          ? { ...current, order: Number(event.target.value) }
                          : current,
                      )
                    }
                    className="h-10"
                  />
                </label>
              </div>
              <ImageField
                label="Ảnh dự án liên quan"
                value={draft.image}
                alt={draft.imageAlt}
                ratio="4:3"
                recommendedSize="1200 × 900px"
                onChange={(value) =>
                  setDraft((current) =>
                    current ? { ...current, image: value } : current,
                  )
                }
                onAltChange={(value) =>
                  setDraft((current) =>
                    current ? { ...current, imageAlt: value } : current,
                  )
                }
              />
            </div>
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
            <Button onClick={save}>Save Draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
