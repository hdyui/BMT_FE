import Link from "next/link";
import { ArrowUpRight, FilePenLine } from "lucide-react";

import type { AdminModuleScopeItem } from "@/features/admin/lib/types/content";

export function AdminSectionHub({ items }: { items: AdminModuleScopeItem[] }) {
  return (
    <nav
      aria-label="Chọn phần nội dung cần quản lý"
      className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {items.map((item) => {
        const content = (
          <>
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors duration-200 group-hover:bg-brand/10 group-hover:text-brand">
              <FilePenLine className="size-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground sm:text-[15px]">
                {item.title}
              </span>
              <span className="mt-1 line-clamp-2 block text-[13px] leading-5 text-muted-foreground">
                {item.description}
              </span>
            </span>
            <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
          </>
        );

        return item.href ? (
          <Link
            href={item.href}
            className="group flex min-h-24 items-start gap-3 rounded-xl border bg-card p-5 shadow-[0_1px_2px_rgb(16_24_40/.04)] outline-none transition-[background-color,border-color,box-shadow] duration-200 hover:border-brand/25 hover:bg-muted/30 hover:shadow-[0_4px_8px_-2px_rgb(16_24_40/.08)] focus-visible:ring-3 focus-visible:ring-ring/20"
            key={item.title}
          >
            {content}
          </Link>
        ) : (
          <article
            className="flex min-h-24 items-start gap-3 rounded-xl border bg-card p-5 shadow-[0_1px_2px_rgb(16_24_40/.04)]"
            key={item.title}
          >
            {content}
          </article>
        );
      })}
    </nav>
  );
}
