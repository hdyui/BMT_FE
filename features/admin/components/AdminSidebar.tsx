"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  adminBrandIcon,
  adminNavigation,
} from "@/lib/admin/constants/navigation";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  collapsed?: boolean;
  mobile?: boolean;
  onCollapse?: () => void;
  onNavigate?: () => void;
}

export function AdminSidebar({
  collapsed = false,
  mobile = false,
  onCollapse,
  onNavigate,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const BrandIcon = adminBrandIcon;
  const showLabels = mobile || !collapsed;

  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar text-sidebar-foreground">
      <div
        className={cn(
          "flex h-[72px] shrink-0 items-center border-b border-sidebar-border px-4",
          !showLabels && "justify-center px-2",
          showLabels && !mobile && "justify-center px-2 xl:justify-start xl:px-4",
        )}
      >
        <Link
          href="/admin/dashboard"
          onClick={onNavigate}
          className="flex min-w-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/30"
          aria-label="BMT Admin"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand text-charcoal shadow-[inset_0_1px_0_rgb(255_255_255/.35)]">
            <BrandIcon className="size-5" strokeWidth={1.8} />
          </span>
          {showLabels && (
            <span
              className={cn(
                "min-w-0 leading-none",
                !mobile && "hidden xl:block",
              )}
            >
              <strong className="block truncate text-sm tracking-[0.12em]">
                BMT ADMIN
              </strong>
              <span className="mt-1 block text-[11px] text-muted-foreground">
                Content workspace
              </span>
            </span>
          )}
        </Link>
      </div>

      <nav className="admin-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4">
        {adminNavigation.map((section, sectionIndex) => (
          <div
            key={section.label}
            className={cn(sectionIndex > 0 && "mt-5")}
          >
            {showLabels && (
              <p
                className={cn(
                  "mb-2 px-2 text-[10px] font-bold tracking-[0.14em] text-muted-foreground uppercase",
                  !mobile && "hidden xl:block",
                )}
              >
                {section.label}
              </p>
            )}
            {!mobile && sectionIndex > 0 && (
              <div
                className={cn(
                  "mx-2 mb-3 h-px bg-sidebar-border",
                  !collapsed && "xl:hidden",
                )}
              />
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    aria-label={item.label}
                    title={!mobile ? item.label : undefined}
                    className={cn(
                      "group/nav relative flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium outline-none transition-colors duration-150 focus-visible:ring-3 focus-visible:ring-sidebar-ring/30",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      !showLabels && "justify-center px-2",
                      showLabels &&
                        !mobile &&
                        "justify-center px-2 xl:justify-start xl:px-3",
                    )}
                  >
                    {active && (
                      <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-brand" />
                    )}
                    <Icon
                      className={cn(
                        "size-[18px] shrink-0",
                        active && "text-brand",
                      )}
                      strokeWidth={1.75}
                    />
                    {showLabels && (
                      <span
                        className={cn(
                          "truncate",
                          !mobile && "hidden xl:inline",
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!mobile && (
        <div className="hidden shrink-0 border-t border-sidebar-border p-3 xl:block">
          <button
            type="button"
            onClick={onCollapse}
            className={cn(
              "flex h-9 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/30",
              collapsed && "justify-center px-2",
            )}
            aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <>
                <ChevronLeft className="size-4" />
                <span>Thu gọn sidebar</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
