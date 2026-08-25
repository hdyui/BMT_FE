import { contactInformation, navigation } from "@/config/site";
import {
  aboutCoreValues,
  aboutJourneyMilestones,
} from "@/features/about/data/about-content";
import { careerJobs } from "@/features/careers/data/jobs";
import {
  homeMobileServiceLabels,
  homeNews,
  homeProjectCategories,
  homeServiceDetails,
  homeStats,
  homeTrustReasons,
} from "@/features/home/data/home-content";
import {
  articleMedia,
  articles,
  featuredNews,
} from "@/features/news/data/news-page";
import {
  quotationAreaInput,
  quotationBudgetInput,
  quotationBuildingTypes,
  quotationNavLabels,
  quotationResultIncludeLabel,
  quotationServiceTypes,
  quotationStepCopy,
  quotationMobileHeroImage,
  quotationSteps,
} from "@/features/quotation/data/quotation-estimator";
import {
  frequentlyAskedQuestions,
  heroCards as overviewHeroCards,
  processSteps as overviewProcess,
  serviceTabs,
} from "@/features/services/data/overview";
import {
  featuredProjects as turnkeyProjects,
  mobileHeroArtwork as turnkeyMobileHeroArtwork,
  processSteps as turnkeyProcess,
  solutionCards as turnkeySolutions,
} from "@/features/services/data/xay-dung-tron-goi";
import {
  featuredProjects as designProjects,
  mobileHeroArtwork as designMobileHeroArtwork,
  processSteps as designProcess,
  solutionCards as designSolutions,
} from "@/features/services/data/thiet-ke-kien-truc-noi-that";
import {
  featuredProjects as constructionProjects,
  mobileHeroBlueprint as constructionMobileHeroBlueprint,
  processSteps as constructionProcess,
  solutionCards as constructionSolutions,
} from "@/features/services/data/thi-cong-xay-dung";
import {
  featuredProjects as renovationProjects,
  processSteps as renovationProcess,
  solutionCards as renovationSolutions,
} from "@/features/services/data/cai-tao-sua-chua";
import { mockHomeHeroSlides } from "@/lib/admin/mock-data/home";
import { mockProjectContent } from "@/lib/admin/mock-data/projects";
import type {
  AdminCrudRecord,
  AdminEditorSectionConfig,
  AdminFieldConfig,
  AdminModuleKey,
  AdminResourceConfig,
  AdminResourceGroupConfig,
} from "@/lib/admin/types/crud";

const text = (
  key: string,
  label: string,
  options: Partial<AdminFieldConfig> = {},
): AdminFieldConfig => ({ key, label, type: "text", ...options });

const textarea = (
  key: string,
  label: string,
  options: Partial<AdminFieldConfig> = {},
): AdminFieldConfig => ({ key, label, type: "textarea", ...options });

const number = (
  key: string,
  label: string,
  options: Partial<AdminFieldConfig> = {},
): AdminFieldConfig => ({ key, label, type: "number", min: 0, ...options });

const url = (
  key: string,
  label: string,
  options: Partial<AdminFieldConfig> = {},
): AdminFieldConfig => ({ key, label, type: "url", ...options });

const image = (
  key: string,
  label: string,
  options: Partial<AdminFieldConfig> = {},
): AdminFieldConfig => ({ key, label, type: "image", ...options });

const lockedImage = (key: string, label: string): AdminFieldConfig =>
  image(key, label, { editable: false });

const boolean = (key: string, label: string): AdminFieldConfig => ({
  key,
  label,
  type: "boolean",
});

const list = (
  key: string,
  label: string,
  options: Partial<AdminFieldConfig> = {},
): AdminFieldConfig => ({ key, label, type: "list", ...options });

const section = (
  id: string,
  title: string,
  fields: AdminFieldConfig[],
  description?: string,
): AdminEditorSectionConfig => ({ id, title, fields, description });

const record = (
  id: string,
  data: Record<string, string | number | boolean | string[]>,
): AdminCrudRecord => ({ id, ...data });

const moduleLabels: Record<AdminModuleKey, string> = {
  home: "Trang chủ",
  about: "Giới thiệu",
  services: "Dịch vụ",
  projects: "Dự án",
  news: "Tin tức",
  recruitment: "Tuyển dụng",
  quotation: "Báo giá",
  contacts: "Liên hệ",
  settings: "Cấu hình",
};

const moduleContentHrefs: Partial<Record<AdminModuleKey, string>> = {
  home: "/admin/content",
  about: "/admin/content/about",
  services: "/admin/content/services",
  news: "/admin/content/news",
  recruitment: "/admin/content/recruitment",
  quotation: "/admin/content/quotation",
  contacts: "/admin/content/contact",
};

function resource(
  config: Omit<AdminResourceConfig, "key" | "moduleLabel" | "moduleHref">,
): AdminResourceConfig {
  const sections = config.sections
    .map((item) => ({
      ...item,
      fields: item.fields.filter(
        (field) => field.key !== "order" && field.key !== "ctaHref",
      ),
    }))
    .filter((item) => item.fields.length > 0);

  return {
    ...config,
    sections,
    orderField: undefined,
    key: `${config.module}/${config.path}`,
    moduleLabel: moduleLabels[config.module],
    moduleHref: moduleContentHrefs[config.module] ?? `/admin/${config.module}`,
  };
}

const orderField = number("order", "Thứ tự", { min: 1, required: true });

const homeResources: AdminResourceConfig[] = [
  resource({
    module: "home",
    path: "hero",
    title: "Ảnh mở đầu Trang chủ",
    singular: "Ảnh mở đầu",
    description: "Quản lý tiêu đề, nút bấm và hình ảnh mở đầu Trang chủ.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "desktopImage",
    orderField: "order",
    enabledField: "enabled",
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true, maxLength: 120 }),
        textarea("description", "Mô tả", { required: true, maxLength: 260 }),
        text("ctaLabel", "Chữ trên nút bấm", { required: true }),
        url("ctaHref", "Liên kết của nút bấm", { required: true, placeholder: "/gioi-thieu" }),
      ]),
      section("desktop", "Ảnh trên máy tính", [
        image("desktopImage", "Ảnh trên máy tính", {
          altKey: "desktopAlt",
          ratio: "16:9",
          recommendedSize: "1920 × 1080px",
          required: true,
        }),
      ]),
      section("mobile", "Ảnh trên điện thoại", [
        image("mobileImage", "Ảnh trên điện thoại", {
          altKey: "mobileAlt",
          ratio: "4:5",
          recommendedSize: "1080 × 1350px",
          required: true,
        }),
      ]),
      section("display", "Hiển thị", [orderField, boolean("enabled", "Hiển thị")]),
    ],
    initialRecords: mockHomeHeroSlides.map((slide) =>
      record(slide.id, { ...slide }),
    ),
  }),
  resource({
    module: "home",
    path: "featured-projects",
    title: "Dự án tiêu biểu trên Trang chủ",
    singular: "Dự án tiêu biểu",
    description: "Các dự án tiêu biểu hiển thị riêng trên Trang chủ.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "image",
    orderField: "order",
    sections: [
      section("content", "Nội dung dự án", [
        text("title", "Tiêu đề", { required: true }),
        text("categoryLabel", "Nhãn danh mục", { required: true }),
        text("area", "Diện tích"),
        text("styleText", "Phong cách"),
        number("year", "Năm", { min: 2000 }),
      ]),
      section("media", "Hình ảnh", [
        image("image", "Ảnh dự án", { altKey: "imageAlt", ratio: "16:9" }),
      ]),
      section("display", "Thứ tự", [orderField]),
    ],
    initialRecords: homeProjectCategories.flatMap((category) =>
      category.projects.slice(0, 2).map((project, index) =>
        record(`home-project-${project.id}`, {
          title: project.title,
          categoryLabel: category.label,
          area: project.area,
          styleText: project.style,
          year: project.year,
          image: project.image,
          imageAlt: project.title,
          order: index + 1,
        }),
      ),
    ),
  }),
  resource({
    module: "home",
    path: "featured-services",
    title: "Dịch vụ nổi bật trên Trang chủ",
    singular: "Dịch vụ nổi bật",
    description: "Các dịch vụ nổi bật hiển thị riêng trên Trang chủ.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "desktopImage",
    orderField: "order",
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        textarea("description", "Mô tả", { required: true }),
        text("ctaLabel", "Chữ trên nút bấm"),
        url("ctaHref", "Liên kết của nút bấm", { required: true }),
      ]),
      section("media", "Hình ảnh", [
        image("desktopImage", "Ảnh trên máy tính", { altKey: "desktopAlt", ratio: "16:9" }),
        image("mobileImage", "Ảnh trên điện thoại", { altKey: "mobileAlt", ratio: "4:5" }),
      ]),
      section("display", "Thứ tự", [orderField]),
    ],
    initialRecords: homeServiceDetails.map((service, index) =>
      record(`home-service-${index + 1}`, {
        title: homeMobileServiceLabels[index].join(" "),
        description: service.copy,
        desktopImage: service.desktopImage,
        desktopAlt: homeMobileServiceLabels[index].join(" "),
        mobileImage: service.image,
        mobileAlt: homeMobileServiceLabels[index].join(" "),
        ctaLabel: "Xem dịch vụ",
        ctaHref: [
          "/dich-vu/xay-dung-tron-goi",
          "/dich-vu/thiet-ke-kien-truc-noi-that",
          "/dich-vu/thi-cong-xay-dung",
          "/dich-vu/cai-tao-sua-chua",
        ][index],
        order: index + 1,
      }),
    ),
  }),
  resource({
    module: "home",
    path: "statistics",
    title: "Số liệu Trang chủ",
    singular: "Số liệu",
    description: "Quản lý các số liệu nổi bật hiển thị trên Trang chủ.",
    priority: "P2",
    kind: "collection",
    titleField: "label",
    previewField: "iconImage",
    orderField: "order",
    sections: [
      section("content", "Số liệu", [
        number("value", "Giá trị", { required: true }),
        text("label", "Nhãn", { required: true }),
        text("suffix", "Hậu tố", { placeholder: "+" }),
        image("iconImage", "Hình minh họa", { ratio: "1:1" }),
        orderField,
      ]),
    ],
    initialRecords: homeStats.map((item, index) =>
      record(`home-stat-${index + 1}`, {
        value: item.value,
        label: item.label,
        suffix: index < 2 ? "+" : "",
        iconImage: "/images/home/building-mark.png",
        order: index + 1,
      }),
    ),
  }),
  resource({
    module: "home",
    path: "why-bmt",
    title: "Vì sao chọn BMT",
    singular: "Lý do",
    description: "Quản lý nội dung và hình ảnh cho từng lý do.",
    priority: "P2",
    kind: "collection",
    titleField: "title",
    previewField: "defaultImage",
    orderField: "order",
    enabledField: "enabled",
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        textarea("description", "Mô tả", { required: true }),
      ]),
      section("media", "Hình ảnh", [
        image("iconImage", "Hình minh họa"),
        image("defaultImage", "Ảnh mặc định"),
        image("hoverImage", "Ảnh hover"),
      ]),
      section("display", "Hiển thị", [orderField, boolean("enabled", "Hiển thị")]),
    ],
    initialRecords: homeTrustReasons.map((item, index) =>
      record(`why-bmt-${index + 1}`, {
        title: item.title,
        description: item.copy,
        iconImage: item.icon,
        defaultImage: item.desktopImage,
        hoverImage: item.desktopHoverImage,
        order: index + 1,
        enabled: true,
      }),
    ),
  }),
  resource({
    module: "home",
    path: "featured-news",
    title: "Tin nổi bật trên Trang chủ",
    singular: "Tin nổi bật",
    description: "Danh sách tin nổi bật trên Trang chủ.",
    priority: "P2",
    kind: "collection",
    titleField: "title",
    previewField: "image",
    orderField: "order",
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        textarea("description", "Mô tả"),
        url("href", "Liên kết", { required: true }),
      ]),
      section("media", "Hình ảnh", [image("image", "Ảnh", { altKey: "imageAlt" })]),
      section("display", "Thứ tự", [orderField]),
    ],
    initialRecords: homeNews.map((item, index) =>
      record(`home-news-${index + 1}`, {
        title: item.title,
        description: item.copy,
        image: item.image,
        imageAlt: item.title,
        href: "/tin-tuc",
        order: index + 1,
      }),
    ),
  }),
  resource({
    module: "home",
    path: "partners",
    title: "Đối tác",
    singular: "Đối tác",
    description: "Quản lý tên, logo và liên kết đối tác trên Trang chủ.",
    priority: "P2",
    kind: "collection",
    titleField: "name",
    previewField: "logoImage",
    orderField: "order",
    sections: [
      section("content", "Thông tin đối tác", [
        text("name", "Tên đối tác", { required: true }),
        url("href", "Liên kết"),
        image("logoImage", "Logo", { altKey: "logoAlt", ratio: "5:4" }),
        orderField,
      ]),
    ],
    initialRecords: [
      ["GO!", "/images/home/partner-go.png"],
      ["LKC", "/images/home/partner-lck.png"],
      ["Zena Spa", "/images/home/partner-zena.png"],
      ["YumYum Thái", "/images/home/partner-yumyum.png"],
      ["Satra Mall", "/images/home/partner-satra.png"],
    ].map(([name, logoImage], index) =>
      record(`partner-${index + 1}`, {
        name,
        logoImage,
        logoAlt: name,
        href: "",
        order: index + 1,
      }),
    ),
  }),
];

const aboutResources: AdminResourceConfig[] = [
  resource({
    module: "about",
    path: "hero",
    title: "Mở đầu trang Giới thiệu",
    singular: "Phần mở đầu trang Giới thiệu",
    description: "Nội dung mở đầu trang Giới thiệu.",
    priority: "P1",
    kind: "singleton",
    titleField: "heading",
    previewField: "desktopImage",
    sections: [
      section("content", "Nội dung", [
        text("eyebrow", "Eyebrow", { required: true }),
        text("heading", "Tiêu đề chính", { required: true, maxLength: 90 }),
        textarea("description", "Mô tả", { required: true, maxLength: 420 }),
      ]),
      section("desktop", "Ảnh trên máy tính", [
        image("desktopImage", "Ảnh trên máy tính", { altKey: "desktopAlt", ratio: "16:9" }),
      ]),
      section("mobile", "Ảnh trên điện thoại", [
        image("mobileImage", "Ảnh trên điện thoại", { altKey: "mobileAlt", ratio: "4:5" }),
      ]),
    ],
    initialRecords: [
      record("about-hero", {
        eyebrow: "Về chúng tôi",
        heading: "Kiến tạo giá trị từ mỗi không gian",
        description:
          "BMT Decor là đơn vị thiết kế kiến trúc, thiết kế nội thất, thi công xây dựng và cải tạo trọn gói với hơn 15 năm kinh nghiệm.",
        desktopImage: "/images/about/source/hero-interior.png",
        desktopAlt: "Không gian nội thất phòng ăn hiện đại do BMT Decor thiết kế",
        mobileImage: "/images/about/source/hero-interior.png",
        mobileAlt: "Không gian nội thất BMT Decor trên thiết bị di động",
      }),
    ],
  }),
  resource({
    module: "about",
    path: "journey",
    title: "Hành trình BMT",
    singular: "Cột mốc",
    description: "Quản lý các cột mốc trong hành trình phát triển.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "image",
    orderField: "order",
    sections: [
      section("content", "Cột mốc", [
        text("year", "Năm", { required: true }),
        text("title", "Tiêu đề", { required: true }),
        textarea("description", "Mô tả", { required: true }),
      ]),
      section("media", "Hình ảnh", [image("image", "Ảnh", { altKey: "imageAlt" })]),
      section("display", "Thứ tự", [orderField]),
    ],
    initialRecords: aboutJourneyMilestones.map((item, index) =>
      record(`journey-${item.year}`, {
        ...item,
        imageAlt: `${item.title} năm ${item.year}`,
        order: index + 1,
      }),
    ),
  }),
  resource({
    module: "about",
    path: "core-values",
    title: "Giá trị cốt lõi",
    singular: "Giá trị cốt lõi",
    description: "Quản lý các giá trị cốt lõi của BMT Decor.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "image",
    orderField: "order",
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        textarea("description", "Mô tả", { required: true }),
        image("image", "Hình minh họa", { altKey: "imageAlt" }),
        orderField,
      ]),
    ],
    initialRecords: aboutCoreValues.map((item, index) =>
      record(`core-value-${index + 1}`, {
        ...item,
        imageAlt: item.title,
        order: index + 1,
      }),
    ),
  }),
  resource({
    module: "about",
    path: "vision-mission",
    title: "Tầm nhìn & Sứ mệnh",
    singular: "Tầm nhìn & Sứ mệnh",
    description: "Nội dung tầm nhìn và sứ mệnh của BMT Decor.",
    priority: "P2",
    kind: "singleton",
    titleField: "visionHeading",
    sections: [
      section("vision", "Tầm nhìn", [
        text("visionHeading", "Tiêu đề", { required: true }),
        textarea("visionDescription", "Mô tả", { required: true }),
        image("visionImage", "Hình ảnh"),
      ]),
      section("mission", "Sứ mệnh", [
        text("missionHeading", "Tiêu đề", { required: true }),
        textarea("missionDescription", "Mô tả", { required: true }),
        image("missionImage", "Hình ảnh"),
      ]),
    ],
    initialRecords: [
      record("vision-mission", {
        visionHeading: "Tầm nhìn",
        visionDescription:
          "Trở thành đơn vị thiết kế và thi công được khách hàng tin tưởng lựa chọn nhờ năng lực chuyên môn, quy trình chuyên nghiệp và chất lượng công trình.",
        visionImage: "/images/about/source/city-blueprint.png",
        missionHeading: "Sứ mệnh",
        missionDescription:
          "Mang đến những giải pháp thiết kế và thi công trọn gói chuyên nghiệp, hài hòa về thẩm mỹ và bền vững về chất lượng.",
        missionImage: "/images/about/source/city-blueprint.png",
      }),
    ],
  }),
  resource({
    module: "about",
    path: "capabilities",
    title: "Năng lực BMT",
    singular: "Năng lực",
    description: "Quản lý nội dung và hình ảnh minh họa cho từng năng lực.",
    priority: "P2",
    kind: "collection",
    titleField: "title",
    previewField: "defaultImage",
    orderField: "order",
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        textarea("description", "Mô tả", { required: true }),
      ]),
      section("media", "Hình ảnh", [
        image("defaultImage", "Ảnh mặc định"),
        image("hoverImage", "Ảnh hover"),
        image("iconImage", "Hình minh họa"),
      ]),
      section("display", "Thứ tự", [orderField]),
    ],
    initialRecords: [
      ["Tổng Thầu Trọn Gói", "Triển khai đồng bộ từ tư vấn, thiết kế đến thi công và hoàn thiện.", "capability-turnkey.png"],
      ["Kiểm Soát Chất Lượng", "Kiểm soát chặt chẽ hồ sơ, vật liệu, kỹ thuật thi công và nghiệm thu.", "capability-quality-symbol.png"],
      ["Triển Khai Đa Loại Hình", "Kinh nghiệm thực hiện nhà ở, văn phòng, showroom và công trình thương mại.", "capability-target-symbol.png"],
      ["Đồng Hành Dài Hạn", "Cam kết bảo hành, bảo trì và hỗ trợ kỹ thuật sau bàn giao.", "capability-growth-symbol.png"],
    ].map(([title, description, asset], index) =>
      record(`capability-${index + 1}`, {
        title,
        description,
        defaultImage: `/images/about/source/${asset}`,
        hoverImage: `/images/about/source/${asset}`,
        iconImage: `/images/about/source/${asset}`,
        order: index + 1,
      }),
    ),
  }),
];

const projectResources: AdminResourceConfig[] = [
  resource({
    module: "projects",
    path: "categories",
    title: "Danh mục dự án",
    singular: "Danh mục",
    description: "Các danh mục và hình minh họa trên trang Dự án.",
    priority: "P1",
    kind: "collection",
    titleField: "label",
    previewField: "icon",
    orderField: "order",
    sections: [
      section("content", "Danh mục", [text("label", "Nhãn", { required: true }), orderField]),
      section("desktop", "Hình trên máy tính", [image("icon", "Hình mặc định"), image("activeIcon", "Hình khi được chọn")]),
      section("mobile", "Hình trên điện thoại", [image("mobileIcon", "Hình mặc định"), image("mobileActiveIcon", "Hình khi được chọn")]),
    ],
    initialRecords: mockProjectContent.categories.map((item) =>
      record(item.id, { ...item }),
    ),
  }),
  resource({
    module: "projects",
    path: "list",
    title: "Danh sách dự án",
    singular: "Dự án",
    description: "Các dự án hiển thị trên trang Dự án.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "thumbnail",
    orderField: "order",
    enabledField: "enabled",
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        text("slug", "Đường dẫn", { required: true }),
        text("category", "Nhóm danh mục", { required: true }),
        url("href", "Liên kết", { required: true }),
      ]),
      section("media", "Hình ảnh", [image("thumbnail", "Ảnh đại diện", { altKey: "imageAlt", ratio: "4:3" })]),
      section("display", "Hiển thị", [orderField, boolean("enabled", "Hiển thị")]),
    ],
    initialRecords: mockProjectContent.cards.map((item) =>
      record(item.id, { ...item, enabled: item.status === "published" }),
    ),
  }),
  resource({
    module: "projects",
    path: "details",
    title: "Chi tiết dự án",
    singular: "Chi tiết dự án",
    description: "Nội dung chi tiết của từng dự án.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "heroImage",
    sections: [
      section("general", "Thông tin chung", [
        text("slug", "Đường dẫn", { required: true }),
        text("title", "Tiêu đề", { required: true }),
        text("category", "Danh mục"),
        text("location", "Địa điểm"),
        text("client", "Khách hàng"),
        text("area", "Diện tích"),
        text("scale", "Quy mô"),
        text("styleText", "Phong cách"),
        text("scope", "Phạm vi"),
        number("year", "Năm", { min: 2000 }),
      ]),
      section("images", "Hình ảnh", [
        image("heroImage", "Ảnh mở đầu", { altKey: "heroAlt", ratio: "1:1" }),
        image("surveyImage", "Khảo sát", { altKey: "surveyAlt" }),
        image("drawingImage", "Bản vẽ", { altKey: "drawingAlt" }),
        image("galleryImage", "Ảnh thư viện", { altKey: "galleryAlt" }),
        image("renderingImage", "Phối cảnh", { altKey: "renderingAlt" }),
        image("beforeImage", "Ảnh Before", { altKey: "beforeAlt" }),
        image("afterImage", "Ảnh After", { altKey: "afterAlt" }),
      ]),
      section("detail-content", "Nội dung chi tiết", [
        textarea("overview", "Tổng quan"),
        textarea("surveyText", "Nội dung khảo sát"),
        textarea("drawingCaption", "Chú thích bản vẽ"),
        textarea("solution", "Giải pháp"),
        textarea("processDescription", "Mô tả quy trình"),
      ]),
    ],
    initialRecords: mockProjectContent.details.map((item) =>
      record(item.id, {
        ...item,
        surveyImage: "/images/projects/detail/survey-facade.png",
        surveyAlt: "Hiện trạng mặt tiền trước cải tạo",
        drawingImage: "/images/projects/detail/facade-drawing.png",
        drawingAlt: "Bản vẽ mặt đứng công trình",
        galleryImage: "/images/projects/detail/render-living-wide.png",
        galleryAlt: "Không gian phòng khách",
        renderingImage: "/images/projects/detail/render-facade.png",
        renderingAlt: "Phối cảnh mặt tiền",
        beforeImage: "/images/projects/detail/before-facade-cropped-v2.png",
        beforeAlt: "Mặt tiền trước cải tạo",
        afterImage: "/images/projects/detail/after-facade.png",
        afterAlt: "Mặt tiền sau hoàn thiện",
      }),
    ),
  }),
  resource({
    module: "projects",
    path: "related",
    title: "Dự án liên quan",
    singular: "Dự án liên quan",
    description: "Các dự án được giới thiệu ở phần dự án liên quan.",
    priority: "P2",
    kind: "collection",
    titleField: "title",
    previewField: "image",
    orderField: "order",
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        url("href", "Liên kết", { required: true }),
        image("image", "Ảnh", { altKey: "imageAlt" }),
        orderField,
      ]),
    ],
    initialRecords: mockProjectContent.related.map((item) =>
      record(item.id, { ...item }),
    ),
  }),
];

function serviceCollection(
  path: string,
  title: string,
  singular: string,
  items: AdminCrudRecord[],
  fields: AdminFieldConfig[],
  previewField?: string,
  options: Partial<Pick<
    AdminResourceConfig,
    "listMode" | "itemLabel" | "companionResourceKey" | "description"
  >> = {},
): AdminResourceConfig {
  return resource({
    module: "services",
    path,
    title,
    singular,
    description: "",
    priority: "P1",
    kind: "collection",
    titleField: fields.find((field) => field.key === "title") ? "title" : fields[0].key,
    previewField,
    orderField: "order",
    enabledField: fields.some((field) => field.key === "enabled") ? "enabled" : undefined,
    sections: [section("content", "Nội dung và hình ảnh", [...fields, orderField])],
    initialRecords: items,
    ...options,
  });
}

const heroCardFields = [image("image", "Ảnh", { altKey: "alt", required: true })];
const processFields = [
  text("title", "Tiêu đề", { required: true }),
  textarea("description", "Mô tả", { required: true }),
  image("image", "Hình ảnh"),
];
// Dòng chữ đứng ngay trên danh sách gạch đầu dòng của mỗi thẻ giải pháp.
const SOLUTION_CHECKLIST_LABEL = "BMT Decor cung cấp:";
const solutionFields = [
  text("title", "Tiêu đề", { required: true }),
  text("tagline", "Dòng giới thiệu"),
  textarea("description", "Mô tả"),
  text("checklistLabel", "Dòng chữ phía trên danh sách", { required: true }),
  list("checklist", "Danh sách nội dung"),
  text("ctaLabel", "Chữ trên nút bấm"),
  url("ctaHref", "Liên kết của nút bấm"),
  image("image", "Hình ảnh", { altKey: "imageAlt" }),
];
const featuredProjectFields = [
  text("title", "Tiêu đề", { required: true }),
  text("tag", "Nhãn"),
  image("image", "Hình ảnh", { altKey: "imageAlt" }),
];

const serviceResources: AdminResourceConfig[] = [
  resource({
    module: "services",
    path: "overview/hero-content",
    title: "Nội dung phần mở đầu",
    singular: "Nội dung phần mở đầu",
    description: "Thay đổi nội dung ở cột trái của phần mở đầu trang Tổng quan Dịch vụ.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    previewField: "backgroundImage",
    sections: [
      section("text", "Nội dung chữ", [
        text("eyebrow", "Khối Hero · Nhãn Giải pháp", { required: true }),
        textarea("title", "Khối Hero · Tiêu đề chính", { required: true }),
        text("subtitle", "Khối Hero · Tiêu đề phụ", { required: true }),
        textarea("description", "Khối Hero · Nội dung mô tả", { required: true }),
      ]),
      section("images", "Hình ảnh trang trí", [
        lockedImage("introLogo", "Khối Hero · Logo màu cam (đầu đoạn text)"),
        lockedImage("lineLogo", "Khối Hero · Logo line đen"),
        image("backgroundImage", "Khối Hero · Ảnh nền Banner (Background)"),
      ]),
    ],
    initialRecords: [
      record("services-overview-hero-content", {
        eyebrow: "GIẢI PHÁP",
        title: "THIẾT KẾ THI CÔNG, XÂY DỰNG VÀ\nCẢI TẠO TRỌN GÓI",
        subtitle: "ĐÁP ỨNG ĐA DẠNG NHU CẦU CHO NHÀ Ở VÀ CÔNG TRÌNH THƯƠNG MẠI",
        description: "BMT Decor mang đến dịch vụ thiết kế thi công, xây dựng và cải tạo trọn gói từ ý tưởng đến hoàn thiện, tạo nên những công trình chất lượng và đáp ứng nhu cầu sử dụng.",
        introLogo: "/images/services/icon-house.png",
        lineLogo: "/images/services/rule-dark.png",
        backgroundImage: "/images/services/hero-background.webp",
      }),
    ],
  }),
  serviceCollection(
    "overview/hero-cards",
    "Phần mở đầu trang Tổng quan Dịch vụ",
    "Thẻ mở đầu",
    overviewHeroCards.map((item, index) => record(`service-hero-card-${index + 1}`, { ...item, order: index + 1 })),
    heroCardFields,
    "image",
    {
      listMode: "image-manager",
      itemLabel: "Ảnh thẻ",
      companionResourceKey: "services/overview/hero-content",
      description: "Chỉnh sửa toàn bộ chữ và hình ảnh xuất hiện trong phần mở đầu.",
    },
  ),
  resource({
    module: "services",
    path: "overview/process-intro",
    title: "Giới thiệu quy trình",
    singular: "Giới thiệu quy trình",
    description: "Tiêu đề và nội dung giới thiệu hiển thị phía trên quy trình làm việc.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    sections: [
      section("content", "Giới thiệu quy trình", [
        text("title", "Tiêu đề quy trình", { required: true }),
        textarea("description", "Nội dung giới thiệu", { required: true }),
        lockedImage("lineImage", "Đường kẻ màu cam"),
      ]),
    ],
    initialRecords: [
      record("overview-process-intro", {
        title: "QUY TRÌNH LÀM VIỆC",
        description:
          "BMT Decor triển khai dự án theo quy trình 6 bước rõ ràng, đảm bảo tiến độ,\nchất lượng và đồng hành cùng khách hàng trong từng giai đoạn.",
        lineImage: "/images/services/rule-orange.png",
      }),
    ],
  }),
  resource({
    module: "services",
    path: "overview/faq-intro",
    title: "Giới thiệu câu hỏi thường gặp",
    singular: "Giới thiệu câu hỏi thường gặp",
    description: "Tiêu đề, nội dung và hình ảnh hiển thị cùng phần câu hỏi thường gặp.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    previewField: "photo",
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề câu hỏi thường gặp", { required: true }),
        textarea("description", "Nội dung giới thiệu", { required: true }),
        image("photo", "Ảnh không gian bên trái"),
        lockedImage("lineImage", "Đường kẻ màu cam"),
      ]),
    ],
    initialRecords: [
      record("overview-faq-intro", {
        title: "CÁC CÂU HỎI THƯỜNG GẶP",
        description:
          "Giải đáp những thắc mắc phổ biến giúp khách hàng hiểu rõ\nhơn về quy trình và dịch vụ của BMT Decor",
        photo: "/images/services/faq-photo.webp",
        lineImage: "/images/services/rule-orange.png",
      }),
    ],
  }),
  serviceCollection(
    "overview/service-list",
    "Danh sách dịch vụ",
    "Dịch vụ",
    serviceTabs.map((item, index) =>
      record(`service-tab-${index + 1}`, {
        tabLabel: item.tabLabel,
        title: item.label,
        tagline: item.tagline,
        description: item.copy,
        image: item.image,
        imageAlt: item.label,
        order: index + 1,
      }),
    ),
    [
      text("tabLabel", "Tiêu đề trên thanh chuyển", { required: true }),
      text("title", "Tiêu đề nội dung", { required: true }),
      textarea("tagline", "Dòng giới thiệu"),
      textarea("description", "Mô tả"),
      image("image", "Hình ảnh", { altKey: "imageAlt" }),
    ],
    "image",
  ),
  serviceCollection(
    "overview/process",
    "Quy trình tổng quan dịch vụ",
    "Bước quy trình",
    overviewProcess.map((item, index) => record(`overview-process-${index + 1}`, { title: item.title, description: item.copy, image: item.image, imageOpen: item.imageOpen, order: index + 1 })),
    [...processFields, image("imageOpen", "Ảnh khi mở")],
    "image",
    { companionResourceKey: "services/overview/process-intro" },
  ),
  serviceCollection(
    "overview/faq",
    "Câu hỏi thường gặp về dịch vụ",
    "Câu hỏi",
    frequentlyAskedQuestions.map((item, index) => record(`faq-${index + 1}`, { ...item, enabled: true, order: index + 1 })),
    [text("question", "Câu hỏi", { required: true }), textarea("answer", "Câu trả lời", { required: true }), boolean("enabled", "Hiển thị")],
    undefined,
    { companionResourceKey: "services/overview/faq-intro" },
  ),
];

const serviceHeroPresets = {
  "xay-dung-tron-goi": {
    title: "DỊCH VỤ THIẾT KẾ THI CÔNG\n& XÂY DỰNG TRỌN GÓI",
    subtitle: "Kiến tạo công trình bền vững từ\nthiết kế đến thi công",
    images: [
      ["desktopArtwork", "Khối Hero · Cụm ảnh chính", "/images/xay-dung-tron-goi/hero-cluster.png"],
      ["mobileArtwork", "Khối Hero · Cụm ảnh trên điện thoại", turnkeyMobileHeroArtwork],
      ["accentLine", "Khối Hero · Thanh màu cam", "/images/xay-dung-tron-goi/hero-bar.png"],
      ["lineLogo", "Khối Hero · Logo line đen", "/images/services/rule-dark.png"],
      ["introLogo", "Khối Hero · Logo đầu đoạn text", "/images/services/icon-house.png"],
      ["dotsImage", "Khối Hero · Họa tiết chấm", "/images/xay-dung-tron-goi/hero-dots.png"],
      ["sideDecoration", "Khối Hero · Hình phác thảo cạnh phải", "/images/xay-dung-tron-goi/dong%20goi%20trang%20dich%20vu%20-%20xay%20dung%20tron%20goi%20web%20BMT%20decor-01.png"],
    ],
  },
  "thiet-ke-kien-truc-noi-that": {
    title: "DỊCH VỤ THIẾT KẾ KIẾN TRÚC &\nNỘI THẤT CHUYÊN NGHIỆP",
    subtitle: "Kiến tạo không gian hài hòa giữa\nthẩm mỹ và công năng",
    images: [
      ["backgroundImage", "Khối Hero · Ảnh nền Banner", "/images/thiet-ke-kien-truc-noi-that/background-banner.png"],
      ["wireframeImage", "Khối Hero · Hình phác thảo nền", "/images/thiet-ke-kien-truc-noi-that/hero-wireframe-original.png"],
      ["accentLine", "Khối Hero · Thanh màu cam", "/images/thiet-ke-kien-truc-noi-that/hero-accent-line.png"],
      ["lineLogo", "Khối Hero · Logo line đen", "/images/services/rule-dark.png"],
      ["introLogo", "Khối Hero · Logo đầu đoạn text", "/images/thiet-ke-kien-truc-noi-that/icon-building.png"],
      ["leftImage", "Khối Hero · Ảnh bên trái", "/images/thiet-ke-kien-truc-noi-that/left-corner.png"],
      ["centerImage", "Khối Hero · Ảnh ở giữa", "/images/thiet-ke-kien-truc-noi-that/between.png"],
      ["rightImage", "Khối Hero · Ảnh bên phải", "/images/thiet-ke-kien-truc-noi-that/right-corner.png"],
      ["mobileArtwork", "Khối Hero · Cụm ảnh trên điện thoại", designMobileHeroArtwork],
    ],
  },
  "thi-cong-xay-dung": {
    title: "DỊCH VỤ THI CÔNG\nXÂY DỰNG",
    subtitle: "Đồng Hành Kiến Tạo Công Trình\nBền Vững",
    images: [
      ["wireframeImage", "Khối Hero · Hình phác thảo nền", "/images/thi-cong-xay-dung/hero-wireframe.png"],
      ["topImage", "Khối Hero · Ảnh phía trên", "/images/thi-cong-xay-dung/hero-frame-top.webp"],
      ["rightImage", "Khối Hero · Ảnh bên phải", "/images/thi-cong-xay-dung/hero-frame-right.webp"],
      ["bottomImage", "Khối Hero · Ảnh phía dưới", "/images/thi-cong-xay-dung/hero-frame-bottom.webp"],
      ["leftImage", "Khối Hero · Ảnh bên trái", "/images/thi-cong-xay-dung/hero-frame-left.webp"],
      ["mobileBlueprint", "Khối Hero · Ảnh nền trên điện thoại", constructionMobileHeroBlueprint],
      ["accentLine", "Khối Hero · Thanh màu cam", "/images/thi-cong-xay-dung/accent-tick.png"],
      ["lineLogo", "Khối Hero · Logo line đen", "/images/services/rule-dark.png"],
      ["dotsImage", "Khối Hero · Họa tiết chấm", "/images/thi-cong-xay-dung/dots-pattern.png"],
    ],
  },
  "cai-tao-sua-chua": {
    title: "DỊCH VỤ CẢI TẠO &\nSỬA CHỮA TRỌN GÓI",
    subtitle: "Cải Tạo Không Gian – Nâng Tầm\nGiá Trị Công Trình",
    images: [
      ["backgroundImage", "Khối Hero · Ảnh nền Banner", "/images/cai-tao-sua-chua/hero-background.png"],
      ["wireframeImage", "Khối Hero · Hình phác thảo nền", "/images/cai-tao-sua-chua/hero-wireframe.png"],
      ["accentLine", "Khối Hero · Thanh màu cam", "/images/cai-tao-sua-chua/accent-tick.png"],
      ["lineLogo", "Khối Hero · Logo line đen", "/images/services/rule-dark.png"],
      ["dotsImage", "Khối Hero · Họa tiết chấm", "/images/cai-tao-sua-chua/dots-pattern.png"],
      ["largeImage", "Khối Hero · Ảnh lớn bên phải", "/images/cai-tao-sua-chua/hero-correct-large.png"],
      ["topImage", "Khối Hero · Ảnh nhỏ phía trên", "/images/cai-tao-sua-chua/hero-correct-top.png"],
      ["bottomImage", "Khối Hero · Ảnh nhỏ phía dưới", "/images/cai-tao-sua-chua/hero-correct-bottom.png"],
    ],
  },
} as const;

// Mở cho admin sửa các hình phác thảo khung công trình (`wireframeImage`,
// `sideDecoration`). Ảnh nền banner của mấy trang này là gradient trắng-xám
// trơn, phần còn lại là đồ trang trí: thanh cam, logo line, icon, hoạ tiết chấm.
const lockedServiceHeroImageKeys = new Set<string>([
  "backgroundImage",
  "accentLine",
  "lineLogo",
  "introLogo",
  "dotsImage",
]);

const serviceSectionIntroPresets = {
  "xay-dung-tron-goi": {
    featured: {
      title: "TỐI ƯU MÔ HÌNH THIẾT KẾ THI CÔNG TRỌN GÓI",
      description: "Dịch vụ thiết kế thi công và xây dựng trọn gói giúp chủ đầu tư triển khai công trình một cách đồng bộ, từ ý tưởng,\nthiết kế đến thi công hoàn thiện. Thay vì làm việc với nhiều đơn vị, khách hàng chỉ cần một đầu mối duy nhất để quản\nlý toàn bộ dự án, giúp tiết kiệm thời gian, kiểm soát ngân sách và hạn chế phát sinh trong quá trình xây dựng.",
      lineImage: "/images/xay-dung-tron-goi/rule-orange.png",
    },
    solutions: {
      title: "GIẢI PHÁP THIẾT KẾ THI CÔNG\nTHEO TỪNG LOẠI HÌNH CÔNG TRÌNH",
      description: "Giải pháp toàn diện, tối ưu công năng",
      lineImage: "/images/cai-tao-sua-chua/rule-orange-center.png",
    },
    process: {
      title: "QUY TRÌNH THIẾT KẾ THI CÔNG &\nXÂY NHÀ TRỌN GÓI",
      description: "Triển khai đồng bộ, kiểm soát chất lượng trong từng giai đoạn",
      lineImage: "/images/xay-dung-tron-goi/rule-orange.png",
    },
  },
  "thiet-ke-kien-truc-noi-that": {
    featured: {
      title: "GIẢI PHÁP THIẾT KẾ TỐI ƯU CHO MỌI KHÔNG GIAN",
      description: "BMT Decor cung cấp dịch vụ thiết kế kiến trúc, thiết kế nội thất và giải pháp thiết kế đồng bộ cho nhà ở, văn\nphòng, showroom, spa, nhà hàng và khách sạn. Mỗi phương án đều được nghiên cứu kỹ lưỡng nhằm tối ưu công\nnăng, ngân sách và giá trị sử dụng lâu dài.",
      lineImage: "/images/xay-dung-tron-goi/rule-orange.png",
    },
    solutions: {
      title: "THIẾT KẾ NỘI THẤT\nTHEO TỪNG LOẠI HÌNH CÔNG TRÌNH",
      description: "Giải pháp thiết kế tối ưu cho từng không gian",
      lineImage: "/images/cai-tao-sua-chua/rule-orange-center.png",
    },
    process: {
      // Trên site chỉ có chữ "QUY TRÌNH THIẾT KẾ TẠI", phần "BMT Decor" là ảnh logo.
      title: "QUY TRÌNH THIẾT KẾ TẠI",
      description: "",
      lineImage: "/images/thiet-ke-kien-truc-noi-that/rule-orange.png",
      brandLogo: "/images/thiet-ke-kien-truc-noi-that/process-brand-logo.png",
    },
  },
  "thi-cong-xay-dung": {
    featured: {
      title: "THI CÔNG XÂY DỰNG TỪ PHẦN THÔ ĐẾN HOÀN THIỆN",
      description: "Thi công xây dựng là giai đoạn quyết định chất lượng và tuổi thọ của công trình. BMT Decor triển khai xây dựng phần thô, thi công hoàn\nthiện và các hạng mục xây dựng theo đúng hồ sơ kỹ thuật, đảm bảo quy trình thi công đồng bộ, kiểm soát chặt chẽ chất lượng vật liệu,\ntiến độ và an toàn lao động. Mỗi công trình đều được giám sát xuyên suốt nhằm hạn chế phát sinh và đảm bảo chất lượng khi bàn giao.",
      lineImage: "/images/xay-dung-tron-goi/rule-orange.png",
    },
    solutions: {
      title: "THI CÔNG XÂY DỰNG\nTHEO TỪNG LOẠI HÌNH CÔNG TRÌNH",
      description: "Thi công đồng bộ, đảm bảo chất lượng và tiến độ",
      lineImage: "/images/cai-tao-sua-chua/rule-orange-center.png",
    },
    process: {
      title: "QUY TRÌNH THI CÔNG XÂY DỰNG",
      description: "Triển khai bài bản, giám sát chặt chẽ trong từng giai đoạn",
      lineImage: "/images/thi-cong-xay-dung/rule-orange-center.png",
    },
  },
  "cai-tao-sua-chua": {
    featured: {
      title: "GIẢI PHÁP CẢI TẠO PHÙ HỢP CHO MỌI CÔNG TRÌNH",
      description: "BMT Decor cung cấp dịch vụ cải tạo nhà ở, cải tạo văn phòng, cải tạo showroom, cải tạo nhà hàng, sửa chữa\nnhà và nâng cấp không gian theo nhu cầu thực tế, giúp khắc phục các hạng mục xuống cấp, tối ưu công năng và nâng\ncao giá trị sử dụng với chi phí hợp lý.",
      lineImage: "/images/xay-dung-tron-goi/rule-orange.png",
    },
    solutions: {
      title: "CẢI TẠO & SỬA CHỮA\nTHEO TỪNG LOẠI HÌNH CÔNG TRÌNH",
      description: "Giải pháp cải tạo tối ưu cho từng không gian",
      lineImage: "/images/cai-tao-sua-chua/rule-orange-center.png",
    },
    // Site không hiển thị tiêu đề quy trình của trang này (khối h2 đang bị
    // comment trong RenovationServicePage), nên admin cũng không có mục này.
    process: null,
  },
} as const;

function serviceSectionIntro(
  base: string,
  sectionPath: "featured-project" | "solutions" | "process",
  label: string,
  preset: {
    readonly title: string;
    readonly description: string;
    readonly lineImage: string;
    readonly brandLogo?: string;
  },
) {
  return resource({
    module: "services",
    path: `${base}/${sectionPath}-intro`,
    title: `Giới thiệu ${label}`,
    singular: `Giới thiệu ${label}`,
    description: `Tiêu đề và nội dung hiển thị cùng phần ${label.toLocaleLowerCase("vi")}.`,
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    previewField: "lineImage",
    sections: [
      section("content", `Giới thiệu ${label}`, [
        textarea("title", "Tiêu đề", { required: true }),
        ...(preset.description ? [textarea("description", "Nội dung giới thiệu", { required: true })] : []),
        ...(preset.brandLogo
          ? [image("brandLogo", "Logo BMT Decor nằm trong tiêu đề", { altKey: "brandLogoAlt" })]
          : []),
          lockedImage("lineImage", "Hình trang trí dưới tiêu đề"),
      ]),
    ],
    initialRecords: [
      record(`${base}-${sectionPath}-intro`, {
        ...preset,
        ...(preset.brandLogo ? { brandLogoAlt: "BMT Decor" } : {}),
      }),
    ],
  });
}

function addServicePageResources(
  base: string,
  label: string,
  projects: ReadonlyArray<{ id: string; title: string; tag: string; image: string }>,
  solutions: ReadonlyArray<{ titlePrefix: string; titleCategory: string; tagline: string; description: string; checklist: readonly string[]; cta: string; image: string }>,
  processes: ReadonlyArray<{ title: string; subtitle?: string; description?: string; copy?: string; icon?: string }>,
) {
  const heroPreset = serviceHeroPresets[base as keyof typeof serviceHeroPresets];
  const sectionPresets = serviceSectionIntroPresets[base as keyof typeof serviceSectionIntroPresets];
  serviceResources.push(
    resource({
      module: "services",
      path: `${base}/hero`,
      title: `Mở đầu trang ${label}`,
      singular: `Phần mở đầu trang ${label}`,
      description: `Nội dung mở đầu trang ${label}.`,
      priority: "P1",
      kind: "singleton",
      titleField: "title",
      previewField: heroPreset.images[0][0],
      sections: [
        section("content", "Nội dung phần mở đầu", [
          textarea("title", "Khối Hero · Tiêu đề chính", { required: true }),
          textarea("subtitle", "Khối Hero · Nội dung giới thiệu", { required: true }),
        ]),
        section(
          "media",
          "Hình ảnh phần mở đầu",
          heroPreset.images.map(([key, fieldLabel]) =>
            lockedServiceHeroImageKeys.has(key)
              ? lockedImage(key, fieldLabel)
              : image(key, fieldLabel),
          ),
        ),
      ],
      initialRecords: [
        record(`${base}-hero`, {
          title: heroPreset.title,
          subtitle: heroPreset.subtitle,
          ...Object.fromEntries(heroPreset.images.map(([key, , value]) => [key, value])),
        }),
      ],
    }),
    serviceSectionIntro(base, "featured-project", "dự án tiêu biểu", sectionPresets.featured),
    serviceSectionIntro(base, "solutions", "giải pháp", sectionPresets.solutions),
    ...(sectionPresets.process
      ? [serviceSectionIntro(base, "process", "quy trình", sectionPresets.process)]
      : []),
    serviceCollection(
      `${base}/featured-project`,
      `Dự án tiêu biểu ${label}`,
      "Dự án tiêu biểu",
      projects.map((item, index) => record(`${base}-project-${item.id}`, { title: item.title, tag: item.tag, image: item.image, imageAlt: item.title, order: index + 1 })),
      featuredProjectFields,
      "image",
      { companionResourceKey: `services/${base}/featured-project-intro` },
    ),
    serviceCollection(
      `${base}/solutions`,
      `Giải pháp ${label}`,
      "Giải pháp",
      // Site luôn ngắt tiêu đề thẻ giải pháp thành 2 dòng: tiền tố ở trên,
      // nhóm công trình ở dưới (SolutionCards có <br /> cứng giữa hai phần).
      solutions.map((item, index) => record(`${base}-solution-${index + 1}`, { title: `${item.titlePrefix.trim()}\n${item.titleCategory}`, tagline: item.tagline, description: item.description, checklistLabel: SOLUTION_CHECKLIST_LABEL, checklist: [...item.checklist], ctaLabel: item.cta, ctaHref: "/du-an", image: item.image, imageAlt: `${item.titlePrefix.trim()} ${item.titleCategory}`, order: index + 1 })),
      solutionFields,
      "image",
      { companionResourceKey: `services/${base}/solutions-intro` },
    ),
    serviceCollection(
      `${base}/process`,
      `Quy trình ${label}`,
      "Bước quy trình",
      // Trang Thi công và Cải tạo tách tiêu đề bước thành 2 dòng (title +
      // subtitle), site render mỗi phần một dòng nên admin cũng phải như vậy.
      processes.map((item, index) => record(`${base}-process-${index + 1}`, { title: item.subtitle ? `${item.title.trim()}\n${item.subtitle}` : item.title, description: item.description ?? item.copy ?? "", image: item.icon ?? "", order: index + 1 })),
      processFields,
      "image",
      sectionPresets.process
        ? { companionResourceKey: `services/${base}/process-intro` }
        : undefined,
    ),
  );
}

addServicePageResources("xay-dung-tron-goi", "Xây dựng trọn gói", turnkeyProjects, turnkeySolutions, turnkeyProcess.map((item) => ({ title: item.title, copy: item.copy, icon: item.icon })));
addServicePageResources("thiet-ke-kien-truc-noi-that", "Thiết kế Kiến trúc & Nội thất", designProjects, designSolutions, designProcess.map((item) => ({ title: item.title, copy: item.copy, icon: item.icon })));
addServicePageResources("thi-cong-xay-dung", "Thi công xây dựng", constructionProjects, constructionSolutions, constructionProcess);
addServicePageResources("cai-tao-sua-chua", "Cải tạo & sửa chữa", renovationProjects, renovationSolutions, renovationProcess);


const remainingResources: AdminResourceConfig[] = [
  resource({
    module: "projects",
    path: "page-hero",
    title: "Mở đầu trang Dự án",
    singular: "Phần mở đầu trang Dự án",
    description: "Tiêu đề, mô tả, nút bấm và hình ảnh mở đầu trang Dự án.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    previewField: "desktopImage",
    sections: [
      section("content", "Nội dung", [text("title", "Tiêu đề chính", { required: true }), textarea("description", "Mô tả"), text("ctaLabel", "Chữ trên nút bấm"), url("ctaHref", "Liên kết của nút bấm")]),
      section("media", "Hình ảnh", [image("desktopImage", "Ảnh trên máy tính", { altKey: "desktopAlt" }), image("mobileImage", "Ảnh trên điện thoại", { altKey: "mobileAlt" })]),
    ],
    initialRecords: [record("projects-page-hero", { title: "MỖI CÔNG TRÌNH, MỘT CAM KẾT CHẤT LƯỢNG", description: "Mỗi dự án là minh chứng cho năng lực thiết kế thi công và sự tận tâm của BMT Decor.", ctaLabel: "Liên hệ ngay", ctaHref: "/lien-he", desktopImage: "/images/projects/hero-composition.png", desktopAlt: "Các dự án tiêu biểu của BMT Decor", mobileImage: "/images/projects/mobile/hero-composition.png", mobileAlt: "Các dự án tiêu biểu của BMT Decor" })],
  }),
  resource({
    module: "news",
    path: "page-hero",
    title: "Mở đầu trang Tin tức",
    singular: "Phần mở đầu trang Tin tức",
    description: "Dòng giới thiệu, tiêu đề, mô tả, nút bấm và hình ảnh mở đầu trang Tin tức.",
    priority: "P2",
    kind: "singleton",
    titleField: "title",
    previewField: "desktopImage",
    sections: [
      section("content", "Nội dung", [text("eyebrow", "Dòng giới thiệu"), text("title", "Tiêu đề chính", { required: true }), textarea("description", "Mô tả"), text("ctaLabel", "Chữ trên nút bấm"), url("ctaHref", "Liên kết của nút bấm")]),
      section("media", "Hình ảnh", [image("desktopImage", "Ảnh trên máy tính", { altKey: "desktopAlt" }), image("mobileImage", "Ảnh trên điện thoại", { altKey: "mobileAlt" })]),
    ],
    initialRecords: [record("news-page-hero", { eyebrow: "KIẾN THỨC", title: "THIẾT KẾ & THI CÔNG", description: "Cập nhật những xu hướng thiết kế nội thất, kinh nghiệm thi công xây dựng, cải tạo nhà ở và giải pháp tối ưu không gian từ đội ngũ BMT Decor.", ctaLabel: "LIÊN HỆ NGAY", ctaHref: "/lien-he", desktopImage: "/images/news/hero-house.jpg", desktopAlt: "Mô hình kiến trúc ngôi nhà trên bản vẽ thiết kế", mobileImage: "/images/news/mobile/hero-photo.png", mobileAlt: "Mô hình kiến trúc ngôi nhà trên bản vẽ thiết kế" })],
  }),
  resource({
    module: "quotation",
    path: "hero",
    title: "Mở đầu trang Báo giá",
    singular: "Phần mở đầu trang Báo giá",
    description: "Nội dung giới thiệu và hình ảnh mở đầu trang Báo giá.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    previewField: "mainPhoto",
    sections: [
      section("content", "Nội dung phần mở đầu", [
        text("eyebrow", "Khối Hero · Dòng giới thiệu"),
        textarea("title", "Khối Hero · Tiêu đề chính", { required: true }),
        textarea("description", "Khối Hero · Nội dung mô tả"),
        text("ctaLabel", "Khối Hero · Chữ trên nút liên hệ"),
        url("ctaHref", "Khối Hero · Liên kết nút liên hệ"),
      ]),
      section("main-media", "Hình ảnh chính", [
        lockedImage("desktopBackground", "Khối Hero · Ảnh nền trên máy tính"),
        lockedImage("tabletBackground", "Khối Hero · Ảnh nền trên máy tính bảng"),
        image("mobileImage", "Khối Hero · Ảnh trên điện thoại", { altKey: "mobileAlt" }),
        image("mainPhoto", "Khối Hero · Ảnh kiến trúc sư", { altKey: "mainPhotoAlt" }),
        lockedImage("accentLine", "Khối Hero · Thanh màu cam"),
        lockedImage("introLogo", "Khối Hero · Logo đầu đoạn text"),
        lockedImage("buttonBackground", "Khối Hero · Ảnh nền nút liên hệ"),
      ]),
      section("decor", "Hình ảnh trang trí", [
        lockedImage("decor01", "Khối Hero · Hình trang trí 1"),
        lockedImage("decor02", "Khối Hero · Hình trang trí 2"),
        lockedImage("decor03", "Khối Hero · Hình trang trí 3"),
        lockedImage("decor04", "Khối Hero · Hình trang trí 4"),
        lockedImage("decor08", "Khối Hero · Hình trang trí 5"),
        lockedImage("decor09", "Khối Hero · Hình trang trí 6"),
        lockedImage("decor10", "Khối Hero · Hình trang trí 7"),
        lockedImage("decor11", "Khối Hero · Hình trang trí 8"),
        lockedImage("decor12", "Khối Hero · Hình trang trí 9"),
        lockedImage("decor13", "Khối Hero · Hình trang trí 10"),
      ]),
    ],
    initialRecords: [record("quotation-hero", {
      eyebrow: "BÁO GIÁ DỊCH VỤ BMT DECOR",
      title: "MINH BẠCH VÀ\nTỐI ƯU CHI PHÍ",
      description: "Tham khảo báo giá các dịch vụ thiết kế kiến trúc & nội thất, thiết kế thi công, xây nhà trọn gói, thi công nội & ngoại thất, cải tạo và sửa chữa nhà. Mỗi phương án được tư vấn và báo giá chi tiết theo nhu cầu thực tế, giúp khách hàng tối ưu ngân sách.",
      ctaLabel: "LIÊN HỆ NGAY",
      ctaHref: "/lien-he",
      desktopBackground: "/images/bao-gia/decor-06.jpg",
      tabletBackground: "/images/bao-gia/decor-14.jpg",
      mobileImage: quotationMobileHeroImage,
      mobileAlt: "Kiến trúc sư BMT Decor đang tính toán phương án thiết kế",
      mainPhoto: "/images/bao-gia/decor-07.jpg",
      mainPhotoAlt: "Kiến trúc sư BMT Decor đang tính toán phương án thiết kế",
      accentLine: "/images/bao-gia/decor-15.jpg",
      introLogo: "/images/bao-gia/dong goi trang bao gia web BMT decor-16.png",
      buttonBackground: "/images/bao-gia/decor-17.jpg",
      decor01: "/images/bao-gia/decor-01.jpg",
      decor02: "/images/bao-gia/decor-02.jpg",
      decor03: "/images/bao-gia/decor-03.jpg",
      decor04: "/images/bao-gia/decor-04.jpg",
      decor08: "/images/bao-gia/decor-08.jpg",
      decor09: "/images/bao-gia/decor-09.jpg",
      decor10: "/images/bao-gia/decor-10.jpg",
      decor11: "/images/bao-gia/decor-11.jpg",
      decor12: "/images/bao-gia/decor-12.jpg",
      decor13: "/images/bao-gia/decor-13.jpg",
    })],
  }),
  resource({
    module: "contacts",
    path: "hero",
    title: "Mở đầu trang Liên hệ",
    singular: "Phần mở đầu trang Liên hệ",
    description: "Nội dung, nút bấm và ảnh tư vấn viên trên trang Liên hệ.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    previewField: "photo",
    sections: [
      section("content", "Nội dung", [text("title", "Tiêu đề chính", { required: true }), textarea("description", "Mô tả"), text("ctaLabel", "Chữ trên nút bấm"), url("ctaHref", "Liên kết của nút bấm")]),
      section("media", "Hình ảnh", [image("photo", "Ảnh tư vấn viên", { altKey: "photoAlt" })]),
    ],
    initialRecords: [record("contact-hero", { title: "LIÊN HỆ NGAY BMT DECOR", description: "Hãy chia sẻ nhu cầu về thiết kế kiến trúc, nội thất, xây dựng, cải tạo hoặc sửa chữa để đội ngũ BMT Decor tư vấn giải pháp phù hợp.", ctaLabel: "LIÊN HỆ NGAY", ctaHref: "#contact-form", photo: "/images/contact/contact-consultant.jpg", photoAlt: "Tư vấn viên BMT Decor hỗ trợ khách hàng về thiết kế và thi công" })],
  }),
  resource({
    module: "contacts",
    path: "map",
    title: "Bản đồ liên hệ",
    singular: "Bản đồ liên hệ",
    description: "Địa chỉ và liên kết bản đồ của văn phòng.",
    priority: "P2",
    kind: "singleton",
    titleField: "title",
    sections: [section("map", "Bản đồ", [text("title", "Mô tả bản đồ"), url("googleMapsUrl", "Liên kết Google Maps", { required: true })])],
    initialRecords: [record("contact-map", { title: "Bản đồ văn phòng BMT Decor tại 7/92 Thành Thái, TP.HCM", googleMapsUrl: "https://www.google.com/maps?q=7%2F92%20Th%C3%A0nh%20Th%C3%A1i%2C%20Ph%C6%B0%E1%BB%9Dng%20Di%C3%AAn%20H%E1%BB%93ng%2C%20TP.HCM&output=embed" })],
  }),
  resource({
    module: "settings",
    path: "capability-profile",
    title: "Nội dung Hồ sơ năng lực",
    singular: "Trang Hồ sơ năng lực",
    description: "Nội dung mở đầu và tiêu đề tài liệu Hồ sơ năng lực.",
    priority: "P2",
    kind: "singleton",
    titleField: "title",
    previewField: "heroImage",
    sections: [
      section("hero-copy", "Nội dung phần mở đầu", [
        textarea("title", "Khối Hero · Tiêu đề chính", { required: true }),
        textarea("subtitle", "Khối Hero · Tiêu đề phụ"),
        textarea("description", "Khối Hero · Nội dung mô tả"),
      ]),
      section("hero-media", "Hình ảnh phần mở đầu", [
        image("heroImage", "Khối Hero · Ảnh Hồ sơ năng lực", { altKey: "heroAlt" }),
        lockedImage("lineLogo", "Khối Hero · Logo line đen"),
        image("decor08", "Khối Hero · Hình phác thảo công trình"),
        lockedImage("decor04", "Khối Hero · Hình trang trí 1"),
        lockedImage("decor05", "Khối Hero · Hình trang trí 2"),
        lockedImage("decor06", "Khối Hero · Hình trang trí 3"),
        lockedImage("decor07", "Khối Hero · Hình trang trí 4"),
        lockedImage("decor09", "Khối Hero · Hình trang trí 5"),
        lockedImage("decor11", "Khối Hero · Hình trang trí 6"),
      ]),
      section("document", "Phần tài liệu", [
        text("documentHeading", "Tiêu đề phần hồ sơ"),
        lockedImage("documentLine", "Logo line đen dưới tiêu đề"),
      ]),
    ],
    initialRecords: [record("capability-profile", {
      title: "HỒ SƠ NĂNG LỰC\nBMT DECOR",
      subtitle: "KHẲNG ĐỊNH NĂNG LỰC - ĐỒNG HÀNH KIẾN TẠO GIÁ TRỊ BỀN VỮNG",
      description: "Khám phá tổng quan về BMT Decor thông qua lĩnh vực hoạt động, đội ngũ chuyên môn, quy trình triển khai và các dự án tiêu biểu, phản ánh năng lực thiết kế, thi công và cải tạo công trình một cách chuyên nghiệp và đồng bộ.",
      heroImage: "/images/capability-profile/hero-profile.webp",
      heroAlt: "Bộ hồ sơ năng lực BMT Decor được trưng bày trên bàn gỗ",
      lineLogo: "/images/capability-profile/decor-14.webp",
      decor04: "/images/capability-profile/decor-04.webp",
      decor05: "/images/capability-profile/decor-05.webp",
      decor06: "/images/capability-profile/decor-06.webp",
      decor07: "/images/capability-profile/decor-07.webp",
      decor08: "/images/capability-profile/decor-08.webp",
      decor09: "/images/capability-profile/decor-09.webp",
      decor11: "/images/capability-profile/decor-11.webp",
      documentHeading: "HỒ SƠ DOANH NGHIỆP",
      documentLine: "/images/capability-profile/decor-14.webp",
    })],
  }),
  resource({
    module: "news",
    path: "featured",
    title: "Tin nổi bật",
    singular: "Tin nổi bật",
    description: "Danh sách tin nổi bật riêng của trang Tin tức.",
    priority: "P2",
    kind: "collection",
    titleField: "title",
    previewField: "image",
    orderField: "order",
    sections: [section("content", "Nội dung", [text("title", "Tiêu đề", { required: true }), textarea("description", "Mô tả"), image("image", "Ảnh", { altKey: "imageAlt" }), url("href", "Liên kết"), orderField])],
    initialRecords: featuredNews.map((item, index) => record(`featured-news-${index + 1}`, { ...item, image: `/images/news/featured-${(index % 4) + 1}.webp`, imageAlt: item.title, href: "/tin-tuc", order: index + 1 })),
  }),
  resource({
    module: "news",
    path: "list",
    title: "Danh sách Tin tức",
    singular: "Tin tức",
    description: "Danh sách các bài viết trên trang Tin tức.",
    priority: "P2",
    kind: "collection",
    titleField: "title",
    previewField: "image",
    orderField: "order",
    sections: [section("content", "Nội dung", [text("title", "Tiêu đề", { required: true }), textarea("excerpt", "Mô tả ngắn"), image("image", "Ảnh", { altKey: "imageAlt" }), url("href", "Liên kết"), orderField])],
    initialRecords: articles.map((title, index) => record(`news-${index + 1}`, { title, excerpt: "Nội dung tóm tắt bài viết BMT Decor.", image: articleMedia.desktopImage, imageAlt: articleMedia.imageAlt, href: "/tin-tuc", order: index + 1 })),
  }),
  resource({
    module: "recruitment",
    path: "hero",
    title: "Mở đầu trang Tuyển dụng",
    singular: "Phần mở đầu trang Tuyển dụng",
    description: "Nội dung mở đầu trang Tuyển dụng.",
    priority: "P2",
    kind: "singleton",
    titleField: "title",
    previewField: "desktopImage",
    sections: [
      section("content", "Nội dung", [text("title", "Tiêu đề", { required: true }), textarea("description", "Mô tả")]),
      section("desktop", "Ảnh trên máy tính", [image("desktopImage", "Ảnh trên máy tính", { altKey: "desktopAlt" })]),
      section("mobile", "Ảnh trên điện thoại", [image("mobileImage", "Ảnh trên điện thoại", { altKey: "mobileAlt" })]),
    ],
    initialRecords: [record("career-hero", { title: "Gia nhập đội ngũ BMT Decor", description: "Mỗi công trình chất lượng đều bắt đầu từ một đội ngũ tận tâm.", desktopImage: "/images/careers/hero.png", desktopAlt: "Cái bắt tay trên bản vẽ kiến trúc tại BMT Decor", mobileImage: "/images/careers/mobile/hero-artwork.png", mobileAlt: "Cái bắt tay trên bản vẽ kiến trúc tại BMT Decor trên thiết bị di động" })],
  }),
  resource({
    module: "recruitment",
    path: "jobs",
    title: "Vị trí tuyển dụng",
    singular: "Vị trí tuyển dụng",
    description: "Quản lý thông tin, trách nhiệm và quyền lợi của từng vị trí tuyển dụng.",
    priority: "P2",
    kind: "collection",
    titleField: "title",
    previewField: "image",
    sections: [
      section("general", "Thông tin vị trí", [text("title", "Tiêu đề", { required: true }), text("department", "Phòng ban"), text("location", "Địa điểm"), text("schedule", "Lịch làm việc"), text("compensation", "Thu nhập"), textarea("summary", "Mô tả ngắn")]),
      section("details", "Chi tiết công việc", [list("responsibilities", "Trách nhiệm"), list("benefits", "Quyền lợi"), image("image", "Ảnh", { altKey: "imageAlt" })]),
    ],
    initialRecords: careerJobs.map((job) => record(job.id, { ...job, imageAlt: job.title })),
  }),
  resource({
    module: "quotation",
    path: "estimator",
    title: "Nội dung công cụ ước tính",
    singular: "Nội dung công cụ ước tính",
    description: "Quản lý hướng dẫn và lựa chọn trong công cụ ước tính.",
    priority: "P1",
    kind: "singleton",
    titleField: "heading1",
    sections: [
      section("steps", "Thanh tiến trình", [list("stepLabels", "Tên các bước")]),
      section(`step-01`, `Bước 01 · ${quotationSteps[0]}`, [
        text("heading1", "Tiêu đề", { required: true }),
        textarea("instruction1", "Hướng dẫn"),
        list("buildingOptions", "Các loại hình"),
      ]),
      section(`step-02`, `Bước 02 · ${quotationSteps[1]}`, [
        text("heading2", "Tiêu đề", { required: true }),
        textarea("instruction2", "Hướng dẫn"),
        text("areaPlaceholder", "Chữ gợi ý trong ô nhập"),
        text("areaUnit", "Đơn vị hiển thị trong ô nhập"),
      ]),
      section(`step-03`, `Bước 03 · ${quotationSteps[2]}`, [
        text("heading3", "Tiêu đề", { required: true }),
        textarea("instruction3", "Hướng dẫn"),
        text("budgetPlaceholder", "Chữ gợi ý trong ô nhập"),
        text("budgetUnit", "Đơn vị hiển thị trong ô nhập"),
      ]),
      section(`step-04`, `Bước 04 · ${quotationSteps[3]}`, [
        text("heading4", "Tiêu đề", { required: true }),
        textarea("instruction4", "Hướng dẫn"),
        list("serviceOptions", "Các gói"),
      ]),
      // Bước 05 đang chạy trên dữ liệu giả, chưa nối API nên chỉ mở đúng dòng
      // chữ tĩnh trong câu kết quả.
      section(`step-05`, `Bước 05 · ${quotationSteps[4]}`, [
        text("resultIncludeLabel", "Chữ đứng trước tên gói ở dòng kết quả"),
      ]),
      section("nav", "Nút chuyển bước", [
        text("backLabel", "Chữ trên nút lùi lại", { required: true }),
        text("nextLabel", "Chữ trên nút đi tiếp", { required: true }),
      ]),
    ],
    initialRecords: [record("quotation-estimator", {
      stepLabels: [...quotationSteps],
      heading1: quotationStepCopy[0][0],
      instruction1: quotationStepCopy[0][1],
      buildingOptions: [...quotationBuildingTypes],
      heading2: quotationStepCopy[1][0],
      instruction2: quotationStepCopy[1][1],
      areaPlaceholder: quotationAreaInput.placeholder,
      areaUnit: quotationAreaInput.unit,
      heading3: quotationStepCopy[2][0],
      instruction3: quotationStepCopy[2][1],
      budgetPlaceholder: quotationBudgetInput.placeholder,
      budgetUnit: quotationBudgetInput.unit,
      heading4: quotationStepCopy[3][0],
      instruction4: quotationStepCopy[3][1],
      serviceOptions: [...quotationServiceTypes],
      resultIncludeLabel: quotationResultIncludeLabel,
      backLabel: quotationNavLabels.back,
      nextLabel: quotationNavLabels.next,
    })],
  }),
  resource({
    module: "contacts",
    path: "form",
    title: "Biểu mẫu liên hệ",
    singular: "Biểu mẫu liên hệ",
    description: "Quản lý nội dung và hình ảnh của biểu mẫu liên hệ.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    previewField: "backgroundImage",
    sections: [
      section("content", "Nội dung biểu mẫu", [text("title", "Tiêu đề", { required: true }), textarea("description", "Mô tả"), text("nameLabel", "Tên ô Họ tên"), text("namePlaceholder", "Chữ gợi ý ô Họ tên"), text("phoneLabel", "Tên ô Điện thoại"), text("phonePlaceholder", "Chữ gợi ý ô Điện thoại"), text("submitLabel", "Chữ trên nút gửi"), textarea("successMessage", "Thông báo thành công")]),
      section("media", "Hình ảnh", [image("backgroundImage", "Ảnh nền"), image("formImage", "Ảnh biểu mẫu", { altKey: "formImageAlt" })]),
    ],
    initialRecords: [record("contact-form", { title: "Liên hệ tư vấn", description: "Chia sẻ nhu cầu để đội ngũ BMT Decor tư vấn giải pháp phù hợp.", nameLabel: "Tên khách hàng", namePlaceholder: "Tên khách hàng...", phoneLabel: "Số điện thoại", phonePlaceholder: "Số điện thoại...", submitLabel: "Gửi ngay", successMessage: "Cảm ơn bạn đã gửi thông tin. BMT Decor sẽ liên hệ trong thời gian sớm nhất.", backgroundImage: "/images/contact/mobile/form-background.png", formImage: "/images/contact/contact-consultant.jpg", formImageAlt: "Tư vấn viên BMT Decor hỗ trợ khách hàng" })],
  }),
  resource({
    module: "settings",
    path: "company",
    title: "Thông tin doanh nghiệp",
    singular: "Thông tin doanh nghiệp",
    description: "Thông tin liên hệ cốt lõi của BMT Decor.",
    priority: "P1",
    kind: "singleton",
    titleField: "companyName",
    sections: [section("company", "Doanh nghiệp", [text("companyName", "Tên doanh nghiệp", { required: true }), text("hotline", "Hotline"), text("email", "Email"), text("taxCode", "MST"), text("workingHours", "Giờ làm việc")])],
    initialRecords: [record("company", { companyName: "CÔNG TY TNHH TMDV BMT DECOR", hotline: contactInformation.phone, email: contactInformation.email, taxCode: "0317552987", workingHours: "08:00 - 17:30, Thứ 2 - Thứ 7" })],
  }),
  resource({
    module: "settings",
    path: "branding",
    title: "Logo và biểu tượng website",
    singular: "Thông tin thương hiệu",
    description: "Thay logo và biểu tượng hiển thị trên thẻ trình duyệt.",
    priority: "P2",
    kind: "singleton",
    titleField: "label",
    previewField: "logo",
    sections: [section("assets", "Hình ảnh thương hiệu", [text("label", "Tên thương hiệu", { required: true }), image("logo", "Logo", { altKey: "logoAlt" }), image("favicon", "Biểu tượng thẻ trình duyệt", { ratio: "1:1" })])],
    initialRecords: [record("branding", { label: "BMT Decor", logo: "/images/home/logo-header.png", logoAlt: "BMT Decor", favicon: "/favicon.ico" })],
  }),
  resource({
    module: "settings",
    path: "locations",
    title: "Địa điểm",
    singular: "Địa điểm",
    description: "Quản lý văn phòng, chi nhánh và xưởng sản xuất.",
    priority: "P2",
    kind: "collection",
    titleField: "name",
    orderField: "order",
    enabledField: "enabled",
    sections: [section("location", "Thông tin địa điểm", [text("name", "Tên địa điểm", { required: true }), textarea("address", "Địa chỉ", { required: true }), url("googleMapsUrl", "Liên kết Google Maps"), orderField, boolean("enabled", "Hiển thị")])],
    initialRecords: [contactInformation.office, ...contactInformation.branches].map((address, index) => record(`location-${index + 1}`, { name: index === 0 ? "Văn phòng chính" : index < 3 ? `Chi nhánh ${index}` : "Xưởng sản xuất", address, googleMapsUrl: "https://maps.google.com", order: index + 1, enabled: true })),
  }),
  resource({
    module: "settings",
    path: "navigation",
    title: "Danh mục đầu trang",
    singular: "Mục trong danh mục",
    description: "Quản lý tên, liên kết và hình minh họa của danh mục đầu trang.",
    priority: "P2",
    kind: "collection",
    titleField: "label",
    previewField: "iconImage",
    orderField: "order",
    enabledField: "enabled",
    sections: [section("menu", "Mục trong danh mục", [text("label", "Tên hiển thị", { required: true }), url("href", "Liên kết", { required: true }), image("iconImage", "Hình minh họa"), orderField, boolean("enabled", "Hiển thị")])],
    initialRecords: navigation.map((item, index) => record(`navigation-${index + 1}`, { label: item.label, href: item.href, iconImage: "", order: index + 1, enabled: true })),
  }),
  resource({
    module: "settings",
    path: "footer",
    title: "Cuối trang và mạng xã hội",
    singular: "Nội dung cuối trang",
    description: "Thông tin liên hệ, chi nhánh, mạng xã hội và bản quyền.",
    priority: "P1",
    kind: "singleton",
    titleField: "copyright",
    sections: [section("footer", "Nội dung cuối trang", [text("contact", "Thông tin liên hệ"), list("branches", "Chi nhánh"), url("facebookUrl", "Liên kết Facebook"), url("tiktokUrl", "Liên kết TikTok"), url("instagramUrl", "Liên kết Instagram"), url("linkedinUrl", "Liên kết LinkedIn"), text("copyright", "Thông tin bản quyền", { required: true })])],
    initialRecords: [record("footer", { contact: `${contactInformation.phone} | ${contactInformation.email}`, branches: [...contactInformation.branches], facebookUrl: "https://facebook.com", tiktokUrl: "https://tiktok.com", instagramUrl: "https://instagram.com", linkedinUrl: "https://linkedin.com", copyright: "Copyright 2010 © CÔNG TY TNHH TMDV BMT DECOR | MST: 0317552987" })],
  }),
];

export const adminResourceRegistry: Record<string, AdminResourceConfig> =
  Object.fromEntries(
    [
      ...homeResources,
      ...aboutResources,
      ...projectResources,
      ...serviceResources,
      ...remainingResources,
    ].map((item) => [item.key, item]),
  );

export const adminResourceGroups: Record<string, AdminResourceGroupConfig> = {
  "services/overview": {
    key: "services/overview",
    title: "Tổng quan Dịch vụ",
    description: "Các nhóm nội dung trên trang tổng quan Dịch vụ.",
    items: [
      { title: "Thẻ mở đầu", description: "Hình ảnh và mô tả cho phần mở đầu.", priority: "P1", count: `${overviewHeroCards.length} mục`, href: "/admin/services/overview/hero-cards" },
      { title: "Danh sách dịch vụ", description: "Tên, dòng giới thiệu và hình ảnh của các dịch vụ.", priority: "P1", count: `${serviceTabs.length} mục`, href: "/admin/services/overview/service-list" },
      { title: "Quy trình", description: "Các bước quy trình và ảnh mở rộng.", priority: "P1", count: `${overviewProcess.length} bước`, href: "/admin/services/overview/process" },
      { title: "Câu hỏi thường gặp", description: "Câu hỏi, câu trả lời và trạng thái hiển thị.", priority: "P2", count: `${frequentlyAskedQuestions.length} câu`, href: "/admin/services/overview/faq" },
    ],
  },
  ...Object.fromEntries(
    [
      ["xay-dung-tron-goi", "Xây dựng trọn gói"],
      ["thiet-ke-kien-truc-noi-that", "Thiết kế Kiến trúc & Nội thất"],
      ["thi-cong-xay-dung", "Thi công xây dựng"],
      ["cai-tao-sua-chua", "Cải tạo & sửa chữa"],
    ].map(([slug, label]) => [
      `services/${slug}`,
      {
        key: `services/${slug}`,
        title: label,
        description: `Các nhóm nội dung riêng của dịch vụ ${label}.`,
        items: [
          { title: "Phần mở đầu", description: "Nội dung và hình ảnh trên máy tính, điện thoại.", priority: "P1", href: `/admin/services/${slug}/hero` },
          { title: "Dự án tiêu biểu", description: "Dữ liệu dự án tiêu biểu riêng của dịch vụ.", priority: "P1", href: `/admin/services/${slug}/featured-project` },
          { title: "Giải pháp", description: "Các giải pháp và danh sách nội dung đi kèm.", priority: "P1", href: `/admin/services/${slug}/solutions` },
          { title: "Quy trình", description: "Các bước quy trình của dịch vụ.", priority: "P1", href: `/admin/services/${slug}/process` },
        ],
      },
    ]),
  ),
};

export function getAdminResource(key: string) {
  return adminResourceRegistry[key];
}

export function getAdminResourceGroup(key: string) {
  return adminResourceGroups[key];
}
