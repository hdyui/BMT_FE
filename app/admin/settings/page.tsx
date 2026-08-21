import type { Metadata } from "next";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";

export const metadata: Metadata = { title: "Cấu hình website" };

export default function AdminSettingsPage() {
  return (
    <AdminModuleShell
      title="Cấu hình website"
      description="Thông tin chung được dùng bởi header, footer và các vùng liên hệ của BMT Decor."
      items={[
        {
          title: "Thông tin doanh nghiệp",
          description:
            "Tên doanh nghiệp, hotline, email, MST và giờ làm việc.",
          priority: "P1",
          href: "/admin/settings/company",
        },
        {
          title: "Footer & Social",
          description:
            "Thông tin liên hệ, chi nhánh, social URL và copyright.",
          priority: "P1",
          href: "/admin/settings/footer",
        },
        {
          title: "Địa điểm",
          description:
            "Tên chi nhánh, địa chỉ, Google Maps URL, thứ tự và hiển thị.",
          priority: "P2",
          href: "/admin/settings/locations",
        },
        {
          title: "Header / Navigation",
          description:
            "Menu label, href, icon image, thứ tự và hiển thị. Style navigation vẫn khóa.",
          priority: "P2",
          href: "/admin/settings/navigation",
        },
        {
          title: "Logo / Favicon",
          description: "Thay representation của logo và favicon asset.",
          priority: "P2",
          href: "/admin/settings/branding",
        },
      ]}
    />
  );
}
