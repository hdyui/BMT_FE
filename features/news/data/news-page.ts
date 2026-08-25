export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  desktopImage: string;
  mobileImage: string;
  imageAlt: string;
  href: string;
  body: string;
}

const desktopImage = "/images/news/article-model.jpg";
const mobileImage = "/images/news/mobile/article-photo.png";

const featuredCopy = [
  ["Xu hướng thiết kế nhà ở hiện đại, tối ưu công năng", "Những nguyên tắc giúp không gian sống cân bằng giữa thẩm mỹ, tiện nghi và nhu cầu sử dụng thực tế của gia đình."],
  ["Kinh nghiệm chuẩn bị trước khi thi công xây dựng", "Từ bản vẽ, vật liệu đến kế hoạch ngân sách: các bước cần thống nhất để công trình được triển khai đúng tiến độ."],
  ["Giải pháp cải tạo nhà ở bền vững và tiết kiệm", "Cách đánh giá hiện trạng và lựa chọn hạng mục ưu tiên để nâng cấp không gian hiệu quả, hạn chế chi phí phát sinh."],
  ["Phối hợp kiến trúc và nội thất trong một tổng thể", "Một quy trình thiết kế xuyên suốt giúp vật liệu, ánh sáng và công năng kết nối tự nhiên trong từng không gian."],
  ["Lựa chọn vật liệu phù hợp với khí hậu Việt Nam", "Những tiêu chí thực tế để vật liệu giữ được vẻ đẹp, độ bền và khả năng bảo trì thuận tiện theo thời gian."],
] as const;

export const featuredNews: NewsArticle[] = featuredCopy.map(([title, excerpt], index) => ({
  id: `featured-news-${index + 1}`,
  slug: `tin-noi-bat-${index + 1}`,
  title,
  excerpt,
  desktopImage,
  mobileImage: "/images/news/mobile/featured-photo.png",
  imageAlt: `Minh họa bài viết ${title}`,
  href: `/tin-tuc#tin-noi-bat-${index + 1}`,
  body: `<p>${excerpt}</p>`,
}));

const articleTitles = [
  "5 lưu ý quan trọng khi lập kế hoạch xây dựng nhà ở",
  "Cách tối ưu ánh sáng tự nhiên cho không gian sống",
  "Kinh nghiệm lựa chọn đơn vị thiết kế và thi công trọn gói",
  "Những lỗi thường gặp khi cải tạo nhà cũ",
  "Vật liệu nội thất bền đẹp cho gia đình hiện đại",
  "Bố trí công năng hợp lý cho nhà phố diện tích nhỏ",
  "Quy trình kiểm soát chất lượng trong quá trình thi công",
  "Xu hướng sử dụng màu sắc trong thiết kế nội thất",
  "Giải pháp chống nóng và thông gió cho nhà ở đô thị",
  "Cách dự trù ngân sách thi công sát với thực tế",
  "Không gian mở: khi nào nên sử dụng trong nhà ở?",
  "Các bước nghiệm thu công trình trước khi bàn giao",
  "Thiết kế phòng khách cân bằng thẩm mỹ và tiện nghi",
  "Cải tạo mặt tiền để nâng tầm giá trị công trình",
  "Những tiêu chí chọn vật liệu hoàn thiện lâu bền",
] as const;

const defaultExcerpt = "BMT Decor chia sẻ góc nhìn thực tế từ quá trình thiết kế và thi công, giúp gia chủ chủ động hơn trong từng quyết định về công năng, vật liệu và ngân sách.";

export const articles: NewsArticle[] = articleTitles.map((title, index) => ({
  id: `news-${index + 1}`,
  slug: `bai-viet-${index + 1}`,
  title,
  excerpt: defaultExcerpt,
  desktopImage,
  mobileImage,
  imageAlt: `Mô hình kiến trúc minh họa cho bài viết ${title}`,
  href: `/tin-tuc#bai-viet-${index + 1}`,
  body: `<p>${defaultExcerpt}</p>`,
}));
