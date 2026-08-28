import { contactInformation, navigation, services } from "@/config/site";
import {
  aboutCapabilities,
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
import { articles, featuredNews } from "@/features/news/data/news-page";
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
  contactFormContent as overviewContactForm,
  frequentlyAskedQuestions,
  heroCards as overviewHeroCards,
  processSteps as overviewProcess,
  serviceTabs,
} from "@/features/services/data/overview";
import {
  contactFormContent as turnkeyContactForm,
  featuredProjectCtaLabel as turnkeyFeaturedCta,
  featuredProjects as turnkeyProjects,
  mobileHeroArtwork as turnkeyMobileHeroArtwork,
  processSteps as turnkeyProcess,
  solutionCards as turnkeySolutions,
} from "@/features/services/data/xay-dung-tron-goi";
import {
  contactFormContent as designContactForm,
  featuredProjectCtaLabel as designFeaturedCta,
  featuredProjects as designProjects,
  mobileHeroArtwork as designMobileHeroArtwork,
  processSteps as designProcess,
  solutionCards as designSolutions,
} from "@/features/services/data/thiet-ke-kien-truc-noi-that";
import {
  contactFormContent as constructionContactForm,
  featuredProjectCtaLabel as constructionFeaturedCta,
  featuredProjects as constructionProjects,
  mobileHeroBlueprint as constructionMobileHeroBlueprint,
  processSteps as constructionProcess,
  solutionCards as constructionSolutions,
} from "@/features/services/data/thi-cong-xay-dung";
import {
  contactFormContent as renovationContactForm,
  featuredProjectCtaLabel as renovationFeaturedCta,
  processHeading as renovationProcessHeading,
  processLogo as renovationProcessLogo,
  featuredProjects as renovationProjects,
  processSteps as renovationProcess,
  solutionCards as renovationSolutions,
} from "@/features/services/data/cai-tao-sua-chua";
import { contactFormContent as quotationContactForm } from "@/features/quotation/data/quotation-contact-form";
import { contactFormContent as capabilityProfileContactForm } from "@/features/capability-profile/data/contact-form";
import { mockHomeHeroSlides } from "@/lib/admin/mock-data/home";
import { mockProjectContent } from "@/lib/admin/mock-data/projects";
import { projects as publicProjectDetails } from "@/features/projects/data/project-details";
import { projectCategories } from "@/features/projects/data/projects-page";
import { siteLinkOptions } from "@/lib/admin/site-links";
import type { ContactFormContent } from "@/lib/components/shared/contact-form-content";
import type {
  AdminCrudRecord,
  AdminEditorRecordLayout,
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

/** Liên kết ra ngoài website (mạng xã hội, Google Maps) — phải tự nhập. */
const url = (
  key: string,
  label: string,
  options: Partial<AdminFieldConfig> = {},
): AdminFieldConfig => ({ key, label, type: "url", ...options });

/**
 * Liên kết tới một trang của chính website. Cho chọn từ danh sách địa chỉ có
 * thật (`lib/admin/site-links.ts`) thay vì gõ tay, để admin không thể lưu một
 * đường dẫn sai rồi dẫn người xem vào trang 404.
 */
const siteLink = (
  key: string,
  label: string,
  options: Partial<AdminFieldConfig> = {},
): AdminFieldConfig => ({
  key,
  label,
  type: "select",
  options: siteLinkOptions,
  placeholder: "Chọn trang trên website",
  ...options,
});

const image = (
  key: string,
  label: string,
  options: Partial<AdminFieldConfig> = {},
): AdminFieldConfig => ({ key, label, type: "image", ...options });

const lockedImage = (key: string, label: string): AdminFieldConfig =>
  image(key, label, { editable: false });

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

function stripSimpleHtml(value: string) {
  return value
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}

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
      fields: item.fields.filter((field) => field.key !== "order"),
    }))
    .filter((item) => item.fields.length > 0);

  return {
    ...config,
    sections,
    collectionMode:
      config.kind === "collection"
        ? config.collectionMode ?? "fixed"
        : undefined,
    key: `${config.module}/${config.path}`,
    moduleLabel: moduleLabels[config.module],
    moduleHref: moduleContentHrefs[config.module] ?? `/admin/${config.module}`,
  };
}

const orderField = number("order", "Thứ tự", { min: 1, required: true });

const defaultScopedContactForm = {
  title: "LIÊN HỆ TƯ VẤN",
  description: "Chia sẻ nhu cầu để đội ngũ BMT Decor tư vấn giải pháp phù hợp.",
  nameLabel: "Tên khách hàng",
  namePlaceholder: "Tên khách hàng...",
  phoneLabel: "Số điện thoại",
  phonePlaceholder: "Số điện thoại...",
  submitLabel: "Gửi ngay",
  requiredMessage: "Vui lòng nhập thông tin.",
  successMessage: "Cảm ơn bạn đã gửi thông tin. BMT Decor sẽ liên hệ với bạn trong thời gian sớm nhất.",
  backgroundImage: "/images/contact/mobile/form-background.png",
  formImage: "/images/contact/contact-consultant.jpg",
  formImageAlt: "Tư vấn viên BMT Decor hỗ trợ khách hàng",
} as const;

function scopedContactFormResource(
  module: AdminModuleKey,
  path: string,
  pageLabel: string,
): AdminResourceConfig {
  return resource({
    module,
    path,
    title: "Biểu mẫu liên hệ",
    singular: `Biểu mẫu liên hệ trang ${pageLabel}`,
    description: `Biểu mẫu liên hệ riêng của trang ${pageLabel}. Chỉ chỉnh tiêu đề, placeholder, nút gửi và thông báo thành công; label, nội dung cố định và hình ảnh không cho thay đổi.`,
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    sections: [
      section("content", "Nội dung được phép chỉnh", [
        text("title", "Tiêu đề", { required: true, span: 12 }),
        text("namePlaceholder", "Placeholder ô Họ tên", { span: 6 }),
        text("phonePlaceholder", "Placeholder ô Điện thoại", { span: 6 }),
        text("submitLabel", "Chữ trên nút gửi", { span: 4 }),
        textarea("successMessage", "Thông báo thành công", { span: 8 }),
      ]),
    ],
    initialRecords: [
      record(`${module}-${path.replace(/\//g, "-")}`, {
        ...defaultScopedContactForm,
      }),
    ],
  });
}

const homeResources: AdminResourceConfig[] = [
  resource({
    module: "home",
    path: "hero",
    title: "Mở đầu Trang chủ",
    singular: "Ảnh mở đầu",
    description: "Quản lý toàn bộ nội dung mở đầu Trang chủ gồm tiêu đề, mô tả, nút bấm, liên kết và hình ảnh hiển thị trên máy tính và điện thoại.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "desktopImage",
    orderField: "order",
    // Hero Trang chủ là chữ phủ trên ảnh lớn. Trong admin gom toàn bộ ảnh sang
    // một cột bên phải để phần copy ở trái, tránh chuỗi field kéo dài xuống dưới.
    editorLayout: { mediaSide: "right", mediaWidth: "half", mediaPreview: "wide" },
    sections: [
      section("content", "Nội dung", [
        textarea("title", "Tiêu đề", { required: true, maxLength: 120 }),
        textarea("description", "Mô tả", { required: true, maxLength: 260 }),
        text("ctaLabel", "Chữ trên nút bấm", { required: true }),
        siteLink("ctaHref", "Liên kết của nút bấm", { required: true }),
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
      section("display", "Thứ tự cố định", [orderField]),
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
    description: "Quản lý trọn section Dự án tiêu biểu gồm tiêu đề, mô tả giới thiệu và các dự án, hình ảnh, liên kết được hiển thị trên Trang chủ.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "image",
    orderField: "order",
    companionResourceKey: "home/projects-section-content",
    // Public site trình bày các dự án thành các card song song.
    editorLayout: { recordsPerRow: 2 },
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
    description: "Quản lý trọn section Dịch vụ nổi bật gồm tiêu đề, mô tả giới thiệu và nội dung, hình ảnh, liên kết của từng dịch vụ trên Trang chủ.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "desktopImage",
    orderField: "order",
    companionResourceKey: "home/services-section-content",
    // Giữ ảnh cùng một phía ở mọi dịch vụ để admin quét nội dung nhanh hơn.
    editorLayout: { mediaSide: "left", mediaWidth: "half", mediaPreview: "large" },
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        textarea("description", "Mô tả", { required: true }),
        text("ctaLabel", "Chữ trên nút bấm"),
        siteLink("ctaHref", "Liên kết của nút bấm", { required: true }),
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
    description: "Quản lý section Số liệu gồm giá trị, nhãn và hậu tố của các con số nổi bật được hiển thị trên Trang chủ.",
    priority: "P2",
    kind: "collection",
    titleField: "label",
    orderField: "order",
    editorLayout: { recordsPerRow: 3 },
    sections: [
      section("content", "Số liệu", [
        number("value", "Giá trị", { required: true }),
        text("label", "Nhãn", { required: true }),
        text("suffix", "Hậu tố", { placeholder: "+" }),
        orderField,
      ]),
    ],
    initialRecords: homeStats.map((item, index) =>
      record(`home-stat-${index + 1}`, {
        value: item.value,
        label: item.label,
        suffix: index < 2 ? "+" : "",
        order: index + 1,
      }),
    ),
  }),
  resource({
    module: "home",
    path: "why-bmt",
    title: "Vì sao chọn BMT",
    singular: "Lý do",
    description: "Quản lý nội dung và ảnh chính của từng lý do khách hàng lựa chọn BMT Decor. Hình minh họa là tài sản cố định; trạng thái hover dùng cùng ảnh mặc định.",
    priority: "P2",
    kind: "collection",
    titleField: "title",
    previewField: "defaultImage",
    orderField: "order",
    companionResourceKey: "home/trust-section-content",
    editorLayout: { recordsPerRow: 2 },
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        textarea("description", "Mô tả", { required: true }),
      ]),
      section("media", "Hình ảnh", [
        image("defaultImage", "Ảnh trên máy tính (dùng cho mặc định và hover)"),
        image("mobileImage", "Ảnh trên điện thoại"),
      ]),
      section("display", "Thứ tự cố định", [orderField]),
    ],
    initialRecords: homeTrustReasons.map((item, index) =>
      record(`why-bmt-${index + 1}`, {
        title: item.title,
        description: item.copy,
        iconImage: item.icon,
        defaultImage: item.desktopImage,
        hoverImage: item.desktopImage,
        mobileImage: item.image,
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
    description: "Quản lý trọn section Tin nổi bật gồm tiêu đề section, nội dung tin chính, nút xem tất cả và danh sách các tin, hình ảnh, liên kết hiển thị trên Trang chủ.",
    priority: "P2",
    kind: "collection",
    titleField: "title",
    previewField: "image",
    orderField: "order",
    companionResourceKey: "home/news-section-content",
    editorLayout: { mediaSide: "left", mediaWidth: "third", mediaPreview: "large" },
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        textarea("description", "Mô tả"),
        siteLink("href", "Liên kết", { required: true }),
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
    module: "settings",
    path: "partners",
    title: "Đối tác dùng chung",
    singular: "Đối tác",
    description: "Quản lý 6 đối tác dùng chung tại Trang chủ và Giới thiệu.",
    priority: "P2",
    kind: "collection",
    titleField: "name",
    previewField: "logoImage",
    orderField: "order",
    companionResourceKey: "settings/partners-section-content",
    // Hai thẻ trên một hàng để logo và các ô nhập không bị bó hẹp. Trước đây 3
    // thẻ/hàng làm phần logo + liên kết co quá nhỏ và dòng trạng thái bị tràn.
    editorLayout: { recordsPerRow: 2 },
    sections: [
      section("content", "Thông tin đối tác", [
        text("name", "Tên đối tác", { required: true }),
        siteLink("href", "Liên kết"),
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
      ["Cafe Control", "/images/home/partner-cafe-control.png"],
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
  resource({
    module: "home",
    path: "trust-section-content",
    title: "Giới thiệu section Vì sao chọn BMT",
    singular: "Giới thiệu Vì sao chọn BMT",
    description: "Tiêu đề và mô tả hiển thị phía trên các lý do khách hàng lựa chọn BMT Decor.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    sections: [section("content", "Nội dung section", [text("title", "Tiêu đề"), textarea("descriptionDesktop", "Mô tả trên máy tính"), textarea("descriptionMobile", "Mô tả trên điện thoại")])],
    initialRecords: [record("home-trust-section-content", {
      title: "Vì sao chọn BMT Decor",
      descriptionDesktop: "BMT Decor đồng hành cùng khách hàng bằng kinh nghiệm, quy trình rõ ràng và cam kết chất lượng trong từng công trình.",
      descriptionMobile: "Kinh nghiệm, quy trình rõ ràng và chất lượng trong từng công trình.",
    })],
  }),
  resource({
    module: "home",
    path: "projects-section-content",
    title: "Giới thiệu section Dự án tiêu biểu",
    singular: "Giới thiệu Dự án tiêu biểu",
    description: "Tiêu đề và mô tả hiển thị cùng danh sách dự án tiêu biểu trên Trang chủ.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    sections: [section("content", "Nội dung section", [text("title", "Tiêu đề"), textarea("description", "Mô tả")])],
    initialRecords: [record("home-projects-section-content", {
      title: "Dự án tiêu biểu",
      description: "Khám phá những công trình do BMT Decor trực tiếp thiết kế và thi công, khẳng định năng lực và chất lượng trong từng hạng mục.",
    })],
  }),
  resource({
    module: "home",
    path: "services-section-content",
    title: "Giới thiệu section Dịch vụ nổi bật",
    singular: "Giới thiệu Dịch vụ nổi bật",
    description: "Tiêu đề và mô tả hiển thị cùng các dịch vụ nổi bật trên Trang chủ.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    sections: [section("content", "Nội dung section", [text("title", "Tiêu đề"), textarea("description", "Mô tả")])],
    initialRecords: [record("home-services-section-content", {
      title: "Dịch vụ nổi bật",
      description: "Giải pháp thiết kế, thi công, xây dựng và cải tạo đồng bộ cho từng nhu cầu.",
    })],
  }),
  resource({
    module: "settings",
    path: "partners-section-content",
    title: "Tiêu đề section Đối tác dùng chung",
    singular: "Giới thiệu Đối tác",
    description: "Tiêu đề hiển thị phía trên danh sách logo đối tác dùng chung ở Trang chủ và Giới thiệu.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    sections: [section("content", "Nội dung section", [text("title", "Tiêu đề")])],
    initialRecords: [record("home-partners-section-content", { title: "Đối tác của BMT Decor" })],
  }),
  resource({
    module: "home",
    path: "profile-section-content",
    title: "Hồ sơ năng lực trên Trang chủ",
    singular: "Section Hồ sơ năng lực",
    description: "Quản lý tiêu đề, mô tả và nút bấm của section Hồ sơ năng lực. Hình ảnh được cố định theo thiết kế website.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    previewField: "image",
    editorLayout: {
      splitColumns: {
        left: ["title", "subtitle", "ctaLabel"],
        right: ["description", "ctaHref"],
      },
    },
    sections: [section("content", "Nội dung section", [textarea("title", "Tiêu đề"), text("subtitle", "Tiêu đề phụ"), textarea("description", "Mô tả"), text("ctaLabel", "Chữ trên nút bấm"), siteLink("ctaHref", "Liên kết của nút bấm")])],
    initialRecords: [record("home-profile-section-content", {
      title: "HỒ SƠ NĂNG LỰC BMT DECOR",
      subtitle: "Khẳng định năng lực",
      description: "Khám phá năng lực, quy trình và các dự án tiêu biểu của BMT Decor.",
      ctaLabel: "Xem hồ sơ năng lực",
      ctaHref: "/ho-so-nang-luc",
      image: "/images/home/portfolio-set.png",
      imageAlt: "Hồ sơ năng lực BMT Decor",
    })],
  }),
  resource({
    module: "home",
    path: "news-section-content",
    title: "Giới thiệu section Tin nổi bật",
    singular: "Giới thiệu Tin nổi bật",
    description: "Tiêu đề section, nội dung tin chính và nút xem toàn bộ tin tức trên Trang chủ.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    previewField: "featuredImage",
    sections: [section("content", "Nội dung section", [text("title", "Tiêu đề section"), text("featuredTitle", "Tiêu đề tin chính"), textarea("featuredExcerpt", "Mô tả tin chính"), image("featuredImage", "Ảnh tin chính", { altKey: "featuredImageAlt" }), siteLink("featuredHref", "Liên kết tin chính"), text("ctaLabel", "Chữ xem tất cả"), siteLink("ctaHref", "Liên kết xem tất cả")])],
    initialRecords: [record("home-news-section-content", {
      title: "Tin nổi bật",
      featuredTitle: "Bí quyết kiến tạo không gian sống hiện đại và bền vững",
      featuredExcerpt: "Cập nhật xu hướng thiết kế, kinh nghiệm thi công và các giải pháp hữu ích từ đội ngũ BMT Decor.",
      featuredImage: "/images/home/news-featured.png",
      featuredImageAlt: "Không gian nội thất do BMT Decor thực hiện",
      featuredHref: "/tin-tuc",
      ctaLabel: "XEM TẤT CẢ TIN",
      ctaHref: "/tin-tuc",
    })],
  }),
  scopedContactFormResource("home", "contact-form", "Trang chủ"),
];

const aboutResources: AdminResourceConfig[] = [
  resource({
    module: "about",
    path: "hero",
    title: "Mở đầu trang Giới thiệu",
    singular: "Phần mở đầu trang Giới thiệu",
    description: "Quản lý phần mở đầu trang Giới thiệu theo bố cục nội dung bên trái và hình ảnh bên phải.",
    priority: "P1",
    kind: "singleton",
    titleField: "heading",
    previewField: "desktopImage",
    editorLayout: {
      splitColumns: {
        left: ["eyebrow", "heading", "description"],
        right: ["desktopImage", "mobileImage"],
      },
    },
    sections: [
      section("layout", "Bố cục phần mở đầu", [
        text("eyebrow", "Eyebrow", { required: true }),
        textarea("heading", "Tiêu đề chính", { required: true, maxLength: 90 }),
        textarea("description", "Mô tả", { required: true, maxLength: 420 }),
        image("desktopImage", "Ảnh trên máy tính", { altKey: "desktopAlt", ratio: "16:9" }),
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
    description: "Quản lý các cột mốc Hành trình gồm năm, tiêu đề và mô tả. Hình minh họa được cố định theo giao diện website.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "image",
    orderField: "order",
    companionResourceKey: "about/journey-section-content",
    editorLayout: { recordsPerRow: 2 },
    sections: [
      section("content", "Cột mốc", [
        text("year", "Năm", { required: true }),
        text("title", "Tiêu đề", { required: true }),
        textarea("description", "Mô tả", { required: true }),
      ]),
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
    description: "Quản lý trọn section Giá trị cốt lõi gồm tiêu đề section và nội dung, mô tả, hình minh họa của từng giá trị.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "image",
    orderField: "order",
    companionResourceKey: "about/core-values-section-content",
    editorLayout: { recordsPerRow: 2 },
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
    description: "Quản lý nội dung Tầm nhìn & Sứ mệnh. Hình nền và hình trang trí được cố định theo giao diện website.",
    priority: "P2",
    kind: "singleton",
    titleField: "visionHeading",
    editorLayout: {
      splitColumns: {
        left: ["visionHeading", "visionDescription"],
        right: ["missionHeading", "missionDescription"],
      },
    },
    // Hai nhóm phải nằm trong cùng một section để `splitColumns` chia chúng
    // trên cùng một hàng. Tách thành hai section khiến Tầm nhìn chỉ nằm cột trái
    // ở hàng đầu, còn Sứ mệnh chỉ nằm cột phải ở hàng kế tiếp nên giao diện lệch.
    sections: [
      section("content", "Tầm nhìn & Sứ mệnh", [
        text("visionHeading", "Tiêu đề Tầm nhìn", { required: true }),
        textarea("visionDescription", "Mô tả Tầm nhìn", { required: true }),
        text("missionHeading", "Tiêu đề Sứ mệnh", { required: true }),
        textarea("missionDescription", "Mô tả Sứ mệnh", { required: true }),
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
    description: "Quản lý nội dung Năng lực nổi bật gồm số thứ tự, tiêu đề và mô tả. Hình ảnh được cố định theo giao diện website.",
    priority: "P2",
    kind: "collection",
    titleField: "title",
    previewField: "defaultImage",
    orderField: "order",
    companionResourceKey: "about/capabilities-section-content",
    editorLayout: { recordsPerRow: 2 },
    sections: [
      section("content", "Nội dung", [
        text("number", "Số thứ tự", { required: true }),
        text("title", "Tiêu đề", { required: true }),
        text("mobileTitle", "Tiêu đề trên điện thoại"),
        textarea("description", "Mô tả", { required: true }),
      ]),
      section("display", "Thứ tự", [orderField]),
    ],
    initialRecords: aboutCapabilities.map((item, index) =>
      record(`capability-${index + 1}`, {
        number: item.number,
        title: item.title,
        mobileTitle: item.mobileTitle ?? item.title,
        description: item.description,
        normalImage: item.normalImage,
        hoverImage: item.hoverImage,
        order: index + 1,
      }),
    ),
  }),
  resource({
    module: "about",
    path: "journey-section-content",
    title: "Giới thiệu section Hành trình",
    singular: "Giới thiệu Hành trình",
    description: "Tiêu đề hiển thị cùng các cột mốc phát triển của BMT Decor.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    sections: [section("content", "Nội dung section", [text("title", "Tiêu đề")])],
    initialRecords: [record("about-journey-section-content", { title: "Hành trình của BMT Decor" })],
  }),
  resource({
    module: "about",
    path: "core-values-section-content",
    title: "Giới thiệu section Giá trị cốt lõi",
    singular: "Giới thiệu Giá trị cốt lõi",
    description: "Tiêu đề hiển thị cùng danh sách các giá trị cốt lõi của BMT Decor.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    sections: [section("content", "Nội dung section", [text("title", "Tiêu đề")])],
    initialRecords: [record("about-core-values-section-content", { title: "Giá trị cốt lõi" })],
  }),
  resource({
    module: "about",
    path: "capabilities-section-content",
    title: "Giới thiệu section Năng lực nổi bật",
    singular: "Giới thiệu Năng lực nổi bật",
    description: "Tiêu đề hiển thị cùng các nội dung và hình ảnh năng lực của BMT Decor.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    sections: [section("content", "Nội dung section", [text("title", "Tiêu đề")])],
    initialRecords: [record("about-capabilities-section-content", { title: "Năng lực nổi bật" })],
  }),
  scopedContactFormResource("about", "contact-form", "Giới thiệu"),
];

const projectResources: AdminResourceConfig[] = [
  resource({
    module: "projects",
    path: "list",
    title: "Danh sách dự án",
    singular: "Dự án",
    description: "Quản lý danh sách dự án, ảnh đại diện, liên kết và nhóm danh mục. Phần tiêu đề, mô tả và icon danh mục được cố định theo giao diện website.",
    priority: "P1",
    kind: "collection",
    collectionMode: "dynamic",
    titleField: "title",
    previewField: "thumbnail",
    orderField: "order",
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        text("slug", "Đường dẫn hệ thống", { required: true, editable: false }),
        text("category", "Nhóm danh mục", {
          required: true,
          type: "select",
          options: projectCategories.map(({ label }) => label),
          placeholder: "Chọn danh mục dự án",
        }),
        siteLink("href", "Liên kết", { required: true }),
      ]),
      section("media", "Hình ảnh", [image("thumbnail", "Ảnh đại diện", { altKey: "imageAlt", ratio: "1.04:1" })]),
      section("display", "Thứ tự", [orderField]),
    ],
    initialRecords: mockProjectContent.cards.map((item) =>
      record(item.id, { ...item }),
    ),
  }),
  resource({
    module: "projects",
    path: "list-section-content",
    title: "Giới thiệu section Danh sách dự án",
    singular: "Giới thiệu Danh sách dự án",
    description: "Tiêu đề hiển thị ngay phía trên danh sách dự án trên trang Dự án.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    sections: [section("content", "Nội dung section", [text("title", "Tiêu đề")])],
    initialRecords: [record("projects-list-section-content", { title: "DỰ ÁN BMT Decor ĐÃ THI CÔNG" })],
  }),
  resource({
    module: "projects",
    path: "details",
    title: "Chi tiết dự án",
    singular: "Chi tiết dự án",
    description: "Quản lý toàn bộ nội dung của từng trang Dự án con: thông tin chung, nội dung mô tả, ảnh mở đầu, khảo sát, bản vẽ, phối cảnh 3D, quy trình và các cặp ảnh trước/sau.",
    priority: "P1",
    kind: "collection",
    collectionMode: "dynamic",
    titleField: "title",
    previewField: "heroImage",
    sections: [
      section("general", "Thông tin chung", [
        text("slug", "Đường dẫn", { required: true }),
        text("title", "Tiêu đề", { required: true }),
        text("displayName", "Tên hiển thị"),
        text("projectName", "Tên dự án"),
        text("category", "Danh mục"),
        text("location", "Địa điểm"),
        text("client", "Khách hàng"),
        text("area", "Diện tích"),
        text("scale", "Quy mô"),
        text("style", "Phong cách"),
        text("scope", "Phạm vi"),
      ]),
      section("body", "Nội dung dự án", [
        textarea("description", "Tổng quan dự án"),
        textarea("surveyDescription", "Mô tả khảo sát"),
        text("drawingCaption", "Chú thích bản vẽ"),
        textarea("solutionDescription", "Mô tả giải pháp"),
        textarea("galleryDescription", "Mô tả thư viện phối cảnh"),
        textarea("processDescription", "Mô tả quy trình"),
        textarea("ctaDescription", "Mô tả kêu gọi liên hệ"),
      ]),
      section("hero", "Ảnh mở đầu", [
        image("heroImage", "Ảnh mở đầu", { altKey: "heroAlt", ratio: "1:1" }),
      ]),
      section("survey", "Khảo sát hiện trạng · 3 slot cố định", [
        ...Array.from({ length: 3 }, (_, index) => image(`survey${index + 1}Image`, `Ảnh khảo sát ${index + 1}`, { altKey: `survey${index + 1}Alt` })),
      ]),
      section("drawing", "Bản vẽ", [
        image("drawingImage", "Bản vẽ", { altKey: "drawingAlt" }),
      ]),
      section("renders", "Phối cảnh 3D · 6 slot cố định", [
        ...Array.from({ length: 6 }, (_, index) => image(`render${index + 1}Image`, `Ảnh phối cảnh ${index + 1}`, { altKey: `render${index + 1}Alt` })),
      ]),
      section("process", "Quy trình · 4 bước cố định", [
        ...Array.from({ length: 4 }, (_, index) => [
          text(`process${index + 1}Label`, `Bước ${index + 1} · Nhãn`),
          image(`process${index + 1}Image`, `Bước ${index + 1} · Ảnh`, { altKey: `process${index + 1}Alt` }),
        ]).flat(),
      ]),
      section("comparisons", "So sánh trước / sau · 3 hàng cố định", [
        ...Array.from({ length: 3 }, (_, index) => [
          image(`comparison${index + 1}BeforeImage`, `Hàng ${index + 1} · Ảnh trước`, { altKey: `comparison${index + 1}BeforeAlt` }),
          text(`comparison${index + 1}BeforeLabel`, `Hàng ${index + 1} · Nhãn trước`),
          text(`comparison${index + 1}BeforeBadge`, `Hàng ${index + 1} · Badge trước`),
          image(`comparison${index + 1}AfterImage`, `Hàng ${index + 1} · Ảnh sau`, { altKey: `comparison${index + 1}AfterAlt` }),
          text(`comparison${index + 1}AfterLabel`, `Hàng ${index + 1} · Nhãn sau`),
          text(`comparison${index + 1}AfterBadge`, `Hàng ${index + 1} · Badge sau`),
        ]).flat(),
      ]),
    ],
    initialRecords: Object.values(publicProjectDetails).map((item) =>
      record(`project-detail-${item.slug}`, {
        slug: item.slug,
        title: item.title,
        displayName: item.displayName,
        projectName: item.projectName,
        category: item.category,
        location: item.location,
        client: item.client,
        area: item.area,
        scale: item.scale,
        style: item.style,
        scope: item.scope,
        description: item.description.join("\n\n"),
        surveyDescription: item.surveyDescription,
        drawingCaption: item.drawingCaption,
        solutionDescription: item.solutionDescription,
        galleryDescription: item.galleryDescription,
        processDescription: item.processDescription,
        ctaDescription: item.ctaDescription,
        heroImage: item.heroImage.src,
        heroAlt: item.heroImage.alt,
        drawingImage: item.drawing.src,
        drawingAlt: item.drawing.alt,
        ...Object.fromEntries(item.survey.flatMap((entry, index) => [[`survey${index + 1}Image`, entry.src], [`survey${index + 1}Alt`, entry.alt]])),
        ...Object.fromEntries(item.renders.flatMap((entry, index) => [[`render${index + 1}Image`, entry.src], [`render${index + 1}Alt`, entry.alt]])),
        ...Object.fromEntries(item.process.flatMap((entry, index) => [[`process${index + 1}Label`, entry.label], [`process${index + 1}Image`, entry.src], [`process${index + 1}Alt`, entry.alt]])),
        ...Object.fromEntries(item.comparisons.flatMap((entry, index) => [
          [`comparison${index + 1}BeforeImage`, entry.before.src],
          [`comparison${index + 1}BeforeAlt`, entry.before.alt],
          [`comparison${index + 1}BeforeLabel`, entry.before.label],
          [`comparison${index + 1}BeforeBadge`, entry.before.badge ?? ""],
          [`comparison${index + 1}AfterImage`, entry.after.src],
          [`comparison${index + 1}AfterAlt`, entry.after.alt],
          [`comparison${index + 1}AfterLabel`, entry.after.label],
          [`comparison${index + 1}AfterBadge`, entry.after.badge ?? ""],
        ])),
      }),
    ),
  }),
  resource({
    module: "projects",
    path: "related",
    title: "Dự án liên quan",
    singular: "Dự án liên quan",
    description: "Quản lý trọn section Dự án liên quan ở cuối trang Dự án con gồm tiêu đề section và danh sách dự án, hình ảnh, liên kết liên quan.",
    priority: "P2",
    kind: "collection",
    titleField: "title",
    previewField: "image",
    orderField: "order",
    companionResourceKey: "projects/related-section-content",
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        siteLink("href", "Liên kết", { required: true }),
        image("image", "Ảnh", { altKey: "imageAlt" }),
        orderField,
      ]),
    ],
    initialRecords: mockProjectContent.related.map((item) =>
      record(item.id, { ...item }),
    ),
  }),
  resource({
    module: "projects",
    path: "related-section-content",
    title: "Giới thiệu section Dự án liên quan",
    singular: "Giới thiệu Dự án liên quan",
    description: "Tiêu đề hiển thị cùng danh sách dự án liên quan ở cuối trang chi tiết dự án.",
    priority: "P2",
    kind: "singleton",
    titleField: "title",
    sections: [section("content", "Nội dung section", [text("title", "Tiêu đề")])],
    initialRecords: [record("projects-related-section-content", { title: "DỰ ÁN LIÊN QUAN" })],
  }),
  scopedContactFormResource("projects", "contact-form", "Dự án"),
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
    "listMode" | "itemLabel" | "companionResourceKey" | "description" | "editorLayout"
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
  textarea("title", "Tiêu đề", { required: true }),
  textarea("description", "Mô tả", { required: true }),
  image("image", "Hình ảnh"),
];
// Dòng chữ đứng ngay trên danh sách gạch đầu dòng của mỗi thẻ giải pháp.
const SOLUTION_CHECKLIST_LABEL = "BMT Decor cung cấp:";
const solutionFields = [
  text("titlePrefix", "Tiêu đề dòng 1", { required: true }),
  text("titleCategory", "Tiêu đề dòng 2", { required: true }),
  text("tagline", "Dòng giới thiệu"),
  textarea("description", "Mô tả"),
  text("checklistLabel", "Dòng chữ phía trên danh sách", { required: true }),
  list("checklist", "Danh sách nội dung", { listMode: "fixed" }),
  text("ctaLabel", "Chữ trên nút bấm"),
  siteLink("ctaHref", "Liên kết của nút bấm"),
  image("image", "Hình ảnh", { altKey: "imageAlt" }),
];
const featuredProjectFields = [
  text("title", "Tiêu đề", { required: true }),
  text("tag", "Nhãn"),
  image("image", "Hình ảnh", { altKey: "imageAlt" }),
];

/**
 * Section "Liên hệ tư vấn" ở cuối trang. Mỗi trang có một resource riêng lấy
 * dữ liệu từ file data của chính trang đó, nên sửa trang này không đụng trang
 * khác. Ảnh nền/khấc của form là đồ trang trí nên không mở field.
 */
function contactFormResource(
  module: AdminModuleKey,
  path: string,
  label: string,
  content: ContactFormContent,
): AdminResourceConfig {
  const { description, ...rest } = content;
  return resource({
    module,
    path,
    title: "Liên hệ tư vấn",
    singular: `Biểu mẫu liên hệ trang ${label}`,
    description: `Nội dung biểu mẫu liên hệ ở cuối trang ${label}. Nội dung này chỉ áp dụng cho trang ${label}.`,
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    sections: [
      // `span` xếp các ô đúng như biểu mẫu ngoài site: tiêu đề và mô tả trải hết
      // bề ngang, 2 ô nhập nằm cạnh nhau, nút gửi nhỏ bên cạnh dòng báo lỗi.
      section("content", "Nội dung biểu mẫu liên hệ", [
        text("title", "Tiêu đề", {
          required: true,
          span: 12,
          description: "Hiện trên site đúng như gõ ở đây, nên giữ dạng in hoa.",
        }),
        ...(description === undefined
          ? []
          : [textarea("description", "Nội dung mô tả dưới tiêu đề", { required: true, span: 12 })]),
        text("namePlaceholder", "Chữ gợi ý ô Tên khách hàng", { required: true, span: 6 }),
        text("phonePlaceholder", "Chữ gợi ý ô Số điện thoại", { required: true, span: 6 }),
        text("submitLabel", "Chữ trên nút gửi", { required: true, span: 4 }),
        text("requiredMessage", "Thông báo khi bỏ trống ô nhập", { required: true, span: 8 }),
        textarea("successMessage", "Thông báo sau khi gửi thành công", { required: true, span: 12 }),
      ]),
    ],
    initialRecords: [
      record(
        `${module}-${path.replace(/\//g, "-")}`,
        description === undefined ? rest : { ...rest, description },
      ),
    ],
  });
}

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
    // Site: cụm chữ bên trái, ảnh nền bên phải. Cột phải chỉ có đúng ô ảnh nền
    // nên để cỡ `wide`, chứ tem nhỏ đứng cạnh 4 ô chữ trông hụt hẳn.
    editorLayout: { mediaSide: "right", mediaPreview: "wide" },
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
    // Site xếp ảnh chiếm nửa trái, panel chữ nửa phải — admin xếp y vậy.
    editorLayout: { mediaSide: "left" },
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
      text("tagline", "Dòng giới thiệu"),
      textarea("description", "Mô tả"),
      image("image", "Hình ảnh", { altKey: "imageAlt" }),
    ],
    "image",
    {
      // Mô phỏng đúng section trên website: một hàng 4 nhãn của thanh chuyển,
      // rồi từng dịch vụ với ảnh bên trái và cụm chữ bên phải. Cột trái chỉ có
      // đúng ô ảnh nên để cỡ `wide` cho ảnh choán hết chỗ thay vì tem nhỏ.
      editorLayout: {
        sharedRowField: "tabLabel",
        sharedRowLabel: "Thanh chuyển dịch vụ",
        mediaSide: "left",
        mediaPreview: "wide",
      },
    },
  ),
  serviceCollection(
    "overview/process",
    "Quy trình tổng quan dịch vụ",
    "Bước quy trình",
    overviewProcess.map((item, index) => record(`overview-process-${index + 1}`, { title: item.title, description: item.copy, image: item.image, imageOpen: item.imageOpen, order: index + 1 })),
    [...processFields, image("imageOpen", "Ảnh khi mở")],
    "image",
    {
      companionResourceKey: "services/overview/process-intro",
      // Mỗi bước trên site là một hàng: ảnh trái ~1/3, tiêu đề và mô tả bên phải.
      editorLayout: { mediaSide: "left", mediaWidth: "third" },
    },
  ),
  serviceCollection(
    "overview/faq",
    "Câu hỏi thường gặp về dịch vụ",
    "Câu hỏi",
    frequentlyAskedQuestions.map((item, index) => record(`faq-${index + 1}`, { ...item, order: index + 1 })),
    [text("question", "Câu hỏi", { required: true }), textarea("answer", "Câu trả lời", { required: true })],
    undefined,
    { companionResourceKey: "services/overview/faq-intro" },
  ),
  contactFormResource(
    "services",
    "overview/contact-form",
    "Tổng quan Dịch vụ",
    overviewContactForm,
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
    // Tiêu đề nằm ngay trong `RenovationProcessSteps` (chữ đứng trước logo BMT)
    // chứ không phải trong trang, nên trước đây bị bỏ sót. Section này không có
    // dòng mô tả lẫn hình trang trí, để trống hai giá trị đó.
    process: {
      title: renovationProcessHeading,
      description: "",
      lineImage: "",
      brandLogo: renovationProcessLogo,
    },
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
    /** Chỉ phần Dự án tiêu biểu mới có nút bấm đứng dưới danh sách. */
    readonly ctaLabel?: string;
  },
) {
  // Bố cục biên tập mô phỏng site: có logo thì chữ bên trái – logo bên phải;
  // phần Dự án tiêu biểu chia đôi 50/50 với tiêu đề và chữ trên nút bấm xếp dọc
  // ở cột trái, đoạn giới thiệu ở cột phải. Hai cột xếp dọc riêng nên nút bấm
  // nằm sát ngay dưới tiêu đề, không phải chờ hết chiều cao ô bên phải.
  const editorLayout: AdminEditorRecordLayout | undefined = preset.brandLogo
    ? { mediaSide: "right", mediaWidth: "third" }
    : preset.ctaLabel === undefined
      ? undefined
      : { splitColumns: { left: ["title", "ctaLabel"], right: ["description"] } };

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
    ...(editorLayout ? { editorLayout } : {}),
    sections: [
      section("content", `Giới thiệu ${label}`, [
        textarea("title", "Tiêu đề", { required: true }),
        ...(preset.description
          ? [textarea("description", "Nội dung giới thiệu", { required: true })]
          : []),
        ...(preset.brandLogo
          ? [image("brandLogo", "Logo BMT Decor nằm trong tiêu đề", { altKey: "brandLogoAlt" })]
          : []),
        // Nút đứng dưới danh sách dự án; xếp sau đoạn giới thiệu để rơi xuống
        // ngay dưới tiêu đề ở cột trái.
        ...(preset.ctaLabel === undefined
          ? []
          : [
              text("ctaLabel", "Chữ trên nút bấm dưới danh sách", {
                required: true,
                description: "Hiện trên site đúng như gõ ở đây, nên giữ dạng in hoa.",
              }),
            ]),
        // Hình trang trí là ảnh khung cố định của layout, không phải nội dung —
        // giữ giá trị để site vẫn hiển thị nhưng không cho admin chỉnh.
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

/**
 * Quy trình của 4 trang dịch vụ con dùng 4 component khác hẳn nhau, nên bố cục
 * biên tập cũng phải khác nhau cho khớp:
 * - Xây dựng trọn gói: lưới 2 cột (ProcessStepsGrid).
 * - Thiết kế: timeline dọc, cụm chữ bên trái và icon bên phải (2/1).
 * - Thi công: hàng ngang icon trái, tiêu đề và mô tả bên phải.
 * - Cải tạo: site xếp 5 bước thành 5 cột với chữ đè trong ảnh, nhưng nhồi 5 thẻ
 *   nhập liệu lên một hàng thì cột nào cũng hẹp tới mức vỡ. Nên đổi lại: mỗi
 *   bước là một hàng ngang (tiêu đề · mô tả · ảnh), 5 bước xếp dọc xuống — đó
 *   cũng là bố cục mặc định nên không cần khai gì thêm.
 */
const serviceProcessLayouts: Record<string, AdminEditorRecordLayout> = {
  "xay-dung-tron-goi": { recordsPerRow: 2 },
  "thiet-ke-kien-truc-noi-that": { mediaSide: "right", mediaWidth: "third" },
  "thi-cong-xay-dung": { mediaSide: "left", mediaWidth: "third" },
};

function addServicePageResources(
  base: string,
  label: string,
  projects: ReadonlyArray<{ id: string; title: string; tag: string; image: string }>,
  solutions: ReadonlyArray<{ titlePrefix: string; titleCategory: string; tagline: string; description: string; checklist: readonly string[]; cta: string; image: string }>,
  processes: ReadonlyArray<{ title: string; subtitle?: string; description?: string; copy?: string; icon?: string }>,
  contactForm: ContactFormContent,
  featuredCtaLabel: string,
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
    serviceSectionIntro(base, "featured-project", "dự án tiêu biểu", {
      ...sectionPresets.featured,
      ctaLabel: featuredCtaLabel,
    }),
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
      {
        companionResourceKey: `services/${base}/featured-project-intro`,
        // Tiêu đề, nhãn và văn bản thay thế bên trái; hình ảnh bên phải. Thẻ chỉ
        // có 3 ô chữ nên ảnh xem trước để cỡ vừa, không kéo cao bằng cột chữ.
        editorLayout: { mediaSide: "right", mediaWidth: "third", mediaPreview: "large" },
      },
    ),
    serviceCollection(
      `${base}/solutions`,
      `Giải pháp ${label}`,
      "Giải pháp",
      solutions.map((item, index) => record(`${base}-solution-${index + 1}`, { titlePrefix: item.titlePrefix, titleCategory: item.titleCategory, tagline: item.tagline, description: item.description, checklistLabel: SOLUTION_CHECKLIST_LABEL, checklist: [...item.checklist], ctaLabel: item.cta, ctaHref: "/du-an", image: item.image, imageAlt: `${item.titlePrefix.trim()} ${item.titleCategory}`, order: index + 1 })),
      solutionFields,
      "image",
      {
        companionResourceKey: `services/${base}/solutions-intro`,
        // Thẻ giải pháp trên site: ảnh 1/3, chữ 2/3, và đảo bên qua từng thẻ.
        // Cột chữ có tới 9 ô nên để ảnh cao bằng cột chữ cho hai bên bằng nhau.
        editorLayout: { mediaSide: "alternate", mediaWidth: "third", mediaPreview: "fill" },
      },
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
      {
        ...(sectionPresets.process
          ? { companionResourceKey: `services/${base}/process-intro` }
          : {}),
        editorLayout: serviceProcessLayouts[base],
      },
    ),
    contactFormResource("services", `${base}/contact-form`, label, contactForm),
  );
}

addServicePageResources("xay-dung-tron-goi", "Xây dựng trọn gói", turnkeyProjects, turnkeySolutions, turnkeyProcess.map((item) => ({ title: item.title, copy: item.copy, icon: item.icon })), turnkeyContactForm, turnkeyFeaturedCta);
addServicePageResources("thiet-ke-kien-truc-noi-that", "Thiết kế Kiến trúc & Nội thất", designProjects, designSolutions, designProcess.map((item) => ({ title: item.title, copy: item.copy, icon: item.icon })), designContactForm, designFeaturedCta);
addServicePageResources("thi-cong-xay-dung", "Thi công xây dựng", constructionProjects, constructionSolutions, constructionProcess, constructionContactForm, constructionFeaturedCta);
addServicePageResources("cai-tao-sua-chua", "Cải tạo & sửa chữa", renovationProjects, renovationSolutions, renovationProcess, renovationContactForm, renovationFeaturedCta);


const remainingResources: AdminResourceConfig[] = [
  resource({
    module: "projects",
    path: "page-hero",
    title: "Mở đầu trang Dự án",
    singular: "Phần mở đầu trang Dự án",
    description: "Quản lý trọn phần mở đầu trang Dự án gồm tiêu đề nhiều dòng, nội dung mô tả, nút bấm, liên kết và hình ảnh cho máy tính/điện thoại.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    previewField: "desktopImage",
    editorLayout: { mediaSide: "right", mediaWidth: "half", mediaPreview: "wide" },
    sections: [
      section("content", "Nội dung", [textarea("title", "Tiêu đề chính", { required: true }), textarea("description", "Mô tả"), text("ctaLabel", "Chữ trên nút bấm"), siteLink("ctaHref", "Liên kết của nút bấm")]),
      section("media", "Hình ảnh", [image("desktopImage", "Ảnh trên máy tính", { altKey: "desktopAlt" }), image("mobileImage", "Ảnh trên điện thoại", { altKey: "mobileAlt" })]),
    ],
    initialRecords: [record("projects-page-hero", { title: "MỖI CÔNG TRÌNH, MỘT CAM KẾT CHẤT LƯỢNG", description: "Mỗi dự án là minh chứng cho năng lực thiết kế thi công và sự tận tâm của BMT Decor.", ctaLabel: "Liên hệ ngay", ctaHref: "/lien-he", desktopImage: "/images/projects/hero-composition.png", desktopAlt: "Các dự án tiêu biểu của BMT Decor", mobileImage: "/images/projects/mobile/hero-composition.png", mobileAlt: "Các dự án tiêu biểu của BMT Decor" })],
  }),
  resource({
    module: "news",
    path: "page-hero",
    title: "Mở đầu trang Tin tức",
    singular: "Phần mở đầu trang Tin tức",
    description: "Quản lý trọn phần mở đầu trang Tin tức gồm dòng giới thiệu, tiêu đề, mô tả, nút bấm, liên kết và hình ảnh trên máy tính/điện thoại.",
    priority: "P2",
    kind: "singleton",
    titleField: "title",
    previewField: "desktopImage",
    editorLayout: { mediaSide: "right", mediaWidth: "half", mediaPreview: "wide" },
    sections: [
      section("content", "Nội dung", [text("eyebrow", "Dòng giới thiệu"), textarea("title", "Tiêu đề chính", { required: true }), textarea("description", "Mô tả"), text("ctaLabel", "Chữ trên nút bấm"), siteLink("ctaHref", "Liên kết của nút bấm")]),
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
    // Site: dòng giới thiệu + tiêu đề + nút nằm cột trái, mô tả cột phải.
    editorLayout: {
      splitColumns: {
        left: ["eyebrow", "title", "ctaLabel"],
        right: ["description", "ctaHref"],
      },
    },
    sections: [
      section("content", "Nội dung phần mở đầu", [
        text("eyebrow", "Khối Hero · Dòng giới thiệu"),
        textarea("title", "Khối Hero · Tiêu đề chính", { required: true }),
        textarea("description", "Khối Hero · Nội dung mô tả"),
        text("ctaLabel", "Khối Hero · Chữ trên nút liên hệ"),
        siteLink("ctaHref", "Khối Hero · Liên kết nút liên hệ"),
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
  contactFormResource("quotation", "contact-form", "Báo giá", quotationContactForm),
  contactFormResource(
    "settings",
    "capability-profile/contact-form",
    "Hồ sơ năng lực",
    capabilityProfileContactForm,
  ),
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
    editorLayout: { mediaSide: "right", mediaWidth: "half", mediaPreview: "wide" },
    sections: [
      section("content", "Nội dung", [textarea("title", "Tiêu đề chính", { required: true }), textarea("description", "Mô tả"), text("ctaLabel", "Chữ trên nút bấm"), siteLink("ctaHref", "Liên kết của nút bấm")]),
      section("media", "Hình ảnh", [image("photo", "Ảnh tư vấn viên", { altKey: "photoAlt" })]),
    ],
    initialRecords: [record("contact-hero", { title: "LIÊN HỆ NGAY", description: "Hãy chia sẻ nhu cầu về thiết kế kiến trúc, thiết kế nội thất, xây dựng, cải tạo hoặc sửa chữa nhà để đội ngũ BMT Decor tư vấn giải pháp phù hợp với không gian và ngân sách của bạn.", ctaLabel: "LIÊN HỆ NGAY", ctaHref: "#contact-form", photo: "/images/contact/contact-consultant.jpg", photoAlt: "Tư vấn viên BMT Decor hỗ trợ khách hàng về thiết kế và thi công" })],
  }),
  resource({
    module: "contacts",
    path: "map",
    title: "Bản đồ liên hệ",
    singular: "Bản đồ liên hệ",
    description: "Quản lý section Bản đồ liên hệ gồm nội dung mô tả hỗ trợ truy cập và liên kết Google Maps của văn phòng BMT Decor.",
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
    // Phần mở đầu chia đôi: hai dòng tiêu đề xếp dọc ở cột trái, đoạn mô tả ở
    // cột phải. Các section khác không khớp danh sách này nên giữ lưới 12 cột.
    editorLayout: {
      splitColumns: { left: ["title", "subtitle"], right: ["description"] },
    },
    sections: [
      section("hero-copy", "Nội dung phần mở đầu", [
        textarea("title", "Khối Hero · Tiêu đề chính", { required: true }),
        text("subtitle", "Khối Hero · Tiêu đề phụ"),
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
    description: "Quản lý trọn section Tin tức nổi bật gồm tiêu đề section và các bài nổi bật với tiêu đề, mô tả, hình ảnh và liên kết riêng.",
    priority: "P2",
    kind: "collection",
    titleField: "title",
    previewField: "desktopImage",
    orderField: "order",
    editorLayout: { mediaSide: "left", mediaWidth: "third", mediaPreview: "large" },
    sections: [section("content", "Nội dung", [text("title", "Tiêu đề", { required: true }), textarea("excerpt", "Mô tả"), image("desktopImage", "Ảnh trên máy tính", { altKey: "imageAlt" }), image("mobileImage", "Ảnh trên điện thoại", { altKey: "imageAlt" }), siteLink("href", "Liên kết"), orderField])],
    initialRecords: featuredNews.map((item, index) => record(item.id, { ...item, order: index + 1 })),
  }),
  resource({
    module: "news",
    path: "featured-section-content",
    title: "Giới thiệu section Tin tức nổi bật",
    singular: "Giới thiệu Tin tức nổi bật",
    description: "Tiêu đề hiển thị cùng carousel các bài viết nổi bật trên trang Tin tức.",
    priority: "P2",
    kind: "singleton",
    titleField: "title",
    sections: [section("content", "Nội dung section", [text("title", "Tiêu đề")])],
    initialRecords: [record("news-featured-section-content", { title: "TIN TỨC NỔI BẬT" })],
  }),
  resource({
    module: "news",
    path: "list",
    title: "Danh sách Tin tức",
    singular: "Tin tức",
    description: "Quản lý section Danh sách Tin tức và từng bài viết gồm đường dẫn, tiêu đề, mô tả ngắn, hình ảnh và nội dung bài viết.",
    priority: "P2",
    kind: "collection",
    collectionMode: "dynamic",
    titleField: "title",
    previewField: "desktopImage",
    orderField: "order",
    sections: [
      section("identity", "Thông tin bài viết", [text("slug", "Đường dẫn hệ thống", { required: true, editable: false }), text("title", "Tiêu đề", { required: true }), textarea("excerpt", "Mô tả ngắn"), siteLink("href", "Liên kết")]),
      section("media", "Hình ảnh", [
        image("desktopImage", "Ảnh trên máy tính", { altKey: "imageAlt", ratio: "1.38:1" }),
        image("mobileImage", "Ảnh trên điện thoại", { altKey: "imageAlt", ratio: "5:3" }),
      ]),
      section("body", "Nội dung bài viết", [textarea("body", "Nội dung", { required: true }), orderField]),
    ],
    initialRecords: articles.map((item, index) => record(item.id, { ...item, body: stripSimpleHtml(item.body), order: index + 1 })),
  }),
  scopedContactFormResource("news", "contact-form", "Tin tức"),
  resource({
    module: "recruitment",
    path: "hero",
    title: "Mở đầu trang Tuyển dụng",
    singular: "Phần mở đầu trang Tuyển dụng",
    description: "Quản lý trọn phần mở đầu trang Tuyển dụng gồm tiêu đề, mô tả, nút bấm, liên kết và hình ảnh riêng cho máy tính/điện thoại.",
    priority: "P2",
    kind: "singleton",
    titleField: "title",
    previewField: "desktopImage",
    editorLayout: { mediaSide: "left", mediaWidth: "half", mediaPreview: "wide" },
    sections: [
      section("content", "Nội dung", [textarea("title", "Tiêu đề", { required: true }), textarea("description", "Mô tả"), text("ctaLabel", "Chữ trên nút bấm"), siteLink("ctaHref", "Liên kết của nút bấm")]),
      section("desktop", "Ảnh trên máy tính", [image("desktopImage", "Ảnh trên máy tính", { altKey: "desktopAlt" })]),
      section("mobile", "Ảnh trên điện thoại", [image("mobileImage", "Ảnh trên điện thoại", { altKey: "mobileAlt" })]),
    ],
    initialRecords: [record("career-hero", { title: "Gia nhập đội ngũ BMT Decor", description: "Mỗi công trình chất lượng đều bắt đầu từ một đội ngũ tận tâm.", ctaLabel: "Xem vị trí đang tuyển", ctaHref: "#career-openings-title", desktopImage: "/images/careers/hero.png", desktopAlt: "Cái bắt tay trên bản vẽ kiến trúc tại BMT Decor", mobileImage: "/images/careers/mobile/hero-artwork.png", mobileAlt: "Cái bắt tay trên bản vẽ kiến trúc tại BMT Decor trên thiết bị di động" })],
  }),
  resource({
    module: "recruitment",
    path: "jobs",
    title: "Vị trí tuyển dụng",
    singular: "Vị trí tuyển dụng",
    description: "Quản lý trọn section Vị trí tuyển dụng gồm tiêu đề section và từng vị trí với thông tin công việc, mô tả, trách nhiệm, quyền lợi và hình ảnh.",
    priority: "P2",
    kind: "collection",
    collectionMode: "dynamic",
    titleField: "title",
    previewField: "image",
    sections: [
      section("general", "Thông tin vị trí", [text("title", "Tiêu đề", { required: true }), text("department", "Phòng ban"), text("location", "Địa điểm"), text("schedule", "Lịch làm việc"), text("compensation", "Thu nhập"), textarea("summary", "Mô tả ngắn")]),
      section("details", "Chi tiết công việc", [list("responsibilities", "Trách nhiệm"), list("benefits", "Quyền lợi"), image("image", "Ảnh", { altKey: "imageAlt", ratio: "1.38:1" })]),
    ],
    initialRecords: careerJobs.map((job) => record(job.id, { ...job, imageAlt: job.title })),
  }),
  resource({
    module: "recruitment",
    path: "jobs-section-content",
    title: "Giới thiệu section Vị trí tuyển dụng",
    singular: "Giới thiệu Vị trí tuyển dụng",
    description: "Tiêu đề hiển thị phía trên danh sách các vị trí tuyển dụng đang mở tại BMT Decor.",
    priority: "P2",
    kind: "singleton",
    titleField: "title",
    sections: [section("content", "Nội dung section", [text("title", "Tiêu đề")])],
    initialRecords: [record("recruitment-jobs-section-content", { title: "Khám phá các vị trí đang tuyển dụng" })],
  }),
  scopedContactFormResource("recruitment", "contact-form", "Tuyển dụng"),
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
      section("steps", "Thanh tiến trình", [list("stepLabels", "Tên các bước", { listMode: "fixed", listLayout: "inline" })]),
      section(`step-01`, `Bước 01 · ${quotationSteps[0]}`, [
        text("heading1", "Tiêu đề", { required: true }),
        text("instruction1", "Hướng dẫn"),
        list("buildingOptions", "Các loại hình", { listMode: "fixed", listLayout: "inline" }),
      ]),
      section(`step-02`, `Bước 02 · ${quotationSteps[1]}`, [
        text("heading2", "Tiêu đề", { required: true }),
        text("instruction2", "Hướng dẫn"),
        text("areaPlaceholder", "Chữ gợi ý trong ô nhập"),
        text("areaUnit", "Đơn vị hiển thị trong ô nhập"),
      ]),
      section(`step-03`, `Bước 03 · ${quotationSteps[2]}`, [
        text("heading3", "Tiêu đề", { required: true }),
        text("instruction3", "Hướng dẫn"),
        text("budgetPlaceholder", "Chữ gợi ý trong ô nhập"),
        text("budgetUnit", "Đơn vị hiển thị trong ô nhập"),
      ]),
      section(`step-04`, `Bước 04 · ${quotationSteps[3]}`, [
        text("heading4", "Tiêu đề", { required: true }),
        text("instruction4", "Hướng dẫn"),
        list("serviceOptions", "Các gói", { listMode: "fixed", listLayout: "inline" }),
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
    description: "Chỉ chỉnh tiêu đề, placeholder, nút gửi và thông báo của biểu mẫu. Label, nội dung cố định và hình ảnh không cho thay đổi.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    sections: [
      section("content", "Nội dung được phép chỉnh", [
        text("title", "Tiêu đề", { required: true, span: 12 }),
        text("namePlaceholder", "Placeholder ô Họ tên", { span: 6 }),
        text("phonePlaceholder", "Placeholder ô Điện thoại", { span: 6 }),
        text("submitLabel", "Chữ trên nút gửi", { span: 4 }),
        textarea("successMessage", "Thông báo thành công", { span: 8 }),
      ]),
    ],
    initialRecords: [record("contact-form", { title: "Liên hệ tư vấn", description: "Chia sẻ nhu cầu để đội ngũ BMT Decor tư vấn giải pháp phù hợp.", nameLabel: "Tên khách hàng", namePlaceholder: "Tên khách hàng...", phoneLabel: "Số điện thoại", phonePlaceholder: "Số điện thoại...", submitLabel: "Gửi ngay", successMessage: "Cảm ơn bạn đã gửi thông tin. BMT Decor sẽ liên hệ trong thời gian sớm nhất.", backgroundImage: "/images/contact/mobile/form-background.png", formImage: "/images/contact/contact-consultant.jpg", formImageAlt: "Tư vấn viên BMT Decor hỗ trợ khách hàng" })],
  }),
  resource({
    module: "settings",
    path: "branding",
    title: "Logo đầu trang",
    singular: "Logo đầu trang",
    description: "Thay logo hiển thị ở đầu trang.",
    priority: "P2",
    kind: "singleton",
    titleField: "label",
    previewField: "logo",
    sections: [section("assets", "Logo", [image("logo", "Logo", { altKey: "logoAlt" })])],
    initialRecords: [record("branding", { label: "BMT Decor", logo: "/images/home/logo-header.png", logoAlt: "BMT Decor", favicon: "/favicon.ico" })],
  }),
  resource({
    module: "settings",
    path: "navigation",
    title: "Danh mục đầu trang",
    singular: "Mục trong danh mục",
    description: "Quản lý tên, liên kết và thứ tự của danh mục đầu trang.",
    priority: "P2",
    kind: "collection",
    titleField: "label",
    orderField: "order",
    editorLayout: { recordsPerRow: 4 },
    sections: [section("menu", "Mục trong danh mục", [text("label", "Tên hiển thị", { required: true }), siteLink("href", "Liên kết", { required: true }), orderField])],
    initialRecords: navigation.map((item, index) => record(`navigation-${index + 1}`, { label: item.label, href: item.href, order: index + 1 })),
  }),
  resource({
    module: "settings",
    path: "footer",
    title: "Cấu hình Footer",
    singular: "Footer website",
    description: "Toàn bộ nội dung được phép chỉnh ở footer được gom tại đây: logo, 4 dịch vụ, liên hệ, chi nhánh & nhà xưởng, mạng xã hội và ảnh fanpage.",
    priority: "P1",
    kind: "singleton",
    titleField: "contactHeading",
    previewField: "footerLogo",
    sections: [
      section("logo", "Logo cuối trang", [
        image("footerLogo", "Logo Footer", {
          altKey: "footerLogoAlt",
          ratio: "1:1",
          span: 12,
        }),
      ]),
      section("services", "4 dịch vụ ở Footer", [
        text("service1Label", "Dịch vụ 1 · Nội dung", { required: true, span: 6 }),
        siteLink("service1Href", "Dịch vụ 1 · Đường dẫn", { required: true, span: 6 }),
        text("service2Label", "Dịch vụ 2 · Nội dung", { required: true, span: 6 }),
        siteLink("service2Href", "Dịch vụ 2 · Đường dẫn", { required: true, span: 6 }),
        text("service3Label", "Dịch vụ 3 · Nội dung", { required: true, span: 6 }),
        siteLink("service3Href", "Dịch vụ 3 · Đường dẫn", { required: true, span: 6 }),
        text("service4Label", "Dịch vụ 4 · Nội dung", { required: true, span: 6 }),
        siteLink("service4Href", "Dịch vụ 4 · Đường dẫn", { required: true, span: 6 }),
      ]),
      section("contact", "Liên hệ", [
        text("contactHeading", "Tiêu đề Liên hệ", { required: true, span: 12 }),
        textarea("officeAddress", "Địa chỉ chính", { required: true, span: 12 }),
        text("phone", "Số hỗ trợ tư vấn / Zalo", { required: true, span: 6 }),
        text("email", "Email", { required: true, span: 6 }),
      ]),
      section("branches", "Chi nhánh và nhà xưởng", [
        text("branchesHeading", "Tiêu đề Chi nhánh và nhà xưởng", {
          required: true,
          span: 12,
        }),
        textarea("branch1Address", "Địa chỉ chi nhánh 1", { required: true, span: 4 }),
        textarea("branch2Address", "Địa chỉ chi nhánh 2", { required: true, span: 4 }),
        textarea("workshopAddress", "Địa chỉ xưởng sản xuất", { required: true, span: 4 }),
      ]),
      section("social", "Mạng xã hội", [
        url("facebookUrl", "Đường dẫn Facebook", { span: 6 }),
        url("tiktokUrl", "Đường dẫn TikTok", { span: 6 }),
        url("instagramUrl", "Đường dẫn Instagram", { span: 6 }),
        url("linkedinUrl", "Đường dẫn LinkedIn", { span: 6 }),
        image("socialWidgetImage", "Ảnh nền / fanpage dưới các icon mạng xã hội", {
          altKey: "socialWidgetAlt",
          ratio: "2.33:1",
          span: 12,
        }),
      ]),
    ],
    initialRecords: [
      record("footer", {
        footerLogo: "/images/home/logo-footer.png",
        footerLogoAlt: "BMT Decor",
        service1Label: services[0].label,
        service1Href: services[0].href,
        service2Label: services[1].label,
        service2Href: services[1].href,
        service3Label: services[2].label,
        service3Href: services[2].href,
        service4Label: services[3].label,
        service4Href: services[3].href,
        contactHeading: "Liên hệ:",
        officeAddress: contactInformation.office,
        phone: contactInformation.phone,
        email: contactInformation.email,
        branchesHeading: "Chi nhánh và nhà xưởng:",
        branch1Address: contactInformation.branches[0],
        branch2Address: contactInformation.branches[1],
        workshopAddress: contactInformation.branches[2],
        facebookUrl: "https://facebook.com",
        tiktokUrl: "https://tiktok.com",
        instagramUrl: "https://instagram.com",
        linkedinUrl: "https://linkedin.com",
        socialWidgetImage: "/images/home/facebook-widget.png",
        socialWidgetAlt: "Trang Facebook BMT Decor",
        copyright: "Copyright 2010 © CÔNG TY TNHH TMDV BMT DECOR | MST: 0317552987",
      }),
    ],
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
      { title: "Liên hệ tư vấn", description: "Nội dung biểu mẫu liên hệ ở cuối trang, chỉ áp dụng cho trang này.", priority: "P1", count: `${Object.keys(overviewContactForm).length} trường`, href: "/admin/services/overview/contact-form" },
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
          { title: "Liên hệ tư vấn", description: "Nội dung biểu mẫu liên hệ ở cuối trang, chỉ áp dụng cho trang này.", priority: "P1", href: `/admin/services/${slug}/contact-form` },
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
