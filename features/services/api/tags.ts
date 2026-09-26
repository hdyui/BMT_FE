import type { ServicePageCode } from "@/features/services/api/spec";

/** Tag cache của nội dung từng trang dịch vụ; admin lưu xong thì xóa đúng tag này. */
export function serviceContentTag(pageCode: ServicePageCode) {
  return `service-content:${pageCode}`;
}
