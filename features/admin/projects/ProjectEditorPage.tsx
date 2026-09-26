"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminBreadcrumb } from "@/features/admin/components/editor/AdminBreadcrumb";
import { EditorField } from "@/features/admin/components/editor/EditorField";
import { EditorTopActions, StickyEditorActions, useEditorActionsVisibility } from "@/features/admin/components/editor/EditorTopActions";
import { confirmEditorSave, useUnsavedChangesGuard } from "@/features/admin/components/editor/unsaved-changes";
import { useAdminCrud } from "@/features/admin/components/editor/AdminCrudProvider";
import { getAdminResource } from "@/features/admin/lib/mock-data/resource-registry";
import { getEditableAdminSections } from "@/features/admin/lib/editor-field-visibility";
import type { AdminCrudRecord, AdminFieldConfig, AdminFieldValue, AdminResourceConfig } from "@/features/admin/lib/types/crud";
import { cn } from "@/shared/lib/utils";

export function ProjectEditorPage({ recordId, detailRoute = false }: { recordId: string; detailRoute?: boolean }) {
  const { getRecords, loadRecord } = useAdminCrud();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void Promise.all([
      loadRecord("projects/list", recordId),
      loadRecord("projects/details", recordId),
    ])
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Không thể tải đầy đủ nội dung dự án từ API.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadRecord, recordId]);

  const selected = getRecords(detailRoute ? "projects/details" : "projects/list").find((record) => record.id === recordId);
  const list = detailRoute
    ? getRecords("projects/list").find((record) => record.id === recordId)
    : selected;
  const detail = detailRoute
    ? selected
    : getRecords("projects/details").find((record) => record.id === recordId);

  if (loading) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center p-6 text-center">
        <div>
          <div className="mx-auto size-8 animate-spin rounded-full border-2 border-muted border-t-brand" />
          <p className="mt-4 text-sm text-muted-foreground">
            Đang tải toàn bộ nội dung chi tiết dự án từ API...
          </p>
        </div>
      </div>
    );
  }

  if (loadError || !list || !detail) {
    return (
      <div className="p-6">
        <p>
          {loadError ??
            "Không tìm thấy đầy đủ dữ liệu danh sách và chi tiết của dự án."}
        </p>
        <Link className="mt-4 inline-block underline" href="/admin/projects">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const entries = [
    { config: getAdminResource("projects/list"), record: list },
    { config: getAdminResource("projects/details"), record: detail },
  ];
  return <ProjectEditorForm key={entries.map(({ record }) => record.id).join(":")} entries={entries} />;
}

type DraftMap = Record<string, AdminCrudRecord[]>;

interface HistoryEntry {
  resourceKey: string;
  recordId: string;
  fieldKey: string;
  previous: AdminFieldValue;
}

function ProjectEditorForm({ entries }: { entries: Array<{ config: AdminResourceConfig; record: AdminCrudRecord }> }) {
  const { updateRecord } = useAdminCrud();
  const editableConfigs = useMemo(
    () => entries.map((entry) => entry.config),
    [entries],
  );
  const initialRecords = useMemo(
    () =>
      Object.fromEntries(
        entries.map(({ config, record }) => [config.key, [structuredClone(record)]]),
      ) as DraftMap,
    [entries],
  );
  const [drafts, setDrafts] = useState<DraftMap>(initialRecords);
  const [savedSnapshot, setSavedSnapshot] = useState<DraftMap>(initialRecords);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const groups = editableConfigs.flatMap((config) => {
    const sections = getEditableAdminSections(config.sections);
    return config.key === "projects/list"
      ? [{ config, id: "list", title: "Thông tin danh sách", fields: sections.flatMap((section) => section.fields) }]
      : sections.map((section) => ({ ...section, config }));
  });
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
    setErrors({});
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
        const record = drafts[itemConfig.key][0];
        if (sameDrafts({ record: [record] }, { record: savedSnapshot[itemConfig.key] })) continue;
        const saved = await updateRecord(itemConfig.key, record.id, record);
        // Keep successful saves acknowledged if a later resource fails.
        setSavedSnapshot((current) => ({ ...current, [itemConfig.key]: [structuredClone(saved)] }));
        setHistory((current) => current.filter((entry) => entry.resourceKey !== itemConfig.key));
      }
      setSavedSnapshot(structuredClone(drafts));
      setHistory([]);
      toast.success("Đã lưu toàn bộ thay đổi");
      return true;
    } catch {
      toast.error("Chưa lưu được toàn bộ thay đổi. Vui lòng thử lại.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  useUnsavedChangesGuard({ dirty, dirtyCount: dirtyKeys.size, save: saveAll });
  const { topActionsRef, topActionsVisible } = useEditorActionsVisibility();
  const actions = {
    dirty, dirtyCount: dirtyKeys.size, saving,
    onUndo: undoLast, onUndoAll: undoAll,
    onSave: () => confirmEditorSave(dirtyKeys.size, saveAll),
  };
  return (
    <div className="mx-auto w-full max-w-[1320px] p-4 sm:p-6 lg:p-8">
      <AdminBreadcrumb items={[{ label: "Dự án", href: "/admin/projects" }, { label: "Chỉnh sửa" }]} />
      <div className="mt-4">
        <AdminPageHeader title="Chỉnh sửa" actions={<EditorTopActions ref={topActionsRef} {...actions} />} />
        <p className="mt-2 text-sm text-muted-foreground">{String(entries[0].record.title ?? "")}</p>
      </div>
      <section className="mt-6 min-w-0 overflow-hidden rounded-2xl border bg-card shadow-[0_12px_36px_rgb(36_33_34/.035)]">
        <fieldset disabled={saving} className="min-w-0">
          {groups.map((group, groupIndex) => {
            const record = drafts[group.config.key][0];
            const fieldGroups = groupProjectFields(group.fields);
            const keys = group.fields.flatMap((field) =>
              field.altKey ? [field.key, field.altKey] : [field.key],
            );
            const changed = keys.filter((key) =>
              dirtyKeys.has(fieldIdentity(group.config.key, record.id, key)),
            ).length;
            const invalid = keys.some((key) =>
              errors[fieldIdentity(group.config.key, record.id, key)],
            );

            return (
              <div
                key={group.config.key + group.id}
                className={cn(groupIndex > 0 && "border-t")}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 px-5 py-4 sm:px-6">
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      {group.title}
                    </h2>
                    {group.description ? (
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {group.description}
                      </p>
                    ) : null}
                  </div>
                  {invalid ? (
                    <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive">
                      Có nội dung cần kiểm tra
                    </span>
                  ) : changed > 0 ? (
                    <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-bold text-brand">
                      {changed} thay đổi
                    </span>
                  ) : null}
                </div>

                {group.config.key === "projects/list" ? (
                  <ProjectListEditor
                    configKey={group.config.key}
                    record={record}
                    fields={group.fields}
                    errors={errors}
                    dirtyKeys={dirtyKeys}
                    onChange={updateField}
                  />
                ) : group.config.key === "projects/details" && group.id === "solution" ? (
                  <ProjectSolutionEditor
                    configKey={group.config.key}
                    record={record}
                    fields={group.fields}
                    errors={errors}
                    dirtyKeys={dirtyKeys}
                    onChange={updateField}
                  />
                ) : group.config.key === "projects/details" && group.id === "general" ? (
                  <ProjectOverviewEditor
                    configKey={group.config.key}
                    record={record}
                    fields={group.fields}
                    errors={errors}
                    dirtyKeys={dirtyKeys}
                    onChange={updateField}
                  />
                ) : (
                <div className="grid min-w-0 grid-cols-12 gap-4 p-5 sm:p-6 lg:gap-5">
                  {Array.from(fieldGroups, ([key, fields]) => (
                    <div
                      key={group.config.key + key}
                      className={cn(
                        "grid min-w-0 content-start gap-4",
                        projectFieldGroupSpan(group.id, key, fields),
                      )}
                    >
                      {fields.map((field) => {
                        const identity = fieldIdentity(
                          group.config.key,
                          record.id,
                          field.key,
                        );
                        return (
                          <div key={identity} className="min-w-0">
                            <EditorField
                              field={field}
                              value={record[field.key]}
                              error={errors[identity]}
                              dirty={dirtyKeys.has(identity)}
                              contentEditorStyle
                              imageSize="thumb"
                              hideAlt={group.config.key === "projects/details"}
                              onChange={(value) =>
                                updateField(
                                  group.config.key,
                                  record.id,
                                  field.key,
                                  value,
                                )
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                )}
              </div>
            );
          })}
        </fieldset>
      </section>
      {!drafts["projects/details"] && <p className="mt-4 text-sm text-muted-foreground">Dự án này chưa có nội dung trang chi tiết.</p>}
      <StickyEditorActions hidden={topActionsVisible} {...actions} />
    </div>
  );
}

function ProjectSolutionEditor({
  configKey,
  record,
  fields,
  errors,
  dirtyKeys,
  onChange,
}: {
  configKey: string;
  record: AdminCrudRecord;
  fields: AdminFieldConfig[];
  errors: Record<string, string>;
  dirtyKeys: Set<string>;
  onChange: (
    resourceKey: string,
    recordId: string,
    fieldKey: string,
    value: AdminFieldValue,
  ) => void;
}) {
  const byKey = new Map(fields.map((field) => [field.key, field]));
  const drawing = byKey.get("drawingImage");
  const caption = byKey.get("drawingCaption");
  const description = byKey.get("solutionDescription");

  function renderField(
    field: AdminFieldConfig,
    options?: {
      imageSize?: "thumb" | "large" | "wide" | "row" | "fill" | "portrait" | "banner";
      imageFit?: "contain" | "cover";
      hideAlt?: boolean;
    },
  ) {
    const identity = fieldIdentity(configKey, record.id, field.key);
    return (
      <EditorField
        field={field}
        value={record[field.key]}
        error={errors[identity]}
        dirty={dirtyKeys.has(identity)}
        contentEditorStyle
        imageSize={options?.imageSize ?? "thumb"}
        imageFit={options?.imageFit ?? "contain"}
        hideAlt
        onChange={(value) => onChange(configKey, record.id, field.key, value)}
      />
    );
  }

  return (
    <div className="p-5 sm:p-6">
      <div className="grid items-start gap-6 lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-9">
        <div className="grid min-w-0 max-w-[440px] gap-5">
          {drawing
            ? renderField(drawing, {
                imageSize: "wide",
                imageFit: "contain",
                hideAlt: true,
              })
            : null}
        </div>

        <div className="grid min-w-0 content-start gap-6">
          {caption ? (
            <div className="max-w-[32rem]">{renderField(caption)}</div>
          ) : null}
          {description ? (
            <div className="border-t border-foreground/10 pt-5">
              {renderField(description)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ProjectListEditor({
  configKey,
  record,
  fields,
  errors,
  dirtyKeys,
  onChange,
}: {
  configKey: string;
  record: AdminCrudRecord;
  fields: AdminFieldConfig[];
  errors: Record<string, string>;
  dirtyKeys: Set<string>;
  onChange: (
    resourceKey: string,
    recordId: string,
    fieldKey: string,
    value: AdminFieldValue,
  ) => void;
}) {
  const byKey = new Map(fields.map((field) => [field.key, field]));
  const thumbnail = byKey.get("thumbnail");
  const title = byKey.get("title");
  const category = byKey.get("category");

  function renderField(
    field: AdminFieldConfig,
    options?: {
      imageSize?: "thumb" | "large" | "wide" | "row" | "fill" | "portrait" | "banner";
      imageFit?: "contain" | "cover";
    },
  ) {
    const identity = fieldIdentity(configKey, record.id, field.key);
    return (
      <EditorField
        field={field}
        value={record[field.key]}
        error={errors[identity]}
        dirty={dirtyKeys.has(identity)}
        altValue={
          field.altKey && field.key !== "thumbnail"
            ? record[field.altKey]
            : undefined
        }
        altDirty={Boolean(
          field.altKey &&
            dirtyKeys.has(fieldIdentity(configKey, record.id, field.altKey)),
        )}
        contentEditorStyle
        imageSize={options?.imageSize ?? "thumb"}
        imageFit={options?.imageFit ?? "contain"}
        onChange={(value) => onChange(configKey, record.id, field.key, value)}
        hideAlt={field.key === "thumbnail"}
        onAltChange={
          field.altKey && field.key !== "thumbnail"
            ? (value) => onChange(configKey, record.id, field.altKey!, value)
            : undefined
        }
      />
    );
  }

  return (
    <div className="p-5 sm:p-6">
      <div className="grid items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-8">
        <div className="min-w-0 max-w-[360px]">
          {thumbnail
            ? renderField(thumbnail, {
                imageSize: "large",
                imageFit: "cover",
              })
            : null}
        </div>

        <div className="grid min-w-0 gap-5">
          {title ? renderField(title) : null}
          {category ? renderField(category) : null}
        </div>
      </div>
    </div>
  );
}

function ProjectOverviewEditor({
  configKey,
  record,
  fields,
  errors,
  dirtyKeys,
  onChange,
}: {
  configKey: string;
  record: AdminCrudRecord;
  fields: AdminFieldConfig[];
  errors: Record<string, string>;
  dirtyKeys: Set<string>;
  onChange: (
    resourceKey: string,
    recordId: string,
    fieldKey: string,
    value: AdminFieldValue,
  ) => void;
}) {
  const byKey = new Map(fields.map((field) => [field.key, field]));
  const hero = byKey.get("heroImage");
  const wordmark = byKey.get("wordmarkImage");
  const description = byKey.get("description");
  const infoKeys = [
    "projectName",
    "category",
    "location",
    "client",
    "area",
    "style",
    "year",
    "scale",
  ];

  function renderField(
    field: AdminFieldConfig,
    options?: {
      imageSize?: "thumb" | "large" | "wide" | "row" | "fill" | "portrait" | "banner";
      hideAlt?: boolean;
      imageFit?: "contain" | "cover";
    },
  ) {
    const identity = fieldIdentity(configKey, record.id, field.key);
    return (
      <EditorField
        field={field}
        value={record[field.key]}
        error={errors[identity]}
        dirty={dirtyKeys.has(identity)}
        contentEditorStyle
        imageSize={options?.imageSize ?? "thumb"}
        imageFit={options?.imageFit ?? "contain"}
        hideAlt
        onChange={(value) => onChange(configKey, record.id, field.key, value)}
      />
    );
  }

  const title = byKey.get("title");

  return (
    <div className="p-5 sm:p-6">
      <div className="grid items-start gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
        <div className="min-w-0">
          {hero ? (
            renderField(hero, {
              imageSize: "portrait",
              imageFit: "cover",
              hideAlt: true,
            })
          ) : null}
        </div>

        <div className="min-w-0">
          {wordmark ? (
            <div className="mb-5 max-w-[30rem]">
              {renderField(wordmark, {
                imageSize: "banner",
                hideAlt: true,
              })}
            </div>
          ) : null}

          {title ? (
            <div className="border-b border-foreground/15 pb-5">
              {renderField(title)}
            </div>
          ) : null}

          <div className="mt-5 grid gap-x-4 gap-y-4 sm:grid-cols-2">
            {infoKeys.map((key) => {
              const field = byKey.get(key);
              return field ? (
                <div
                  key={key}
                  className={cn(
                    key === "location" || key === "scale" ? "sm:col-span-2" : "",
                  )}
                >
                  {renderField(field)}
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>

      {description ? (
        <div className="mt-6 border-t border-foreground/10 pt-6">
          {renderField(description)}
        </div>
      ) : null}
    </div>
  );
}

function groupProjectFields(fields: AdminFieldConfig[]) {
  const groups = new Map<string, AdminFieldConfig[]>();
  for (const field of fields) {
    const mediaGroup = field.key.match(
      /^(comparison\d+(?:Before|After)|process\d+)/,
    )?.[0];
    const key = mediaGroup ?? field.key;
    groups.set(key, [...(groups.get(key) ?? []), field]);
  }
  return groups;
}

function projectFieldGroupSpan(
  sectionId: string,
  key: string,
  fields: AdminFieldConfig[],
) {
  const hasLongField = fields.some((field) =>
    ["textarea", "richtext", "list"].includes(field.type),
  );
  const hasImage = fields.some((field) => field.type === "image");

  if (sectionId === "overview") {
    if (key === "description") return "col-span-12 xl:col-span-7";
    if (key === "heroImage") return "col-span-12 xl:col-span-5";
  }

  if (sectionId === "solution") {
    if (key === "drawingCaption") return "col-span-12 sm:col-span-4";
    if (key === "solutionDescription") return "col-span-12 sm:col-span-8";
    if (key === "drawingImage") return "col-span-12 sm:col-span-6";
  }

  if (sectionId === "process" && /^process\d+/.test(key)) {
    return "col-span-12 md:col-span-6";
  }

  if (sectionId === "comparisons" && /^comparison\d+/.test(key)) {
    return "col-span-12 md:col-span-6";
  }

  if (hasLongField) return "col-span-12";
  if (hasImage) return "col-span-12 sm:col-span-6 xl:col-span-4";
  return "col-span-12 sm:col-span-6 xl:col-span-4";
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
