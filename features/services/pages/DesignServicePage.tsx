import { DocumentPageScaffold } from "@/lib/components/layout/DocumentPageScaffold";

export function DesignServicePage() {
  return (
    <DocumentPageScaffold
      eyebrow="DỊCH VỤ"
      title="THIẾT KẾ KIẾN TRÚC & NỘI THẤT CHUYÊN NGHIỆP"
      description="Giải pháp thiết kế đồng bộ, hài hòa giữa thẩm mỹ, công năng, ngân sách và giá trị sử dụng lâu dài."
      sections={[
        "Giải pháp thiết kế tối ưu cho mọi không gian",
        "Thiết kế nội thất nhà ở",
        "Thiết kế nội thất văn phòng",
        "Thiết kế showroom & thẩm mỹ viện",
        "Thiết kế nhà hàng & khách sạn",
        "Quy trình thiết kế tại BMT Decor",
      ]}
      image="/images/bmt-faq-interior.png"
    />
  );
}
