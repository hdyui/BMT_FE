"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";

import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";

interface ImageFieldProps {
  label: string;
  value: string;
  alt: string;
  ratio?: string;
  recommendedSize?: string;
  showAlt?: boolean;
  onChange: (value: string) => void;
  onAltChange?: (value: string) => void;
}

export function ImageField({
  label,
  value,
  alt,
  ratio,
  recommendedSize,
  showAlt = true,
  onChange,
  onAltChange,
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
  }

  return (
    <section className="rounded-2xl border bg-card p-4 shadow-[0_10px_35px_rgb(36_33_34/.035)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{label}</h3>
          {(ratio || recommendedSize) && (
            <p className="mt-1 text-xs text-muted-foreground">
              {ratio && `Tỷ lệ đề xuất: ${ratio}`}
              {ratio && recommendedSize && " | "}
              {recommendedSize && `Kích thước: ${recommendedSize}`}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => { setLocalPreview(null); onChange(""); }}>
              <Trash2 /> Xóa lựa chọn
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            <Upload /> {value ? "Thay ảnh" : "Chọn ảnh"}
          </Button>
        </div>
      </div>

      <div className="relative mt-3 aspect-[16/9] overflow-hidden rounded-xl border bg-muted">
        {value ? (
          <Image
            src={value}
            alt={alt || "Ảnh xem trước"}
            fill
            unoptimized={value.startsWith("blob:")}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 520px"
          />
        ) : (
          <div className="grid size-full place-items-center text-muted-foreground">
            <ImageIcon className="size-7" />
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-1.5 text-xs font-medium">
          Đường dẫn ảnh
          <Input
            value={value.startsWith("blob:") ? "Ảnh cục bộ đang xem trước" : value}
            onChange={(event) => onChange(event.target.value)}
            disabled={value.startsWith("blob:")}
            className="h-10"
          />
        </label>
        {showAlt && (
          <label className="grid gap-1.5 text-xs font-medium">
            Alt text
            <Input
              value={alt}
              onChange={(event) => onAltChange?.(event.target.value)}
              placeholder="Mô tả ngắn nội dung ảnh"
              className="h-10"
            />
          </label>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFile}
        className="sr-only"
      />
      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        UI chỉ chuẩn bị selection và preview. Upload provider sẽ được nối tại media adapter khi persistence được chốt.
      </p>
    </section>
  );
}
