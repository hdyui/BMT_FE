import type { Metadata } from "next";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";

export const metadata: Metadata = { title: "Nội dung Liên hệ" };

export default function AdminContactsPage() {
  return (
    <AdminModuleShell
      title="Nội dung Liên hệ"
      description="Quản lý biểu mẫu và hình ảnh trên trang Liên hệ."
      singleColumnOrange
      items={[
        {
          title: "Mở đầu trang Liên hệ",
          description: "Tiêu đề, mô tả và ảnh tư vấn viên.",
          priority: "P1",
          href: "/admin/contacts/hero",
        },
        {
          title: "Biểu mẫu liên hệ",
          description: "Tiêu đề, tiêu đề phụ và thông báo thành công.",
          priority: "P1",
          href: "/admin/contacts/form",
        },
        {
          title: "Bản đồ liên hệ",
          description: "Tiêu đề hỗ trợ truy cập của khu vực bản đồ.",
          priority: "P2",
          href: "/admin/contacts/map",
        },
      ]}
      footnote="Danh sách khách hàng liên hệ là phạm vi tương lai và chưa phải tính năng của bản FE-only này."
    />
  );
}
