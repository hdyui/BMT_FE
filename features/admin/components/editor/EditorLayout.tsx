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
        "mt-6 grid min-w-0 gap-6",
        aside && "xl:grid-cols-[minmax(0,1fr)_300px]",
      )}
    >
      <div className="grid min-w-0 gap-6">{children}</div>
      {aside && <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">{aside}</aside>}
    </div>
  );
}
export function EditorSection({
  title,
  description,
  dirtyCount = 0,
  children,
}: {
  title: string;
  description?: string;
  dirtyCount?: number;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-[0_1px_2px_rgb(36_33_34/.035)]">
      <div className="border-b bg-muted/20 px-5 py-4 sm:px-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
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
      <div className="grid gap-x-6 gap-y-5 p-5 sm:p-6 lg:grid-cols-2">{children}</div>
    </section>
  );
}
