import type { HomeHeroSlideContent } from "@/features/admin/lib/types/content";

export const mockHomeHeroSlides: HomeHeroSlideContent[] = [
  {
    id: "home-hero-01",
    title: "BMT Decor - Đơn vị thiết kế và thi công trọn gói",
    description:
      "Đồng hành cùng khách hàng từ tư vấn, thiết kế đến thi công hoàn thiện, mang đến những không gian bền vững và tối ưu công năng.",
    ctaLabel: "Khám phá BMT Decor",
    ctaHref: "/about",
    desktopImage: "/images/home/hero-background-01.webp",
    desktopAlt: "Mẫu nhà phố do BMT Decor thiết kế",
    mobileImage: "/images/home/hero-background-01.webp",
    mobileAlt: "Mẫu nhà phố do BMT Decor thiết kế trên thiết bị di động",
    order: 1,
    enabled: true,
  },
  {
    id: "home-hero-02",
    title: "Đáp ứng đa dạng nhu cầu xây dựng & cải tạo",
    description:
      "Từ xây mới, cải tạo đến hoàn thiện nội thất, BMT Decor xây dựng giải pháp phù hợp với từng loại hình công trình.",
    ctaLabel: "Xem giải pháp",
    ctaHref: "/services/turnkey",
    desktopImage: "/images/home/hero-background-02.webp",
    desktopAlt: "Không gian nội thất do BMT Decor thực hiện",
    mobileImage: "/images/home/hero-background-02.webp",
    mobileAlt: "Không gian nội thất BMT Decor trên thiết bị di động",
    order: 2,
    enabled: true,
  },
  {
    id: "home-hero-03",
    title: "Những công trình đã hoàn thiện",
    description:
      "Mỗi dự án là minh chứng cho năng lực thiết kế, thi công và cam kết chất lượng của đội ngũ BMT Decor.",
    ctaLabel: "Xem dự án",
    ctaHref: "/projects",
    desktopImage: "/images/home/hero-background-03.webp",
    desktopAlt: "Công trình thương mại đã hoàn thiện",
    mobileImage: "/images/home/hero-background-03.webp",
    mobileAlt: "Công trình BMT Decor trên thiết bị di động",
    order: 3,
    enabled: true,
  },
  {
    id: "home-hero-04",
    title: "Hồ sơ năng lực BMT Decor",
    description:
      "Khám phá đội ngũ chuyên môn, quy trình triển khai, lĩnh vực hoạt động và các dự án tiêu biểu của BMT Decor.",
    ctaLabel: "Xem hồ sơ năng lực",
    ctaHref: "/capability-profile",
    desktopImage: "/images/home/hero-background-04.webp",
    desktopAlt: "Hồ sơ năng lực BMT Decor",
    mobileImage: "/images/home/hero-background-04.webp",
    mobileAlt: "Hồ sơ năng lực BMT Decor trên thiết bị di động",
    order: 4,
    enabled: true,
  },
];
