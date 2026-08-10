export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProjectDetail = {
  slug: string;
  title: string;
  displayName: string;
  projectName: string;
  category: string;
  location: string;
  client: string;
  area: string;
  scale: string;
  style: string;
  scope: string;
  description: string[];
  surveyDescription: string;
  drawingCaption: string;
  solutionDescription: string;
  galleryDescription: string;
  processDescription: string;
  ctaDescription: string;
  heroImage: ProjectImage;
  survey: ProjectImage[];
  drawing: ProjectImage;
  renders: ProjectImage[];
  process: Array<ProjectImage & { label: string }>;
  comparisons: Array<{
    before: ProjectImage & { label: string; badge?: string };
    after: ProjectImage & { label: string; badge?: string };
  }>;
};

const detailRoot = "/images/projects/detail";

export const projects: Record<string, ProjectDetail> = {
  "nha-pho-2-tang-quan-9": {
    slug: "nha-pho-2-tang-quan-9",
    title: "Dự án nhà phố Quận 9",
    displayName: "Mộc Miên House",
    projectName: "Nhà Phố 2 Tầng Hiện Đại",
    category: "Nhà Phố",
    location: "Quận 9, TP.HCM (cũ)",
    client: "Anh Nhân",
    area: "210m²",
    scale: "2 tầng + tum (sân thượng)",
    style: "Wabi Sabi",
    scope: "Thiết kế và thi công trọn gói",
    description: [
      "Mỗi ngôi nhà đều bắt đầu từ một mong muốn riêng. Với công trình này, khách hàng hướng đến không gian sống mang phong cách Wabi Sabi đơn giản, mộc mạc, gọn gàng và tối ưu công năng, đáp ứng trọn vẹn nhu cầu sinh hoạt hằng ngày.",
    ],
    surveyDescription:
      "Qua khảo sát hiện trạng, BMT Decor thấy diện tích ngôi nhà khá rộng nhưng cách bố trí nội thất chưa tối ưu, khiến không gian chưa được tận dụng hiệu quả, xuống cấp. Thêm vào đó ánh sáng tự nhiên còn hạn chế làm tổng thể trở nên tối và thiếu sức sống. Cách bố trí không gian còn khá thô cứng, thiếu sự liên kết, khiến tổng thể căn nhà trở nên nặng nề và chưa tạo được cảm giác thoải mái. Và từ đó đơn vị lên phương án cho căn nhà này.",
    drawingCaption: "Bản vẽ mặt bằng bố trí",
    solutionDescription:
      "BMT Decor đề xuất phương án cải tạo với các đường bo cong nhẹ nhàng ở hệ cửa, ban công và mảng tường, giúp mặt tiền trở nên mềm mại, giảm cảm giác thô cứng. Họa văn được tiết chế, kết hợp các đường nét gọn gàng và khoảng đặc – rỗng cân đối, tạo nên tổng thể hài hòa, tinh giản nhưng vẫn có điểm nhấn, phù hợp với tinh thần Wabi Sabi.",
    galleryDescription:
      "Đội ngũ BMT Decor lựa chọn phong cách Wabi Sabi, kết hợp gam kem ấm, đường cong mềm mại và ánh sáng dịu nhẹ, tạo nên không gian sang trọng, thư thái và đầy cảm giác muốn trở về.",
    processDescription:
      "Từ khảo sát hiện trạng đến hoàn thiện từng hạng mục, đội ngũ BMT Decor triển khai thi công theo đúng quy trình, kiểm soát chặt chẽ chất lượng ở từng giai đoạn. Các công tác cải tạo, xử lý bề mặt, thi công trần – vách, lắp đặt nội thất và hoàn thiện chi tiết được thực hiện đồng bộ, đảm bảo tiến độ, tính thẩm mỹ và độ bền của công trình, từng bước hiện thực hóa phương án thiết kế thành không gian sống hoàn chỉnh.",
    ctaDescription:
      "Liên hệ ngay BMT Decor hoặc để lại thông tin để được đội ngũ tư vấn giải pháp thiết kế – thi công phù hợp nhất cho ngôi nhà của bạn.",
    heroImage: {
      src: `${detailRoot}/project-cover.png`,
      alt: "Mặt tiền hoàn thiện của Mộc Miên House về đêm",
      width: 2560,
      height: 2500,
    },
    survey: [
      {
        src: `${detailRoot}/survey-facade.png`,
        alt: "Hiện trạng mặt tiền nhà phố trước cải tạo",
        width: 1619,
        height: 1459,
      },
      {
        src: `${detailRoot}/survey-living-room.png`,
        alt: "Hiện trạng phòng khách trước cải tạo",
        width: 1619,
        height: 1459,
      },
      {
        src: `${detailRoot}/survey-stair.png`,
        alt: "Hiện trạng cầu thang trước cải tạo",
        width: 1619,
        height: 1459,
      },
    ],
    drawing: {
      src: `${detailRoot}/facade-drawing.png`,
      alt: "Bản vẽ mặt đứng cổng và mặt đứng chính của nhà phố",
      width: 3636,
      height: 2426,
    },
    renders: [
      {
        src: `${detailRoot}/render-facade.png`,
        alt: "Phối cảnh 3D mặt tiền Mộc Miên House",
        width: 2577,
        height: 3559,
      },
      {
        src: `${detailRoot}/render-living-wide.png`,
        alt: "Phối cảnh 3D phòng khách nhìn về cầu thang",
        width: 2260,
        height: 1695,
      },
      {
        src: `${detailRoot}/render-tv-wall.png`,
        alt: "Phối cảnh 3D vách tivi phòng khách",
        width: 2260,
        height: 1695,
      },
      {
        src: `${detailRoot}/render-lounge-wide.png`,
        alt: "Phối cảnh 3D khu vực tiếp khách",
        width: 1541,
        height: 1186,
      },
      {
        src: `${detailRoot}/render-stair-wide.png`,
        alt: "Phối cảnh 3D cầu thang và mảng tường trang trí",
        width: 1539,
        height: 1172,
      },
      {
        src: `${detailRoot}/render-kitchen.png`,
        alt: "Phối cảnh 3D bếp và bàn ăn",
        width: 1539,
        height: 1186,
      },
    ],
    process: [
      {
        src: `${detailRoot}/process-survey.png`,
        alt: "Đội ngũ BMT Decor khảo sát hiện trạng",
        width: 1209,
        height: 1588,
        label: "Khảo sát hiện trạng",
      },
      {
        src: `${detailRoot}/process-design.png`,
        alt: "Kiến trúc sư BMT Decor lên phương án thiết kế",
        width: 1170,
        height: 1584,
        label: "Lên phương án & thiết kế",
      },
      {
        src: `${detailRoot}/process-construction.png`,
        alt: "BMT Decor thi công và giám sát tại công trình",
        width: 1168,
        height: 1584,
        label: "Thi công và giám sát",
      },
      {
        src: `${detailRoot}/process-handover.png`,
        alt: "Mặt tiền công trình sau khi bàn giao",
        width: 1209,
        height: 1584,
        label: "Bàn giao",
      },
    ],
    comparisons: [
      {
        before: {
          src: `${detailRoot}/before-facade.png`,
          alt: "Mặt tiền nhà phố trước cải tạo",
          width: 3068,
          height: 2281,
          label: "Hiện trạng",
          badge: "Trước",
        },
        after: {
          src: `${detailRoot}/after-facade.png`,
          alt: "Mặt tiền nhà phố sau khi hoàn thiện",
          width: 2566,
          height: 3400,
          label: "Hoàn thiện",
          badge: "Sau",
        },
      },
      {
        before: {
          src: `${detailRoot}/after-stair-render.png`,
          alt: "Phối cảnh 3D khu vực cầu thang",
          width: 3864,
          height: 2898,
          label: "3D",
          badge: "Trước",
        },
        after: {
          src: `${detailRoot}/after-stair-built.png`,
          alt: "Cầu thang sau khi thi công thực tế",
          width: 2986,
          height: 4003,
          label: "Thực tế",
          badge: "Sau",
        },
      },
      {
        before: {
          src: `${detailRoot}/before-living.png`,
          alt: "Phòng khách trước cải tạo",
          width: 3396,
          height: 2532,
          label: "Hiện trạng",
          badge: "Trước",
        },
        after: {
          src: `${detailRoot}/after-living.png`,
          alt: "Phòng khách sau cải tạo",
          width: 3300,
          height: 2307,
          label: "Hoàn thiện",
          badge: "Sau",
        },
      },
    ],
  },
};

export const projectSlugs = Object.keys(projects);

export function getProjectDetail(slug: string) {
  return projects[slug];
}
