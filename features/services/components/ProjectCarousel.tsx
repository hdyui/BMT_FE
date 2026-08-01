"use client";

import Image from "next/image";
import { useRef, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export type FeaturedProject = {
  id: string;
  image: string;
  tag: string;
  title: string;
};

type ProjectCarouselProps = {
  projects: readonly FeaturedProject[];
};

export function ProjectCarousel({ projects: featuredProjects }: ProjectCarouselProps) {
  const count = featuredProjects.length;
  const [centerIndex, setCenterIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const move = (direction: number) => {
    setCenterIndex((current) => (current + direction + count) % count);
  };

  const leftIndex = (centerIndex - 1 + count) % count;
  const rightIndex = (centerIndex + 1) % count;

  const slots = useMemo(
    () => [
      { project: featuredProjects[leftIndex], role: "left" as const },
      { project: featuredProjects[centerIndex], role: "center" as const },
      { project: featuredProjects[rightIndex], role: "right" as const },
    ],
    [centerIndex, leftIndex, rightIndex],
  );

  return (
    <div className="relative w-full">
      {/* Vùng chứa tràn màn hình */}
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-6">
        <div
          /* ĐÃ NỚI RỘNG KHOẢNG CÁCH: Tăng gap lên 50px ở màn hình lớn */
          className="flex items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-[50px] transition-transform duration-500 ease-in-out"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const distance =
              event.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(distance) < 50) return;
            move(distance > 0 ? -1 : 1);
          }}
        >
          {slots.map(({ project, role }, slotIndex) => (
            <div
              className={cn(
                "relative shrink-0 overflow-hidden shadow-2xl transition-all duration-500 ease-in-out",
                role === "center"
                  ? "z-10 aspect-[1.15/1] w-[42vw] max-w-[580px] rounded-[44px] scale-100"
                  : "hidden aspect-[1.25/1] w-[36vw] max-w-[480px] rounded-[36px] opacity-90 scale-[0.97] sm:block",
              )}
              key={`${project.id}-${slotIndex}`}
            >
              <Image
                className="object-cover transition-opacity duration-300"
                src={project.image}
                alt={project.title}
                fill
                sizes={role === "center" ? "42vw" : "36vw"}
                priority={role === "center"}
              />

              {/* Lớp phủ màu cam */}
              <div
                className={cn(
                  "absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-[#F47A2A] via-[#F47A2A]/90 to-transparent",
                  role === "center" ? "h-[50%]" : "h-[55%]",
                )}
                aria-hidden="true"
              />

              {/* Thông tin chữ */}
              <div
                className={cn(
                  "absolute inset-x-0 bottom-0 flex flex-col items-center justify-end p-6 text-center text-white",
                  role === "center" ? "pb-8" : "pb-5",
                )}
              >
                <p
                  className={cn(
                    "font-semibold tracking-wider uppercase",
                    role === "center" ? "text-sm mb-1.5" : "text-[10px] mb-1",
                  )}
                >
                  {project.tag}
                </p>
                <h3
                  className={cn(
                    "font-bold uppercase leading-tight",
                    role === "center"
                      ? "text-2xl sm:text-3xl lg:text-[32px]"
                      : "text-sm sm:text-base lg:text-lg",
                  )}
                >
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cụm nút điều hướng */}
      <div className="relative z-10 mt-6 flex items-center justify-center gap-4">
        <button
          className="grid size-12 place-items-center rounded-full bg-brand text-white shadow-[0_6px_20px_rgb(244_122_42/.4)] transition-all duration-300 hover:scale-110 hover:bg-brand-dark active:scale-95"
          onClick={() => move(-1)}
          aria-label="Dự án trước"
          type="button"
        >
          {/* TRẢ LẠI ICON HÌNH TAM GIÁC ĐẶC (Trái) */}
          <svg
            className="ml-[-2px]"
            width="14"
            height="16"
            viewBox="0 0 14 16"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 8L14 0V16L0 8Z" />
          </svg>
        </button>
        <button
          className="grid size-12 place-items-center rounded-full bg-brand text-white shadow-[0_6px_20px_rgb(244_122_42/.4)] transition-all duration-300 hover:scale-110 hover:bg-brand-dark active:scale-95"
          onClick={() => move(1)}
          aria-label="Dự án tiếp theo"
          type="button"
        >
          {/* TRẢ LẠI ICON HÌNH TAM GIÁC ĐẶC (Phải) */}
          <svg
            className="mr-[-2px]"
            width="14"
            height="16"
            viewBox="0 0 14 16"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14 8L0 0V16L14 8Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
