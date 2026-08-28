"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BuildingRule } from "@/shared/components/BuildingRule";
import { aboutCoreValues as coreValues } from "@/features/about/data/about-content";
import styles from "./VisionMissionValues.module.css";

const imageRoot = "/images/about/source";

function AnimatedHeading({
  children,
  isVisible,
  delay,
  fullWidthRule = false,
}: {
  children: React.ReactNode;
  isVisible: boolean;
  delay: number;
  fullWidthRule?: boolean;
}) {
  const ruleWidthClass = fullWidthRule
    ? "max-w-[230px] sm:max-w-[380px]"
    : "max-w-[175px] sm:max-w-[330px]";

  return (
    <div>
      <h3
        className={`text-[26px] font-extrabold uppercase leading-none tracking-[-0.025em] text-brand transition-[opacity,translate] duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:text-[34px] lg:text-[38px] ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </h3>
      <div
        className={`relative mt-3 h-6 w-full origin-left transition-[opacity,scale] duration-800 ease-out motion-reduce:scale-x-100 motion-reduce:opacity-100 max-sm:mt-2 max-sm:h-5 ${ruleWidthClass} ${
          isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        }`}
        style={{
          transitionDelay: `${delay + 220}ms`,
        }}
        aria-hidden="true"
      >
        <BuildingRule
          className="h-full max-w-none text-brand sm:[&>span:last-child]:h-6 sm:[&>span:last-child]:w-9 sm:[&>span:last-child>img]:h-6"
          compact
          fullWidth
        />
      </div>
    </div>
  );
}

function CoreValuesList({
  activeValue,
  isVisible,
  mobile,
  onChange,
}: {
  activeValue: number;
  isVisible: boolean;
  mobile: boolean;
  onChange: (index: number) => void;
}) {
  return (
    <div
      className={
        mobile
          ? "mt-4 flex h-[320px] flex-col sm:hidden"
          : "mt-7 hidden h-[400px] space-y-2 sm:block"
      }
    >
      {coreValues.map(({ title, description }, index) => {
        const isActive = activeValue === index;
        const mobileOrder =
          mobile && index === 3
            ? "order-5"
            : mobile && index === 4
              ? "order-4"
              : "";

        return (
          <div
            className={`transition-[opacity,translate] duration-800 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-x-0 motion-reduce:opacity-100 ${mobileOrder} ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-20 opacity-0"
            }`}
            style={{ transitionDelay: `${620 + index * 120}ms` }}
            key={title}
          >
            <button
              className="group/value grid w-full grid-cols-[30px_22px_1fr] items-center gap-2.5 py-2 text-left max-sm:grid-cols-[24px_16px_1fr] max-sm:gap-2 max-sm:py-1.5"
              type="button"
              onClick={() => onChange(index)}
              aria-expanded={isActive}
            >
              <span
                className="grid size-[30px] place-items-center max-sm:size-6"
                aria-hidden="true"
              >
                <span
                  className={`rounded-full transition-[width,height,background-color,border-color,box-shadow,scale] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover/value:scale-110 group-hover/value:border-white group-hover/value:bg-brand group-hover/value:shadow-[0_0_0_1.5px_#f47a2a] ${
                    isActive
                      ? "size-[26px] border-2 border-white bg-brand shadow-[0_0_0_1.5px_#f47a2a] max-sm:size-5"
                      : "size-[18px] border-[3px] border-charcoal bg-charcoal shadow-none max-sm:size-3.5 max-sm:border-2"
                  }`}
                />
              </span>
              <span
                className={`h-px w-full transition-colors duration-400 ${isActive ? "bg-brand" : "bg-charcoal"}`}
                aria-hidden="true"
              />
              <span
                className={`text-[17px] font-bold uppercase leading-tight transition-colors duration-400 group-hover/value:text-brand max-sm:text-[14px] ${
                  isActive ? "text-brand" : "text-charcoal"
                }`}
              >
                {title}
              </span>
            </button>

            <div
              className={`grid pl-[30px] transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] max-sm:pl-6 ${
                isActive
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[290px] pb-3 text-justify text-[15px] leading-[1.45] text-neutral-700 [text-align-last:left] [text-justify:inter-character] max-sm:w-full max-sm:max-w-none max-sm:pb-2 max-sm:text-[13px]">
                  {description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CoreValueIllustration({
  activeValue,
  mobile,
}: {
  activeValue: number;
  mobile: boolean;
}) {
  const active = coreValues[activeValue];

  return (
    <div
      className={
        mobile
          ? "relative mx-auto aspect-[2199/1792] w-full max-w-[285px] sm:hidden"
          : "relative mx-auto hidden aspect-[2199/1792] w-full max-w-[520px] sm:block"
      }
      role="img"
      aria-label={`Minh hoạ cho giá trị ${active.title}`}
    >
      {coreValues.map((value, index) => (
        <Image
          className={`${index === 3 ? "object-fill" : "object-contain"} transition-[opacity,scale,filter] duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${index === 4 ? styles.dedicationIllustration : ""} ${
            activeValue === index
              ? "scale-100 opacity-100 blur-0"
              : "pointer-events-none scale-[.965] opacity-0 blur-[2px]"
          }`}
          src={value.image}
          alt=""
          fill
          sizes={mobile ? "285px" : "(max-width: 1024px) 42vw, 520px"}
          aria-hidden="true"
          key={value.image}
        />
      ))}
    </div>
  );
}

export function VisionMissionValues() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeMobileValue, setActiveMobileValue] = useState(0);
  const [activeDesktopValue, setActiveDesktopValue] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.14 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative isolate overflow-hidden bg-[#f4f4f4] py-24 max-sm:py-12 sm:py-28 lg:py-24"
      id="tam-nhin-su-menh"
      ref={sectionRef}
    >
      <Image
        className="-z-10 object-cover object-bottom opacity-80"
        src={`${imageRoot}/city-blueprint.png`}
        alt=""
        fill
        sizes="100vw"
      />

      <div className="mx-auto grid w-[min(1240px,calc(100%-3rem))] items-start gap-14 max-sm:w-[calc(100%-2.25rem)] max-sm:gap-8 lg:grid-cols-[.92fr_1.05fr_1.08fr] lg:gap-8">
        <div className="space-y-14 max-sm:order-3 max-sm:space-y-8 lg:space-y-16">
          <div className="max-w-[330px] max-sm:max-w-none">
            <AnimatedHeading isVisible={isVisible} delay={100}>
              Tầm nhìn
            </AnimatedHeading>
            <p
              className={`mt-5 max-w-full text-justify text-[15px] leading-[1.45] text-neutral-700 [text-align-last:left] [text-justify:inter-character] transition-[opacity,translate] duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-x-0 motion-reduce:opacity-100 max-sm:mt-3 max-sm:text-[13px] ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-20 opacity-0"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              Trở thành đơn vị thiết kế và thi công được khách hàng tin tưởng
              lựa chọn nhờ năng lực chuyên môn, quy trình chuyên nghiệp và chất
              lượng công trình, không ngừng nâng cao giá trị cho từng không gian
              sống và làm việc.
            </p>
          </div>

          <div className="max-w-[330px] max-sm:max-w-none">
            <AnimatedHeading isVisible={isVisible} delay={650}>
              Sứ mệnh
            </AnimatedHeading>
            <p
              className={`mt-5 max-w-full text-justify text-[15px] leading-[1.45] text-neutral-700 [text-align-last:left] [text-justify:inter-character] transition-[opacity,translate] duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-x-0 motion-reduce:opacity-100 max-sm:mt-3 max-sm:text-[13px] ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-20 opacity-0"
              }`}
              style={{ transitionDelay: "1050ms" }}
            >
              Mang đến những giải pháp thiết kế và thi công trọn gói chuyên
              nghiệp, giúp khách hàng sở hữu không gian tối ưu về công năng, hài
              hòa về thẩm mỹ và bền vững về chất lượng, đồng hành trong suốt quá
              trình kiến tạo công trình.
            </p>
          </div>
        </div>

        <div
          className={`order-first transition-[opacity,scale] duration-1000 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:scale-100 motion-reduce:opacity-100 max-sm:order-1 lg:order-none ${
            isVisible ? "scale-100 opacity-100" : "scale-[.92] opacity-0"
          }`}
          style={{ transitionDelay: "430ms" }}
        >
          <div className={styles.illustrationFloat}>
            <CoreValueIllustration activeValue={activeMobileValue} mobile />
            <CoreValueIllustration
              activeValue={activeDesktopValue}
              mobile={false}
            />
          </div>
        </div>

        <div className="max-sm:order-2 lg:pt-0">
          <AnimatedHeading isVisible={isVisible} delay={260} fullWidthRule>
            Giá trị cốt lõi
          </AnimatedHeading>

          <CoreValuesList
            activeValue={activeMobileValue}
            isVisible={isVisible}
            mobile
            onChange={setActiveMobileValue}
          />
          <CoreValuesList
            activeValue={activeDesktopValue}
            isVisible={isVisible}
            mobile={false}
            onChange={setActiveDesktopValue}
          />
        </div>
      </div>
    </section>
  );
}
