import { DocumentPageScaffold } from "@/lib/components/layout/DocumentPageScaffold";

export function ConstructionServicePage() {
  return (
    <DocumentPageScaffold
      eyebrow="DỊCH VỤ"
      title="THI CÔNG XÂY DỰNG"
      description="Tổ chức thi công chuyên nghiệp với quy trình kiểm soát tiến độ, chất lượng và an toàn ở từng hạng mục."
      sections={[
        "Khảo sát & chuẩn bị thi công",
        "Thi công phần thô",
        "Thi công hoàn thiện",
        "Giám sát chất lượng",
        "Nghiệm thu & bàn giao",
      ]}
      image="/images/bmt-worksite.png"
    />
  );
}
