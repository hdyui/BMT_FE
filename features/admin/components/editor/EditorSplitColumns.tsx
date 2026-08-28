"use client";

import type { ReactNode } from "react";

/**
 * Chia ô nhập thành hai cột đúng như website xếp chúng trái/phải.
 *
 * Dùng chung cho cả trình biên tập bản ghi lẫn trình biên tập nội dung đơn.
 */
export function EditorSplitColumns({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-10">
      <div className="space-y-4">{left}</div>
      <div className="space-y-4">{right}</div>
    </div>
  );
}
