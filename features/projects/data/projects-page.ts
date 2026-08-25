export type ProjectCategory =
  | "Nhà ở"
  | "Văn phòng"
  | "Thẩm mỹ viện, showroom"
  | "Nhà hàng, khách sạn";

export type ProjectCardData = {
  title: string;
  slug: string;
  href: string;
};

const card = (title: string, slug: string): ProjectCardData => ({ title, slug, href: `/du-an/${slug}` });

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
    card("Nhà Phú Nhuận", "nha-phu-nhuan"), card("Nhà Bình Thạnh", "nha-binh-thanh"), card("Căn hộ 2 PN cao cấp", "can-ho-2-phong-ngu-cao-cap"),
    card("Chung cư La Astoria Q.2", "chung-cu-la-astoria-q2"), card("Căn hộ The Opera Residence", "can-ho-the-opera-residence"),
    card("Nhà phố 2 tầng Quận 9", "nha-pho-2-tang-quan-9"), card("Nhà phố Bình Chánh", "nha-pho-binh-chanh"),
    card("Căn hộ chung cư Q9", "can-ho-chung-cu-q9"), card("Căn hộ chung cư Q7", "can-ho-chung-cu-q7"),
    card("Nhà phố Thủ Đức", "nha-pho-thu-duc"), card("Biệt thự sân vườn Đồng Nai", "biet-thu-san-vuon-dong-nai"),
    card("Căn hộ Midtown Phú Mỹ Hưng", "can-ho-midtown-phu-my-hung"),
  ],
  "Văn phòng": [
    card("Văn phòng BMT Decor", "van-phong-bmt-decor"), card("Văn phòng quận Bình Thạnh", "van-phong-binh-thanh"),
    card("Không gian làm việc Tân Bình", "khong-gian-lam-viec-tan-binh"), card("Văn phòng điều hành Quận 3", "van-phong-dieu-hanh-quan-3"),
    card("Studio sáng tạo Phú Nhuận", "studio-sang-tao-phu-nhuan"), card("Văn phòng công nghệ Thủ Đức", "van-phong-cong-nghe-thu-duc"),
    card("Trụ sở doanh nghiệp Quận 7", "tru-so-doanh-nghiep-quan-7"), card("Văn phòng giao dịch Quận 1", "van-phong-giao-dich-quan-1"),
    card("Không gian co-working Gò Vấp", "co-working-go-vap"),
  ],
  "Thẩm mỹ viện, showroom": [
    card("Showroom nội thất BMT", "showroom-noi-that-bmt"), card("Thẩm mỹ viện Quận 3", "tham-my-vien-quan-3"),
    card("Showroom vật liệu Thủ Đức", "showroom-vat-lieu-thu-duc"), card("Spa chăm sóc da Phú Nhuận", "spa-cham-soc-da-phu-nhuan"),
    card("Showroom thời trang Quận 1", "showroom-thoi-trang-quan-1"), card("Trung tâm làm đẹp Tân Bình", "trung-tam-lam-dep-tan-binh"),
    card("Showroom thiết bị Quận 7", "showroom-thiet-bi-quan-7"), card("Salon cao cấp Bình Thạnh", "salon-cao-cap-binh-thanh"),
    card("Không gian trưng bày Gò Vấp", "khong-gian-trung-bay-go-vap"),
  ],
  "Nhà hàng, khách sạn": [
    card("Nhà hàng sân vườn Thủ Đức", "nha-hang-san-vuon-thu-duc"), card("Khách sạn boutique Quận 1", "khach-san-boutique-quan-1"),
    card("Nhà hàng gia đình Tân Bình", "nha-hang-gia-dinh-tan-binh"), card("Café & Restaurant Quận 3", "cafe-restaurant-quan-3"),
    card("Khách sạn nghỉ dưỡng Đồng Nai", "khach-san-nghi-duong-dong-nai"), card("Nhà hàng Nhật Bình Thạnh", "nha-hang-nhat-binh-thanh"),
    card("Sảnh tiệc Quận 7", "sanh-tiec-quan-7"), card("Café sân thượng Phú Nhuận", "cafe-san-thuong-phu-nhuan"),
    card("Nhà hàng Á Đông Gò Vấp", "nha-hang-a-dong-go-vap"),
  ],
};
