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
    title: "Thông tin doanh nghiệp",
    description: "Tên doanh nghiệp, hotline, email, MST và giờ làm việc.",
    resourceKey: "settings/company",
    href: "/admin/settings/company",
  },
  {
    title: "Cuối trang và mạng xã hội",
    description: "Thông tin liên hệ, chi nhánh, mạng xã hội và bản quyền.",
    resourceKey: "settings/footer",
    href: "/admin/settings/footer",
  },
  {
    title: "Địa điểm",
    description: "Tên chi nhánh, địa chỉ, liên kết Google Maps và trạng thái hiển thị.",
    resourceKey: "settings/locations",
    href: "/admin/settings/locations",
  },
];
