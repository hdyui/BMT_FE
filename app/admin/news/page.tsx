import type { Metadata } from "next";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";

export const metadata: Metadata = { title: "Nội dung Tin tức" };

export default function AdminNewsPage() {
  return (
    <AdminModuleShell
      title="Nội dung Tin tức"
      description="Quản lý các nhóm nội dung tin đã được định nghĩa trong thiết kế hiện tại."
      items={[
        {
          title: "News Featured",
          description: "Tiêu đề, mô tả, ảnh, liên kết và thứ tự.",
          priority: "P2",
          href: "/admin/news/featured",
        },
        {
          title: "News List",
          description: "Tiêu đề, excerpt, ảnh, liên kết và thứ tự.",
          priority: "P2",
          href: "/admin/news/list",
        },
      ]}
      footnote="Prototype chưa mở rich content CMS vì public source hiện tại chưa yêu cầu editor phức tạp."
    />
  );
}
