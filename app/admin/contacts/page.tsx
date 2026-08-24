import type { Metadata } from "next";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";

export const metadata: Metadata = { title: "Nội dung Liên hệ" };

export default function AdminContactsPage() {
  return (
    <AdminModuleShell
      title="Nội dung Liên hệ"
      description="Quản lý biểu mẫu và hình ảnh trên trang Liên hệ."
      items={[
        {
          title: "Biểu mẫu liên hệ",
          description:
            "Tiêu đề, mô tả, tên các ô nhập, chữ gợi ý, nút gửi và thông báo thành công.",
          priority: "P1",
          href: "/admin/contacts/form",
        },
        {
          title: "Hình ảnh biểu mẫu và ảnh nền",
          description:
            "Thay hình ảnh biểu mẫu hoặc ảnh nền của trang Liên hệ.",
          priority: "P2",
          href: "/admin/contacts/form",
        },
      ]}
      footnote="Danh sách khách hàng liên hệ là phạm vi tương lai và chưa phải tính năng của bản FE-only này."
    />
  );
}
