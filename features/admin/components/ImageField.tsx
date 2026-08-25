"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Eye, ImageIcon, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageFieldProps {
  label: string;
  value: string;
  alt: string;
  ratio?: string;
  recommendedSize?: string;
  dirty?: boolean;
  onChange: (value: string) => void;
}

export function ImageField({
  label,
  value,
  alt,
  ratio,
  recommendedSize,
  dirty = false,
  onChange,
}: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [imageSize, setImageSize] = useState<{ src: string; width: number; height: number } | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  useEffect(() => {
    if (!value) return;

    let cancelled = false;
    const sourceImage = new window.Image();
    sourceImage.onload = () => {
      if (cancelled) return;
      setImageSize({
        src: value,
        width: Math.max(1, sourceImage.naturalWidth),
        height: Math.max(1, sourceImage.naturalHeight),
      });
    };
    sourceImage.onerror = () => {
      if (!cancelled) setImageSize(null);
    };
    sourceImage.src = value;

    return () => {
      cancelled = true;
    };
  }, [value]);

  const resolvedImageSize = imageSize?.src === value ? imageSize : null;

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
    <section className="min-w-0">
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

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {value ? (
          <div className="relative h-28 w-40 shrink-0 sm:h-32 sm:w-48">
            <Image
              src={value}
              alt={alt || "Ảnh xem trước"}
              fill
              unoptimized={value.startsWith("blob:") || value.startsWith("data:")}
              className="object-contain"
              sizes="192px"
            />
          </div>
        ) : (
          <div className="grid h-28 w-40 shrink-0 place-items-center rounded-lg border border-dashed text-muted-foreground sm:h-32 sm:w-48">
              <ImageIcon className="size-6" />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            <Upload /> {value ? "Đổi ảnh" : "Chọn ảnh"}
          </Button>
          {value && (
            <>
              <Button type="button" variant="outline" size="sm" onClick={() => setViewerOpen(true)}>
                <Eye /> Xem ảnh
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  setViewerOpen(false);
                  setImageSize(null);
                  setLocalPreview(null);
                  onChange("");
                }}
              >
                <Trash2 /> Xóa ảnh
              </Button>
            </>
          )}
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
        <DialogContent className="flex max-h-[calc(100dvh-4rem)] w-[min(80vw,820px)] max-w-[min(80vw,820px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[min(80vw,820px)]">
          <DialogHeader className="shrink-0 border-b px-4 py-3 pr-12">
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>
              {resolvedImageSize ? `Kích thước gốc: ${resolvedImageSize.width} x ${resolvedImageSize.height}px` : "Đang đọc kích thước ảnh..."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex min-h-0 flex-1 items-center justify-center bg-muted/20 p-6">
            {value && resolvedImageSize ? (
              <div className="flex min-h-0 max-w-full items-center justify-center">
                <Image
                  src={value}
                  alt={alt || label}
                  width={resolvedImageSize.width}
                  height={resolvedImageSize.height}
                  unoptimized={value.startsWith("blob:") || value.startsWith("data:")}
                  className="h-auto max-h-[calc(100dvh-15rem)] w-auto max-w-full object-contain"
                  sizes={`${resolvedImageSize.width}px`}
                />
              </div>
            ) : (
              <div className="grid min-h-40 min-w-72 place-items-center text-sm text-muted-foreground">
                Đang tải ảnh...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
