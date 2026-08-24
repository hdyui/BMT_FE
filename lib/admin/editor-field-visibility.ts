import type { AdminEditorSectionConfig, AdminFieldConfig } from "@/lib/admin/types/crud";

const HIDDEN_EDITOR_FIELD_KEYS = new Set(["order", "ctaHref"]);

export function isAdminFieldEditable(field: AdminFieldConfig) {
  return !HIDDEN_EDITOR_FIELD_KEYS.has(field.key);
}

export function getEditableAdminSections(sections: AdminEditorSectionConfig[]) {
  return sections
    .map((section) => ({
      ...section,
      fields: section.fields.filter(isAdminFieldEditable),
    }))
    .filter((section) => section.fields.length > 0);
}
