import "server-only";
import { getPublicApiValue } from "./server";
import { buildHomePublicData } from "@/features/home/api/get-home-public-data";
import { buildAboutPublicData } from "@/features/about/api/get-about-public-data";
import { buildProjectsPublicData } from "@/features/projects/api/get-projects-public-data";
import { buildNewsPublicData } from "@/features/news/api/get-news-public-data";
import { buildCareersPublicData, emptyCareersPublicData } from "@/features/careers/api/get-careers-public-data";
import { buildContactPublicData, emptyContactPublicData } from "@/features/contact/api/get-contact-public-data";

// Backend có thể chậm/timeout lúc build (ví dụ Render free tier cold start).
// Một trang lỗi không được phép làm sập cả `next build`, nên bắt lỗi và để
// các hàm build*PublicData tự dùng fallback tĩnh có sẵn của chúng.
function warnFetchFailed(label: string, error: unknown) {
  console.warn(`[public-data] Không lấy được dữ liệu cho ${label}:`, error);
}

export async function getHomeData() {
  try {
    const [homeApiValue, newsApiValue, projectsApiValue, projectCategoriesApiValue] = await Promise.all([
      getPublicApiValue("/pages/home/full-content"), getPublicApiValue("/news?HighlightHome=true"),
      getPublicApiValue("/projects"), getPublicApiValue("/project-categories"),
    ]);
    return buildHomePublicData({ homeApiValue, newsApiValue, projectsApiValue, projectCategoriesApiValue });
  } catch (error) {
    warnFetchFailed("home", error);
    return buildHomePublicData({});
  }
}
export async function getAboutData() {
  try {
    return buildAboutPublicData({ aboutApiValue: await getPublicApiValue("/pages/about") });
  } catch (error) {
    warnFetchFailed("about", error);
    return buildAboutPublicData({});
  }
}
export async function getProjectsData() {
  try {
    const [projectsApiValue, categoriesApiValue, pageApiValue] = await Promise.all([
      getPublicApiValue("/projects"), getPublicApiValue("/project-categories"), getPublicApiValue("/pages/projects"),
    ]);
    return buildProjectsPublicData({ projectsApiValue, categoriesApiValue, pageApiValue });
  } catch (error) {
    warnFetchFailed("projects", error);
    return buildProjectsPublicData({});
  }
}
export async function getNewsData() {
  try {
    const [newsApiValue, featuredApiValue, pageApiValue] = await Promise.all([
      getPublicApiValue("/news"), getPublicApiValue("/news?Featured=true"), getPublicApiValue("/pages/news"),
    ]);
    return buildNewsPublicData({ newsApiValue, featuredApiValue, pageApiValue });
  } catch (error) {
    warnFetchFailed("news", error);
    return buildNewsPublicData({});
  }
}
export async function getCareersData() {
  try {
    const [jobsApiValue, pageApiValue] = await Promise.all([getPublicApiValue("/jobs"), getPublicApiValue("/pages/recruitment")]);
    return buildCareersPublicData({ jobsApiValue, pageApiValue });
  } catch (error) {
    warnFetchFailed("careers", error);
    return emptyCareersPublicData();
  }
}
export async function getContactData() {
  try {
    return buildContactPublicData(await getPublicApiValue("/pages/contact"));
  } catch (error) {
    warnFetchFailed("contact", error);
    return emptyContactPublicData();
  }
}
