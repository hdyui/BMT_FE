import type { ReactNode } from "react";

export function AdminPageHeader({
  title,
  description,
  eyebrow,
  actions,
}: {
  title: string;
  /** Trang chỉnh sửa bỏ trống mục này — chỉ còn tiêu đề và nút thao tác. */
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold tracking-[0.12em] text-brand uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-[-0.035em] sm:text-[30px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
