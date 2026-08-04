"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { BriefcaseBusiness, ChevronDown, Clock3, MapPin, WalletCards } from "lucide-react";
import { careerJobs, type CareerJob } from "@/features/careers/data/jobs";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import styles from "./CareerOpenings.module.css";

const pageSize = 3;

function Metadata({ job }: { job: CareerJob }) {
  const items = [
    [BriefcaseBusiness, job.department],
    [MapPin, job.location],
    [Clock3, job.schedule],
    [WalletCards, job.compensation],
  ] as const;

  return (
    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-neutral-600 sm:text-[15px]">
      {items.map(([Icon, label]) => (
        <li className="flex items-center gap-1.5" key={label}>
          <Icon className="size-[18px] shrink-0 text-brand" strokeWidth={1.8} aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}

function JobDivider({ delay }: { delay: number }) {
  const dividerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = dividerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={dividerRef} className="relative mt-5 aspect-[5010/123] w-full overflow-hidden" aria-hidden="true">
      <Image
        className={`object-contain transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${visible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`}
        style={{ transformOrigin: "left center", transitionDelay: `${delay}ms` }}
        src="/images/careers/job-divider.jpg"
        alt=""
        fill
        sizes="(min-width: 1200px) 1180px, calc(100vw - 36px)"
      />
    </div>
  );
}

function JobRow({ job, open, onToggle, delay, showDivider }: { job: CareerJob; open: boolean; onToggle: () => void; delay: number; showDivider: boolean }) {
  return (
    <Reveal delay={delay}>
      <article className="group py-5 first:pt-0">
        <div className="grid gap-5 md:grid-cols-[34%_1fr] lg:gap-7">
          <div className="relative aspect-[1.38/1] overflow-hidden rounded-[18px] bg-neutral-100">
            <Image
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
              src={job.image}
              alt={`Vị trí ${job.title} tại BMT Decor`}
              fill
              sizes="(min-width: 1200px) 400px, (min-width: 768px) 34vw, calc(100vw - 36px)"
            />
          </div>

          <div className="flex min-w-0 flex-col pt-0.5">
            <h3 className="text-[clamp(1.08rem,1.65vw,1.48rem)] leading-tight font-bold uppercase text-charcoal transition-colors duration-300 group-hover:text-brand">
              {job.title}
            </h3>
            <Metadata job={job} />
            <p className="mt-3 max-w-[780px] text-[14px] leading-[1.55] text-neutral-700 sm:text-[15px]">
              {job.summary}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <button
                className="inline-flex items-center gap-0.5 border-b border-charcoal text-[14px] leading-5 text-charcoal transition-[border-color,color] duration-300 hover:border-brand hover:text-brand"
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={`career-details-${job.id}`}
              >
                Xem chi tiết
                <ChevronDown className={`size-3.5 transition-transform duration-300 ${open ? "rotate-0" : "-rotate-90"}`} aria-hidden="true" />
              </button>
              <a
                className={`${styles.careerApplyButton} inline-flex h-9 min-w-40 items-center justify-center rounded-full px-7 text-[12px] font-bold uppercase text-white`}
                href="#contact-form"
              >
                Ứng tuyển
              </a>
            </div>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              id={`career-details-${job.id}`}
            >
              <div className="overflow-hidden">
                <div className={`pt-4 text-[13px] leading-[1.55] text-neutral-700 transition-[opacity,transform] duration-500 ease-out sm:text-[14px] ${open ? "translate-y-0 opacity-100 delay-100" : "translate-y-3 opacity-0 delay-0"}`}>
                  <h4 className="font-medium text-charcoal">Mô tả công việc:</h4>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5">
                    {job.responsibilities.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <h4 className="mt-3 font-medium text-charcoal">Quyền lợi:</h4>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5">
                    {job.benefits.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showDivider ? <JobDivider delay={delay + 120} /> : null}
      </article>
    </Reveal>
  );
}

export function CareerOpenings() {
  const [page, setPage] = useState(0);
  const [openJob, setOpenJob] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const pageCount = Math.ceil(careerJobs.length / pageSize);
  const visibleJobs = useMemo(() => careerJobs.slice(page * pageSize, page * pageSize + pageSize), [page]);

  function changePage(nextPage: number) {
    if (nextPage < 0 || nextPage >= pageCount || nextPage === page || leaving) return;
    setLeaving(true);
    setOpenJob(null);
    window.setTimeout(() => {
      setPage(nextPage);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setLeaving(false));
      });
    }, 360);
  }

  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28" aria-labelledby="career-openings-title">
      <div className="mx-auto w-[min(1180px,calc(100%-2.25rem))]">
        <Reveal>
          <div className="mx-auto flex max-w-[1100px] flex-col items-center text-center">
            <h2 id="career-openings-title" className="text-[clamp(2rem,3vw,3rem)] leading-[.98] font-bold uppercase tracking-[-.035em] text-charcoal lg:whitespace-nowrap">
              Khám phá các vị trí đang tuyển dụng
            </h2>
            <BuildingRule className="mt-5 h-8 max-w-[430px]" delay={260} />
          </div>
        </Reveal>

        <div className={`mt-12 will-change-[opacity,transform] transition-[opacity,transform] duration-[360ms] ease-out ${leaving ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`} aria-live="polite" aria-busy={leaving}>
          {visibleJobs.map((job, index) => (
            <JobRow
              job={job}
              open={openJob === job.id}
              onToggle={() => setOpenJob((current) => current === job.id ? null : job.id)}
              delay={index * 160}
              showDivider={index < visibleJobs.length - 1}
              key={`${page}-${job.id}`}
            />
          ))}
        </div>

        <nav className={styles.careerPagination} aria-label="Phân trang tuyển dụng">
          <button className={styles.careerPageButton} type="button" onClick={() => changePage(page - 1)} disabled={page === 0 || leaving}>
            <Image className={styles.careerPageButtonIcon} src="/images/careers/page-previous.jpg" alt="" width={104} height={104} aria-hidden="true" />
            <span className="hidden sm:inline">Previous Page</span>
            <span className="sm:hidden">Trước</span>
          </button>
          <span className={styles.careerPageIndicator}>Page {page + 1}/{pageCount}</span>
          <button className={`${styles.careerPageButton} ${styles.careerPageButtonNext}`} type="button" onClick={() => changePage(page + 1)} disabled={page === pageCount - 1 || leaving}>
            <span className="hidden sm:inline">Next Page</span>
            <span className="sm:hidden">Sau</span>
            <Image className={styles.careerPageButtonIcon} src="/images/careers/page-next.jpg" alt="" width={104} height={104} aria-hidden="true" />
          </button>
        </nav>
      </div>
    </section>
  );
}
