import type { Metadata } from "next";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";

export const metadata: Metadata = { title: "Thông tin tìm kiếm" };

export default function AdminSeoPage() {
  return (
    <AdminModuleShell
      title="Thông tin tìm kiếm"
      description="Quản lý tiêu đề, mô tả và hình ảnh đại diện khi website xuất hiện trên công cụ tìm kiếm."
      items={[
        {
          title: "Thông tin chung của website",
          description: "Tên website, tiêu đề, mô tả và hình ảnh đại diện.",
          priority: "P2",
          href: "/admin/seo/global",
        },
        {
          title: "Thông tin từng trang",
          description:
            "Tiêu đề, mô tả và hình ảnh đại diện riêng cho từng trang.",
          priority: "P2",
          href: "/admin/seo/pages",
        },
      ]}
    />
  );
}
