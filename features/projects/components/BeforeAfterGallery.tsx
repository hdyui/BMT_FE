import type { ProjectDetail } from "../data/project-details";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ProjectSectionHeading } from "./ProjectSectionHeading";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import styles from "./ProjectDetail.module.css";

export function BeforeAfterGallery({ project }: { project: ProjectDetail }) {
  return (
    <section className="bg-white pb-[clamp(68px,8vw,120px)]" aria-labelledby="result-title">
      <div className="mx-auto w-[min(1280px,calc(100%-2.25rem))]">
        <ProjectSectionHeading delay={80} duration={950}>
          <span id="result-title">Thành quả bàn giao căn nhà:</span>
        </ProjectSectionHeading>
        <Reveal delay={140} distance="long" duration={950}>
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
              <Reveal
                className={`min-w-0 ${styles.imageReveal}`}
                delay={160 + rowIndex * 60}
                distance="long"
                duration={1050}
                from="fade"
              >
                <BeforeAfterSlider comparison={comparison} />
              </Reveal>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
