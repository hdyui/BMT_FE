"use client";

import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminBreadcrumb } from "@/features/admin/components/editor/AdminBreadcrumb";
import { EditorField } from "@/features/admin/components/editor/EditorField";
import { EditorTopActions } from "@/features/admin/components/editor/EditorTopActions";
import { useAdminCrud } from "@/features/admin/components/editor/AdminCrudProvider";
import { getResourceBreadcrumb } from "@/lib/admin/content-navigation";
import {
  getEditableAdminSections,
  isHomeStyleEditor,
} from "@/lib/admin/editor-field-visibility";
import type {
  AdminCrudRecord,
  AdminFieldValue,
  AdminResourceConfig,
} from "@/lib/admin/types/crud";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      return;
    }

    setSaving(true);
    try {
      for (const itemConfig of editableConfigs) {
        await reorderRecords(itemConfig.key, drafts[itemConfig.key] ?? []);
      }
      setSavedSnapshot(structuredClone(drafts));
      setHistory([]);
      toast.success("Đã lưu toàn bộ thay đổi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1480px] p-4 pb-8 sm:p-6 lg:p-8">
      <AdminBreadcrumb
        items={[...getResourceBreadcrumb(config), { label: config.title }]}
      />
      <div className="mt-4">
        <AdminPageHeader
          title={config.title}
          description={config.description}
          actions={
            <EditorTopActions
              dirty={dirty}
              dirtyCount={dirtyKeys.size}
              saving={saving}
              onUndo={undoLast}
              onUndoAll={undoAll}
              onSave={saveAll}
            />
          }
        />
      </div>

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
  const imageOnlyCollection =
    config.kind === "collection" &&
    editableFields.length === 1 &&
    editableFields[0].type === "image";

  if (imageOnlyCollection) {
    const imageField = editableFields[0];

    return records.length === 0 ? (
      <p className="p-6 text-sm text-muted-foreground">Chưa có nội dung để chỉnh sửa.</p>
    ) : (
      <div
        className={cn(
          "grid gap-4 p-4 sm:p-5",
          !singleColumnContentEditor && "sm:grid-cols-2 xl:grid-cols-4",
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

  return (
    <>
      {records.length === 0 ? (
        <p className="p-6 text-sm text-muted-foreground">Chưa có nội dung để chỉnh sửa.</p>
      ) : (
        <div className="divide-y first:border-t-0">
          {records.map((record, recordIndex) => {
            const recordDirtyCount = countRecordDirtyFields(config, record, dirtyKeys);
            const recordLabel =
              config.kind === "singleton"
                ? config.singular
                : `${config.itemLabel ?? config.singular} ${String(recordIndex + 1).padStart(2, "0")}`;
            return (
              <article className="p-4 sm:p-5" key={record.id}>
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
                      <span className="truncate">{recordLabel}</span>
                    </h3>
                  </div>
                  {config.kind === "collection" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      disabled
                      title="Số lượng mục được cố định theo layout website"
                    >
                      <Trash2 /> Xóa
                    </Button>
                  )}
                </div>
                <div
                  className={cn(
                    "grid gap-4 lg:gap-5",
                    !singleColumnContentEditor && editableFields.length > 1 && "md:grid-cols-2",
                  )}
                >
                  {editableFields.map((field) => {
                    const identity = fieldIdentity(config.key, record.id, field.key);
                    return (
                      <EditorField
                        field={field}
                        value={record[field.key]}
                        error={errors[identity]}
                        dirty={isFieldDirty(config, record, field.key, dirtyKeys)}
                        altValue={field.altKey ? record[field.altKey] : undefined}
                        altDirty={Boolean(field.altKey && isFieldDirty(config, record, field.altKey, dirtyKeys))}
                        contentEditorStyle={requestedContentEditor}
                        onChange={(value) => onChange(config.key, record.id, field.key, value)}
                        onAltChange={field.altKey ? (value) => onChange(config.key, record.id, field.altKey!, value) : undefined}
                        key={field.key}
                      />
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
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
