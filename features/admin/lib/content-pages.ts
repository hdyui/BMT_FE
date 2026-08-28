import { adminResourceRegistry } from "@/features/admin/lib/mock-data/resource-registry";
import { getEditableAdminSections } from "@/features/admin/lib/editor-field-visibility";

export interface AdminContentPageDefinition {
  id: string;
  label: string;
  publicRoute: string;
  resourceKeys: string[];
  sourceFiles: string[];
  children?: AdminContentPageDefinition[];
}

/**
 * Thứ tự các trang khớp đúng thứ tự mục trên thanh header của website
 * (`navigation` trong shared/constants/site.ts): Trang chủ → Giới thiệu → Dịch vụ →
 * Dự án → Hồ sơ năng lực → Báo giá → Tin tức → Tuyển dụng. Trang Liên hệ
 * không nằm trên header nên xếp cuối.
 *
 * Đầu trang và Cuối trang không phải là trang nội dung nên nằm ở
 * Hệ thống → Cấu hình (`app/admin/settings/page.tsx`), không liệt kê ở đây.
 */
export const adminContentPages: AdminContentPageDefinition[] = [
  {
    id: "home",
    label: "Trang chủ",
    publicRoute: "/",
    resourceKeys: ["home/hero", "home/why-bmt", "home/statistics", "home/featured-projects", "home/featured-services", "home/profile-section-content", "home/featured-news", "home/contact-form"],
    sourceFiles: ["features/home/data/home-content.ts", "features/home/pages/HomePage.tsx"],
  },
  {
    id: "about",
    label: "Giới thiệu",
    publicRoute: "/about",
    resourceKeys: ["about/hero", "about/journey", "about/vision-mission", "about/core-values", "about/capabilities", "about/contact-form"],
    sourceFiles: ["features/about/data/about-content.ts", "features/about/pages/AboutPage.tsx"],
  },
  {
    id: "services",
    label: "Dịch vụ",
    publicRoute: "/services",
    resourceKeys: [],
    sourceFiles: ["features/services/pages/ServicesOverviewPage.tsx"],
    children: [
      servicePage("services-overview", "Trang tổng quan", "/services", "overview"),
      servicePage("turnkey", "Xây dựng trọn gói", "/services/turnkey", "xay-dung-tron-goi"),
      servicePage("design", "Thiết kế Kiến trúc và Nội thất", "/services/design", "thiet-ke-kien-truc-noi-that"),
      servicePage("construction", "Thi công xây dựng", "/services/construction", "thi-cong-xay-dung"),
      servicePage("renovation", "Cải tạo & sửa chữa", "/services/renovation", "cai-tao-sua-chua"),
    ],
  },
  {
    id: "projects",
    label: "Dự án",
    publicRoute: "/projects",
    resourceKeys: ["projects/page-hero", "projects/list-section-content", "projects/contact-form"],
    sourceFiles: ["features/projects/data/projects-page.ts", "features/projects/data/related-projects.ts"],
  },
  {
    id: "capability-profile",
    label: "Hồ sơ năng lực",
    publicRoute: "/capability-profile",
    resourceKeys: ["settings/capability-profile", "settings/capability-profile/contact-form"],
    sourceFiles: ["features/capability-profile/components/CapabilityHero.tsx", "features/capability-profile/components/ProfileDocumentSection.tsx"],
  },
  {
    id: "quotation",
    label: "Báo giá",
    publicRoute: "/quotation",
    resourceKeys: ["quotation/hero", "quotation/estimator", "quotation/contact-form"],
    sourceFiles: ["features/quotation/data/quotation-estimator.ts", "features/quotation/pages/QuotationPage.tsx"],
  },
  {
    id: "news",
    label: "Tin tức",
    publicRoute: "/news",
    resourceKeys: ["news/page-hero", "news/featured-section-content", "news/contact-form"],
    sourceFiles: ["features/news/data/news-page.ts", "features/news/pages/NewsPage.tsx"],
  },
  {
    id: "recruitment",
    label: "Tuyển dụng",
    publicRoute: "/careers",
    resourceKeys: ["recruitment/hero", "recruitment/jobs-section-content", "recruitment/contact-form"],
    sourceFiles: ["features/careers/components/CareersHero.tsx"],
  },
  // Trang Liên hệ không có trên thanh header nên xếp sau các mục của header.
  {
    id: "contact",
    label: "Liên hệ",
    publicRoute: "/contact",
    resourceKeys: ["contacts/hero", "contacts/form", "contacts/map"],
    sourceFiles: ["features/contact/pages/ContactPage.tsx", "shared/components/ContactForm.tsx"],
  },
];

function servicePage(id: string, label: string, publicRoute: string, path: string): AdminContentPageDefinition {
  const prefix = `services/${path}/`;
  // `path` is the internal resource-registry key segment; `pageFiles`/`dataFiles`
  // map it to the English component and data-file names on disk.
  const pageFiles: Record<string, string> = {
    overview: "ServicesOverviewPage",
    "xay-dung-tron-goi": "FullConstructionServicePage",
    "thiet-ke-kien-truc-noi-that": "DesignServicePage",
    "thi-cong-xay-dung": "ConstructionServicePage",
    "cai-tao-sua-chua": "RenovationServicePage",
  };
  const dataFiles: Record<string, string> = {
    overview: "overview",
    "xay-dung-tron-goi": "turnkey",
    "thiet-ke-kien-truc-noi-that": "design",
    "thi-cong-xay-dung": "construction",
    "cai-tao-sua-chua": "renovation",
  };
  const pageFile = pageFiles[path];
  const dataFile = dataFiles[path] ?? path;
  const pageResourceKeys = Object.keys(adminResourceRegistry).filter((key) =>
    key.startsWith(prefix),
  );
  const companionKeys = new Set(
    pageResourceKeys
      .map((key) => adminResourceRegistry[key]?.companionResourceKey)
      .filter((key): key is string => Boolean(key)),
  );
  return {
    id,
    label,
    publicRoute,
    resourceKeys: pageResourceKeys.filter((key) => !companionKeys.has(key)),
    sourceFiles: [`features/services/data/${dataFile}.ts`, `features/services/pages/${pageFile}.tsx`],
  };
}

export function getContentPage(id: string) {
  return flattenContentPages().find((page) => page.id === id);
}

export function flattenContentPages() {
  return adminContentPages.flatMap((page) => [page, ...(page.children ?? [])]);
}

export function getResourceFieldCount(resourceKey: string): number {
  const resource = adminResourceRegistry[resourceKey];
  if (!resource) return 0;
  const ownFields = getEditableAdminSections(resource.sections).reduce(
    (total, section) => total + section.fields.length,
    0,
  );
  return ownFields +
    (resource.companionResourceKey
      ? getResourceFieldCount(resource.companionResourceKey)
      : 0);
}

export function getPageFieldCount(page: AdminContentPageDefinition): number {
  const own = page.resourceKeys.reduce((total, key) => total + getResourceFieldCount(key), 0);
  return own + (page.children ?? []).reduce((total, child) => total + getPageFieldCount(child), 0);
}
