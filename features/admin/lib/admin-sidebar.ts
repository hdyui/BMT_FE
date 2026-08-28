import {
  adminContentPages,
  getPageFieldCount,
  getResourceFieldCount,
} from "@/lib/admin/content-pages";
import type { AdminSectionKey } from "@/lib/admin/constants/navigation";
import { adminResourceRegistry } from "@/lib/admin/mock-data/resource-registry";
import { adminSettingsGroups } from "@/lib/admin/settings-groups";

/**
 * Sidebar riêng của từng mục trên header. Sidebar bám theo mục đang mở, kể cả
 * khi admin đã đi sâu vào một màn hình chỉnh sửa — vào sửa nội dung không làm
 * mất điều hướng.
 */
export interface AdminSidebarLink {
  label: string;
  href: string;
  /** Con số nhỏ bên phải: số nội dung có thể chỉnh sửa. */
  badge?: string;
  children?: AdminSidebarLink[];
}

export interface AdminSidebarGroup {
  label?: string;
  items: AdminSidebarLink[];
}

export interface AdminSidebarModel {
  title: string;
  groups: AdminSidebarGroup[];
}

/** Những đường dẫn thuộc mục Tổng quan. */
const OVERVIEW_PREFIXES = ["/admin/dashboard"];

/**
 * Nội dung mở đầu của trang Dự án / Tin tức / Tuyển dụng là nội dung trang, do
 * mục "Nội dung trang" quản lý. Mục "Danh mục" chỉ lo các bản ghi, nên không
 * liệt kê chúng ở sidebar Danh mục.
 */
const CONTENT_OWNED_RESOURCE_KEYS = new Set([
  "projects/page-hero",
  "projects/list-section-content",
  "news/page-hero",
  "news/featured-section-content",
  "recruitment/hero",
  "recruitment/jobs-section-content",
]);

/** Các nhóm đã được feedback bỏ khỏi giao diện quản trị. Giữ resource/data để
 * không tác động trang public, nhưng không đưa chúng vào điều hướng Admin. */
const HIDDEN_CATALOG_RESOURCE_KEYS = new Set([
  "projects/details",
  "projects/related",
  "projects/related-section-content",
]);

/** Ba module quản lý bản ghi, gom dưới mục Danh mục trên header. */
const CATALOG_MODULES = [
  { module: "projects", label: "Dự án", href: "/admin/projects" },
  { module: "news", label: "Tin tức", href: "/admin/news" },
  { module: "recruitment", label: "Tuyển dụng", href: "/admin/recruitment" },
] as const;

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function getAdminSectionKey(pathname: string): AdminSectionKey {
  if (OVERVIEW_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix))) {
    return "overview";
  }
  if (CATALOG_MODULES.some((item) => matchesPrefix(pathname, item.href))) {
    return "catalog";
  }
  // Hồ sơ năng lực nằm trong module `settings` nhưng là một trang của website,
  // nên phải xét trước khi rơi vào mục Cấu hình.
  if (
    matchesPrefix(pathname, "/admin/settings/capability-profile") ||
    matchesPrefix(pathname, "/admin/capability-profile")
  ) {
    return "content";
  }
  if (matchesPrefix(pathname, "/admin/settings")) return "settings";
  return "content";
}


/**
 * Sidebar mục Tổng quan. Hiện mới có một mục, giữ nguyên khung sidebar cho đồng
 * bộ với các mục khác và để sau này thêm màn hình mới thì bỏ thẳng vào đây.
 */
function getOverviewSidebar(): AdminSidebarModel {
  return {
    title: "Tổng quan",
    groups: [{ items: [{ label: "Bảng điều khiển", href: "/admin/dashboard" }] }],
  };
}

/**
 * Vài tài nguyên có sẵn một trang riêng đẹp hơn đường dẫn suy ra từ registry —
 * trỏ thẳng vào đó để không có hai địa chỉ cho cùng một màn hình.
 */
const CATALOG_CANONICAL_HREF: Record<string, string> = {
  "projects/list": "/admin/projects",
  "news/list": "/admin/news",
  "recruitment/jobs": "/admin/recruitment",
};

/**
 * Sidebar mục Danh mục: mỗi module một nhóm, các mục lấy thẳng từ registry nên
 * thêm tài nguyên mới là sidebar tự có. Bỏ qua tài nguyên đồng hành vì chúng
 * được sửa ngay trong màn hình của tài nguyên chính.
 */
function getCatalogSidebar(): AdminSidebarModel {
  const companionKeys = new Set(
    Object.values(adminResourceRegistry)
      .map((resource) => resource.companionResourceKey)
      .filter((key): key is string => Boolean(key)),
  );

  return {
    title: "Danh mục",
    groups: CATALOG_MODULES.map((item) => ({
      label: item.label,
      items: Object.values(adminResourceRegistry)
        .filter(
          (resource) =>
            resource.module === item.module &&
            !companionKeys.has(resource.key) &&
            !HIDDEN_CATALOG_RESOURCE_KEYS.has(resource.key) &&
            !CONTENT_OWNED_RESOURCE_KEYS.has(resource.key),
        )
        .map((resource) => ({
          label: resource.navigationLabel ?? resource.title,
          href:
            CATALOG_CANONICAL_HREF[resource.key] ??
            `/admin/${resource.module}/${resource.path}`,
          badge: String(getResourceFieldCount(resource.key)),
        })),
    })),
  };
}

/** Sidebar mục Nội dung trang: danh sách trang theo đúng thứ tự trên header website. */
function getContentSidebar(): AdminSidebarModel {
  return {
    title: "Nội dung trang",
    groups: [
      {
        items: adminContentPages.map((page) => ({
          label: page.label,
          href: `/admin/content/${page.id}`,
          badge: String(getPageFieldCount(page)),
          children: page.children?.map((child) => ({
            label: child.label,
            href: `/admin/content/${child.id}`,
            badge: String(getPageFieldCount(child)),
          })),
        })),
      },
    ],
  };
}

/** Sidebar mục Cấu hình. */
function getSettingsSidebar(): AdminSidebarModel {
  return {
    title: "Cấu hình",
    groups: [
      {
        items: adminSettingsGroups.map((group) => ({
          label: group.title,
          href: group.href,
          badge: String(getResourceFieldCount(group.resourceKey)),
        })),
      },
    ],
  };
}

export function getAdminSidebar(pathname: string): AdminSidebarModel {
  switch (getAdminSectionKey(pathname)) {
    case "overview":
      return getOverviewSidebar();
    case "catalog":
      return getCatalogSidebar();
    case "settings":
      return getSettingsSidebar();
    default:
      return getContentSidebar();
  }
}

/**
 * Trang nội dung đang mở, kể cả khi admin đứng ở một màn hình chỉnh sửa sâu bên
 * trong. Nhờ vậy sidebar vẫn tô sáng đúng trang thay vì mất dấu.
 */
export function getActiveContentPageHref(pathname: string): string | undefined {
  if (pathname === "/admin/content") return "/admin/content/home";
  if (pathname.startsWith("/admin/content/")) return pathname;

  const page = adminContentPages
    .flatMap((item) => [item, ...(item.children ?? [])])
    .find((item) =>
      item.resourceKeys.some((resourceKey) => {
        const resource = adminResourceRegistry[resourceKey];
        if (!resource) return false;
        return matchesPrefix(pathname, `/admin/${resource.module}/${resource.path}`);
      }),
    );
  return page ? `/admin/content/${page.id}` : undefined;
}

/**
 * Chuẩn hóa route sâu về đúng mục đang đại diện ở sidebar. Nhờ vậy route mặc
 * định và route chỉnh sửa một record vẫn giữ nền active ở sidebar.
 */
export function getActiveSidebarHref(pathname: string): string | undefined {
  const section = getAdminSectionKey(pathname);

  if (section === "content") {
    return getActiveContentPageHref(pathname);
  }

  if (section === "settings") {
    if (pathname === "/admin/settings") return adminSettingsGroups[0]?.href;
    return adminSettingsGroups
      .map((group) => group.href)
      .sort((left, right) => right.length - left.length)
      .find((href) => matchesPrefix(pathname, href));
  }

  if (section === "catalog") {
    const resources = Object.values(adminResourceRegistry)
      .filter(
        (resource) =>
          CATALOG_MODULES.some((item) => item.module === resource.module) &&
          !HIDDEN_CATALOG_RESOURCE_KEYS.has(resource.key) &&
          !CONTENT_OWNED_RESOURCE_KEYS.has(resource.key),
      )
      .map((resource) => ({
        resource,
        route: `/admin/${resource.module}/${resource.path}`,
      }))
      .sort((left, right) => right.route.length - left.route.length);

    const matched = resources.find(({ route }) => matchesPrefix(pathname, route));
    if (matched) {
      return (
        CATALOG_CANONICAL_HREF[matched.resource.key] ??
        `/admin/${matched.resource.module}/${matched.resource.path}`
      );
    }

    const catalogModule = CATALOG_MODULES.find((item) => matchesPrefix(pathname, item.href));
    if (!catalogModule) return undefined;
    const canonical = Object.entries(CATALOG_CANONICAL_HREF).find(([resourceKey]) =>
      resourceKey.startsWith(`${catalogModule.module}/`),
    );
    return canonical?.[1] ?? catalogModule.href;
  }

  return pathname;
}
