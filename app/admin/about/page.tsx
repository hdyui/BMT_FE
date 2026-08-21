import type { Metadata } from "next";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";

export const metadata: Metadata = { title: "Nội dung Giới thiệu" };

export default function AdminAboutPage() {
  return (
    <AdminModuleShell
      title="Nội dung Giới thiệu"
      description="Quản lý content theo từng section đang tồn tại trên trang Giới thiệu BMT Decor."
      items={[
        {
          title: "About Hero",
          description:
            "Eyebrow, H1, mô tả, ảnh Desktop/Mobile và alt text.",
          priority: "P1",
          href: "/admin/about/hero",
        },
        {
          title: "Hành trình",
          description: "Timeline gồm năm, tiêu đề, mô tả, ảnh và thứ tự.",
          priority: "P1",
          count: "6 cột mốc",
          href: "/admin/about/journey",
        },
        {
          title: "Giá trị cốt lõi",
          description: "Tiêu đề, mô tả, hình ảnh và thứ tự hiển thị.",
          priority: "P1",
          count: "5 giá trị",
          href: "/admin/about/core-values",
        },
        {
          title: "Tầm nhìn & Sứ mệnh",
          description: "Heading, description và hình ảnh riêng cho từng block.",
          priority: "P2",
          href: "/admin/about/vision-mission",
        },
        {
          title: "Năng lực BMT",
          description:
            "Nội dung, ảnh mặc định, ảnh hover và icon. Animation vẫn khóa trong code.",
          priority: "P2",
          href: "/admin/about/capabilities",
        },
      ]}
    />
  );
}
