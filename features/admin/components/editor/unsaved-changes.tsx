"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/features/admin/components/ui/button";

/**
 * Hai lớp bảo vệ cho thao tác lưu của admin, dùng chung cho mọi trình biên tập:
 *
 * 1. `confirmEditorSave` — bấm "Lưu thay đổi" thì hỏi lại trước khi ghi đè.
 * 2. `useUnsavedChangesGuard` — đang có thay đổi chưa lưu mà rời trang thì chặn
 *    lại, cho chọn "Lưu và thoát" / "Thoát, không lưu" / "Ở lại". Chặn cả 3 lối
 *    ra: bấm link trong admin, bấm nút Back/Forward của trình duyệt, và đóng
 *    tab / tải lại trang (lối này buộc dùng hộp thoại mặc định của trình duyệt).
 *
 * Hai hộp xác nhận đều hiện bằng toaster (sonner) đã gắn sẵn ở `app/layout.tsx`.
 */

/** Dùng chung một id để hộp xác nhận mới thay thế hộp cũ, không xếp chồng. */
const CONFIRM_TOAST_ID = "admin-editor-confirm";

interface ConfirmChoice {
  label: string;
  variant?: "default" | "outline" | "ghost" | "destructive";
  onSelect?: () => unknown;
}

function showConfirmToast({
  title,
  description,
  choices,
}: {
  title: string;
  description?: string;
  choices: ConfirmChoice[];
}) {
  toast.custom(
    (id) => (
      <div className="w-[min(26rem,calc(100vw-2rem))] rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <span className="size-2 shrink-0 rounded-full bg-brand" />
          {title}
        </p>
        {description && (
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        <div className="mt-3.5 flex flex-wrap justify-end gap-2">
          {choices.map((choice) => (
            <Button
              type="button"
              size="sm"
              variant={choice.variant}
              key={choice.label}
              onClick={() => {
                toast.dismiss(id);
                void choice.onSelect?.();
              }}
            >
              {choice.label}
            </Button>
          ))}
        </div>
      </div>
    ),
    { id: CONFIRM_TOAST_ID, duration: Infinity },
  );
}

/** Hỏi lại trước khi lưu. `save` chỉ chạy khi admin bấm xác nhận. */
export function confirmEditorSave(dirtyCount: number, save: () => unknown) {
  showConfirmToast({
    title: "Lưu các thay đổi?",
    description: `${dirtyCount} nội dung sẽ được cập nhật và hiển thị trên website.`,
    choices: [
      { label: "Xem lại", variant: "ghost" },
      { label: "Lưu thay đổi", onSelect: save },
    ],
  });
}

export function useUnsavedChangesGuard({
  dirty,
  dirtyCount,
  save,
}: {
  dirty: boolean;
  dirtyCount: number;
  /** Trả về `false` khi lưu không thành công (ví dụ còn ô chưa hợp lệ). */
  save: () => Promise<boolean>;
}) {
  const router = useRouter();
  // Giữ giá trị mới nhất trong ref để các listener bên dưới chỉ cần gắn một lần.
  const stateRef = useRef({ dirty, dirtyCount, save });
  useEffect(() => {
    stateRef.current = { dirty, dirtyCount, save };
  });

  /**
   * Nút Back không chặn được như bấm link — trình duyệt lùi xong mới báo. Nên
   * khi bản nháp bắt đầu bẩn ta chèn một "chốt chặn": một entry history trùng
   * URL hiện tại. Lần Back đầu tiên chỉ ăn vào chốt đó, trang không đổi, ta có
   * chỗ để hỏi lại rồi mới lùi tiếp cho đủ.
   */
  const sentinelRef = useRef(false);
  /** Bật khi chính ta chủ động lùi, để `popstate` lần đó không hỏi lại nữa. */
  const skipNextPopStateRef = useRef(false);

  useEffect(() => {
    // Giữ nguyên `history.state` của Next để entry chốt chặn vẫn còn cây route,
    // tránh việc quay lại nó bị tải lại cả trang.
    if (dirty && !sentinelRef.current) {
      window.history.pushState(window.history.state, "", window.location.href);
      sentinelRef.current = true;
    }
  }, [dirty]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!stateRef.current.dirty) return;
      // Đóng tab hoặc tải lại trang thì chỉ có hộp thoại mặc định của trình duyệt.
      event.preventDefault();
    }

    function handleClick(event: MouseEvent) {
      if (!stateRef.current.dirty || event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const target = new URL(anchor.href, window.location.href);
      if (target.origin !== window.location.origin) return;
      if (target.pathname === window.location.pathname && target.search === window.location.search) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const destination = `${target.pathname}${target.search}${target.hash}`;
      const { dirtyCount: pendingCount, save: saveDraft } = stateRef.current;
      showConfirmToast({
        title: "Bạn có thay đổi chưa lưu",
        description: `${pendingCount} nội dung sẽ mất nếu rời khỏi trang mà không lưu.`,
        choices: [
          { label: "Ở lại", variant: "ghost" },
          {
            label: "Thoát, không lưu",
            variant: "outline",
            onSelect: () => router.push(destination),
          },
          {
            label: "Lưu và thoát",
            onSelect: async () => {
              if (await saveDraft()) router.push(destination);
            },
          },
        ],
      });
    }

    function handlePopState() {
      if (skipNextPopStateRef.current) {
        skipNextPopStateRef.current = false;
        return;
      }
      // Không có chốt chặn nghĩa là cú Back này không phải do ta dựng ra.
      if (!sentinelRef.current) return;
      sentinelRef.current = false;

      if (!stateRef.current.dirty) {
        // Đã lưu xong: nuốt luôn entry thừa để một cú Back là ra được thật.
        skipNextPopStateRef.current = true;
        window.history.go(-1);
        return;
      }

      // Còn thay đổi: dựng lại chốt chặn để đứng yên tại chỗ, rồi mới hỏi.
      window.history.pushState(window.history.state, "", window.location.href);
      sentinelRef.current = true;

      const { dirtyCount: pendingCount, save: saveDraft } = stateRef.current;
      // Lùi 2 bước: một cho chốt chặn vừa dựng lại, một cho trang thật.
      const leave = () => {
        skipNextPopStateRef.current = true;
        sentinelRef.current = false;
        window.history.go(-2);
      };

      showConfirmToast({
        title: "Bạn có thay đổi chưa lưu",
        description: `${pendingCount} nội dung sẽ mất nếu rời khỏi trang mà không lưu.`,
        choices: [
          { label: "Ở lại", variant: "ghost" },
          { label: "Thoát, không lưu", variant: "outline", onSelect: leave },
          {
            label: "Lưu và thoát",
            onSelect: async () => {
              if (await saveDraft()) leave();
            },
          },
        ],
      });
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleClick, true);
      toast.dismiss(CONFIRM_TOAST_ID);
    };
  }, [router]);
}
