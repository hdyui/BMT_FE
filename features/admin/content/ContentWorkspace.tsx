"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, FileText, LockKeyhole, Search } from "lucide-react";

import { LockedDesignNotice } from "@/features/admin/components/LockedDesignNotice";
import {
  adminContentPages,
  getContentPage,
  getPageFieldCount,
  getResourceFieldCount,
} from "@/lib/admin/content-pages";
import { adminResourceRegistry } from "@/lib/admin/mock-data/resource-registry";
import { Badge } from "@/lib/components/ui/badge";
import { Input } from "@/lib/components/ui/input";
import { cn } from "@/lib/utils";

export function ContentWorkspace({ selectedId = "home" }: { selectedId?: string }) {
  const [query, setQuery] = useState("");
  const selected = getContentPage(selectedId) ?? getContentPage("home")!;
  const normalized = query.trim().toLocaleLowerCase("vi");
  const visiblePages = useMemo(
    () => adminContentPages.filter((page) => {
      if (!normalized) return true;
      return page.label.toLocaleLowerCase("vi").includes(normalized) ||
        page.children?.some((child) => child.label.toLocaleLowerCase("vi").includes(normalized));
    }),
    [normalized],
  );

  return (
    <div className="grid min-h-[calc(100dvh-72px)] lg:grid-cols-[286px_minmax(0,1fr)]">
      <aside className="border-b bg-muted/25 lg:border-r lg:border-b-0">
        <div className="admin-scrollbar sticky top-[72px] max-h-[48dvh] overflow-y-auto p-4 lg:max-h-[calc(100dvh-72px)]">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-10 bg-background pl-9"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm nội dung..."
            />
          </label>

          <nav className="mt-4 space-y-1" aria-label="Các trang nội dung">
            {visiblePages.map((page) => (
              <div key={page.id}>
                <ContentPageLink page={page} active={selected.id === page.id} />
                {page.children && (
                  <div className="ml-4 border-l pl-2">
                    {page.children.map((child) => (
                      <ContentPageLink page={child} active={selected.id === child.id} nested key={child.id} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      <main className="min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1180px]">
          <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.14em] text-brand uppercase">Trang</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">{selected.label}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{getPageFieldCount(selected)} trường</span>
                <span aria-hidden="true">·</span>
                <span>{selected.publicRoute}</span>
              </div>
            </div>
            <Link
              href={selected.publicRoute === "Toàn website" ? "/" : selected.publicRoute}
              target="_blank"
              className="inline-flex h-10 items-center justify-center rounded-lg border bg-background px-4 text-sm font-semibold outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              Xem trang thật
            </Link>
          </header>

          <LockedDesignNotice className="mt-6" />

          <section className="mt-6 overflow-hidden rounded-2xl border bg-card">
            <div className="border-b px-5 py-4 sm:px-6">
              <h2 className="font-semibold">Content sections</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Field được nhóm theo module nguồn. Số lượng bên dưới được tính từ content definition thực tế.
              </p>
            </div>
            {selected.resourceKeys.length > 0 ? (
              <div className="divide-y">
                {selected.resourceKeys.map((resourceKey) => {
                  const resource = adminResourceRegistry[resourceKey];
                  if (!resource) return null;
                  const fieldLabels = resource.sections.flatMap((section) =>
                    section.fields.flatMap((field) => [field.label, ...(field.altKey ? ["Alt text"] : [])]),
                  );
                  return (
                    <article className="grid gap-4 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center" key={resourceKey}>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{resource.title}</h3>
                          <Badge variant={resource.priority === "P1" ? "default" : "secondary"}>{resource.priority}</Badge>
                          <span className="text-xs text-muted-foreground">{getResourceFieldCount(resourceKey)} trường</span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {fieldLabels.slice(0, 8).map((label, index) => (
                            <span className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground" key={`${label}-${index}`}>{label}</span>
                          ))}
                          {fieldLabels.length > 8 && <span className="px-1 py-1 text-[11px] text-muted-foreground">+{fieldLabels.length - 8}</span>}
                        </div>
                      </div>
                      <Link
                        href={`/admin/${resource.module}/${resource.path}`}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30"
                      >
                        Chỉnh nội dung <ArrowRight className="size-4" />
                      </Link>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Chọn một trang con của Dịch vụ để xem content definition riêng.
              </div>
            )}
          </section>

          <section className="mt-5 grid gap-4 rounded-2xl border bg-muted/20 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold"><FileText className="size-4 text-brand" /> Source đã trace</h2>
              <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                {selected.sourceFiles.map((source) => <li className="break-all font-mono" key={source}>{source}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold"><LockKeyhole className="size-4 text-brand" /> Design bị khóa</h2>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Typography, màu, spacing, layout, breakpoint, layer, animation, CSS/Tailwind và toàn bộ geometry trang trí vẫn nằm trong source code.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function ContentPageLink({ page, active, nested = false }: { page: (typeof adminContentPages)[number]; active: boolean; nested?: boolean }) {
  return (
    <Link
      href={`/admin/content/${page.id}`}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-10 items-center justify-between gap-3 rounded-lg px-3 text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30",
        nested && "min-h-9 text-xs",
        active ? "bg-background font-semibold text-foreground shadow-sm" : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
      )}
    >
      <span className="truncate">{page.label}</span>
      <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">{getPageFieldCount(page)}</span>
    </Link>
  );
}
