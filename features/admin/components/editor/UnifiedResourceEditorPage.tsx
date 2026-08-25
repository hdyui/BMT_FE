"use client";

import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminBreadcrumb } from "@/features/admin/components/editor/AdminBreadcrumb";
import { DeleteContentDialog } from "@/features/admin/components/editor/DeleteContentDialog";
import { EditorField } from "@/features/admin/components/editor/EditorField";
import { EditorTopActions } from "@/features/admin/components/editor/EditorTopActions";
import { useAdminCrud } from "@/features/admin/components/editor/AdminCrudProvider";
import { getResourceBreadcrumb } from "@/lib/admin/content-navigation";
import {
  LINE_BREAK_EDITOR_HINT,
  getEditableAdminSections,
} from "@/lib/admin/editor-field-visibility";
import type {
  AdminCrudRecord,
  AdminFieldValue,
  AdminResourceConfig,
} from "@/lib/admin/types/crud";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type DraftMap = Record<string, AdminCrudRecord[]>;

interface HistoryEntry {
  resourceKey: string;
  recordId: string;
  fieldKey: string;
  previous: AdminFieldValue;
}

interface DeleteTarget {
  config: AdminResourceConfig;
  record: AdminCrudRecord;
}

export function UnifiedResourceEditorPage({
  config,
  companionConfig,
}: {
  config: AdminResourceConfig;
  companionConfig?: AdminResourceConfig;
}) {
  const { getRecords, removeRecord, reorderRecords } = useAdminCrud();
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
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const dirtyKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const itemConfig of editableConfigs) {
      for (const record of drafts[itemConfig.key] ?? []) {
        const savedRecord = (savedSnapshot[itemConfig.key] ?? []).find((item) => item.id === record.id);
        for (const field of getEditableAdminSections(itemConfig.sections).flatMap((section) => section.fields)) {
          for (const fieldKey of [field.key]) {
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

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { config: targetConfig, record } = deleteTarget;
    setDeleting(true);
    try {
      await removeRecord(targetConfig.key, record.id);
      const removeFrom = (current: DraftMap) => ({
        ...current,
        [targetConfig.key]: (current[targetConfig.key] ?? []).filter((item) => item.id !== record.id),
      });
      setDrafts(removeFrom);
      setSavedSnapshot(removeFrom);
      setHistory((current) => current.filter((entry) => entry.recordId !== record.id));
      setDeleteTarget(null);
      toast.success("Đã xóa nội dung");
    } finally {
      setDeleting(false);
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
          description=""
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

      <p className="mt-3 text-xs text-muted-foreground">{LINE_BREAK_EDITOR_HINT}</p>

      <section className="mt-7 space-y-10">
        {editableConfigs.map((itemConfig, groupIndex) => (
          <ResourceEditorGroup
            config={itemConfig}
            separated={groupIndex > 0}
            records={drafts[itemConfig.key] ?? []}
            dirtyKeys={dirtyKeys}
            errors={errors}
            onChange={updateField}
            onDelete={(record) => setDeleteTarget({ config: itemConfig, record })}
            key={itemConfig.key}
          />
        ))}
      </section>

      <DeleteContentDialog
        open={Boolean(deleteTarget)}
        title={`Xóa ${deleteTarget?.config.singular ?? "nội dung"}?`}
        itemLabel={deleteTarget?.config.singular ?? "nội dung"}
        deleting={deleting}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function ResourceEditorGroup({
  config,
  records,
  dirtyKeys,
  errors,
  onChange,
  onDelete,
  separated = false,
}: {
  config: AdminResourceConfig;
  separated?: boolean;
  records: AdminCrudRecord[];
  dirtyKeys: Set<string>;
  errors: Record<string, string>;
  onChange: (resourceKey: string, recordId: string, fieldKey: string, value: AdminFieldValue) => void;
  onDelete: (record: AdminCrudRecord) => void;
}) {
  const editableFields = getEditableAdminSections(config.sections).flatMap(
    (section) => section.fields,
  );
  const imageOnlyCollection =
    config.kind === "collection" &&
    editableFields.length === 1 &&
    editableFields[0].type === "image";
  const inlineToggleField =
    config.kind === "collection"
      ? editableFields.find((field) => field.type === "boolean")
      : undefined;
  const contentFields = inlineToggleField
    ? editableFields.filter((field) => field.key !== inlineToggleField.key)
    : editableFields;
  const groupTitle = imageOnlyCollection
    ? "Hình ảnh"
    : getEditableAdminSections(config.sections)[0]?.title ?? config.singular;

  const groupHeader = !imageOnlyCollection && !isGenericGroupTitle(groupTitle) && (
    <header className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-base font-bold">{groupTitle}</h2>
      </div>
      {config.kind === "collection" && (
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {records.length} mục
        </span>
      )}
    </header>
  );

  if (imageOnlyCollection) {
    const imageField = editableFields[0];

    return (
      <section className={groupSeparatorClass(separated)}>
        {records.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">Chưa có nội dung để chỉnh sửa.</p>
        ) : (
          <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
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
                  onChange={(value) => onChange(config.key, record.id, imageField.key, value)}
                  key={record.id}
                />
              );
            })}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className={groupSeparatorClass(separated, groupHeader ? "pt-8" : "pt-2")}>
      {groupHeader}
      {records.length === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">Chưa có nội dung để chỉnh sửa.</p>
      ) : (
        <div className={config.kind === "collection" ? "divide-y divide-border/60" : undefined}>
          {records.map((record, recordIndex) => {
            const recordDirtyCount = countRecordDirtyFields(config, record, dirtyKeys);
            const recordLabel =
              config.kind === "singleton"
                ? config.singular
                : `${config.itemLabel ?? config.singular} ${String(recordIndex + 1).padStart(2, "0")}`;
            return (
              <article className={config.kind === "collection" ? "py-6" : undefined} key={record.id}>
                {config.kind === "collection" && (
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <h3 className="flex min-w-0 items-center gap-2 font-semibold">
                      {recordDirtyCount > 0 && (
                        <span className="size-2 shrink-0 rounded-full bg-brand" aria-label={`${recordDirtyCount} thay đổi chưa lưu`} />
                      )}
                      <span className="truncate">{recordLabel}</span>
                      </h3>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {inlineToggleField && (
                        <label className="flex h-8 items-center gap-2 px-1 text-xs font-medium text-muted-foreground">
                          {isFieldDirty(config, record, inlineToggleField.key, dirtyKeys) && (
                            <span className="size-2 rounded-full bg-brand" aria-label="Có thay đổi chưa lưu" />
                          )}
                          <span>{inlineToggleField.label}</span>
                          <Switch
                            checked={Boolean(record[inlineToggleField.key])}
                            onCheckedChange={(checked) =>
                              onChange(config.key, record.id, inlineToggleField.key, checked)
                            }
                            aria-label={inlineToggleField.label}
                          />
                        </label>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDelete(record)}
                      >
                        <Trash2 /> Xóa
                      </Button>
                    </div>
                  </div>
                )}
                {contentFields.length > 0 && (
                  <div className={`grid gap-4 lg:gap-5 ${contentFields.length > 1 ? "md:grid-cols-2" : ""}`}>
                    {contentFields.map((field) => {
                      const identity = fieldIdentity(config.key, record.id, field.key);
                      return (
                        <EditorField
                          field={field}
                          value={record[field.key]}
                          error={errors[identity]}
                          dirty={isFieldDirty(config, record, field.key, dirtyKeys)}
                          multilineText
                          onChange={(value) => onChange(config.key, record.id, field.key, value)}
                          key={field.key}
                        />
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
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
      (count, field) => count + (isFieldDirty(config, record, field.key, dirtyKeys) ? 1 : 0),
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

function groupSeparatorClass(separated: boolean, topPadding = "pt-10") {
  return separated ? `border-t border-border/60 ${topPadding}` : undefined;
}

function isGenericGroupTitle(title: string) {
  return /^(nội dung|nội dung chữ|nội dung và hình ảnh|thông tin)$/i.test(title.trim());
}
