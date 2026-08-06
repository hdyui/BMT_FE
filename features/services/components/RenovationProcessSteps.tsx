"use client";

import Image from "next/image";
import { Reveal } from "@/lib/components/shared/Reveal";

export type RenovationProcessStep = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
};

type RenovationProcessStepsProps = {
  steps: readonly RenovationProcessStep[];
};

export function RenovationProcessSteps({ steps }: RenovationProcessStepsProps) {
  return (
    // Đã thu hẹp max-width xuống còn khoảng 1024px để lọt lòng vừa đường viền đỏ
    <section className="mx-auto w-[min(1024px,calc(100%-2rem))] py-12">
      {/* Header: Chữ bên trái, Logo BMT bên phải */}
      <Reveal
        from="bottom"
        className="mb-10 flex w-full flex-col items-center justify-between gap-4 md:flex-row"
      >
        <h2 className="text-4xl font-extrabold uppercase tracking-wide text-charcoal ">
          Quy trình cải tạo & sửa chữa tại
        </h2>
        <Image
          src="/images/cai-tao-sua-chua/logo.png" // BẠN ĐỔI URL ẢNH LOGO VÀO ĐÂY
          alt="BMT Decor Logo"
          width={200}
          height={55}
          className="object-contain mx-4"
        />
      </Reveal>

      {/* Grid 5 cột */}
      <div className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-1">
        {steps.map((step, index) => (
          <Reveal
            key={step.number}
            className="group/step relative w-full transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
            delay={index * 150}
            from="bottom"
          >
            {/* Background Frame: Tự động scale theo chiều ngang mới */}
            <Image
              src="/images/cai-tao-sua-chua/frame.png" // BẠN ĐỔI URL ẢNH KHUNG SỐ 49 VÀO ĐÂY
              alt="Khung background"
              width={260}
              height={600}
              className="h-auto w-full object-contain"
              sizes="(max-width: 1024px) 100vw, 20vw"
            />
            {index === steps.length - 1 && (
              <span
                className="pointer-events-none absolute right-0 top-[68%] h-[18%] w-[18%] bg-white"
                aria-hidden="true"
              />
            )}

            {/* Lớp overlay sáng màu cam khi hover */}
            <div className="pointer-events-none absolute left-0 top-0 h-[28%] w-full rounded-t-[1.5rem] bg-white/0 transition-colors duration-300 group-hover/step:bg-white/20" />

            {/* Số thứ tự: Tinh chỉnh lại size một xíu */}
            <div className="absolute left-[46%] top-[13%] -translate-x-1/2 -translate-y-1/2 text-center text-[24px] font-semibold text-white xl:text-[26px]">
              {step.number}
            </div>

            {/* Vùng chứa Text: Vẫn giữ nguyên tỉ lệ bóp lề để lọt lòng khung đen */}
            <div className="absolute inset-0 bottom-[12%] left-[10%] right-[16%] top-[27%] flex flex-col pt-2">
              {/* Tiêu đề: Ép size nhỏ lại chút để không rớt dòng */}
              <h3 className="flex flex-col text-left text-[12px] font-bold leading-snug text-charcoal xl:text-[13px]">
                <span>{step.title}</span>
                <span>{step.subtitle}</span>
              </h3>

              {/* Đường line cam */}
              <div className="my-1.5 h-[2px] w-[55%] bg-[#f26f21]" />

              {/* Mô tả: Size nhỏ hơn một xíu để lọt vừa khung sau khi scale */}
              <p className="text-left text-[11px] leading-tight text-charcoal/80 xl:text-[12px] xl:leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Icon (Logo dưới): Tràn 50% ra ngoài khung, scale nhỏ lại tí cho cân đối */}
            <Reveal
              className="absolute bottom-[-4%] left-[46%] z-10 -translate-x-1/2 translate-y-1/2"
              delay={index * 150 + 350}
              from="fade"
            >
              <Image
                className="size-10 object-contain transition-transform duration-300 group-hover/step:scale-110 xl:size-12"
                src={step.icon}
                alt={step.title}
                width={48}
                height={48}
              />
            </Reveal>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
