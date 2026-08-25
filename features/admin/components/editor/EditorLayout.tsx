import type { ReactNode } from "react";

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
      <div className="grid min-w-0 gap-5">{children}</div>
      {aside && <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">{aside}</aside>}
    </div>
  );
}
export function EditorSection({
  title,
  description,
  dirtyCount = 0,
  prominent = false,
  singleColumn = false,
  children,
}: {
  title: string;
  description?: string;
  dirtyCount?: number;
  prominent?: boolean;
  singleColumn?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-[0_12px_38px_rgb(36_33_34/.035)]">
      <div className="border-b px-5 py-4 sm:px-6">
        <h2
          className={cn(
            "flex items-center gap-2",
            prominent ? "text-lg font-bold" : "text-sm font-semibold",
          )}
        >
          {dirtyCount > 0 && (
            <span className="size-2 rounded-full bg-brand" aria-label={`${dirtyCount} thay đổi chưa lưu`} />
          )}
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div
        className={cn(
          "grid gap-5 p-5 sm:p-6",
          !singleColumn && "lg:grid-cols-2",
        )}
      >
        {children}
      </div>
    </section>
  );
}
