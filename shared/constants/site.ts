export const services = [
  {
    label: "Xây dựng trọn gói",
    href: "/services/turnkey",
    icon: "/images/site/nav-xay-dung-tron-goi.png",
  },
  {
    label: "Thiết kế kiến trúc & nội thất",
    href: "/services/design",
    icon: "/images/site/nav-thiet-ke-kien-truc-noi-that.png",
  },
  {
    label: "Thi công xây dựng",
    href: "/services/construction",
    icon: "/images/site/nav-thi-cong-xay-dung.png",
  },
  {
    label: "Cải tạo & sửa chữa",
    href: "/services/renovation",
    icon: "/images/site/nav-cai-tao-sua-chua.png",
  },
] as const;

export const navigation = [
  { label: "TRANG CHỦ", href: "/" },
  { label: "GIỚI THIỆU", href: "/about" },
  { label: "DỊCH VỤ", href: "/services", children: services },
  { label: "DỰ ÁN", href: "/projects" },
  { label: "HỒ SƠ NĂNG LỰC", href: "/capability-profile" },
  { label: "BÁO GIÁ", href: "/quotation" },
  { label: "TIN TỨC", href: "/news" },
  { label: "TUYỂN DỤNG", href: "/careers" },
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
