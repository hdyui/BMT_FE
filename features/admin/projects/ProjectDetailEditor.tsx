"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, FileText, Save } from "lucide-react";
import { toast } from "sonner";

import { ImageField } from "@/features/admin/components/ImageField";
import { projectContentService } from "@/lib/admin/services/project-content.service";
import type { AdminProjectDetailContent } from "@/lib/admin/types/content";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function ContentField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-semibold">
      {label}
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28"
      />
    </label>
  );
}

export function ProjectDetailEditor({
  details,
  onChange,
}: {
  details: AdminProjectDetailContent[];
  onChange: (details: AdminProjectDetailContent[]) => void;
}) {
  const [selectedId, setSelectedId] = useState(details[0]?.id ?? "");
  const selected =
    details.find((detail) => detail.id === selectedId) ?? details[0];
  const [draft, setDraft] = useState<AdminProjectDetailContent>(selected);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  function update<Key extends keyof AdminProjectDetailContent>(
    key: Key,
    value: AdminProjectDetailContent[Key],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function selectDetail(detail: AdminProjectDetailContent) {
    setSelectedId(detail.id);
    setDraft(structuredClone(detail));
  }

  async function saveDraft() {
    setSaving(true);
    try {
      const saved = await projectContentService.saveDetail(draft);
      onChange(
        details.map((detail) => (detail.id === saved.id ? saved : detail)),
      );
      toast.success("Đã lưu nội dung chi tiết dự án");
    } finally {
      setSaving(false);
    }
  }

  if (!draft) {
    return (
      <div className="grid min-h-72 place-items-center rounded-2xl border bg-card p-6 text-center">
        <div>
          <FileText className="mx-auto size-6 text-brand" />
          <h2 className="mt-3 font-semibold">Chưa có nội dung chi tiết dự án</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Hãy thêm nội dung chi tiết cho dự án đầu tiên.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-[0_12px_36px_rgb(36_33_34/.035)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Chi tiết dự án</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Thông tin, nội dung chi tiết và bộ ảnh của từng dự án
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPreviewOpen(true)}>
            <Eye /> Xem trước
          </Button>
          <Button onClick={saveDraft} disabled={saving}>
            <Save /> {saving ? "Đang lưu..." : "Lưu bản nháp"}
          </Button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b bg-muted/30 p-3 xl:border-r xl:border-b-0">
          <p className="px-2 pb-2 text-[10px] font-bold tracking-[0.12em] text-muted-foreground uppercase">
            Hồ sơ chi tiết
          </p>
          <div className="space-y-1.5">
            {details.map((detail) => (
              <Button
                key={detail.id}
                type="button"
                variant="ghost"
                onClick={() => selectDetail(detail)}
                className={`h-auto w-full justify-start whitespace-normal rounded-xl border p-3 text-left ${
                  detail.id === selectedId
                    ? "border-brand/25 bg-card"
                    : "border-transparent hover:bg-card/70"
                }`}
              >
                <p className="text-xs font-semibold">{detail.title}</p>
              </Button>
            ))}
          </div>
        </aside>

        <div className="min-w-0 space-y-5 p-4 sm:p-6">
          <section className="rounded-2xl border p-4 sm:p-5">
            <h3 className="font-semibold">Thông tin dự án</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Các thông tin giới thiệu chính của dự án
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                ["Tiêu đề", "title"],
                ["Đường dẫn", "slug"],
                ["Danh mục", "category"],
                ["Địa điểm", "location"],
                ["Khách hàng", "client"],
                ["Diện tích", "area"],
                ["Quy mô", "scale"],
                ["Phong cách (nội dung)", "styleText"],
                ["Phạm vi", "scope"],
              ].map(([label, key]) => (
                <label key={key} className="grid gap-1.5 text-xs font-semibold">
                  {label}
                  <Input
                    value={String(draft[key as keyof AdminProjectDetailContent])}
                    onChange={(event) =>
                      update(
                        key as keyof AdminProjectDetailContent,
                        event.target.value as never,
                      )
                    }
                    className="h-10"
                  />
                </label>
              ))}
              <label className="grid gap-1.5 text-xs font-semibold">
                Năm
                <Input
                  type="number"
                  value={draft.year}
                  onChange={(event) => update("year", Number(event.target.value))}
                  className="h-10"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border p-4 sm:p-5">
            <h3 className="font-semibold">Nội dung chi tiết</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Nội dung giới thiệu cho từng phần của dự án
            </p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <ContentField
                label="Tổng quan"
                value={draft.overview}
                onChange={(value) => update("overview", value)}
              />
              <ContentField
                label="Khảo sát hiện trạng"
                value={draft.surveyText}
                onChange={(value) => update("surveyText", value)}
              />
              <ContentField
                label="Giải pháp"
                value={draft.solution}
                onChange={(value) => update("solution", value)}
              />
              <ContentField
                label="Mô tả quy trình"
                value={draft.processDescription}
                onChange={(value) => update("processDescription", value)}
              />
              <label className="grid gap-1.5 text-xs font-semibold lg:col-span-2">
                Chú thích bản vẽ
                <Input
                  value={draft.drawingCaption}
                  onChange={(event) =>
                    update("drawingCaption", event.target.value)
                  }
                  className="h-10"
                />
              </label>
            </div>
          </section>

          <ImageField
            label="Ảnh mở đầu trang chi tiết dự án"
            value={draft.heroImage}
            alt={draft.heroAlt}
            ratio="1.02:1"
            recommendedSize="2560 × 2500px"
            onChange={(value) => update("heroImage", value)}
          />

        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="admin-theme-surface w-[min(68rem,calc(100%-2rem))] max-w-none">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>Xem trước chi tiết dự án</DialogTitle>
            </div>
            <DialogDescription>
              Bản xem trước sử dụng nội dung bạn đang chỉnh sửa.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 overflow-hidden rounded-2xl border bg-background">
            <div className="relative aspect-[16/8] bg-muted">
              <Image
                src={draft.heroImage}
                alt={draft.heroAlt || draft.title}
                fill
                unoptimized={draft.heroImage.startsWith("blob:")}
                className="object-cover"
                sizes="1050px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
                <p className="text-xs font-bold tracking-[0.12em] text-brand uppercase">
                  {draft.category}
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">
                  {draft.title}
                </h2>
              </div>
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-[1fr_1.5fr] sm:p-8">
              <dl className="grid content-start gap-3 text-sm">
                {[
                  ["Địa điểm", draft.location],
                  ["Diện tích", draft.area],
                  ["Phong cách", draft.styleText],
                  ["Năm", String(draft.year)],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[90px_1fr] gap-3">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <h3 className="font-semibold">Tổng quan</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {draft.overview}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
