"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import type { HomeTrustIntroContent } from "@/features/home/types/home-public";

const introContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.35,
      delayChildren: 0.1,
    },
  },
};

const introItemVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

export function TrustIntro({ content }: { content: HomeTrustIntroContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className="text-center text-charcoal"
      animate={visible ? "visible" : "hidden"}
      initial="hidden"
      variants={introContainerVariants}
    >
      <motion.h2
        className="text-3xl font-extrabold tracking-[-0.035em] uppercase motion-reduce:transform-none sm:text-4xl"
        variants={introItemVariants}
      >
        <span className="sm:hidden">{content.titleMobile}</span>
        <span className="hidden sm:inline">{content.titleDesktop}</span>
      </motion.h2>
      <motion.p
        className="mx-auto mt-3 max-w-3xl text-xl leading-relaxed text-muted-foreground motion-reduce:transform-none max-sm:text-[14px] max-sm:leading-[1.42]"
        variants={introItemVariants}
      >
        <span className="sm:hidden">
          {content.descriptionMobile}
        </span>
        <span className="hidden sm:inline">
          {content.descriptionDesktop}
        </span>
      </motion.p>
      <div className="relative mx-auto mt-4 h-10 w-full max-w-72 overflow-hidden">
        <Image
          className={`origin-left object-contain object-right transition-transform delay-500 duration-1000 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none ${
            visible ? "scale-x-100" : "scale-x-0"
          }`}
          src="/images/home/section-rule.png"
          alt=""
          fill
          sizes="288px"
        />
      </div>
    </motion.div>
  );
}
