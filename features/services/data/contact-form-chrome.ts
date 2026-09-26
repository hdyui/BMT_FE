/**
 * Chữ cố định của form "Liên hệ tư vấn": gợi ý trong 2 ô nhập và thông báo khi
 * bỏ trống. Backend không lưu những chữ này nên admin không sửa; phần còn lại
 * (tiêu đề, mô tả, nút gửi, thông báo thành công) lấy từ API.
 */
export const contactFormChrome = {
  namePlaceholder: "Tên khách hàng...",
  phonePlaceholder: "Số điện thoại...",
  requiredMessage: "Vui lòng nhập thông tin.",
} as const;
