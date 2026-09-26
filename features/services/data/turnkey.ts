import type { ProjectLayout, SolutionCardLayout } from "@/features/services/api/build";

/**
 * Trang Thiết kế thi công trọn gói: chỉ còn cách TRÌNH BÀY. Chữ và ảnh nội dung
 * đều lấy từ API (`GET /pages/serviceTurnkey`), không lưu ở đây.
 */

// Cả ba ảnh dự án đều phủ kín khung và phóng nhẹ khi rê chuột.
export const featuredProjectLayout: readonly ProjectLayout[] = [
  { fit: "cover", zoom: true },
  { fit: "cover", zoom: true },
  { fit: "cover", zoom: true },
];

// Ảnh nền của nút "Khám phá dự án ..." được vẽ sẵn theo độ dài từng nhãn nên
// nhãn đi cùng ảnh nút, không đổi độc lập.
export const solutionCardLayout: readonly SolutionCardLayout[] = [
  {
    cta: "Khám phá dự án nhà ở",
    ctaImage: "/images/xay-dung-tron-goi/btn-pill-nha-o.png",
    ctaImageWidth: 1408,
    ctaImageHeight: 253,
    ctaImageMobile: "/images/xay-dung-tron-goi/mobile/btn-pill-nha-o.png",
    ctaImageMobileWidth: 1668,
    ctaImageMobileHeight: 253,
  },
  {
    cta: "Khám phá dự án văn phòng",
    ctaImage: "/images/xay-dung-tron-goi/btn-pill-van-phong.png",
    ctaImageWidth: 1655,
    ctaImageHeight: 253,
    ctaImageMobile: "/images/xay-dung-tron-goi/mobile/btn-pill-van-phong.png",
    ctaImageMobileWidth: 1972,
    ctaImageMobileHeight: 253,
  },
  {
    cta: "Khám phá dự án showroom & thẩm mỹ viện",
    ctaImage: "/images/xay-dung-tron-goi/btn-pill-showroom.png",
    ctaImageWidth: 2397,
    ctaImageHeight: 253,
    ctaImageMobile: "/images/xay-dung-tron-goi/mobile/btn-pill-showroom.png",
    ctaImageMobileWidth: 2939,
    ctaImageMobileHeight: 253,
  },
  {
    cta: "Khám phá dự án nhà hàng & khách sạn",
    ctaImage: "/images/xay-dung-tron-goi/btn-pill-nha-hang.png",
    ctaImageWidth: 2206,
    ctaImageHeight: 253,
    ctaImageMobile: "/images/xay-dung-tron-goi/mobile/btn-pill-nha-hang.png",
    ctaImageMobileWidth: 2682,
    ctaImageMobileHeight: 253,
  },
];
