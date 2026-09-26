/**
 * Dạng dữ liệu `GET /api/v1/pages/{pageCode}` trả về cho 5 trang dịch vụ (phần
 * `content`). Trường tùy chọn chưa có trong dữ liệu lưu có thể vắng mặt hoàn toàn.
 */

export interface ServiceApiIntro {
  title: string;
  description?: string;
  ctaLabel?: string;
  brandLogo?: string;
}

export interface ServiceApiContactForm {
  title: string;
  description?: string;
  submitLabel: string;
  successMessage: string;
}

export interface ServiceApiProject {
  title: string;
  tag?: string;
  image?: string;
}

export interface ServiceApiSolution {
  titlePrefix: string;
  titleCategory: string;
  tagline?: string;
  description?: string;
  checklistLabel: string;
  checklist: string[];
  image?: string;
}

export interface ServiceApiProcessStep {
  title: string;
  description?: string;
  image?: string;
}

/** Bốn trang dịch vụ con: Turnkey, Thiết kế, Thi công, Cải tạo. */
export interface ServiceDetailContent {
  hero: {
    title: string;
    subtitle: string;
    /** Các ảnh hero admin sửa được; khóa khác nhau theo từng trang. */
    images?: Record<string, string | undefined>;
  };
  featuredProjects: ServiceApiIntro & { items: ServiceApiProject[] };
  solutions: ServiceApiIntro & { items: ServiceApiSolution[] };
  process: ServiceApiIntro & { items: ServiceApiProcessStep[] };
  contactForm: ServiceApiContactForm;
}

/** Trang `/services` (tổng quan). */
export interface ServicesOverviewContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    backgroundImage?: string;
    cards: { image: string }[];
  };
  serviceList: {
    tabLabel: string;
    title: string;
    tagline?: string;
    description?: string;
    image?: string;
  }[];
  process: {
    title: string;
    description: string;
    items: { title: string; description: string; imageOpen?: string }[];
  };
  faq: {
    title: string;
    description: string;
    photo?: string;
    items: { question: string; answer: string }[];
  };
  contactForm: ServiceApiContactForm;
}
