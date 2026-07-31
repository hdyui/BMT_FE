import { DocumentPageScaffold } from "@/lib/components/layout/DocumentPageScaffold";

export function CapabilityProfilePage() {
  return (
    <DocumentPageScaffold
      eyebrow="BMT DECOR"
      title="HỒ SƠ NĂNG LỰC"
      description="Tổng quan về đội ngũ, kinh nghiệm, quy trình và năng lực triển khai của BMT Decor."
      sections={[
        "Thông tin doanh nghiệp",
        "Năng lực thiết kế",
        "Năng lực thi công",
        "Đội ngũ chuyên môn",
        "Dự án tiêu biểu",
      ]}
    />
  );
}
