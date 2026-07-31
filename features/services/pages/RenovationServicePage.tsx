import { DocumentPageScaffold } from "@/lib/components/layout/DocumentPageScaffold";

export function RenovationServicePage() {
  return (
    <DocumentPageScaffold
      eyebrow="DỊCH VỤ"
      title="CẢI TẠO & SỬA CHỮA"
      description="Làm mới công trình hiện hữu bằng giải pháp tối ưu công năng, thẩm mỹ, chi phí và thời gian triển khai."
      sections={[
        "Đánh giá hiện trạng",
        "Tư vấn phương án cải tạo",
        "Dự toán chi phí",
        "Thi công sửa chữa",
        "Nghiệm thu công trình",
      ]}
      image="/images/bmt-hero-interior.png"
    />
  );
}
