/**
 * Kích thước dùng chung cho cụm trang dịch vụ. Giữ các token tại một nơi để
 * banner và hai section lặp lại không bị lệch khi từng trang được tinh chỉnh.
 *
 * Quy ước: KHÔNG dùng px cứng. Mọi kích thước đi theo viewport (vw / clamp) hoặc
 * theo thang spacing của Tailwind để layout co giãn được ở mọi khổ màn hình.
 */
export const SERVICE_HERO_CLASS_NAME =
  "relative isolate min-h-[clamp(28rem,92vw,47.5rem)] overflow-hidden bg-[#F2F2F3] lg:h-[clamp(35rem,38.9vw,47.5rem)] lg:min-h-0";

export const SERVICE_PROJECT_SECTION_CLASS_NAME =
  "relative isolate overflow-hidden py-10 sm:py-12 lg:py-16";

export const SERVICE_PROJECT_HEADING_CLASS_NAME =
  "mx-auto flex w-[min(75rem,calc(100%-2.25rem))] flex-col items-center text-center";

export const SERVICE_PROJECT_CAROUSEL_CLASS_NAME = "mt-6 sm:mt-8 lg:mt-10 w-full";

// h-11 (44px) ở màn nhỏ, giữ nguyên 54px của bản desktop từ lg trở lên.
export const SERVICE_PROJECT_CTA_CLASS_NAME =
  "mt-8 lg:mt-12 flex h-11 sm:h-12 lg:h-[3.375rem] justify-center";

export const SERVICE_SOLUTION_SECTION_CLASS_NAME = "py-10 sm:py-12 lg:py-16";

export const SERVICE_SOLUTION_HEADING_CLASS_NAME =
  "mx-auto w-[min(75rem,calc(100%-2.25rem))] text-center mb-8 lg:mb-10";

export const SERVICE_SOLUTION_CARDS_CLASS_NAME =
  "mx-auto w-[min(65rem,calc(100%-2.25rem))]";

/**
 * Cỡ chữ cho nút pill "TƯ VẤN MIỄN PHÍ" — trước đây fix cứng 24px ở mọi khổ màn
 * nên chữ tràn ra ngoài nút khi màn hẹp. Từ lg trở lên vẫn đúng 24px như bản cũ.
 */
export const SERVICE_PILL_CTA_TEXT_CLASS_NAME =
  "!text-sm sm:!text-xl lg:!text-2xl";
