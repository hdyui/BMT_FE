"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CircleAlert, FileText, Hash } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminBreadcrumb } from "@/features/admin/components/editor/AdminBreadcrumb";
import { DynamicCollectionEditorLayout } from "@/features/admin/components/editor/DynamicCollectionEditorLayout";
import { EditorField } from "@/features/admin/components/editor/EditorField";
import {
  EditorTopActions,
  StickyEditorActions,
  useEditorActionsVisibility,
} from "@/features/admin/components/editor/EditorTopActions";
import {
  EditorLayout,
  EditorSection,
} from "@/features/admin/components/editor/EditorLayout";
import { EditorSplitColumns } from "@/features/admin/components/editor/EditorSplitColumns";
import { ResourcePreviewDialog } from "@/features/admin/components/editor/ResourcePreviewDialog";
import {
  confirmEditorSave,
  useUnsavedChangesGuard,
} from "@/features/admin/components/editor/unsaved-changes";
import { useAdminCrud } from "@/features/admin/components/editor/AdminCrudProvider";
import { getResourceBreadcrumb } from "@/features/admin/lib/content-navigation";
import { getDynamicCollectionUiKind } from "@/features/admin/lib/dynamic-collection-ui";
import {
  EDITOR_GRID_CLASS,
  editorImagePreviewSize,
  editorSpanClass,
  packEditorFields,
} from "@/features/admin/lib/editor-layout";
import {
  LINE_BREAK_EDITOR_HINT,
  getEditableAdminSections,
  isHomeStyleEditor,
  isRefinedEditorResource,
} from "@/features/admin/lib/editor-field-visibility";
import type {
  AdminCrudRecord,
  AdminFieldConfig,
  AdminFieldValue,
  AdminResourceConfig,
  AdminValidationErrors,
} from "@/features/admin/lib/types/crud";
import { Badge } from "@/features/admin/components/ui/badge";
import { Button } from "@/features/admin/components/ui/button";
import { cn } from "@/shared/lib/utils";

export function ResourceEditorPage({
  config,
  mode,
  recordId,
  baseHref: baseHrefOverride,
}: {
  config: AdminResourceConfig;
  mode: "create" | "edit" | "singleton";
  recordId?: string;
  baseHref?: string;
}) {
  const router = useRouter();
  const { getRecords, createRecord, updateRecord } = useAdminCrud();
  const records = getRecords(config.key);
  const existing =
    mode === "create"
      ? null
      : (records.find((item) =>
          mode === "singleton" ? true : item.id === recordId,
        ) ?? null);
  const baseHref = baseHrefOverride ?? `/admin/${config.module}/${config.path}`;

  const initialDraft = useMemo(
    () =>
      existing
        ? structuredClone(existing)
        : createEmptyRecord(config, records.length + 1),
    [config, existing, records.length],
  );
  const [draft, setDraft] = useState<AdminCrudRecord>(initialDraft);
  const [savedSnapshot, setSavedSnapshot] =
    useState<AdminCrudRecord>(initialDraft);
  const [errors, setErrors] = useState<AdminValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [history, setHistory] = useState<FieldHistoryEntry[]>([]);
  const editableSections = useMemo(
    () => getEditableAdminSections(config.sections),
    [config.sections],
  );

  const dirty = JSON.stringify(draft) !== JSON.stringify(savedSnapshot);
  const dirtyKeys = useMemo(() => {
    const keys = editableSections.flatMap((section) =>
      section.fields.flatMap((field) =>
        field.altKey ? [field.key, field.altKey] : [field.key],
      ),
    );
    return new Set(
      keys.filter((key) => !sameValue(draft[key], savedSnapshot[key])),
    );
  }, [draft, editableSections, savedSnapshot]);
  const dirtyCount = dirtyKeys.size;
  const refinedEditor = isRefinedEditorResource(config);
  const topActionEditor = true;
  const allowPreview = !topActionEditor && config.module !== "services";
  const singleColumnContentEditor = isHomeStyleEditor(config);
  const requestedContentEditor = singleColumnContentEditor;
  const stackedFields = singleColumnContentEditor;
  const dynamicUiKind = getDynamicCollectionUiKind(config.key);

  useUnsavedChangesGuard({ dirty, dirtyCount, save: saveDraft });
  const { topActionsRef, topActionsVisible } = useEditorActionsVisibility();

  if (mode !== "create" && !existing) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center p-6 text-center">
        <div>
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-brand">
            <CircleAlert className="size-5" />
          </span>
          <h1 className="mt-4 text-xl font-bold">Không tìm thấy nội dung</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Nội dung này có thể đã bị xóa hoặc đường dẫn không đúng.
          </p>
          <Button
            className="mt-5"
            nativeButton={false}
            render={<Link href={baseHref} />}
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  function updateField(key: string, value: AdminFieldValue) {
    const previous = draft[key] ?? "";
    if (sameValue(previous, value)) return;
    const next = { ...draft, [key]: value };
    setDraft(next);
    setHistory((current) => [
      ...current,
      { key, previous: cloneValue(previous) },
    ]);
    if (JSON.stringify(next) === JSON.stringify(savedSnapshot)) setHistory([]);
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function undoLast() {
    const action = history.at(-1);
    if (!action) return;
    const next = { ...draft, [action.key]: cloneValue(action.previous) };
    setDraft(next);
    setHistory((current) =>
      JSON.stringify(next) === JSON.stringify(savedSnapshot)
        ? []
        : current.slice(0, -1),
    );
  }

  function undoAll() {
    setDraft(structuredClone(savedSnapshot));
    setHistory([]);
    setErrors({});
  }

  async function saveDraft() {
    const nextErrors = validateRecord(
      { ...config, sections: editableSections },
      draft,
    );
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Vui lòng kiểm tra các nội dung chưa hợp lệ", {
        description: `${Object.keys(nextErrors).length} nội dung cần được cập nhật.`,
      });
      return false;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        const saved = await createRecord(config.key, draft);
        setSavedSnapshot(structuredClone(saved));
        setHistory([]);
        toast.success("Đã tạo bản nháp");
        router.replace(`${baseHref}/${saved.id}`);
      } else {
        const saved = await updateRecord(config.key, draft.id, draft);
        setSavedSnapshot(structuredClone(saved));
        setHistory([]);
        toast.success("Đã cập nhật nội dung");
      }
      return true;
    } finally {
      setSaving(false);
    }
  }

  const pageTitle =
    mode === "create"
      ? `Tạo ${config.singular}`
      : `Chỉnh sửa ${config.singular}`;

  return (
    <div className="mx-auto w-full max-w-[1320px] p-4 pb-8 sm:p-6 lg:p-8">
      <AdminBreadcrumb
        items={[
          ...getResourceBreadcrumb(config),
          {
            label: config.title,
            href: config.kind === "collection" ? baseHref : undefined,
          },
          ...(config.kind === "collection"
            ? [
                {
                  label:
                    mode === "create"
                      ? "Tạo mới"
                      : String(draft[config.titleField] ?? "Chỉnh sửa"),
                },
              ]
            : []),
        ]}
      />

      <div className="mt-4">
        {config.kind === "collection" && (
          <Link
            href={baseHref}
            className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> {config.title}
          </Link>
        )}
        <AdminPageHeader
          title={pageTitle}
          actions={
            topActionEditor ? (
              <EditorTopActions
                ref={topActionsRef}
                dirty={dirty}
                dirtyCount={dirtyCount}
                saving={saving}
                onUndo={undoLast}
                onUndoAll={undoAll}
                onSave={() => confirmEditorSave(dirtyCount, saveDraft)}
              />
            ) : (
              <div className="flex items-center gap-2">
                {dirty && (
                  <Badge variant="warning" className="gap-2">
                    <span className="size-2 rounded-full bg-brand" />
                    {dirtyCount} thay đổi chưa lưu
                  </Badge>
                )}
                {allowPreview && (
                  <Button
                    variant="outline"
                    onClick={() => setPreviewOpen(true)}
                  >
                    Xem trước
                  </Button>
                )}
              </div>
            )
          }
        />
      </div>

      {refinedEditor && (
        <p className="mt-3 text-xs text-muted-foreground">
          {LINE_BREAK_EDITOR_HINT}
        </p>
      )}

      <EditorLayout
        aside={
          topActionEditor ? undefined : (
            <>
              <div className="rounded-2xl border bg-card p-4">
                <h2 className="text-sm font-semibold">Trạng thái nội dung</h2>
                <div className="mt-4 space-y-3 text-xs text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <Hash className="mt-0.5 size-3.5 shrink-0" />
                    <span>Nội dung đang chỉnh sửa</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <FileText className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      {config.kind === "singleton"
                        ? "Nội dung dùng chung"
                        : "Một mục trong danh sách"}
                    </span>
                  </p>
                </div>
              </div>
            </>
          )
        }
      >
        {topActionEditor ? (
          dynamicUiKind ? (
            <DynamicCollectionEditorLayout
              config={config}
              draft={draft}
              dirtyKeys={dirtyKeys}
              errors={errors}
              onChange={updateField}
            />
          ) : (
            <section className="overflow-hidden rounded-2xl border bg-card shadow-[0_12px_38px_rgb(36_33_34/.035)]">
              {editableSections.map((editorSection, sectionIndex) => {
                const fields = editorSection.fields;
                const imageCount = fields.filter(
                  (field) => field.type === "image",
                ).length;
                const threeColumnText = imageCount === 0 && fields.length === 3;
                // Nhóm trang đã tinh chỉnh xếp ô theo lưới 12 cột mô phỏng bố cục
                // website; các trang còn lại giữ nguyên lưới cũ.
                const packedFields = refinedEditor
                  ? packEditorFields(fields)
                  : null;
                // Section được chỉ định chia hai cột theo đúng vị trí trên website.
                const split = config.editorLayout?.splitColumns;
                const splitFields = split
                  ? {
                      left: fields.filter((field) =>
                        split.left.includes(field.key),
                      ),
                      right: fields.filter((field) =>
                        split.right.includes(field.key),
                      ),
                    }
                  : null;
                const useSplit =
                  splitFields !== null &&
                  splitFields.left.length + splitFields.right.length ===
                    fields.length;

                const renderField = (
                  field: AdminFieldConfig,
                  options: { imageSize?: "wide" } = {},
                ) => (
                  <EditorField
                    field={field}
                    imageSize={options.imageSize}
                    value={draft[field.key]}
                    error={errors[field.key]}
                    dirty={dirtyKeys.has(field.key)}
                    altValue={field.altKey ? draft[field.altKey] : undefined}
                    altDirty={Boolean(
                      field.altKey && dirtyKeys.has(field.altKey),
                    )}
                    contentEditorStyle={requestedContentEditor}
                    lockItemCount={refinedEditor}
                    onChange={(value) => updateField(field.key, value)}
                    onAltChange={
                      field.altKey
                        ? (value) => updateField(field.altKey!, value)
                        : undefined
                    }
                  />
                );

                return (
                  <div
                    className={cn("p-4 sm:p-5", sectionIndex > 0 && "border-t")}
                    key={editorSection.id}
                  >
                    {editableSections.length > 1 && (
                      <div className="mb-4">
                        <h2
                          className={cn(
                            requestedContentEditor
                              ? "text-lg font-bold"
                              : "text-sm font-semibold",
                          )}
                        >
                          {editorSection.title}
                        </h2>
                        {editorSection.description && (
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {editorSection.description}
                          </p>
                        )}
                      </div>
                    )}
                    {useSplit && splitFields ? (
                      <EditorSplitColumns
                        left={splitFields.left.map((field) => (
                          <div key={field.key}>{renderField(field)}</div>
                        ))}
                        right={splitFields.right.map((field) => (
                          <div key={field.key}>{renderField(field)}</div>
                        ))}
                      />
                    ) : (
                      <div
                        className={cn(
                          packedFields
                            ? EDITOR_GRID_CLASS
                            : "grid items-start gap-4 lg:gap-5",
                          !packedFields &&
                            !stackedFields &&
                            fields.length > 1 &&
                            "md:grid-cols-2",
                          !packedFields &&
                            !stackedFields &&
                            (threeColumnText
                              ? "xl:grid-cols-3"
                              : fields.length > 1 && "xl:grid-cols-4"),
                        )}
                      >
                        {(
                          packedFields ??
                          fields.map((field) => ({ field, span: 0 }))
                        ).map(({ field, span }) => (
                          <div
                            className={cn(
                              packedFields && editorSpanClass(span),
                              !packedFields &&
                                !stackedFields &&
                                !threeColumnText &&
                                fields.length === 1 &&
                                "xl:col-span-4",
                              !packedFields &&
                                !stackedFields &&
                                !threeColumnText &&
                                fields.length > 1 &&
                                field.type !== "image" &&
                                "xl:col-span-2",
                              !packedFields &&
                                !stackedFields &&
                                !threeColumnText &&
                                fields.length > 1 &&
                                field.type === "image" &&
                                imageCount <= 2 &&
                                "xl:col-span-2",
                            )}
                            key={field.key}
                          >
                            {renderField(field, {
                              imageSize: packedFields
                                ? editorImagePreviewSize(field, span)
                                : undefined,
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          )
        ) : (
          editableSections.map((editorSection) => (
            <EditorSection
              title={editorSection.title}
              description={editorSection.description}
              prominent={requestedContentEditor}
              singleColumn={singleColumnContentEditor}
              dirtyCount={editorSection.fields.reduce(
                (count, field) => count + (dirtyKeys.has(field.key) ? 1 : 0),
                0,
              )}
              key={editorSection.id}
            >
              {editorSection.fields.map((field) => (
                <EditorField
                  field={field}
                  value={draft[field.key]}
                  error={errors[field.key]}
                  dirty={dirtyKeys.has(field.key)}
                  altValue={field.altKey ? draft[field.altKey] : undefined}
                  altDirty={Boolean(
                    field.altKey && dirtyKeys.has(field.altKey),
                  )}
                  contentEditorStyle={requestedContentEditor}
                  lockItemCount={refinedEditor}
                  onChange={(value) => updateField(field.key, value)}
                  onAltChange={
                    field.altKey
                      ? (value) => updateField(field.altKey!, value)
                      : undefined
                  }
                  key={field.key}
                />
              ))}
            </EditorSection>
          ))
        )}
      </EditorLayout>

      <StickyEditorActions
        hidden={topActionsVisible}
        dirty={dirty}
        dirtyCount={dirtyCount}
        saving={saving}
        onUndo={undoLast}
        onUndoAll={undoAll}
        onSave={() => confirmEditorSave(dirtyCount, saveDraft)}
      />

      {!topActionEditor && (
        <ResourcePreviewDialog
          open={previewOpen}
          config={config}
          record={draft}
          onOpenChange={setPreviewOpen}
        />
      )}
    </div>
  );
}

interface FieldHistoryEntry {
  key: string;
  previous: AdminFieldValue;
}

function cloneValue(value: AdminFieldValue) {
  return Array.isArray(value) ? [...value] : value;
}

function sameValue(
  left: AdminFieldValue | undefined,
  right: AdminFieldValue | undefined,
) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function createEmptyRecord(config: AdminResourceConfig, order: number) {
  const draft: AdminCrudRecord = {
    id: `${config.path.split("/").at(-1)}-${Date.now()}`,
  };

  for (const field of config.sections.flatMap((item) => item.fields)) {
    if (field.type === "boolean") draft[field.key] = true;
    else if (field.type === "number")
      draft[field.key] =
        field.key === config.orderField ? order : (field.min ?? 0);
    else if (field.type === "list") draft[field.key] = [];
    else draft[field.key] = "";

    if (field.altKey) draft[field.altKey] = "";
  }

  return draft;
}

function validateRecord(
  config: AdminResourceConfig,
  record: AdminCrudRecord,
): AdminValidationErrors {
  const errors: AdminValidationErrors = {};

  for (const field of config.sections.flatMap((item) => item.fields)) {
    const value = record[field.key];
    const empty =
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.filter(Boolean).length === 0);

    if (field.required && empty) {
      errors[field.key] = "Nội dung này là bắt buộc.";
      continue;
    }

    if (field.type === "url" && !empty && !isValidContentUrl(String(value))) {
      errors[field.key] = "Vui lòng nhập một liên kết hợp lệ.";
    }

    if (
      field.type === "number" &&
      typeof value === "number" &&
      field.min !== undefined &&
      value < field.min
    ) {
      errors[field.key] = `Giá trị phải lớn hơn hoặc bằng ${field.min}.`;
    }
  }

  return errors;
}

function isValidContentUrl(value: string) {
  return /^(\/(?!\/)|https?:\/\/|mailto:|tel:|#)/i.test(value.trim());
}
