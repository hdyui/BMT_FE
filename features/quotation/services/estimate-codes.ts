/**
 * Mã enum của backend cho loại hình và gói dịch vụ (`POST /quotation/estimate`,
 * `/admin/price-ranges`). Nhãn hiển thị do admin đặt (`estimator.buildingType.options`,
 * `estimator.service.options`) nên gắn với mã theo THỨ TỰ lựa chọn, không theo chữ:
 * đổi nhãn thì mã vẫn đúng.
 */
export const BUILDING_TYPE_CODES = [
  "nha_o",
  "van_phong",
  "tham_my_vien_showroom",
  "nha_hang_khach_san",
] as const;

export const SERVICE_TYPE_CODES = [
  "xay_dung_tron_goi",
  "thiet_ke_kien_truc_noi_that",
  "thi_cong_xay_dung",
  "cai_tao_sua_chua",
] as const;

export type BuildingTypeCode = (typeof BUILDING_TYPE_CODES)[number];
export type ServiceTypeCode = (typeof SERVICE_TYPE_CODES)[number];

/** Giới hạn đầu vào do backend kiểm tra (đơn giá tính trên m² sàn). */
export const ESTIMATE_LIMITS = {
  areaMin: 10,
  areaMax: 50_000,
  budgetMax: 1_000_000_000_000,
} as const;
