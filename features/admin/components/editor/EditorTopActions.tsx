"use client";

import type { Ref } from "react";
import { useEffect, useRef, useState } from "react";
import { LoaderCircle, RotateCcw, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/** Chiều cao của `AdminHeader` (`fixed top-0 h-16`), tính bằng px. */
const ADMIN_HEADER_HEIGHT = 64;

/**
 * Theo dõi cụm nút ở đầu trang còn nằm trong tầm nhìn hay không, để thanh dính
 * ở đáy chỉ hiện khi cụm trên đã trôi mất — không bao giờ hiện cả hai cùng lúc.
 *
 * Gắn `topActionsRef` vào cụm nút đầu trang và truyền
 * `hidden={topActionsVisible}` cho `StickyEditorActions`.
 */
export function useEditorActionsVisibility() {
  const topActionsRef = useRef<HTMLDivElement>(null);
  const [topActionsVisible, setTopActionsVisible] = useState(true);

  useEffect(() => {
    const element = topActionsRef.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setTopActionsVisible(entry.isIntersecting),
      // Header cố định che mất dải trên cùng khung nhìn, nên trừ đúng chiều cao
      // của nó: nút chui xuống dưới header là coi như đã khuất.
      { rootMargin: `-${ADMIN_HEADER_HEIGHT}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { topActionsRef, topActionsVisible };
}

export interface EditorActionsProps {
  dirty: boolean;
  dirtyCount: number;
  saving: boolean;
  onSave: () => void;
  /** Bỏ trống ở những trình biên tập chưa có lịch sử hoàn tác. */
  onUndo?: () => void;
  onUndoAll?: () => void;
  saveLabel?: string;
}

/** Cụm nút dùng chung cho cả bản ở đầu trang lẫn bản dính theo màn hình. */
function EditorActionButtons({
  dirty,
  saving,
  onSave,
  onUndo,
  onUndoAll,
  saveLabel = "Lưu thay đổi",
  size,
}: EditorActionsProps & { size?: "sm" }) {
  return (
    <>
      {onUndo && (
        <Button type="button" size={size} variant="outline" disabled={!dirty || saving} onClick={onUndo}>
          <RotateCcw /> Hoàn tác
        </Button>
      )}
      {onUndoAll && (
        <Button type="button" size={size} variant="ghost" disabled={!dirty || saving} onClick={onUndoAll}>
          Hoàn tác tất cả
        </Button>
      )}
      <Button type="button" size={size} disabled={!dirty || saving} onClick={onSave}>
        {saving ? <LoaderCircle className="animate-spin" /> : <Save />}
        {saving ? "Đang lưu..." : saveLabel}
      </Button>
    </>
  );
}

/** Bản nằm trong tiêu đề trang — vẫn thấy được khi chưa cuộn. */
export function EditorTopActions({
  ref,
  ...props
}: EditorActionsProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2" ref={ref}>
      {props.dirty && (
        <Badge variant="warning" className="gap-2">
          <span className="size-2 rounded-full bg-brand" />
          {props.dirtyCount} thay đổi chưa lưu
        </Badge>
      )}
      <EditorActionButtons {...props} />
    </div>
  );
}

/**
 * Thanh hành động dính theo màn hình, đặt làm phần tử cuối của khung nội dung.
 *
 * Dùng `position: sticky` với mốc `bottom` nên khi cuộn giữa trang nó nổi sát
 * đáy màn hình, còn khi tới cuối trang thì trở về đúng vị trí tự nhiên của mình
 * — nhờ vậy field cuối cùng không bao giờ bị che vĩnh viễn.
 *
 * Chỉ hiện khi có thay đổi chưa lưu VÀ cụm nút ở đầu trang đã cuộn khuất
 * (`hidden`), để hai cụm không bao giờ xuất hiện cùng lúc.
 *
 * shadcn không có component "sticky" — đây là `position: sticky` của CSS ghép
 * với `button`/`badge`/`separator` của shadcn.
 */
export function StickyEditorActions({
  hidden = false,
  ...props
}: EditorActionsProps & { hidden?: boolean }) {
  if (!props.dirty || hidden) return null;

  return (
    // Lớp ngoài không bắt chuột để phần trống hai bên viên thuốc vẫn bấm xuyên
    // xuống nội dung phía dưới.
    <div className="pointer-events-none sticky bottom-4 z-30 mt-6 flex justify-center">
      <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border bg-background/80 px-2.5 py-2 shadow-[0_12px_32px_rgb(16_24_40/.16)] backdrop-blur-md duration-300 animate-in fade-in slide-in-from-bottom-3">
        <span className="flex items-center gap-2 px-2 text-xs font-semibold whitespace-nowrap text-brand">
          <span className="size-2 shrink-0 rounded-full bg-brand" />
          {props.dirtyCount} thay đổi chưa lưu
        </span>
        <Separator orientation="vertical" className="max-sm:hidden" />
        <EditorActionButtons {...props} size="sm" />
      </div>
    </div>
  );
}
