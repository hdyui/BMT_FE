"use client";

import type { ReactNode } from "react";

import { EditorField } from "@/features/admin/components/editor/EditorField";
import { getDynamicCollectionUiKind } from "@/features/admin/lib/dynamic-collection-ui";
import { getEditableAdminSections } from "@/features/admin/lib/editor-field-visibility";
import type {
  AdminCrudRecord,
  AdminFieldConfig,
  AdminFieldValue,
  AdminResourceConfig,
  AdminValidationErrors,
} from "@/features/admin/lib/types/crud";

export function DynamicCollectionEditorLayout({
  config,
  draft,
  dirtyKeys,
  errors,
  onChange,
}: {
  config: AdminResourceConfig;
  draft: AdminCrudRecord;
  dirtyKeys: Set<string>;
  errors: AdminValidationErrors;
  onChange: (key: string, value: AdminFieldValue) => void;
}) {
  const kind = getDynamicCollectionUiKind(config.key);
  if (!kind) return null;

  const fields = getEditableAdminSections(config.sections).flatMap(
    (section) => section.fields,
  );
  const fieldMap = new Map(fields.map((field) => [field.key, field]));

  function renderField(
    key: string,
    options: { imageSize?: "large" | "wide" | "fill"; label?: string } = {},
  ) {
    const field = fieldMap.get(key);
    if (!field) return null;
    const renderedField: AdminFieldConfig = options.label
      ? { ...field, label: options.label }
      : field;

    return (
      <EditorField
        field={renderedField}
        imageSize={options.imageSize}
        value={draft[field.key]}
        error={errors[field.key]}
        dirty={dirtyKeys.has(field.key)}
        altValue={field.altKey ? draft[field.altKey] : undefined}
        altDirty={Boolean(field.altKey && dirtyKeys.has(field.altKey))}
        contentEditorStyle
        onChange={(value) => onChange(field.key, value)}
        onAltChange={
          field.altKey ? (value) => onChange(field.altKey!, value) : undefined
        }
      />
    );
  }

  if (kind === "projects") {
    return (
      <VisualEditorSection
        title="Thẻ dự án trên website"
        description="Ảnh chiếm phần lớn thẻ; tên dự án nằm ở chân card. Danh mục quyết định dự án xuất hiện trong tab nào trên trang Dự án."
      >
        <div className="grid items-start gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(320px,.95fr)_minmax(0,1.05fr)] lg:gap-8">
          <div>{renderField("thumbnail", { imageSize: "wide", label: "Ảnh thẻ dự án" })}</div>
          <div className="grid content-start gap-5 rounded-2xl border bg-muted/15 p-4 sm:p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Phần thông tin của card
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Ngoài website, tên dự án nằm trên dải trắng ở chân ảnh; danh mục dùng cho thanh lọc phía trên.
              </p>
            </div>
            {renderField("title", { label: "Tên dự án" })}
            {renderField("category", { label: "Danh mục hiển thị" })}
            {renderField("href", { label: "Trang chi tiết khi bấm vào card" })}
          </div>
        </div>
      </VisualEditorSection>
    );
  }

  if (kind === "news") {
    return (
      <div className="grid gap-5">
        <VisualEditorSection
          title="Hàng tin tức trên website"
          description="Bản desktop hiển thị ảnh bên trái, tiêu đề và mô tả bên phải. Ảnh mobile được giữ thành một slot riêng ngay dưới ảnh desktop để dễ đối chiếu."
        >
          <div className="grid items-start gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(300px,.78fr)_minmax(0,1.22fr)] lg:gap-8">
            <div className="grid gap-5">
              {renderField("desktopImage", { imageSize: "wide", label: "Ảnh danh sách trên máy tính" })}
              {renderField("mobileImage", { imageSize: "large", label: "Ảnh danh sách trên điện thoại" })}
            </div>
            <div className="grid content-start gap-5 rounded-2xl border bg-muted/15 p-4 sm:p-5">
              {renderField("title", { label: "Tiêu đề bài viết" })}
              {renderField("excerpt", { label: "Mô tả ngắn dưới tiêu đề" })}
              {renderField("href", { label: "Trang mở khi bấm Xem chi tiết" })}
            </div>
          </div>
        </VisualEditorSection>

        <VisualEditorSection
          title="Nội dung bài viết"
          description="Phần này không xuất hiện trong hàng danh sách; người đọc thấy nội dung sau khi mở bài viết."
        >
          <div className="p-5 sm:p-6">{renderField("body")}</div>
        </VisualEditorSection>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <VisualEditorSection
        title="Vị trí tuyển dụng trên website"
        description="Giữ đúng nhịp ngoài trang Tuyển dụng: ảnh bên trái; tiêu đề, 4 thông tin nhanh và mô tả ngắn bên phải."
      >
        <div className="grid items-start gap-6 p-5 sm:p-6 md:grid-cols-[34%_minmax(0,1fr)] lg:gap-8">
          <div>{renderField("image", { imageSize: "wide", label: "Ảnh vị trí tuyển dụng" })}</div>
          <div className="grid content-start gap-5">
            {renderField("title", { label: "Tên vị trí" })}
            <div className="grid gap-4 sm:grid-cols-2">
              {renderField("department", { label: "Phòng ban" })}
              {renderField("location", { label: "Địa điểm" })}
              {renderField("schedule", { label: "Lịch làm việc" })}
              {renderField("compensation", { label: "Thu nhập" })}
            </div>
            {renderField("summary", { label: "Mô tả ngắn" })}
          </div>
        </div>
      </VisualEditorSection>

      <VisualEditorSection
        title="Chi tiết khi người dùng bấm Xem chi tiết"
        description="Hai danh sách này nằm trong phần mở rộng của từng vị trí tuyển dụng."
      >
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-muted/10 p-4">{renderField("responsibilities")}</div>
          <div className="rounded-2xl border bg-muted/10 p-4">{renderField("benefits")}</div>
        </div>
      </VisualEditorSection>
    </div>
  );
}

function VisualEditorSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-[0_12px_38px_rgb(36_33_34/.035)]">
      <div className="border-b px-5 py-4 sm:px-6">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1 max-w-4xl text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}