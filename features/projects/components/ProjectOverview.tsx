import Image from "next/image";
import type { ProjectDetail } from "../data/project-details";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ProjectSectionHeading } from "./ProjectSectionHeading";
import { ProjectRichText } from "./ProjectRichText";
import styles from "./ProjectDetail.module.css";

const overviewLabels: Array<[keyof ProjectDetail, string]> = [
  ["category", "Danh mục"],
  ["location", "Khu vực"],
  ["client", "Chủ đầu tư"],
  ["area", "Diện tích"],
  ["scale", "Quy mô"],
];

export function ProjectOverview({ project }: { project: ProjectDetail }) {
  return (
    <>
      <section className="bg-white pt-[clamp(56px,7vw,120px)]" aria-labelledby="project-overview-title">
        <div className="mx-auto w-[min(1280px,calc(100%-2.25rem))]">
          <div className="grid overflow-hidden rounded-[2.5rem] bg-[#f1f1f1] lg:grid-cols-[1fr_.96fr] lg:rounded-[4rem]">
            <Reveal
              className={`min-h-[310px] lg:min-h-[530px] ${styles.imageReveal}`}
              from="left"
              delay={180}
              duration={950}
            >
              <div className={`h-full min-h-[310px] lg:min-h-[530px] ${styles.media}`}>
                <Image
                  src={project.heroImage.src}
                  alt={project.heroImage.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <div className="flex flex-col justify-center px-6 py-9 sm:px-10 lg:px-12 lg:py-11">
              <Reveal delay={250} duration={900}>
                <Image
                  src="/images/projects/detail/moc-mien-wordmark.png"
                  alt={project.displayName}
                  width={2075}
                  height={491}
                  className="mb-7 h-auto w-full max-w-[520px]"
                />
                <h2
                  className="flex items-center gap-3 text-[clamp(23px,2vw,36px)] leading-tight font-bold tracking-[-0.045em] uppercase"
                  id="project-overview-title"
                >
                  {project.title}
                  <Image
                    src="/images/projects/detail/short-divider.png"
                    alt=""
                    width={470}
                    height={59}
                    className="h-auto min-w-8 flex-1 object-fill"
                    aria-hidden="true"
                  />
                </h2>
              </Reveal>
              <Reveal from="left" delay={440} duration={850}>
                <dl className="mt-5 grid gap-1.5 text-[clamp(15px,1.2vw,19px)] leading-[1.35]">
                  <div className="grid grid-cols-[112px_1fr] gap-2">
                    <dt className="font-bold">Tên dự án:</dt>
                    <dd>{project.projectName}</dd>
                  </div>
                  {overviewLabels.map(([key, label]) => (
                    <div className="grid grid-cols-[112px_1fr] gap-2" key={key}>
                      <dt className="font-bold">{label}:</dt>
                      <dd>{String(project[key])}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
              <Reveal from="left" delay={620} duration={850}>
                <Image
                  src="/images/projects/detail/long-divider.png"
                  alt=""
                  width={2063}
                  height={79}
                  className="my-3 h-auto w-full object-fill"
                  aria-hidden="true"
                />
                <div className="grid gap-3 text-[clamp(15px,1.15vw,18px)] leading-[1.45] tracking-[-0.015em]">
                  {project.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-[clamp(64px,8vw,130px)]" aria-labelledby="survey-title">
        <div className="mx-auto w-[min(1280px,calc(100%-2.25rem))]">
          <ProjectSectionHeading className="mb-7" delay={180} duration={900}>
            <span id="survey-title">Khảo sát hiện trạng và lên phương án</span>
          </ProjectSectionHeading>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {project.survey.map((image, index) => (
              <Reveal
                className={styles.imageReveal}
                delay={420 + index * 140}
                duration={950}
                from="fade"
                key={image.src}
              >
                <div className={`aspect-[1.11/1] rounded-[1.8rem] sm:rounded-[2.3rem] ${styles.media}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={900} duration={850} from="left">
            <p className="mt-6 text-[clamp(15px,1.2vw,19px)] leading-[1.48] tracking-[-0.02em]">
              <ProjectRichText
                text={project.surveyDescription}
                emphasis={["BMT Decor"]}
              />
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
