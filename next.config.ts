import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [70, 75],
  },
  async redirects() {
    return [
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
