import type { ContactFormContent } from "@/lib/components/shared/contact-form-content";

// Nội dung riêng của section "Liên hệ tư vấn" trên trang Hồ sơ năng lực.
// Cố ý khai báo đầy đủ (không dùng chung với các trang khác) để admin sửa trang
// này thì chỉ trang này đổi.
export const contactFormContent: ContactFormContent = {
  title: "LIÊN HỆ TƯ VẤN",
  namePlaceholder: "Tên khách hàng...",
  phonePlaceholder: "Số điện thoại...",
  submitLabel: "Gửi ngay",
  requiredMessage: "Vui lòng nhập thông tin.",
  successMessage:
    "Cảm ơn bạn đã gửi thông tin. BMT Decor sẽ liên hệ với bạn trong thời gian sớm nhất.",
};
