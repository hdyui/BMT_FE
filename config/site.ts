export const services = [
  {
    label: "Xây dựng trọn gói",
    href: "/dich-vu/xay-dung-tron-goi",
    icon: "/images/site/nav-xay-dung-tron-goi.png",
  },
  {
    label: "Thiết kế kiến trúc & nội thất",
    href: "/dich-vu/thiet-ke-kien-truc-noi-that",
    icon: "/images/site/nav-thiet-ke-kien-truc-noi-that.png",
  },
  {
    label: "Thi công xây dựng",
    href: "/dich-vu/thi-cong-xay-dung",
    icon: "/images/site/nav-thi-cong-xay-dung.png",
  },
  {
    label: "Cải tạo & sửa chữa",
    href: "/dich-vu/cai-tao-sua-chua",
    icon: "/images/site/nav-cai-tao-sua-chua.png",
  },
] as const;

export const navigation = [
  { label: "TRANG CHỦ", href: "/" },
  { label: "GIỚI THIỆU", href: "/gioi-thieu" },
  { label: "DỊCH VỤ", href: "/dich-vu", children: services },
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
