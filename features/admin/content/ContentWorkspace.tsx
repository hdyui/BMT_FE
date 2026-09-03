"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ContentGroupGrid } from "@/features/admin/components/ContentGroupGrid";
import {
  getContentPage,
  getPageFieldCount,
  getResourceFieldCount,
} from "@/features/admin/lib/content-pages";
import { getEditableAdminSections } from "@/features/admin/lib/editor-field-visibility";
import {
  adminResourceRegistry,
  getAdminResourceGroup,
} from "@/features/admin/lib/mock-data/resource-registry";

export function ContentWorkspace({ selectedId = "home" }: { selectedId?: string }) {
  const selected = getContentPage(selectedId) ?? getContentPage("home")!;
  const catalogShortcut = catalogShortcutByContentPage[selected.id];
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
  const useSingleColumnResourceList = [
    "home",
    "about",
    "projects",
    "news",
    "recruitment",
    "contact",
  ].includes(selected.id);

  return (
    // Danh sách trang giờ nằm ở sidebar chung của shell, nên ở đây chỉ còn nội dung.
    <div className="min-h-[calc(100dvh-64px)]">
      <div className="min-w-0 p-4 sm:p-6 lg:p-8">
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

          {catalogShortcut && (
            <section className="mb-6 overflow-hidden rounded-xl border border-dashed bg-muted/20">
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">Danh sách được quản lý riêng trong Danh mục</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Tại đây chỉ chỉnh nội dung trình bày của trang. Muốn thêm, xóa hoặc sửa từng {catalogShortcut.itemLabel}, hãy chuyển sang Danh mục.
                  </p>
                </div>
                <Link
                  href={catalogShortcut.href}
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border bg-background px-3 text-sm font-semibold outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  Mở Danh mục <ArrowRight className="size-4" />
                </Link>
              </div>
              {selected.id === "news" && (
                <div className="flex flex-col gap-3 border-t border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold">Tin nổi bật</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Quản lý các bài viết xuất hiện trong section Tin nổi bật.
                    </p>
                  </div>
                  <Link
                    href="/admin/news/featured"
                    className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border bg-background px-3 text-sm font-semibold outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30"
                  >
                    Mở Tin nổi bật <ArrowRight className="size-4" />
                  </Link>
                </div>
              )}
            </section>
          )}

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
              items={serviceGroup.items.map((item) => ({
                title: item.title,
                description: getDetailedResourceDescription(item.description, getResourceKeyFromHref(item.href)),
                count: item.count,
                href: item.href,
              }))}
            />
          ) : standaloneGroupItems ? (
            <ContentGroupGrid
              items={standaloneGroupItems}
            />
          ) : selected.id === "about" ? (
            <>
              <ContentGroupGrid
                items={getContentItems(["about/hero"])}
              />
              <ContentGroupGrid
                startIndex={1}
                items={getContentItems([
                  "about/journey",
                  "about/vision-mission",
                  "about/core-values",
                ])}
              />
              <ContentGroupGrid
                startIndex={4}
                items={getContentItems(["about/capabilities"])}
              />
              <ContentGroupGrid
                startIndex={5}
                items={getContentItems(["about/contact-form"])}
              />
            </>
          ) : useSingleColumnResourceList ? (
            <ContentGroupGrid
              items={selected.resourceKeys.flatMap((resourceKey) => {
                const resource = adminResourceRegistry[resourceKey];
                if (!resource) return [];
                return [{
                  title: resource.title,
                  description: resource.description,
                  href: getContentResourceHref(resourceKey),
                }];
              })}
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
      </div>
    </div>
  );
}

function getContentItems(resourceKeys: string[]) {
  return resourceKeys.flatMap((resourceKey) => {
    const resource = adminResourceRegistry[resourceKey];
    if (!resource) return [];
    return [{
      title: resource.title,
      description: resource.description,
      count: `${getResourceFieldCount(resourceKey)} trường`,
      href: getContentResourceHref(resourceKey),
    }];
  });
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
  if (resourceKey === "projects/list") {
    return "/admin/projects";
  }
  if (resourceKey === "recruitment/jobs") {
    return "/admin/recruitment";
  }
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

const catalogShortcutByContentPage: Record<string, { href: string; itemLabel: string }> = {
  projects: { href: "/admin/projects", itemLabel: "dự án" },
  news: { href: "/admin/news", itemLabel: "bài viết" },
  recruitment: { href: "/admin/recruitment", itemLabel: "vị trí tuyển dụng" },
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
