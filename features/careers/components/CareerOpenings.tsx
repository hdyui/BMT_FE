"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  Clock3,
  MapPin,
  WalletCards,
} from "lucide-react";
import { careerJobs, type CareerJob } from "@/features/careers/data/jobs";
import { BuildingRule } from "@/shared/components/BuildingRule";
import { ListDivider } from "@/shared/components/ListDivider";
import { Reveal } from "@/shared/components/Reveal";
import styles from "./CareerOpenings.module.css";

const pageSize = 3;

function Metadata({ job }: { job: CareerJob }) {
  const items = [
    { Icon: BriefcaseBusiness, iconSrc: "/images/careers/mobile/metadata-briefcase.png", iconWidth: 101, iconHeight: 91, label: job.department },
    { Icon: MapPin, iconSrc: "/images/careers/mobile/metadata-location.png", iconWidth: 64, iconHeight: 89, label: job.location },
    { Icon: Clock3, iconSrc: "/images/careers/mobile/metadata-time.png", iconWidth: 90, iconHeight: 90, label: job.schedule },
    { Icon: WalletCards, iconSrc: "/images/careers/mobile/metadata-compensation.png", iconWidth: 97, iconHeight: 90, label: job.compensation },
  ] as const;

  return (
    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-base text-neutral-600 sm:text-lg lg:text-xl max-sm:mt-2 max-sm:gap-x-4 max-sm:gap-y-1 max-sm:text-[11px] max-sm:leading-[1.25]">
      {items.map(({ Icon, iconHeight, iconSrc, iconWidth, label }) => (
        <li className="flex items-center gap-1.5 max-sm:gap-1" key={label}>
          <Icon
            className="size-[18px] shrink-0 text-brand max-sm:hidden"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <Image className="hidden h-[11px] w-auto shrink-0 object-contain max-sm:block" src={iconSrc} alt="" width={iconWidth} height={iconHeight} sizes="12px" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}

function JobRow({
  job,
  open,
  onToggle,
  delay,
  showDivider,
}: {
  job: CareerJob;
  open: boolean;
  onToggle: () => void;
  delay: number;
  showDivider: boolean;
}) {
  return (
    <Reveal delay={delay}>
      <article className="group py-5 first:pt-0 max-sm:py-3.5">
        <div className="grid gap-5 md:grid-cols-[34%_1fr] lg:gap-7 max-sm:gap-2.5">
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
            <h3 className="text-[clamp(1.08rem,1.65vw,1.48rem)] leading-tight font-bold uppercase text-charcoal transition-colors duration-300 group-hover:text-brand max-sm:text-[clamp(19px,5vw,20px)] max-sm:leading-[1.08]">
              {job.title}
            </h3>
            <Metadata job={job} />
            <p className="mt-3 max-w-[780px] text-base leading-[1.55] text-neutral-700 sm:text-lg lg:text-xl max-sm:mt-2 max-sm:text-[13px] max-sm:leading-[1.35]">
              {job.summary}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 max-sm:mt-3 max-sm:gap-2">
              <button
                className="group/detail inline-flex items-center gap-0.5 border-b border-charcoal text-[17px] leading-5 text-charcoal transition-[border-color,color] duration-300 hover:border-brand hover:text-brand max-sm:border-b-0 max-sm:text-[13px] max-sm:leading-4"
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={`career-details-${job.id}`}
              >
                <span className="max-sm:border-b max-sm:border-charcoal max-sm:transition-colors max-sm:group-hover/detail:border-brand">Xem chi tiết</span>
                <ChevronDown
                  className={`size-3.5 transition-transform duration-300 max-sm:hidden ${open ? "rotate-0" : "-rotate-90"}`}
                  aria-hidden="true"
                />
                <span className="relative hidden size-[9px] shrink-0 max-sm:inline-block"><Image className="object-contain" src={open ? "/images/careers/mobile/detail-arrow-down.png" : "/images/careers/mobile/detail-arrow-right.png"} alt="" fill sizes="9px" aria-hidden="true" /></span>
              </button>
              <a
                className={`${styles.careerApplyButton} relative inline-flex h-9 min-w-40 items-center justify-center overflow-hidden rounded-full px-7 text-[12px] font-bold uppercase text-white max-sm:aspect-[854/201] max-sm:h-auto max-sm:w-[22vw] max-sm:min-w-0 max-sm:rounded-none max-sm:px-0 max-sm:text-[11px] max-sm:leading-none`}
                href="#contact-form"
              >
                <Image className="absolute inset-0 hidden size-full object-contain max-sm:block" src="/images/careers/mobile/apply-cta.png" alt="" width={854} height={201} sizes="22vw" aria-hidden="true" />
                <span className="relative z-10 max-sm:pb-px">Ứng tuyển</span>
              </a>
            </div>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              id={`career-details-${job.id}`}
            >
              <div className="overflow-hidden">
                <div
                  className={`pt-4 text-base leading-[1.55] text-neutral-700 transition-[opacity,transform] duration-500 ease-out sm:text-lg lg:text-xl max-sm:pt-3 max-sm:text-[13px] max-sm:leading-[1.35] ${open ? "translate-y-0 opacity-100 delay-100" : "translate-y-3 opacity-0 delay-0"}`}
                >
                  <ul className="list-disc space-y-0.5 pl-5">
                    {job.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <h4 className="mt-3 font-medium text-charcoal max-sm:font-normal">Quyền lợi:</h4>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5">
                    {job.benefits.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showDivider ? <ListDivider delay={delay + 120} /> : null}
      </article>
    </Reveal>
  );
}

export function CareerOpenings() {
  const [isMobile, setIsMobile] = useState(true);
  const [page, setPage] = useState(0);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [openJob, setOpenJob] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const pageCount = Math.ceil(careerJobs.length / pageSize);
  const visibleJobs = useMemo(
    () =>
      isMobile
        ? careerJobs.slice(0, visibleCount)
        : careerJobs.slice(page * pageSize, page * pageSize + pageSize),
    [isMobile, page, visibleCount],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const syncViewport = () => setIsMobile(mediaQuery.matches);
    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  function changePage(nextPage: number) {
    if (nextPage < 0 || nextPage >= pageCount || nextPage === page || leaving)
      return;
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
    <section
      className="bg-white py-20 sm:py-24 lg:py-28 max-sm:pt-8 max-sm:pb-12"
      aria-labelledby="career-openings-title"
    >
      <div className="mx-auto w-[min(1180px,calc(100%-2.25rem))]">
        <Reveal>
          <div className="mx-auto flex max-w-[1100px] flex-col items-center text-center">
            <h2
              id="career-openings-title"
              className="text-[clamp(2.25rem,3.5vw,3.3rem)] leading-[.96] font-extrabold uppercase tracking-[-.045em] text-charcoal lg:whitespace-nowrap max-sm:text-[clamp(26px,7.18vw,30px)] max-sm:leading-[1.02] max-sm:tracking-[-.035em] max-sm:text-balance"
            >
              Khám phá các vị trí đang tuyển dụng
            </h2>
            <BuildingRule className="mt-5 h-8 max-w-[430px] max-sm:mt-3 max-sm:h-auto max-sm:aspect-[1388/128] max-sm:w-[36vw] max-sm:max-w-none" delay={260} />
          </div>
        </Reveal>

        <div
          className={`mt-12 will-change-[opacity,transform] transition-[opacity,transform] duration-[360ms] ease-out max-sm:mt-3 ${leaving ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`}
          aria-live="polite"
          aria-busy={leaving}
        >
          {visibleJobs.map((job, index) => (
            <JobRow
              job={job}
              open={openJob === job.id}
              onToggle={() =>
                setOpenJob((current) => (current === job.id ? null : job.id))
              }
              delay={index * 160}
              showDivider={index < visibleJobs.length - 1}
              key={`${page}-${job.id}`}
            />
          ))}
        </div>

        {visibleCount < careerJobs.length ? (
          <button
            className={styles.mobileLoadMore}
            type="button"
            onClick={() => setVisibleCount((current) => Math.min(current + pageSize, careerJobs.length))}
            aria-label="Hiển thị thêm vị trí tuyển dụng"
          >
            <span>Xem thêm</span>
            <Image className={styles.mobileLoadMoreIcon} src="/images/careers/mobile/load-more.png" alt="" width={237} height={237} sizes="28px" aria-hidden="true" />
          </button>
        ) : null}

        {!isMobile ? (
          <nav className={styles.careerPagination} aria-label="Phân trang tuyển dụng">
            <button className={styles.careerPageButton} type="button" onClick={() => changePage(page - 1)} disabled={page === 0 || leaving}>
              <Image className={styles.careerPageButtonIcon} src="/images/careers/page-previous.jpg" alt="" width={104} height={104} aria-hidden="true" />
              <span>PREVIOUS PAGE</span>
            </button>
            <span className={styles.careerPageIndicator}>Page {page + 1}/{pageCount}</span>
            <button className={`${styles.careerPageButton} ${styles.careerPageButtonNext}`} type="button" onClick={() => changePage(page + 1)} disabled={page === pageCount - 1 || leaving}>
              <span>NEXT PAGE</span>
              <Image className={styles.careerPageButtonIcon} src="/images/careers/page-next.jpg" alt="" width={104} height={104} aria-hidden="true" />
            </button>
          </nav>
        ) : null}
      </div>
    </section>
  );
}
