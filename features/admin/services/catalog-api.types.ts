export type AdminApiResourceKey =
  | "projects/list"
  | "projects/details"
  | "news/list"
  | "recruitment/jobs"
  | "home/hero"
  | "home/why-bmt"
  | "home/statistics"
  | "home/featured-services"
  | "home/trust-section-content"
  | "home/services-section-content"
  | "home/profile-section-content"
  | "home/contact-form"
  | "about/hero"
  | "about/journey"
  | "about/journey-section-content"
  | "about/vision-mission"
  | "about/core-values"
  | "about/core-values-section-content"
  | "about/capabilities"
  | "about/capabilities-section-content"
  | "about/contact-form"
  | "settings/branding"
  | "settings/partners"
  | "settings/partners-section-content"
  | "settings/footer"
  | "projects/page-hero"
  | "projects/contact-form"
  | "news/page-hero"
  | "news/featured-section-content"
  | "news/contact-form"
  | "recruitment/hero"
  | "recruitment/jobs-section-content"
  | "recruitment/contact-form"
  | "contacts/hero"
  | "contacts/map"
  | "contacts/form";

export const HOME_ADMIN_API_RESOURCE_KEYS = [
  "home/hero",
  "home/why-bmt",
  "home/statistics",
  "home/featured-services",
  "home/trust-section-content",
  "home/services-section-content",
  "home/profile-section-content",
  "home/contact-form",
] as const satisfies readonly AdminApiResourceKey[];

export function isHomeAdminApiResourceKey(
  value: string,
): value is (typeof HOME_ADMIN_API_RESOURCE_KEYS)[number] {
  return (HOME_ADMIN_API_RESOURCE_KEYS as readonly string[]).includes(value);
}

export const ABOUT_ADMIN_API_RESOURCE_KEYS = [
  "about/hero",
  "about/journey",
  "about/journey-section-content",
  "about/vision-mission",
  "about/core-values",
  "about/core-values-section-content",
  "about/capabilities",
  "about/capabilities-section-content",
  "about/contact-form",
] as const satisfies readonly AdminApiResourceKey[];

export function isAboutAdminApiResourceKey(
  value: string,
): value is (typeof ABOUT_ADMIN_API_RESOURCE_KEYS)[number] {
  return (ABOUT_ADMIN_API_RESOURCE_KEYS as readonly string[]).includes(value);
}

export const SETTINGS_ADMIN_API_RESOURCE_KEYS = [
  "settings/branding",
  "settings/partners",
  "settings/partners-section-content",
  "settings/footer",
] as const satisfies readonly AdminApiResourceKey[];

export function isSettingsAdminApiResourceKey(
  value: string,
): value is (typeof SETTINGS_ADMIN_API_RESOURCE_KEYS)[number] {
  return (SETTINGS_ADMIN_API_RESOURCE_KEYS as readonly string[]).includes(value);
}

export const PROJECTS_PAGE_ADMIN_API_RESOURCE_KEYS = [
  "projects/page-hero",
  "projects/contact-form",
] as const satisfies readonly AdminApiResourceKey[];

export function isProjectsPageAdminApiResourceKey(
  value: string,
): value is (typeof PROJECTS_PAGE_ADMIN_API_RESOURCE_KEYS)[number] {
  return (PROJECTS_PAGE_ADMIN_API_RESOURCE_KEYS as readonly string[]).includes(
    value,
  );
}

export const NEWS_PAGE_ADMIN_API_RESOURCE_KEYS = [
  "news/page-hero",
  "news/featured-section-content",
  "news/contact-form",
] as const satisfies readonly AdminApiResourceKey[];

export function isNewsPageAdminApiResourceKey(
  value: string,
): value is (typeof NEWS_PAGE_ADMIN_API_RESOURCE_KEYS)[number] {
  return (NEWS_PAGE_ADMIN_API_RESOURCE_KEYS as readonly string[]).includes(
    value,
  );
}

export const RECRUITMENT_PAGE_ADMIN_API_RESOURCE_KEYS = [
  "recruitment/hero",
  "recruitment/jobs-section-content",
  "recruitment/contact-form",
] as const satisfies readonly AdminApiResourceKey[];

export function isRecruitmentPageAdminApiResourceKey(
  value: string,
): value is (typeof RECRUITMENT_PAGE_ADMIN_API_RESOURCE_KEYS)[number] {
  return (
    RECRUITMENT_PAGE_ADMIN_API_RESOURCE_KEYS as readonly string[]
  ).includes(value);
}

export const CONTACT_PAGE_ADMIN_API_RESOURCE_KEYS = [
  "contacts/hero",
  "contacts/map",
  "contacts/form",
] as const satisfies readonly AdminApiResourceKey[];

export function isContactPageAdminApiResourceKey(
  value: string,
): value is (typeof CONTACT_PAGE_ADMIN_API_RESOURCE_KEYS)[number] {
  return (CONTACT_PAGE_ADMIN_API_RESOURCE_KEYS as readonly string[]).includes(
    value,
  );
}

export function isFixedPageAdminApiResourceKey(value: string) {
  return (
    isHomeAdminApiResourceKey(value) ||
    isAboutAdminApiResourceKey(value) ||
    isSettingsAdminApiResourceKey(value) ||
    isProjectsPageAdminApiResourceKey(value) ||
    isNewsPageAdminApiResourceKey(value) ||
    isRecruitmentPageAdminApiResourceKey(value) ||
    isContactPageAdminApiResourceKey(value)
  );
}

export type FormSubmissionStatus = "pending" | "done";

export interface FormSubmissionItem {
  id: string;
  customerName: string;
  phone: string;
  status: FormSubmissionStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface FormSubmissionsPage {
  items: FormSubmissionItem[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
