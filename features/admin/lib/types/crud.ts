import type { Priority, ViewState } from "@/features/admin/lib/types/content";

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

/** Một lựa chọn của ô `select`: lưu `value`, hiển thị `label` cho dễ đọc. */
export interface AdminFieldOption {
  value: string;
  label: string;
}

export interface AdminFieldConfig {
  key: string;
  label: string;
  type: AdminFieldType;
  /**
   * Bề ngang của ô trong lưới 12 cột của trình biên tập, chỉ định khi muốn ô
   * nằm đúng chỗ như trên website. Bỏ trống thì tự tính theo loại ô
   * (`features/admin/lib/editor-layout.ts`).
   */
  span?: number;
  editable?: boolean;
  placeholder?: string;
  description?: string;
  required?: boolean;
  min?: number;
  maxLength?: number;
  /** Số dòng textarea hiển thị sẵn trong editor. */
  rows?: number;
  /**
   * Giới hạn số dòng thật sự được lưu trong textarea. Khi đạt giới hạn, Enter
   * thêm hoặc paste nội dung nhiều dòng sẽ bị cắt ở dòng cuối cho phép.
   */
  maxLines?: number;
  options?: Array<string | AdminFieldOption>;
  altKey?: string;
  ratio?: string;
  recommendedSize?: string;
  listMode?: "fixed" | "dynamic";
  /**
   * `inline`: các dòng của ô danh sách xếp ngang cạnh nhau thay vì chồng dọc —
   * dùng cho những chỗ website cũng bày ngang, ví dụ thanh 5 bước của công cụ
   * ước tính hay dãy lựa chọn trong từng bước.
   */
  listLayout?: "rows" | "inline";
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

/**
 * Bố cục biên tập mô phỏng bố cục thật của section trên website, để admin nhìn
 * ra ngay mình đang sửa thành phần nào nằm ở đâu.
 */
export interface AdminEditorRecordLayout {
  /**
   * Gom một ô của mọi bản ghi lên thành một hàng chung ở đầu — dùng cho những
   * chỗ website xếp ngang cạnh nhau, ví dụ thanh chuyển 4 dịch vụ.
   */
  sharedRowField?: string;
  /** Tiêu đề của hàng chung đó. */
  sharedRowLabel?: string;
  /**
   * Website đặt ảnh một bên, chữ bên kia — admin xếp y vậy. `alternate` dành
   * cho những section đảo bên qua từng thẻ (thẻ lẻ ảnh trái, thẻ chẵn ảnh phải).
   */
  mediaSide?: "left" | "right" | "alternate";
  /**
   * Bề ngang cột ảnh so với cột chữ, theo đúng tỉ lệ ngoài site.
   * `twoFifths` dành cho hero cần media 40% và nội dung 60%; `fortyFive` dành
   * cho hero cần media 45% và nội dung 55%.
   */
  mediaWidth?: "half" | "third" | "twoFifths" | "fortyFive";
  /**
   * Cỡ ảnh xem trước của cột ảnh. Bỏ trống là tem nhỏ như mọi ô ảnh khác.
   * - `large`: tem to gấp đôi, vẫn cao cố định.
   * - `wide`: ảnh rộng gần hết cột, hàng nút xuống dưới ảnh.
   * - `fill`: ảnh cao bằng cột chữ và cột chữ xếp lưới 12 cột — dành cho section
   *   nhiều ô chữ, nếu không hai cột lệch nhau cả gang tay.
   */
  mediaPreview?: "large" | "wide" | "fill";
  /**
   * Vị trí ô văn bản thay thế của ảnh khi dùng bố cục ảnh–chữ.
   * Mặc định nằm cùng cột chữ; `media` giữ alt text ngay dưới ảnh để các editor
   * kiểu danh sách dự án nhìn thành một cụm media hoàn chỉnh.
   */
  mediaAltPlacement?: "media" | "text";
  /**
   * Số thẻ xếp trên một hàng — dùng cho section mà website bày các mục cạnh
   * nhau thay vì chồng dọc (quy trình 2 cột, 5 cột…).
   */
  recordsPerRow?: number;
  /**
   * Cách trình bày từng bản ghi khi đã chia nhiều cột.
   * - `card`: có viền/bo góc như một thẻ độc lập (mặc định).
   * - `flat`: giữ cảm giác danh sách, chỉ thu nhỏ thành nhiều cột, tránh box lồng box.
   */
  recordStyle?: "card" | "flat";
  /** Ẩn dòng giải thích số mục cố định khi chính header/card đã đủ rõ. */
  hideFixedItemHint?: boolean;
  /**
   * Chia ô của một section thành hai cột theo đúng vị trí trên website, liệt kê
   * tên ô cho từng bên.
   */
  splitColumns?: { left: string[]; right: string[] };
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
  editorLayout?: AdminEditorRecordLayout;
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
