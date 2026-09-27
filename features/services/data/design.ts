import type { SolutionCardLayout } from "@/features/services/api/build";

/**
 * Trang Thiết kế kiến trúc & nội thất: chỉ còn cách TRÌNH BÀY. Chữ và ảnh nội
 * dung đều lấy từ API (`GET /pages/serviceArchitectureInterior`), không lưu ở đây.
 */

// Ảnh nền của nút "Khám phá dự án ..." được vẽ sẵn theo độ dài từng nhãn nên
// nhãn đi cùng ảnh nút, không đổi độc lập.
export const solutionCardLayout: readonly SolutionCardLayout[] = [
  {
    cta: "Khám phá dự án nhà ở",
    ctaImage: "/images/thiet-ke-kien-truc-noi-that/btn-pill-nha-o.png",
    ctaImageWidth: 1408,
    ctaImageHeight: 253,
    ctaImageMobile: "/images/thiet-ke-kien-truc-noi-that/mobile/btn-pill-nha-o.png",
    ctaImageMobileWidth: 1668,
    ctaImageMobileHeight: 253,
  },
  {
    cta: "Khám phá dự án văn phòng",
    ctaImage: "/images/thiet-ke-kien-truc-noi-that/btn-pill-van-phong.png",
    ctaImageWidth: 1655,
    ctaImageHeight: 253,
    ctaImageMobile: "/images/thiet-ke-kien-truc-noi-that/mobile/btn-pill-van-phong.png",
    ctaImageMobileWidth: 1972,
    ctaImageMobileHeight: 253,
  },
  {
    cta: "Khám phá dự án showroom & thẩm mỹ viện",
    ctaImage: "/images/thiet-ke-kien-truc-noi-that/btn-pill-showroom.png",
    ctaImageWidth: 2397,
    ctaImageHeight: 253,
    ctaImageMobile: "/images/thiet-ke-kien-truc-noi-that/mobile/btn-pill-showroom.png",
    ctaImageMobileWidth: 2939,
    ctaImageMobileHeight: 253,
  },
  {
    cta: "Khám phá dự án nhà hàng & khách sạn",
    ctaImage: "/images/thiet-ke-kien-truc-noi-that/btn-pill-nha-hang.png",
    ctaImageWidth: 2206,
    ctaImageHeight: 253,
    ctaImageMobile: "/images/thiet-ke-kien-truc-noi-that/mobile/btn-pill-nha-hang.png",
    ctaImageMobileWidth: 2682,
    ctaImageMobileHeight: 253,
  },
];

// Vòng tròn cam nền của từng bước quy trình là hình vẽ sẵn (đồ trang trí).
export const processCircle = (index: number) =>
  `/images/thiet-ke-kien-truc-noi-that/process-circle-${index + 1}.png`;
