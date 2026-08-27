import type { ContactFormContent } from "@/lib/components/shared/contact-form-content";

// Nội dung riêng của section "Liên hệ tư vấn" trên trang Báo giá. Trang này là
// trang duy nhất có thêm dòng mô tả dưới tiêu đề. Cố ý khai báo đầy đủ (không
// dùng chung với các trang khác) để admin sửa trang này thì chỉ trang này đổi.
export const contactFormContent: ContactFormContent = {
  title: "NHẬN BÁO GIÁ CHI TIẾT",
  description:
    "Để lại thông tin, chúng tôi sẽ gửi báo giá chi tiết theo từng hạng mục miễn phí, không ràng buộc.",
  namePlaceholder: "Tên khách hàng...",
  phonePlaceholder: "Số điện thoại...",
  submitLabel: "Gửi ngay",
  requiredMessage: "Vui lòng nhập thông tin.",
  successMessage:
    "Cảm ơn bạn đã gửi thông tin. BMT Decor sẽ gửi báo giá chi tiết trong thời gian sớm nhất.",
};
