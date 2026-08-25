const imageRoot = "/images/about/source";

export interface AboutCapability {
  number: string;
  title: string;
  mobileTitle?: string;
  description: string;
  normalImage: string;
  hoverImage: string;
  symbolClass?: string;
  hoverSymbolClass?: string;
  mobileSymbolClass?: string;
  extractWhiteArtwork?: boolean;
  hoverComposite?: boolean;
}

export const aboutCapabilities: readonly AboutCapability[] = [
  {
    number: "01",
    title: "Tổng Thầu Trọn Gói",
    description: "Triển khai đồng bộ từ tư vấn, thiết kế, xin phép xây dựng đến thi công và hoàn thiện, đảm bảo sự thống nhất giữa thiết kế và thi công trong toàn bộ dự án.",
    normalImage: `${imageRoot}/capability-turnkey.png`,
    hoverImage: `${imageRoot}/capability-turnkey.png`,
    symbolClass: "[clip-path:circle(36%_at_center)]",
    hoverSymbolClass: "scale-100",
    extractWhiteArtwork: true,
    hoverComposite: true,
  },
  {
    number: "02",
    title: "Kiểm Soát Chất Lượng",
    description: "Kiểm soát chặt chẽ từ hồ sơ thiết kế, vật liệu, kỹ thuật thi công đến nghiệm thu, đảm bảo mỗi công trình được hoàn thiện đúng tiêu chuẩn và cam kết chất lượng.",
    normalImage: `${imageRoot}/capability-quality-symbol.png`,
    hoverImage: `${imageRoot}/capability-quality-symbol-white.png`,
    symbolClass: "scale-[.5]",
    mobileSymbolClass: "scale-[.52]",
  },
  {
    number: "03",
    title: "Triển Khai Đa Loại Hình",
    mobileTitle: "Triển Khai Đa Loại Hình",
    description: "Kinh nghiệm thực hiện nhà ở, văn phòng, showroom, nhà hàng, khách sạn và các công trình thương mại với giải pháp phù hợp cho từng quy mô dự án.",
    normalImage: `${imageRoot}/capability-target-symbol.png`,
    hoverImage: `${imageRoot}/capability-target-symbol-white.png`,
    symbolClass: "scale-[.64]",
    mobileSymbolClass: "-translate-x-1 scale-[.6]",
  },
  {
    number: "04",
    title: "Đồng Hành Dài Hạn",
    description: "Cam kết bảo hành, bảo trì và hỗ trợ kỹ thuật sau bàn giao, mang đến giá trị sử dụng lâu dài và sự an tâm cho khách hàng.",
    normalImage: `${imageRoot}/capability-growth-symbol.png`,
    hoverImage: `${imageRoot}/capability-growth-symbol-white.png`,
    symbolClass: "scale-[.48]",
    mobileSymbolClass: "-translate-x-1 -translate-y-2 scale-[.52]",
  },
] as const;

export const aboutJourneyMilestones = [
  {
    year: "2011",
    title: "Thành lập công ty",
    description:
      "Chính thức hoạt động trong lĩnh vực thiết kế kiến trúc, thiết kế nội thất và thi công công trình.",
    image: `${imageRoot}/journey-2011.png`,
  },
  {
    year: "2014",
    title: "Mở rộng hoạt động",
    description:
      "Triển khai dịch vụ thiết kế thi công trọn gói cho nhà ở và công trình thương mại.",
    image: `${imageRoot}/journey-2014.png`,
  },
  {
    year: "2017",
    title: "Phát triển đội ngũ",
    description:
      "Hoàn thiện quy trình thiết kế, thi công và quản lý dự án theo tiêu chuẩn chuyên nghiệp.",
    image: `${imageRoot}/journey-2017.png`,
  },
  {
    year: "2020",
    title: "Đẩy mạnh dự án",
    description:
      "Mở rộng triển khai nhiều công trình nhà ở, văn phòng, showroom và không gian kinh doanh.",
    image: `${imageRoot}/journey-2020.png`,
  },
  {
    year: "2022",
    title: "Cột mốc 500+ dự án",
    description:
      "Hoàn thành hơn 500 dự án nhà ở, văn phòng, showroom và công trình thương mại trên nhiều quy mô.",
    image: `${imageRoot}/journey-2022.png`,
  },
  {
    year: "2026",
    title: "Kiến tạo giá trị",
    description:
      "Không ngừng nâng cao chất lượng dịch vụ, đồng hành cùng khách hàng từ ý tưởng đến công trình hoàn thiện.",
    image: `${imageRoot}/journey-2026.png`,
  },
] as const;

export const aboutCoreValues = [
  {
    title: "Chất lượng là cam kết",
    description:
      "Chúng tôi đặt chất lượng thiết kế, vật liệu và thi công làm tiêu chuẩn trong mọi công trình. Mỗi hạng mục đều được kiểm soát chặt chẽ để đảm bảo tính thẩm mỹ, độ bền và giá trị sử dụng lâu dài.",
    image: `${imageRoot}/core-value-quality.png`,
  },
  {
    title: "Khách hàng là trọng tâm",
    description:
      "Lắng nghe nhu cầu, thấu hiểu mong muốn và đưa ra giải pháp phù hợp là cách BMT Decor tạo nên những không gian đáp ứng cả công năng lẫn thẩm mỹ của từng khách hàng.",
    image: `${imageRoot}/core-value-customer.png`,
  },
  {
    title: "Sáng tạo là giá trị",
    description:
      "Không ngừng cập nhật xu hướng thiết kế và đổi mới tư duy, chúng tôi mang đến những giải pháp phù hợp với từng không gian, tạo nên dấu ấn riêng cho mỗi công trình.",
    image: `${imageRoot}/core-value-creativity.png`,
  },
  {
    title: "Chuyên nghiệp là nền tảng",
    description:
      "Quy trình làm việc rõ ràng, minh bạch và kiểm soát chặt chẽ từ thiết kế đến thi công giúp đảm bảo tiến độ, chất lượng và sự đồng bộ trong từng dự án.",
    image: `${imageRoot}/core-value-professionalism.png`,
  },
  {
    title: "Tận tâm là trách nhiệm",
    description:
      "Chúng tôi đồng hành cùng khách hàng trong suốt quá trình thực hiện, luôn sẵn sàng tư vấn, hỗ trợ và xử lý nhanh chóng mọi vấn đề để mang đến trải nghiệm tốt nhất.",
    image: `${imageRoot}/core-value-dedication.png`,
  },
] as const;
