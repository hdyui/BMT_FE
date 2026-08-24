import type { Metadata } from "next";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";

export const metadata: Metadata = { title: "Nội dung Giới thiệu" };

export default function AdminAboutPage() {
  return (
    <AdminModuleShell
      title="Nội dung Giới thiệu"
      description="Quản lý từng nhóm nội dung trên trang Giới thiệu BMT Decor."
      items={[
        {
          title: "Mở đầu trang Giới thiệu",
          description:
            "Dòng giới thiệu, tiêu đề chính, mô tả và hình ảnh trên máy tính, điện thoại.",
          priority: "P1",
          href: "/admin/about/hero",
        },
        {
          title: "Hành trình",
          description: "Các mốc gồm năm, tiêu đề, mô tả và hình ảnh.",
          priority: "P1",
          count: "6 cột mốc",
          href: "/admin/about/journey",
        },
        {
          title: "Giá trị cốt lõi",
          description: "Tiêu đề, mô tả và hình ảnh hiển thị.",
          priority: "P1",
          count: "5 giá trị",
          href: "/admin/about/core-values",
        },
        {
          title: "Tầm nhìn & Sứ mệnh",
          description: "Tiêu đề, mô tả và hình ảnh riêng cho từng phần.",
          priority: "P2",
          href: "/admin/about/vision-mission",
        },
        {
          title: "Năng lực BMT",
          description:
            "Nội dung và hình ảnh minh họa cho từng năng lực.",
          priority: "P2",
          href: "/admin/about/capabilities",
        },
      ]}
    />
  );
}
