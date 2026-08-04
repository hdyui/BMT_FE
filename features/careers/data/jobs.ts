export type CareerJob = {
  id: string;
  title: string;
  department: string;
  location: string;
  schedule: string;
  compensation: string;
  summary: string;
  image: string;
  responsibilities: string[];
  benefits: string[];
};

export const careerJobs: CareerJob[] = [
  {
    id: "marketing-intern",
    title: "Thực tập sinh Marketing",
    department: "Marketing",
    location: "TP.HCM",
    schedule: "Thực tập",
    compensation: "3.000.000đ + thưởng",
    summary:
      "Chăm sóc và phát triển các kênh social media (TikTok, Facebook, YouTube...) và nội dung website của BMT Decor.",
    image: "/images/careers/job-marketing.jpg",
    responsibilities: [
      "Chăm sóc, phát triển các kênh social media của BMT Decor.",
      "Lên ý tưởng, kịch bản và nội dung hình ảnh - video.",
      "Nghiên cứu, thu thập tài nguyên phục vụ chiến dịch.",
    ],
    benefits: [
      "Phụ cấp 3 triệu/tháng + thưởng hiệu suất.",
      "Được đào tạo Photoshop, Canva, CapCut và ứng dụng AI.",
      "Môi trường trẻ trung, năng động, có cơ hội trở thành nhân viên chính thức.",
    ],
  },
  {
    id: "interior-design-intern",
    title: "Thực tập sinh Thiết kế Nội/ Ngoại thất",
    department: "Thiết kế",
    location: "TP.HCM",
    schedule: "Thực tập",
    compensation: "Thoả thuận",
    summary:
      "Hỗ trợ dựng concept, phối cảnh 3D và triển khai bản vẽ kỹ thuật cùng đội ngũ thiết kế.",
    image: "/images/careers/job-design.jpg",
    responsibilities: [
      "Hỗ trợ khảo sát hiện trạng và phát triển ý tưởng thiết kế.",
      "Dựng phối cảnh 3D, moodboard và hồ sơ vật liệu.",
      "Phối hợp triển khai bản vẽ kỹ thuật dưới sự hướng dẫn của kiến trúc sư.",
    ],
    benefits: [
      "Được tham gia dự án thực tế và hoàn thiện portfolio.",
      "Có người hướng dẫn xuyên suốt quá trình thực tập.",
      "Cơ hội trở thành nhân viên chính thức sau kỳ thực tập.",
    ],
  },
  {
    id: "project-sales",
    title: "Nhân viên Kinh doanh Dự án",
    department: "Kinh doanh",
    location: "TP.HCM",
    schedule: "Toàn thời gian",
    compensation: "Lương cứng + hoa hồng",
    summary:
      "Tư vấn, chăm sóc khách hàng và phát triển hợp đồng thiết kế - thi công nội thất.",
    image: "/images/careers/job-sales.jpg",
    responsibilities: [
      "Tiếp nhận, tư vấn và theo sát nhu cầu của khách hàng dự án.",
      "Phối hợp cùng bộ phận thiết kế để xây dựng phương án phù hợp.",
      "Quản lý dữ liệu khách hàng và báo cáo tiến độ kinh doanh.",
    ],
    benefits: [
      "Thu nhập cạnh tranh theo năng lực và kết quả kinh doanh.",
      "Hoa hồng minh bạch, không giới hạn.",
      "Được đào tạo kiến thức chuyên sâu về thiết kế và thi công.",
    ],
  },
  {
    id: "architect",
    title: "Kiến trúc sư Triển khai",
    department: "Kiến trúc",
    location: "TP.HCM",
    schedule: "Toàn thời gian",
    compensation: "15 - 22 triệu",
    summary: "Triển khai hồ sơ kiến trúc, phối hợp bộ môn và kiểm soát chất lượng bản vẽ dự án.",
    image: "/images/careers/job-design.jpg",
    responsibilities: ["Triển khai hồ sơ thiết kế kỹ thuật.", "Phối hợp kết cấu, MEP và nội thất.", "Kiểm tra tính đồng bộ của hồ sơ."],
    benefits: ["Thưởng theo dự án.", "Đào tạo chuyên môn định kỳ.", "Lộ trình thăng tiến rõ ràng."],
  },
  {
    id: "site-supervisor",
    title: "Giám sát Thi công Nội thất",
    department: "Thi công",
    location: "TP.HCM",
    schedule: "Toàn thời gian",
    compensation: "Thoả thuận",
    summary: "Theo dõi tiến độ, chất lượng và an toàn tại các công trình do BMT Decor triển khai.",
    image: "/images/careers/job-sales.jpg",
    responsibilities: ["Lập kế hoạch thi công tuần.", "Kiểm soát vật tư và chất lượng.", "Nghiệm thu cùng các đội thi công."],
    benefits: ["Phụ cấp công trình.", "Thưởng tiến độ.", "Đầy đủ chế độ theo quy định."],
  },
  {
    id: "content-creator",
    title: "Content Creator",
    department: "Marketing",
    location: "TP.HCM",
    schedule: "Toàn thời gian",
    compensation: "10 - 15 triệu",
    summary: "Sáng tạo nội dung về kiến trúc, nội thất và câu chuyện phía sau mỗi công trình.",
    image: "/images/careers/job-marketing.jpg",
    responsibilities: ["Xây dựng kế hoạch nội dung.", "Sản xuất bài viết và video ngắn.", "Đo lường hiệu quả nội dung."],
    benefits: ["Ngân sách học tập.", "Thiết bị hỗ trợ công việc.", "Thưởng theo hiệu quả."],
  },
  {
    id: "quantity-surveyor",
    title: "Kỹ sư Dự toán",
    department: "Dự toán",
    location: "TP.HCM",
    schedule: "Toàn thời gian",
    compensation: "Thoả thuận",
    summary: "Bóc tách khối lượng, lập dự toán và kiểm soát ngân sách cho các dự án xây dựng - nội thất.",
    image: "/images/careers/job-sales.jpg",
    responsibilities: ["Bóc tách khối lượng từ bản vẽ.", "Lập báo giá và hồ sơ dự toán.", "Theo dõi biến động chi phí."],
    benefits: ["Thưởng dự án.", "Môi trường làm việc ổn định.", "Bảo hiểm đầy đủ."],
  },
  {
    id: "hr-executive",
    title: "Chuyên viên Nhân sự",
    department: "Nhân sự",
    location: "TP.HCM",
    schedule: "Toàn thời gian",
    compensation: "10 - 14 triệu",
    summary: "Phụ trách tuyển dụng, hội nhập nhân sự và các hoạt động gắn kết văn hóa nội bộ.",
    image: "/images/careers/job-marketing.jpg",
    responsibilities: ["Tuyển dụng theo kế hoạch.", "Tổ chức hội nhập nhân sự mới.", "Hỗ trợ hoạt động văn hóa nội bộ."],
    benefits: ["Thưởng hiệu suất.", "Đào tạo nghiệp vụ.", "Du lịch và hoạt động nội bộ."],
  },
  {
    id: "accountant",
    title: "Kế toán Tổng hợp",
    department: "Tài chính",
    location: "TP.HCM",
    schedule: "Toàn thời gian",
    compensation: "Thoả thuận",
    summary: "Theo dõi nghiệp vụ kế toán, công nợ và báo cáo tài chính định kỳ của công ty.",
    image: "/images/careers/job-design.jpg",
    responsibilities: ["Hạch toán nghiệp vụ phát sinh.", "Theo dõi công nợ.", "Lập báo cáo định kỳ."],
    benefits: ["Lương tháng 13.", "Bảo hiểm đầy đủ.", "Môi trường chuyên nghiệp."],
  },
];
