import type { BuildingTypeCode, ServiceTypeCode } from "@/features/quotation/services/estimate-codes";
import { api } from "@/shared/lib/api/client";
import { fetchPageContent } from "@/shared/lib/api/public-content";

export interface QuotationOptionSection {
  heading: string;
  instruction: string;
  options: string[];
}

export interface QuotationInputSection {
  heading: string;
  instruction: string;
  placeholder: string;
  unit: string;
}

/** Nội dung trang Báo giá (`GET /pages/quotation` → `content`). */
export interface QuotationPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    mobileImage?: string;
    mainPhoto?: string;
  };
  estimator: {
    stepLabels: string[];
    buildingType: QuotationOptionSection;
    area: QuotationInputSection;
    budget: QuotationInputSection;
    service: QuotationOptionSection;
    resultIncludeLabel: string;
  };
  contactForm: {
    title: string;
    subtitle?: string;
    requiredMessage: string;
    successMessage: string;
  };
}

/** Trang public: `null` khi backend không trả được nội dung. */
export function getQuotationContent() {
  return fetchPageContent<QuotationPageContent>("quotation");
}

export interface QuotationEstimateRequest {
  buildingType: BuildingTypeCode;
  serviceType: ServiceTypeCode;
  areaM2: number;
  budget?: number | null;
}

/** Kết quả `POST /quotation/estimate` (số tiền đã làm tròn đến 1.000đ). */
export interface QuotationEstimate {
  buildingType: string;
  serviceType: string;
  areaM2: number;
  unitPriceMin: number;
  unitPriceMax: number;
  estimateMin: number;
  estimateMax: number;
  displayUnitPrice: number;
  budgetComparison: {
    status: "thieu" | "phu_hop" | "du";
    difference: number;
    ratio: number;
    budgetPerM2: number;
  } | null;
}

/** Công thức tính nằm ở backend, dựa trên bảng giá thị trường admin nhập. */
export function estimateQuotation(input: QuotationEstimateRequest) {
  return api.post<QuotationEstimate>("/quotation/estimate", input, { public: true });
}
