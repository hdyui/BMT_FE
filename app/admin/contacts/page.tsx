import type { Metadata } from "next";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";

export const metadata: Metadata = { title: "Nội dung Liên hệ" };

export default function AdminContactsPage() {
  return (
    <AdminModuleShell
      title="Nội dung Liên hệ"
      description="Quản lý nội dung form và hình ảnh đã được cấu hình trong public component."
      items={[
        {
          title: "Contact Form",
          description:
            "Tiêu đề, mô tả, field label, placeholder, nút gửi và success message.",
          priority: "P1",
          href: "/admin/contacts/form",
        },
        {
          title: "Form Image / Background",
          description:
            "Thay ảnh nền hoặc decorative asset khi component hiện tại hỗ trợ.",
          priority: "P2",
          href: "/admin/contacts/form",
        },
      ]}
      footnote="Danh sách khách hàng liên hệ là phạm vi tương lai và chưa phải tính năng của bản FE-only này."
    />
  );
}
