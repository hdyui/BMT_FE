import type { ProjectLayout, SolutionCardLayout } from "@/features/services/api/build";

/**
 * Trang Thi công xây dựng: chỉ còn cách TRÌNH BÀY. Chữ và ảnh nội dung đều lấy từ
 * API (`GET /pages/serviceConstruction`), không lưu ở đây.
 */

// Thứ tự đặt theo mockup: carousel lấy index 0 làm thẻ giữa, index 2 nằm bên
// trái và index 1 nằm bên phải. Dự án thứ ba là ảnh ngang nên phủ kín khung.
export const featuredProjectLayout: readonly ProjectLayout[] = [{}, {}, { fit: "cover" }];

// Ảnh nền của nút "KHÁM PHÁ DỰ ÁN ..." được vẽ sẵn theo độ dài từng nhãn nên
// nhãn đi cùng ảnh nút, không đổi độc lập.
export const solutionCardLayout: readonly SolutionCardLayout[] = [
  {
    cta: "KHÁM PHÁ DỰ ÁN NHÀ Ở",
    ctaImage: "/images/thi-cong-xay-dung/btn-pill-nha-o.png",
    ctaImageWidth: 1408,
    ctaImageHeight: 253,
    ctaImageMobile: "/images/xay-dung-tron-goi/mobile/btn-pill-nha-o.png",
    ctaImageMobileWidth: 1668,
    ctaImageMobileHeight: 253,
  },
  {
    cta: "KHÁM PHÁ DỰ ÁN VĂN PHÒNG",
    ctaImage: "/images/thi-cong-xay-dung/btn-pill-van-phong.png",
    ctaImageWidth: 1655,
    ctaImageHeight: 253,
    ctaImageMobile: "/images/xay-dung-tron-goi/mobile/btn-pill-van-phong.png",
    ctaImageMobileWidth: 1972,
    ctaImageMobileHeight: 253,
  },
  {
    cta: "KHÁM PHÁ DỰ ÁN SHOWROOM & THẨM MỸ VIỆN",
    ctaImage: "/images/thi-cong-xay-dung/btn-pill-showroom.png",
    ctaImageWidth: 2397,
    ctaImageHeight: 253,
    ctaImageMobile: "/images/xay-dung-tron-goi/mobile/btn-pill-showroom.png",
    ctaImageMobileWidth: 2939,
    ctaImageMobileHeight: 253,
  },
  {
    cta: "KHÁM PHÁ DỰ ÁN NHÀ HÀNG & KHÁCH SẠN",
    ctaImage: "/images/thi-cong-xay-dung/btn-pill-nha-hang.png",
    ctaImageWidth: 2206,
    ctaImageHeight: 253,
    ctaImageMobile: "/images/xay-dung-tron-goi/mobile/btn-pill-nha-hang.png",
    ctaImageMobileWidth: 2682,
    ctaImageMobileHeight: 253,
  },
];
