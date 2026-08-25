"use client";

import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";

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
import {
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function ContentWorkspace({ selectedId = "home" }: { selectedId?: string }) {
  const selected = getContentPage(selectedId) ?? getContentPage("home")!;
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
          description: getDetailedResourceDescription(resource.description, resourceKey),
          count: `${getResourceFieldCount(resourceKey)} trường`,
          href: getContentResourceHref(resourceKey),
        }];
      })
    : undefined;

  return (
    <div className="grid min-h-[calc(100dvh-64px)] lg:grid-cols-[232px_minmax(0,1fr)]">
      <div className="border-b border-sidebar-border bg-sidebar lg:border-b-0">
        <aside
          data-content-sidebar
          className="bg-sidebar text-sidebar-foreground lg:fixed lg:top-16 lg:bottom-0 lg:w-[232px] lg:border-r lg:border-sidebar-border"
        >
          <div className="admin-scrollbar max-h-[48dvh] overflow-y-auto p-3 lg:h-full lg:max-h-none">
            <nav aria-label="Các trang nội dung">
              <SidebarMenu className="gap-1">
                {adminContentPages.map((page) => (
                  <SidebarMenuItem key={page.id}>
                    <ContentPageLink page={page} active={selected.id === page.id} />
                    {page.children && (
                      <SidebarMenuSub className="mt-1.5 gap-1">
                        {page.children.map((child) => (
                          <SidebarMenuSubItem key={child.id}>
                            <ContentPageLink page={child} active={selected.id === child.id} nested />
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </nav>
          </div>
        </aside>
      </div>

      <main className="min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1180px]">
          <header className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
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
              className="inline-flex h-8 items-center justify-center rounded-md border bg-background px-3 text-xs font-bold outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30"
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
                description: getDetailedResourceDescription(item.description, getResourceKeyFromHref(item.href)),
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
          <section className="mt-5">
            <div className="py-5">
              <h2 className="font-semibold">Các nhóm nội dung</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Chọn nhóm cần cập nhật cho trang này.
              </p>
            </div>
            {selected.resourceKeys.length > 0 ? (
              <div className="border-t border-border/70">
                {selected.resourceKeys.map((resourceKey) => {
                  const resource = adminResourceRegistry[resourceKey];
                  if (!resource) return null;
                  const fieldLabels = getResourceFieldLabels(resourceKey);
                  return (
                    <article className="grid gap-4 border-b border-border/70 py-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center" key={resourceKey}>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{resource.title}</h3>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
                        <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
                          {fieldLabels.slice(0, 8).map((label, index) => (
                            <span className="text-[11px] text-muted-foreground after:ml-2 after:content-[','] last:after:content-none" key={`${label}-${index}`}>{label}</span>
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

function getResourceKeyFromHref(href: string) {
  return Object.keys(adminResourceRegistry).find(
    (resourceKey) => getContentResourceHref(resourceKey) === href,
  );
}

function getDetailedResourceDescription(description: string, resourceKey?: string) {
  if (!resourceKey) return description;
  const labels = Array.from(
    new Set(getResourceFieldLabels(resourceKey).map(getConciseFieldLabel).filter(Boolean)),
  );
  if (labels.length === 0) return description;

  const visibleLabels = labels.slice(0, 5);
  const remainingCount = labels.length - visibleLabels.length;
  const fieldSummary = formatVietnameseList(visibleLabels);
  const remainingSummary = remainingCount > 0 ? ` và ${remainingCount} nội dung liên quan khác` : "";
  return `${description} Có thể chỉnh sửa ${fieldSummary}${remainingSummary}.`;
}

function getConciseFieldLabel(label: string) {
  return (label.split("·").at(-1)?.trim() ?? label)
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatVietnameseList(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} và ${items.at(-1)}`;
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
    "services-overview": "Quản lý nội dung phần mở đầu, danh sách dịch vụ, quy trình làm việc và các câu hỏi thường gặp trên trang tổng quan.",
    turnkey: "Quản lý phần mở đầu, dự án tiêu biểu, các giải pháp thi công và quy trình xây dựng trọn gói.",
    design: "Quản lý phần mở đầu, thư viện hình ảnh, các giải pháp nổi bật và quy trình thiết kế kiến trúc, nội thất.",
    construction: "Quản lý phần mở đầu, danh sách dự án, quy trình thi công và nội dung hiển thị riêng trên thiết bị di động.",
    renovation: "Quản lý phần mở đầu, dự án tiêu biểu, các giải pháp và nội dung dành cho dịch vụ cải tạo, sửa chữa.",
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
    <section className="mt-1">
      <div className="flex items-center gap-3 py-5">
        <Layers3 className="size-4 text-brand" />
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div>
        {items.map((item, index) => (
          <Link
            className="flex items-start gap-4 border-b border-border/70 py-5 outline-none last:border-b-0 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30 sm:gap-5"
            href={item.href}
            key={item.href}
          >
            <span className="mt-0.5 shrink-0 text-xs font-semibold tabular-nums text-brand">
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
  const href = `/admin/content/${page.id}`;

  if (nested) {
    return (
      <SidebarMenuSubButton
        render={<Link href={href} aria-current={active ? "page" : undefined} />}
        isActive={active}
        size="sm"
        className="h-7 px-2.5 text-[13px] hover:bg-brand/10 data-active:font-semibold data-active:text-brand data-active:hover:bg-sidebar-accent data-active:hover:text-brand"
      >
        <span className="min-w-0 flex-1 truncate">{page.label}</span>
        <span className="shrink-0 text-[10px] font-normal tabular-nums text-sidebar-foreground/50">{getPageFieldCount(page)}</span>
      </SidebarMenuSubButton>
    );
  }

  return (
    <SidebarMenuButton
      render={<Link href={href} aria-current={active ? "page" : undefined} />}
      isActive={active}
      size="sm"
      className="px-2.5 text-[13px] hover:bg-brand/10 data-active:font-semibold data-active:text-brand data-active:hover:bg-sidebar-accent data-active:hover:text-brand"
    >
      <span className="truncate">{page.label}</span>
      <SidebarMenuBadge className="text-[10px] font-normal text-sidebar-foreground/50 peer-data-active/menu-button:text-sidebar-accent-foreground/60">
        {getPageFieldCount(page)}
      </SidebarMenuBadge>
    </SidebarMenuButton>
  );
}
