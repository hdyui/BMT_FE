import { DocumentPageScaffold } from "@/lib/components/layout/DocumentPageScaffold";

export function NewsPage() {
  return (
    <DocumentPageScaffold
      eyebrow="TIN TỨC"
      title="GÓC NHÌN VỀ THIẾT KẾ VÀ XÂY DỰNG"
      description="Cập nhật kiến thức, xu hướng và những câu chuyện thực tế từ các dự án của BMT Decor."
      sections={[
        "Tin BMT Decor",
        "Kiến thức thiết kế",
        "Kinh nghiệm thi công",
        "Xu hướng nội thất",
      ]}
      image="/images/bmt-faq-interior.png"
    />
  );
}
