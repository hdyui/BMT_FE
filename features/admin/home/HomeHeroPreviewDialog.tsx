"use client";

import Image from "next/image";
import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";

import type { HomeHeroSlideContent } from "@/lib/admin/types/content";
import { Badge } from "@/lib/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog";
import { cn } from "@/lib/utils";

export function HomeHeroPreviewDialog({
  open,
  onOpenChange,
  slide,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slide: HomeHeroSlideContent;
}) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const mobile = viewport === "mobile";
  const image = mobile ? slide.mobileImage : slide.desktopImage;
  const alt = mobile ? slide.mobileAlt : slide.desktopAlt;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin-theme-surface w-[min(72rem,calc(100%-2rem))] max-w-none">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle>Xem trước Hero Trang chủ</DialogTitle>
            <Badge variant="secondary">Layout khóa</Badge>
          </div>
          <DialogDescription>
            Preview chỉ thay nội dung và ảnh. Typography, spacing, màu sắc và
            responsive vẫn do component trong source kiểm soát.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="inline-flex rounded-xl border bg-muted p-1">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-medium transition-colors",
                !mobile
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              <Monitor className="size-3.5" /> Desktop
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-medium transition-colors",
                mobile
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              <Smartphone className="size-3.5" /> Mobile
            </button>
          </div>
          <span className="text-xs text-muted-foreground">
            Slide #{slide.order}
          </span>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border bg-muted/40 p-3 sm:p-5">
          <div
            className={cn(
              "relative mx-auto overflow-hidden rounded-xl bg-charcoal shadow-[0_24px_60px_rgb(0_0_0/.18)] transition-[width] duration-200",
              mobile
                ? "aspect-[9/16] w-[min(330px,100%)]"
                : "aspect-[16/7.6] w-full",
            )}
          >
            {image && (
              <Image
                src={image}
                alt={alt || "Ảnh Hero xem trước"}
                fill
                unoptimized={image.startsWith("blob:")}
                className="object-cover"
                sizes={mobile ? "330px" : "1100px"}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/88 via-charcoal/45 to-transparent" />
            <div
              className={cn(
                "absolute inset-0 flex flex-col justify-end text-white",
                mobile ? "p-6" : "max-w-[64%] p-[clamp(2rem,5vw,5rem)]",
              )}
            >
              <p className="text-xs font-bold tracking-[0.14em] text-brand uppercase">
                BMT Decor
              </p>
              <h2
                className={cn(
                  "mt-3 font-extrabold tracking-[-0.045em]",
                  mobile
                    ? "text-[28px] leading-[1.04]"
                    : "text-[clamp(28px,3.3vw,56px)] leading-[1.02]",
                )}
              >
                {slide.title || "Tiêu đề Hero"}
              </h2>
              <p
                className={cn(
                  "mt-3 text-white/80",
                  mobile
                    ? "line-clamp-4 text-sm leading-relaxed"
                    : "line-clamp-3 max-w-[62ch] text-[clamp(13px,1vw,16px)] leading-relaxed",
                )}
              >
                {slide.description || "Mô tả Hero"}
              </p>
              <span className="mt-5 inline-flex h-10 w-fit items-center rounded-lg bg-brand px-4 text-sm font-bold text-charcoal">
                {slide.ctaLabel || "Nút hành động"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
