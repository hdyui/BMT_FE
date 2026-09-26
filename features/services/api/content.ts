import type { ServicePageCode } from "@/features/services/api/spec";
import { serviceContentTag } from "@/features/services/api/tags";
import type {
  ServiceDetailContent,
  ServicesOverviewContent,
} from "@/features/services/api/types";
import { apiRequest } from "@/shared/lib/api/client";
import { ApiError } from "@/shared/lib/api/errors";

/**
 * Lưới an toàn: sau khoảng này (giây) trang public tự lấy lại nội dung từ
 * backend. Bình thường admin lưu xong sẽ xóa cache ngay (`revalidateServicePage`),
 * khoảng này chỉ phục vụ khi dữ liệu đổi từ nơi khác (ví dụ sửa thẳng ở backend).
 */
const REVALIDATE_SECONDS = 60;
/** Backend chậm (khởi động lạnh) thì dùng dữ liệu tĩnh thay vì bắt khách chờ. */
const TIMEOUT_MS = 4000;

/**
 * Lấy nội dung một trang dịch vụ. Trả `null` khi không dùng được — chưa seed
 * (404/409), backend lỗi hoặc quá chậm — để trang public quay về dữ liệu tĩnh
 * có sẵn, không bao giờ vỡ trang.
 */
async function fetchServiceContent<T>(pageCode: ServicePageCode): Promise<T | null> {
  try {
    const page = await apiRequest<{ pageCode: string; content: T }>(`/pages/${pageCode}`, {
      public: true,
      next: { revalidate: REVALIDATE_SECONDS, tags: [serviceContentTag(pageCode)] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return page.content;
  } catch (error) {
    const expected = error instanceof ApiError && (error.status === 404 || error.status === 409);
    if (!expected) console.warn(`[services] Không lấy được nội dung ${pageCode}:`, error);
    return null;
  }
}

export function getServiceDetailContent(pageCode: Exclude<ServicePageCode, "services">) {
  return fetchServiceContent<ServiceDetailContent>(pageCode);
}

export function getServicesOverviewContent() {
  return fetchServiceContent<ServicesOverviewContent>("services");
}
