"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Check, Copy, Eye, ImageIcon, Search } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { LockedDesignNotice } from "@/features/admin/components/LockedDesignNotice";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog";
import { Input } from "@/lib/components/ui/input";

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
  const [selected, setSelected] = useState<string | null>(assets[0]);
  const [preview, setPreview] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    return normalized
      ? assets.filter((asset) =>
          asset.toLocaleLowerCase("vi").includes(normalized),
        )
      : assets;
  }, [query]);

  async function copyPath(path: string) {
    await navigator.clipboard.writeText(path);
    toast.success("Đã copy đường dẫn asset", { description: path });
  }

  return (
    <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Media Asset Browser"
        description="Tìm, xem trước và copy đường dẫn asset hiện có. Không có upload server trong phase FE-only."
        actions={<Badge variant="secondary">{assets.length} assets mẫu</Badge>}
      />
      <LockedDesignNotice className="mt-6" />

      <section className="mt-6 overflow-hidden rounded-2xl border bg-card">
        <div className="border-b p-4 sm:p-5">
          <label className="relative block max-w-xl">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo tên file hoặc thư mục..."
              className="h-10 pl-9"
            />
          </label>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((asset) => {
            const active = selected === asset;
            return (
              <article
                className={`group overflow-hidden rounded-2xl border transition-colors ${active ? "border-brand bg-brand/5" : "bg-background hover:border-foreground/20"}`}
                key={asset}
              >
                <button
                  type="button"
                  className="relative block aspect-[4/3] w-full overflow-hidden bg-muted outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30"
                  onClick={() => setSelected(asset)}
                >
                  <Image
                    src={asset}
                    alt="Asset preview"
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 360px"
                  />
                  {active && (
                    <span className="absolute top-3 right-3 grid size-7 place-items-center rounded-full bg-brand text-charcoal shadow-sm">
                      <Check className="size-4" />
                    </span>
                  )}
                </button>
                <div className="p-3.5">
                  <p className="truncate text-xs font-medium" title={asset}>
                    {asset.split("/").at(-1)}
                  </p>
                  <p className="mt-1 truncate text-[11px] text-muted-foreground" title={asset}>
                    {asset}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => copyPath(asset)}>
                      <Copy /> Copy Path
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setPreview(asset)}>
                      <Eye /> Preview
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
              <h2 className="mt-3 font-semibold">Không tìm thấy asset</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Thử từ khóa hoặc tên thư mục khác.
              </p>
            </div>
          </div>
        )}
      </section>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        File picker trong editor chỉ tạo preview cục bộ bằng URL object. Trình
        duyệt không ghi file vào source hoặc production.
      </p>

      <Dialog
        open={Boolean(preview)}
        onOpenChange={(open) => !open && setPreview(null)}
      >
        <DialogContent className="admin-theme-surface w-[min(64rem,calc(100%-2rem))] max-w-none">
          <DialogHeader>
            <DialogTitle>Preview Asset</DialogTitle>
            <DialogDescription>{preview}</DialogDescription>
          </DialogHeader>
          {preview && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border bg-muted">
              <Image
                src={preview}
                alt="Asset preview"
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
