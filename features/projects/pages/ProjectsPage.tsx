import { DocumentPageScaffold } from "@/lib/components/layout/DocumentPageScaffold";

export function ProjectsPage() {
  return (
    <DocumentPageScaffold
      eyebrow="DỰ ÁN"
      title="MỖI CÔNG TRÌNH, MỘT CAM KẾT CHẤT LƯỢNG"
      description="Danh mục những công trình BMT Decor đã thiết kế và thi công trên nhiều loại hình không gian."
      sections={[
        "Dự án nhà ở",
        "Dự án văn phòng",
        "Showroom & thẩm mỹ viện",
        "Nhà hàng & khách sạn",
      ]}
      image="/images/bmt-worksite.png"
    />
  );
}
