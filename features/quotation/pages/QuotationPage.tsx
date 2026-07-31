import { DocumentPageScaffold } from "@/lib/components/layout/DocumentPageScaffold";

export function QuotationPage() {
  return (
    <DocumentPageScaffold
      eyebrow="BÁO GIÁ"
      title="DỰ TOÁN MINH BẠCH CHO TỪNG HẠNG MỤC"
      description="Nhận tư vấn và dự toán sơ bộ dựa trên loại hình, quy mô và yêu cầu hoàn thiện của công trình."
      sections={[
        "Thông tin công trình",
        "Nhu cầu thiết kế",
        "Phạm vi thi công",
        "Yêu cầu vật liệu",
      ]}
    />
  );
}
