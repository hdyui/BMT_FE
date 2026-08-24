import type { Metadata } from "next";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";

export const metadata: Metadata = { title: "Cấu hình website" };

export default function AdminSettingsPage() {
  return (
    <AdminModuleShell
      title="Cấu hình website"
      description="Thông tin chung được dùng ở đầu trang, cuối trang và các vùng liên hệ của BMT Decor."
      items={[
        {
          title: "Thông tin doanh nghiệp",
          description:
            "Tên doanh nghiệp, hotline, email, MST và giờ làm việc.",
          priority: "P1",
          href: "/admin/settings/company",
        },
        {
          title: "Cuối trang và mạng xã hội",
          description:
            "Thông tin liên hệ, chi nhánh, mạng xã hội và bản quyền.",
          priority: "P1",
          href: "/admin/settings/footer",
        },
        {
          title: "Địa điểm",
          description:
            "Tên chi nhánh, địa chỉ, liên kết Google Maps và trạng thái hiển thị.",
          priority: "P2",
          href: "/admin/settings/locations",
        },
        {
          title: "Đầu trang và danh mục",
          description:
            "Tên, liên kết, hình minh họa và trạng thái hiển thị.",
          priority: "P2",
          href: "/admin/settings/navigation",
        },
        {
          title: "Logo và biểu tượng website",
          description: "Thay logo và biểu tượng hiển thị trên thẻ trình duyệt.",
          priority: "P2",
          href: "/admin/settings/branding",
        },
      ]}
    />
  );
}
