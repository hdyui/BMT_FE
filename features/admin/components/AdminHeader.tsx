"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSwitcher } from "@/features/admin/components/ThemeSwitcher";
import { getAdminSectionKey } from "@/lib/admin/admin-sidebar";
import {
  adminHeaderNavigation,
  type AdminHeaderNavItem,
} from "@/lib/admin/constants/navigation";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const pathname = usePathname();
  const activeKey = getAdminSectionKey(pathname);

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 shadow-sm backdrop-blur sm:px-5 lg:px-6">
      {/* Hai bên cùng `flex-1 basis-0` nên chia đều phần còn lại — nhờ vậy cụm
          điều hướng nằm đúng giữa header dù logo và cụm nút phải rộng khác nhau. */}
      <div className="flex min-w-0 flex-1 basis-0 items-center">
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
      </div>

      {/* Điều hướng cấp một: trước đây là sidebar to bên trái, nay nằm ngang ở
          đây để nhường chỗ cho sidebar riêng của từng mục. */}
      <nav
        aria-label="Điều hướng chính"
        className="admin-scrollbar -mx-1 min-w-0 shrink overflow-x-auto px-1"
      >
        <ul className="flex min-w-max items-center justify-center gap-1">
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

      <div className="flex min-w-0 flex-1 basis-0 items-center justify-end gap-2">
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
            <DropdownMenuItem disabled>
              <LogOut /> Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
