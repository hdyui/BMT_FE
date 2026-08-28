import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";

export interface ContentGroupItem {
  title: string;
  description: string;
  count?: string;
  href: string;
}

/**
 * Danh sách các nhóm nội dung của một trang: xếp dọc, mỗi nhóm một dòng có số
 * thứ tự 01, 02… Dùng chung cho "Nội dung trang" và Hệ thống → Cấu hình để hai
 * chỗ nhìn giống nhau.
 */
export function ContentGroupGrid({
  title,
  description,
  items,
  startIndex = 0,
}: {
  title?: string;
  description?: string;
  items: ContentGroupItem[];
  /** Cho phép nhiều nhóm trên cùng một trang tiếp tục số thứ tự thay vì reset về 01. */
  startIndex?: number;
}) {
  return (
    <section className="mt-1">
      {(title || description) && (
        <div className="flex items-center gap-3 py-5">
          <Layers3 className="size-4 text-brand" />
          <div>
            {title && <h2 className="text-sm font-semibold">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        </div>
      )}
      <div>
        {items.map((item, index) => (
          <Link
            className="flex items-start gap-4 border-b border-border/70 py-5 outline-none last:border-b-0 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30 sm:gap-5"
            href={item.href}
            key={item.href}
          >
            <span className="mt-0.5 shrink-0 text-xs font-semibold tabular-nums text-brand">
              {String(startIndex + index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{item.title}</h3>
                {item.count && <span className="text-xs text-muted-foreground">{item.count}</span>}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
                Quản lý <ArrowRight className="size-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
