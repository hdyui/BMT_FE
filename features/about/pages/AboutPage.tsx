import { DocumentPageScaffold } from "@/lib/components/layout/DocumentPageScaffold";

export function AboutPage() {
  return (
    <DocumentPageScaffold
      eyebrow="VỀ CHÚNG TÔI"
      title="KIẾN TẠO GIÁ TRỊ TỪ MỌI KHÔNG GIAN"
      description="BMT Decor phát triển bằng năng lực thiết kế, thi công thực tế và cam kết tạo nên những công trình có giá trị sử dụng lâu dài."
      sections={[
        "Hành trình của BMT Decor",
        "Tầm nhìn & Sứ mệnh",
        "Giá trị cốt lõi",
        "Năng lực nổi bật",
        "Đối tác của BMT Decor",
      ]}
    />
  );
}
