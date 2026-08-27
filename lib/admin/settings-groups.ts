/**
 * Các nhóm nội dung của Hệ thống → Cấu hình. Đầu trang và cuối trang hiện ở mọi
 * trang nên không nằm trong "Nội dung trang" mà gom hết về đây, xếp theo mạch
 * đầu trang → cuối trang.
 *
 * Dùng chung cho cả trang `/admin/settings` lẫn sidebar của mục Cấu hình.
 */
export interface AdminSettingsGroup {
  title: string;
  description: string;
  resourceKey: string;
  href: string;
}

export const adminSettingsGroups: AdminSettingsGroup[] = [
  {
    title: "Logo đầu trang",
    description: "Thay logo hiển thị ở đầu trang.",
    resourceKey: "settings/branding",
    href: "/admin/settings/branding",
  },
  {
    title: "Danh mục đầu trang",
    description: "Tên hiển thị, liên kết và thứ tự của các mục trong danh mục.",
    resourceKey: "settings/navigation",
    href: "/admin/settings/navigation",
  },
  {
    title: "Đối tác dùng chung",
    description: "6 đối tác dùng chung: tên, logo và liên kết hiển thị tại Trang chủ và Giới thiệu.",
    resourceKey: "settings/partners",
    href: "/admin/settings/partners",
  },
  {
    title: "Cấu hình Footer",
    description: "Logo, 4 dịch vụ, liên hệ, chi nhánh & nhà xưởng, mạng xã hội và ảnh fanpage cuối trang.",
    resourceKey: "settings/footer",
    href: "/admin/settings/footer",
  },
];
