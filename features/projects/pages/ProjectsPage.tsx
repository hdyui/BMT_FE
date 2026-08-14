"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useInView,
  type Variants,
} from "motion/react";
import { useMemo, useRef, useState } from "react";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ProjectsHero } from "@/features/projects/components/ProjectsHero";

type Category =
  | "Nhà ở"
  | "Văn phòng"
  | "Thẩm mỹ viện, showroom"
  | "Nhà hàng, khách sạn";

type ProjectCardData = {
  title: string;
};

const TEMP_PROJECT_DETAIL_SLUG = "nha-pho-2-tang-quan-9";

const card = (title: string): ProjectCardData => ({
  title,
});

const categories: {
  label: Category;
  icon: string;
  activeIcon: string;
  iconClassName: string;
  mobileIcon: string;
  mobileActiveIcon: string;
  mobileIconClassName: string;
  mobileIconWidth: number;
  mobileIconHeight: number;
}[] = [
  {
    label: "Nhà ở",
    icon: "/images/projects/category-house-active.png",
    activeIcon: "/images/projects/category-house-active.png",
    iconClassName: "w-[44px]",
    mobileIcon: "/images/projects/mobile/category-house.png",
    mobileActiveIcon: "/images/projects/mobile/category-house-active.png",
    mobileIconClassName: "w-[32px]",
    mobileIconWidth: 257,
    mobileIconHeight: 199,
  },
  {
    label: "Văn phòng",
    icon: "/images/projects/category-office.png",
    activeIcon: "/images/projects/category-office-active.png",
    iconClassName: "w-[39px]",
    mobileIcon: "/images/projects/mobile/category-office.png",
    mobileActiveIcon: "/images/projects/mobile/category-office-active.png",
    mobileIconClassName: "w-[27px]",
    mobileIconWidth: 188,
    mobileIconHeight: 223,
  },
  {
    label: "Thẩm mỹ viện, showroom",
    icon: "/images/projects/category-showroom.png",
    activeIcon: "/images/projects/category-showroom-active.png",
    iconClassName: "w-[48px]",
    mobileIcon: "/images/projects/mobile/category-showroom.png",
    mobileActiveIcon: "/images/projects/mobile/category-showroom-active.png",
    mobileIconClassName: "w-[35px]",
    mobileIconWidth: 308,
    mobileIconHeight: 199,
  },
  {
    label: "Nhà hàng, khách sạn",
    icon: "/images/projects/category-hospitality.png",
    activeIcon: "/images/projects/category-hospitality-active.png",
    iconClassName: "w-[43px]",
    mobileIcon: "/images/projects/mobile/category-hospitality.png",
    mobileActiveIcon: "/images/projects/mobile/category-hospitality-active.png",
    mobileIconClassName: "w-[31px]",
    mobileIconWidth: 225,
    mobileIconHeight: 235,
  },
];

const projectImages = [
  "/images/projects/project-01.png",
  "/images/projects/project-02.png",
  "/images/projects/project-03.png",
  "/images/projects/project-04.png",
  "/images/projects/project-05.png",
  "/images/projects/project-06.png",
  "/images/projects/project-07.png",
  "/images/projects/project-08.png",
  "/images/projects/project-09.png",
];

const projectCards: Record<Category, ProjectCardData[]> = {
  "Nhà ở": [
    card("Nhà Phú Nhuận"),
    card("Nhà Bình Thạnh"),
    card("Căn hộ 2 PN cao cấp"),
    card("Chung cư La Astoria Q.2"),
    card("Căn hộ The Opera Residence"),
    card("Nhà phố 2 tầng Quận 9"),
    card("Nhà phố Bình Chánh"),
    card("Căn hộ chung cư Q9"),
    card("Căn hộ chung cư Q7"),
    card("Nhà phố Thủ Đức"),
    card("Biệt thự sân vườn Đồng Nai"),
    card("Căn hộ Midtown Phú Mỹ Hưng"),
  ],
  "Văn phòng": [
    card("Văn phòng BMT Decor"),
    card("Văn phòng quận Bình Thạnh"),
    card("Không gian làm việc Tân Bình"),
    card("Văn phòng điều hành Quận 3"),
    card("Studio sáng tạo Phú Nhuận"),
    card("Văn phòng công nghệ Thủ Đức"),
    card("Trụ sở doanh nghiệp Quận 7"),
    card("Văn phòng giao dịch Quận 1"),
    card("Không gian co-working Gò Vấp"),
  ],
  "Thẩm mỹ viện, showroom": [
    card("Showroom nội thất BMT"),
    card("Thẩm mỹ viện Quận 3"),
    card("Showroom vật liệu Thủ Đức"),
    card("Spa chăm sóc da Phú Nhuận"),
    card("Showroom thời trang Quận 1"),
    card("Trung tâm làm đẹp Tân Bình"),
    card("Showroom thiết bị Quận 7"),
    card("Salon cao cấp Bình Thạnh"),
    card("Không gian trưng bày Gò Vấp"),
  ],
  "Nhà hàng, khách sạn": [
    card("Nhà hàng sân vườn Thủ Đức"),
    card("Khách sạn boutique Quận 1"),
    card("Nhà hàng gia đình Tân Bình"),
    card("Café & Restaurant Quận 3"),
    card("Khách sạn nghỉ dưỡng Đồng Nai"),
    card("Nhà hàng Nhật Bình Thạnh"),
    card("Sảnh tiệc Quận 7"),
    card("Café sân thượng Phú Nhuận"),
    card("Nhà hàng Á Đông Gò Vấp"),
  ],
};

const pageCount = 4;

const projectGridVariants: Variants = {
  hidden: { opacity: 0, y: 38 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
      delayChildren: 0.08,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -28,
    transition: {
      duration: 0.32,
      ease: "easeInOut",
      staggerChildren: 0.018,
      staggerDirection: -1,
    },
  },
};

const projectCardVariants: Variants = {
  hidden: { opacity: 0, y: 42, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -18,
    scale: 0.97,
    transition: { duration: 0.24, ease: "easeInOut" },
  },
};

function ProjectCard({
  project,
  index,
  hiddenOnMobile = false,
}: {
  project: ProjectCardData & { image: string };
  index: number;
  hiddenOnMobile?: boolean;
}) {
  const cardContent = (
    <motion.article
      className="absolute inset-0 overflow-hidden rounded-[28px] bg-neutral-100 max-sm:rounded-[31px]"
      variants={projectCardVariants}
      whileHover={{
        boxShadow: "0 14px 30px rgba(38, 38, 38, 0.16)",
        transition: {
          type: "spring",
          stiffness: 260,
          damping: 24,
        },
      }}
      whileTap={{ scale: 0.992 }}
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.055]">
        <Image
          src={project.image}
          alt={`Dự án ${project.title} do BMT Decor thiết kế và thi công`}
          fill
          priority={index < 3}
          sizes="(min-width: 1024px) 381px, (min-width: 640px) 48vw, 100vw"
          className="object-cover"
        />
      </div>
      <div
        className="absolute inset-0 bg-white/0 transition-colors duration-500 group-hover:bg-white/38"
        aria-hidden="true"
      />
      <span
        className="absolute top-[43%] left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 scale-90 place-items-center text-charcoal opacity-0 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] transition-[opacity,transform] duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
        aria-hidden="true"
      >
        <Search className="size-10 stroke-[1.8]" />
      </span>
      <div className="absolute inset-x-0 bottom-0 grid min-h-[76px] content-center bg-white/86 px-2 py-[10px] text-center text-charcoal transition-[min-height,background-color,color] duration-300 ease-out group-hover:min-h-[92px] group-hover:bg-brand group-hover:text-white max-sm:h-[62px] max-sm:min-h-0 max-sm:bg-transparent max-sm:p-0 max-sm:group-hover:min-h-0 max-sm:group-hover:bg-transparent max-sm:group-hover:text-charcoal">
        <Image
          src="/images/projects/mobile/card-strip-white.png"
          alt=""
          width={3600}
          height={632}
          sizes="(max-width: 639px) min(500px, calc(100vw - 20px)), 1px"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden h-auto w-full max-sm:block"
          aria-hidden="true"
        />
        <div className="relative z-10 grid h-full content-center">
          <p className="text-[15px] leading-none font-normal uppercase tracking-[-0.03em] max-sm:text-[13px] max-sm:tracking-[-0.025em]">
            Thiết kế thi công nội thất
          </p>
          <h3 className="mt-[7px] text-[clamp(14px,1.5vw,21px)] leading-none font-bold text-balance uppercase tracking-[-0.04em] max-sm:mt-[5px] max-sm:px-2 max-sm:text-[20px] max-sm:font-extrabold max-sm:tracking-[-0.045em]">
            {project.title}
          </h3>
        </div>
      </div>
    </motion.article>
  );

  const wrapperClassName = `group relative aspect-[1.04/1] rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand max-sm:aspect-[1.28/1] max-sm:rounded-[24px] ${hiddenOnMobile ? "max-sm:hidden" : ""}`;
  return (
    <Link
      href={`/du-an/${TEMP_PROJECT_DETAIL_SLUG}`}
      className={wrapperClassName}
      aria-label={`Xem chi tiết dự án ${project.title}`}
    >
      {cardContent}
    </Link>
  );
}

export function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Nhà ở");
  const [activePage, setActivePage] = useState(0);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const projectGridRef = useRef<HTMLDivElement>(null);
  const projectGridEntered = useInView(projectGridRef, {
    once: true,
    amount: 0.08,
  });
  const visibleProjects = useMemo(
    () =>
      projectImages.map((image, index) => {
        const cards = projectCards[activeCategory];
        const project = cards[(index + activePage * 3) % cards.length];
        return {
          image: projectImages[(index + activePage * 2) % projectImages.length],
          ...project,
        };
      }),
    [activeCategory, activePage],
  );

  function selectCategory(category: Category) {
    setActiveCategory(category);
    setActivePage(0);
    setMobileExpanded(false);
  }

  return (
    <>
      <SiteHeader />
      <main
        className="relative overflow-hidden bg-[#f2f2f4] pt-0 sm:pt-[60px] max-sm:overflow-visible xl:pt-[68px]"
        data-scroll-snap-page
      >
        <ProjectsHero />

        <section
          className="relative bg-white pt-[62px] pb-[108px] max-sm:pt-[24px] max-sm:pb-[60px]"
          id="du-an"
        >
          <div className="mx-auto w-[min(1202px,calc(100%-2.25rem))] max-sm:w-[calc(100%-1.25rem)] max-sm:max-w-[500px]">
            <header className="mx-auto text-center">
              <Reveal>
                <div className="text-[clamp(34px,2.5vw,48px)] leading-none font-bold tracking-[-0.035em] text-charcoal max-sm:text-[22px] max-sm:font-extrabold max-sm:tracking-[-0.045em]">
                  <h3 className="flex flex-nowrap items-end justify-center gap-x-[0.18em] gap-y-3 whitespace-nowrap">
                    <span className="text-[0.8em] leading-none">DỰ ÁN</span>
                    <Image
                      src="/images/projects/mobile/bmt-decor-wordmark.png"
                      alt=""
                      width={948}
                      height={165}
                      className="mb-[2px] h-auto w-[5.35em] shrink-0 sm:hidden"
                      aria-hidden="true"
                    />
                    <Image
                      src="/images/projects/bmt-decor-wordmark.png"
                      alt=""
                      width={1202}
                      height={209}
                      className="mb-1 hidden h-auto w-[5.05em] shrink-0 sm:block"
                      aria-hidden="true"
                    />
                    <span className="sr-only">BMT Decor</span>
                    <span className="text-[0.8em] leading-none">
                      ĐÃ THI CÔNG
                    </span>
                  </h3>
                </div>
              </Reveal>
              <Reveal delay={180}>
                <p className="mx-auto mt-[22px] max-w-[780px] text-[20px] leading-[1.38] font-normal tracking-[-0.015em] text-charcoal max-sm:mt-[9px] max-sm:max-w-[355px] max-sm:text-[11px] max-sm:leading-[1.25]">
                  Khám phá những công trình do BMT Decor trực tiếp thiết kế và
                  thi công, khẳng định năng lực và chất lượng trong từng hạng
                  mục.
                </p>
              </Reveal>
              <Reveal
                className="mx-auto mt-[18px] w-fit max-sm:mt-[8px]"
                delay={360}
                from="left"
              >
                <Image
                  src="/images/projects/section-rule.png"
                  alt=""
                  width={1388}
                  height={128}
                  className="h-auto w-[335px] max-w-[70vw] max-sm:w-[150px]"
                  aria-hidden="true"
                />
              </Reveal>
            </header>

            <div className="mt-[33px] grid grid-cols-4 gap-x-[6px] sm:gap-x-[74px] max-sm:mt-[17px]">
              {categories.map(
                (
                  {
                    label,
                    icon,
                    activeIcon,
                    iconClassName,
                    mobileIcon,
                    mobileActiveIcon,
                    mobileIconClassName,
                    mobileIconWidth,
                    mobileIconHeight,
                  },
                  categoryIndex,
                ) => {
                  const isActive = activeCategory === label;
                  return (
                    <Reveal delay={120 + categoryIndex * 90} key={label}>
                      <button
                        className="group w-full min-w-0 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                        type="button"
                        onClick={() => selectCategory(label)}
                        aria-pressed={isActive}
                      >
                        <span className="relative mx-auto grid size-[82px] place-items-center max-sm:size-[48px]">
                          <Image
                            src={
                              isActive
                                ? "/images/projects/category-circle-active.png"
                                : "/images/projects/category-circle.png"
                            }
                            alt=""
                            fill
                            sizes="82px"
                            className="hidden object-contain sm:block"
                            aria-hidden="true"
                          />
                          <Image
                            src={
                              isActive
                                ? "/images/projects/mobile/category-circle-active.png"
                                : "/images/projects/mobile/category-circle.png"
                            }
                            alt=""
                            fill
                            sizes="48px"
                            className="object-contain sm:hidden"
                            aria-hidden="true"
                          />
                          <Image
                            src={isActive ? activeIcon : icon}
                            alt=""
                            width={247}
                            height={188}
                            className={`relative z-10 hidden h-auto object-contain sm:block ${iconClassName}`}
                            style={
                              !isActive && label === "Nhà ở"
                                ? {
                                    filter:
                                      "brightness(0) saturate(100%) invert(56%) sepia(93%) saturate(1987%) hue-rotate(345deg) brightness(103%) contrast(91%)",
                                  }
                                : undefined
                            }
                            aria-hidden="true"
                          />
                          <Image
                            src={isActive ? mobileActiveIcon : mobileIcon}
                            alt=""
                            width={mobileIconWidth}
                            height={mobileIconHeight}
                            className={`relative z-10 h-auto object-contain sm:hidden ${mobileIconClassName}`}
                            aria-hidden="true"
                          />
                        </span>
                        <span className="mt-[11px] block min-h-[18px] text-[15px] leading-none font-semibold uppercase tracking-[-0.03em] text-charcoal max-sm:mt-[6px] max-sm:min-h-[25px] max-sm:text-[10px] max-sm:leading-[1.05] max-sm:font-extrabold max-sm:tracking-[-0.025em] max-sm:text-balance">
                          {label}
                        </span>
                        <Image
                          src="/images/projects/mobile/category-underline.png"
                          alt=""
                          width={542}
                          height={8}
                          className="mx-auto mt-[5px] h-[2px] w-[42%] object-fill sm:hidden"
                          aria-hidden="true"
                        />
                        <Image
                          src="/images/projects/category-underline.png"
                          alt=""
                          width={684}
                          height={9}
                          className="mt-[12px] hidden h-[2px] w-full object-fill sm:block"
                          aria-hidden="true"
                        />
                      </button>
                    </Reveal>
                  );
                },
              )}
            </div>

            <MotionConfig reducedMotion="user">
              <div ref={projectGridRef}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    className="mt-[40px] grid gap-x-[29px] gap-y-[28px] sm:grid-cols-2 lg:grid-cols-3"
                    variants={projectGridVariants}
                    initial="hidden"
                    animate={projectGridEntered ? "show" : "hidden"}
                    exit="exit"
                    key={`${activeCategory}-${activePage}`}
                    aria-live="polite"
                  >
                    {visibleProjects.map((project, index) => (
                      <ProjectCard
                        project={project}
                        index={index}
                        hiddenOnMobile={index > 3 && !mobileExpanded}
                        key={`${activePage}-${index}-${project.title}`}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </MotionConfig>

            {!mobileExpanded && (
              <button
                className="mx-auto mt-[24px] hidden items-center gap-2 text-[16px] text-charcoal transition-colors duration-200 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand max-sm:flex"
                type="button"
                onClick={() => setMobileExpanded(true)}
              >
                Xem thêm
                <Image
                  src="/images/projects/mobile/view-more-arrow.png"
                  alt=""
                  width={237}
                  height={237}
                  className="size-[20px]"
                  aria-hidden="true"
                />
              </button>
            )}

            <div
              className="mt-[42px] flex justify-center gap-[10px] max-sm:hidden"
              aria-label="Phân trang dự án"
            >
              {Array.from({ length: pageCount }, (_, page) => (
                <button
                  className={`size-[22px] rounded-full border-[3px] transition-[border-color,background-color,transform] duration-300 hover:scale-110 ${page === activePage ? "border-brand bg-brand shadow-[inset_0_0_0_4px_white]" : "border-charcoal bg-white"}`}
                  type="button"
                  onClick={() => setActivePage(page)}
                  aria-label={`Trang dự án ${page + 1}`}
                  aria-current={page === activePage ? "page" : undefined}
                  key={page}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <ContactForm />
      <SiteFooter showTopBorder={false} />
    </>
  );
}
