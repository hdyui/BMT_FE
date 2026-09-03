"use client";

import { Fragment, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminBreadcrumb } from "@/features/admin/components/editor/AdminBreadcrumb";
import { EditorField } from "@/features/admin/components/editor/EditorField";
import { EditorSplitColumns } from "@/features/admin/components/editor/EditorSplitColumns";
import {
  EditorTopActions,
  StickyEditorActions,
  useEditorActionsVisibility,
} from "@/features/admin/components/editor/EditorTopActions";
import {
  confirmEditorSave,
  useUnsavedChangesGuard,
} from "@/features/admin/components/editor/unsaved-changes";
import { useAdminCrud } from "@/features/admin/components/editor/AdminCrudProvider";
import { getResourceBreadcrumb } from "@/features/admin/lib/content-navigation";
import {
  EDITOR_GRID_CLASS,
  editorImagePreviewSize,
  editorSpanClass,
  packEditorFields,
} from "@/features/admin/lib/editor-layout";
import {
  getEditableAdminSections,
  isHomeStyleEditor,
  isRefinedEditorResource,
} from "@/features/admin/lib/editor-field-visibility";
import type {
  AdminCrudRecord,
  AdminFieldConfig,
  AdminFieldValue,
  AdminResourceConfig,
} from "@/features/admin/lib/types/crud";
import { Button } from "@/features/admin/components/ui/button";
import { cn } from "@/shared/lib/utils";

type DraftMap = Record<string, AdminCrudRecord[]>;

interface HistoryEntry {
  resourceKey: string;
  recordId: string;
  fieldKey: string;
  previous: AdminFieldValue;
}

export function UnifiedResourceEditorPage({
  config,
  companionConfig,
}: {
  config: AdminResourceConfig;
  companionConfig?: AdminResourceConfig;
}) {
  const { getRecords, reorderRecords } = useAdminCrud();
  const editableConfigs = useMemo(
    () => (companionConfig ? [companionConfig, config] : [config]),
    [companionConfig, config],
  );
  const initialRecords = useMemo(
    () =>
      Object.fromEntries(
        editableConfigs.map((item) => [item.key, structuredClone(getRecords(item.key))]),
      ) as DraftMap,
    [editableConfigs, getRecords],
  );
  const [drafts, setDrafts] = useState<DraftMap>(initialRecords);
  const [savedSnapshot, setSavedSnapshot] = useState<DraftMap>(initialRecords);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const dirtyKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const itemConfig of editableConfigs) {
      for (const record of drafts[itemConfig.key] ?? []) {
        const savedRecord = (savedSnapshot[itemConfig.key] ?? []).find((item) => item.id === record.id);
        for (const field of getEditableAdminSections(itemConfig.sections).flatMap((section) => section.fields)) {
          for (const fieldKey of field.altKey ? [field.key, field.altKey] : [field.key]) {
            if (!sameValue(record[fieldKey], savedRecord?.[fieldKey])) {
              keys.add(fieldIdentity(itemConfig.key, record.id, fieldKey));
            }
          }
        }
      }
    }
    return keys;
  }, [drafts, editableConfigs, savedSnapshot]);
  const dirty = dirtyKeys.size > 0;

  function updateField(
    resourceKey: string,
    recordId: string,
    fieldKey: string,
    value: AdminFieldValue,
  ) {
    const record = drafts[resourceKey]?.find((item) => item.id === recordId);
    const previous = record?.[fieldKey] ?? "";
    if (sameValue(previous, value)) return;

    const next = replaceRecordField(drafts, resourceKey, recordId, fieldKey, value);
    setDrafts(next);
    setHistory((current) => [
      ...current,
      { resourceKey, recordId, fieldKey, previous: cloneValue(previous) },
    ]);
    setErrors((current) => {
      const identity = fieldIdentity(resourceKey, recordId, fieldKey);
      if (!current[identity]) return current;
      const nextErrors = { ...current };
      delete nextErrors[identity];
      return nextErrors;
    });
  }

  function undoLast() {
    const action = history.at(-1);
    if (!action) return;
    const next = replaceRecordField(
      drafts,
      action.resourceKey,
      action.recordId,
      action.fieldKey,
      cloneValue(action.previous),
    );
    setDrafts(next);
    setHistory((current) => (sameDrafts(next, savedSnapshot) ? [] : current.slice(0, -1)));
  }

  function undoAll() {
    setDrafts(structuredClone(savedSnapshot));
    setHistory([]);
    setErrors({});
  }

  async function saveAll() {
    const nextErrors = validateDrafts(editableConfigs, drafts);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Vui lòng kiểm tra các nội dung chưa hợp lệ", {
        description: `${Object.keys(nextErrors).length} nội dung cần được cập nhật.`,
      });
      return false;
    }

    setSaving(true);
    try {
      for (const itemConfig of editableConfigs) {
        await reorderRecords(itemConfig.key, drafts[itemConfig.key] ?? []);
      }
      setSavedSnapshot(structuredClone(drafts));
      setHistory([]);
      toast.success("Đã lưu toàn bộ thay đổi");
      return true;
    } finally {
      setSaving(false);
    }
  }

  useUnsavedChangesGuard({ dirty, dirtyCount: dirtyKeys.size, save: saveAll });
  const { topActionsRef, topActionsVisible } = useEditorActionsVisibility();
  const homeFeaturedNewsEditor =
    config.key === "home/featured-news" &&
    companionConfig?.key === "home/news-section-content";
  const homeFeaturedServicesEditor =
    config.key === "home/featured-services" &&
    companionConfig?.key === "home/services-section-content";

  return (
    <div className="mx-auto w-full max-w-[1480px] p-4 pb-8 sm:p-6 lg:p-8">
      <AdminBreadcrumb
        items={[...getResourceBreadcrumb(config), { label: config.title }]}
      />
      <div className="mt-4">
        <AdminPageHeader
          title={config.title}
          actions={
            <EditorTopActions
              ref={topActionsRef}
              dirty={dirty}
              dirtyCount={dirtyKeys.size}
              saving={saving}
              onUndo={undoLast}
              onUndoAll={undoAll}
              onSave={() => confirmEditorSave(dirtyKeys.size, saveAll)}
            />
          }
        />
      </div>

      {homeFeaturedServicesEditor && companionConfig ? (
        <HomeFeaturedServicesEditor
          config={config}
          companionConfig={companionConfig}
          records={drafts[config.key] ?? []}
          companionRecords={drafts[companionConfig.key] ?? []}
          dirtyKeys={dirtyKeys}
          errors={errors}
          onChange={updateField}
        />
      ) : homeFeaturedNewsEditor && companionConfig ? (
        <HomeFeaturedNewsEditor
          config={config}
          companionConfig={companionConfig}
          records={drafts[config.key] ?? []}
          companionRecords={drafts[companionConfig.key] ?? []}
          dirtyKeys={dirtyKeys}
          errors={errors}
          onChange={updateField}
        />
      ) : (
        <section className="mt-6 overflow-hidden rounded-2xl border bg-card">
          <div className="divide-y">
            {editableConfigs.map((itemConfig) => (
              <ResourceEditorGroup
                config={itemConfig}
                records={drafts[itemConfig.key] ?? []}
                dirtyKeys={dirtyKeys}
                errors={errors}
                onChange={updateField}
                key={itemConfig.key}
              />
            ))}
          </div>
        </section>
      )}

      <StickyEditorActions
        hidden={topActionsVisible}
        dirty={dirty}
        dirtyCount={dirtyKeys.size}
        saving={saving}
        onUndo={undoLast}
        onUndoAll={undoAll}
        onSave={() => confirmEditorSave(dirtyKeys.size, saveAll)}
      />
    </div>
  );
}

function HomeFeaturedServicesEditor({
  config,
  companionConfig,
  records,
  companionRecords,
  dirtyKeys,
  errors,
  onChange,
}: {
  config: AdminResourceConfig;
  companionConfig: AdminResourceConfig;
  records: AdminCrudRecord[];
  companionRecords: AdminCrudRecord[];
  dirtyKeys: Set<string>;
  errors: Record<string, string>;
  onChange: (resourceKey: string, recordId: string, fieldKey: string, value: AdminFieldValue) => void;
}) {
  const companionRecord = companionRecords[0];
  const companionFields = getEditableAdminSections(companionConfig.sections).flatMap(
    (section) => section.fields,
  );
  const serviceFields = getEditableAdminSections(config.sections).flatMap(
    (section) => section.fields,
  );

  function fieldByKey(fields: AdminFieldConfig[], key: string) {
    return fields.find((field) => field.key === key);
  }

  const desktopImageField = fieldByKey(serviceFields, "desktopImage");
  const serviceImageAltField: AdminFieldConfig | undefined = desktopImageField?.altKey
    ? {
        key: desktopImageField.altKey,
        label: "Văn bản thay thế",
        type: "text",
      }
    : undefined;

  function renderField(
    resourceConfig: AdminResourceConfig,
    record: AdminCrudRecord,
    field: AdminFieldConfig | undefined,
    options: {
      imageSize?: "large" | "wide" | "row" | "fill";
      labelOverride?: string;
      hideAlt?: boolean;
    } = {},
  ) {
    if (!field) return null;
    const identity = fieldIdentity(resourceConfig.key, record.id, field.key);
    return (
      <EditorField
        field={field}
        value={record[field.key]}
        imageSize={options.imageSize}
        labelOverride={options.labelOverride}
        error={errors[identity]}
        dirty={isFieldDirty(resourceConfig, record, field.key, dirtyKeys)}
        altValue={field.altKey ? record[field.altKey] : undefined}
        altDirty={Boolean(
          field.altKey && isFieldDirty(resourceConfig, record, field.altKey, dirtyKeys),
        )}
        contentEditorStyle
        lockItemCount
        hideAlt={options.hideAlt}
        onChange={(value) => onChange(resourceConfig.key, record.id, field.key, value)}
        onAltChange={
          field.altKey
            ? (value) => onChange(resourceConfig.key, record.id, field.altKey!, value)
            : undefined
        }
      />
    );
  }

  if (!companionRecord) {
    return (
      <section className="mt-6 rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        Chưa có nội dung Dịch vụ nổi bật để chỉnh sửa.
      </section>
    );
  }

  return (
    <div className="mt-6 grid gap-6">
      <section className="rounded-2xl border bg-card p-5 shadow-[0_12px_38px_rgb(36_33_34/.035)] sm:p-6">
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-4">
            {renderField(
              companionConfig,
              companionRecord,
              fieldByKey(companionFields, "title"),
            )}
          </div>
          <div className="lg:col-span-8">
            {renderField(
              companionConfig,
              companionRecord,
              fieldByKey(companionFields, "description"),
            )}
          </div>
        </div>
      </section>

      {records.length === 0 ? (
        <section className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
          Chưa có dịch vụ nổi bật để chỉnh sửa.
        </section>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {records.map((record, recordIndex) => (
            <article
              className="rounded-2xl border bg-card p-5 shadow-[0_12px_38px_rgb(36_33_34/.035)] sm:p-6"
              key={record.id}
            >
              <h3 className="mb-4 text-lg font-bold">
                {String(recordIndex + 1).padStart(2, "0")}. {String(record.title ?? "")}
              </h3>
              <div className="grid min-w-0 gap-4 md:grid-cols-12 lg:gap-5">
                <div className="min-w-0 md:col-span-8">
                  {renderField(config, record, desktopImageField, {
                    imageSize: "row",
                    labelOverride: "Ảnh trên máy tính",
                    hideAlt: true,
                  })}
                </div>
                <div className="min-w-0 md:col-span-4">
                  {renderField(
                    config,
                    record,
                    fieldByKey(serviceFields, "mobileImage"),
                    { imageSize: "row", labelOverride: "Ảnh trên điện thoại" },
                  )}
                </div>
              </div>
              <div className="mt-5 grid min-w-0 gap-4 border-t pt-5">
                {renderField(config, record, fieldByKey(serviceFields, "title"))}
                {renderField(config, record, fieldByKey(serviceFields, "description"))}
                {renderField(config, record, serviceImageAltField)}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function HomeFeaturedNewsEditor({
  config,
  companionConfig,
  records,
  companionRecords,
  dirtyKeys,
  errors,
  onChange,
}: {
  config: AdminResourceConfig;
  companionConfig: AdminResourceConfig;
  records: AdminCrudRecord[];
  companionRecords: AdminCrudRecord[];
  dirtyKeys: Set<string>;
  errors: Record<string, string>;
  onChange: (resourceKey: string, recordId: string, fieldKey: string, value: AdminFieldValue) => void;
}) {
  const companionRecord = companionRecords[0];
  const companionFields = getEditableAdminSections(companionConfig.sections).flatMap(
    (section) => section.fields,
  );
  const newsFields = getEditableAdminSections(config.sections).flatMap(
    (section) => section.fields,
  );

  function fieldByKey(fields: AdminFieldConfig[], key: string) {
    return fields.find((field) => field.key === key);
  }

  const featuredImageField = fieldByKey(companionFields, "featuredImage");
  const featuredImageAltField: AdminFieldConfig | undefined = featuredImageField?.altKey
    ? {
        key: featuredImageField.altKey,
        label: "Văn bản thay thế",
        type: "text",
      }
    : undefined;
  const newsImageField = fieldByKey(newsFields, "image");
  const newsImageAltField: AdminFieldConfig | undefined = newsImageField?.altKey
    ? {
        key: newsImageField.altKey,
        label: "Văn bản thay thế",
        type: "text",
      }
    : undefined;

  function renderField(
    resourceConfig: AdminResourceConfig,
    record: AdminCrudRecord,
    field: AdminFieldConfig | undefined,
    options: {
      imageSize?: "large" | "wide" | "fill";
      labelOverride?: string;
      hideAlt?: boolean;
    } = {},
  ) {
    if (!field) return null;
    const identity = fieldIdentity(resourceConfig.key, record.id, field.key);
    return (
      <EditorField
        field={field}
        value={record[field.key]}
        imageSize={options.imageSize}
        labelOverride={options.labelOverride}
        error={errors[identity]}
        dirty={isFieldDirty(resourceConfig, record, field.key, dirtyKeys)}
        altValue={field.altKey ? record[field.altKey] : undefined}
        altDirty={Boolean(
          field.altKey && isFieldDirty(resourceConfig, record, field.altKey, dirtyKeys),
        )}
        contentEditorStyle
        lockItemCount
        hideAlt={options.hideAlt}
        onChange={(value) => onChange(resourceConfig.key, record.id, field.key, value)}
        onAltChange={
          field.altKey
            ? (value) => onChange(resourceConfig.key, record.id, field.altKey!, value)
            : undefined
        }
      />
    );
  }

  if (!companionRecord) {
    return (
      <section className="mt-6 rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        Chưa có nội dung Tin nổi bật để chỉnh sửa.
      </section>
    );
  }

  return (
    <div className="mt-6 grid gap-6">
      <section className="rounded-2xl border bg-card p-5 shadow-[0_12px_38px_rgb(36_33_34/.035)] sm:p-6">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {renderField(
              companionConfig,
              companionRecord,
              fieldByKey(companionFields, "title"),
            )}
          </div>
          <div className="lg:col-span-3">
            {renderField(
              companionConfig,
              companionRecord,
              fieldByKey(companionFields, "ctaLabel"),
            )}
          </div>
          <div className="min-w-0 lg:col-span-4">
            {renderField(
              companionConfig,
              companionRecord,
              fieldByKey(companionFields, "ctaHref"),
            )}
          </div>
        </div>
      </section>

      <section className="grid min-w-0 items-start gap-6 rounded-2xl border bg-card p-5 shadow-[0_12px_38px_rgb(36_33_34/.035)] sm:p-6 lg:grid-cols-[minmax(300px,.78fr)_minmax(0,1.22fr)] lg:gap-8">
        <div className="min-w-0">
          {renderField(
            companionConfig,
            companionRecord,
            featuredImageField,
            { imageSize: "wide", labelOverride: "Ảnh tin chính", hideAlt: true },
          )}
        </div>
        <div className="grid min-w-0 content-start gap-5">
          {renderField(
            companionConfig,
            companionRecord,
            fieldByKey(companionFields, "featuredTitle"),
            { labelOverride: "Tiêu đề tin chính" },
          )}
          {renderField(
            companionConfig,
            companionRecord,
            fieldByKey(companionFields, "featuredExcerpt"),
            { labelOverride: "Mô tả ngắn" },
          )}
          {renderField(
            companionConfig,
            companionRecord,
            fieldByKey(companionFields, "featuredHref"),
            { labelOverride: "Liên kết bài viết" },
          )}
          {renderField(
            companionConfig,
            companionRecord,
            featuredImageAltField,
          )}
        </div>
      </section>

      {records.length === 0 ? (
        <section className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
          Chưa có tin phụ để chỉnh sửa.
        </section>
      ) : (
        <div className="grid gap-6">
          {records.map((record) => (
            <article
              className="grid min-w-0 items-start gap-6 rounded-2xl border bg-card p-5 shadow-[0_12px_38px_rgb(36_33_34/.035)] sm:p-6 lg:grid-cols-[minmax(300px,.78fr)_minmax(0,1.22fr)] lg:gap-8"
              key={record.id}
            >
              <div className="min-w-0">
                {renderField(
                  config,
                  record,
                  newsImageField,
                  { imageSize: "wide", labelOverride: "Ảnh bài viết", hideAlt: true },
                )}
              </div>
              <div className="grid min-w-0 content-start gap-5">
                {renderField(
                  config,
                  record,
                  fieldByKey(newsFields, "title"),
                  { labelOverride: "Tiêu đề bài viết" },
                )}
                {renderField(
                  config,
                  record,
                  fieldByKey(newsFields, "description"),
                  { labelOverride: "Mô tả ngắn" },
                )}
                {renderField(
                  config,
                  record,
                  fieldByKey(newsFields, "href"),
                  { labelOverride: "Liên kết bài viết" },
                )}
                {renderField(config, record, newsImageAltField)}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceEditorGroup({
  config,
  records,
  dirtyKeys,
  errors,
  onChange,
}: {
  config: AdminResourceConfig;
  records: AdminCrudRecord[];
  dirtyKeys: Set<string>;
  errors: Record<string, string>;
  onChange: (resourceKey: string, recordId: string, fieldKey: string, value: AdminFieldValue) => void;
}) {
  const editableFields = getEditableAdminSections(config.sections).flatMap(
    (section) => section.fields,
  );
  const singleColumnContentEditor = isHomeStyleEditor(config);
  const requestedContentEditor = singleColumnContentEditor;
  // Nhóm trang đã tinh chỉnh xếp ô theo lưới 12 cột mô phỏng bố cục website.
  const refinedEditor = isRefinedEditorResource(config);
  const hideFixedLayoutCopy = config.module === "home" || config.module === "about";
  const imageOnlyCollection =
    config.kind === "collection" &&
    editableFields.length === 1 &&
    editableFields[0].type === "image";

  // Bố cục mô phỏng website (xem `AdminEditorRecordLayout`).
  const layout = config.editorLayout;
  const comfortableTwoColumnCards =
    config.key === "settings/partners" || config.key === "settings/navigation";
  const stackRecordFields = config.key === "settings/navigation";
  const sharedField = layout?.sharedRowField
    ? editableFields.find((field) => field.key === layout.sharedRowField)
    : undefined;
  const recordFields = sharedField
    ? editableFields.filter((field) => field.key !== sharedField.key)
    : editableFields;
  const mediaFields = layout?.mediaSide
    ? recordFields.filter((field) => field.type === "image")
    : [];
  // Văn bản thay thế là chữ chứ không phải ảnh, nên tách khỏi ô ảnh và xếp
  // cùng cột chữ — đúng chỗ admin mong đợi tìm thấy nó.
  // Desktop/mobile có thể cố ý dùng chung một `altKey` vì chúng mô tả cùng
  // một nội dung. Chỉ tạo một ô alt cho mỗi key để React không nhận hai child
  // trùng key (ví dụ `imageAlt` ở section Tin tức nổi bật).
  const altFields: AdminFieldConfig[] = Array.from(
    new Map<string, AdminFieldConfig>(
      mediaFields
        .filter((field) => field.altKey)
        .map((field) => [
          field.altKey!,
          {
            key: field.altKey!,
            label: "Văn bản thay thế",
            type: "text",
          },
        ]),
    ).values(),
  );
  const keepAltWithMedia = layout?.mediaAltPlacement === "media";
  const textFields = layout?.mediaSide
    ? [
        ...recordFields.filter((field) => field.type !== "image"),
        ...(keepAltWithMedia ? [] : altFields),
      ]
    : recordFields;
  // Section được chỉ định chia hai cột theo đúng vị trí trên website. Mỗi cột
  // tự xếp dọc nên ô ngắn ở cột này không phải chờ hết chiều cao ô dài ở cột
  // kia — khác hẳn lưới 12 cột vốn cắt theo từng hàng.
  const split = layout?.splitColumns;
  const splitFields = split
    ? {
        left: recordFields.filter((field) => split.left.includes(field.key)),
        right: recordFields.filter((field) => split.right.includes(field.key)),
      }
    : null;
  const useSplit =
    splitFields !== null &&
    splitFields.left.length + splitFields.right.length === recordFields.length;
  // Bố cục ảnh–chữ hoặc hai cột tự chia rồi, không cần thuật toán xếp lưới nữa.
  const packedFields =
    refinedEditor && !layout?.mediaSide && !useSplit
      ? packEditorFields(recordFields)
      : null;
  // Section để ảnh cao bằng cột chữ (`mediaPreview: "fill"`) hoặc có khai báo
  // `span` rõ ràng cho field: cột chữ xếp lưới 12 cột thay vì chồng dọc.
  const packedTextFields =
    layout?.mediaSide &&
    (layout.mediaPreview === "fill" || textFields.some((field) => field.span !== undefined))
      ? packEditorFields(textFields)
      : null;

  if (imageOnlyCollection) {
    const imageField = editableFields[0];

    return records.length === 0 ? (
      <p className="p-6 text-sm text-muted-foreground">Chưa có nội dung để chỉnh sửa.</p>
    ) : (
      <div
        className={cn(
          "grid gap-4 p-4 sm:p-5",
          (refinedEditor || !singleColumnContentEditor) &&
            "sm:grid-cols-2 xl:grid-cols-4",
        )}
      >
        {records.map((record, recordIndex) => {
          const identity = fieldIdentity(config.key, record.id, imageField.key);
          const recordLabel = `${config.itemLabel ?? config.singular} ${String(recordIndex + 1).padStart(2, "0")}`;

          return (
            <EditorField
              field={imageField}
              value={record[imageField.key]}
              labelOverride={recordLabel}
              error={errors[identity]}
              dirty={isFieldDirty(config, record, imageField.key, dirtyKeys)}
              altValue={imageField.altKey ? record[imageField.altKey] : undefined}
              altDirty={Boolean(imageField.altKey && isFieldDirty(config, record, imageField.altKey, dirtyKeys))}
              contentEditorStyle={requestedContentEditor}
              onChange={(value) => onChange(config.key, record.id, imageField.key, value)}
              onAltChange={imageField.altKey ? (value) => onChange(config.key, record.id, imageField.altKey!, value) : undefined}
              key={record.id}
            />
          );
        })}
      </div>
    );
  }

  /** Một ô nhập của đúng một bản ghi. */
  function renderField(
    record: AdminCrudRecord,
    field: AdminFieldConfig,
    options: { imageSize?: "large" | "wide" | "fill" } = {},
  ) {
    const identity = fieldIdentity(config.key, record.id, field.key);
    return (
      <EditorField
        field={field}
        imageSize={options.imageSize}
        imageActionsLayout={config.key === "settings/partners" ? "column" : "row"}
        value={record[field.key]}
        error={errors[identity]}
        dirty={isFieldDirty(config, record, field.key, dirtyKeys)}
        altValue={field.altKey ? record[field.altKey] : undefined}
        altDirty={Boolean(field.altKey && isFieldDirty(config, record, field.altKey, dirtyKeys))}
        contentEditorStyle={requestedContentEditor}
        lockItemCount={refinedEditor}
        hideAlt={Boolean(layout?.mediaSide && !keepAltWithMedia)}
        onChange={(value) => onChange(config.key, record.id, field.key, value)}
        onAltChange={field.altKey ? (value) => onChange(config.key, record.id, field.altKey!, value) : undefined}
      />
    );
  }

  return (
    <>
      {/* Hàng chung: website xếp các nhãn này cạnh nhau nên admin cũng vậy. */}
      {sharedField && records.length > 0 && (
        <div className="border-b bg-muted/20 p-4 sm:p-5">
          <h3
            className={cn(
              "mb-3",
              requestedContentEditor ? "text-lg font-bold" : "font-semibold",
            )}
          >
            {layout?.sharedRowLabel ?? sharedField.label}
          </h3>
          <div
            className={cn(
              "grid gap-4 sm:grid-cols-2",
              SHARED_ROW_COLUMNS[records.length] ?? "lg:grid-cols-4",
            )}
          >
            {records.map((record, recordIndex) =>
              // Nhãn riêng theo số thứ tự để biết ô nào là mục nào trên thanh.
              <div key={record.id}>
                {renderField(record, {
                  ...sharedField,
                  label: `${config.itemLabel ?? config.singular} ${String(recordIndex + 1).padStart(2, "0")}`,
                })}
              </div>,
            )}
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <p className="p-6 text-sm text-muted-foreground">Chưa có nội dung để chỉnh sửa.</p>
      ) : (
        <div
          className={cn(
            // Website bày các mục cạnh nhau thì admin cũng xếp thành lưới thẻ,
            // thay vì danh sách dọc ngăn bằng đường kẻ.
            layout?.recordsPerRow
              ? cn(
                  "grid p-4 sm:p-5",
                  layout.recordStyle === "flat" ? "gap-x-6 gap-y-7" : "gap-4",
                  comfortableTwoColumnCards && layout.recordsPerRow === 2
                    ? "xl:grid-cols-2"
                    : RECORDS_PER_ROW[layout.recordsPerRow] ?? "",
                )
              : "divide-y first:border-t-0",
          )}
        >
          {records.map((record, recordIndex) => {
            const recordDirtyCount = countRecordDirtyFields(config, record, dirtyKeys);
            const recordNumber = String(recordIndex + 1).padStart(2, "0");
            const recordTitle = String(record[config.titleField] ?? "").trim();
            const recordLabel =
              config.kind === "singleton"
                ? config.singular
                // Thẻ dựng theo bố cục website thì kèm luôn tên thật của mục,
                // để admin nhận ra ngay đang sửa dịch vụ nào.
                : layout && recordTitle
                  ? `${recordNumber}. ${recordTitle}`
                  : `${config.itemLabel ?? config.singular} ${recordNumber}`;
            return (
              <article
                className={cn(
                  layout?.recordsPerRow
                    ? layout.recordStyle === "flat"
                      ? "min-w-0 border-b pb-5"
                      : "rounded-xl border p-4"
                    : "p-4 sm:p-5",
                )}
                key={record.id}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <h3
                      className={cn(
                        "flex min-w-0 items-center gap-2",
                        requestedContentEditor ? "text-lg font-bold" : "font-semibold",
                      )}
                    >
                      {recordDirtyCount > 0 && (
                        <span className="size-2 shrink-0 rounded-full bg-brand" aria-label={`${recordDirtyCount} thay đổi chưa lưu`} />
                      )}
                      <span
                        className={
                          layout?.recordsPerRow && layout.recordStyle !== "flat"
                            ? "truncate"
                            : "break-words"
                        }
                      >
                        {recordLabel}
                      </span>
                    </h3>
                  </div>
                  {/* Nhóm trang có layout cố định: bỏ hẳn nút xóa thay vì để nút
                      chết, đổi bằng dòng chữ giải thích số mục là cố định. */}
                  {config.kind === "collection" &&
                    (refinedEditor ? (
                      layout?.recordsPerRow &&
                      layout.recordStyle !== "flat" &&
                      !layout.hideFixedItemHint &&
                      !hideFixedLayoutCopy ? (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        Số mục cố định theo layout website
                      </span>
                      ) : null
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled
                        title={hideFixedLayoutCopy ? undefined : "Số lượng mục được cố định theo layout website"}
                      >
                        <Trash2 /> Xóa
                      </Button>
                    ))}
                </div>
                {layout?.mediaSide ? (
                  <MediaRecordLayout
                    side={layout.mediaSide}
                    width={layout.mediaWidth}
                    index={recordIndex}
                    fill={layout.mediaPreview === "fill"}
                    compact={Boolean(layout.recordsPerRow)}
                    packedText={packedTextFields !== null}
                    media={mediaFields.map((field) => (
                      <Fragment key={field.key}>
                        {renderField(record, field, { imageSize: layout.mediaPreview })}
                      </Fragment>
                    ))}
                    text={(packedTextFields ?? textFields.map((field) => ({ field, span: 0 }))).map(
                      ({ field, span }) =>
                        packedTextFields ? (
                          <div className={editorSpanClass(span)} key={field.key}>
                            {renderField(record, field)}
                          </div>
                        ) : field.key === "title" && config.key.endsWith("/process") ? (
                          <div className="mt-3" key={field.key}>
                            {renderField(record, field)}
                          </div>
                        ) : field.key === "description" && config.key.endsWith("/process") ? (
                          // Đẩy nhãn + ô "Mô tả" xuống thấp hơn "Tiêu đề" một chút,
                          // vì ảnh bên cạnh đã được nâng sát nhãn của nó.
                          <div className="mt-16" key={field.key}>
                            {renderField(record, field)}
                          </div>
                        ) : (
                          <Fragment key={field.key}>{renderField(record, field)}</Fragment>
                        ),
                    )}
                  />
                ) : useSplit && splitFields ? (
                  <EditorSplitColumns
                    left={splitFields.left.map((field) => (
                      <Fragment key={field.key}>{renderField(record, field)}</Fragment>
                    ))}
                    right={splitFields.right.map((field) => (
                      <Fragment key={field.key}>{renderField(record, field)}</Fragment>
                    ))}
                  />
                ) : (
                <div
                  className={cn(
                    packedFields ? EDITOR_GRID_CLASS : "grid gap-4 lg:gap-5",
                    !packedFields &&
                      !singleColumnContentEditor &&
                      !stackRecordFields &&
                      recordFields.length > 1 &&
                      "md:grid-cols-2",
                  )}
                >
                  {(packedFields ?? recordFields.map((field) => ({ field, span: 0 }))).map(({ field, span }) =>
                    packedFields ? (
                      <div className={editorSpanClass(span)} key={field.key}>
                        {renderField(record, field, {
                          imageSize: editorImagePreviewSize(field, span),
                        })}
                      </div>
                    ) : (
                      <Fragment key={field.key}>{renderField(record, field)}</Fragment>
                    ),
                  )}
                </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

/** Số thẻ trên một hàng — lớp Tailwind tĩnh để bộ quét bắt được. */
const RECORDS_PER_ROW: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-5",
  6: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
};

/** Lớp Tailwind viết sẵn cho hàng chung — Tailwind quét chuỗi tĩnh. */
const SHARED_ROW_COLUMNS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

/**
 * Thẻ nội dung có ảnh một bên, cụm chữ bên kia — đúng như website dựng section.
 * Cột chữ giới hạn `31.875rem` trùng `max-w` của cột chữ ngoài site, để chỗ
 * ngắt dòng của ô Mô tả rơi gần giống chỗ người xem thấy thật.
 */
function MediaRecordLayout({
  side,
  width = "half",
  index,
  fill = false,
  compact = false,
  packedText = false,
  media,
  text,
}: {
  side: "left" | "right" | "alternate";
  width?: "half" | "third" | "twoFifths" | "fortyFive";
  index: number;
  /** Cột ảnh cao bằng cột chữ thay vì chỉ cao bằng tấm ảnh xem trước nhỏ. */
  fill?: boolean;
  /** Bố cục nằm trong thẻ nhiều cột nên giảm khoảng hở giữa media và nội dung. */
  compact?: boolean;
  /** Cột chữ đã được xếp sẵn theo lưới 12 cột thay vì chồng dọc. */
  packedText?: boolean;
  media: React.ReactNode;
  text: React.ReactNode;
}) {
  // Section đảo bên: thẻ thứ nhất ảnh trái, thẻ thứ hai ảnh phải, cứ thế.
  const mediaOnRight =
    side === "right" || (side === "alternate" && index % 2 === 1);
  // `fill`: cột ảnh cao bằng cột chữ (`h-full` + ô ảnh `flex-1`) nên không còn
  // mảng trống hẫng bên dưới tấm ảnh.
  const mediaColumn = (
    <div className={cn("min-w-0", fill ? "flex h-full flex-col gap-4" : "space-y-0")}>
      {media}
    </div>
  );
  const textColumn = (
    <div
      className={cn(
        "min-w-0",
        packedText ? EDITOR_GRID_CLASS : "space-y-4",
        width === "half" && "max-w-[31.875rem]",
      )}
    >
      {text}
    </div>
  );

  return (
    <div
      className={cn(
        "grid min-w-0 gap-5",
        compact ? "lg:gap-5" : "lg:gap-10",
        fill ? "items-stretch" : "items-start",
        width === "third"
          ? mediaOnRight
            ? "lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
            : "lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
          : width === "twoFifths"
            ? mediaOnRight
              ? "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
              : "lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
            : width === "fortyFive"
            ? mediaOnRight
              ? "lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]"
              : "lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)]"
            : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
      )}
    >
      {mediaOnRight ? (
        <>
          {textColumn}
          {mediaColumn}
        </>
      ) : (
        <>
          {mediaColumn}
          {textColumn}
        </>
      )}
    </div>
  );
}

function replaceRecordField(
  drafts: DraftMap,
  resourceKey: string,
  recordId: string,
  fieldKey: string,
  value: AdminFieldValue,
) {
  return {
    ...drafts,
    [resourceKey]: (drafts[resourceKey] ?? []).map((record) =>
      record.id === recordId ? { ...record, [fieldKey]: value } : record,
    ),
  };
}

function fieldIdentity(resourceKey: string, recordId: string, fieldKey: string) {
  return `${resourceKey}::${recordId}::${fieldKey}`;
}

function isFieldDirty(
  config: AdminResourceConfig,
  record: AdminCrudRecord,
  fieldKey: string,
  dirtyKeys: Set<string>,
) {
  return dirtyKeys.has(fieldIdentity(config.key, record.id, fieldKey));
}

function countRecordDirtyFields(
  config: AdminResourceConfig,
  record: AdminCrudRecord,
  dirtyKeys: Set<string>,
) {
  return getEditableAdminSections(config.sections)
    .flatMap((section) => section.fields)
    .reduce(
      (count, field) => count +
        (isFieldDirty(config, record, field.key, dirtyKeys) ? 1 : 0) +
        (field.altKey && isFieldDirty(config, record, field.altKey, dirtyKeys) ? 1 : 0),
      0,
    );
}

function validateDrafts(configs: AdminResourceConfig[], drafts: DraftMap) {
  const errors: Record<string, string> = {};
  for (const config of configs) {
    for (const record of drafts[config.key] ?? []) {
      for (const field of getEditableAdminSections(config.sections).flatMap((section) => section.fields)) {
        const value = record[field.key];
        const empty = value === undefined || value === "" || (Array.isArray(value) && value.filter(Boolean).length === 0);
        const identity = fieldIdentity(config.key, record.id, field.key);
        if (field.required && empty) {
          errors[identity] = "Nội dung này là bắt buộc.";
        } else if (field.type === "url" && !empty && !/^(\/(?!\/)|https?:\/\/|mailto:|tel:|#)/i.test(String(value).trim())) {
          errors[identity] = "Vui lòng nhập một liên kết hợp lệ.";
        } else if (field.type === "number" && typeof value === "number" && field.min !== undefined && value < field.min) {
          errors[identity] = `Giá trị phải lớn hơn hoặc bằng ${field.min}.`;
        }
      }
    }
  }
  return errors;
}

function cloneValue(value: AdminFieldValue) {
  return Array.isArray(value) ? [...value] : value;
}

function sameValue(left: AdminFieldValue | undefined, right: AdminFieldValue | undefined) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function sameDrafts(left: DraftMap, right: DraftMap) {
  return JSON.stringify(left) === JSON.stringify(right);
}
