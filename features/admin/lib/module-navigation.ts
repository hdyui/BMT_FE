import {
  adminResourceGroups,
  adminResourceRegistry,
} from "@/features/admin/lib/mock-data/resource-registry";
import type {
  AdminModuleKey,
  AdminModuleNavigationItem,
  AdminNavigationContext,
} from "@/features/admin/lib/types/crud";

const moduleLabels: Record<AdminModuleKey, string> = {
  home: "Trang chủ",
  about: "Giới thiệu",
  services: "Dịch vụ",
  projects: "Dự án",
  news: "Tin tức",
  recruitment: "Tuyển dụng",
  quotation: "Báo giá",
  contacts: "Liên hệ",
  seo: "SEO",
  settings: "Cấu hình",
};

const serviceGroups = [
  ["overview", "Tổng quan dịch vụ"],
  ["xay-dung-tron-goi", "Xây dựng trọn gói"],
  ["thiet-ke-kien-truc-noi-that", "Thiết kế KT & Nội thất"],
  ["thi-cong-xay-dung", "Thi công xây dựng"],
  ["cai-tao-sua-chua", "Cải tạo & sửa chữa"],
] as const;

export function getAdminNavigationContext(
  module: AdminModuleKey,
  resourceKey?: string,
): AdminNavigationContext {
  const primary: AdminModuleNavigationItem[] = [];

  if (module === "services") {
    primary.push(
      ...serviceGroups.map(([path, label]) => ({
        label,
        href: `/admin/services/${path}`,
      })),
    );
  } else {
    primary.push(
      ...Object.values(adminResourceRegistry)
        .filter(
          (resource) =>
            resource.module === module && !resource.path.includes("/"),
        )
        .map((resource) => ({
          label: resource.navigationLabel ?? resource.title,
          href: `/admin/${module}/${resource.path}`,
        })),
    );
  }

  const serviceGroupKey =
    module === "services" && resourceKey
      ? Object.keys(adminResourceGroups)
          .filter(
            (key) => resourceKey === key || resourceKey.startsWith(`${key}/`),
          )
          .sort((a, b) => b.length - a.length)[0]
      : undefined;
  const serviceGroup = serviceGroupKey
    ? adminResourceGroups[serviceGroupKey]
    : undefined;

  return {
    primary: {
      label: `Điều hướng module ${moduleLabels[module]}`,
      items: primary,
    },
    ...(serviceGroup && resourceKey !== serviceGroupKey
      ? {
          secondary: {
            label: `Tài nguyên ${serviceGroup.title}`,
            items: serviceGroup.items.map((item) => ({
                label: item.title,
                href: item.href,
              })),
          },
        }
      : {}),
  };
}
