/**
 * Chữ cố định của form "Liên hệ tư vấn": gợi ý trong 2 ô nhập, chữ trên nút gửi
 * và thông báo khi bỏ trống. Backend chỉ lưu một phần (tiêu đề, mô tả, thông báo
 * thành công, và ở vài trang là chữ nút/thông báo bỏ trống); phần nào backend
 * không lưu thì lấy ở đây và admin không sửa.
 */
export const contactFormChrome = {
  namePlaceholder: "Tên khách hàng...",
  phonePlaceholder: "Số điện thoại...",
  submitLabel: "Gửi ngay",
  requiredMessage: "Vui lòng nhập thông tin.",
} as const;
