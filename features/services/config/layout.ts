/**
 * Kích thước dùng chung cho cụm trang dịch vụ. Giữ các token tại một nơi để
 * banner và hai section lặp lại không bị lệch khi từng trang được tinh chỉnh.
 */
export const SERVICE_HERO_CLASS_NAME =
  "relative isolate min-h-[760px] overflow-hidden bg-[#F2F2F3] lg:h-[clamp(560px,38.9vw,760px)] lg:min-h-0";

export const SERVICE_PROJECT_SECTION_CLASS_NAME =
  "relative isolate overflow-hidden py-12 lg:py-16";

export const SERVICE_PROJECT_HEADING_CLASS_NAME =
  "mx-auto flex w-[min(1200px,calc(100%-2.25rem))] flex-col items-center text-center"; // Đã xóa bỏ lg:min-h-[220px] gây lỗi khoảng trắng

export const SERVICE_PROJECT_CAROUSEL_CLASS_NAME = "mt-8 lg:mt-10 w-full"; // Kéo Carousel sát lên một chút (từ mt-12 xuống mt-8)

export const SERVICE_PROJECT_CTA_CLASS_NAME =
  "mt-10 lg:mt-12 flex h-[54px] justify-center"; // Canh nút bấm với Carousel cho đều

export const SERVICE_SOLUTION_SECTION_CLASS_NAME = "py-12 lg:py-16";

export const SERVICE_SOLUTION_HEADING_CLASS_NAME =
  "mx-auto w-[min(1200px,calc(100%-2.25rem))] text-center mb-8 lg:mb-10"; // Đã xóa bỏ lg:min-h-[180px] và đẩy khoảng cách xuống bằng margin bottom

export const SERVICE_SOLUTION_CARDS_CLASS_NAME =
  "mx-auto w-[min(1040px,calc(100%-2.25rem))]";
