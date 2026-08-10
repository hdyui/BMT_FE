import Image from "next/image";
import type { ProjectDetail } from "../data/project-details";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ProjectSectionHeading } from "./ProjectSectionHeading";
import { ProjectRichText } from "./ProjectRichText";
import styles from "./ProjectDetail.module.css";

export function ProjectProcess({ project }: { project: ProjectDetail }) {
  return (
    <section className="bg-white pb-[clamp(68px,8vw,125px)]" aria-labelledby="process-title">
      <div className="mx-auto w-[min(1280px,calc(100%-2.25rem))]">
        <ProjectSectionHeading className="mb-8" delay={180} duration={900}>
          <span id="process-title">Quá trình và năng lực thi công:</span>
        </ProjectSectionHeading>
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 lg:grid-cols-4">
          {project.process.map((item, index) => (
            <Reveal className={styles.imageReveal} delay={420 + index * 140} duration={950} from="fade" key={item.src}>
              <article>
                <div className={`aspect-[.75/1] rounded-[1.5rem] sm:rounded-[2rem] ${styles.media}`}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-3 text-center text-[clamp(14px,1.3vw,19px)] leading-tight font-bold tracking-[-0.03em]">
                  {item.label}
                </h3>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={1050} duration={850} from="left">
          <p className="mt-7 text-[clamp(15px,1.2vw,19px)] leading-[1.5] tracking-[-0.02em]">
            <ProjectRichText text={project.processDescription} />
          </p>
        </Reveal>
      </div>
    </section>
  );
}
