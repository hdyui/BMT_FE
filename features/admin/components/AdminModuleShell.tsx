import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import type { AdminModuleScopeItem } from "@/features/admin/lib/types/content";

export function AdminModuleShell({
  title,
  description,
  items,
  footnote,
  singleColumnOrange = false,
}: {
  title: string;
  description: string;
  items: AdminModuleScopeItem[];
  footnote?: string;
  singleColumnOrange?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader title={title} description={description} />
      <section
        className={
          singleColumnOrange
            ? "mt-6 space-y-4"
            : "mt-6 overflow-hidden rounded-2xl border bg-card"
        }
      >
        {!singleColumnOrange && (
          <div className="flex items-center gap-3 border-b px-5 py-4 sm:px-6">
            <span className="grid size-9 place-items-center rounded-xl bg-muted text-brand">
              <Layers3 className="size-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold">Các nhóm nội dung</h2>
              <p className="text-xs text-muted-foreground">
                Chọn nhóm cần xem hoặc cập nhật
              </p>
            </div>
          </div>
        )}
        <div
          className={
            singleColumnOrange
              ? "space-y-4"
              : "grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0"
          }
        >
          {items.map((item, index) => {
            const className = singleColumnOrange
              ? "group flex min-h-32 items-start gap-4 rounded-2xl border border-brand/25 bg-brand/[0.035] p-5 shadow-[0_10px_28px_rgb(244_122_42/.06)] outline-none transition-[border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand/[0.055] hover:shadow-[0_14px_34px_rgb(244_122_42/.1)] focus-visible:ring-3 focus-visible:ring-brand/25 sm:p-6"
              : `group flex min-h-36 items-start gap-4 p-5 transition-colors hover:bg-muted/55 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30 sm:p-6 ${
                  index >= 2 ? "md:border-t" : ""
                }`;
            const content = (
              <>
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-lg border bg-background text-xs font-bold text-brand ${singleColumnOrange ? "border-brand/25" : ""}`}
                >
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
                  <ArrowRight
                    className={`mt-1 size-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${singleColumnOrange ? "text-brand" : "text-muted-foreground group-hover:text-brand"}`}
                  />
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
