"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Layers3, Search } from "lucide-react";

import {
  adminContentPages,
  getContentPage,
  getPageFieldCount,
  getResourceFieldCount,
} from "@/lib/admin/content-pages";
import { getEditableAdminSections } from "@/lib/admin/editor-field-visibility";
import {
  adminResourceRegistry,
  getAdminResourceGroup,
} from "@/lib/admin/mock-data/resource-registry";
import { Input } from "@/components/ui/input";
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
  const serviceGroupKey = serviceGroupByContentPage[selected.id];
  const serviceGroup = serviceGroupKey
    ? getAdminResourceGroup(`services/${serviceGroupKey}`)
    : undefined;
  const standaloneGroupItems = ["quotation", "capability-profile"].includes(selected.id)
    ? selected.resourceKeys.flatMap((resourceKey) => {
        const resource = adminResourceRegistry[resourceKey];
        if (!resource) return [];
        return [{
          title: resource.title,
          description: resource.description,
          count: `${getResourceFieldCount(resourceKey)} trường`,
          href: getContentResourceHref(resourceKey),
        }];
      })
    : undefined;

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
                <span>{getPageFieldCount(selected)} nội dung có thể chỉnh sửa</span>
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

          {selected.id === "services" ? (
            <ContentGroupGrid
              title="Các trang Dịch vụ"
              description="Chọn trang cần quản lý nội dung."
              items={(selected.children ?? []).map((page) => ({
                title: page.label,
                description: getServicePageDescription(page.id),
                count: `${getPageFieldCount(page)} trường`,
                href: `/admin/content/${page.id}`,
              }))}
            />
          ) : serviceGroup ? (
            <ContentGroupGrid
              title="Các phần nội dung"
              description={`Chọn phần cần cập nhật trên trang ${selected.label}.`}
              items={serviceGroup.items.map((item) => ({
                title: item.title,
                description: item.description,
                count: item.count,
                href: item.href,
              }))}
            />
          ) : standaloneGroupItems ? (
            <ContentGroupGrid
              title="Các phần nội dung"
              description={`Chọn phần cần cập nhật trên trang ${selected.label}.`}
              items={standaloneGroupItems}
            />
          ) : (
          <section className="mt-6 overflow-hidden rounded-2xl border bg-card">
            <div className="border-b px-5 py-4 sm:px-6">
              <h2 className="font-semibold">Các nhóm nội dung</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Chọn nhóm cần cập nhật cho trang này.
              </p>
            </div>
            {selected.resourceKeys.length > 0 ? (
              <div className="divide-y">
                {selected.resourceKeys.map((resourceKey) => {
                  const resource = adminResourceRegistry[resourceKey];
                  if (!resource) return null;
                  const fieldLabels = getResourceFieldLabels(resourceKey);
                  return (
                    <article className="grid gap-4 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center" key={resourceKey}>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{resource.title}</h3>
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
                Chọn một trang dịch vụ cụ thể để xem và chỉnh sửa nội dung.
              </div>
            )}
          </section>
          )}
        </div>
      </main>
    </div>
  );
}

function getResourceFieldLabels(resourceKey: string): string[] {
  const resource = adminResourceRegistry[resourceKey];
  if (!resource) return [];
  const ownLabels = getEditableAdminSections(resource.sections).flatMap((section) =>
    section.fields.map((field) => field.label),
  );
  return resource.companionResourceKey
    ? [...getResourceFieldLabels(resource.companionResourceKey), ...ownLabels]
    : ownLabels;
}

function getContentResourceHref(resourceKey: string) {
  if (resourceKey === "settings/capability-profile") {
    return "/admin/capability-profile/content";
  }
  const resource = adminResourceRegistry[resourceKey];
  return resource ? `/admin/${resource.module}/${resource.path}` : "/admin/content";
}

const serviceGroupByContentPage: Record<string, string> = {
  "services-overview": "overview",
  turnkey: "xay-dung-tron-goi",
  design: "thiet-ke-kien-truc-noi-that",
  construction: "thi-cong-xay-dung",
  renovation: "cai-tao-sua-chua",
};

function getServicePageDescription(id: string) {
  const descriptions: Record<string, string> = {
    "services-overview": "Phần mở đầu, danh sách dịch vụ, quy trình và câu hỏi thường gặp.",
    turnkey: "Phần mở đầu, dự án tiêu biểu, giải pháp và quy trình xây dựng trọn gói.",
    design: "Phần mở đầu, thư viện ảnh, giải pháp và quy trình thiết kế.",
    construction: "Phần mở đầu, dự án, quy trình và nội dung riêng trên điện thoại.",
    renovation: "Phần mở đầu, dự án, giải pháp và nội dung cải tạo, sửa chữa.",
  };
  return descriptions[id] ?? "Quản lý các phần nội dung của trang dịch vụ.";
}

function ContentGroupGrid({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: Array<{ title: string; description: string; count?: string; href: string }>;
}) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border bg-card">
      <div className="flex items-center gap-3 border-b px-5 py-4 sm:px-6">
        <span className="grid size-9 place-items-center rounded-xl bg-muted text-brand">
          <Layers3 className="size-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className={cn("grid", items.length > 1 && "md:grid-cols-2")}>
        {items.map((item, index) => (
          <Link
            className={cn(
              "group flex min-h-36 items-start gap-4 border-b p-5 outline-none transition-colors hover:bg-muted/55 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30 sm:p-6",
              items.length > 1 && "md:odd:border-r",
              index >= items.length - (items.length % 2 || 2) && "md:border-b-0",
            )}
            href={item.href}
            key={item.href}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg border bg-background text-xs font-bold text-brand">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{item.title}</h3>
                {item.count && <span className="text-xs text-muted-foreground">{item.count}</span>}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
                Quản lý <ArrowRight className="size-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
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
