"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CircleAlert, FileText, Hash } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminBreadcrumb } from "@/features/admin/components/editor/AdminBreadcrumb";
import { EditorActionBar } from "@/features/admin/components/editor/EditorActionBar";
import { EditorField } from "@/features/admin/components/editor/EditorField";
import {
  EditorLayout,
  EditorScopeCard,
  EditorSection,
} from "@/features/admin/components/editor/EditorLayout";
import { ResourcePreviewDialog } from "@/features/admin/components/editor/ResourcePreviewDialog";
import { useAdminCrud } from "@/features/admin/components/editor/AdminCrudProvider";
import type {
  AdminCrudRecord,
  AdminFieldValue,
  AdminResourceConfig,
  AdminValidationErrors,
} from "@/lib/admin/types/crud";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";

export function ResourceEditorPage({
  config,
  mode,
  recordId,
}: {
  config: AdminResourceConfig;
  mode: "create" | "edit" | "singleton";
  recordId?: string;
}) {
  const router = useRouter();
  const { getRecords, createRecord, updateRecord } = useAdminCrud();
  const records = getRecords(config.key);
  const existing =
    mode === "create"
      ? null
      : records.find((item) =>
          mode === "singleton" ? true : item.id === recordId,
        ) ?? null;
  const baseHref = `/admin/${config.module}/${config.path}`;

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

  const dirty = JSON.stringify(draft) !== JSON.stringify(savedSnapshot);

  if (mode !== "create" && !existing) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center p-6 text-center">
        <div>
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-brand">
            <CircleAlert className="size-5" />
          </span>
          <h1 className="mt-4 text-xl font-bold">Không tìm thấy nội dung</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            ID có thể không tồn tại trong dữ liệu mẫu của phiên hiện tại.
          </p>
          <Button className="mt-5" nativeButton={false} render={<Link href={baseHref} />}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  function updateField(key: string, value: AdminFieldValue) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function saveDraft() {
    const nextErrors = validateRecord(config, draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Vui lòng kiểm tra các field chưa hợp lệ", {
        description: `${Object.keys(nextErrors).length} field cần được cập nhật.`,
      });
      return;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        const saved = await createRecord(config.key, draft);
        setSavedSnapshot(structuredClone(saved));
        toast.success("Đã tạo bản nháp cục bộ", {
          description: "Dữ liệu sẽ reset khi reload trang.",
        });
        router.replace(`${baseHref}/${saved.id}`);
      } else {
        const saved = await updateRecord(config.key, draft.id, draft);
        setSavedSnapshot(structuredClone(saved));
        toast.success("Đã cập nhật bản nháp", {
          description: "Thay đổi chưa được lưu vào hệ thống thực tế.",
        });
      }
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
          { label: config.moduleLabel, href: config.moduleHref },
          {
            label: config.title,
            href: config.kind === "collection" ? baseHref : undefined,
          },
          ...(config.kind === "collection" ? [{ label: mode === "create" ? "Tạo mới" : String(draft[config.titleField] ?? "Chỉnh sửa") }] : []),
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
          description={`${config.description} Dữ liệu mẫu FE-only, không có persistence thật.`}
          actions={
            <div className="flex items-center gap-2">
              {dirty && <Badge variant="warning">Có thay đổi chưa lưu</Badge>}
              <Button variant="outline" onClick={() => setPreviewOpen(true)}>
                Preview
              </Button>
            </div>
          }
        />
      </div>

      <EditorLayout
        aside={
          <>
            <EditorScopeCard />
            <div className="rounded-2xl border bg-card p-4">
              <h2 className="text-sm font-semibold">Thông tin bản nháp</h2>
              <div className="mt-4 space-y-3 text-xs text-muted-foreground">
                <p className="flex items-start gap-2">
                  <Hash className="mt-0.5 size-3.5 shrink-0" />
                  <span className="break-all">ID: {draft.id}</span>
                </p>
                <p className="flex items-start gap-2">
                  <FileText className="mt-0.5 size-3.5 shrink-0" />
                  <span>
                    {config.kind === "singleton"
                      ? "Nội dung singleton"
                      : "Resource dạng danh sách"}
                  </span>
                </p>
              </div>
            </div>
          </>
        }
      >
        {config.sections.map((editorSection) => (
          <EditorSection
            title={editorSection.title}
            description={editorSection.description}
            key={editorSection.id}
          >
            {editorSection.fields.map((field) => (
              <EditorField
                field={field}
                value={draft[field.key]}
                altValue={field.altKey ? String(draft[field.altKey] ?? "") : undefined}
                error={errors[field.key]}
                onChange={(value) => updateField(field.key, value)}
                onAltChange={
                  field.altKey
                    ? (value) => updateField(field.altKey as string, value)
                    : undefined
                }
                key={field.key}
              />
            ))}
          </EditorSection>
        ))}
      </EditorLayout>

      <EditorActionBar
        dirty={dirty}
        saving={saving}
        onPreview={() => setPreviewOpen(true)}
        onSave={saveDraft}
      />

      <ResourcePreviewDialog
        open={previewOpen}
        config={config}
        record={draft}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
}

function createEmptyRecord(config: AdminResourceConfig, order: number) {
  const draft: AdminCrudRecord = {
    id: `${config.path.split("/").at(-1)}-${Date.now()}`,
  };

  for (const field of config.sections.flatMap((item) => item.fields)) {
    if (field.type === "boolean") draft[field.key] = true;
    else if (field.type === "number")
      draft[field.key] = field.key === config.orderField ? order : field.min ?? 0;
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
      errors[field.key] = "Field này là bắt buộc.";
      continue;
    }

    if (field.type === "url" && !empty && !isValidContentUrl(String(value))) {
      errors[field.key] = "Dùng đường dẫn tương đối /... hoặc URL https:// hợp lệ.";
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
