"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { Bell, LogOut, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/features/admin/components/ThemeSwitcher";
import { logoutAdmin } from "@/features/admin/auth/actions";
import { adminPageMeta } from "@/lib/admin/constants/navigation";

export function AdminHeader({ hideNavigation = false }: { hideNavigation?: boolean }) {
  const pathname = usePathname();
  const [loggingOut, startLogout] = useTransition();
  const { isMobile, state } = useSidebar();
  const metaKey = Object.keys(adminPageMeta)
    .filter((key) => pathname === key || pathname.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0];
  const meta = adminPageMeta[metaKey] ?? adminPageMeta["/admin/dashboard"];
  const leftOffset =
    hideNavigation || isMobile
      ? "0px"
      : state === "collapsed"
        ? "var(--sidebar-width-icon)"
        : "var(--sidebar-width)";

  function handleLogout() {
    const location = `${window.location.pathname}${window.location.search}`;
    startLogout(async () => {
      await logoutAdmin(location);
    });
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 shadow-sm backdrop-blur transition-[left] duration-200 ease-linear sm:px-5 lg:px-6"
      style={{ left: leftOffset }}
    >
      {!hideNavigation && <SidebarTrigger aria-label="Đóng hoặc mở danh mục" />}
      {hideNavigation ? (
        <Link
          href="/admin/dashboard"
          className="text-xs font-bold tracking-[0.12em] text-foreground"
        >
          BMT ADMIN
        </Link>
      ) : (
        <p className="min-w-0 truncate text-sm font-semibold sm:hidden">{meta.title}</p>
      )}

      <div className="ml-auto flex items-center gap-2">
        <ThemeSwitcher />
        <Button type="button" variant="outline" size="icon" aria-label="Thông báo">
          <Bell strokeWidth={1.8} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button type="button" variant="outline" size="icon" />}
            aria-label="Tài khoản quản trị BMT"
          >
            <UserRound strokeWidth={1.8} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6} className="w-40">
            <DropdownMenuItem disabled={loggingOut} onClick={handleLogout}>
              <LogOut /> {loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
