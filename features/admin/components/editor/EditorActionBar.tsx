"use client";

import { Eye, LoaderCircle, RotateCcw, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function EditorActionBar({
  dirty,
  saving,
  dirtyCount,
  onPreview,
  onUndo,
  onUndoAll,
  onSave,
}: {
  dirty: boolean;
  saving: boolean;
  dirtyCount: number;
  onPreview?: () => void;
  onUndo: () => void;
  onUndoAll: () => void;
  onSave: () => void;
}) {
  return (
    <div className="sticky bottom-3 z-20 mt-6 flex flex-col gap-3 rounded-2xl border bg-card/95 p-3 shadow-[0_18px_55px_rgb(36_33_34/.14)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 px-1">
        <span
          className={`size-2 rounded-full ${dirty ? "bg-brand" : "bg-muted-foreground/35"}`}
        />
        <span className="text-xs font-medium text-muted-foreground">
          {dirty ? `${dirtyCount} thay đổi chưa lưu` : "Không có thay đổi mới"}
        </span>
        {dirty && <Badge variant="secondary">Bản nháp</Badge>}
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        {onPreview && (
          <Button type="button" variant="outline" onClick={onPreview}>
            <Eye /> Xem trước
          </Button>
        )}
        {dirty && (
          <>
            <Button type="button" variant="outline" onClick={onUndo}>
              <RotateCcw /> Hoàn tác
            </Button>
            <Button type="button" variant="ghost" onClick={onUndoAll}>
              Hoàn tác tất cả
            </Button>
          </>
        )}
        <Button type="button" disabled={!dirty || saving} onClick={onSave}>
          {saving ? <LoaderCircle className="animate-spin" /> : <Save />}
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}
