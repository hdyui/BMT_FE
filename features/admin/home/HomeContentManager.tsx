"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Eye,
  ImageIcon,
  Layers3,
  Plus,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import {
  StickyEditorActions,
  useEditorActionsVisibility,
} from "@/features/admin/components/editor/EditorTopActions";
import {
  confirmEditorSave,
  useUnsavedChangesGuard,
} from "@/features/admin/components/editor/unsaved-changes";
import { ImageField } from "@/features/admin/components/ImageField";
import { HomeHeroPreviewDialog } from "@/features/admin/home/HomeHeroPreviewDialog";
import { homeContentService } from "@/features/admin/services/home-content.service";
import type { HomeHeroSlideContent } from "@/features/admin/lib/types/content";
import { Button } from "@/features/admin/components/ui/button";
import { Input } from "@/features/admin/components/ui/input";
import { Textarea } from "@/features/admin/components/ui/textarea";
import { Switch } from "@/features/admin/components/ui/switch";
import { cn } from "@/shared/lib/utils";

const homeSections = [
  {
    title: "Ảnh mở đầu Trang chủ",
    description: "Tiêu đề, nút bấm, hình ảnh và trạng thái hiển thị.",
    priority: "P1",
    count: "4 slide",
  },
  {
    title: "Dự án tiêu biểu",
    description: "Các dự án nổi bật hiển thị trên Trang chủ.",
    priority: "P1",
    count: "32 item",
  },
  {
    title: "Dịch vụ nổi bật",
    description: "Nội dung và hình ảnh của các dịch vụ nổi bật.",
    priority: "P1",
    count: "4 dịch vụ",
  },
  {
    title: "Số liệu nổi bật",
    description: "Giá trị, nhãn, hậu tố và hình minh họa.",
    priority: "P2",
    count: "3 số liệu",
  },
  {
    title: "Vì sao chọn BMT",
    description: "Tiêu đề, mô tả và hình ảnh.",
    priority: "P2",
    count: "4 lý do",
  },
  {
    title: "Tin nổi bật & Đối tác",
    description: "Danh sách nội dung, hình ảnh và liên kết.",
    priority: "P2",
    count: "Theo từng nhóm",
  },
] as const;

function FieldLabel({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-semibold">
      <span className="flex items-center justify-between gap-3">
        {label}
        {helper && (
          <span className="font-normal text-muted-foreground">{helper}</span>
        )}
      </span>
      {children}
    </label>
  );
}

export function HomeContentManager({
  initialSlides,
}: {
  initialSlides: HomeHeroSlideContent[];
}) {
  const [slides, setSlides] = useState(initialSlides);
  const [selectedId, setSelectedId] = useState(initialSlides[0]?.id ?? "");
  const [draft, setDraft] = useState<HomeHeroSlideContent>(initialSlides[0]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  // So bản nháp với ảnh đang lưu để biết còn thay đổi nào chưa ghi lại hay không.
  const savedSlide = slides.find((slide) => slide.id === draft?.id);
  const dirtyCount = savedSlide
    ? (Object.keys(draft) as Array<keyof HomeHeroSlideContent>).filter(
        (key) => JSON.stringify(draft[key]) !== JSON.stringify(savedSlide[key]),
      ).length
    : 0;

  function selectSlide(slide: HomeHeroSlideContent) {
    setSelectedId(slide.id);
    setDraft(structuredClone(slide));
  }

  function updateDraft<Key extends keyof HomeHeroSlideContent>(
    key: Key,
    value: HomeHeroSlideContent[Key],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function addSlide() {
    const newSlide: HomeHeroSlideContent = {
      id: `home-hero-local-${Date.now()}`,
      title: "Slide mới",
      description: "Nhập mô tả cho phần mở đầu.",
      ctaLabel: "Xem thêm",
      ctaHref: "/",
      desktopImage: "/images/home/hero-background-01.webp",
      desktopAlt: "",
      mobileImage: "/images/home/hero-background-01.webp",
      mobileAlt: "",
      order: slides.length + 1,
      enabled: false,
    };
    setSlides((current) => [...current, newSlide]);
    selectSlide(newSlide);
    toast.info("Đã thêm ảnh mới", {
      description: "Hãy bấm lưu để giữ lại thay đổi.",
    });
  }

  async function saveDraft() {
    setSaving(true);
    try {
      const saved = await homeContentService.saveHeroSlide(draft);
      setSlides((current) =>
        current.map((slide) => (slide.id === saved.id ? saved : slide)),
      );
      toast.success("Đã lưu bản nháp", {
        description: "Nội dung đã được cập nhật.",
      });
      return true;
    } finally {
      setSaving(false);
    }
  }

  useUnsavedChangesGuard({ dirty: dirtyCount > 0, dirtyCount, save: saveDraft });
  const { topActionsRef, topActionsVisible } = useEditorActionsVisibility();

  return (
    <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Nội dung Trang chủ"
        description="Quản lý nội dung hiển thị trên Trang chủ BMT Decor."
        actions={
          <Button className="h-10 px-4" onClick={addSlide}>
            <Plus /> Thêm ảnh
          </Button>
        }
      />
      <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-[0_12px_36px_rgb(36_33_34/.035)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-brand/10 text-brand">
                <Sparkles className="size-4" />
              </span>
              <h2 className="font-semibold">Ảnh mở đầu Trang chủ</h2>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Chỉnh sửa nội dung và hình ảnh mở đầu Trang chủ
            </p>
          </div>
        </div>

        <div className="grid min-w-0 xl:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="border-b bg-muted/30 p-3 xl:border-r xl:border-b-0">
            <div className="admin-scrollbar flex gap-2 overflow-x-auto xl:block xl:max-h-[calc(100dvh-220px)] xl:space-y-2 xl:overflow-y-auto">
              {slides.map((slide) => {
                const active = slide.id === selectedId;
                return (
                  <Button
                    key={slide.id}
                    type="button"
                    variant="ghost"
                    onClick={() => selectSlide(slide)}
                    className={cn(
                      "h-auto min-w-[245px] justify-start gap-3 whitespace-normal rounded-xl border p-2.5 text-left xl:min-w-0 xl:w-full",
                      active
                        ? "border-brand/25 bg-card shadow-sm"
                        : "border-transparent hover:bg-card/70",
                    )}
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={slide.desktopImage}
                        alt=""
                        fill
                        unoptimized={slide.desktopImage.startsWith("blob:")}
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[10px] font-medium",
                            slide.enabled
                              ? "text-emerald-600"
                              : "text-muted-foreground",
                          )}
                        >
                          {slide.enabled ? "Đang hiển thị" : "Đang ẩn"}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs font-semibold leading-snug">
                        {slide.title}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </aside>

          <div className="min-w-0 p-4 sm:p-6">
            <div className="grid gap-6 2xl:grid-cols-[minmax(0,.9fr)_minmax(520px,1.1fr)]">
              <div className="space-y-5">
                <section className="rounded-2xl border bg-card p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">Nội dung</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Văn bản và liên kết hiển thị ở phần mở đầu
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4">
                    <FieldLabel
                      label="Tiêu đề"
                      helper={`${draft.title.length}/90`}
                    >
                      <Input
                        value={draft.title}
                        maxLength={90}
                        onChange={(event) =>
                          updateDraft("title", event.target.value)
                        }
                        className="h-10"
                      />
                    </FieldLabel>
                    <FieldLabel
                      label="Mô tả"
                      helper={`${draft.description.length}/260`}
                    >
                      <Textarea
                        value={draft.description}
                        maxLength={260}
                        onChange={(event) =>
                          updateDraft("description", event.target.value)
                        }
                        className="min-h-28"
                      />
                    </FieldLabel>
                    <div className="grid gap-4">
                      <FieldLabel label="Chữ trên nút bấm">
                        <Input
                          value={draft.ctaLabel}
                          onChange={(event) =>
                            updateDraft("ctaLabel", event.target.value)
                          }
                          className="h-10"
                        />
                      </FieldLabel>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border bg-card p-4 sm:p-5">
                  <h3 className="font-semibold">Cài đặt nội dung</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Trạng thái hiển thị
                  </p>
                  <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
                    <div className="flex items-center gap-3 rounded-xl border px-3 py-2.5">
                      <Switch
                        checked={draft.enabled}
                        onCheckedChange={(checked) => updateDraft("enabled", checked)}
                        aria-label="Hiển thị hình ảnh này"
                      />
                      <span>
                        <span className="block text-xs font-semibold">
                          Hiển thị hình ảnh này
                        </span>
                        <span className="mt-0.5 block text-[11px] text-muted-foreground">
                          {draft.enabled ? "Đang bật" : "Đang tắt"}
                        </span>
                      </span>
                    </div>
                  </div>
                </section>
              </div>

              <div className="grid min-w-0 gap-5 md:grid-cols-2 2xl:grid-cols-1">
                <ImageField
                  label="Ảnh trên máy tính"
                  value={draft.desktopImage}
                  alt={draft.desktopAlt}
                  ratio="16:9"
                  recommendedSize="1920 × 1080px"
                  onChange={(value) => updateDraft("desktopImage", value)}
                />
                <ImageField
                  label="Ảnh trên điện thoại"
                  value={draft.mobileImage}
                  alt={draft.mobileAlt}
                  ratio="9:16"
                  recommendedSize="1080 × 1920px"
                  onChange={(value) => updateDraft("mobileImage", value)}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-end">
              <div className="flex gap-2" ref={topActionsRef}>
                <Button
                  variant="outline"
                  className="h-10 flex-1 px-4 sm:flex-none"
                  onClick={() => setPreviewOpen(true)}
                >
                  <Eye /> Xem trước
                </Button>
                <Button
                  className="h-10 flex-1 px-4 sm:flex-none"
                  onClick={() => confirmEditorSave(dirtyCount, saveDraft)}
                  disabled={saving}
                >
                  <Save /> {saving ? "Đang lưu..." : "Lưu bản nháp"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-muted text-brand">
            <Layers3 className="size-4" />
          </span>
          <div>
            <h2 className="font-semibold">Các nhóm nội dung Trang chủ</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Chọn nhóm để xem và cập nhật nội dung
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {homeSections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border bg-card p-5 transition-colors hover:border-brand/20"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="size-4 text-brand" />
                  <h3 className="text-sm font-semibold">{section.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {section.description}
              </p>
              <p className="mt-4 text-xs font-medium text-muted-foreground">
                {section.count}
              </p>
            </article>
          ))}
        </div>
      </section>

      <StickyEditorActions
        hidden={topActionsVisible}
        dirty={dirtyCount > 0}
        dirtyCount={dirtyCount}
        saving={saving}
        saveLabel="Lưu bản nháp"
        onSave={() => confirmEditorSave(dirtyCount, saveDraft)}
      />

      <HomeHeroPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        slide={draft}
      />
    </div>
  );
}
