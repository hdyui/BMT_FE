import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  FolderKanban,
  GalleryVerticalEnd,
  ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  Newspaper,
  SearchCheck,
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
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
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
    items: [
      { label: "Media", href: "/admin/media", icon: ImageIcon },
      { label: "SEO", href: "/admin/seo", icon: SearchCheck },
      { label: "Cấu hình", href: "/admin/settings", icon: Settings2 },
    ],
  },
];

export const adminPageMeta: Record<
  string,
  { title: string; description: string }
> = {
  "/admin/dashboard": {
    title: "Dashboard",
    description: "Tổng quan nội dung website BMT Decor",
  },
  "/admin/home": {
    title: "Trang chủ",
    description: "Quản lý nội dung riêng của Homepage",
  },
  "/admin/content": {
    title: "Nội dung trang",
    description: "Quản lý content theo đúng public page và section nguồn",
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
  "/admin/contacts": {
    title: "Liên hệ",
    description: "Quản lý nội dung biểu mẫu liên hệ",
  },
  "/admin/media": {
    title: "Media",
    description: "Xem và chọn đường dẫn asset cho nội dung",
  },
  "/admin/seo": {
    title: "SEO",
    description: "Quản lý metadata nội dung",
  },
  "/admin/settings": {
    title: "Cấu hình",
    description: "Thông tin doanh nghiệp, header và footer",
  },
};

export const adminBrandIcon = GalleryVerticalEnd;
