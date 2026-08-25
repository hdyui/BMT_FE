"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { BmtCta } from "@/lib/components/shared/BmtCta";
import { CardMoreLink } from "@/lib/components/shared/CardMoreLink";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { homeProjectCategories as categories } from "@/features/home/data/home-content";

const cardContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0,
      delayChildren: 0,
    },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const PROJECTS_PER_PAGE = 4;
const FADE_DURATION = 220;

export function ProjectShowcase() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [page, setPage] = useState(0);
  const [mobileProjectIndex, setMobileProjectIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState(0);
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [categoryIndicator, setCategoryIndicator] = useState({
    left: 0,
    top: 0,
    width: 0,
  });
  const categoriesRef = useRef<HTMLDivElement>(null);
  const categoryButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const category = categories[activeCategory];
  const pageCount = Math.ceil(category.projects.length / PROJECTS_PER_PAGE);
  const visibleProjects = category.projects.slice(
    page * PROJECTS_PER_PAGE,
    (page + 1) * PROJECTS_PER_PAGE,
  );
  const mobileProject = category.projects[mobileProjectIndex];

  useEffect(
    () => () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      if (enterTimer.current) clearTimeout(enterTimer.current);
    },
    [],
  );

  useEffect(() => {
    const element = categoriesRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setCategoriesVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = categoriesRef.current;
    const button = categoryButtonRefs.current[selectedCategory];
    if (!container || !button) return;

    const updateIndicator = () => {
      const gridItem = button.parentElement;
      if (!gridItem) return;

      const compactLayout = window.innerWidth < 640;
      const desktopLayout = window.innerWidth >= 1024;

      setCategoryIndicator({
        left: desktopLayout
          ? gridItem.offsetLeft + button.offsetLeft
          : gridItem.offsetLeft + button.offsetLeft + button.offsetWidth * 0.29,
        top: compactLayout
          ? container.offsetHeight + 10
          : gridItem.offsetTop + button.offsetTop + button.offsetHeight,
        width: desktopLayout
          ? button.offsetWidth
          : Math.max(28, button.offsetWidth * 0.42),
      });
    };

    const frame = requestAnimationFrame(updateIndicator);
    const resizeObserver = new ResizeObserver(updateIndicator);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [selectedCategory, categoriesVisible]);

  const transitionTo = (nextCategory: number, nextPage: number) => {
    if (isFading || (nextCategory === activeCategory && nextPage === page)) {
      return;
    }

    setIsFading(true);
    fadeTimer.current = setTimeout(() => {
      setActiveCategory(nextCategory);
      setPage(nextPage);
      setExpandedCard(0);
      enterTimer.current = setTimeout(() => setIsFading(false), 30);
    }, FADE_DURATION);
  };

  const move = (direction: number) => {
    const nextPage = (page + direction + pageCount) % pageCount;
    transitionTo(activeCategory, nextPage);
  };

  const moveMobile = (direction: number) => {
    setMobileProjectIndex(
      (current) =>
        (current + direction + category.projects.length) % category.projects.length,
    );
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < 50) return;
    if (window.innerWidth < 1024) {
      moveMobile(distance > 0 ? -1 : 1);
      return;
    }

    move(distance > 0 ? -1 : 1);
  };

  return (
    <div className="mt-8">
      <div
        ref={categoriesRef}
        className="relative mx-auto grid max-w-4xl grid-cols-4 gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-6 lg:max-w-[1202px] lg:gap-x-[74px]"
      >
        {categories.map((item, index) => (
          <Reveal delay={index * 120} key={item.slug}>
            <button
              className={`group relative flex w-full flex-col items-center gap-3 pb-4 text-[11px] font-extrabold transition-[color,translate] duration-300 max-sm:gap-2 max-sm:px-0 max-sm:text-[9px] ${
                selectedCategory === index
                  ? "text-brand"
                  : "hover:-translate-y-1 hover:text-brand"
              }`}
              disabled={isFading}
              onClick={() => {
                setSelectedCategory(index);
                setMobileProjectIndex(0);
                transitionTo(index, 0);
              }}
              ref={(element) => {
                categoryButtonRefs.current[index] = element;
              }}
              aria-pressed={selectedCategory === index}
              type="button"
            >
              <span
                className={`grid size-[58px] place-items-center rounded-full border transition-[background-color,border-color,box-shadow,scale] duration-300 max-sm:size-11 sm:size-16 lg:size-[82px] ${
                  selectedCategory === index
                    ? "scale-110 border-[#df641c] bg-[#e86f25] shadow-[0_8px_24px_rgb(223_100_28/.32)] group-hover:bg-[#df641c] lg:scale-100"
                    : "border-brand group-hover:border-[#df641c] group-hover:bg-[#df641c]"
                }`}
              >
                <Image
                  className={`size-8 object-contain transition-[filter] duration-300 max-sm:size-7 sm:size-9 ${item.desktopIconClassName} ${
                    selectedCategory === index
                      ? "brightness-0 invert"
                      : "group-hover:brightness-0 group-hover:invert"
                  }`}
                  src={item.icon}
                  alt=""
                  width={44}
                  height={44}
                />
              </span>
              <span className="max-w-40 leading-snug max-sm:flex max-sm:h-9 max-sm:w-full max-sm:items-center max-sm:justify-center max-sm:px-0.5 max-sm:text-center max-sm:text-[10px] max-sm:font-extrabold max-sm:leading-[1.05] max-sm:tracking-[-0.025em] sm:whitespace-nowrap sm:text-[13px] sm:font-extrabold sm:leading-none lg:max-w-none lg:text-[15px] lg:font-semibold">
                {item.label}
              </span>
            </button>
          </Reveal>
        ))}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute h-0.5 bg-brand transition-[left,top,width,opacity] duration-500 ease-in-out ${
            categoriesVisible ? "opacity-100" : "opacity-0"
          }`}
          style={categoryIndicator}
        />
      </div>

      <div
        className={`mt-9 transition-[opacity,translate] duration-[220ms] ease-out ${
          isFading ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        }`}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={handleTouchEnd}
      >
        <div className="lg:hidden">
          {mobileProject && (
            <div key={mobileProject.id}>
              <div className="grid min-h-[210px] grid-cols-[46%_54%] overflow-hidden rounded-2xl shadow-lg sm:min-h-[430px] sm:grid-cols-2 sm:rounded-[28px]">
                <div className="relative min-h-[210px] sm:min-h-[430px]">
                  <Image
                    className="object-cover"
                    src={mobileProject.image}
                    alt={mobileProject.title}
                    fill
                    decoding="sync"
                    loading="eager"
                    sizes="(max-width: 639px) 46vw, 50vw"
                    unoptimized={mobileProject.image === "/images/home/project-wide-04.png"}
                  />
                </div>
                <div className="flex flex-col justify-center bg-brand p-4 text-white sm:p-7">
                  <h3 className="text-lg font-extrabold uppercase leading-tight max-sm:line-clamp-2 max-sm:text-[15px] max-sm:leading-[1.08] max-sm:tracking-[-0.02em] sm:line-clamp-2 sm:text-[23px] sm:leading-[1.05]">
                    {mobileProject.title}
                  </h3>
                  <BuildingRule
                    className="mt-2 h-5 max-w-40 text-white sm:mt-5 sm:h-6 sm:max-w-[200px]"
                    compact
                    light
                    fullWidth
                  />
                  <div className="mt-3 space-y-0.5 text-xs leading-relaxed text-white sm:mt-6 sm:space-y-1 sm:text-[18px] sm:leading-[1.35]">
                    <p>
                      <strong className="font-extrabold">Diện tích:</strong>{" "}
                      <span className="font-normal">{mobileProject.area}</span>
                    </p>
                    <p>
                      <strong className="font-extrabold">Phong cách thiết kế:</strong>{" "}
                      <span className="font-normal">{mobileProject.style}</span>
                    </p>
                    <p>
                      <strong className="font-extrabold">Năm thực hiện:</strong>{" "}
                      <span className="font-normal">{mobileProject.year}</span>
                    </p>
                  </div>
                  <CardMoreLink
                    className="mt-3 text-white hover:text-white focus-visible:text-white sm:mt-4 sm:text-[17px]"
                    href="/du-an"
                  />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6">
                <div className="flex gap-2">
                  <button className="relative size-9 overflow-hidden rounded-full sm:size-14" onClick={() => moveMobile(-1)} aria-label="Dự án trước" type="button">
                    <Image src="/images/home/project-previous.png" alt="" fill sizes="(max-width: 639px) 36px, 56px" />
                  </button>
                  <button className="relative size-9 overflow-hidden rounded-full sm:size-14" onClick={() => moveMobile(1)} aria-label="Dự án tiếp theo" type="button">
                    <Image src="/images/home/project-next.png" alt="" fill sizes="(max-width: 639px) 36px, 56px" />
                  </button>
                </div>
                <BmtCta href="/du-an" variant="compact">TÌM HIỂU THÊM</BmtCta>
              </div>
            </div>
          )}
        </div>

        <div className="relative hidden lg:mx-auto lg:block lg:w-full lg:max-w-full">
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:flex lg:h-[410px] lg:w-full lg:items-stretch lg:justify-center"
            initial="hidden"
            key={`${activeCategory}-${page}`}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardContainerVariants}
          >
            {visibleProjects.map((project, index) => {
              const isExpanded = expandedCard === index;

              return (
                <motion.article
                  className={`group relative min-h-80 overflow-hidden rounded-3xl bg-charcoal shadow-lg transition-[flex-basis,flex-grow,box-shadow] duration-500 ease-in-out hover:shadow-[0_22px_48px_rgb(47_38_34/.24)] sm:min-h-[340px] lg:min-w-0 lg:shrink ${
                    isExpanded ? "lg:basis-[45%] lg:grow-0" : "lg:basis-0 lg:grow"
                  }`}
                  key={project.id}
                  variants={cardItemVariants}
                  onClick={() => setExpandedCard(index)}
                  onFocusCapture={() => setExpandedCard(index)}
                  onMouseEnter={() => setExpandedCard(index)}
                  tabIndex={0}
                >
                  <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[600px] -translate-x-1/2">
                    <Image
                      className="object-cover [transform:scale(1)] transition-transform duration-500 ease-in-out will-change-transform group-hover:[transform:scale(1.25)] group-focus:[transform:scale(1.25)] group-focus-within:[transform:scale(1.25)]"
                      src={project.image}
                      alt={project.title}
                      fill
                      decoding="sync"
                      loading="eager"
                      sizes="600px"
                      unoptimized={project.image === "/images/home/project-wide-04.png"}
                    />
                  </div>

                  <div
                    className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                      isExpanded ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      className="scale-[1.03] object-cover object-top opacity-[0.82]"
                      src="/images/home/featured-projects-background.png"
                      alt=""
                      fill
                      loading="eager"
                      sizes="600px"
                      aria-hidden="true"
                    />
                  </div>

                  <div
                    className={`absolute inset-0 flex flex-col justify-end p-7 text-left text-white transition-opacity duration-300 ${
                      isExpanded ? "opacity-100 delay-150" : "pointer-events-none opacity-0 delay-0"
                    }`}
                  >
                    <h3 className="max-w-md text-xl font-bold uppercase leading-snug">
                      {project.title}
                    </h3>
                    <BuildingRule
                      className="mt-1 h-5 max-w-48 text-white"
                      compact
                      light
                      fullWidth
                    />
                    <p className="mt-2 text-sm leading-relaxed text-white/95">
                      <strong>Diện tích:</strong> {project.area}
                      <br />
                      <strong>Phong cách thiết kế:</strong> {project.style}
                      <br />
                      <strong>Năm thực hiện:</strong> {project.year}
                    </p>
                    <CardMoreLink className="mt-5" href="/du-an" />
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          <button
            className="absolute left-0 top-1/2 z-30 size-11 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full transition-transform duration-300 hover:scale-110 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            disabled={isFading}
            onClick={() => move(-1)}
            aria-label="Nhóm dự án trước"
            type="button"
          >
            <Image
              src="/images/home/project-previous.png"
              alt=""
              fill
              sizes="44px"
            />
          </button>

          <button
            className="absolute right-0 top-1/2 z-30 size-11 translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full transition-transform duration-300 hover:scale-110 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            disabled={isFading}
            onClick={() => move(1)}
            aria-label="Nhóm dự án tiếp theo"
            type="button"
          >
            <Image
              src="/images/home/project-next.png"
              alt=""
              fill
              sizes="44px"
            />
          </button>
        </div>
      </div>

      <div className="mt-[42px] hidden items-center justify-center lg:flex">
        <div
          className="flex items-center gap-[10px]"
          aria-label="Phân trang dự án"
        >
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              className={`size-[22px] shrink-0 rounded-full border-[3px] transition-[border-color,background-color,transform] duration-300 hover:scale-110 ${
                page === index
                  ? "border-brand bg-brand shadow-[inset_0_0_0_4px_white]"
                  : "border-charcoal bg-white"
              }`}
              disabled={isFading}
              key={index}
              onClick={() => transitionTo(activeCategory, index)}
              aria-label={`Trang dự án ${index + 1}`}
              aria-current={page === index ? "page" : undefined}
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
