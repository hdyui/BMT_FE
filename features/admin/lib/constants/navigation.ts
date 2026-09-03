import type { LucideIcon } from "lucide-react";
import {
  FolderKanban,
  GalleryVerticalEnd,
  LayoutDashboard,
  LayoutTemplate,
  Settings2,
} from "lucide-react";

/**
 * Điều hướng cấp một, nằm ngang trên thanh header của admin. Mỗi mục có một
 * sidebar riêng bên dưới (xem `features/admin/lib/admin-sidebar.ts`).
 */
export type AdminSectionKey = "overview" | "catalog" | "content" | "settings";

export interface AdminHeaderNavItem {
  key: AdminSectionKey;
  label: string;
  href: string;
  icon: LucideIcon;
}

export const adminHeaderNavigation: AdminHeaderNavItem[] = [
  {
    key: "overview",
    label: "Tổng quan",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  // Bấm vào là vào thẳng Dự án; ba module Dự án / Tin tức / Tuyển dụng nằm sẵn
  // trong sidebar của mục này nên không cần menu xổ xuống nữa.
  {
    key: "catalog",
    label: "Danh mục",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    key: "content",
    label: "Nội dung trang",
    href: "/admin/content",
    icon: LayoutTemplate,
  },
  {
    key: "settings",
    label: "Cấu hình",
    href: "/admin/settings/branding",
    icon: Settings2,
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
