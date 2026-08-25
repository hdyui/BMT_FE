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
