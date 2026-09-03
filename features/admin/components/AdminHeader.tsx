"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { Bell, LogOut, UserRound } from "lucide-react";

import { Button } from "@/features/admin/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/features/admin/components/ui/dropdown-menu";
import { logoutAdmin } from "@/features/admin/auth/actions";
import { ThemeSwitcher } from "@/features/admin/components/ThemeSwitcher";
import { getAdminSectionKey } from "@/features/admin/lib/admin-sidebar";
import {
  adminHeaderNavigation,
  type AdminHeaderNavItem,
} from "@/features/admin/lib/constants/navigation";
import { cn } from "@/shared/lib/utils";

export function AdminHeader() {
  const pathname = usePathname();
  const [loggingOut, startLogout] = useTransition();
  const activeKey = getAdminSectionKey(pathname);

  function handleLogout() {
    const location = `${window.location.pathname}${window.location.search}`;

    startLogout(async () => {
      await logoutAdmin(location);
    });
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-24 shrink-0 flex-col bg-background/95 shadow-sm backdrop-blur">
      {/* Hàng 1: thương hiệu bên trái, tài khoản/tiện ích bên phải. Cố định
          không phụ thuộc số lượng mục điều hướng. */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b px-4 sm:px-5 lg:px-6">
        <Link
          href="/admin/dashboard"
          className="flex shrink-0 items-center"
          aria-label="BMT Decor Admin - Tổng quan"
        >
          <Image
            className="h-[26px] w-auto object-contain"
            src="/images/cai-tao-sua-chua/logo.png"
            alt="BMT Decor"
            width={1196}
            height={207}
            sizes="156px"
            priority
          />
        </Link>

        <div className="ml-auto flex min-w-0 items-center gap-2">
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
      </div>

      {/* Hàng 2: điều hướng cấp một, tách riêng khỏi hàng thương hiệu/tài
          khoản — hệ thống có thêm bao nhiêu mục thì dải này chỉ cuộn ngang
          trong chính nó, không đẩy lệch logo hay cụm nút bên trên. */}
      <nav
        aria-label="Điều hướng chính"
        className="admin-scrollbar flex h-10 min-w-0 shrink-0 items-center overflow-x-auto border-b px-4 sm:px-5 lg:px-6"
      >
        <ul className="flex min-w-max items-center gap-1">
          {adminHeaderNavigation.map((item) => (
            <li key={item.key}>
              <HeaderNavLink
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={activeKey === item.key}
              />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

const navLinkClassName =
  "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/25";
const navLinkActiveClassName = "bg-brand/10 font-semibold text-brand";

function HeaderNavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: AdminHeaderNavItem["icon"];
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(navLinkClassName, active && navLinkActiveClassName)}
    >
      <Icon className="size-4" strokeWidth={1.8} />
      {label}
    </Link>
  );
}
