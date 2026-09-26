import { apiRequest } from "@/shared/lib/api/client";
import { ApiError } from "@/shared/lib/api/errors";

/**
 * Lấy nội dung công khai (không cần đăng nhập) từ backend ở phía server và cache
 * lại theo tag, để admin lưu xong có thể xóa đúng phần cache đó
 * (`revalidatePublicContent`).
 */

/**
 * Lưới an toàn: sau khoảng này (giây) trang public tự lấy lại nội dung từ
 * backend. Bình thường admin lưu xong sẽ xóa cache ngay, khoảng này chỉ phục vụ
 * khi dữ liệu đổi từ nơi khác (ví dụ sửa thẳng ở backend).
 */
const REVALIDATE_SECONDS = 60;
/** Backend chậm (khởi động lạnh) thì hiện trạng thái "đang cập nhật" thay vì bắt khách chờ. */
const TIMEOUT_MS = 4000;

/** Tag cache của một endpoint công khai, ví dụ `/pages/quotation`. */
export function publicContentTag(path: string) {
  return `public-content:${path}`;
}

/**
 * GET một endpoint công khai. Trả `null` khi không dùng được (chưa có dữ liệu,
 * backend lỗi hoặc quá chậm); trang phải tự hiện trạng thái "đang cập nhật"
 * chứ không có dữ liệu tĩnh nào thay thế.
 */
export async function fetchPublicContent<T>(path: string): Promise<T | null> {
  try {
    return await apiRequest<T>(path, {
      public: true,
      next: { revalidate: REVALIDATE_SECONDS, tags: [publicContentTag(path)] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    const expected = error instanceof ApiError && (error.status === 404 || error.status === 409);
    if (!expected) console.warn(`[content] Không lấy được ${path}:`, error);
    return null;
  }
}

/** Nội dung một trang: `GET /pages/{pageCode}` trả `{ pageCode, content }`. */
export async function fetchPageContent<T>(pageCode: string): Promise<T | null> {
  const page = await fetchPublicContent<{ pageCode: string; content: T }>(`/pages/${pageCode}`);
  return page?.content ?? null;
}
