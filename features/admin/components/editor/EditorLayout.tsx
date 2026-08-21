import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

export function EditorLayout({
  children,
  aside,
}: {
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mt-6 grid min-w-0 gap-5",
        aside && "xl:grid-cols-[minmax(0,1fr)_300px]",
      )}
    >
      <div className="min-w-0 space-y-5">{children}</div>
      {aside && <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">{aside}</aside>}
    </div>
  );
}

export function EditorSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-[0_12px_38px_rgb(36_33_34/.035)]">
      <div className="border-b px-5 py-4 sm:px-6">
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="grid gap-5 p-5 sm:p-6">{children}</div>
    </section>
  );
}

export function EditorScopeCard() {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
          <ShieldCheck className="size-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold">Phạm vi được khóa</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Admin chỉ thay đổi nội dung và hình ảnh. Layout, style và hành vi
            responsive do developer quản lý trong source code.
          </p>
        </div>
      </div>
    </div>
  );
}
