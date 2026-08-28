import { navigation, services } from "@/shared/constants/site";
import { projects } from "@/features/projects/data/project-details";
import type { AdminFieldOption } from "@/features/admin/lib/types/crud";

/**
 * Danh sách địa chỉ có thật trên website, dùng làm lựa chọn cho mọi ô liên kết
 * trong admin. Admin chọn từ đây thay vì gõ tay để không bao giờ trỏ nhầm vào
 * một trang 404.
 *
 * Sinh thẳng từ `shared/constants/site.ts` và dữ liệu dự án, nên thêm trang mới là danh
 * sách tự có thêm — không phải khai lại ở đây. Riêng liên kết ra ngoài
 * (Facebook, Google Maps...) vẫn để admin tự nhập vì không thể liệt kê trước.
 */

/** "HỒ SƠ NĂNG LỰC" → "Hồ sơ năng lực" cho dễ đọc trong danh sách chọn. */
function toSentenceCase(label: string) {
  const lowered = label.toLocaleLowerCase("vi");
  return lowered.charAt(0).toLocaleUpperCase("vi") + lowered.slice(1);
}

function option(href: string, name: string): AdminFieldOption {
  return { value: href, label: `${name} (${href})` };
}

const pageLinks: AdminFieldOption[] = navigation.flatMap((item) => {
  const parent = option(item.href, toSentenceCase(item.label));
  if (!item.href.startsWith("/services")) return [parent];
  return [
    parent,
    ...services.map((service) =>
      option(service.href, `Dịch vụ · ${service.label}`),
    ),
  ];
});

const projectLinks: AdminFieldOption[] = Object.values(projects).map((project) =>
  option(`/projects/${project.slug}`, `Dự án · ${project.displayName}`),
);

/**
 * Neo trong cùng một trang. Chỉ liệt kê những `id` thật sự có trên site —
 * `#contact-form` là section biểu mẫu liên hệ cuối trang, còn
 * `#career-openings-title` là danh sách vị trí ở trang Tuyển dụng.
 */
const anchorLinks: AdminFieldOption[] = [
  option("#contact-form", "Trong trang · Biểu mẫu liên hệ"),
  option("#career-openings-title", "Trong trang · Danh sách vị trí tuyển dụng"),
];

export const siteLinkOptions: AdminFieldOption[] = [
  ...pageLinks,
  // Trang Liên hệ không nằm trên thanh header nên phải thêm tay.
  option("/contact", "Liên hệ"),
  ...projectLinks,
  ...anchorLinks,
].filter(
  (item, index, all) =>
    all.findIndex((other) => other.value === item.value) === index,
);
