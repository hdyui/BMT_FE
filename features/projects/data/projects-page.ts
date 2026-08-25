export type ProjectCategory =
  | "Nhà ở"
  | "Văn phòng"
  | "Thẩm mỹ viện, showroom"
  | "Nhà hàng, khách sạn";

export type ProjectCardData = {
  title: string;
};

export const tempProjectDetailSlug = "nha-pho-2-tang-quan-9";

export const projectsPageHeroContent = {
  title: "MỖI CÔNG TRÌNH\nMỘT CAM KẾT CHẤT LƯỢNG",
  description:
    "Mỗi dự án là minh chứng cho năng lực thiết kế thi công và sự tận tâm của BMT Decor. Từ những công trình xây mới đến các dự án cải tạo trọn gói, thi công nội thất và sửa chữa nhà, chúng tôi luôn đồng hành cùng khách hàng từ ý tưởng đến hoàn thiện, tạo nên những không gian bền vững, thẩm mỹ và phù hợp với nhu cầu sử dụng thực tế.",
} as const;

const card = (title: string): ProjectCardData => ({ title });

export const projectCategories: {
  label: ProjectCategory;
  icon: string;
  activeIcon: string;
  iconClassName: string;
  mobileIcon: string;
  mobileActiveIcon: string;
  mobileIconClassName: string;
  mobileIconWidth: number;
  mobileIconHeight: number;
}[] = [
  {
    label: "Nhà ở",
    icon: "/images/projects/category-house-active.png",
    activeIcon: "/images/projects/category-house-active.png",
    iconClassName: "w-[44px]",
    mobileIcon: "/images/projects/mobile/category-house.png",
    mobileActiveIcon: "/images/projects/mobile/category-house-active.png",
    mobileIconClassName: "w-[32px]",
    mobileIconWidth: 257,
    mobileIconHeight: 199,
  },
  {
    label: "Văn phòng",
    icon: "/images/projects/category-office.png",
    activeIcon: "/images/projects/category-office-active.png",
    iconClassName: "w-[39px]",
    mobileIcon: "/images/projects/mobile/category-office.png",
    mobileActiveIcon: "/images/projects/mobile/category-office-active.png",
    mobileIconClassName: "w-[27px]",
    mobileIconWidth: 188,
    mobileIconHeight: 223,
  },
  {
    label: "Thẩm mỹ viện, showroom",
    icon: "/images/projects/category-showroom.png",
    activeIcon: "/images/projects/category-showroom-active.png",
    iconClassName: "w-[48px]",
    mobileIcon: "/images/projects/mobile/category-showroom.png",
    mobileActiveIcon: "/images/projects/mobile/category-showroom-active.png",
    mobileIconClassName: "w-[35px]",
    mobileIconWidth: 308,
    mobileIconHeight: 199,
  },
  {
    label: "Nhà hàng, khách sạn",
    icon: "/images/projects/category-hospitality.png",
    activeIcon: "/images/projects/category-hospitality-active.png",
    iconClassName: "w-[43px]",
    mobileIcon: "/images/projects/mobile/category-hospitality.png",
    mobileActiveIcon: "/images/projects/mobile/category-hospitality-active.png",
    mobileIconClassName: "w-[31px]",
    mobileIconWidth: 225,
    mobileIconHeight: 235,
  },
];

export const projectPageImages = [
  "/images/projects/project-01.png",
  "/images/projects/project-02.png",
  "/images/projects/project-03.png",
  "/images/projects/project-04.png",
  "/images/projects/project-05.png",
  "/images/projects/project-06.png",
  "/images/projects/project-07.png",
  "/images/projects/project-08.png",
  "/images/projects/project-09.png",
];

export const projectCards: Record<ProjectCategory, ProjectCardData[]> = {
  "Nhà ở": [
    card("Nhà Phú Nhuận"), card("Nhà Bình Thạnh"), card("Căn hộ 2 PN cao cấp"),
    card("Chung cư La Astoria Q.2"), card("Căn hộ The Opera Residence"),
    card("Nhà phố 2 tầng Quận 9"), card("Nhà phố Bình Chánh"),
    card("Căn hộ chung cư Q9"), card("Căn hộ chung cư Q7"),
    card("Nhà phố Thủ Đức"), card("Biệt thự sân vườn Đồng Nai"),
    card("Căn hộ Midtown Phú Mỹ Hưng"),
  ],
  "Văn phòng": [
    card("Văn phòng BMT Decor"), card("Văn phòng quận Bình Thạnh"),
    card("Không gian làm việc Tân Bình"), card("Văn phòng điều hành Quận 3"),
    card("Studio sáng tạo Phú Nhuận"), card("Văn phòng công nghệ Thủ Đức"),
    card("Trụ sở doanh nghiệp Quận 7"), card("Văn phòng giao dịch Quận 1"),
    card("Không gian co-working Gò Vấp"),
  ],
  "Thẩm mỹ viện, showroom": [
    card("Showroom nội thất BMT"), card("Thẩm mỹ viện Quận 3"),
    card("Showroom vật liệu Thủ Đức"), card("Spa chăm sóc da Phú Nhuận"),
    card("Showroom thời trang Quận 1"), card("Trung tâm làm đẹp Tân Bình"),
    card("Showroom thiết bị Quận 7"), card("Salon cao cấp Bình Thạnh"),
    card("Không gian trưng bày Gò Vấp"),
  ],
  "Nhà hàng, khách sạn": [
    card("Nhà hàng sân vườn Thủ Đức"), card("Khách sạn boutique Quận 1"),
    card("Nhà hàng gia đình Tân Bình"), card("Café & Restaurant Quận 3"),
    card("Khách sạn nghỉ dưỡng Đồng Nai"), card("Nhà hàng Nhật Bình Thạnh"),
    card("Sảnh tiệc Quận 7"), card("Café sân thượng Phú Nhuận"),
    card("Nhà hàng Á Đông Gò Vấp"),
  ],
};
