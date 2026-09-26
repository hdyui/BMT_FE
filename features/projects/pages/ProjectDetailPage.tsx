"use client";

import { useMemo } from "react";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { ContactForm } from "@/shared/components/ContactForm";
import type {
  ProjectDetail,
  ProjectsPublicData,
} from "@/features/projects/types/projects-public";
import { ProjectsHero } from "../components/ProjectsHero";
import { ProjectOverview } from "../components/ProjectOverview";
import { ProjectEditorialGallery } from "../components/ProjectEditorialGallery";
import { ProjectProcess } from "../components/ProjectProcess";
import { BeforeAfterGallery } from "../components/BeforeAfterGallery";
import { RelatedProjects } from "../components/RelatedProjects";

export function ProjectDetailPage({ slug, project, sharedData }: {
  slug: string;
  project: ProjectDetail;
  sharedData: ProjectsPublicData;
}) {
  const relatedProjects = useMemo(
    () =>
      sharedData.projects
        .filter((item) => item.slug !== slug)
        .slice(0, 8),
    [sharedData.projects, slug],
  );

  return (
    <>
      <SiteHeader />
      <main
        className="bg-white pt-[60px] text-charcoal xl:pt-[var(--site-header-desktop-height)]"
        data-scroll-snap-page
      >
        <ProjectsHero hero={sharedData.page.hero} />
        {project && (
          <>
            <ProjectOverview project={project} />
            {project.renders.length > 0 && (
              <ProjectEditorialGallery project={project} />
            )}
            {(project.process.length > 0 || project.processDescription) && (
              <ProjectProcess project={project} />
            )}
            {project.comparisons.length > 0 && (
              <BeforeAfterGallery project={project} />
            )}
            <RelatedProjects projects={relatedProjects} />
          </>
        )}
      </main>
      {project && (
        <ContactForm
          showTopNotch
          title={project.ctaTitle || sharedData.page.contactForm.title}
          description={
            project.ctaDescription || sharedData.page.contactForm.description
          }
          submitLabel={sharedData.page.contactForm.submitLabel}
          successMessage={
            project.ctaSuccessMessage ||
            sharedData.page.contactForm.successMessage
          }
          submitToApi
        />
      )}
      <SiteFooter />
    </>
  );
}
