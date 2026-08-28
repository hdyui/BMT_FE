import type {
  AdminEditorSectionConfig,
  AdminFieldConfig,
  AdminResourceConfig,
} from "@/features/admin/lib/types/crud";

export const LINE_BREAK_EDITOR_HINT =
  "Mẹo: những ô cao nhiều dòng nhận phím Enter để xuống dòng — website hiển thị đúng chỗ ngắt đó. Ô một dòng là nội dung website luôn in liền một hàng.";

const REFINED_CONTENT_MODULES = new Set([
  "home",
  "about",
  "projects",
  "news",
  "recruitment",
  "contacts",
]);

/**
 * Nhóm trang đã được tinh chỉnh giao diện chỉnh sửa theo bố cục thật của site.
 * Collection động (Dự án/Tin tức/Tuyển dụng trong Danh mục) cố ý không bật
 * chế độ này vì chúng vẫn phải cho phép thêm/xóa bản ghi.
 */
export function isRefinedEditorResource(config: AdminResourceConfig) {
  return (
    config.module === "services" ||
    config.module === "quotation" ||
    config.module === "settings" ||
    config.key.startsWith("settings/capability-profile") ||
    (REFINED_CONTENT_MODULES.has(config.module) && config.collectionMode !== "dynamic")
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
  "settings/partners",
  "settings/footer",
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
