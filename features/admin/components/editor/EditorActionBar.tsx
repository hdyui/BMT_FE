"use client";

import { Eye, LoaderCircle, Save } from "lucide-react";

import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";

export function EditorActionBar({
  dirty,
  saving,
  onPreview,
  onSave,
}: {
  dirty: boolean;
  saving: boolean;
  onPreview: () => void;
  onSave: () => void;
}) {
  return (
    <div className="sticky bottom-3 z-20 mt-6 flex flex-col gap-3 rounded-2xl border bg-card/95 p-3 shadow-[0_18px_55px_rgb(36_33_34/.14)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 px-1">
        <span
          className={`size-2 rounded-full ${dirty ? "bg-brand" : "bg-muted-foreground/35"}`}
        />
        <span className="text-xs font-medium text-muted-foreground">
          {dirty ? "Có thay đổi chưa lưu" : "Không có thay đổi mới"}
        </span>
        {dirty && <Badge variant="secondary">Bản nháp</Badge>}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <Button type="button" variant="outline" onClick={onPreview}>
          <Eye /> Preview
        </Button>
        <Button type="button" disabled={saving} onClick={onSave}>
          {saving ? <LoaderCircle className="animate-spin" /> : <Save />}
          Save Draft
        </Button>
      </div>
    </div>
  );
}
