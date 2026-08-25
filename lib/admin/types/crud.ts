import type { Priority, ViewState } from "@/lib/admin/types/content";

export type AdminModuleKey =
  | "home"
  | "about"
  | "services"
  | "projects"
  | "news"
  | "recruitment"
  | "quotation"
  | "contacts"
  | "seo"
  | "settings";

export type AdminFieldValue = string | number | boolean | string[];

export interface AdminCrudRecord {
  id: string;
  [key: string]: AdminFieldValue;
}

export type AdminFieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "url"
  | "image"
  | "boolean"
  | "select"
  | "list";

export interface AdminFieldConfig {
  key: string;
  label: string;
  type: AdminFieldType;
  editable?: boolean;
  placeholder?: string;
  description?: string;
  required?: boolean;
  min?: number;
  maxLength?: number;
  options?: string[];
  altKey?: string;
  ratio?: string;
  recommendedSize?: string;
  listMode?: "fixed" | "dynamic";
  disabled?: boolean;
  disabledReason?: string;
}

export interface AdminEditorSectionConfig {
  id: string;
  title: string;
  description?: string;
  fields: AdminFieldConfig[];
}

export interface AdminSectionSettingsConfig {
  key: string;
  title: string;
  description?: string;
  fields: AdminFieldConfig[];
  initialRecord: AdminCrudRecord;
  previewTitleField: string;
}

export interface AdminModuleNavigationItem {
  label: string;
  href: string;
}

export interface AdminModuleNavigationGroup {
  label: string;
  items: AdminModuleNavigationItem[];
}

export interface AdminNavigationContext {
  primary: AdminModuleNavigationGroup;
  secondary?: AdminModuleNavigationGroup;
}

export interface AdminResourceConfig {
  key: string;
  module: AdminModuleKey;
  moduleLabel: string;
  moduleHref: string;
  path: string;
  title: string;
  navigationLabel?: string;
  singular: string;
  description: string;
  priority: Priority;
  kind: "collection" | "singleton";
  collectionMode?: "fixed" | "dynamic";
  titleField: string;
  previewField?: string;
  orderField?: string;
  enabledField?: string;
  listMode?: "default" | "image-manager";
  itemLabel?: string;
  companionResourceKey?: string;
  sections: AdminEditorSectionConfig[];
  initialRecords: AdminCrudRecord[];
}

export interface AdminResourceGroupConfig {
  key: string;
  title: string;
  description: string;
  items: Array<{
    title: string;
    description: string;
    priority: Priority;
    count?: string;
    href: string;
  }>;
}

export interface AdminCrudState {
  records: Record<string, AdminCrudRecord[]>;
  viewStates: Record<string, ViewState>;
}

export interface AdminValidationErrors {
  [field: string]: string;
}
