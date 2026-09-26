import type { SolutionCardLayout } from "@/features/services/api/build";

/**
 * Trang Cải tạo & sửa chữa: chỉ còn cách TRÌNH BÀY. Chữ và ảnh nội dung đều lấy
 * từ API (`GET /pages/serviceRenovation`), không lưu ở đây.
 */

// Ảnh nền của nút "KHÁM PHÁ DỰ ÁN ..." được vẽ sẵn theo độ dài từng nhãn nên
// nhãn đi cùng ảnh nút, không đổi độc lập.
export const solutionCardLayout: readonly SolutionCardLayout[] = [
  {
    cta: "KHÁM PHÁ DỰ ÁN NHÀ Ở",
    ctaImage: "/images/cai-tao-sua-chua/btn-pill-nha-o.png",
    ctaImageWidth: 1408,
    ctaImageHeight: 253,
  },
  {
    cta: "KHÁM PHÁ DỰ ÁN VĂN PHÒNG",
    ctaImage: "/images/cai-tao-sua-chua/btn-pill-van-phong.png",
    ctaImageWidth: 1655,
    ctaImageHeight: 253,
  },
  {
    cta: "KHÁM PHÁ DỰ ÁN SHOWROOM & THẨM MỸ VIỆN",
    ctaImage: "/images/cai-tao-sua-chua/btn-pill-showroom.png",
    ctaImageWidth: 2397,
    ctaImageHeight: 253,
  },
  {
    cta: "KHÁM PHÁ DỰ ÁN NHÀ HÀNG & KHÁCH SẠN",
    ctaImage: "/images/cai-tao-sua-chua/btn-pill-nha-hang.png",
    ctaImageWidth: 2206,
    ctaImageHeight: 253,
  },
];
