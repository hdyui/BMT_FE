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
  articles,
  featuredNews,
} from "@/features/news/data/news-page";
import {
  quotationBuildingTypes,
  quotationRates,
  quotationServiceTypes,
  quotationStepCopy,
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
  processSteps as turnkeyProcess,
  solutionCards as turnkeySolutions,
} from "@/features/services/data/xay-dung-tron-goi";
import {
  featuredProjects as designProjects,
  heroCards as designHeroCards,
  processSteps as designProcess,
  solutionCards as designSolutions,
} from "@/features/services/data/thiet-ke-kien-truc-noi-that";
import {
  featuredProjects as constructionProjects,
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
  seo: "SEO",
  settings: "Cấu hình",
};

function resource(
  config: Omit<AdminResourceConfig, "key" | "moduleLabel" | "moduleHref">,
): AdminResourceConfig {
  return {
    ...config,
    key: `${config.module}/${config.path}`,
    moduleLabel: moduleLabels[config.module],
    moduleHref: `/admin/${config.module}`,
  };
}

const orderField = number("order", "Thứ tự", { min: 1, required: true });

const homeResources: AdminResourceConfig[] = [
  resource({
    module: "home",
    path: "hero",
    title: "Hero Slider",
    singular: "Hero Slide",
    description: "Quản lý nội dung, CTA và ảnh Desktop/Mobile của từng Hero Slide.",
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
        text("ctaLabel", "CTA Label", { required: true }),
        url("ctaHref", "CTA Link", { required: true, placeholder: "/gioi-thieu" }),
      ]),
      section("desktop", "Ảnh Desktop", [
        image("desktopImage", "Ảnh Desktop", {
          altKey: "desktopAlt",
          ratio: "16:9",
          recommendedSize: "1920 × 1080px",
          required: true,
        }),
      ]),
      section("mobile", "Ảnh Mobile", [
        image("mobileImage", "Ảnh Mobile", {
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
    title: "Dự án tiêu biểu Home",
    singular: "Dự án Home",
    description: "Data riêng của Homepage, không liên kết với Projects Page.",
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
    title: "Dịch vụ nổi bật Home",
    singular: "Dịch vụ Home",
    description: "Nội dung dịch vụ riêng của Homepage, không dùng chung Service Detail.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "desktopImage",
    orderField: "order",
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        textarea("description", "Mô tả", { required: true }),
        text("ctaLabel", "CTA Label"),
        url("ctaHref", "CTA Link", { required: true }),
      ]),
      section("media", "Hình ảnh", [
        image("desktopImage", "Ảnh Desktop", { altKey: "desktopAlt", ratio: "16:9" }),
        image("mobileImage", "Ảnh Mobile", { altKey: "mobileAlt", ratio: "4:5" }),
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
    description: "Quản lý giá trị số, nhãn và icon hiển thị trên Homepage.",
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
        image("iconImage", "Icon hình ảnh", { ratio: "1:1" }),
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
    description: "Quản lý nội dung và các asset đã được component hỗ trợ.",
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
        image("iconImage", "Icon"),
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
    title: "Tin nổi bật Home",
    singular: "Tin nổi bật",
    description: "Danh sách tin được trình bày riêng trên Homepage.",
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
    description: "Quản lý tên, logo và liên kết đối tác trên Homepage.",
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
    title: "About Hero",
    singular: "About Hero",
    description: "Nội dung singleton cho Hero trang Giới thiệu.",
    priority: "P1",
    kind: "singleton",
    titleField: "heading",
    previewField: "desktopImage",
    sections: [
      section("content", "Nội dung", [
        text("eyebrow", "Eyebrow", { required: true }),
        text("heading", "H1", { required: true, maxLength: 90 }),
        textarea("description", "Mô tả", { required: true, maxLength: 420 }),
      ]),
      section("desktop", "Ảnh Desktop", [
        image("desktopImage", "Ảnh Desktop", { altKey: "desktopAlt", ratio: "16:9" }),
      ]),
      section("mobile", "Ảnh Mobile", [
        image("mobileImage", "Ảnh Mobile", { altKey: "mobileAlt", ratio: "4:5" }),
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
    description: "Quản lý các cột mốc trong timeline phát triển.",
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
    description: "Hai khối nội dung singleton, layout vẫn được khóa trong component.",
    priority: "P2",
    kind: "singleton",
    titleField: "visionHeading",
    sections: [
      section("vision", "Tầm nhìn", [
        text("visionHeading", "Heading", { required: true }),
        textarea("visionDescription", "Mô tả", { required: true }),
        image("visionImage", "Hình ảnh"),
      ]),
      section("mission", "Sứ mệnh", [
        text("missionHeading", "Heading", { required: true }),
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
    description: "Quản lý nội dung và ba asset đã có; hover behavior vẫn khóa trong code.",
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
        image("iconImage", "Icon"),
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
    title: "Danh mục Projects Page",
    singular: "Danh mục",
    description: "Nhóm danh mục và icon riêng của Projects Page.",
    priority: "P1",
    kind: "collection",
    titleField: "label",
    previewField: "icon",
    orderField: "order",
    sections: [
      section("content", "Danh mục", [text("label", "Nhãn", { required: true }), orderField]),
      section("desktop", "Icon Desktop", [image("icon", "Icon"), image("activeIcon", "Icon Active")]),
      section("mobile", "Icon Mobile", [image("mobileIcon", "Icon Mobile"), image("mobileActiveIcon", "Icon Mobile Active")]),
    ],
    initialRecords: mockProjectContent.categories.map((item) =>
      record(item.id, { ...item }),
    ),
  }),
  resource({
    module: "projects",
    path: "list",
    title: "Projects Page Cards",
    singular: "Project Card",
    description: "Danh sách card riêng của Projects Page.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "thumbnail",
    orderField: "order",
    enabledField: "enabled",
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        text("slug", "Slug", { required: true }),
        text("category", "Nhóm danh mục", { required: true }),
        url("href", "Liên kết", { required: true }),
      ]),
      section("media", "Hình ảnh", [image("thumbnail", "Ảnh card", { altKey: "imageAlt", ratio: "4:3" })]),
      section("display", "Hiển thị", [orderField, boolean("enabled", "Hiển thị")]),
    ],
    initialRecords: mockProjectContent.cards.map((item) =>
      record(item.id, { ...item, enabled: item.status === "published" }),
    ),
  }),
  resource({
    module: "projects",
    path: "details",
    title: "Project Details",
    singular: "Project Detail",
    description: "Data chi tiết độc lập với Projects Page Cards.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "heroImage",
    sections: [
      section("general", "Thông tin chung", [
        text("slug", "Slug", { required: true }),
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
        image("heroImage", "Hero", { altKey: "heroAlt", ratio: "1:1" }),
        image("surveyImage", "Khảo sát", { altKey: "surveyAlt" }),
        image("drawingImage", "Bản vẽ", { altKey: "drawingAlt" }),
        image("galleryImage", "Gallery", { altKey: "galleryAlt" }),
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
    description: "Data riêng, không tự động liên kết Projects List hoặc Detail.",
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
): AdminResourceConfig {
  return resource({
    module: "services",
    path,
    title,
    singular,
    description: `Quản lý ${title.toLocaleLowerCase("vi")}; bố cục và hiệu ứng vẫn khóa trong source.`,
    priority: "P1",
    kind: "collection",
    titleField: fields.find((field) => field.key === "title") ? "title" : fields[0].key,
    previewField,
    orderField: "order",
    enabledField: fields.some((field) => field.key === "enabled") ? "enabled" : undefined,
    sections: [section("content", "Nội dung & hình ảnh", [...fields, orderField])],
    initialRecords: items,
  });
}

const heroCardFields = [image("image", "Ảnh", { altKey: "alt", required: true })];
const processFields = [
  text("title", "Tiêu đề", { required: true }),
  textarea("description", "Mô tả", { required: true }),
  image("image", "Ảnh/Icon"),
];
const solutionFields = [
  text("title", "Tiêu đề", { required: true }),
  text("tagline", "Tagline"),
  textarea("description", "Mô tả"),
  list("checklist", "Danh sách nội dung"),
  text("ctaLabel", "CTA Label"),
  url("ctaHref", "CTA Link"),
  image("image", "Hình ảnh", { altKey: "imageAlt" }),
];
const featuredProjectFields = [
  text("title", "Tiêu đề", { required: true }),
  text("tag", "Nhãn"),
  image("image", "Hình ảnh", { altKey: "imageAlt" }),
];

const serviceResources: AdminResourceConfig[] = [
  serviceCollection(
    "overview/hero-cards",
    "Hero Cards tổng quan dịch vụ",
    "Hero Card",
    overviewHeroCards.map((item, index) => record(`service-hero-card-${index + 1}`, { ...item, order: index + 1 })),
    heroCardFields,
    "image",
  ),
  serviceCollection(
    "overview/service-list",
    "Danh sách dịch vụ",
    "Dịch vụ",
    serviceTabs.map((item, index) =>
      record(`service-tab-${index + 1}`, {
        title: item.label,
        tagline: item.tagline,
        description: item.copy,
        image: item.image,
        imageAlt: item.label,
        order: index + 1,
      }),
    ),
    [text("title", "Tiêu đề", { required: true }), text("tagline", "Tagline"), textarea("description", "Mô tả"), image("image", "Hình ảnh", { altKey: "imageAlt" })],
    "image",
  ),
  serviceCollection(
    "overview/process",
    "Quy trình tổng quan dịch vụ",
    "Bước quy trình",
    overviewProcess.map((item, index) => record(`overview-process-${index + 1}`, { title: item.title, description: item.copy, image: item.image, order: index + 1 })),
    processFields,
    "image",
  ),
  serviceCollection(
    "overview/faq",
    "FAQ dịch vụ",
    "Câu hỏi",
    frequentlyAskedQuestions.map((item, index) => record(`faq-${index + 1}`, { ...item, enabled: true, order: index + 1 })),
    [text("question", "Câu hỏi", { required: true }), textarea("answer", "Câu trả lời", { required: true }), boolean("enabled", "Hiển thị")],
  ),
];

function addServicePageResources(
  base: string,
  label: string,
  projects: ReadonlyArray<{ id: string; title: string; tag: string; image: string }>,
  solutions: ReadonlyArray<{ titlePrefix: string; titleCategory: string; tagline: string; description: string; checklist: readonly string[]; cta: string; image: string }>,
  processes: ReadonlyArray<{ title: string; description?: string; copy?: string; icon?: string }>,
) {
  serviceResources.push(
    resource({
      module: "services",
      path: `${base}/hero`,
      title: `Hero ${label}`,
      singular: `Hero ${label}`,
      description: `Nội dung singleton cho Hero ${label}.`,
      priority: "P1",
      kind: "singleton",
      titleField: "title",
      previewField: "desktopImage",
      sections: [
        section("content", "Nội dung", [text("title", "Tiêu đề", { required: true }), textarea("description", "Mô tả")]),
        section("media", "Hình ảnh", [image("desktopImage", "Ảnh Desktop", { altKey: "desktopAlt" }), image("mobileImage", "Ảnh Mobile", { altKey: "mobileAlt" })]),
      ],
      initialRecords: [record(`${base}-hero`, { title: label, description: `Giải pháp ${label.toLocaleLowerCase("vi")} của BMT Decor.`, desktopImage: projects[0]?.image ?? "/images/services/hero-card-01.webp", desktopAlt: label, mobileImage: projects[0]?.image ?? "/images/services/hero-card-01.webp", mobileAlt: label })],
    }),
    serviceCollection(
      `${base}/featured-project`,
      `Dự án tiêu biểu ${label}`,
      "Dự án tiêu biểu",
      projects.map((item, index) => record(`${base}-project-${item.id}`, { title: item.title, tag: item.tag, image: item.image, imageAlt: item.title, order: index + 1 })),
      featuredProjectFields,
      "image",
    ),
    serviceCollection(
      `${base}/solutions`,
      `Giải pháp ${label}`,
      "Giải pháp",
      solutions.map((item, index) => record(`${base}-solution-${index + 1}`, { title: `${item.titlePrefix} ${item.titleCategory}`, tagline: item.tagline, description: item.description, checklist: [...item.checklist], ctaLabel: item.cta, ctaHref: "/du-an", image: item.image, imageAlt: `${item.titlePrefix} ${item.titleCategory}`, order: index + 1 })),
      solutionFields,
      "image",
    ),
    serviceCollection(
      `${base}/process`,
      `Quy trình ${label}`,
      "Bước quy trình",
      processes.map((item, index) => record(`${base}-process-${index + 1}`, { title: item.title, description: item.description ?? item.copy ?? "", image: item.icon ?? "", order: index + 1 })),
      processFields,
      "image",
    ),
  );
}

addServicePageResources("xay-dung-tron-goi", "Xây dựng trọn gói", turnkeyProjects, turnkeySolutions, turnkeyProcess.map((item) => ({ title: item.title, copy: item.copy, icon: item.icon })));
addServicePageResources("thiet-ke-kien-truc-noi-that", "Thiết kế Kiến trúc & Nội thất", designProjects, designSolutions, designProcess.map((item) => ({ title: item.title, copy: item.copy, icon: item.icon })));
addServicePageResources("thi-cong-xay-dung", "Thi công xây dựng", constructionProjects, constructionSolutions, constructionProcess);
addServicePageResources("cai-tao-sua-chua", "Cải tạo & sửa chữa", renovationProjects, renovationSolutions, renovationProcess);

serviceResources.push(
  serviceCollection(
    "thiet-ke-kien-truc-noi-that/gallery",
    "Gallery Thiết kế Kiến trúc & Nội thất",
    "Ảnh Gallery",
    designHeroCards.map((item, index) => record(`design-gallery-${index + 1}`, { title: item.alt, image: item.image, imageAlt: item.alt, order: index + 1 })),
    [text("title", "Tiêu đề", { required: true }), image("image", "Ảnh", { altKey: "imageAlt" })],
    "image",
  ),
  serviceCollection(
    "thi-cong-xay-dung/images",
    "Hình ảnh Thi công xây dựng",
    "Hình ảnh",
    constructionSolutions.map((item, index) =>
      record(`construction-image-${index + 1}`, {
        title: `${item.titlePrefix} ${item.titleCategory}`,
        image: item.image,
        imageAlt: `${item.titlePrefix} ${item.titleCategory}`,
        order: index + 1,
      }),
    ),
    [
      text("title", "Tiêu đề", { required: true }),
      image("image", "Hình ảnh", { altKey: "imageAlt" }),
    ],
    "image",
  ),
  serviceCollection(
    "cai-tao-sua-chua/images",
    "Hình ảnh Cải tạo & sửa chữa",
    "Hình ảnh",
    renovationSolutions.map((item, index) =>
      record(`renovation-image-${index + 1}`, {
        title: `${item.titlePrefix} ${item.titleCategory}`,
        image: item.image,
        imageAlt: `${item.titlePrefix} ${item.titleCategory}`,
        order: index + 1,
      }),
    ),
    [
      text("title", "Tiêu đề", { required: true }),
      image("image", "Hình ảnh", { altKey: "imageAlt" }),
    ],
    "image",
  ),
  resource({
    module: "services",
    path: "thi-cong-xay-dung/mobile-content",
    title: "Mobile Content Thi công xây dựng",
    singular: "Mobile Content",
    description: "Nội dung mobile singleton; responsive layout vẫn khóa trong source.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    previewField: "image",
    sections: [section("content", "Nội dung", [text("title", "Tiêu đề"), textarea("description", "Mô tả"), image("image", "Hình ảnh", { altKey: "imageAlt" })])],
    initialRecords: [record("construction-mobile", { title: "Thi công xây dựng", description: "Nội dung tối ưu cho trải nghiệm mobile.", image: constructionProjects[0].image, imageAlt: constructionProjects[0].title })],
  }),
  resource({
    module: "services",
    path: "cai-tao-sua-chua/mobile-content",
    title: "Mobile Content Cải tạo & sửa chữa",
    singular: "Mobile Content",
    description: "Nội dung mobile singleton; responsive layout vẫn khóa trong source.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    previewField: "image",
    sections: [section("content", "Nội dung", [text("title", "Tiêu đề"), textarea("description", "Mô tả"), image("image", "Hình ảnh", { altKey: "imageAlt" })])],
    initialRecords: [record("renovation-mobile", { title: "Cải tạo & sửa chữa", description: "Nội dung tối ưu cho trải nghiệm mobile.", image: renovationProjects[0].image, imageAlt: renovationProjects[0].title })],
  }),
);

const remainingResources: AdminResourceConfig[] = [
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
    description: "Danh sách bài viết đơn giản, không có rich-text builder.",
    priority: "P2",
    kind: "collection",
    titleField: "title",
    previewField: "image",
    orderField: "order",
    sections: [section("content", "Nội dung", [text("title", "Tiêu đề", { required: true }), textarea("excerpt", "Mô tả ngắn"), image("image", "Ảnh", { altKey: "imageAlt" }), url("href", "Liên kết"), orderField])],
    initialRecords: articles.slice(0, 8).map((title, index) => record(`news-${index + 1}`, { title, excerpt: "Nội dung tóm tắt bài viết BMT Decor.", image: `/images/home/news-0${(index % 3) + 1}.png`, imageAlt: title, href: "/tin-tuc", order: index + 1 })),
  }),
  resource({
    module: "recruitment",
    path: "hero",
    title: "Career Hero",
    singular: "Career Hero",
    description: "Nội dung singleton của Hero tuyển dụng.",
    priority: "P2",
    kind: "singleton",
    titleField: "title",
    previewField: "heroImage",
    sections: [section("content", "Nội dung", [text("title", "Tiêu đề", { required: true }), textarea("description", "Mô tả"), image("heroImage", "Ảnh Hero", { altKey: "heroAlt" }), list("heroImages", "Các ảnh Hero bổ sung")])],
    initialRecords: [record("career-hero", { title: "Gia nhập đội ngũ BMT Decor", description: "Mỗi công trình chất lượng đều bắt đầu từ một đội ngũ tận tâm.", heroImage: "/images/careers/hero.png", heroAlt: "Cái bắt tay trên bản vẽ kiến trúc tại BMT Decor", heroImages: ["/images/careers/hero.png"] })],
  }),
  resource({
    module: "recruitment",
    path: "jobs",
    title: "Vị trí tuyển dụng",
    singular: "Vị trí tuyển dụng",
    description: "Quản lý dữ liệu Job Card; responsibilities và benefits là danh sách.",
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
    path: "pricing-rules",
    title: "Pricing Rules",
    singular: "Pricing Rule",
    description: "Quản lý mức giá local; không thay đổi logic tính giá.",
    priority: "P1",
    kind: "collection",
    titleField: "service",
    sections: [section("pricing", "Mức giá", [text("service", "Dịch vụ", { required: true }), number("lowRate", "Mức thấp", { required: true }), number("highRate", "Mức cao", { required: true })])],
    initialRecords: Object.entries(quotationRates).map(([service, rates], index) => record(`pricing-${index + 1}`, { service, lowRate: rates[0], highRate: rates[1] })),
  }),
  resource({
    module: "quotation",
    path: "estimator",
    title: "Estimator Content",
    singular: "Estimator Content",
    description: "Nội dung singleton cho các bước; logic tính toán vẫn khóa trong code.",
    priority: "P1",
    kind: "singleton",
    titleField: "heading",
    sections: [section("content", "Nội dung công cụ", [list("stepLabels", "Nhãn các bước"), text("heading", "Heading"), textarea("instruction", "Hướng dẫn"), text("placeholder", "Placeholder"), list("serviceOptions", "Tùy chọn dịch vụ"), list("buildingOptions", "Tùy chọn công trình")])],
    initialRecords: [record("quotation-estimator", { stepLabels: [...quotationSteps], heading: quotationStepCopy[0][0], instruction: quotationStepCopy[0][1], placeholder: "Chọn loại hình", serviceOptions: [...quotationServiceTypes], buildingOptions: [...quotationBuildingTypes] })],
  }),
  resource({
    module: "contacts",
    path: "form",
    title: "Contact Form",
    singular: "Contact Form",
    description: "Chỉ chỉnh các field mà public form hiện có; không thêm Contact Lead.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    previewField: "backgroundImage",
    sections: [
      section("content", "Nội dung form", [text("title", "Tiêu đề", { required: true }), textarea("description", "Mô tả"), text("nameLabel", "Nhãn Họ tên"), text("namePlaceholder", "Placeholder Họ tên"), text("phoneLabel", "Nhãn Điện thoại"), text("phonePlaceholder", "Placeholder Điện thoại"), text("submitLabel", "Nhãn nút gửi"), textarea("successMessage", "Thông báo thành công")]),
      section("media", "Hình ảnh", [image("backgroundImage", "Ảnh nền"), image("formImage", "Ảnh biểu mẫu", { altKey: "formImageAlt" })]),
    ],
    initialRecords: [record("contact-form", { title: "Liên hệ tư vấn", description: "Chia sẻ nhu cầu để đội ngũ BMT Decor tư vấn giải pháp phù hợp.", nameLabel: "Tên khách hàng", namePlaceholder: "Tên khách hàng...", phoneLabel: "Số điện thoại", phonePlaceholder: "Số điện thoại...", submitLabel: "Gửi ngay", successMessage: "Cảm ơn bạn đã gửi thông tin. BMT Decor sẽ liên hệ trong thời gian sớm nhất.", backgroundImage: "/images/contact/mobile/form-background.png", formImage: "/images/contact/contact-consultant.jpg", formImageAlt: "Tư vấn viên BMT Decor hỗ trợ khách hàng" })],
  }),
  resource({
    module: "seo",
    path: "global",
    title: "Global SEO",
    singular: "Global SEO",
    description: "Metadata nội dung toàn website.",
    priority: "P2",
    kind: "singleton",
    titleField: "siteName",
    previewField: "ogImage",
    sections: [section("seo", "Metadata", [text("siteName", "Site name", { required: true }), text("title", "Title", { required: true, maxLength: 60 }), textarea("description", "Description", { required: true, maxLength: 160 }), image("ogImage", "OG Image", { altKey: "ogImageAlt", ratio: "1.91:1", recommendedSize: "1200 × 630px" })])],
    initialRecords: [record("global-seo", { siteName: "BMT Decor", title: "BMT Decor | Thiết kế và thi công trọn gói", description: "BMT Decor cung cấp dịch vụ thiết kế nội thất, thi công xây dựng và cải tạo trọn gói tại TP.HCM.", ogImage: "/images/home/hero-background-01.webp", ogImageAlt: "BMT Decor" })],
  }),
  resource({
    module: "seo",
    path: "pages",
    title: "Page SEO",
    singular: "Page SEO",
    description: "Metadata riêng theo từng public page.",
    priority: "P2",
    kind: "collection",
    titleField: "pageLabel",
    previewField: "ogImage",
    sections: [section("seo", "Metadata trang", [text("pageLabel", "Tên trang", { required: true }), text("metaTitle", "Meta title", { maxLength: 60 }), textarea("metaDescription", "Meta description", { maxLength: 160 }), image("ogImage", "OG Image", { altKey: "ogImageAlt" }), text("slug", "Slug")])],
    initialRecords: [
      ["Trang chủ", "/"], ["Giới thiệu", "/gioi-thieu"], ["Dịch vụ", "/dich-vu"], ["Dự án", "/du-an"], ["Tin tức", "/tin-tuc"], ["Tuyển dụng", "/tuyen-dung"], ["Liên hệ", "/lien-he"],
    ].map(([pageLabel, slug], index) => record(`page-seo-${index + 1}`, { pageLabel, metaTitle: `${pageLabel} | BMT Decor`, metaDescription: `Thông tin ${pageLabel.toLocaleLowerCase("vi")} tại BMT Decor.`, ogImage: "/images/home/hero-background-01.webp", ogImageAlt: pageLabel, slug })),
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
    title: "Logo & Favicon",
    singular: "Branding",
    description: "Thay representation của logo và favicon asset.",
    priority: "P2",
    kind: "singleton",
    titleField: "label",
    previewField: "logo",
    sections: [section("assets", "Tài sản thương hiệu", [text("label", "Nhãn", { required: true }), image("logo", "Logo", { altKey: "logoAlt" }), image("favicon", "Favicon", { ratio: "1:1" })])],
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
    sections: [section("location", "Thông tin địa điểm", [text("name", "Tên địa điểm", { required: true }), textarea("address", "Địa chỉ", { required: true }), url("googleMapsUrl", "Google Maps URL"), orderField, boolean("enabled", "Hiển thị")])],
    initialRecords: [contactInformation.office, ...contactInformation.branches].map((address, index) => record(`location-${index + 1}`, { name: index === 0 ? "Văn phòng chính" : index < 3 ? `Chi nhánh ${index}` : "Xưởng sản xuất", address, googleMapsUrl: "https://maps.google.com", order: index + 1, enabled: true })),
  }),
  resource({
    module: "settings",
    path: "navigation",
    title: "Header Navigation",
    singular: "Menu item",
    description: "Quản lý label, link và icon; layout menu vẫn khóa trong source.",
    priority: "P2",
    kind: "collection",
    titleField: "label",
    previewField: "iconImage",
    orderField: "order",
    enabledField: "enabled",
    sections: [section("menu", "Menu item", [text("label", "Nhãn", { required: true }), url("href", "Liên kết", { required: true }), image("iconImage", "Icon hình ảnh"), orderField, boolean("enabled", "Hiển thị")])],
    initialRecords: navigation.map((item, index) => record(`navigation-${index + 1}`, { label: item.label, href: item.href, iconImage: "", order: index + 1, enabled: true })),
  }),
  resource({
    module: "settings",
    path: "footer",
    title: "Footer & Social",
    singular: "Footer",
    description: "Thông tin liên hệ, chi nhánh, social URL và copyright.",
    priority: "P1",
    kind: "singleton",
    titleField: "copyright",
    sections: [section("footer", "Nội dung Footer", [text("contact", "Thông tin liên hệ"), list("branches", "Chi nhánh"), url("facebookUrl", "Facebook URL"), url("tiktokUrl", "TikTok URL"), url("instagramUrl", "Instagram URL"), url("linkedinUrl", "LinkedIn URL"), text("copyright", "Copyright", { required: true })])],
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
    description: "Các resource đúng với cấu trúc trang tổng quan dịch vụ.",
    items: [
      { title: "Thẻ Hero", description: "Ảnh và alt text cho cụm Hero.", priority: "P1", count: `${overviewHeroCards.length} mục`, href: "/admin/services/overview/hero-cards" },
      { title: "Danh sách dịch vụ", description: "Danh sách dịch vụ, tagline và hình ảnh.", priority: "P1", count: `${serviceTabs.length} mục`, href: "/admin/services/overview/service-list" },
      { title: "Quy trình", description: "Các bước quy trình và ảnh mở rộng.", priority: "P1", count: `${overviewProcess.length} bước`, href: "/admin/services/overview/process" },
      { title: "FAQ", description: "Câu hỏi, câu trả lời và trạng thái hiển thị.", priority: "P2", count: `${frequentlyAskedQuestions.length} câu`, href: "/admin/services/overview/faq" },
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
        description: `Các resource nội dung riêng của dịch vụ ${label}.`,
        items: [
          { title: "Hero", description: "Nội dung và ảnh Desktop/Mobile.", priority: "P1", href: `/admin/services/${slug}/hero` },
          { title: "Dự án tiêu biểu", description: "Dữ liệu dự án tiêu biểu riêng của dịch vụ.", priority: "P1", href: `/admin/services/${slug}/featured-project` },
          { title: "Giải pháp", description: "Các giải pháp và nội dung checklist.", priority: "P1", href: `/admin/services/${slug}/solutions` },
          { title: "Quy trình", description: "Các bước quy trình của dịch vụ.", priority: "P1", href: `/admin/services/${slug}/process` },
          ...(slug === "thiet-ke-kien-truc-noi-that" ? [{ title: "Thư viện ảnh", description: "Thư viện ảnh thiết kế.", priority: "P1" as const, href: `/admin/services/${slug}/gallery` }] : []),
          ...(["thi-cong-xay-dung", "cai-tao-sua-chua"].includes(slug) ? [{ title: "Nội dung Mobile", description: "Nội dung riêng cho phiên bản mobile.", priority: "P1" as const, href: `/admin/services/${slug}/mobile-content` }] : []),
          ...(["thi-cong-xay-dung", "cai-tao-sua-chua"].includes(slug) ? [{ title: "Hình ảnh", description: "Danh sách hình ảnh riêng của dịch vụ.", priority: "P1" as const, href: `/admin/services/${slug}/images` }] : []),
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
