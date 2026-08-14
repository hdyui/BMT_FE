import Image from "next/image";
import type { ProjectDetail } from "../data/project-details";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ProjectSectionHeading } from "./ProjectSectionHeading";
import { ProjectRichText } from "./ProjectRichText";
import styles from "./ProjectDetail.module.css";

export function BeforeAfterGallery({ project }: { project: ProjectDetail }) {
  return (
    <section className="bg-white pb-[clamp(68px,8vw,120px)]" aria-labelledby="result-title">
      <div className="mx-auto w-[min(1280px,calc(100%-2.25rem))]">
        <ProjectSectionHeading delay={180} duration={900}>
          <span id="result-title">Thành quả bàn giao căn nhà:</span>
        </ProjectSectionHeading>
        <Reveal delay={380} duration={850}>
          <p className="mt-1 text-lg font-bold">Trước và sau thi công:</p>
        </Reveal>

        <div className="mt-8 grid gap-[clamp(28px,4vw,58px)]">
          {project.comparisons.map((comparison, rowIndex) => (
            <div
              className={`${styles.comparisonGrid} ${
                [
                  styles.comparisonRowFacade,
                  styles.comparisonRowStair,
                  styles.comparisonRowLiving,
                ][rowIndex]
              }`}
              key={comparison.before.src}
            >
                {[comparison.before, comparison.after].map((image, imageIndex) => (
                  <Reveal
                    className={`min-w-0 ${styles.imageReveal}`}
                    delay={520 + imageIndex * 140}
                    duration={950}
                    from="fade"
                    key={image.src}
                  >
                  <figure>
                    <div className={`${styles.comparisonMedia} ${styles.media}`}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className={styles.comparisonImage}
                      />
                      {image.badge && (
                        <span className={`absolute top-3 z-10 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white sm:top-4 sm:px-5 sm:text-base ${imageIndex === 0 ? "left-3 sm:left-4" : "right-3 sm:right-4"}`}>
                          {image.badge}
                        </span>
                      )}
                    </div>
                    <figcaption className="mt-2 text-center text-[clamp(15px,1.25vw,18px)] font-bold">
                      {image.label}
                    </figcaption>
                  </figure>
                  </Reveal>
                ))}
                <span
                  className="pointer-events-none absolute top-1/2 left-1/2 z-20 hidden size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl shadow-md sm:grid"
                  aria-hidden="true"
                >
                  ↔
                </span>
            </div>
          ))}
        </div>

        <div className="mt-[clamp(54px,6vw,90px)]">
          <Reveal delay={180} duration={900}>
            <h2 className="text-[clamp(28px,3vw,46px)] leading-[1.05] font-bold tracking-[-0.04em] text-brand uppercase text-balance">
              Bạn yêu thích không gian này?
            </h2>
          </Reveal>
          <Reveal delay={400} duration={850} from="left">
            <p className="mt-3 max-w-[1180px] text-[clamp(15px,1.2vw,19px)] leading-[1.5]">
              <ProjectRichText
                text={project.ctaDescription}
                emphasis={["BMT Decor", "thiết kế – thi công"]}
              />
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
