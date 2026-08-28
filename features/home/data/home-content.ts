export const homeSectionContent = {
  featuredProjects: {
    title: "Dự án tiêu biểu",
    description:
      "Khám phá những công trình do BMT Decor trực tiếp thiết kế và thi công, khẳng định năng lực và chất lượng trong từng hạng mục.",
  },
  featuredServices: {
    title: "Dịch vụ nổi bật",
    description:
      "BMT Decor cung cấp dịch vụ thiết kế và thi công trọn gói, đáp ứng đa dạng nhu cầu từ nhà ở đến không gian kinh doanh.",
  },
  featuredNews: {
    title: "Tin nổi bật",
  },
  partners: {
    title: "Đối tác của BMT Decor",
  },
} as const;

export const homeHeroSlides = [
  {
    image: "/images/home/hero-background-01.webp",
    alt: "Mẫu nhà phố do BMT Decor thiết kế",
    title: "BMT Decor - Đơn vị thiết kế và thi công trọn gói",
    copy: "Đồng hành cùng khách hàng từ tư vấn, thiết kế đến thi công hoàn thiện, mang đến những không gian bền vững, tối ưu công năng và giá trị sử dụng cho nhà ở, văn phòng và công trình thương mại.",
    href: "/about",
  },
  {
    image: "/images/home/hero-background-02.webp",
    alt: "Không gian nội thất do BMT Decor thực hiện",
    title: "Đáp ứng đa dạng nhu cầu xây dựng & cải tạo",
    copy: "Dù là xây mới, cải tạo hay hoàn thiện nội thất, BMT Decor đều xây dựng giải pháp phù hợp với từng loại hình công trình, quy mô đầu tư và mục tiêu sử dụng.",
    href: "/services/turnkey",
  },
  {
    image: "/images/home/hero-background-03.webp",
    alt: "Công trình thương mại đã hoàn thiện",
    title: "Những công trình đã hoàn thiện",
    copy: "Từ nhà ở, văn phòng, showroom đến các công trình thương mại, mỗi dự án đều là minh chứng cho năng lực thiết kế, thi công và cam kết chất lượng.",
    href: "/projects",
  },
  {
    image: "/images/home/hero-background-04.webp",
    alt: "Hồ sơ năng lực BMT Decor",
    title: "Hồ sơ năng lực BMT Decor",
    copy: "Khám phá năng lực của BMT Decor thông qua đội ngũ chuyên môn, quy trình triển khai, lĩnh vực hoạt động và các dự án tiêu biểu.",
    href: "/capability-profile",
  },
] as const;

export const homeStats = [
  { value: 15, label: "Năm kinh nghiệm" },
  { value: 500, label: "Dự án đã triển khai" },
  { value: 60, label: "Nhân sự" },
] as const;

export const homeServiceDetails = [
  {
    image: "/images/home/trust-card-interior.png",
    desktopImage: "/images/home/service-turnkey-optimized.webp",
    copy: "Cung cấp giải pháp xây dựng trọn gói từ tư vấn, thiết kế, thi công đến hoàn thiện, đảm bảo chất lượng, tiến độ và tối ưu chi phí.",
  },
  {
    image: "/images/home/trust-card-design.png",
    desktopImage: "/images/home/service-design-optimized.webp",
    copy: "Thiết kế không gian hài hòa giữa công năng và thẩm mỹ, mang đến giải pháp phù hợp với nhu cầu sử dụng và phong cách của từng khách hàng.",
  },
  {
    image: "/images/home/trust-card-build.png",
    desktopImage: "/images/home/service-construction-optimized.webp",
    copy: "Thi công công trình theo đúng bản vẽ và tiêu chuẩn kỹ thuật, đảm bảo chất lượng, an toàn và tiến độ trong suốt quá trình thực hiện.",
  },
  {
    image: "/images/home/trust-card-site.png",
    desktopImage: "/images/home/service-renovation-optimized.webp",
    copy: "Nâng cấp, cải tạo và sửa chữa công trình hiện hữu, tối ưu công năng, làm mới không gian và gia tăng giá trị sử dụng.",
  },
] as const;

export const homeMobileServiceLabels = [
  ["XÂY DỰNG", "TRỌN GÓI"],
  ["THIẾT KẾ KIẾN TRÚC &", "NỘI THẤT"],
  ["THI CÔNG", "XÂY DỰNG"],
  ["CẢI TẠO &", "SỬA CHỮA"],
] as const;

export const homeTrustReasons = [
  {
    image: "/images/home/trust-card-interior.png",
    desktopImage: "/images/home/trust-card-team-normal.png",
    desktopHoverImage: "/images/home/trust-card-team-hover.png",
    icon: "/images/home/trust-icon-team.png",
    title: "Đội ngũ giàu kinh nghiệm",
    copy: "Kiến trúc sư và kỹ sư giàu chuyên môn, luôn đồng hành và tư vấn giải pháp phù hợp với nhu cầu của khách hàng.",
  },
  {
    image: "/images/home/trust-card-design.png",
    desktopImage: "/images/home/trust-card-process-normal.png",
    desktopHoverImage: "/images/home/trust-card-process-hover.png",
    icon: "/images/home/trust-icon-plan.png",
    title: "Quy trình chuyên nghiệp",
    copy: "Quy trình làm việc rõ ràng, minh bạch, kiểm soát tiến độ và chất lượng trong từng giai đoạn.",
  },
  {
    image: "/images/home/trust-card-build.png",
    desktopImage: "/images/home/trust-card-turnkey-normal.png",
    desktopHoverImage: "/images/home/trust-card-turnkey-hover.png",
    icon: "/images/home/trust-icon-process.png",
    title: "Thi công trọn gói, đồng bộ",
    copy: "Triển khai xuyên suốt từ thiết kế đến hoàn thiện, đảm bảo tính thống nhất và tối ưu thời gian, chi phí.",
  },
  {
    image: "/images/home/trust-card-site.png",
    desktopImage: "/images/home/trust-card-quality-normal.png",
    desktopHoverImage: "/images/home/trust-card-quality-hover.png",
    icon: "/images/home/trust-icon-quality.png",
    title: "Chất lượng thi công",
    copy: "Thi công đúng kỹ thuật, sử dụng vật liệu phù hợp và kiểm tra kỹ lưỡng trước khi bàn giao.",
  },
] as const;

export const homeNews = [
  {
    image: "/images/home/news-01.png",
    title: "Những lưu ý quan trọng khi bắt đầu thiết kế nhà ở",
    copy: "Những yếu tố cần chuẩn bị trước khi thiết kế để tối ưu công năng, chi phí và hạn chế thay đổi trong quá trình thi công.",
  },
  {
    image: "/images/home/news-02.png",
    title: "Cách lựa chọn phong cách nội thất phù hợp",
    copy: "Gợi ý lựa chọn phong cách dựa trên nhu cầu sử dụng, sở thích cá nhân và đặc điểm thực tế của từng không gian.",
  },
  {
    image: "/images/home/news-03.png",
    title: "Tối ưu ngân sách mà vẫn đảm bảo chất lượng công trình",
    copy: "Cách phân bổ ngân sách hợp lý cho từng hạng mục mà vẫn duy trì chất lượng vật liệu, kỹ thuật và giá trị sử dụng lâu dài.",
  },
] as const;

export type HomeProject = {
  id: string;
  image: string;
  title: string;
  area: string;
  style: string;
  year: number;
};

const homeProjectImages = [
  "/images/home/project-wide-01.png",
  "/images/home/project-wide-02.png",
  "/images/home/project-wide-03.png",
  "/images/home/project-wide-04.png",
  "/images/home/project-wide-01.png",
  "/images/home/project-wide-02.png",
  "/images/home/project-wide-03.png",
  "/images/home/project-wide-04.png",
] as const;

const homeCategoryBlueprints = [
  {
    label: "NHÀ Ở",
    icon: "/images/home/category-house.png",
    desktopIconClassName: "lg:h-auto lg:w-[44px]",
    slug: "nha-o",
    titles: [
      "Nhà phố hiện đại tại Phú Nhuận",
      "Biệt thự sân vườn tại Thủ Đức",
      "Căn hộ tối giản tại The Metropole",
      "Nhà phố kết hợp kinh doanh tại Quận 7",
      "Biệt thự nghỉ dưỡng tại Bảo Lộc",
      "Căn hộ phong cách Japandi tại Bình Thạnh",
      "Nhà phố lệch tầng tại Gò Vấp",
      "Penthouse hiện đại tại Quận 2",
    ],
  },
  {
    label: "VĂN PHÒNG",
    icon: "/images/home/category-office.png",
    desktopIconClassName: "lg:h-auto lg:w-[39px]",
    slug: "van-phong",
    titles: [
      "Văn phòng công nghệ tại Quận 3",
      "Trụ sở doanh nghiệp tại Bình Thạnh",
      "Văn phòng sáng tạo tại Quận 1",
      "Không gian làm việc mở tại Thủ Đức",
      "Văn phòng điều hành tại Tân Bình",
      "Trung tâm đào tạo tại Quận 10",
      "Văn phòng tài chính tại Quận 7",
      "Co-working space tại Phú Nhuận",
    ],
  },
  {
    label: "THẨM MỸ VIỆN, SHOWROOM",
    icon: "/images/home/category-showroom.png",
    desktopIconClassName: "lg:h-auto lg:w-[48px]",
    slug: "showroom",
    titles: [
      "Showroom nội thất tại Quận 2",
      "Thẩm mỹ viện cao cấp tại Quận 1",
      "Cửa hàng thời trang tại Quận 3",
      "Spa chăm sóc da tại Phú Nhuận",
      "Showroom ô tô tại Thủ Đức",
      "Beauty clinic tại Bình Thạnh",
      "Cửa hàng flagship tại Quận 7",
      "Studio trưng bày tại Tân Bình",
    ],
  },
  {
    label: "NHÀ HÀNG, KHÁCH SẠN",
    icon: "/images/home/category-hotel.png",
    desktopIconClassName: "lg:h-auto lg:w-[43px]",
    slug: "hospitality",
    titles: [
      "Nhà hàng đương đại tại Quận 1",
      "Boutique hotel tại Đà Lạt",
      "Nhà hàng sân vườn tại Thủ Đức",
      "Khách sạn nghỉ dưỡng tại Vũng Tàu",
      "Quán café concept tại Quận 3",
      "Nhà hàng Nhật tại Bình Thạnh",
      "Resort ven biển tại Phan Thiết",
      "Khách sạn business tại Tân Bình",
    ],
  },
] as const;

export const homeProjectCategories = homeCategoryBlueprints.map((category) => ({
  ...category,
  projects: category.titles.map<HomeProject>((title, index) => ({
    id: `${category.slug}-${index + 1}`,
    image: homeProjectImages[index],
    title,
    area: `${120 + index * 15}m²`,
    style: index % 2 === 0 ? "Hiện đại" : "Tối giản",
    year: 2024 + (index % 3),
  })),
}));
