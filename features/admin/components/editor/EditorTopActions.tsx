"use client";

import { LoaderCircle, RotateCcw, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function EditorTopActions({
  dirty,
  dirtyCount,
  saving,
  onUndo,
  onUndoAll,
  onSave,
}: {
  dirty: boolean;
  dirtyCount: number;
  saving: boolean;
  onUndo: () => void;
  onUndoAll: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {dirty && (
        <Badge variant="warning" className="gap-2">
          <span className="size-2 rounded-full bg-brand" />
          {dirtyCount} thay đổi chưa lưu
        </Badge>
      )}
      <Button type="button" variant="outline" disabled={!dirty || saving} onClick={onUndo}>
        <RotateCcw /> Hoàn tác
      </Button>
      <Button type="button" variant="ghost" disabled={!dirty || saving} onClick={onUndoAll}>
        Hoàn tác tất cả
      </Button>
      <Button type="button" disabled={!dirty || saving} onClick={onSave}>
        {saving ? <LoaderCircle className="animate-spin" /> : <Save />}
        {saving ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </div>
  );
}
