import type { Metadata } from "next";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";

export const metadata: Metadata = {
  title: "Nội dung Trang chủ",
};

export default function AdminHomePage() {
  return (
    <AdminModuleShell
      title="Nội dung Trang chủ"
      description="Chọn resource để quản lý nội dung riêng của Homepage BMT Decor."
      items={[
        { title: "Hero Slider", description: "Text, CTA, ảnh Desktop/Mobile, alt, thứ tự và hiển thị.", priority: "P1", count: "4 slides", href: "/admin/home/hero" },
        { title: "Dự án tiêu biểu Home", description: "Data riêng của Homepage, không dùng chung Projects Page.", priority: "P1", count: "8 items mẫu", href: "/admin/home/featured-projects" },
        { title: "Dịch vụ nổi bật Home", description: "Nội dung, CTA và ảnh riêng theo thiết kế Homepage.", priority: "P1", count: "4 dịch vụ", href: "/admin/home/featured-services" },
        { title: "Statistics", description: "Giá trị, nhãn, hậu tố, icon và thứ tự.", priority: "P2", count: "3 số liệu", href: "/admin/home/statistics" },
        { title: "Vì sao chọn BMT", description: "Nội dung, icon, ảnh mặc định/hover và hiển thị.", priority: "P2", count: "4 lý do", href: "/admin/home/why-bmt" },
        { title: "Tin nổi bật Home", description: "Tiêu đề, mô tả, hình ảnh, liên kết và thứ tự.", priority: "P2", count: "3 tin", href: "/admin/home/featured-news" },
        { title: "Đối tác", description: "Tên, logo, liên kết và thứ tự hiển thị.", priority: "P2", count: "5 đối tác mẫu", href: "/admin/home/partners" },
      ]}
    />
  );
}
