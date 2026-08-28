"use client";

import Image from "next/image";
import { useState } from "react";
import { FilePenLine, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ImageField } from "@/features/admin/components/ImageField";
import type { AdminProjectCategory } from "@/features/admin/lib/types/content";
import { Button } from "@/features/admin/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/features/admin/components/ui/dialog";
import { Input } from "@/features/admin/components/ui/input";

export function ProjectTaxonomyPanel({
  categories,
  onChange,
}: {
  categories: AdminProjectCategory[];
  onChange: (categories: AdminProjectCategory[]) => void;
}) {
  const [draft, setDraft] = useState<AdminProjectCategory | null>(null);

  function addCategory() {
    setDraft({
      id: `project-category-local-${Date.now()}`,
      label: "Danh mục mới",
      icon: "/images/projects/category-house-active.png",
      activeIcon: "/images/projects/category-house-active.png",
      mobileIcon: "/images/projects/mobile/category-house.png",
      mobileActiveIcon: "/images/projects/mobile/category-house-active.png",
      order: categories.length + 1,
    });
  }

  function saveCategory() {
    if (!draft) return;
    const exists = categories.some((category) => category.id === draft.id);
    onChange(
      exists
        ? categories.map((category) =>
            category.id === draft.id ? draft : category,
          )
        : [...categories, draft],
    );
    toast.success("Đã cập nhật danh mục");
    setDraft(null);
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-[0_12px_36px_rgb(36_33_34/.035)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Danh mục dự án</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Hình minh họa cho từng danh mục trên máy tính và điện thoại
          </p>
        </div>
        <Button variant="outline" onClick={addCategory}>
          <Plus /> Thêm danh mục
        </Button>
      </div>

      <div className="divide-y">
        {categories.map((category) => (
          <article
            key={category.id}
            className="grid gap-4 px-5 py-4 transition-colors hover:bg-muted/35 sm:px-6 lg:grid-cols-[minmax(220px,1fr)_minmax(300px,1.2fr)_auto] lg:items-center"
          >
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-sm font-semibold">{category.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Danh mục hiển thị trên trang Dự án
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                ["Máy tính", category.icon],
                ["Đang chọn", category.activeIcon],
                ["Điện thoại", category.mobileIcon],
                ["ĐT đang chọn", category.mobileActiveIcon],
              ].map(([label, src]) => (
                <div key={label} className="rounded-lg border bg-muted/45 p-2">
                  <div className="relative mx-auto size-8">
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="32px"
                    />
                  </div>
                  <p className="mt-1 truncate text-center text-[9px] text-muted-foreground">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDraft(structuredClone(category))}
                aria-label={`Chỉnh sửa ${category.label}`}
              >
                <FilePenLine />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  onChange(categories.filter((item) => item.id !== category.id));
                  toast.success("Đã xóa danh mục");
                }}
                aria-label={`Xóa ${category.label}`}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 />
              </Button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={draft !== null} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="admin-theme-surface w-[min(70rem,calc(100%-2rem))] max-w-none">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục dự án</DialogTitle>
            <DialogDescription>
              Cập nhật tên và hình minh họa của danh mục.
            </DialogDescription>
          </DialogHeader>
          {draft && (
            <div className="mt-5">
              <div className="grid gap-4 rounded-2xl border p-4 sm:p-5">
                <label className="grid gap-1.5 text-xs font-semibold">
                  Tên danh mục
                  <Input
                    value={draft.label}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? { ...current, label: event.target.value }
                          : current,
                      )
                    }
                    className="h-10"
                  />
                </label>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <ImageField
                  label="Hình trên máy tính"
                  value={draft.icon}
                  alt={`Hình minh họa ${draft.label}`}
                  onChange={(value) =>
                    setDraft((current) =>
                      current ? { ...current, icon: value } : current,
                    )
                  }
                />
                <ImageField
                  label="Hình khi được chọn trên máy tính"
                  value={draft.activeIcon}
                  alt={`Hình minh họa ${draft.label} khi được chọn`}
                  onChange={(value) =>
                    setDraft((current) =>
                      current ? { ...current, activeIcon: value } : current,
                    )
                  }
                />
                <ImageField
                  label="Hình trên điện thoại"
                  value={draft.mobileIcon}
                  alt={`Hình minh họa ${draft.label} trên điện thoại`}
                  onChange={(value) =>
                    setDraft((current) =>
                      current ? { ...current, mobileIcon: value } : current,
                    )
                  }
                />
                <ImageField
                  label="Hình khi được chọn trên điện thoại"
                  value={draft.mobileActiveIcon}
                  alt={`Hình minh họa ${draft.label} khi được chọn trên điện thoại`}
                  onChange={(value) =>
                    setDraft((current) =>
                      current
                        ? { ...current, mobileActiveIcon: value }
                        : current,
                    )
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
            <Button onClick={saveCategory}>Lưu bản nháp</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
