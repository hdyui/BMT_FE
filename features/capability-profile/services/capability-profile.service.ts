import { apiClient, type ApiEnvelope } from "@/lib/api";

export interface CapabilityProfilePage {
  id: string;
  title: string;
  imageUrl: string;
  metadata?: {
    sortOrder?: number | null;
  } | null;
}

export interface CapabilityProfileContent {
  hero: {
    title: string;
    description: string;
    subtitle: string;
    heroImage: string;
    decor08: string;
    heroImageAlt: string;
    documentHeading: string;
  };
  contactForm: {
    title: string;
    subtitle: string;
    successMessage: string;
  };
}

export interface CapabilityProfilePageContent {
  pageCode: string;
  content: CapabilityProfileContent;
}

interface CapabilityProfilePageInput {
  title: string;
  imageUrl: string;
  metadata?: { sortOrder?: number };
}

export interface CapabilityProfileHeroUpdateInput {
  title: string;
  description: string;
  subtitle: string;
  documentHeading: string;
}

const capabilityProfilePagesPath = "/api/v1/capability-profile/pages";
const capabilityProfileContentPath = "/api/v1/pages/capability-profile";
const adminCapabilityProfileContentPath = "/api/v1/admin/pages/capability-profile";

function unwrap<T>(response: ApiEnvelope<T>) {
  if (!response.isSuccess) {
    throw new Error("Company profile API returned an unsuccessful response.");
  }
  return response.value;
}

export async function getCapabilityProfilePages() {
  const response = await apiClient.get<ApiEnvelope<{ items: CapabilityProfilePage[] }>>(
    capabilityProfilePagesPath,
  );
  return unwrap(response).items;
}

export async function getCapabilityProfileContent() {
  const response = await apiClient.get<ApiEnvelope<CapabilityProfilePageContent>>(
    capabilityProfileContentPath,
  );
  return unwrap(response);
}

export async function getAdminCapabilityProfilePages() {
  const response = await apiClient.get<
    ApiEnvelope<ApiEnvelope<{ items: CapabilityProfilePage[] }>>
  >(`${capabilityProfilePagesPath.replace("/api/v1", "/api/v1/admin")}?pageIndex=1&pageSize=100`);
  return unwrap(response).value.items;
}

export async function getAdminCapabilityProfileContent() {
  const response = await apiClient.get<
    ApiEnvelope<ApiEnvelope<CapabilityProfilePageContent>>
  >(adminCapabilityProfileContentPath);
  return unwrap(response).value;
}

export async function seedCapabilityProfileContent(input: CapabilityProfileContent) {
  return apiClient.post(`${adminCapabilityProfileContentPath}/content`, input);
}

export async function updateCapabilityProfileHero(input: CapabilityProfileHeroUpdateInput) {
  return apiClient.patch(`${adminCapabilityProfileContentPath}/hero`, input);
}

export async function updateCapabilityProfileContactForm(
  input: CapabilityProfileContent["contactForm"],
) {
  return apiClient.patch(`${adminCapabilityProfileContentPath}/contact-form`, input);
}

export async function createCapabilityProfilePage(input: CapabilityProfilePageInput) {
  const response = await apiClient.post<ApiEnvelope<CapabilityProfilePage>>(
    "/api/v1/admin/capability-profile/pages",
    input,
  );
  return unwrap(response);
}

export async function updateCapabilityProfilePage(
  id: string,
  input: Partial<CapabilityProfilePageInput>,
) {
  const response = await apiClient.patch<ApiEnvelope<CapabilityProfilePage>>(
    `/api/v1/admin/capability-profile/pages/${id}`,
    input,
  );
  return unwrap(response);
}

export async function deleteCapabilityProfilePage(id: string) {
  await apiClient.delete(`/api/v1/admin/capability-profile/pages/${id}`);
}
