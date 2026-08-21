"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  ImageIcon,
  Layers3,
  Plus,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { ImageField } from "@/features/admin/components/ImageField";
import { LockedDesignNotice } from "@/features/admin/components/LockedDesignNotice";
import { HomeHeroPreviewDialog } from "@/features/admin/home/HomeHeroPreviewDialog";
import { homeContentService } from "@/lib/admin/services/home-content.service";
import type { HomeHeroSlideContent } from "@/lib/admin/types/content";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Textarea } from "@/lib/components/ui/textarea";
import { cn } from "@/lib/utils";

const homeSections = [
  {
    title: "Hero Slider",
    description: "Text, CTA, ảnh Desktop/Mobile, alt, thứ tự và hiển thị.",
    priority: "P1",
    count: "4 slide",
  },
  {
    title: "Dự án tiêu biểu Home",
    description: "Data riêng của Homepage, không dùng chung Projects Page.",
    priority: "P1",
    count: "32 item",
  },
  {
    title: "Dịch vụ nổi bật Home",
    description: "Nội dung và hình ảnh riêng theo thiết kế Homepage.",
    priority: "P1",
    count: "4 dịch vụ",
  },
  {
    title: "Statistics",
    description: "Giá trị, nhãn, hậu tố, icon và thứ tự.",
    priority: "P2",
    count: "3 số liệu",
  },
  {
    title: "Vì sao chọn BMT",
    description: "Tiêu đề, mô tả, icon, ảnh hover và thứ tự.",
    priority: "P2",
    count: "4 lý do",
  },
  {
    title: "Tin nổi bật & Đối tác",
    description: "Danh sách nội dung, hình ảnh, liên kết và thứ tự.",
    priority: "P2",
    count: "Theo section",
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

  const selectedIndex = useMemo(
    () => slides.findIndex((slide) => slide.id === selectedId),
    [selectedId, slides],
  );

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

  function moveSelected(direction: -1 | 1) {
    const targetIndex = selectedIndex + direction;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const next = [...slides];
    const currentSlide = next[selectedIndex];
    const targetSlide = next[targetIndex];
    next[selectedIndex] = { ...targetSlide, order: selectedIndex + 1 };
    next[targetIndex] = { ...currentSlide, order: targetIndex + 1 };
    setSlides(next);
    setDraft((current) => ({ ...current, order: targetIndex + 1 }));
  }

  function addSlide() {
    const newSlide: HomeHeroSlideContent = {
      id: `home-hero-local-${Date.now()}`,
      title: "Slide mới",
      description: "Nhập mô tả nội dung Hero.",
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
    toast.info("Đã tạo slide cục bộ", {
      description: "Bản nháp chỉ tồn tại trong phiên hiện tại.",
    });
  }

  async function saveDraft() {
    setSaving(true);
    try {
      const saved = await homeContentService.saveHeroSlide(draft);
      setSlides((current) =>
        current.map((slide) => (slide.id === saved.id ? saved : slide)),
      );
      toast.success("Đã lưu bản nháp trong UI", {
        description: "Chưa có persistence. Dữ liệu sẽ mất khi tải lại trang.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Nội dung Trang chủ"
        description="Quản lý content riêng của Homepage BMT Decor. Module này không liên kết tự động với Projects Page hoặc Service Detail."
        actions={
          <Button className="h-10 px-4" onClick={addSlide}>
            <Plus /> Thêm slide
          </Button>
        }
      />
      <LockedDesignNotice className="mt-6" />

      <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-[0_12px_36px_rgb(36_33_34/.035)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-brand/10 text-brand">
                <Sparkles className="size-4" />
              </span>
              <h2 className="font-semibold">Hero Slider</h2>
              <Badge>P1</Badge>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Editor mẫu hoàn chỉnh cho content và image management
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveSelected(-1)}
              disabled={selectedIndex <= 0}
              aria-label="Di chuyển slide lên"
            >
              <ArrowUp />
              <span className="hidden sm:inline">Lên</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveSelected(1)}
              disabled={selectedIndex === slides.length - 1}
              aria-label="Di chuyển slide xuống"
            >
              <ArrowDown />
              <span className="hidden sm:inline">Xuống</span>
            </Button>
          </div>
        </div>

        <div className="grid min-w-0 xl:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="border-b bg-muted/30 p-3 xl:border-r xl:border-b-0">
            <div className="admin-scrollbar flex gap-2 overflow-x-auto xl:block xl:max-h-[calc(100dvh-220px)] xl:space-y-2 xl:overflow-y-auto">
              {slides.map((slide) => {
                const active = slide.id === selectedId;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => selectSlide(slide)}
                    className={cn(
                      "flex min-w-[245px] items-center gap-3 rounded-xl border p-2.5 text-left outline-none transition-colors xl:min-w-0 xl:w-full",
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
                        <span className="text-[11px] font-bold text-brand">
                          #{String(slide.order).padStart(2, "0")}
                        </span>
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
                  </button>
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
                        Văn bản và liên kết hiển thị trong Hero
                      </p>
                    </div>
                    <Badge variant="outline">Slide #{draft.order}</Badge>
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
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FieldLabel label="Nhãn CTA">
                        <Input
                          value={draft.ctaLabel}
                          onChange={(event) =>
                            updateDraft("ctaLabel", event.target.value)
                          }
                          className="h-10"
                        />
                      </FieldLabel>
                      <FieldLabel label="Liên kết CTA">
                        <Input
                          value={draft.ctaHref}
                          onChange={(event) =>
                            updateDraft("ctaHref", event.target.value)
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
                    Chỉ quản lý thứ tự và trạng thái khi component hỗ trợ
                  </p>
                  <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
                    <FieldLabel label="Thứ tự">
                      <Input
                        type="number"
                        min={1}
                        value={draft.order}
                        onChange={(event) =>
                          updateDraft("order", Number(event.target.value))
                        }
                        className="h-10 w-24"
                      />
                    </FieldLabel>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={draft.enabled}
                      onClick={() => updateDraft("enabled", !draft.enabled)}
                      className="flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                    >
                      <span
                        className={cn(
                          "relative h-5 w-9 rounded-full transition-colors",
                          draft.enabled ? "bg-brand" : "bg-muted",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform",
                            draft.enabled ? "translate-x-[18px]" : "translate-x-0.5",
                          )}
                        />
                      </span>
                      <span>
                        <span className="block text-xs font-semibold">
                          Hiển thị slide
                        </span>
                        <span className="mt-0.5 block text-[11px] text-muted-foreground">
                          {draft.enabled ? "Đang bật" : "Đang tắt"}
                        </span>
                      </span>
                    </button>
                  </div>
                </section>
              </div>

              <div className="grid min-w-0 gap-5 md:grid-cols-2 2xl:grid-cols-1">
                <ImageField
                  label="Ảnh Desktop"
                  value={draft.desktopImage}
                  alt={draft.desktopAlt}
                  ratio="16:9"
                  recommendedSize="1920 × 1080px"
                  onChange={(value) => updateDraft("desktopImage", value)}
                  onAltChange={(value) => updateDraft("desktopAlt", value)}
                />
                <ImageField
                  label="Ảnh Mobile"
                  value={draft.mobileImage}
                  alt={draft.mobileAlt}
                  ratio="9:16"
                  recommendedSize="1080 × 1920px"
                  onChange={(value) => updateDraft("mobileImage", value)}
                  onAltChange={(value) => updateDraft("mobileAlt", value)}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Save Draft hiện chỉ cập nhật local state trong phiên làm việc.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="h-10 flex-1 px-4 sm:flex-none"
                  onClick={() => setPreviewOpen(true)}
                >
                  <Eye /> Preview
                </Button>
                <Button
                  className="h-10 flex-1 px-4 sm:flex-none"
                  onClick={saveDraft}
                  disabled={saving}
                >
                  <Save /> {saving ? "Đang lưu..." : "Save Draft"}
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
            <h2 className="font-semibold">Các section Trang chủ</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Mỗi section giữ data riêng theo design hiện tại
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
                <Badge
                  variant={section.priority === "P1" ? "default" : "secondary"}
                >
                  {section.priority}
                </Badge>
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

      <HomeHeroPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        slide={draft}
      />
    </div>
  );
}
