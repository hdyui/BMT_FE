"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { CarouselApi } from "@/lib/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/lib/components/ui/carousel";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import {
  relatedProjects,
  type RelatedProjectData as RelatedProject,
} from "@/features/projects/data/related-projects";
import { ProjectSectionHeading } from "./ProjectSectionHeading";

function subscribeToProjectColumns(onStoreChange: () => void) {
  const tabletQuery = window.matchMedia("(min-width: 640px)");
  const desktopQuery = window.matchMedia("(min-width: 1024px)");

  tabletQuery.addEventListener("change", onStoreChange);
  desktopQuery.addEventListener("change", onStoreChange);

  return () => {
    tabletQuery.removeEventListener("change", onStoreChange);
    desktopQuery.removeEventListener("change", onStoreChange);
  };
}

function getVisibleProjectCount() {
  if (window.matchMedia("(min-width: 1024px)").matches) return 3;
  if (window.matchMedia("(min-width: 640px)").matches) return 2;
  return 1;
}

function RelatedProjectCard({ project }: { project: RelatedProject }) {
  return (
    <Link
      href={project.href}
      className="group block rounded-[2rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      aria-label={`Xem chi tiết dự án ${project.title}`}
    >
    <article className="relative aspect-[3334/2653] overflow-hidden rounded-[1.65rem] bg-white sm:rounded-[2rem]">
      <Image
        src={project.image}
        alt={`Dự án ${project.title} do BMT Decor thiết kế và thi công`}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045] group-focus-visible:scale-[1.045] motion-reduce:transition-none"
      />
      <div
        className="absolute inset-x-0 bottom-0 grid min-h-[76px] content-center bg-white/86 px-3 py-2.5 text-center text-charcoal backdrop-blur-[2px] transition-[min-height,background-color,color,padding] duration-500 ease-out group-hover:min-h-[92px] group-hover:bg-brand group-hover:text-white group-focus-visible:min-h-[92px] group-focus-visible:bg-brand group-focus-visible:text-white motion-reduce:transition-none sm:px-4"
      >
        <p className="text-[11px] leading-tight uppercase sm:text-[13px]">
          Thiết kế thi công nội thất
        </p>
        <h3 className="mt-1 text-[clamp(14px,1.35vw,19px)] leading-tight font-bold uppercase tracking-[-0.035em]">
          {project.title}
        </h3>
      </div>
    </article>
    </Link>
  );
}

export function RelatedProjects() {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedPage, setSelectedPage] = useState(0);
  const [pageCount, setPageCount] = useState(2);
  const visibleProjectCount = useSyncExternalStore(
    subscribeToProjectColumns,
    getVisibleProjectCount,
    () => 3,
  );

  const syncCarousel = useCallback((carousel: CarouselApi) => {
    if (!carousel) return;
    const selected = carousel.selectedScrollSnap();
    const snaps = carousel.scrollSnapList().length;
    setSelectedPage(selected);
    setPageCount(snaps);
  }, []);

  useEffect(() => {
    if (!api) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    syncCarousel(api);
    api.on("select", syncCarousel);
    api.on("reInit", syncCarousel);
    return () => {
      api.off("select", syncCarousel);
      api.off("reInit", syncCarousel);
    };
  }, [api, syncCarousel]);

  return (
    <section
      className="-mb-[2.342945vw] bg-[#f1f1f2] pt-[clamp(62px,7vw,110px)] pb-[calc(clamp(62px,7vw,110px)+2.342945vw)] lg:-mb-[2.57vw] lg:pb-[calc(clamp(62px,7vw,110px)+2.57vw)]"
      aria-labelledby="related-title"
    >
      <div className="mx-auto w-[min(1280px,calc(100%-2.25rem))]">
        <ProjectSectionHeading centered delay={80} duration={950}>
          <span id="related-title">Tham khảo dự án liên quan</span>
        </ProjectSectionHeading>

        <BuildingRule
          className="mx-auto mt-4 max-w-[350px] text-brand"
          fullWidth
          delay={160}
        />

        <Carousel
          className="mx-5 mt-9 sm:mx-7 lg:mx-10"
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 3,
            breakpoints: {
              "(max-width: 639px)": { slidesToScroll: 1 },
              "(min-width: 640px) and (max-width: 1023px)": {
                slidesToScroll: 2,
              },
            },
          }}
          aria-label="Dự án liên quan"
        >
          <CarouselContent className="-ml-5">
            {relatedProjects.map((project, index) => (
              <CarouselItem
                className="basis-full pl-5 sm:basis-1/2 lg:basis-1/3"
                key={project.title}
              >
                <Reveal
                  delay={index < visibleProjectCount ? 220 + index * 90 : 0}
                  distance="long"
                  duration={1050}
                >
                  <RelatedProjectCard project={project} />
                </Reveal>
              </CarouselItem>
            ))}
          </CarouselContent>

          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            className="absolute top-1/2 left-0 z-20 size-11 -translate-x-1/3 -translate-y-1/2 rounded-full transition-[filter,transform] duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-[0_7px_10px_rgba(238,123,48,0.35)] active:scale-95 sm:size-12 lg:-translate-x-1/2"
            aria-label="Dự án trước"
          >
            <Image
              src="/images/projects/detail/arrow-previous.png"
              alt=""
              fill
              sizes="48px"
              className="object-contain"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            className="absolute top-1/2 right-0 z-20 size-11 translate-x-1/3 -translate-y-1/2 rounded-full transition-[filter,transform] duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-[0_7px_10px_rgba(238,123,48,0.35)] active:scale-95 sm:size-12 lg:translate-x-1/2"
            aria-label="Dự án tiếp theo"
          >
            <Image
              src="/images/projects/detail/arrow-next.png"
              alt=""
              fill
              sizes="48px"
              className="object-contain"
              aria-hidden="true"
            />
          </button>
        </Carousel>

        <Reveal
          className="mt-7 flex justify-center gap-2"
          delay={380}
          distance="long"
          duration={900}
          from="fade"
          aria-label="Chọn trang dự án liên quan"
        >
          {Array.from({ length: pageCount }, (_, page) => (
            <button
              type="button"
              className={`size-[22px] rounded-full border-[3px] transition-[border-color,background-color,transform] duration-300 hover:scale-110 ${page === selectedPage ? "border-brand bg-brand shadow-[inset_0_0_0_4px_white]" : "border-charcoal bg-white"}`}
              onClick={() => api?.scrollTo(page)}
              aria-label={`Trang dự án liên quan ${page + 1}`}
              aria-current={page === selectedPage ? "page" : undefined}
              key={page}
            >
            </button>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
