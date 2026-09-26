import { contactInformation, services } from "@/shared/constants/site";
import {
  aboutCapabilities,
  aboutCoreValues,
  aboutJourneyMilestones,
} from "@/features/about/data/about-content";
import { careerJobs } from "@/features/careers/data/jobs";
import {
  homeMobileServiceLabels,
  homeProjectCategories,
  homeServiceDetails,
  homeStats,
  homeTrustReasons,
} from "@/features/home/data/home-content";
import { articles } from "@/features/news/data/news-page";
import {
  quotationAreaInput,
  quotationBudgetInput,
  quotationBuildingTypes,
  quotationMarketRanges,
  quotationNavLabels,
  quotationResultIncludeLabel,
  quotationServiceTypes,
  quotationStepCopy,
  quotationMobileHeroImage,
  quotationSteps,
} from "@/features/quotation/data/quotation-estimator";
import { SERVICE_PAGES } from "@/features/services/api/spec";
import { contactFormContent as quotationContactForm } from "@/features/quotation/data/quotation-contact-form";
import { contactFormContent as capabilityProfileContactForm } from "@/features/capability-profile/data/contact-form";
import { mockHomeHeroSlides } from "@/features/admin/lib/mock-data/home";
import { mockProjectContent } from "@/features/admin/lib/mock-data/projects";
import { projects as publicProjectDetails } from "@/features/projects/data/project-details";
import { projectCategories } from "@/features/projects/data/projects-page";
import { siteLinkOptions } from "@/features/admin/lib/site-links";
import type { ContactFormContent } from "@/shared/components/contact-form-content";
import type {
  AdminCrudRecord,
  AdminEditorRecordLayout,
  AdminEditorSectionConfig,
  AdminFieldConfig,
  AdminModuleKey,
  AdminResourceConfig,
  AdminResourceGroupConfig,
} from "@/features/admin/lib/types/crud";

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

const richtext = (
  key: string,
  label: string,
  options: Partial<AdminFieldConfig> = {},
): AdminFieldConfig => ({ key, label, type: "richtext", ...options });

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
 * thật (`features/admin/lib/site-links.ts`) thay vì gõ tay, để admin không thể lưu một
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

function listItemsToRichText(items: readonly string[]) {
  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

const FOOTER_SERVICE_EDITABLE_KEYS = new Set([
  "service1Label",
  "service1Href",
  "service2Label",
  "service2Href",
  "service3Label",
  "service3Href",
  "service4Label",
  "service4Href",
  "facebookUrl",
  "tiktokUrl",
  "instagramUrl",
  "linkedinUrl",
]);

const BUTTON_TEXT_FIELD_KEY_PATTERN = /(?:cta|submit|back|next)(?:label|text)$/i;
const LINK_FIELD_KEY_PATTERN = /(?:href|url)$/i;

function isFieldInAdminEditingScope(
  module: AdminModuleKey,
  path: string,
  field: AdminFieldConfig,
) {
  if (
    module === "settings" &&
    path === "footer" &&
    FOOTER_SERVICE_EDITABLE_KEYS.has(field.key)
  ) {
    return true;
  }

  return (
    !BUTTON_TEXT_FIELD_KEY_PATTERN.test(field.key) &&
    !LINK_FIELD_KEY_PATTERN.test(field.key)
  );
}

function sanitizeEditorLayout(
  layout: AdminEditorRecordLayout | undefined,
  visibleFieldKeys: Set<string>,
): AdminEditorRecordLayout | undefined {
  if (!layout?.splitColumns) return layout;

  const left = layout.splitColumns.left.filter((key) => visibleFieldKeys.has(key));
  const right = layout.splitColumns.right.filter((key) => visibleFieldKeys.has(key));

  if (left.length === 0 || right.length === 0) {
    return {
      ...layout,
      splitColumns: undefined,
    };
  }

  return {
    ...layout,
    splitColumns: { left, right },
  };
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

const textareaLimitedModules = new Set<AdminModuleKey>([
  "home",
  "about",
  "services",
  "projects",
  "news",
  "recruitment",
  "quotation",
  "contacts",
  "settings",
]);

function textareaLineRules(
  module: AdminModuleKey,
  path: string,
  field: AdminFieldConfig,
): Pick<AdminFieldConfig, "rows" | "maxLines"> {
  if (field.type !== "textarea" || !textareaLimitedModules.has(module)) return {};
  if (field.rows || field.maxLines) return {};

  if (field.key === "successMessage") return { rows: 3, maxLines: 4 };
  if (field.key === "summary" || field.key.toLowerCase().includes("excerpt")) {
    return { rows: 3, maxLines: 4 };
  }
  if (field.key.toLowerCase().includes("title")) return { rows: 2, maxLines: 2 };

  if (module === "projects" && path === "details") {
    if (field.key === "ctaDescription") return { rows: 4, maxLines: 5 };
    return { rows: 6, maxLines: 8 };
  }

  if (module === "about" && path === "vision-mission") {
    return { rows: 4, maxLines: 6 };
  }

  // Đoạn giới thiệu của dịch vụ con (dự án tiêu biểu/giải pháp/quy trình) là
  // văn bản dài nhiều dòng, xếp cạnh cột tiêu đề ngắn — cho ô cao hơn mức mặc
  // định để hiện hết chữ, không co cụm rồi cuộn trong khi cột bên cạnh còn
  // khoảng trống.
  if (module === "services" && path.endsWith("-intro")) {
    return { rows: 3, maxLines: 10 };
  }

  if (path.includes("hero") || path === "page-hero") {
    return { rows: 4, maxLines: 5 };
  }

  return { rows: 4, maxLines: 6 };
}

function resource(
  config: Omit<AdminResourceConfig, "key" | "moduleLabel" | "moduleHref">,
): AdminResourceConfig {
  const sections = config.sections
    .map((item) => ({
      ...item,
      fields: item.fields
        .filter(
          (field) =>
            field.key !== "order" &&
            isFieldInAdminEditingScope(config.module, config.path, field),
        )
        .map((field) => ({
          ...field,
          ...textareaLineRules(config.module, config.path, field),
        })),
    }))
    .filter((item) => item.fields.length > 0);
  const visibleFieldKeys = new Set(
    sections.flatMap((item) => item.fields.map((field) => field.key)),
  );
  const editorLayout = sanitizeEditorLayout(config.editorLayout, visibleFieldKeys);

  return {
    ...config,
    sections,
    editorLayout,
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
  description: "",
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
    description: `Biểu mẫu liên hệ riêng của trang ${pageLabel}. Có thể chỉnh tiêu đề, tiêu đề phụ và thông báo thành công; label, placeholder, nội dung cố định và hình ảnh không cho thay đổi.`,
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    sections: [
      section("content", "Nội dung được phép chỉnh", [
        text("title", "Tiêu đề", { required: true, span: 12 }),
        textarea("description", "Tiêu đề phụ", { span: 12 }),
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
    description: "Quản lý nội dung mở đầu Trang chủ gồm tiêu đề, mô tả và một ảnh banner dùng chung cho mọi kích thước màn hình.",
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
      section("media", "Hình ảnh", [
        image("desktopImage", "Ảnh banner", {
          altKey: "desktopAlt",
          ratio: "16:9",
          recommendedSize: "1920 × 1080px",
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
    description: "Quản lý phần giới thiệu và chọn một trong 4 nhóm dự án tiêu biểu để cập nhật nội dung hiển thị trên Trang chủ.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    companionResourceKey: "home/projects-section-content",
    sections: [],
    initialRecords: [record("home-featured-projects-navigation", { title: "Dự án tiêu biểu" })],
  }),
  ...homeProjectCategories.map((category) =>
    resource({
      module: "home",
      path: `featured-projects/${category.slug}`,
      title: category.label,
      singular: "Dự án",
      description: `Quản lý 8 dự án tiêu biểu thuộc nhóm ${category.label}. Chọn một dự án trong bảng để chỉnh sửa nội dung chi tiết.`,
      priority: "P1",
      kind: "collection",
      collectionMode: "fixed",
      collectionView: "table",
      titleField: "title",
      previewField: "image",
      orderField: "order",
      sections: [
        section("content", "Nội dung dự án", [
          text("title", "Tiêu đề", { required: true, span: 6 }),
          text("area", "Diện tích", { span: 6 }),
          text("styleText", "Phong cách", { span: 6 }),
          number("year", "Năm", { min: 2000, span: 6 }),
        ]),
        section("media", "Hình ảnh", [
          image("image", "Ảnh dự án", { altKey: "imageAlt", ratio: "16:9" }),
        ]),
        section("display", "Thứ tự", [orderField]),
      ],
      initialRecords: category.projects.map((project, projectIndex) =>
        record(`home-project-${project.id}`, {
          title: project.title,
          area: project.area,
          styleText: project.style,
          year: project.year,
          image: project.image,
          imageAlt: project.title,
          order: projectIndex + 1,
        }),
      ),
    }),
  ),
  resource({
    module: "home",
    path: "featured-services",
    title: "Dịch vụ nổi bật trên Trang chủ",
    singular: "Dịch vụ nổi bật",
    description: "Quản lý trọn section Dịch vụ nổi bật gồm tiêu đề, mô tả giới thiệu, nội dung và hình ảnh của từng dịch vụ trên Trang chủ.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "desktopImage",
    orderField: "order",
    companionResourceKey: "home/services-section-content",
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        textarea("description", "Mô tả", { required: true, span: 12 }),
      ]),
      section("media", "Hình ảnh", [
        image("desktopImage", "Ảnh trên máy tính", { altKey: "imageAlt", ratio: "16:9" }),
        image("mobileImage", "Ảnh trên điện thoại", { ratio: "4:5" }),
      ]),
      section("display", "Thứ tự", [orderField]),
    ],
    initialRecords: homeServiceDetails.map((service, index) =>
      record(`home-service-${index + 1}`, {
        title: homeMobileServiceLabels[index].join(" "),
        description: service.copy,
        desktopImage: service.desktopImage,
        mobileImage: service.image,
        imageAlt: homeMobileServiceLabels[index].join(" "),
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
    sections: [
      section("content", "Số liệu", [
        // Ba bản ghi xếp thành ba thanh ngang; bên trong mỗi thanh là 3 cột.
        number("value", "Giá trị", { required: true, span: 4 }),
        text("label", "Nhãn", { required: true, span: 4 }),
        text("suffix", "Hậu tố", { placeholder: "+", span: 4 }),
        orderField,
      ]),
    ],
    initialRecords: homeStats.map((item, index) =>
      record(`home-stat-${index + 1}`, {
        value: item.value,
        label: item.label,
        suffix: "+",
        order: index + 1,
      }),
    ),
  }),
  resource({
    module: "home",
    path: "why-bmt",
    title: "Vì sao chọn BMT",
    singular: "Lý do",
    description: "Quản lý nội dung và hình ảnh của từng lý do khách hàng lựa chọn BMT Decor, gồm ảnh trên máy tính và ảnh trên điện thoại.",
    priority: "P2",
    kind: "collection",
    titleField: "title",
    previewField: "defaultImage",
    orderField: "order",
    companionResourceKey: "home/trust-section-content",
    editorLayout: { recordsPerRow: 2 },
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true, span: 6 }),
        textarea("description", "Mô tả", { required: true, span: 6 }),
      ]),
      section("media", "Hình ảnh", [
        image("defaultImage", "Ảnh trên máy tính", { span: 6 }),
        image("mobileImage", "Ảnh trên điện thoại", { span: 6 }),
      ]),
      section("display", "Thứ tự cố định", [orderField]),
    ],
    initialRecords: homeTrustReasons.map((item, index) =>
      record(`why-bmt-${index + 1}`, {
        title: item.title,
        description: item.copy,
        iconImage: item.icon,
        defaultImage: item.desktopImage,
        mobileImage: item.image,
        order: index + 1,
        enabled: true,
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
    // Sáu logo chia thành 3 cột trên desktop: 3 mục hàng trên, 3 mục hàng dưới.
    editorLayout: {
      recordsPerRow: 3,
      mediaSide: "left",
      mediaWidth: "third",
      mediaAltPlacement: "text",
      hideFixedItemHint: true,
    },
    sections: [
      section("content", "Thông tin đối tác", [
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
    titleField: "titleDesktop",
    sections: [section("content", "Nội dung section", [text("titleDesktop", "Tiêu đề trên máy tính"), text("titleMobile", "Tiêu đề trên điện thoại"), textarea("descriptionDesktop", "Mô tả trên máy tính"), textarea("descriptionMobile", "Mô tả trên điện thoại")])],
    initialRecords: [record("home-trust-section-content", {
      titleDesktop: "Vì sao khách hàng tin chọn BMT Decor?",
      titleMobile: "Vì sao khách hàng tin chọn",
      descriptionDesktop: "Với tư duy thiết kế sáng tạo và quy trình thi công bài bản, chúng tôi kiến tạo những không gian hài hòa giữa thẩm mỹ, công năng và giá trị sử dụng bền vững.",
      descriptionMobile: "Với tư duy thiết kế luôn đổi mới trong sáng tạo và quy trình thi công bài bản, chúng tôi kiến tạo nên những không gian có giá trị thẩm mỹ cao cấp, tối ưu công năng một cách tuyệt đối và có độ bền vững theo thời gian cho không gian sống.",
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
      description: "BMT Decor cung cấp dịch vụ thiết kế và thi công trọn gói, đáp ứng đa dạng nhu cầu từ nhà ở đến không gian kinh doanh.",
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
    description: "Quản lý tiêu đề, mô tả và hai asset hình ảnh của section Hồ sơ năng lực.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    previewField: "threeBooksImage",
    editorLayout: { mediaSide: "right", mediaWidth: "half", mediaPreview: "large" },
    sections: [
      section("content", "Nội dung section", [
        textarea("title", "Tiêu đề"),
        text("subtitle", "Tiêu đề phụ"),
        textarea("description", "Mô tả"),
        text("ctaLabel", "Chữ trên nút bấm"),
        siteLink("ctaHref", "Liên kết của nút bấm"),
      ]),
      section("media", "Hình ảnh", [
        image("oneBookImage", "Asset 1 cuốn sách màu cam", { altKey: "portfolioAlt" }),
        image("threeBooksImage", "Asset 3 cuốn sách màu cam"),
      ]),
    ],
    initialRecords: [record("home-profile-section-content", {
      title: "Hồ sơ năng lực",
      subtitle: "Đơn vị thiết kế thi công kiến trúc và nội thất, ngoại thất chuyên nghiệp tại Việt Nam",
      description: "Với đội ngũ kiến trúc sư trẻ – năng động đầy sáng tạo, BMT Decor luôn mong muốn phát triển và mang đến những thiết kế ấn tượng và độc đáo. Là đối tác độc quyền của nhiều thương hiệu lớn. Thiết kế và thi công nhiều trung tâm thương mại tại TP.HCM.",
      ctaLabel: "XEM THÊM",
      ctaHref: "/capability-profile",
      oneBookImage: "/images/home/portfolio-book.png",
      threeBooksImage: "/images/home/portfolio-set-orange.png",
      portfolioAlt: "Hồ sơ năng lực BMT Decor màu cam",
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
        right: ["desktopImage"],
      },
    },
    sections: [
      section("layout", "Bố cục phần mở đầu", [
        text("eyebrow", "Dòng giới thiệu", { required: true, span: 12 }),
        text("heading", "Tiêu đề chính", { required: true, maxLength: 90, span: 12 }),
        textarea("description", "Mô tả", { required: true, maxLength: 420, span: 12 }),
        image("desktopImage", "Ảnh Hero", {
          altKey: "desktopAlt",
          ratio: "16:9",
          recommendedSize: "1920 x 1080px",
          required: true,
        }),
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
      }),
    ],
  }),
  resource({
    module: "about",
    path: "journey",
    title: "Hành trình BMT",
    singular: "Cột mốc",
    description: "Quản lý các cột mốc Hành trình gồm năm, tiêu đề và mô tả.",
    priority: "P1",
    kind: "collection",
    titleField: "title",
    previewField: "image",
    orderField: "order",
    companionResourceKey: "about/journey-section-content",
    editorLayout: { recordsPerRow: 2 },
    sections: [
      section("content", "Cột mốc", [
        text("year", "Năm", { required: true, span: 6 }),
        text("title", "Tiêu đề", { required: true, span: 6 }),
        textarea("description", "Mô tả", { required: true, span: 12 }),
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
    editorLayout: {
      recordsPerRow: 2,
      mediaSide: "left",
      mediaWidth: "third",
      mediaPreview: "large",
      hideFixedItemHint: true,
    },
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true }),
        textarea("description", "Mô tả", { required: true }),
        text("imageAlt", "Văn bản thay thế"),
      ]),
      section("media", "Hình minh họa", [
        image("image", "Hình minh họa"),
      ]),
      section("display", "Thứ tự", [orderField]),
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
    description: "Quản lý nội dung Tầm nhìn & Sứ mệnh.",
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
    description: "Quản lý nội dung Năng lực nổi bật gồm số thứ tự, tiêu đề và mô tả.",
    priority: "P2",
    kind: "collection",
    titleField: "title",
    previewField: "normalImage",
    orderField: "order",
    companionResourceKey: "about/capabilities-section-content",
    editorLayout: { recordsPerRow: 2 },
    sections: [
      section("content", "Nội dung", [
        text("number", "Số thứ tự", { required: true, editable: false }),
        text("title", "Tiêu đề", { required: true }),
        text("mobileTitle", "Tiêu đề trên điện thoại"),
        textarea("description", "Mô tả", {
          required: true,
          span: 12,
          placeholder: "Nhập mô tả năng lực...",
        }),
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
    description: "Quản lý danh sách dự án, ảnh đại diện và nhóm danh mục. Phần tiêu đề, mô tả và icon danh mục được cố định theo giao diện website.",
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
        text("title", "Tiêu đề"),
        text("projectName", "Tên dự án"),
        text("category", "Danh mục"),
        text("location", "Khu vực"),
        text("client", "Chủ đầu tư"),
        text("area", "Diện tích"),
        text("scale", "Quy mô"),
        image("heroImage", "Ảnh dự án", { altKey: "heroAlt", ratio: "1:1" }),
        image("wordmarkImage", "Ảnh Mộc Miên House", {
          altKey: "wordmarkAlt",
          ratio: "4.23:1",
        }),
        textarea("description", "Nội dung giới thiệu"),
      ]),
      section("survey", "Khảo sát hiện trạng và lên phương án", [
        ...Array.from({ length: 3 }, (_, index) =>
          image(`survey${index + 1}Image`, `Ảnh khảo sát ${index + 1}`, {
            altKey: `survey${index + 1}Alt`,
          }),
        ),
        textarea("surveyDescription", "Mô tả khảo sát"),
      ]),
      section("solution", "Phương án", [
        text("drawingCaption", "Chú thích bản vẽ"),
        textarea("solutionDescription", "Mô tả giải pháp"),
        image("drawingImage", "Bản vẽ", { altKey: "drawingAlt" }),
      ]),
      section("renders", "Hình ảnh 3D", [
        ...Array.from({ length: 6 }, (_, index) =>
          image(`render${index + 1}Image`, `Ảnh phối cảnh ${index + 1}`, {
            altKey: `render${index + 1}Alt`,
          }),
        ),
        textarea("galleryDescription", "Mô tả thư viện phối cảnh"),
      ]),
      section("process", "Quá trình và năng lực thi công", [
        ...Array.from({ length: 4 }, (_, index) => [
          text(`process${index + 1}Label`, `Bước ${index + 1} · Nhãn`),
          image(`process${index + 1}Image`, `Bước ${index + 1} · Ảnh`, { altKey: `process${index + 1}Alt` }),
        ]).flat(),
        textarea("processDescription", "Mô tả quy trình"),
      ]),
      section("comparisons", "Thành quả bàn giao · Trước và sau thi công", [
        ...Array.from({ length: 3 }, (_, index) => [
          image(`comparison${index + 1}BeforeImage`, `Hàng ${index + 1} · Ảnh trước`, { altKey: `comparison${index + 1}BeforeAlt` }),
          text(`comparison${index + 1}BeforeLabel`, `Hàng ${index + 1} · Nhãn trước`),
          image(`comparison${index + 1}AfterImage`, `Hàng ${index + 1} · Ảnh sau`, { altKey: `comparison${index + 1}AfterAlt` }),
          text(`comparison${index + 1}AfterLabel`, `Hàng ${index + 1} · Nhãn sau`),
        ]).flat(),
      ]),
      section("contact", "Biểu mẫu liên hệ", [
        text("ctaTitle", "Tiêu đề", { span: 12 }),
        textarea("ctaDescription", "Tiêu đề phụ", { span: 12 }),
        text("ctaSubmitLabel", "Chữ trên nút gửi", { span: 4 }),
        textarea("ctaSuccessMessage", "Thông báo sau khi gửi thành công", { span: 12 }),
      ]),
    ],
    initialRecords: mockProjectContent.cards.map((card) => {
      const item = publicProjectDetails[card.slug];

      if (!item) {
        return record(`project-detail-${card.slug}`, {
          slug: card.slug,
          title: "",
          projectName: "",
          category: "",
          location: "",
          client: "",
          area: "",
          scale: "",
          description: "",
          surveyDescription: "",
          drawingCaption: "",
          solutionDescription: "",
          galleryDescription: "",
          processDescription: "",
          ctaTitle: "",
          ctaDescription: "",
          ctaSubmitLabel: "",
          ctaSuccessMessage: "",
          heroImage: "",
          heroAlt: "",
          wordmarkImage: "",
          wordmarkAlt: "",
          drawingImage: "",
          drawingAlt: "",
          ...Object.fromEntries(
            Array.from({ length: 3 }, (_, index) => [
              [`survey${index + 1}Image`, ""],
              [`survey${index + 1}Alt`, ""],
            ]).flat(),
          ),
          ...Object.fromEntries(
            Array.from({ length: 6 }, (_, index) => [
              [`render${index + 1}Image`, ""],
              [`render${index + 1}Alt`, ""],
            ]).flat(),
          ),
          ...Object.fromEntries(
            Array.from({ length: 4 }, (_, index) => [
              [`process${index + 1}Label`, ""],
              [`process${index + 1}Image`, ""],
              [`process${index + 1}Alt`, ""],
            ]).flat(),
          ),
          ...Object.fromEntries(
            Array.from({ length: 3 }, (_, index) => [
              [`comparison${index + 1}BeforeImage`, ""],
              [`comparison${index + 1}BeforeAlt`, ""],
              [`comparison${index + 1}BeforeLabel`, ""],
              [`comparison${index + 1}AfterImage`, ""],
              [`comparison${index + 1}AfterAlt`, ""],
              [`comparison${index + 1}AfterLabel`, ""],
            ]).flat(),
          ),
        });
      }

      return record(`project-detail-${item.slug}`, {
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
        ctaTitle: item.ctaTitle,
        ctaDescription: item.ctaDescription,
        ctaSubmitLabel: item.ctaSubmitLabel,
        ctaSuccessMessage: item.ctaSuccessMessage,
        heroImage: item.heroImage.src,
        heroAlt: item.heroImage.alt,
        wordmarkImage: item.wordmarkImage.src,
        wordmarkAlt: item.wordmarkImage.alt,
        drawingImage: item.drawing.src,
        drawingAlt: item.drawing.alt,
        ...Object.fromEntries(item.survey.flatMap((entry, index) => [[`survey${index + 1}Image`, entry.src], [`survey${index + 1}Alt`, entry.alt]])),
        ...Object.fromEntries(item.renders.flatMap((entry, index) => [[`render${index + 1}Image`, entry.src], [`render${index + 1}Alt`, entry.alt]])),
        ...Object.fromEntries(item.process.flatMap((entry, index) => [[`process${index + 1}Label`, entry.label], [`process${index + 1}Image`, entry.src], [`process${index + 1}Alt`, entry.alt]])),
        ...Object.fromEntries(item.comparisons.flatMap((entry, index) => [
          [`comparison${index + 1}BeforeImage`, entry.before.src],
          [`comparison${index + 1}BeforeAlt`, entry.before.alt],
          [`comparison${index + 1}BeforeLabel`, entry.before.label],
          [`comparison${index + 1}AfterImage`, entry.after.src],
          [`comparison${index + 1}AfterAlt`, entry.after.alt],
          [`comparison${index + 1}AfterLabel`, entry.after.label],
        ])),
      });
    }),
  }),
  resource({
    module: "projects",
    path: "related",
    title: "Dự án liên quan",
    singular: "Dự án liên quan",
    description: "Quản lý trọn section Dự án liên quan ở cuối trang Dự án con gồm tiêu đề section, danh sách dự án và hình ảnh liên quan.",
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

/**
 * Số bản ghi của một collection dịch vụ, lấy theo bảng đối chiếu với backend
 * (`features/services/api/spec.ts`). Dữ liệu thật của các resource `services/*`
 * không nằm ở đây mà được tải từ backend khi mở trang admin
 * (`features/admin/services/service-pages.service.ts`), nên `initialRecords` để trống.
 */
const serviceSlots = (resourceKey: string) =>
  SERVICE_PAGES.flatMap((page) => page.sections).find((item) => item.resourceKey === resourceKey)?.slots ?? 0;

function serviceCollection(
  path: string,
  title: string,
  singular: string,
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
    initialRecords: [],
    ...options,
  });
}

const heroCardFields = [image("image", "Ảnh", { required: true })];
const processFields = [
  textarea("title", "Tiêu đề", { required: true }),
  textarea("description", "Mô tả", { required: true }),
  image("image", "Hình ảnh"),
];
// Chỉ trang Xây dựng trọn gói xếp 2 bước/hàng theo lưới 12 cột
// (`serviceProcessLayouts["xay-dung-tron-goi"]`); span ở đây riêng cho hàng đó
// để không ảnh hưởng các trang dịch vụ khác đang xếp ảnh–chữ theo cột.
const turnkeyProcessFields = [
  textarea("title", "Tiêu đề", { required: true, span: 4 }),
  textarea("description", "Mô tả", { required: true, span: 5 }),
  image("image", "Hình ảnh"),
];
const solutionFields = [
  text("titlePrefix", "Tiêu đề dòng 1", { required: true }),
  text("titleCategory", "Tiêu đề dòng 2", { required: true }),
  text("tagline", "Dòng giới thiệu"),
  textarea("description", "Mô tả"),
  text("checklistLabel", "Dòng chữ phía trên danh sách", { required: true }),
  list("checklist", "Danh sách nội dung", { listMode: "fixed" }),
  // Nút bấm của thẻ giải pháp là ảnh có chữ in sẵn và đường dẫn cố định của FE,
  // backend không lưu chữ/đường dẫn này nên không mở field.
  image("image", "Hình ảnh"),
];
const featuredProjectFields = [
  text("title", "Tiêu đề", { required: true }),
  text("tag", "Nhãn"),
  image("image", "Hình ảnh"),
];

/**
 * Section "Liên hệ tư vấn" ở cuối trang. Mỗi trang có một resource riêng nên sửa
 * trang này không đụng trang khác. Ảnh nền/khấc của form là đồ trang trí nên
 * không mở field. `content` chỉ có với các trang chưa nối backend; resource của
 * 5 trang dịch vụ lấy dữ liệu từ backend nên không truyền.
 */
function contactFormResource(
  module: AdminModuleKey,
  path: string,
  label: string,
  content?: ContactFormContent,
): AdminResourceConfig {
  const editableRequiredMessage =
    module === "quotation" && path === "contact-form";
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
        textarea("description", "Tiêu đề phụ", { span: 12 }),
        text("submitLabel", "Chữ trên nút gửi", { required: true, span: 4 }),
        ...(editableRequiredMessage
          ? [
              text("requiredMessage", "Thông báo khi bỏ trống ô nhập", {
                required: true,
                span: 8,
              }),
            ]
          : []),
        textarea("successMessage", "Thông báo sau khi gửi thành công", { required: true, span: 12 }),
      ]),
    ],
    initialRecords: content
      ? [
          record(`${module}-${path.replace(/\//g, "-")}`, {
            ...content,
            description: content.description ?? "",
          }),
        ]
      : [],
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
      section("images", "Hình ảnh", [
        image("backgroundImage", "Khối Hero · Ảnh nền Banner (Background)"),
      ]),
    ],
    initialRecords: [],
  }),
  serviceCollection(
    "overview/hero-cards",
    "Phần mở đầu trang Tổng quan Dịch vụ",
    "Thẻ mở đầu",
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
      ]),
    ],
    initialRecords: [],
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
      ]),
    ],
    initialRecords: [],
  }),
  serviceCollection(
    "overview/service-list",
    "Danh sách dịch vụ",
    "Dịch vụ",
    [
      text("tabLabel", "Tiêu đề trên thanh chuyển", { required: true }),
      text("title", "Tiêu đề nội dung", { required: true }),
      text("tagline", "Dòng giới thiệu"),
      textarea("description", "Mô tả"),
      image("image", "Hình ảnh"),
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
    // Mỗi bước trên site chỉ hiện MỘT ảnh (`imageOpen`, dùng cả lúc thu gọn lẫn
    // khi mở), nên chỉ có ô nhập cho ảnh đó.
    [...processFields.filter((field) => field.key !== "image"), image("imageOpen", "Hình ảnh")],
    "imageOpen",
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
    [text("question", "Câu hỏi", { required: true }), textarea("answer", "Câu trả lời", { required: true })],
    undefined,
    { companionResourceKey: "services/overview/faq-intro" },
  ),
  contactFormResource("services", "overview/contact-form", "Tổng quan Dịch vụ"),
];

/**
 * Ảnh nội dung ở phần mở đầu của từng trang dịch vụ con mà admin đổi được, đúng
 * bằng các ảnh trang đang hiển thị (khớp `heroImages` trong `spec.ts`). Nền
 * banner, thanh cam, logo line, icon, họa tiết chấm là đồ trang trí viết cứng
 * trong code nên không có ô nhập.
 */
const serviceHeroImages = {
  "xay-dung-tron-goi": [
    ["desktopArtwork", "Khối Hero · Cụm ảnh chính"],
    ["mobileArtwork", "Khối Hero · Cụm ảnh trên điện thoại"],
    ["sideDecoration", "Khối Hero · Hình phác thảo cạnh phải"],
  ],
  "thiet-ke-kien-truc-noi-that": [
    ["wireframeImage", "Khối Hero · Hình phác thảo nền"],
    ["leftImage", "Khối Hero · Ảnh bên trái"],
    ["centerImage", "Khối Hero · Ảnh ở giữa"],
    ["rightImage", "Khối Hero · Ảnh bên phải"],
    ["mobileArtwork", "Khối Hero · Cụm ảnh trên điện thoại"],
  ],
  "thi-cong-xay-dung": [
    ["wireframeImage", "Khối Hero · Hình phác thảo nền"],
    ["topImage", "Khối Hero · Ảnh phía trên"],
    ["rightImage", "Khối Hero · Ảnh bên phải"],
    ["bottomImage", "Khối Hero · Ảnh phía dưới"],
    ["leftImage", "Khối Hero · Ảnh bên trái"],
  ],
  "cai-tao-sua-chua": [
    ["wireframeImage", "Khối Hero · Hình phác thảo nền"],
    ["largeImage", "Khối Hero · Ảnh lớn bên phải"],
    ["topImage", "Khối Hero · Ảnh nhỏ phía trên"],
    ["bottomImage", "Khối Hero · Ảnh nhỏ phía dưới"],
  ],
} as const;

// Hai trang có logo BMT Decor nằm trong tiêu đề quy trình; ở đó tiêu đề không có dòng mô tả.
const serviceProcessLogoBases = new Set(["thiet-ke-kien-truc-noi-that", "cai-tao-sua-chua"]);

function serviceSectionIntro(
  base: string,
  sectionPath: "featured-project" | "solutions" | "process",
  label: string,
  options: {
    /** Có dòng mô tả đứng dưới tiêu đề (theo cách trang hiển thị). */
    readonly description: boolean;
    /** Logo BMT Decor nằm trong tiêu đề (trang Thiết kế và Cải tạo). */
    readonly brandLogo?: boolean;
    /** Chỉ phần Dự án tiêu biểu mới có nút bấm đứng dưới danh sách. */
    readonly ctaLabel?: boolean;
  },
) {
  // Bố cục biên tập mô phỏng site: có logo thì chữ bên trái – logo bên phải;
  // phần Dự án tiêu biểu chia đôi 50/50 với tiêu đề và chữ trên nút bấm xếp dọc
  // ở cột trái, đoạn giới thiệu ở cột phải. Hai cột xếp dọc riêng nên nút bấm
  // nằm sát ngay dưới tiêu đề, không phải chờ hết chiều cao ô bên phải.
  const editorLayout: AdminEditorRecordLayout | undefined = options.brandLogo
    ? { mediaSide: "right", mediaWidth: "third" }
    : options.ctaLabel
      ? { splitColumns: { left: ["title", "ctaLabel"], right: ["description"] } }
      : undefined;

  return resource({
    module: "services",
    path: `${base}/${sectionPath}-intro`,
    title: `Giới thiệu ${label}`,
    singular: `Giới thiệu ${label}`,
    description: `Tiêu đề và nội dung hiển thị cùng phần ${label.toLocaleLowerCase("vi")}.`,
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    ...(options.brandLogo ? { previewField: "brandLogo" } : {}),
    ...(editorLayout ? { editorLayout } : {}),
    sections: [
      section("content", `Giới thiệu ${label}`, [
        textarea("title", "Tiêu đề", { required: true }),
        ...(options.description
          ? [textarea("description", "Nội dung giới thiệu", { required: true })]
          : []),
        ...(options.brandLogo
          ? [image("brandLogo", "Logo BMT Decor nằm trong tiêu đề")]
          : []),
        // Nút đứng dưới danh sách dự án; xếp sau đoạn giới thiệu để rơi xuống
        // ngay dưới tiêu đề ở cột trái.
        ...(options.ctaLabel
          ? [
              text("ctaLabel", "Chữ trên nút bấm dưới danh sách", {
                required: true,
                description: "Hiện trên site đúng như gõ ở đây, nên giữ dạng in hoa.",
              }),
            ]
          : []),
      ]),
    ],
    initialRecords: [],
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

function addServicePageResources(base: keyof typeof serviceHeroImages, label: string) {
  const heroImages = serviceHeroImages[base];
  const hasProcessLogo = serviceProcessLogoBases.has(base);
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
      previewField: heroImages[0][0],
      sections: [
        section("content", "Nội dung phần mở đầu", [
          textarea("title", "Khối Hero · Tiêu đề chính", { required: true }),
          textarea("subtitle", "Khối Hero · Nội dung giới thiệu", { required: true }),
        ]),
        section(
          "media",
          "Hình ảnh phần mở đầu",
          heroImages.map(([key, fieldLabel]) => image(key, fieldLabel)),
        ),
      ],
      initialRecords: [],
    }),
    serviceSectionIntro(base, "featured-project", "dự án tiêu biểu", {
      description: true,
      ctaLabel: true,
    }),
    serviceSectionIntro(base, "solutions", "giải pháp", { description: true }),
    serviceSectionIntro(base, "process", "quy trình", {
      description: !hasProcessLogo,
      brandLogo: hasProcessLogo,
    }),
    serviceCollection(
      `${base}/featured-project`,
      `Dự án tiêu biểu ${label}`,
      "Dự án tiêu biểu",
      featuredProjectFields,
      "image",
      {
        companionResourceKey: `services/${base}/featured-project-intro`,
        // Tiêu đề và nhãn bên trái; hình ảnh bên phải. Thẻ chỉ có 2 ô chữ nên ảnh
        // xem trước để cỡ vừa, không kéo cao bằng cột chữ.
        editorLayout: { mediaSide: "right", mediaWidth: "third", mediaPreview: "large" },
      },
    ),
    serviceCollection(
      `${base}/solutions`,
      `Giải pháp ${label}`,
      "Giải pháp",
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
      base === "xay-dung-tron-goi" ? turnkeyProcessFields : processFields,
      "image",
      {
        companionResourceKey: `services/${base}/process-intro`,
        editorLayout: serviceProcessLayouts[base],
      },
    ),
    contactFormResource("services", `${base}/contact-form`, label),
  );
}

addServicePageResources("xay-dung-tron-goi", "Xây dựng trọn gói");
addServicePageResources("thiet-ke-kien-truc-noi-that", "Thiết kế Kiến trúc & Nội thất");
addServicePageResources("thi-cong-xay-dung", "Thi công xây dựng");
addServicePageResources("cai-tao-sua-chua", "Cải tạo & sửa chữa");


const remainingResources: AdminResourceConfig[] = [
  resource({
    module: "projects",
    path: "page-hero",
    title: "Mở đầu trang Dự án",
    singular: "Phần mở đầu trang Dự án",
    description: "Quản lý phần mở đầu trang Dự án theo bố cục ảnh bên trái và nội dung bên phải. Một ảnh Hero dùng chung cho máy tính và điện thoại; giao diện mobile tự co/cắt theo kích thước màn hình.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    previewField: "desktopImage",
    editorLayout: {
      mediaSide: "left",
      mediaWidth: "twoFifths",
      mediaPreview: "wide",
      mediaAltPlacement: "text",
    },
    sections: [
      section("content", "Nội dung", [
        textarea("title", "Tiêu đề chính", { required: true, span: 12 }),
        textarea("description", "Mô tả", { span: 12 }),
      ]),
      section("media", "Hình ảnh", [
        image("desktopImage", "Ảnh Hero", { altKey: "imageAlt", required: true }),
      ]),
    ],
    initialRecords: [record("projects-page-hero", { title: "MỖI CÔNG TRÌNH, MỘT CAM KẾT CHẤT LƯỢNG", description: "Mỗi dự án là minh chứng cho năng lực thiết kế thi công và sự tận tâm của BMT Decor.", desktopImage: "/images/projects/hero-composition.png", imageAlt: "Các dự án tiêu biểu của BMT Decor" })],
  }),
  resource({
    module: "news",
    path: "page-hero",
    title: "Mở đầu trang Tin tức",
    singular: "Phần mở đầu trang Tin tức",
    description: "Quản lý phần mở đầu trang Tin tức theo bố cục ảnh bên trái và nội dung bên phải. Một ảnh Hero dùng chung cho máy tính và điện thoại; giao diện mobile tự co/cắt theo kích thước màn hình.",
    priority: "P2",
    kind: "singleton",
    titleField: "title",
    previewField: "desktopImage",
    editorLayout: {
      mediaSide: "left",
      mediaWidth: "twoFifths",
      mediaPreview: "wide",
      mediaAltPlacement: "text",
    },
    sections: [
      section("content", "Nội dung", [
        text("eyebrow", "Dòng giới thiệu", { span: 12 }),
        text("title", "Tiêu đề chính", { required: true, span: 12 }),
        textarea("description", "Mô tả", { span: 12 }),
        text("ctaLabel", "Chữ trên nút bấm", { span: 5 }),
        siteLink("ctaHref", "Liên kết của nút bấm", { span: 7 }),
      ]),
      section("media", "Hình ảnh", [
        image("desktopImage", "Ảnh Hero", { altKey: "imageAlt", required: true }),
      ]),
    ],
    initialRecords: [record("news-page-hero", { eyebrow: "KIẾN THỨC", title: "THIẾT KẾ & THI CÔNG", description: "Cập nhật những xu hướng thiết kế nội thất, kinh nghiệm thi công xây dựng, cải tạo nhà ở và giải pháp tối ưu không gian từ đội ngũ BMT Decor.", ctaLabel: "LIÊN HỆ NGAY", ctaHref: "/lien-he", desktopImage: "/images/news/hero-house.jpg", imageAlt: "Mô hình kiến trúc ngôi nhà trên bản vẽ thiết kế" })],
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
      ctaHref: "/contact",
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
    description: "Nội dung và ảnh tư vấn viên trên trang Liên hệ.",
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
    description: "Quản lý nội dung mô tả hỗ trợ truy cập của section Bản đồ liên hệ.",
    priority: "P2",
    kind: "singleton",
    titleField: "title",
    sections: [section("map", "Bản đồ", [text("title", "Mô tả bản đồ"), url("googleMapsUrl", "Liên kết Google Maps", { required: true })])],
    initialRecords: [record("contact-map", { title: "Bản đồ văn phòng BMT Decor tại 7/92 Thành Thái, TP.HCM", googleMapsUrl: "https://www.google.com/maps?q=10.7690413%2C106.6658361&z=18&iwloc=0&output=embed" })],
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
    module: "settings",
    path: "capability-profile-pages",
    title: "Ảnh các trang Hồ sơ năng lực",
    singular: "Trang hồ sơ năng lực",
    description: "Quản lý ảnh từng trang trong cuốn hồ sơ năng lực dạng sách lật, gồm bìa trước, các trang nội dung và bìa sau. Thêm, xóa hoặc đổi thứ tự trang tại đây.",
    priority: "P2",
    kind: "collection",
    collectionMode: "dynamic",
    titleField: "title",
    previewField: "image",
    orderField: "order",
    sections: [
      section("content", "Nội dung trang", [
        text("title", "Tên trang", { required: true, span: 12 }),
        image("image", "Ảnh trang", {
          altKey: "imageAlt",
          ratio: "1:1.414",
          recommendedSize: "1240 x 1754px",
          required: true,
        }),
        orderField,
      ]),
    ],
    initialRecords: Array.from({ length: 20 }, (_, index) => {
      const pageNumber = index + 1;
      const paddedNumber = String(pageNumber).padStart(2, "0");
      const title =
        pageNumber === 1
          ? "Bìa trước hồ sơ năng lực BMT Decor"
          : pageNumber === 20
            ? "Bìa sau hồ sơ năng lực BMT Decor"
            : `Trang ${pageNumber} hồ sơ năng lực BMT Decor`;
      return record(`capability-profile-page-${paddedNumber}`, {
        title,
        image: `/images/capability-profile/profile-page-${paddedNumber}.webp`,
        imageAlt: title,
        order: pageNumber,
      });
    }),
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
        image("desktopImage", "Ảnh bài viết", { altKey: "imageAlt", ratio: "1.38:1" }),
      ]),
      section("body", "Nội dung bài viết", [richtext("body", "Nội dung", { required: true }), orderField]),
    ],
    initialRecords: articles.map((item, index) =>
      record(item.id, {
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        desktopImage: item.desktopImage,
        imageAlt: item.imageAlt,
        href: item.href,
        body: item.body,
        featured: item.featured,
        highlightHome: item.highlightHome,
        order: index + 1,
      }),
    ),
  }),
  scopedContactFormResource("news", "contact-form", "Tin tức"),
  resource({
    module: "recruitment",
    path: "hero",
    title: "Mở đầu trang Tuyển dụng",
    singular: "Phần mở đầu trang Tuyển dụng",
    description: "Quản lý phần mở đầu trang Tuyển dụng theo bố cục ảnh bên trái và nội dung bên phải. Một ảnh dùng chung cho máy tính và điện thoại; giao diện mobile tự co/cắt ảnh theo kích thước màn hình.",
    priority: "P2",
    kind: "singleton",
    titleField: "title",
    previewField: "desktopImage",
    editorLayout: {
      mediaSide: "left",
      mediaWidth: "twoFifths",
      mediaPreview: "wide",
      mediaAltPlacement: "text",
    },
    sections: [
      section("content", "Nội dung", [
        text("title", "Tiêu đề", { required: true, span: 12 }),
        textarea("description", "Mô tả", { span: 12 }),
        text("ctaLabel", "Chữ trên nút bấm", { span: 5 }),
        siteLink("ctaHref", "Liên kết của nút bấm", { span: 7 }),
      ]),
      section("media", "Hình ảnh", [
        image("desktopImage", "Ảnh Hero", {
          altKey: "desktopAlt",
          ratio: "1.486:1",
          recommendedSize: "1486 x 1000px",
          required: true,
        }),
      ]),
    ],
    initialRecords: [record("career-hero", { title: "Gia nhập đội ngũ BMT Decor", description: "Mỗi công trình chất lượng đều bắt đầu từ một đội ngũ tận tâm.", ctaLabel: "Xem vị trí đang tuyển", ctaHref: "#career-openings-title", desktopImage: "/images/careers/hero.png", desktopAlt: "Cái bắt tay trên bản vẽ kiến trúc tại BMT Decor" })],
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
      section("details", "Chi tiết công việc", [richtext("responsibilities", "Trách nhiệm", { required: true }), richtext("benefits", "Quyền lợi", { required: true }), image("image", "Ảnh", { altKey: "imageAlt", ratio: "1.38:1" })]),
    ],
    initialRecords: careerJobs.map((job) =>
      record(job.id, {
        ...job,
        responsibilities: listItemsToRichText(job.responsibilities),
        benefits: listItemsToRichText(job.benefits),
        imageAlt: job.title,
      }),
    ),
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
      ...quotationBuildingTypes.map((building, buildingIndex) =>
        section(
          `market-${buildingIndex}`,
          `Khoảng thị trường · ${building} (đ/m² sàn)`,
          quotationServiceTypes.flatMap((service, serviceIndex) => [
            number(`market_${buildingIndex}_${serviceIndex}_min`, `${service} · Từ`, { span: 6, required: true }),
            number(`market_${buildingIndex}_${serviceIndex}_max`, `${service} · Đến`, { span: 6, required: true }),
          ]),
          "Đơn giá hiển thị ở bước 05 được hệ thống tính từ khoảng này theo loại hình và gói khách chọn.",
        ),
      ),
      section("nav", "Nút chuyển bước", [
        text("backLabel", "Chữ trên nút lùi lại", { required: true }),
        text("nextLabel", "Chữ trên nút đi tiếp", { required: true }),
      ]),
    ],
    initialRecords: [record("quotation-estimator", {
      ...Object.fromEntries(
        quotationBuildingTypes.flatMap((building, buildingIndex) =>
          quotationServiceTypes.flatMap((_, serviceIndex) => {
            const [min, max] = quotationMarketRanges[building][serviceIndex];
            return [
              [`market_${buildingIndex}_${serviceIndex}_min`, min],
              [`market_${buildingIndex}_${serviceIndex}_max`, max],
            ];
          }),
        ),
      ),
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
    description: "Có thể chỉnh tiêu đề, tiêu đề phụ và thông báo của biểu mẫu. Label, placeholder, nội dung cố định và hình ảnh không cho thay đổi.",
    priority: "P1",
    kind: "singleton",
    titleField: "title",
    sections: [
      section("content", "Nội dung được phép chỉnh", [
        text("title", "Tiêu đề", { required: true, span: 12 }),
        textarea("description", "Tiêu đề phụ", { span: 12 }),
        text("submitLabel", "Chữ trên nút gửi", { span: 4 }),
        textarea("successMessage", "Thông báo thành công", { span: 8 }),
      ]),
    ],
    initialRecords: [record("contact-form", { title: "Liên hệ tư vấn", description: "", nameLabel: "Tên khách hàng", namePlaceholder: "Tên khách hàng...", phoneLabel: "Số điện thoại", phonePlaceholder: "Số điện thoại...", submitLabel: "Gửi ngay", successMessage: "Cảm ơn bạn đã gửi thông tin. BMT Decor sẽ liên hệ trong thời gian sớm nhất.", backgroundImage: "/images/contact/mobile/form-background.png", formImage: "/images/contact/contact-consultant.jpg", formImageAlt: "Tư vấn viên BMT Decor hỗ trợ khách hàng" })],
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
    path: "footer",
    title: "Cấu hình Footer",
    singular: "Footer website",
    description: "Toàn bộ nội dung được phép chỉnh ở footer được gom tại đây: logo, 4 dịch vụ và trang tương ứng, liên hệ, chi nhánh & nhà xưởng, mạng xã hội và ảnh fanpage.",
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
        siteLink("service1Href", "Dịch vụ 1 · Trang", { required: true, span: 6 }),
        text("service2Label", "Dịch vụ 2 · Nội dung", { required: true, span: 6 }),
        siteLink("service2Href", "Dịch vụ 2 · Trang", { required: true, span: 6 }),
        text("service3Label", "Dịch vụ 3 · Nội dung", { required: true, span: 6 }),
        siteLink("service3Href", "Dịch vụ 3 · Trang", { required: true, span: 6 }),
        text("service4Label", "Dịch vụ 4 · Nội dung", { required: true, span: 6 }),
        siteLink("service4Href", "Dịch vụ 4 · Trang", { required: true, span: 6 }),
      ]),
      section("contact", "Liên hệ", [
        text("contactHeading", "Tiêu đề Liên hệ", { required: true, span: 12 }),
        textarea("officeAddress", "Địa chỉ chính", {
          required: true,
          span: 12,
          placeholder: "Địa chỉ: 7/92 Thành Thái, Phường Diên Hồng, TP.HCM",
        }),
        text("phone", "Số hỗ trợ tư vấn / Zalo", {
          required: true,
          span: 6,
          placeholder: "Hỗ trợ tư vấn: 0934 888 881",
        }),
        text("email", "Email", {
          required: true,
          span: 6,
          placeholder: "Email: bmt.decor@gmail.com",
        }),
      ]),
      section("branches", "Chi nhánh và nhà xưởng", [
        text("branchesHeading", "Tiêu đề Chi nhánh và nhà xưởng", {
          required: true,
          span: 12,
        }),
        textarea("branch1Address", "Chi nhánh 1", {
          required: true,
          span: 4,
          placeholder: "Địa chỉ chi nhánh 1: 380 Vũ Huy Tấn, Phường Gia Định, TP.HCM",
        }),
        textarea("branch2Address", "Chi nhánh 2", {
          required: true,
          span: 4,
          placeholder: "Địa chỉ chi nhánh 2: 58 Thành Thái, Phường Hoà Hưng, TP.HCM",
        }),
        textarea("workshopAddress", "Xưởng sản xuất", {
          required: true,
          span: 4,
          placeholder: "Xưởng sản xuất: Nguyễn Thị Tự, Phường Bình Tân, TP.HCM",
        }),
      ]),
      section("social", "Mạng xã hội", [
        url("facebookUrl", "Facebook", { span: 6 }),
        url("tiktokUrl", "TikTok", { span: 6 }),
        url("instagramUrl", "Instagram", { span: 6 }),
        url("linkedinUrl", "LinkedIn", { span: 6 }),
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
        officeAddress: `Địa chỉ: ${contactInformation.office}`,
        phone: `Hỗ trợ tư vấn: ${contactInformation.phone}`,
        email: `Email: ${contactInformation.email}`,
        branchesHeading: "Chi nhánh và nhà xưởng:",
        branch1Address: `Địa chỉ chi nhánh 1: ${contactInformation.branches[0]}`,
        branch2Address: `Địa chỉ chi nhánh 2: ${contactInformation.branches[1]}`,
        workshopAddress: `Xưởng sản xuất: ${contactInformation.branches[2]}`,
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
  "home/featured-projects": {
    key: "home/featured-projects",
    title: "Dự án tiêu biểu trên Trang chủ",
    description: "Chọn nhóm dự án cần chỉnh sửa. Mỗi nhóm có 8 dự án và được quản lý bằng bảng danh sách.",
    companionResourceKey: "home/projects-section-content",
    items: homeProjectCategories.map((category) => ({
      title: category.label,
      description: `Quản lý các dự án tiêu biểu thuộc nhóm ${category.label}.`,
      priority: "P1",
      count: `${category.projects.length} dự án`,
      href: `/admin/home/featured-projects/${category.slug}`,
    })),
  },
  "services/overview": {
    key: "services/overview",
    title: "Tổng quan Dịch vụ",
    description: "Các nhóm nội dung trên trang tổng quan Dịch vụ.",
    items: [
      { title: "Thẻ mở đầu", description: "Hình ảnh và mô tả cho phần mở đầu.", priority: "P1", count: `${serviceSlots("services/overview/hero-cards")} mục`, href: "/admin/services/overview/hero-cards" },
      { title: "Danh sách dịch vụ", description: "Tên, dòng giới thiệu và hình ảnh của các dịch vụ.", priority: "P1", count: `${serviceSlots("services/overview/service-list")} mục`, href: "/admin/services/overview/service-list" },
      { title: "Quy trình", description: "Các bước quy trình và ảnh mở rộng.", priority: "P1", count: `${serviceSlots("services/overview/process")} bước`, href: "/admin/services/overview/process" },
      { title: "Câu hỏi thường gặp", description: "Câu hỏi, câu trả lời và trạng thái hiển thị.", priority: "P2", count: `${serviceSlots("services/overview/faq")} câu`, href: "/admin/services/overview/faq" },
      { title: "Liên hệ tư vấn", description: "Nội dung biểu mẫu liên hệ ở cuối trang, chỉ áp dụng cho trang này.", priority: "P1", count: `${adminResourceRegistry["services/overview/contact-form"].sections.flatMap((item) => item.fields).length} trường`, href: "/admin/services/overview/contact-form" },
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
