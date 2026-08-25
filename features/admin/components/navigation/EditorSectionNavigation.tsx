"use client";

import { cn } from "@/lib/utils";

export interface EditorSectionNavigationItem {
  id: string;
  title: string;
  meta?: string;
  status: "complete" | "incomplete" | "neutral";
}

export function EditorSectionNavigation({
  items,
  activeId,
  onSelect,
  variant = "sidebar",
  className,
}: {
  items: EditorSectionNavigationItem[];
  activeId: string;
  onSelect: (id: string) => void;
  variant?: "sidebar" | "horizontal";
  className?: string;
}) {
  if (variant === "horizontal") {
    return (
      <nav
        aria-label="Các phần của nội dung"
        className={cn(
          "admin-scrollbar flex snap-x gap-1.5 overflow-x-auto rounded-lg border bg-card p-1.5 shadow-[0_1px_2px_rgb(16_24_40/.03)] xl:hidden",
          className,
        )}
      >
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              type="button"
              aria-current={active ? "location" : undefined}
              onClick={() => onSelect(item.id)}
              className={cn(
                "relative shrink-0 snap-start rounded-lg px-3 py-2 text-left text-xs font-medium text-muted-foreground outline-none transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30",
                active && "bg-brand/10 font-semibold text-brand",
              )}
              key={item.id}
            >
              {item.title}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Các phần của nội dung"
      className={cn(
        "hidden rounded-xl border bg-card p-3 shadow-[0_1px_2px_rgb(16_24_40/.03)] xl:block",
        className,
      )}
    >
      <p className="px-2 pb-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
        Thiết lập
      </p>
      <div className="space-y-1">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              type="button"
              aria-current={active ? "location" : undefined}
              onClick={() => onSelect(item.id)}
              className={cn(
                "group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left outline-none transition-colors duration-200 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30",
                active && "bg-brand/10 text-brand",
              )}
              key={item.id}
            >
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full bg-muted-foreground/35",
                  item.status === "complete" &&
                    "bg-emerald-500",
                  item.status === "incomplete" &&
                    "bg-amber-500",
                )}
                aria-label={
                  item.status === "complete"
                    ? "Đã đủ trường bắt buộc"
                    : item.status === "incomplete"
                      ? "Còn thiếu trường bắt buộc"
                      : "Không có trường bắt buộc"
                }
              />
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block truncate text-xs font-medium",
                    active
                      ? "font-semibold text-brand"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {item.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
