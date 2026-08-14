import Image from "next/image";
import type { ProjectDetail, ProjectImage } from "../data/project-details";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ProjectSectionHeading } from "./ProjectSectionHeading";
import { ProjectRichText } from "./ProjectRichText";
import styles from "./ProjectDetail.module.css";

function RenderFrame({
  image,
  sizes,
}: {
  image: ProjectImage;
  sizes: string;
}) {
  return (
    <div
      className={`rounded-[1.5rem] sm:rounded-[2.2rem] ${styles.media} ${styles.renderFrame}`}
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

export function ProjectEditorialGallery({ project }: { project: ProjectDetail }) {
  const leadRender = project.renders[0];
  const stackedRenders = project.renders.slice(1, 3);
  const secondaryRenders = project.renders.slice(3);

  return (
    <>
      <section className="bg-white pb-[clamp(68px,8vw,125px)]" aria-labelledby="solution-title">
        <div className="mx-auto w-[min(1280px,calc(100%-2.25rem))]">
          <ProjectSectionHeading className="mb-2" delay={180} duration={900}>
            <span id="solution-title">Phương án:</span>
          </ProjectSectionHeading>
          <Reveal delay={380} duration={850}>
            <p className="text-lg font-bold">Từ bản vẽ:</p>
          </Reveal>
          <Reveal className={`mx-auto mt-5 w-[min(920px,100%)] ${styles.imageReveal}`} delay={520} duration={950} from="fade">
            <Image
              src={project.drawing.src}
              alt={project.drawing.alt}
              width={project.drawing.width}
              height={project.drawing.height}
              sizes="(min-width: 1024px) 920px, 100vw"
              className="h-auto w-full object-contain"
            />
          </Reveal>
          <Reveal delay={760} duration={850} from="left">
            <h3 className="mt-4 text-center text-[clamp(17px,1.5vw,22px)] font-bold uppercase">
              {project.drawingCaption}
            </h3>
            <p className="mx-auto mt-4 max-w-[1180px] text-[clamp(15px,1.2vw,19px)] leading-[1.5] tracking-[-0.02em]">
              <ProjectRichText
                text={project.solutionDescription}
                emphasis={["Wabi Sabi"]}
              />
            </p>
          </Reveal>

          <ProjectSectionHeading className="mt-[clamp(58px,7vw,105px)] mb-7" delay={180} duration={900}>
            Hình ảnh 3D:
          </ProjectSectionHeading>
          <div className={styles.renderLeadGrid}>
            <Reveal className={styles.imageReveal} delay={420} duration={950} from="fade">
              <RenderFrame
                image={leadRender}
                sizes="(min-width: 1024px) 49vw, (min-width: 640px) 50vw, 100vw"
              />
            </Reveal>

            <div className={styles.renderStack}>
              {stackedRenders.map((image, index) => (
                <Reveal
                  className={styles.imageReveal}
                  delay={560 + index * 140}
                  duration={950}
                  from="fade"
                  key={image.src}
                >
                  <RenderFrame
                    image={image}
                    sizes="(min-width: 1024px) 47vw, (min-width: 640px) 50vw, 100vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>

          <div className={styles.renderSecondaryGrid}>
            {secondaryRenders.map((image, index) => (
              <Reveal className={styles.imageReveal} delay={840 + index * 140} duration={950} from="fade" key={image.src}>
                <RenderFrame
                  image={image}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </Reveal>
            ))}
          </div>
          <Reveal delay={1120} duration={850} from="left">
            <p className="mt-6 text-[clamp(15px,1.2vw,19px)] leading-[1.5] tracking-[-0.02em]">
              <ProjectRichText
                text={project.galleryDescription}
                emphasis={[project.style]}
              />
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
