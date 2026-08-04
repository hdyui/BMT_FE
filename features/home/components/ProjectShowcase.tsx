"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { CardMoreLink } from "@/lib/components/shared/CardMoreLink";
import { Reveal } from "@/lib/components/shared/Reveal";

const cardContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

type Project = {
  id: string;
  image: string;
  title: string;
  location: string;
  scope: string;
};

const projectImages = [
  "/images/home/project-wide-01.png",
  "/images/home/project-wide-02.png",
  "/images/home/project-wide-03.png",
  "/images/home/project-wide-04.png",
  "/images/home/project-wide-01.png",
  "/images/home/project-wide-02.png",
  "/images/home/project-wide-03.png",
  "/images/home/project-wide-04.png",
] as const;

const categoryBlueprints = [
  {
    label: "NHÀ Ở",
    icon: "/images/home/category-house.png",
    slug: "nha-o",
    titles: [
      "Nhà phố hiện đại tại Phú Nhuận",
      "Biệt thự sân vườn tại Thủ Đức",
      "Căn hộ tối giản tại The Metropole",
      "Nhà phố kết hợp kinh doanh tại Quận 7",
      "Biệt thự nghỉ dưỡng tại Bảo Lộc",
      "Căn hộ phong cách Japandi tại Bình Thạnh",
      "Nhà phố lệch tầng tại Gò Vấp",
      "Penthouse hiện đại tại Quận 2",
    ],
  },
  {
    label: "VĂN PHÒNG",
    icon: "/images/home/category-office.png",
    slug: "van-phong",
    titles: [
      "Văn phòng công nghệ tại Quận 3",
      "Trụ sở doanh nghiệp tại Bình Thạnh",
      "Văn phòng sáng tạo tại Quận 1",
      "Không gian làm việc mở tại Thủ Đức",
      "Văn phòng điều hành tại Tân Bình",
      "Trung tâm đào tạo tại Quận 10",
      "Văn phòng tài chính tại Quận 7",
      "Co-working space tại Phú Nhuận",
    ],
  },
  {
    label: "THẨM MỸ VIỆN, SHOWROOM",
    icon: "/images/home/category-showroom.png",
    slug: "showroom",
    titles: [
      "Showroom nội thất tại Quận 2",
      "Thẩm mỹ viện cao cấp tại Quận 1",
      "Cửa hàng thời trang tại Quận 3",
      "Spa chăm sóc da tại Phú Nhuận",
      "Showroom ô tô tại Thủ Đức",
      "Beauty clinic tại Bình Thạnh",
      "Cửa hàng flagship tại Quận 7",
      "Studio trưng bày tại Tân Bình",
    ],
  },
  {
    label: "NHÀ HÀNG, KHÁCH SẠN",
    icon: "/images/home/category-hotel.png",
    slug: "hospitality",
    titles: [
      "Nhà hàng đương đại tại Quận 1",
      "Boutique hotel tại Đà Lạt",
      "Nhà hàng sân vườn tại Thủ Đức",
      "Khách sạn nghỉ dưỡng tại Vũng Tàu",
      "Quán café concept tại Quận 3",
      "Nhà hàng Nhật tại Bình Thạnh",
      "Resort ven biển tại Phan Thiết",
      "Khách sạn business tại Tân Bình",
    ],
  },
] as const;

const categories = categoryBlueprints.map((category) => ({
  ...category,
  projects: category.titles.map<Project>((title, index) => ({
    id: `${category.slug}-${index + 1}`,
    image: projectImages[index],
    title,
    location: index % 2 === 0 ? "TP. Hồ Chí Minh" : "Khu vực phía Nam",
    scope:
      index % 3 === 0
        ? "Thiết kế và thi công hoàn thiện"
        : "Thiết kế kiến trúc & nội thất",
  })),
}));

const PROJECTS_PER_PAGE = 4;
const FADE_DURATION = 220;

export function ProjectShowcase() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [page, setPage] = useState(0);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
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

      setCategoryIndicator({
        left: gridItem.offsetLeft + button.offsetLeft,
        top: gridItem.offsetTop + button.offsetTop + button.offsetHeight,
        width: button.offsetWidth,
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
      setExpandedCard(null);
      enterTimer.current = setTimeout(() => setIsFading(false), 30);
    }, FADE_DURATION);
  };

  const move = (direction: number) => {
    const nextPage = (page + direction + pageCount) % pageCount;
    transitionTo(activeCategory, nextPage);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < 50) return;
    move(distance > 0 ? -1 : 1);
  };

  return (
    <div className="mt-8">
      <div
        ref={categoriesRef}
        className="relative mx-auto grid max-w-4xl grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4"
      >
        {categories.map((item, index) => (
          <Reveal delay={index * 120} key={item.slug}>
            <button
              className={`group relative flex w-full flex-col items-center gap-3 pb-4 text-[11px] font-semibold transition-[color,translate] duration-300 ${
                selectedCategory === index
                  ? "text-brand"
                  : "hover:-translate-y-1 hover:text-brand"
              }`}
              disabled={isFading}
              onClick={() => {
                setSelectedCategory(index);
                transitionTo(index, 0);
              }}
              ref={(element) => {
                categoryButtonRefs.current[index] = element;
              }}
              aria-pressed={selectedCategory === index}
              type="button"
            >
              <span
                className={`grid size-12 place-items-center rounded-full border transition-[background-color,border-color,box-shadow,scale] duration-300 ${
                  selectedCategory === index
                    ? "scale-110 border-[#df641c] bg-[#e86f25] shadow-[0_8px_24px_rgb(223_100_28/.32)] group-hover:bg-[#df641c]"
                    : "border-brand group-hover:border-[#df641c] group-hover:bg-[#df641c]"
                }`}
              >
                <Image
                  className={`size-7 object-contain transition-[filter] duration-300 ${
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
              <span className="max-w-40 leading-snug">{item.label}</span>
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
        <div className="relative lg:mx-auto lg:w-fit lg:max-w-full">
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:flex lg:h-[360px] lg:items-stretch lg:justify-center"
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
                  className={`group relative min-h-80 overflow-hidden rounded-3xl bg-charcoal shadow-lg transition-[width,box-shadow] duration-500 ease-in-out hover:shadow-[0_22px_48px_rgb(47_38_34/.24)] sm:min-h-[340px] lg:flex-none ${
                    isExpanded ? "lg:w-[500px]" : "lg:w-[220px]"
                  }`}
                  key={project.id}
                  variants={cardItemVariants}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setExpandedCard(null);
                    }
                  }}
                  onClick={() => setExpandedCard(index)}
                  onFocusCapture={() => setExpandedCard(index)}
                  onMouseEnter={() => setExpandedCard(index)}
                  onMouseLeave={() => setExpandedCard(null)}
                  tabIndex={0}
                >
                  <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[500px] -translate-x-1/2">
                    <Image
                      className="object-cover [transform:scale(1)] transition-transform duration-500 ease-in-out will-change-transform group-hover:[transform:scale(1.25)] group-focus:[transform:scale(1.25)] group-focus-within:[transform:scale(1.25)]"
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="500px"
                    />
                  </div>

                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-brand/30 transition-opacity duration-500 ${
                      isExpanded ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  <div
                    className={`absolute inset-0 flex flex-col justify-end p-6 text-left text-white transition-[opacity,translate] duration-500 ${
                      isExpanded
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-5 opacity-0"
                    }`}
                  >
                    <span className="mb-auto text-xs font-semibold tracking-[0.18em] text-brand">
                      0{page * PROJECTS_PER_PAGE + index + 1}
                    </span>
                    <h3 className="max-w-md text-xl font-bold uppercase leading-snug">
                      {project.title}
                    </h3>
                    <div className="mt-4 h-px w-28 bg-brand" />
                    <p className="mt-4 text-sm leading-relaxed text-white/82">
                      Địa điểm: {project.location}
                      <br />
                      Hạng mục: {project.scope}
                    </p>
                    <CardMoreLink className="mt-5" href="/du-an" />
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          <button
            className="absolute left-0 top-1/2 z-30 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-brand shadow-[0_6px_18px_rgb(244_122_42/.34)] transition-[scale,box-shadow,background-color] duration-300 hover:scale-110 hover:bg-[#df641c] hover:shadow-[0_10px_24px_rgb(223_100_28/.42)] active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            disabled={isFading}
            onClick={() => move(-1)}
            aria-label="Nhóm dự án trước"
            type="button"
          >
            <span
              aria-hidden="true"
              className="mr-0.5 size-0 border-y-[5px] border-r-[7px] border-y-transparent border-r-white"
            />
          </button>

          <button
            className="absolute right-0 top-1/2 z-30 grid size-9 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-brand shadow-[0_6px_18px_rgb(244_122_42/.34)] transition-[scale,box-shadow,background-color] duration-300 hover:scale-110 hover:bg-[#df641c] hover:shadow-[0_10px_24px_rgb(223_100_28/.42)] active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            disabled={isFading}
            onClick={() => move(1)}
            aria-label="Nhóm dự án tiếp theo"
            type="button"
          >
            <span
              aria-hidden="true"
              className="ml-0.5 size-0 border-y-[5px] border-l-[7px] border-y-transparent border-l-white"
            />
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center">
        <div
          className="flex items-center gap-2.5"
          aria-label="Phân trang dự án"
        >
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              className={`aspect-square size-2.5 shrink-0 rounded-full border border-brand transition-[background-color,scale] duration-300 ${
                page === index
                  ? "bg-brand"
                  : "bg-white hover:scale-125 hover:bg-brand/30"
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
