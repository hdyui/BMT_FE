import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  FolderKanban,
  GalleryVerticalEnd,
  LayoutDashboard,
  LayoutTemplate,
  Newspaper,
  Settings2,
} from "lucide-react";

export interface AdminNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface AdminNavigationSection {
  label: string;
  items: AdminNavigationItem[];
}

export const adminNavigation: AdminNavigationSection[] = [
  {
    label: "Tổng quan",
    items: [
      { label: "Tổng quan", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Danh mục",
    items: [
      { label: "Dự án", href: "/admin/projects", icon: FolderKanban },
      { label: "Tin tức", href: "/admin/news", icon: Newspaper },
      {
        label: "Tuyển dụng",
        href: "/admin/recruitment",
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    label: "Nội dung trang",
    items: [
      { label: "Nội dung trang", href: "/admin/content", icon: LayoutTemplate },
    ],
  },
  {
    label: "Hệ thống",
    items: [{ label: "Cấu hình", href: "/admin/settings", icon: Settings2 }],
  },
];

export const adminPageMeta: Record<
  string,
  { title: string; description: string }
> = {
  "/admin/dashboard": {
    title: "Tổng quan",
    description: "Tổng quan nội dung website BMT Decor",
  },
  "/admin/home": {
    title: "Trang chủ",
    description: "Quản lý nội dung riêng của Trang chủ",
  },
  "/admin/content": {
    title: "Nội dung trang",
    description: "Quản lý nội dung theo từng trang trên website",
  },
  "/admin/about": {
    title: "Giới thiệu",
    description: "Quản lý nội dung trang Giới thiệu",
  },
  "/admin/services": {
    title: "Dịch vụ",
    description: "Quản lý nội dung riêng theo từng dịch vụ",
  },
  "/admin/projects": {
    title: "Dự án",
    description: "Quản lý danh mục, danh sách và chi tiết dự án",
  },
  "/admin/news": {
    title: "Tin tức",
    description: "Quản lý tin nổi bật và danh sách tin",
  },
  "/admin/recruitment": {
    title: "Tuyển dụng",
    description: "Quản lý nội dung tuyển dụng",
  },
  "/admin/quotation": {
    title: "Báo giá",
    description: "Quản lý bảng giá và nội dung công cụ ước tính",
  },
  "/admin/capability-profile": {
    title: "Hồ sơ năng lực",
    description: "Quản lý nội dung và hình ảnh Hồ sơ năng lực",
  },
  "/admin/contacts": {
    title: "Liên hệ",
    description: "Quản lý nội dung biểu mẫu liên hệ",
  },
  "/admin/settings": {
    title: "Cấu hình",
    description: "Thông tin doanh nghiệp, đầu trang và cuối trang",
  },
};

export const adminBrandIcon = GalleryVerticalEnd;
