import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import type { AdminModuleScopeItem } from "@/lib/admin/types/content";

export function AdminModuleShell({
  title,
  description,
  items,
  footnote,
}: {
  title: string;
  description: string;
  items: AdminModuleScopeItem[];
  footnote?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader title={title} description={description} />
      <section className="mt-8">
        <div className="flex items-center gap-3 py-5">
          <Layers3 className="size-4 text-brand" />
          <div>
            <h2 className="text-sm font-semibold">Các nhóm nội dung</h2>
            <p className="text-xs text-muted-foreground">
              Chọn nhóm cần xem hoặc cập nhật
            </p>
          </div>
        </div>
        <div className="grid border-t border-border/70 md:grid-cols-2">
          {items.map((item, index) => {
            const className = `group flex min-h-32 items-start gap-4 border-b border-border/70 py-5 transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30 md:px-5 ${
              index % 2 === 0 ? "md:border-r md:pl-0" : "md:pr-0"
            }`;
            const content = (
              <>
              <span className="mt-0.5 shrink-0 text-xs font-semibold tabular-nums text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.count && (
                    <span className="text-xs text-muted-foreground">
                      {item.count}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                {item.href && (
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
                    Quản lý <ArrowRight className="size-3.5" />
                  </span>
                )}
              </div>
              {item.href && (
                <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
              )}
              </>
            );

            return item.href ? (
              <Link className={className} href={item.href} key={item.title}>
                {content}
              </Link>
            ) : (
              <article className={className} key={item.title}>
                {content}
              </article>
            );
          })}
        </div>
      </section>

      {footnote && (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {footnote}
        </p>
      )}
    </div>
  );
}
