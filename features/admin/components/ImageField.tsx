"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

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
    <section className="rounded-xl border bg-card p-4">
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
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border bg-muted/60 sm:h-24 sm:w-32">
          {value ? (
            <Image
              src={value}
              alt={alt || "Ảnh xem trước"}
              fill
              unoptimized={value.startsWith("blob:") || value.startsWith("data:")}
              className="object-contain p-1"
              sizes="128px"
            />
          ) : (
            <div className="grid size-full place-items-center text-muted-foreground">
              <ImageIcon className="size-6" />
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            <Upload /> {value ? "Đổi ảnh" : "Chọn ảnh"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-destructive/35 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => { setLocalPreview(null); onChange(""); }}
            >
              <Trash2 /> Xóa ảnh
            </Button>
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
    </section>
  );
}
