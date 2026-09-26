import { ApiError } from "@/shared/lib/api/errors";

/** Câu báo lỗi cho người dùng khi lưu thay đổi lên backend thất bại. */
export function describeSaveError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 429) {
      return `Bạn thao tác quá nhanh. Vui lòng thử lại sau ${error.retryAfter ?? 60} giây.`;
    }
    if (error.status === 400 || error.status === 422) {
      return "Máy chủ từ chối nội dung này. Vui lòng kiểm tra lại các ô đã sửa.";
    }
    if (error.status === 404 || error.status === 409) {
      return "Nội dung trên máy chủ chưa sẵn sàng hoặc đã thay đổi. Vui lòng tải lại trang.";
    }
    if (error.status >= 500) {
      return "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.";
    }
  }
  return "Không lưu được thay đổi. Vui lòng thử lại.";
}
