import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailPage } from "@/features/projects/pages/ProjectDetailPage";
import {
  getProjectDetail,
  projectSlugs,
} from "@/features/projects/data/project-details";

type ProjectDetailRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectDetail(slug);

  if (!project) {
    return { title: "Dự án không tồn tại | BMT Decor" };
  }

  return {
    title: {
      absolute: `${project.displayName} – ${project.title} | BMT Decor`,
    },
    description: `${project.scope} tại ${project.location}, phong cách ${project.style}. Khám phá bản vẽ, phối cảnh 3D và quá trình thi công của BMT Decor.`,
    openGraph: {
      title: `${project.displayName} | BMT Decor`,
      description: `${project.scope} tại ${project.location}.`,
    },
  };
}

export default async function ProjectDetailRoute({
  params,
}: ProjectDetailRouteProps) {
  const { slug } = await params;
  const project = getProjectDetail(slug);

  if (!project) notFound();

  return <ProjectDetailPage project={project} />;
}
