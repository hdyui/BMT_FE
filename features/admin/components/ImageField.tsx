"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Expand, ImageIcon, Upload } from "lucide-react";

import { Button } from "@/features/admin/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/features/admin/components/ui/dialog";
import { cn } from "@/shared/lib/utils";

interface ImageFieldProps {
  label: string;
  value: string;
  alt: string;
  ratio?: string;
  recommendedSize?: string;
  dirty?: boolean;
  streamlined?: boolean;
  /**
   * Cỡ ảnh xem trước. `large` là tem to gấp đôi, `wide` dành cho ô ảnh chiếm
   * gần trọn bề ngang; `fill` thì ảnh choán hết bề ngang và cao theo cột chứa
   * nó — dùng cho bố cục ảnh một bên, chữ một bên, nơi cột ảnh chỉ có một ô nên
   * để tem nhỏ là cả cột toàn khoảng trắng.
   */
  size?: "thumb" | "large" | "wide" | "fill";
  onChange: (value: string) => void;
}

export function ImageField({
  label,
  value,
  alt,
  ratio,
  recommendedSize,
  dirty = false,
  streamlined = false,
  size = "thumb",
  onChange,
}: ImageFieldProps) {
  const fill = size === "fill";
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    if (localPreview) URL.revokeObjectURL(localPreview);
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    onChange(preview);
    event.target.value = "";
  }

  return (
    <section
      className={cn(
        streamlined ? "py-1" : "rounded-xl border bg-card p-4",
        fill && "flex h-full flex-col",
      )}
    >
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          {dirty && <span className="size-2 rounded-full bg-brand" aria-label="Có thay đổi chưa lưu" />}
          {label}
        </h3>
        {(ratio || recommendedSize) && (
          <p className="mt-1 text-xs text-muted-foreground">
            {ratio && `Tỷ lệ đề xuất: ${ratio}`}
            {ratio && recommendedSize && " | "}
            {recommendedSize && `Kích thước: ${recommendedSize}`}
          </p>
        )}
      </div>

      <div
        className={cn(
          "mt-3 gap-3",
          fill
            ? "flex min-h-0 flex-1 flex-col"
            : size === "wide"
              ? // Ảnh to thì hàng nút xuống dưới, đứng thẳng mép trái tấm ảnh —
                // để cạnh ảnh cao gần 300px trông rất chông chênh.
                "flex flex-col items-start"
              : "flex flex-wrap items-center",
        )}
      >
        {/* Ảnh xem trước rất nhỏ, không đủ để soi chi tiết — bấm vào mở ảnh đầy
            đủ trong hộp thoại. */}
        <button
          type="button"
          disabled={!value}
          onClick={() => setViewerOpen(true)}
          aria-label={value ? `Xem ảnh ${label}` : undefined}
          className={cn(
            "relative rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/30 enabled:cursor-zoom-in disabled:cursor-default",
            fill
              ? // Cao theo cột chữ bên cạnh (tối thiểu 12rem, tối đa 22rem) nên
                // hai cột kết thúc gần bằng nhau thay vì lệch cả gang tay.
                "min-h-48 w-full flex-1 rounded-xl bg-muted/25 sm:max-h-[22rem]"
              : size === "large"
                ? "h-40 w-full max-w-[18rem] shrink-0 rounded-xl bg-muted/25 sm:h-48"
                : size === "wide"
                  ? "h-56 w-full max-w-[36rem] shrink-0 rounded-xl bg-muted/25 sm:h-72"
                  : "h-20 w-28 shrink-0 sm:h-24 sm:w-32",
          )}
        >
          {value ? (
            /* Chỉ hiện ảnh — không viền, không nền, không lớp phủ khi rê chuột
               — để nhìn đúng như ảnh thật, nhất là ảnh PNG nền trong suốt. */
            <Image
              src={value}
              alt={alt || "Ảnh xem trước"}
              fill
              unoptimized={value.startsWith("blob:") || value.startsWith("data:")}
              className="object-contain"
              sizes={size === "thumb" ? "128px" : "(max-width: 1024px) 90vw, 36rem"}
            />
          ) : (
            <div className="grid size-full place-items-center rounded-[inherit] border border-dashed text-muted-foreground">
              <ImageIcon className="size-6" />
            </div>
          )}
        </button>
        {/* Ảnh là một slot cố định của layout nên không có nút xóa — bỏ trống ô
            ảnh sẽ để lại lỗ hổng trên website, chỉ cho đổi ảnh khác. */}
        <div className="flex flex-col items-start gap-2">
          {value && (
            <Button type="button" variant="outline" size="sm" onClick={() => setViewerOpen(true)}>
              <Expand /> Xem ảnh
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            <Upload /> {value ? "Đổi ảnh" : "Chọn ảnh"}
          </Button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFile}
        className="sr-only"
      />

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        {/* `sm:max-w-none` là bắt buộc — lớp gốc của DialogContent có
            `sm:max-w-sm`, không gỡ thì hộp thoại bị ghim ở 24rem. */}
        <DialogContent className="admin-theme-surface w-[min(58rem,calc(100vw-3rem))] max-w-none sm:max-w-none">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>Ảnh đang dùng cho phần này trên website.</DialogDescription>
          </DialogHeader>
          {/* Nền xám nhạt để thấy được rìa của ảnh PNG nền trong suốt. */}
          <div className="mt-3 grid max-h-[68vh] place-items-center overflow-auto rounded-lg bg-muted/40 p-2">
            {value && (
              <Image
                src={value}
                alt={alt || "Ảnh xem trước"}
                width={2400}
                height={1800}
                unoptimized={value.startsWith("blob:") || value.startsWith("data:")}
                className="h-auto max-h-[64vh] w-auto max-w-full object-contain"
                sizes="(max-width: 960px) 92vw, 58rem"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
