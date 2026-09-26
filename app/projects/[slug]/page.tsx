import { notFound } from "next/navigation";
import { ProjectDetailPage } from "@/features/projects/pages/ProjectDetailPage";
import { mapProjectDetail, buildProjectsPublicData } from "@/features/projects/api/get-projects-public-data";
import { getPublicApiValue, PublicApiError } from "@/shared/lib/api/server";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = getPublicApiValue(`/projects/${encodeURIComponent(slug)}`).catch((error: unknown) => {
    if (error instanceof PublicApiError && error.status === 404) notFound();
    throw error;
  });
  const [detailValue, projectsApiValue, pageApiValue] = await Promise.all([
    detail, getPublicApiValue("/projects"), getPublicApiValue("/pages/projects"),
  ]);
  const project = mapProjectDetail(detailValue);
  if (!project) notFound();
  const sharedData = buildProjectsPublicData({ projectsApiValue, pageApiValue });
  return <ProjectDetailPage key={slug} slug={slug} project={project} sharedData={sharedData} />;
}
