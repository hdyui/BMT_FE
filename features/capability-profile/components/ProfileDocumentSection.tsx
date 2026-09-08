"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ProfileBook } from "./ProfileBook";

const ease = [0.16, 1, 0.3, 1] as const;

export function ProfileDocumentSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-[#fdfdfd] pt-8 pb-6 sm:pt-10 lg:pt-10 lg:pb-8">
      {/* Tiêu đề + vạch logo: mobile thu nhỏ về ~60% bề ngang khung (khớp
          mockup) bằng padding ngang riêng; desktop giữ nguyên khung
          min(1510px, 100%-2rem) như cũ. */}
      <div className="mx-auto w-[min(1510px,calc(100%-2rem))] px-[18%] lg:px-0">
        <motion.h2
          className="text-center text-[1.4rem] leading-[1.08] font-extrabold tracking-[-0.025em] text-[#242122] uppercase lg:text-[clamp(2.25rem,2.7vw,3.25rem)]"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, ease }}
        >
          Hồ sơ doanh nghiệp
        </motion.h2>

        <motion.div
          className="mx-auto mt-3 w-40 lg:w-[15.5vw] lg:max-w-[18.6rem]"
          initial={reduceMotion ? false : { opacity: 0, x: -42 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          aria-hidden="true"
        >
          <Image className="h-auto w-full" src="/images/capability-profile/decor-14.webp" alt="" width={1388} height={128} sizes="(max-width: 1023px) 392px, 15.5vw" />
        </motion.div>
      </div>

      {/* Ảnh cuốn sách: mobile giờ chỉ hiện 1 trang đơn (MobileProfileBook)
          nên dùng khổ dọc vừa phải, không cần bề ngang bằng cả bố cục sách
          đôi của desktop nữa. Desktop dùng lại đúng khung min(1510px,
          100%-2rem) như trước khi tách. */}
      <motion.div
        className="mt-3 mx-auto w-[calc(100%-3rem)] max-w-[24rem] sm:mt-4 lg:mx-auto lg:w-[min(1510px,calc(100%-2rem))] lg:max-w-none"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.05 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.85, ease, delay: 0.15 }}
      >
        <ProfileBook />
      </motion.div>
    </section>
  );
}
