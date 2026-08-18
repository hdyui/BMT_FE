"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

export function CapabilityHero() {
  const reduceMotion = useReducedMotion();
  const initialUp = reduceMotion ? false : { opacity: 0, y: 28 };
  const initialLeft = reduceMotion ? false : { opacity: 0, x: -34 };

  return (
    <section className="relative isolate min-h-[690px] overflow-hidden bg-[#f3f3f3] pb-16 lg:h-[35.125rem] lg:min-h-[35.125rem] lg:pb-0">
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        <motion.div
          className="absolute inset-y-0 right-0 z-0 w-[20%] rounded-l-[4rem] bg-[#eeeeee]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.65, delay: 0.08 }}
        />

        <motion.div
          className="absolute -top-[8%] left-[33.5%] z-[1] w-[14.7%] max-w-[17.5rem]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.12 }}
        >
          <Image className="h-auto w-full" src="/images/capability-profile/decor-06.webp" alt="" width={1476} height={662} priority sizes="15vw" />
        </motion.div>

        <motion.div
          className="absolute top-[5.5%] left-[7.1%] z-[1] w-[4.2%] max-w-[4.5rem] opacity-55"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Image className="h-auto w-full" src="/images/capability-profile/decor-04.webp" alt="" width={284} height={429} sizes="4.2vw" />
        </motion.div>

        <motion.div
          className="absolute bottom-[-9%] left-0 z-[1] w-[46%] opacity-45"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ duration: 0.72, delay: 0.35 }}
        >
          <Image className="h-auto w-full" src="/images/capability-profile/decor-08.webp" alt="" width={3690} height={2774} sizes="46vw" />
        </motion.div>

        <motion.div
          className="absolute top-[77.7%] left-[42.4%] z-[1] aspect-square w-[8.7%] origin-top-right -rotate-[5deg] rounded-tl-full border-t-[clamp(25px,2.05vw,34px)] border-l-[clamp(25px,2.05vw,34px)] border-[#dedede] opacity-55"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 0.62, delay: 0.42 }}
        >
        </motion.div>

        <motion.div
          className="absolute top-[11%] left-[69.8%] z-[1] w-[24%] max-w-[27rem] opacity-95"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 0.95 }}
          transition={{ duration: 0.58, delay: 0.28 }}
        >
          <Image className="h-auto w-full" src="/images/capability-profile/decor-09.webp" alt="" width={1977} height={1077} sizes="24vw" />
        </motion.div>

        <motion.div
          className="absolute bottom-[6.5%] left-[37.1%] z-[4] w-[8.5%] max-w-[10rem]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.62 }}
        >
          <Image className="h-auto w-full" src="/images/capability-profile/decor-07.webp" alt="" width={672} height={284} sizes="8.5vw" />
        </motion.div>

        <motion.div
          className="absolute bottom-[4.5%] left-[48.4%] z-[4] w-[21.7%] max-w-[26rem]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.58, delay: 0.54 }}
        >
          <Image className="h-auto w-full" src="/images/capability-profile/decor-05.webp" alt="" width={1707} height={666} sizes="21.7vw" />
        </motion.div>

        <motion.div
          className="absolute right-[4%] bottom-[4.2%] z-[2] w-[6.3%] max-w-[7.5rem]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.48, delay: 0.76 }}
        >
          <span className="block aspect-square w-full rounded-[1.125rem] bg-[#f47a2a]" />
        </motion.div>

        <motion.div
          className="absolute right-[6.9%] bottom-[7.2%] z-[6] w-[8.2%] opacity-55"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 0.45, delay: 0.84 }}
        >
          <Image className="h-auto w-full" src="/images/capability-profile/decor-11.webp" alt="" width={615} height={23} sizes="8.2vw" />
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 -z-10 w-full opacity-55 lg:hidden"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        aria-hidden="true"
      >
        <Image className="h-auto w-full" src="/images/capability-profile/decor-08.webp" alt="" width={3690} height={2774} sizes="100vw" />
      </motion.div>

      <div className="relative z-10 mx-auto w-[calc(100%-2rem)] pt-10 lg:absolute lg:top-[25.7%] lg:left-[7.1%] lg:w-[41%] lg:max-w-[49rem] lg:p-0">
        <motion.h1
          className="text-[2.25rem] leading-[1.08] font-extrabold tracking-[-0.025em] text-[#242122] uppercase lg:text-[clamp(2.25rem,2.7vw,3.25rem)]"
          initial={initialUp}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.68, ease, delay: 0.08 }}
        >
          Hồ sơ năng lực
          <span className="mt-0.5 block">BMT Decor</span>
        </motion.h1>

        <motion.p
          className="mt-4 max-w-[39rem] text-[1.2rem] leading-[1.3] font-normal tracking-[-0.02em] text-[#1a1a1a] uppercase lg:mt-2 lg:w-[32vw] lg:max-w-[38rem] lg:text-[clamp(1.15rem,1.62vw,1.95rem)]"
          initial={initialUp}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.68, ease, delay: 0.28 }}
        >
          Khẳng định năng lực - Đồng hành kiến tạo giá trị bền vững
        </motion.p>

        <motion.div
          className="mt-3 w-full max-w-[24.5rem] lg:mt-3 lg:w-[15.5vw] lg:max-w-[18.6rem]"
          initial={initialLeft}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.48 }}
          aria-hidden="true"
        >
          <Image className="h-auto w-full" src="/images/capability-profile/decor-14.webp" alt="" width={1388} height={128} sizes="(max-width: 1023px) 392px, 15.5vw" />
        </motion.div>

        <motion.p
          className="mt-2 max-w-[42rem] text-justify text-[.95rem] leading-[1.55] font-medium text-[#242122] lg:mt-2 lg:w-max lg:max-w-[41vw] lg:text-[clamp(.8rem,.88vw,1.02rem)] lg:leading-[1.5]"
          initial={initialLeft}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.66 }}
        >
          {/* Ba đoạn tách sẵn để desktop xuống hàng đúng ở "chuyên" và "thiết".
              Khối dùng w-max nên bề ngang bám sát dòng dài nhất (dòng 3); hai
              dòng trên justify tới đúng bề ngang đó nên ba dòng thẳng đều hai
              lề mà phần dãn chữ thêm là nhỏ nhất có thể. */}
          <span className="lg:block lg:[text-align-last:justify]">
            Khám phá tổng quan về BMT Decor thông qua lĩnh vực hoạt động, đội ngũ{" "}
          </span>
          <span className="lg:block lg:[text-align-last:justify]">
            chuyên môn, quy trình triển khai và các dự án tiêu biểu, phản ánh năng lực{" "}
          </span>
          <span className="lg:block">
            thiết kế, thi công và cải tạo công trình một cách chuyên nghiệp và đồng bộ.
          </span>
        </motion.p>
      </div>

      <motion.div
        className="group relative z-[3] mx-auto mt-16 w-[calc(100%-4rem)] max-w-[45rem] overflow-hidden rounded-[2rem] shadow-[0_18px_45px_rgb(65_57_51/.15)] lg:absolute lg:top-[13.9%] lg:left-[51%] lg:mt-0 lg:w-[41.8%] lg:max-w-[44rem] lg:rounded-[1.9rem]"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease, delay: 0.18 }}
      >
        <Image
          className="h-auto w-full scale-[1.025] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none group-hover:scale-[1.055]"
          src="/images/capability-profile/hero-profile.webp"
          alt="Bộ hồ sơ năng lực BMT Decor được trưng bày trên bàn gỗ"
          width={1800}
          height={1200}
          priority
          sizes="(max-width: 1023px) calc(100vw - 64px), 42vw"
        />
      </motion.div>
    </section>
  );
}
