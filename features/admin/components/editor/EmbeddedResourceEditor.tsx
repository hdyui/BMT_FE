"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";

import { EditorField } from "@/features/admin/components/editor/EditorField";
import { EditorSection } from "@/features/admin/components/editor/EditorLayout";
import { useAdminCrud } from "@/features/admin/components/editor/AdminCrudProvider";
import { getEditableAdminSections } from "@/lib/admin/editor-field-visibility";
import type {
  AdminCrudRecord,
  AdminFieldValue,
  AdminResourceConfig,
} from "@/lib/admin/types/crud";
import { Button } from "@/components/ui/button";

export function EmbeddedResourceEditor({
  config,
}: {
  config: AdminResourceConfig;
}) {
  const { getRecords, updateRecord } = useAdminCrud();
  const record = getRecords(config.key)[0];
  const initialDraft = useMemo(
    () => structuredClone(record ?? ({ id: config.path } as AdminCrudRecord)),
    [config.path, record],
  );
  const [draft, setDraft] = useState(initialDraft);
  const [savedDraft, setSavedDraft] = useState(initialDraft);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<Array<{ key: string; previous: AdminFieldValue }>>([]);
  const editableSections = useMemo(
    () => getEditableAdminSections(config.sections),
    [config.sections],
  );
  const dirty = JSON.stringify(draft) !== JSON.stringify(savedDraft);
  const dirtyKeys = useMemo(() => {
    const keys = editableSections.flatMap((section) =>
      section.fields.map((field) => field.key),
    );
    return new Set(keys.filter((key) => JSON.stringify(draft[key]) !== JSON.stringify(savedDraft[key])));
  }, [draft, editableSections, savedDraft]);

  function updateField(key: string, value: AdminFieldValue) {
    const previous = draft[key] ?? "";
    if (JSON.stringify(previous) === JSON.stringify(value)) return;
    const next = { ...draft, [key]: value };
    setDraft(next);
    setHistory((current) => [...current, { key, previous: Array.isArray(previous) ? [...previous] : previous }]);
    if (JSON.stringify(next) === JSON.stringify(savedDraft)) setHistory([]);
  }

  function undoLast() {
    const action = history.at(-1);
    if (!action) return;
    const next = { ...draft, [action.key]: Array.isArray(action.previous) ? [...action.previous] : action.previous };
    setDraft(next);
    setHistory((current) => JSON.stringify(next) === JSON.stringify(savedDraft) ? [] : current.slice(0, -1));
  }

  function undoAll() {
    setDraft(structuredClone(savedDraft));
    setHistory([]);
  }

  async function save() {
    setSaving(true);
    try {
      const saved = await updateRecord(config.key, draft.id, draft);
      setSavedDraft(structuredClone(saved));
      setHistory([]);
      toast.success("Đã cập nhật nội dung phần mở đầu");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-6 overflow-hidden rounded-xl border bg-card shadow-[0_1px_2px_rgb(36_33_34/.035)]">
      <div className="flex flex-col gap-3 border-b bg-muted/20 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <h2 className="flex items-center gap-2 font-semibold">
            {dirty && <span className="size-2 rounded-full bg-brand" aria-label="Có thay đổi chưa lưu" />}
            {config.title}
          </h2>
          {config.description && (
            <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
          )}
          {dirty && <p className="mt-2 text-xs font-medium text-brand">{dirtyKeys.size} thay đổi chưa lưu</p>}
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {dirty && (
            <>
              <Button type="button" variant="outline" onClick={undoLast}>
                <RotateCcw /> Hoàn tác
              </Button>
              <Button type="button" variant="ghost" onClick={undoAll}>Hoàn tác tất cả</Button>
            </>
          )}
          <Button type="button" disabled={!dirty || saving} onClick={save}>
            <Save /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>
      <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-2">
        {editableSections.map((editorSection) => (
          <EditorSection
            title={editorSection.title}
            description={editorSection.description}
            dirtyCount={editorSection.fields.reduce(
              (count, field) => count + (dirtyKeys.has(field.key) || (field.altKey ? dirtyKeys.has(field.altKey) : false) ? 1 : 0),
              0,
            )}
            key={editorSection.id}
          >
            {editorSection.fields.map((field) => (
              <EditorField
                field={field}
                value={draft[field.key]}
                dirty={dirtyKeys.has(field.key) || (field.altKey ? dirtyKeys.has(field.altKey) : false)}
                onChange={(value) => updateField(field.key, value)}
                key={field.key}
              />
            ))}
          </EditorSection>
        ))}
      </div>
    </section>
  );
}
