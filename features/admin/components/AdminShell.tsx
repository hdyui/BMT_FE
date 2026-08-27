"use client";

import { usePathname } from "next/navigation";

import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { AdminSectionSidebar } from "@/features/admin/components/AdminSectionSidebar";

/**
 * Khung admin: header ngang chứa điều hướng cấp một, bên dưới là sidebar riêng
 * của mục đang mở rồi tới nội dung.
 *
 * Sidebar hiện ở mọi trang, kể cả màn hình chỉnh sửa — trước đây các trang
 * chỉnh sửa bị ẩn hết điều hướng, vào sửa xong là mất đường quay lại.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell min-h-dvh overflow-x-clip bg-background text-foreground">
      <AdminHeader />
      <div className="pt-16 lg:pl-[232px]">
        <AdminSectionSidebar />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
