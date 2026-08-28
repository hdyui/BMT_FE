"use client";

import { useMemo, useState } from "react";
import { Eye, LoaderCircle, Save } from "lucide-react";
import { toast } from "sonner";

import { useAdminCrud } from "@/features/admin/components/editor/AdminCrudProvider";
import { EditorField } from "@/features/admin/components/editor/EditorField";
import type {
  AdminCrudRecord,
  AdminFieldValue,
  AdminSectionSettingsConfig,
  AdminValidationErrors,
} from "@/features/admin/lib/types/crud";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

export function AdminSectionSettings({
  settings,
}: {
  settings: AdminSectionSettingsConfig;
}) {
  const { getRecords, updateRecord } = useAdminCrud();
  const storedRecord = getRecords(settings.key)[0] ?? settings.initialRecord;
  const initialDraft = useMemo(() => structuredClone(storedRecord), [storedRecord]);
  const [draft, setDraft] = useState<AdminCrudRecord>(initialDraft);
  const [savedSnapshot, setSavedSnapshot] = useState<AdminCrudRecord>(initialDraft);
  const [errors, setErrors] = useState<AdminValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(savedSnapshot);

  function updateField(key: string, value: AdminFieldValue) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function save() {
    const nextErrors: AdminValidationErrors = {};
    for (const field of settings.fields) {
      const value = draft[field.key];
      if (
        field.required &&
        (value === undefined || value === "" ||
          (Array.isArray(value) && value.filter(Boolean).length === 0))
      ) {
        nextErrors[field.key] = "Field này là bắt buộc.";
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Vui lòng bổ sung nội dung section");
      return;
    }

    setSaving(true);
    try {
      const saved = await updateRecord(settings.key, draft.id, draft);
      setSavedSnapshot(structuredClone(saved));
      toast.success("Đã cập nhật thiết lập section", {
        description: "Thay đổi chỉ tồn tại trong phiên hiện tại.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className="mt-5 overflow-hidden rounded-xl border bg-card shadow-[0_1px_2px_rgb(16_24_40/.04)]">
        <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[15px] font-semibold">{settings.title}</h2>
              {dirty && <Badge variant="warning">Chưa lưu</Badge>}
            </div>
            {settings.description && (
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {settings.description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
              <Eye /> Preview
            </Button>
            <Button type="button" size="sm" disabled={saving || !dirty} onClick={save}>
              {saving ? <LoaderCircle className="animate-spin" /> : <Save />}
              Save Draft
            </Button>
          </div>
        </div>
        <div className="grid gap-5 p-5 sm:p-6">
          {settings.fields.map((field) => (
            <EditorField
              field={field}
              value={draft[field.key]}
              error={errors[field.key]}
              onChange={(value) => updateField(field.key, value)}
              key={field.key}
            />
          ))}
        </div>
      </section>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="admin-theme-surface">
          <DialogHeader>
            <DialogTitle>Preview tiêu đề section</DialogTitle>
            <DialogDescription>
              Nội dung được đặt vào layout cố định do developer quản lý.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border bg-background px-5 py-10 text-center sm:px-8">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-brand uppercase">
              BMT Decor
            </p>
            <h2 className="mx-auto mt-2 max-w-xl whitespace-pre-line text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
              {String(draft[settings.previewTitleField] ?? "Chưa có tiêu đề")}
            </h2>
            <div className="mx-auto mt-4 h-0.5 w-24 bg-brand" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
