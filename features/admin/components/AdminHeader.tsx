"use client";

import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  UserRound,
} from "lucide-react";

import { adminPageMeta } from "@/lib/admin/constants/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { ThemeSwitcher } from "@/features/admin/components/ThemeSwitcher";

interface AdminHeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileMenu: () => void;
}

export function AdminHeader({
  collapsed,
  onToggleSidebar,
  onOpenMobileMenu,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const metaKey = Object.keys(adminPageMeta)
    .filter((key) => pathname === key || pathname.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0];
  const meta = adminPageMeta[metaKey] ?? adminPageMeta["/admin/dashboard"];
  const CollapseIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center gap-3 border-b bg-background/92 px-4 backdrop-blur-xl sm:px-5 lg:px-7">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="inline-flex size-9 items-center justify-center rounded-lg border bg-card outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 md:hidden"
        aria-label="Mở menu Admin"
      >
        <Menu className="size-4" />
      </button>
      <button
        type="button"
        onClick={onToggleSidebar}
        className="hidden size-9 items-center justify-center rounded-lg border bg-card outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 xl:inline-flex"
        aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
      >
        <CollapseIcon className="size-4" />
      </button>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold sm:text-[15px]">{meta.title}</p>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">
          {meta.description}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="hidden h-9 w-[min(20vw,240px)] items-center gap-2 rounded-lg border bg-card px-3 text-left text-sm text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 lg:flex"
          aria-label="Tìm kiếm nội dung"
        >
          <Search className="size-4" />
          <span className="truncate">Tìm nội dung</span>
          <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
            Ctrl K
          </kbd>
        </button>
        <ThemeSwitcher />
        <button
          type="button"
          className="relative inline-flex size-9 items-center justify-center rounded-lg border bg-card outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30"
          aria-label="Thông báo"
        >
          <Bell className="size-4" strokeWidth={1.8} />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-brand ring-2 ring-card" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-9 items-center gap-2 rounded-lg border bg-card p-1 pr-2 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30">
            <span className="grid size-7 place-items-center rounded-md bg-charcoal text-[11px] font-bold text-white">
              BA
            </span>
            <span className="hidden text-left lg:block">
              <span className="block text-xs font-semibold leading-none">
                BMT Admin
              </span>
              <span className="mt-1 block text-[10px] leading-none text-muted-foreground">
                Content editor
              </span>
            </span>
            <ChevronDown className="hidden size-3.5 text-muted-foreground lg:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="admin-theme-surface w-52"
            align="end"
            sideOffset={8}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Tài khoản demo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2">
                <UserRound /> Hồ sơ
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 text-muted-foreground" disabled>
                <LogOut /> Đăng xuất khi có Auth
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
