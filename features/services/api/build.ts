import type {
  ServiceApiContactForm,
  ServiceApiProject,
  ServiceApiSolution,
} from "@/features/services/api/types";
import type { FeaturedProject } from "@/features/services/components/ProjectCarousel";
import type { SolutionCard } from "@/features/services/components/SolutionCards";
import { contactFormChrome } from "@/features/services/data/contact-form-chrome";
import type { ContactFormContent } from "@/shared/components/contact-form-content";

/**
 * Dựng dữ liệu hiển thị của 5 trang dịch vụ TỪ những gì backend trả về. Không có
 * dữ liệu tĩnh nào thay thế nội dung: chữ, ảnh, số phần tử đều đến từ API. Phần
 * "layout" chỉ là cách trình bày (khung ảnh, kích thước nút) không thuộc về nội dung.
 */

/** Số thứ tự hiển thị "01", "02"... */
export const stepNumber = (index: number) => String(index + 1).padStart(2, "0");

export type ProjectLayout = Pick<FeaturedProject, "fit" | "zoom">;

export function buildProjects(
  api: readonly ServiceApiProject[] | undefined,
  layout: readonly ProjectLayout[] = [],
): FeaturedProject[] {
  return (api ?? []).flatMap((item, index) =>
    item.image
      ? [{ id: String(index + 1), title: item.title, tag: item.tag ?? "", image: item.image, ...layout[index] }]
      : [],
  );
}

export type SolutionCardLayout = Pick<
  SolutionCard,
  | "cta"
  | "ctaImage"
  | "ctaImageWidth"
  | "ctaImageHeight"
  | "ctaImageMobile"
  | "ctaImageMobileWidth"
  | "ctaImageMobileHeight"
>;

export function buildSolutionCards(
  api: readonly ServiceApiSolution[] | undefined,
  layout: readonly SolutionCardLayout[],
): SolutionCard[] {
  return (api ?? []).flatMap((card, index) => {
    const cardLayout = layout[index] ?? layout[layout.length - 1];
    if (!card.image || !cardLayout) return [];
    return [
      {
        number: stepNumber(index),
        titlePrefix: card.titlePrefix,
        titleCategory: card.titleCategory,
        tagline: card.tagline ?? "",
        description: card.description ?? "",
        checklist: card.checklist,
        checklistLabel: card.checklistLabel,
        image: card.image,
        ...cardLayout,
      },
    ];
  });
}

/** Tiêu đề và nội dung do admin quản lý; nhãn ô nhập/thông báo lỗi là chữ cố định của form. */
export function buildContactForm(api: ServiceApiContactForm): ContactFormContent {
  return {
    ...contactFormChrome,
    title: api.title,
    description: api.description,
    submitLabel: api.submitLabel,
    successMessage: api.successMessage,
  };
}

/** Tiêu đề bước quy trình có dạng "dòng 1\ndòng 2" (dòng 2 có thể trống). */
export function splitStepTitle(title: string) {
  const [first, ...rest] = title.replace(/\r\n/g, "\n").split("\n");
  return { title: first, subtitle: rest.join(" ") };
}
