import type {
  AdminEditorSectionConfig,
  AdminFieldConfig,
  AdminResourceConfig,
} from "@/lib/admin/types/crud";

export const LINE_BREAK_EDITOR_HINT =
  "Mẹo: nhấn Enter trong bất kỳ ô nào để xuống dòng — website sẽ hiển thị đúng chỗ ngắt dòng đó.";

/**
 * Nhóm trang đã được tinh chỉnh giao diện chỉnh sửa: 5 trang Dịch vụ, Báo giá
 * và Hồ sơ năng lực. Các module còn lại giữ nguyên cách hiển thị cũ.
 */
export function isRefinedEditorResource(config: AdminResourceConfig) {
  return (
    config.module === "services" ||
    config.module === "quotation" ||
    config.key === "settings/capability-profile"
  );
}

const HOME_STYLE_EDITOR_MODULES = [
  "home",
  "about",
  "projects",
  "news",
  "recruitment",
  "contacts",
];

const HOME_STYLE_EDITOR_KEYS = [
  "settings/branding",
  "settings/navigation",
  "settings/footer",
  "settings/locations",
  "settings/company",
];

/**
 * Các trang dùng bố cục biên tập giống trang chủ: mỗi field xếp dọc hết chiều
 * ngang, tiêu đề mục in đậm. Nhóm trang đã tinh chỉnh (Dịch vụ, Báo giá, Hồ sơ
 * năng lực) dùng chung bố cục này để toàn bộ admin đồng bộ.
 */
export function isHomeStyleEditor(config: AdminResourceConfig) {
  return (
    HOME_STYLE_EDITOR_MODULES.includes(config.module) ||
    HOME_STYLE_EDITOR_KEYS.includes(config.key) ||
    isRefinedEditorResource(config)
  );
}

const HIDDEN_EDITOR_FIELD_KEYS = new Set(["order"]);

export function isAdminFieldEditable(field: AdminFieldConfig) {
  return field.editable !== false && !HIDDEN_EDITOR_FIELD_KEYS.has(field.key);
}

export function getEditableAdminSections(sections: AdminEditorSectionConfig[]) {
  return sections
    .map((section) => ({
      ...section,
      fields: section.fields.filter(isAdminFieldEditable),
    }))
    .filter((section) => section.fields.length > 0);
}
