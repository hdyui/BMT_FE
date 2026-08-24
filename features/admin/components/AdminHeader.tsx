"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/features/admin/components/ThemeSwitcher";
import { adminPageMeta } from "@/lib/admin/constants/navigation";

export function AdminHeader({ hideNavigation = false }: { hideNavigation?: boolean }) {
  const pathname = usePathname();
  const metaKey = Object.keys(adminPageMeta)
    .filter((key) => pathname === key || pathname.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0];
  const meta = adminPageMeta[metaKey] ?? adminPageMeta["/admin/dashboard"];

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-5 lg:px-6">
      {!hideNavigation && <SidebarTrigger aria-label="Đóng hoặc mở danh mục" />}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold sm:text-[15px]">{meta.title}</p>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">
          {meta.description}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="hidden w-[min(20vw,240px)] justify-start text-muted-foreground lg:flex"
          aria-label="Tìm kiếm nội dung"
        >
          <Search />
          <span className="truncate">Tìm nội dung</span>
          <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
            Ctrl K
          </kbd>
        </Button>
        <ThemeSwitcher />
        <Button type="button" variant="outline" size="icon" aria-label="Thông báo">
          <Bell strokeWidth={1.8} />
        </Button>
      </div>
    </header>
  );
}
