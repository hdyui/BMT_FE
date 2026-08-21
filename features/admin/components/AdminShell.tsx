"use client";

import { useState } from "react";

import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/lib/components/ui/sheet";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-shell min-h-dvh overflow-x-hidden bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border transition-[width] duration-200 md:block",
          collapsed ? "w-20" : "w-20 xl:w-64",
        )}
      >
        <AdminSidebar
          collapsed={collapsed}
          onCollapse={() => setCollapsed((value) => !value)}
        />
      </aside>

      <div
        className={cn(
          "flex min-h-dvh min-w-0 flex-col transition-[padding] duration-200",
          collapsed ? "md:pl-20" : "md:pl-20 xl:pl-64",
        )}
      >
        <AdminHeader
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((value) => !value)}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          className="admin-theme-surface admin-shell w-[min(88vw,320px)] gap-0 p-0"
          side="left"
          showCloseButton
        >
          <SheetTitle className="sr-only">Điều hướng Admin</SheetTitle>
          <SheetDescription className="sr-only">
            Chọn module quản lý nội dung BMT Decor
          </SheetDescription>
          <AdminSidebar mobile onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
