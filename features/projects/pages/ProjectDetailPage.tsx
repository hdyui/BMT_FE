import type { ProjectDetail } from "../data/project-details";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { ContactForm } from "@/shared/components/ContactForm";
import { ProjectsHero } from "../components/ProjectsHero";
import { ProjectOverview } from "../components/ProjectOverview";
import { ProjectEditorialGallery } from "../components/ProjectEditorialGallery";
import { ProjectProcess } from "../components/ProjectProcess";
import { BeforeAfterGallery } from "../components/BeforeAfterGallery";
import { RelatedProjects } from "../components/RelatedProjects";

export function ProjectDetailPage({ project }: { project: ProjectDetail }) {
  return (
    <>
      <SiteHeader />
      <main
        className="bg-white pt-[60px] text-charcoal xl:pt-[var(--site-header-desktop-height)]"
        data-scroll-snap-page
      >
        <ProjectsHero />
        <ProjectOverview project={project} />
        <ProjectEditorialGallery project={project} />
        <ProjectProcess project={project} />
        <BeforeAfterGallery project={project} />
        <RelatedProjects />
      </main>
      <ContactForm
        showTopNotch
        title="BẠN YÊU THÍCH KHÔNG GIAN NÀY?"
        description={
          <>
            Liên hệ ngay <strong>BMT Decor</strong> hoặc để lại thông tin để được
            đội ngũ tư vấn giải pháp <strong>thiết kế - thi công</strong> phù hợp
            nhất cho ngôi nhà của bạn.
          </>
        }
      />
      <SiteFooter />
    </>
  );
}
