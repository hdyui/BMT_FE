/**
 * Phần chữ của section "Liên hệ tư vấn" nằm cuối các trang.
 *
 * Mỗi trang giữ một bản nội dung RIÊNG (khai báo đầy đủ giá trị, không kế thừa
 * lẫn nhau) để admin sửa trang nào thì chỉ trang đó đổi — sửa trang Báo giá
 * không kéo theo 5 trang Dịch vụ hay trang Hồ sơ năng lực.
 *
 * Chỉ khai báo những chữ thật sự hiển thị trên site: tiêu đề, dòng mô tả (nếu
 * trang đó có), chữ gợi ý trong 2 ô nhập, chữ trên nút gửi, thông báo lỗi khi
 * bỏ trống ô nhập và thông báo hiện ra sau khi gửi thành công. Ảnh nền/khấc của
 * form là đồ trang trí nên không mở cho admin.
 *
 * `title` lưu đúng dạng chữ hiển thị trên site (đang in hoa) — form không còn
 * ép `uppercase` bằng CSS nữa để admin gõ sao thì site hiện y vậy.
 */
export interface ContactFormContent {
  title: string;
  /** Chỉ có ở những trang thật sự in dòng mô tả dưới tiêu đề (hiện tại: Báo giá). */
  description?: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  submitLabel: string;
  /** Hiện dưới ô nhập khi bấm gửi mà ô đó còn trống. */
  requiredMessage: string;
  successMessage: string;
}
