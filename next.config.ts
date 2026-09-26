import type { NextConfig } from "next";

import { API_BASE_PATH, API_ORIGIN } from "./shared/lib/api/config";

const nextConfig: NextConfig = {
  images: {
    qualities: [70, 75],
    // Ảnh admin upload qua backend được lưu trên Cloudinary.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  // Chỉ có tác dụng khi chạy `next dev`: in ra terminal mọi lời gọi API mà server
  // component thực hiện (trang public gọi backend ở server nên không hiện trong
  // tab Network của trình duyệt), kèm trạng thái cache.
  logging: {
    fetches: { fullUrl: true, hmrRefreshes: true },
  },
  // Trình duyệt gọi API cùng origin để cookie đăng nhập của backend là cookie
  // first-party (backend đặt SameSite=Lax, gọi thẳng khác site sẽ không mang cookie).
  async rewrites() {
    return [
      {
        source: `${API_BASE_PATH}/:path*`,
        destination: `${API_ORIGIN}${API_BASE_PATH}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      // Public site: Vietnamese URLs renamed to English (2026-08). Permanent so
      // existing inbound links and search-engine results follow to the new paths.
      { source: "/gioi-thieu", destination: "/about", permanent: true },
      { source: "/dich-vu", destination: "/services", permanent: true },
      { source: "/dich-vu/xay-dung-tron-goi", destination: "/services/turnkey", permanent: true },
      { source: "/dich-vu/thiet-ke-kien-truc-noi-that", destination: "/services/design", permanent: true },
      { source: "/dich-vu/thi-cong-xay-dung", destination: "/services/construction", permanent: true },
      { source: "/dich-vu/cai-tao-sua-chua", destination: "/services/renovation", permanent: true },
      { source: "/du-an", destination: "/projects", permanent: true },
      { source: "/du-an/:slug", destination: "/projects/:slug", permanent: true },
      { source: "/ho-so-nang-luc", destination: "/capability-profile", permanent: true },
      { source: "/bao-gia", destination: "/quotation", permanent: true },
      { source: "/tin-tuc", destination: "/news", permanent: true },
      { source: "/tuyen-dung", destination: "/careers", permanent: true },
      { source: "/lien-he", destination: "/contact", permanent: true },

      { source: "/admin/home", destination: "/admin/content", permanent: false },
      { source: "/admin/quotation", destination: "/admin/content/quotation", permanent: false },
      { source: "/admin/capability-profile", destination: "/admin/content/capability-profile", permanent: false },
      { source: "/admin/settings/capability-profile", destination: "/admin/capability-profile/content", permanent: false },
      { source: "/admin/services", destination: "/admin/content/services", permanent: false },
      { source: "/admin/services/overview", destination: "/admin/content/services-overview", permanent: false },
      { source: "/admin/services/xay-dung-tron-goi", destination: "/admin/content/turnkey", permanent: false },
      { source: "/admin/services/thiet-ke-kien-truc-noi-that", destination: "/admin/content/design", permanent: false },
      { source: "/admin/services/thi-cong-xay-dung", destination: "/admin/content/construction", permanent: false },
      { source: "/admin/services/cai-tao-sua-chua", destination: "/admin/content/renovation", permanent: false },
      { source: "/admin/services/overview/hero-content", destination: "/admin/services/overview/hero-cards", permanent: false },
    ];
  },
};

export default nextConfig;
