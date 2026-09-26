import { apiClient } from "@/lib/api";
import type { ApiEnvelope } from "@/lib/api";

export interface QuotationOptionSection {
  heading: string;
  instruction: string;
  options: string[];
}

export interface QuotationTextSection {
  heading: string;
  instruction: string;
  placeholder: string;
  unit: string;
}

export interface QuotationPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    mobileImage: string;
    mainPhoto: string;
  };
  estimator: {
    stepLabels: string[];
    buildingType: QuotationOptionSection;
    area: QuotationTextSection;
    budget: QuotationTextSection;
    service: QuotationOptionSection;
    resultIncludeLabel: string;
  };
  contactForm: {
    title: string;
    subtitle: string;
    requiredMessage: string;
    successMessage: string;
  };
}

export interface QuotationEstimateRequest {
  buildingType: string;
  areaM2: number;
  budget?: number | null;
  serviceType: string;
}

export interface QuotationEstimateResponse {
  low?: number;
  high?: number;
  min?: number;
  max?: number;
  rate?: number;
  unitPriceMin?: number;
  unitPriceMax?: number;
  [key: string]: unknown;
}

function unwrap<T>(response: ApiEnvelope<T>) {
  if (!response.isSuccess) {
    throw new Error("Quotation API returned an unsuccessful response.");
  }
  return response.value;
}

export async function getQuotationPage() {
  const response = await apiClient.get<ApiEnvelope<{
    pageCode: string;
    content: QuotationPageContent;
  }>>("/api/v1/pages/quotation");
  return unwrap(response);
}

export async function getAdminQuotationPage() {
  const response = await apiClient.get<
    ApiEnvelope<ApiEnvelope<{
      pageCode: string;
      content: QuotationPageContent;
    }>>
  >("/api/v1/admin/pages/quotation");
  return unwrap(response).value;
}

export function calculateQuotation(input: QuotationEstimateRequest) {
  return apiClient.post<QuotationEstimateResponse | ApiEnvelope<QuotationEstimateResponse>>(
    "/api/v1/quotation/estimate",
    input,
  );
}

export async function updateQuotationHero(input: unknown) {
  return apiClient.patch("/api/v1/admin/pages/quotation/hero", input);
}

export async function updateQuotationEstimator(input: unknown) {
  return apiClient.patch("/api/v1/admin/pages/quotation/estimator", input);
}

export async function updateQuotationContactForm(input: unknown) {
  return apiClient.patch("/api/v1/admin/pages/quotation/contact-form", input);
}

export async function getQuotationPriceRanges() {
  return apiClient.get("/api/v1/admin/price-ranges");
}

export async function createQuotationPriceRange(input: unknown) {
  return apiClient.post("/api/v1/admin/price-ranges", input);
}

export async function updateQuotationPriceRange(id: string, input: unknown) {
  return apiClient.patch(`/api/v1/admin/price-ranges/${id}`, input);
}
