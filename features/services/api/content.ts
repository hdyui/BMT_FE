import type { ServicePageCode } from "@/features/services/api/spec";
import type {
  ServiceDetailContent,
  ServicesOverviewContent,
} from "@/features/services/api/types";
import { fetchPageContent } from "@/shared/lib/api/public-content";

/**
 * Nội dung 5 trang dịch vụ. Trả `null` khi không dùng được (chưa seed, backend
 * lỗi hoặc quá chậm); trang hiện trạng thái "đang cập nhật", không có dữ liệu
 * tĩnh nào thay thế.
 */
export function getServiceDetailContent(pageCode: Exclude<ServicePageCode, "services">) {
  return fetchPageContent<ServiceDetailContent>(pageCode);
}

export function getServicesOverviewContent() {
  return fetchPageContent<ServicesOverviewContent>("services");
}
