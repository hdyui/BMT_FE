import { fetchPageContent, fetchPublicContent } from "@/shared/lib/api/public-content";

/** Một trang của cuốn hồ sơ (`GET /capability-profile/pages` → `items`). */
export interface CapabilityProfilePage {
  id: string;
  imageUrl: string;
  /** Thứ tự đọc; nhỏ đứng trước. */
  metadata?: { sortOrder?: number | null } | null;
}

/** Nội dung trang Hồ sơ năng lực (`GET /pages/capability-profile` → `content`). */
export interface CapabilityProfileContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    heroImage?: string;
    /** Hình phác thảo công trình ở góc trái banner. */
    decor08?: string;
    documentHeading: string;
  };
  contactForm: {
    title: string;
    subtitle?: string;
    successMessage: string;
  };
}

/** Trang public: `null` khi backend không trả được nội dung. */
export function getCapabilityProfileContent() {
  return fetchPageContent<CapabilityProfileContent>("capability-profile");
}

/** Các trang của cuốn hồ sơ; `null` khi backend không trả được (khác với danh sách rỗng). */
export async function getCapabilityProfilePages() {
  const result = await fetchPublicContent<{ items: CapabilityProfilePage[] }>(
    "/capability-profile/pages",
  );
  return result?.items ?? null;
}
