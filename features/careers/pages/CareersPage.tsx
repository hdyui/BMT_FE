import { DocumentPageScaffold } from "@/lib/components/layout/DocumentPageScaffold";

export function CareersPage() {
  return (
    <DocumentPageScaffold
      eyebrow="TUYỂN DỤNG"
      title="ĐỒNG HÀNH CÙNG BMT DECOR"
      description="Cơ hội phát triển dành cho những ứng viên yêu thiết kế, xây dựng và mong muốn tạo ra giá trị thực."
      sections={[
        "Văn hóa BMT Decor",
        "Vị trí đang tuyển",
        "Quy trình ứng tuyển",
        "Chính sách nhân sự",
      ]}
      image="/images/bmt-worksite.png"
    />
  );
}
