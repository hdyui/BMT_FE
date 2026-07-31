import { DocumentPageScaffold } from "@/lib/components/layout/DocumentPageScaffold";

export function ContactPage() {
  return (
    <DocumentPageScaffold
      eyebrow="LIÊN HỆ"
      title="KẾT NỐI VỚI BMT DECOR"
      description="Chia sẻ nhu cầu của bạn để đội ngũ BMT Decor tư vấn giải pháp phù hợp cho công trình."
      sections={["Văn phòng chính", "Chi nhánh", "Nhà xưởng", "Kênh tư vấn"]}
    />
  );
}
