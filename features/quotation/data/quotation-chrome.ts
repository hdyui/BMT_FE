/**
 * Chữ cố định của công cụ ước tính mà backend không lưu, nên admin không sửa:
 * hai nút điều hướng, tiêu đề bước kết quả, trạng thái tính và thông báo kiểm tra
 * đầu vào. Mọi nội dung khác (nhãn bước, tiêu đề, lựa chọn, ô nhập, khoảng giá)
 * lấy từ backend.
 */
export const quotationChrome = {
  back: "Quay lại",
  next: "Tiếp tục",
  resultHeading: "ƯỚC TÍNH CỦA BẠN",
  calculating: "Đang tính ước tính...",
  calculateFailed: "Không tính được ước tính lúc này.",
  retry: "Thử lại",
  areaRequired: "Vui lòng nhập diện tích.",
  budgetRequired: "Vui lòng nhập ngân sách.",
  digitsOnly: "Vui lòng chỉ nhập số",
  areaRange: "Diện tích từ 10 đến 50.000 m².",
  budgetMax: "Ngân sách tối đa 1.000 tỷ đồng.",
} as const;
