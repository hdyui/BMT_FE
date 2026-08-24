"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Eye, ImageIcon, Search } from "lucide-react";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const assets = [
  "/images/home/hero-background-01.webp",
  "/images/home/hero-background-02.webp",
  "/images/home/hero-background-03.webp",
  "/images/home/project-wide-01.png",
  "/images/home/project-wide-02.png",
  "/images/home/service-turnkey-optimized.webp",
  "/images/home/service-design-optimized.webp",
  "/images/home/news-01.png",
  "/images/home/news-02.png",
  "/images/home/partner-go.png",
  "/images/about/source/hero-interior.png",
  "/images/about/source/journey-2011.png",
  "/images/projects/project-01.png",
  "/images/projects/project-02.png",
  "/images/projects/detail/project-cover.png",
  "/images/services/hero-card-01.webp",
  "/images/services/hero-card-02.webp",
  "/images/careers/hero.png",
  "/images/contact/contact-consultant.jpg",
] as const;

export function MediaAssetBrowser() {
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    return normalized
      ? assets.filter((asset) =>
          asset.toLocaleLowerCase("vi").includes(normalized),
        )
      : assets;
  }, [query]);

  return (
    <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Thư viện ảnh"
        description="Tìm và xem các hình ảnh đang có trên website."
        actions={<Badge variant="secondary">{assets.length} hình ảnh</Badge>}
      />

      <section className="mt-6 overflow-hidden rounded-2xl border bg-card">
        <div className="border-b p-4 sm:p-5">
          <label className="relative block max-w-xl">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm hình ảnh..."
              className="h-10 pl-9"
            />
          </label>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((asset, index) => {
            return (
              <article
                className="group overflow-hidden rounded-2xl border bg-background transition-colors hover:border-foreground/20"
                key={asset}
              >
                <Button
                  type="button"
                  variant="ghost"
                  className="relative block h-auto aspect-[4/3] w-full overflow-hidden rounded-none bg-muted p-0"
                  onClick={() => setPreview(asset)}
                >
                  <Image
                    src={asset}
                    alt="Xem trước hình ảnh"
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 360px"
                  />
                </Button>
                <div className="p-3.5">
                  <p className="truncate text-xs font-medium">
                    Hình ảnh {String(index + 1).padStart(2, "0")}
                  </p>
                  <div className="mt-3">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setPreview(asset)}>
                      <Eye /> Xem trước
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="grid min-h-60 place-items-center p-6 text-center">
            <div>
              <ImageIcon className="mx-auto size-7 text-brand" />
              <h2 className="mt-3 font-semibold">Không tìm thấy hình ảnh</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Thử từ khóa hoặc tên thư mục khác.
              </p>
            </div>
          </div>
        )}
      </section>

      <Dialog
        open={Boolean(preview)}
        onOpenChange={(open) => !open && setPreview(null)}
      >
        <DialogContent className="admin-theme-surface w-[min(64rem,calc(100%-2rem))] max-w-none">
          <DialogHeader>
            <DialogTitle>Xem trước hình ảnh</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border bg-muted">
              <Image
                src={preview}
                alt="Xem trước hình ảnh"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
