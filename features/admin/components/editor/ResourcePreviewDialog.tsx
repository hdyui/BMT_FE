"use client";

import Image from "next/image";

import type {
  AdminCrudRecord,
  AdminResourceConfig,
} from "@/features/admin/lib/types/crud";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/features/admin/components/ui/dialog";

export function ResourcePreviewDialog({
  open,
  config,
  record,
  onOpenChange,
}: {
  open: boolean;
  config: AdminResourceConfig;
  record: AdminCrudRecord;
  onOpenChange: (open: boolean) => void;
}) {
  const previewImage = config.previewField
    ? String(record[config.previewField] ?? "")
    : "";
  const previewFieldConfig = config.sections
    .flatMap((section) => section.fields)
    .find((field) => field.key === config.previewField);
  const previewAlt = previewFieldConfig?.altKey
    ? String(record[previewFieldConfig.altKey] ?? config.singular)
    : config.singular;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin-theme-surface w-[min(62rem,calc(100%-2rem))] max-w-none">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle>Xem trước {config.singular.toLocaleLowerCase("vi")}</DialogTitle>
          </div>
          <DialogDescription>
            Kiểm tra nội dung và hình ảnh trước khi lưu.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden rounded-2xl border bg-background">
          {previewImage && (
            <div className="relative aspect-[16/7] bg-muted">
              <Image
                src={previewImage}
                alt={previewAlt}
                fill
                unoptimized={previewImage.startsWith("blob:")}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 900px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                <p className="text-xs font-bold tracking-[0.12em] uppercase text-white/70">
                  BMT Decor
                </p>
                <h2 className="mt-2 max-w-3xl text-2xl font-bold tracking-[-0.035em] sm:text-4xl">
                  {String(record[config.titleField] ?? config.singular)}
                </h2>
              </div>
            </div>
          )}
          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
            {config.sections.flatMap((section) =>
              section.fields
                .filter((field) => field.type !== "image" && field.type !== "boolean")
                .slice(0, 8)
                .map((field) => (
                  <div key={field.key}>
                    <p className="text-[11px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
                      {field.label}
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">
                      {Array.isArray(record[field.key])
                        ? (record[field.key] as string[]).join(" · ")
                        : String(record[field.key] ?? "Chưa có nội dung")}
                    </p>
                  </div>
                )),
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
