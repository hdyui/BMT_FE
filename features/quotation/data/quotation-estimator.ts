export const quotationSteps = [
  "Loại hình",
  "Diện tích",
  "Ngân sách",
  "Gói",
  "Ước tính",
] as const;

export const quotationBuildingTypes = [
  "Nhà ở",
  "Văn phòng",
  "Thẩm mỹ viện, showroom",
  "Nhà hàng, khách sạn",
];

export const quotationServiceTypes = [
  "Xây dựng trọn gói",
  "Thiết kế kiến trúc & nội thất",
  "Thi công xây dựng",
  "Cải tạo & sửa chữa",
];

export const quotationStepCopy = [
  [
    "BẠN CẦN THIẾT KẾ GÌ?",
    "Chọn loại không gian phù hợp với căn nhà của anh/chị",
  ],
  ["DIỆN TÍCH BAO NHIÊU?", "Điền diện tích sàn ước tính"],
  [
    "NGÂN SÁCH CỦA ANH CHỊ?",
    "Một khoảng ngân sách thực tế giúp chúng tôi gợi ý gói phù hợp",
  ],
  ["CHỌN MỨC DỊCH VỤ", "Có thể đổi bất cứ lúc nào, chỉ ảnh hưởng đến ước tính"],
] as const;

/** Ô nhập ở bước 02 (diện tích) và 03 (ngân sách). */
export const quotationAreaInput = {
  placeholder: "Diện tích sàn...",
  unit: "m²",
};
export const quotationBudgetInput = {
  placeholder: "Ngân sách ...",
  unit: "đ",
};

/** Chữ đứng trước tên gói ở dòng kết quả bước 05. */
export const quotationResultIncludeLabel = "Bao gồm";

/** Hai nút điều hướng giữa các bước. */
export const quotationNavLabels = {
  back: "Quay lại",
  next: "Tiếp tục",
};

export const quotationRates: Record<string, [number, number]> = {
  "Xây dựng trọn gói": [315000, 402500],
  "Thiết kế kiến trúc & nội thất": [220000, 285000],
  "Thi công xây dựng": [4800000, 6200000],
  "Cải tạo & sửa chữa": [2100000, 3800000],
};

/**
 * Khoảng giá thị trường (đ/m² sàn) theo từng cặp loại hình × gói, thứ tự gói
 * như `quotationServiceTypes`. Admin chỉnh khoảng này mỗi năm; backend lấy
 * khoảng đó (cùng lựa chọn của khách) để tính đơn giá hiển thị ở bước 05.
 */
export const quotationMarketRanges: Record<string, [number, number][]> = {
  "Nhà ở": [
    [5200000, 6500000],
    [270000, 300000],
    [3350000, 4300000],
    [2000000, 5000000],
  ],
  "Văn phòng": [
    [6750000, 7150000],
    [100000, 260000],
    [3000000, 4000000],
    [2000000, 6000000],
  ],
  "Thẩm mỹ viện, showroom": [
    [5000000, 10000000],
    [140000, 350000],
    [3000000, 4000000],
    [2000000, 6000000],
  ],
  "Nhà hàng, khách sạn": [
    [5200000, 7500000],
    [250000, 300000],
    [3400000, 4200000],
    [5000000, 8000000],
  ],
};

/** Ảnh mở đầu vẽ riêng cho khổ điện thoại (QuotationHero, ẩn từ md trở lên). */
export const quotationMobileHeroImage = "/images/bao-gia/mobile/quotation-hero.png";
