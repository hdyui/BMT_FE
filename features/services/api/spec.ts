/**
 * Bảng đối chiếu giữa 5 trang dịch vụ, cây `Pages` của backend và các resource
 * trong admin registry (`services/...`). Dùng chung cho trang public, editor
 * admin và script seed, để cả ba cùng một định nghĩa.
 *
 * Chỉ các field trong `fields` được lưu ở backend (theo whitelist của
 * `ServiceController`). Mọi thứ backend không lưu — ảnh trang trí, nút CTA và
 * đường dẫn của nó — viết cứng trong code, admin không có ô nhập và trang
 * không có bản tĩnh nào thay thế nội dung.
 */

export const SERVICE_PAGE_CODES = [
  "services",
  "serviceTurnkey",
  "serviceArchitectureInterior",
  "serviceConstruction",
  "serviceRenovation",
] as const;

export type ServicePageCode = (typeof SERVICE_PAGE_CODES)[number];

/** Bản thiết kế chỉ hiển thị 4 câu hỏi; admin chỉ sửa đúng 4 câu đó. */
export const FAQ_VISIBLE_QUESTIONS = 4;

export interface ServiceSectionSpec {
  /** Khóa resource trong admin registry. */
  resourceKey: string;
  /** `nodeKey` của section trong cây backend. */
  section: string;
  /** `single`: giá trị nằm ở chính section; `items`: mỗi `item_XX` là một record. */
  kind: "single" | "items";
  /** Số slot cố định của collection (chỉ có với `items`). */
  slots?: number;
  /** Field lưu ở backend. */
  fields: readonly string[];
}

export interface ServicePageSpec {
  pageCode: ServicePageCode;
  /** Đoạn giữa của khóa resource admin, ví dụ `xay-dung-tron-goi`. */
  adminBase: string;
  sections: readonly ServiceSectionSpec[];
}

const contactFormFields = ["title", "description", "submitLabel", "successMessage"] as const;

const overview: ServicePageSpec = {
  pageCode: "services",
  adminBase: "overview",
  sections: [
    {
      resourceKey: "services/overview/hero-content",
      section: "hero",
      kind: "single",
      fields: ["eyebrow", "title", "subtitle", "description", "backgroundImage"],
    },
    {
      resourceKey: "services/overview/hero-cards",
      section: "heroCards",
      kind: "items",
      slots: 4,
      fields: ["image"],
    },
    {
      resourceKey: "services/overview/service-list",
      section: "serviceList",
      kind: "items",
      slots: 4,
      fields: ["tabLabel", "title", "tagline", "description", "image"],
    },
    {
      resourceKey: "services/overview/process-intro",
      section: "processIntro",
      kind: "single",
      fields: ["title", "description"],
    },
    {
      resourceKey: "services/overview/process",
      section: "process",
      kind: "items",
      slots: 6,
      fields: ["title", "description", "imageOpen"],
    },
    {
      resourceKey: "services/overview/faq-intro",
      section: "faqIntro",
      kind: "single",
      fields: ["title", "description", "photo"],
    },
    {
      resourceKey: "services/overview/faq",
      section: "faq",
      kind: "items",
      slots: FAQ_VISIBLE_QUESTIONS,
      fields: ["question", "answer"],
    },
    {
      resourceKey: "services/overview/contact-form",
      section: "contactForm",
      kind: "single",
      fields: contactFormFields,
    },
  ],
};

function detailPage(
  pageCode: ServicePageCode,
  adminBase: string,
  options: {
    heroImages: readonly string[];
    processSlots: number;
    /** Chỉ trang Thiết kế và Cải tạo có logo BMT nằm trong tiêu đề quy trình. */
    processBrandLogo?: boolean;
  },
): ServicePageSpec {
  const key = (path: string) => `services/${adminBase}/${path}`;
  return {
    pageCode,
    adminBase,
    sections: [
      {
        resourceKey: key("hero"),
        section: "hero",
        kind: "single",
        fields: ["title", "subtitle", ...options.heroImages],
      },
      {
        resourceKey: key("featured-project-intro"),
        section: "featuredProjectsIntro",
        kind: "single",
        fields: ["title", "description", "ctaLabel"],
      },
      {
        resourceKey: key("featured-project"),
        section: "featuredProjects",
        kind: "items",
        slots: 3,
        fields: ["title", "tag", "image"],
      },
      {
        resourceKey: key("solutions-intro"),
        section: "solutionsIntro",
        kind: "single",
        fields: ["title", "description"],
      },
      {
        resourceKey: key("solutions"),
        section: "solutions",
        kind: "items",
        slots: 4,
        fields: [
          "titlePrefix",
          "titleCategory",
          "tagline",
          "description",
          "checklistLabel",
          "checklist",
          "image",
        ],
      },
      {
        resourceKey: key("process-intro"),
        section: "processIntro",
        kind: "single",
        // Trang có logo trong tiêu đề quy trình chỉ hiện tiêu đề + logo, không có dòng mô tả.
        fields: options.processBrandLogo ? ["title", "brandLogo"] : ["title", "description"],
      },
      {
        resourceKey: key("process"),
        section: "process",
        kind: "items",
        slots: options.processSlots,
        fields: ["title", "description", "image"],
      },
      {
        resourceKey: key("contact-form"),
        section: "contactForm",
        kind: "single",
        fields: contactFormFields,
      },
    ],
  };
}

export const SERVICE_PAGES: readonly ServicePageSpec[] = [
  overview,
  detailPage("serviceTurnkey", "xay-dung-tron-goi", {
    heroImages: ["desktopArtwork", "mobileArtwork", "sideDecoration"],
    processSlots: 6,
  }),
  detailPage("serviceArchitectureInterior", "thiet-ke-kien-truc-noi-that", {
    heroImages: ["wireframeImage", "leftImage", "centerImage", "rightImage", "mobileArtwork"],
    processSlots: 6,
    processBrandLogo: true,
  }),
  detailPage("serviceConstruction", "thi-cong-xay-dung", {
    heroImages: [
      "wireframeImage",
      "topImage",
      "rightImage",
      "bottomImage",
      "leftImage",
    ],
    processSlots: 5,
  }),
  detailPage("serviceRenovation", "cai-tao-sua-chua", {
    heroImages: ["wireframeImage", "largeImage", "topImage", "bottomImage"],
    processSlots: 5,
    processBrandLogo: true,
  }),
];
