import { LockKeyhole } from "lucide-react";

export function LockedDesignNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-brand/15 bg-brand/[0.055] px-4 py-3 text-sm ${className}`}
    >
      <LockKeyhole className="mt-0.5 size-4 shrink-0 text-brand" />
      <p className="leading-relaxed text-muted-foreground">
        <strong className="font-semibold text-foreground">
          Layout & Style được quản lý trong source code.
        </strong>{" "}
        Admin chỉ thay đổi nội dung, hình ảnh, liên kết và thứ tự hiển thị.
      </p>
    </div>
  );
}
