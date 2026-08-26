import type { ContactFormContent } from "@/lib/components/shared/contact-form-content";

export const servicesOverviewSectionContent = {
  hero: {
    eyebrow: "GIẢI PHÁP",
    title: "THIẾT KẾ THI CÔNG, XÂY DỰNG VÀ\nCẢI TẠO TRỌN GÓI",
    supportingTitle:
      "ĐÁP ỨNG ĐA DẠNG NHU CẦU CHO NHÀ Ở VÀ CÔNG TRÌNH THƯƠNG\u00A0MẠI",
    description:
      "BMT Decor mang đến dịch vụ thiết kế thi công, xây dựng và cải tạo trọn gói từ ý tưởng đến hoàn thiện, tạo nên những công trình chất lượng và đáp ứng nhu cầu sử dụng.",
  },
  process: {
    title: "QUY TRÌNH LÀM VIỆC",
    descriptionLineOne:
      "BMT Decor triển khai dự án theo quy trình 6 bước rõ ràng, đảm bảo tiến độ,",
    descriptionLineTwo:
      "chất lượng và đồng hành cùng khách hàng trong từng giai đoạn.",
  },
  faq: {
    title: "CÁC CÂU HỎI THƯỜNG GẶP",
    descriptionLineOne:
      "Giải đáp những thắc mắc phổ biến giúp khách hàng hiểu rõ",
    descriptionLineTwo: "hơn về quy trình và dịch vụ của BMT Decor",
  },
} as const;

export const heroCards = [
  { image: "/images/services/hero-card-01.webp", alt: "Thi công vách kính tại công trình BMT Decor" },
  { image: "/images/services/hero-card-02.webp", alt: "Không gian bếp và phòng ăn hoàn thiện" },
  { image: "/images/services/hero-card-03.webp", alt: "Giàn giáo thi công mặt tiền công trình" },
  { image: "/images/services/hero-card-04.webp", alt: "Đội thi công xử lý mặt sàn công trình" },
] as const;

export const serviceTabs = [
  {
    tabLabel: "XÂY DỰNG TRỌN GÓI",
    label: "XÂY DỰNG TRỌN GÓI",
    tagline: "KIẾN TẠO CÔNG TRÌNH BỀN VỮNG - TỪ THIẾT KẾ ĐẾN THI CÔNG",
    copy: "Triển khai đồng bộ từ tư vấn, thiết kế đến thi công và bàn giao, giúp khách hàng kiểm soát tiến độ, tối ưu chi phí và đảm bảo chất lượng công trình trong từng giai đoạn.",
    image: "/images/services/service-01.webp",
  },
  {
    tabLabel: "THIẾT KẾ KIẾN TRÚC & NỘI THẤT",
    label: "THIẾT KẾ KIẾN TRÚC & NỘI THẤT",
    tagline: "KIẾN TẠO KHÔNG GIAN HÀI HÒA GIỮA THẨM MỸ VÀ CÔNG NĂNG",
    copy: "Mỗi phương án được nghiên cứu từ hiện trạng, nhu cầu sử dụng và phong cách sống nhằm tạo nên không gian có dấu ấn riêng, tối ưu công năng và giá trị sử dụng lâu dài.",
    image: "/images/services/service-02.webp",
  },
  {
    tabLabel: "THI CÔNG XÂY DỰNG",
    label: "THI CÔNG XÂY DỰNG",
    tagline: "THI CÔNG CHUẨN KỸ THUẬT - ĐẢM BẢO CHẤT LƯỢNG CÔNG TRÌNH",
    copy: "Quy trình thi công được triển khai theo đúng hồ sơ thiết kế và tiêu chuẩn kỹ thuật. Từng hạng mục đều được kiểm soát chặt chẽ để đảm bảo chất lượng, tiến độ, an toàn và độ bền của công trình.",
    image: "/images/services/service-03.webp",
  },
  {
    tabLabel: "CẢI TẠO & SỬA CHỮA",
    label: "CẢI TẠO & SỬA CHỮA",
    tagline: "LÀM MỚI KHÔNG GIAN - GIA TĂNG GIÁ TRỊ SỬ DỤNG",
    copy: "Từ khảo sát hiện trạng đến đề xuất phương án và triển khai thi công, mọi hạng mục đều được thực hiện đồng bộ nhằm cải thiện công năng, nâng cấp diện mạo và đáp ứng tốt hơn nhu cầu sử dụng.",
    image: "/images/services/service-04.webp",
  },
] as const;

export const processSteps = [
  {
    title: "TIẾP NHẬN YÊU CẦU",
    copy: "Tiếp nhận thông tin, lắng nghe nhu cầu và tư vấn định hướng ban đầu để hiểu rõ mục tiêu của từng dự án.",
    image: "/images/services/process-01.webp",
    imageOpen: "/images/services/process-01-open.webp",
  },
  {
    title: "KHẢO SÁT & TƯ VẤN",
    copy: "Khảo sát hiện trạng, phân tích đặc điểm công trình và đề xuất phương án phù hợp với công năng, thẩm mỹ và ngân sách.",
    image: "/images/services/process-02.webp",
    imageOpen: "/images/services/process-02-open.webp",
  },
  {
    title: "THIẾT KẾ & BÁO GIÁ",
    copy: "Xây dựng phương án thiết kế, hoàn thiện hồ sơ và lập dự toán chi tiết, đảm bảo minh bạch trước khi triển khai.",
    image: "/images/services/process-03.webp",
    imageOpen: "/images/services/process-03-open.webp",
  },
  {
    title: "KÝ KẾT HỢP ĐỒNG",
    copy: "Thống nhất phạm vi công việc, tiến độ, chi phí và các điều khoản nhằm đảm bảo quyền lợi của các bên.",
    image: "/images/services/process-04.webp",
    imageOpen: "/images/services/process-04-open.webp",
  },
  {
    title: "THI CÔNG & GIÁM SÁT",
    copy: "Tổ chức thi công theo đúng hồ sơ thiết kế, kiểm soát chặt chẽ chất lượng, tiến độ và từng hạng mục trong suốt quá trình thực hiện.",
    image: "/images/services/process-05.webp",
    imageOpen: "/images/services/process-05-open.webp",
  },
  {
    title: "NGHIỆM THU & BÀN GIAO",
    copy: "Nghiệm thu công trình theo tiêu chuẩn chất lượng, bàn giao hoàn thiện và thực hiện bảo hành theo đúng cam kết.",
    image: "/images/services/process-06.webp",
    imageOpen: "/images/services/process-06-open.webp",
  },
] as const;

export const frequentlyAskedQuestions = [
  {
    question: "BMT Decor cung cấp những dịch vụ nào?",
    answer:
      "Chúng tôi cung cấp dịch vụ thiết kế và thi công trọn gói cho nhà ở, văn phòng, showroom, cửa hàng, spa, nhà hàng cùng nhiều loại hình công trình khác, từ tư vấn, thiết kế đến hoàn thiện và bàn giao.",
  },
  {
    question: "BMT Decor có khảo sát công trình miễn phí không?",
    answer:
      "Có. Đội ngũ của BMT Decor sẽ khảo sát hiện trạng và tư vấn giải pháp phù hợp trước khi lên phương án thiết kế và báo giá.",
  },
  {
    question: "Thời gian thiết kế và thi công mất bao lâu?",
    answer:
      "Thời gian thực hiện phụ thuộc vào quy mô và yêu cầu của từng công trình. Sau khi khảo sát, BMT Decor sẽ xây dựng tiến độ chi tiết và cam kết thực hiện đúng kế hoạch.",
  },
  {
    question: "Chi phí thiết kế và thi công được tính như thế nào?",
    answer:
      "Chi phí được xác định dựa trên diện tích, hạng mục thực hiện, vật liệu sử dụng và yêu cầu thiết kế. Báo giá được lập rõ ràng, minh bạch trước khi ký hợp đồng.",
  },
  {
    question: "Trong quá trình thi công có phát sinh chi phí không?",
    answer:
      "Mọi chi phí đều được thống nhất trước khi triển khai. Trường hợp phát sinh theo yêu cầu của khách hàng hoặc thay đổi thiết kế, BMT Decor sẽ trao đổi và xác nhận trước khi thực hiện.",
  },
  {
    question: "BMT Decor có nhận thi công theo bản vẽ có sẵn không?",
    answer:
      "Có. Chúng tôi nhận thi công theo bản vẽ do khách hàng cung cấp hoặc do đơn vị khác thiết kế, đồng thời tư vấn để tối ưu giải pháp khi cần.",
  },
  {
    question: "BMT Decor có nhận cải tạo và sửa chữa công trình không?",
    answer:
      "Có. BMT Decor nhận cải tạo, sửa chữa và nâng cấp nhà ở, văn phòng, cửa hàng cùng nhiều không gian khác, đảm bảo an toàn và hạn chế ảnh hưởng đến quá trình sử dụng.",
  },
  {
    question: "Quy trình làm việc của BMT Decor gồm những bước nào?",
    answer:
      "Quy trình gồm: tiếp nhận yêu cầu, khảo sát – tư vấn, thiết kế, báo giá, ký hợp đồng, thi công, nghiệm thu và bàn giao công trình.",
  },
  {
    question: "Chính sách bảo hành sau khi bàn giao như thế nào?",
    answer:
      "BMT Decor áp dụng chính sách bảo hành theo từng hạng mục thi công và cam kết hỗ trợ nhanh chóng khi khách hàng cần bảo trì hoặc xử lý sự cố.",
  },
  {
    question: "Làm thế nào để nhận tư vấn và báo giá?",
    answer:
      "Khách hàng có thể liên hệ qua hotline, website hoặc để lại thông tin trên biểu mẫu. Đội ngũ BMT Decor sẽ phản hồi và tư vấn trong thời gian sớm nhất.",
  },
] as const;

// Nội dung riêng của section "Liên hệ tư vấn" trên trang Tổng quan dịch vụ.
// Cố ý khai báo đầy đủ (không dùng chung với các trang khác) để admin sửa trang
// này thì chỉ trang này đổi.
export const contactFormContent: ContactFormContent = {
  title: "LIÊN HỆ TƯ VẤN",
  namePlaceholder: "Tên khách hàng...",
  phonePlaceholder: "Số điện thoại...",
  submitLabel: "Gửi ngay",
  requiredMessage: "Vui lòng nhập thông tin.",
  successMessage:
    "Cảm ơn bạn đã gửi thông tin. BMT Decor sẽ liên hệ với bạn trong thời gian sớm nhất.",
};
