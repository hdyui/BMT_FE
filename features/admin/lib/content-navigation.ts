import type { AdminResourceConfig } from "@/lib/admin/types/crud";

const servicePageBySlug: Record<string, { label: string; href: string }> = {
  overview: { label: "Tổng quan", href: "/admin/content/services-overview" },
  "xay-dung-tron-goi": { label: "Xây dựng trọn gói", href: "/admin/content/turnkey" },
  "thiet-ke-kien-truc-noi-that": { label: "Thiết kế Kiến trúc & Nội thất", href: "/admin/content/design" },
  "thi-cong-xay-dung": { label: "Thi công xây dựng", href: "/admin/content/construction" },
  "cai-tao-sua-chua": { label: "Cải tạo & sửa chữa", href: "/admin/content/renovation" },
};

export function getResourceBreadcrumb(config: AdminResourceConfig) {
  if (config.key === "settings/capability-profile") {
    return [{ label: "Hồ sơ năng lực", href: "/admin/content/capability-profile" }];
  }

  const items = [{ label: config.moduleLabel, href: config.moduleHref }];

  if (config.module === "services") {
    const parent = servicePageBySlug[config.path.split("/")[0]];
    if (parent) items.push(parent);
  }

  return items;
}
