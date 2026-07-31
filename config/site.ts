export const services = [
  {
    label: "Xây dựng trọn gói",
    href: "/dich-vu/xay-dung-tron-goi",
  },
  {
    label: "Thiết kế kiến trúc & nội thất",
    href: "/dich-vu/thiet-ke-kien-truc-noi-that",
  },
  {
    label: "Thi công xây dựng",
    href: "/dich-vu/thi-cong-xay-dung",
  },
  {
    label: "Cải tạo & sửa chữa",
    href: "/dich-vu/cai-tao-sua-chua",
  },
] as const;

export const navigation = [
  { label: "TRANG CHỦ", href: "/" },
  { label: "GIỚI THIỆU", href: "/gioi-thieu" },
  { label: "DỊCH VỤ", href: "/dich-vu/xay-dung-tron-goi", children: services },
  { label: "DỰ ÁN", href: "/du-an" },
  { label: "HỒ SƠ NĂNG LỰC", href: "/ho-so-nang-luc" },
  { label: "BÁO GIÁ", href: "/bao-gia" },
  { label: "TIN TỨC", href: "/tin-tuc" },
  { label: "TUYỂN DỤNG", href: "/tuyen-dung" },
] as const;

export const contactInformation = {
  phone: "0934 888 881",
  email: "bmt.decor@gmail.com",
  office: "7/92 Thành Thái, Phường Diên Hồng, TP.HCM",
  branches: [
    "380 Vũ Huy Tấn, Phường Gia Định, TP.HCM",
    "58 Thành Thái, Phường Hoà Hưng, TP.HCM",
    "Nguyễn Thị Tự, Phường Bình Tân, TP.HCM",
  ],
} as const;
