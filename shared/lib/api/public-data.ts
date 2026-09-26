import "server-only";
import { getPublicApiValue } from "./server";
import { buildHomePublicData } from "@/features/home/api/get-home-public-data";
import { buildAboutPublicData } from "@/features/about/api/get-about-public-data";
import { buildProjectsPublicData } from "@/features/projects/api/get-projects-public-data";
import { buildNewsPublicData } from "@/features/news/api/get-news-public-data";
import { buildCareersPublicData } from "@/features/careers/api/get-careers-public-data";
import { buildContactPublicData } from "@/features/contact/api/get-contact-public-data";

export async function getHomeData() {
  const [homeApiValue, newsApiValue, projectsApiValue, projectCategoriesApiValue] = await Promise.all([
    getPublicApiValue("/pages/home/full-content"), getPublicApiValue("/news?HighlightHome=true"),
    getPublicApiValue("/projects"), getPublicApiValue("/project-categories"),
  ]);
  return buildHomePublicData({ homeApiValue, newsApiValue, projectsApiValue, projectCategoriesApiValue });
}
export async function getAboutData() {
  return buildAboutPublicData({ aboutApiValue: await getPublicApiValue("/pages/about") });
}
export async function getProjectsData() {
  const [projectsApiValue, categoriesApiValue, pageApiValue] = await Promise.all([
    getPublicApiValue("/projects"), getPublicApiValue("/project-categories"), getPublicApiValue("/pages/projects"),
  ]);
  return buildProjectsPublicData({ projectsApiValue, categoriesApiValue, pageApiValue });
}
export async function getNewsData() {
  const [newsApiValue, featuredApiValue, pageApiValue] = await Promise.all([
    getPublicApiValue("/news"), getPublicApiValue("/news?Featured=true"), getPublicApiValue("/pages/news"),
  ]);
  return buildNewsPublicData({ newsApiValue, featuredApiValue, pageApiValue });
}
export async function getCareersData() {
  const [jobsApiValue, pageApiValue] = await Promise.all([getPublicApiValue("/jobs"), getPublicApiValue("/pages/recruitment")]);
  return buildCareersPublicData({ jobsApiValue, pageApiValue });
}
export async function getContactData() {
  return buildContactPublicData(await getPublicApiValue("/pages/contact"));
}
