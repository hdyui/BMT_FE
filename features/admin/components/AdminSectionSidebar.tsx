"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  getActiveContentPageHref,
  getAdminSidebar,
} from "@/lib/admin/admin-sidebar";
import type { AdminSidebarLink } from "@/lib/admin/admin-sidebar";
import { cn } from "@/lib/utils";

/**
 * Sidebar của mục đang mở trên header. Luôn hiện — kể cả ở màn hình chỉnh sửa
 * — nên admin không bao giờ bị mất điều hướng giữa chừng.
 *
 * Dưới `lg` sidebar nằm thành một dải cuộn được phía trên nội dung thay vì cột
 * bên trái, để màn hẹp không bị bóp phần nội dung.
 */
export function AdminSectionSidebar() {
  const pathname = usePathname();
  const sidebar = getAdminSidebar(pathname);
  // Ở màn hình chỉnh sửa sâu, tô sáng trang nội dung chứa nó thay vì để trống.
  const contentHref = getActiveContentPageHref(pathname);

  function isActive(href: string) {
    return pathname === href || href === contentHref;
  }

  /** Cha được tô sáng khi chính nó hoặc một trang con đang mở. */
  function isBranchActive(item: AdminSidebarLink) {
    return (
      isActive(item.href) ||
      (item.children?.some((child) => isActive(child.href)) ?? false)
    );
  }

  return (
    // `lg:left-0` là bắt buộc: khung ngoài đã chừa `pl-[232px]`, không ghim trái
    // thì thẻ `fixed` lấy vị trí tĩnh và trôi sang phải mất 232px.
    <aside
      data-admin-sidebar
      className="border-b border-sidebar-border bg-sidebar text-sidebar-foreground lg:fixed lg:top-16 lg:bottom-0 lg:left-0 lg:w-[232px] lg:border-r lg:border-b-0"
    >
      <div className="admin-scrollbar max-h-[42dvh] overflow-y-auto p-3 lg:h-full lg:max-h-none">
        <p className="px-2.5 pb-2 text-[10px] font-bold tracking-[0.12em] text-sidebar-foreground/50 uppercase">
          {sidebar.title}
        </p>
        <nav aria-label={`Điều hướng mục ${sidebar.title}`} className="space-y-3">
          {sidebar.groups.map((group, groupIndex) => (
            <div key={group.label ?? groupIndex}>
              {group.label && (
                <p className="px-2.5 pb-1 text-[11px] font-semibold text-sidebar-foreground/60">
                  {group.label}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <SidebarLink item={item} active={isBranchActive(item)} />
                    {item.children && (
                      <ul className="mt-1 space-y-1 border-l border-sidebar-border pl-2.5">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <SidebarLink item={child} active={isActive(child.href)} nested />
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function SidebarLink({
  item,
  active,
  nested = false,
}: {
  item: AdminSidebarLink;
  active: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md px-2.5 outline-none transition-colors hover:bg-brand/10 focus-visible:ring-3 focus-visible:ring-ring/25",
        nested ? "h-7 text-[13px]" : "h-8 text-[13px]",
        active && "bg-sidebar-accent font-semibold text-brand",
      )}
    >
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="shrink-0 text-[10px] font-normal tabular-nums text-sidebar-foreground/50">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
