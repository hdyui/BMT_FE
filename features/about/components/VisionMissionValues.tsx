"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./VisionMissionValues.module.css";

const imageRoot = "/images/about/source";

const coreValues: {
  title: string;
  description: string;
}[] = [
  {
    title: "Chất lượng là cam kết",
    description:
      "Chúng tôi đặt chất lượng thiết kế, vật liệu và thi công làm tiêu chuẩn trong mọi công trình. Mỗi hạng mục đều được kiểm soát chặt chẽ để đảm bảo tính thẩm mỹ, độ bền và giá trị sử dụng lâu dài.",
  },
  {
    title: "Khách hàng là trọng tâm",
    description:
      "Lắng nghe nhu cầu, thấu hiểu mong muốn và đưa ra giải pháp phù hợp là cách BMT Decor tạo nên những không gian đáp ứng cả công năng lẫn thẩm mỹ của từng khách hàng.",
  },
  {
    title: "Sáng tạo là giá trị",
    description:
      "Không ngừng cập nhật xu hướng thiết kế và đổi mới tư duy, chúng tôi mang đến những giải pháp phù hợp với từng không gian, tạo nên dấu ấn riêng cho mỗi công trình.",
  },
  {
    title: "Chuyên nghiệp là nền tảng",
    description:
      "Quy trình làm việc rõ ràng, minh bạch và kiểm soát chặt chẽ từ thiết kế đến thi công giúp đảm bảo tiến độ, chất lượng và sự đồng bộ trong từng dự án.",
  },
  {
    title: "Tận tâm là trách nhiệm",
    description:
      "Chúng tôi đồng hành cùng khách hàng trong suốt quá trình thực hiện, luôn sẵn sàng tư vấn, hỗ trợ và xử lý nhanh chóng mọi vấn đề để mang đến trải nghiệm tốt nhất.",
  },
];

function AnimatedHeading({
  children,
  isVisible,
  delay,
}: {
  children: React.ReactNode;
  isVisible: boolean;
  delay: number;
}) {
  return (
    <div>
      <h3
        className={`text-2xl sm:text-3xl font-bold uppercase leading-none text-brand transition-[opacity,translate] duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </h3>
      <div
        className={`relative mt-3 h-6 w-full max-w-[285px] origin-left transition-[opacity,scale] duration-800 ease-out motion-reduce:scale-x-100 motion-reduce:opacity-100 ${
          isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        }`}
        style={{ transitionDelay: `${delay + 220}ms` }}
        aria-hidden="true"
      >
        <Image
          className="object-contain object-left"
          src="/images/home/section-rule.png"
          alt=""
          fill
          sizes="285px"
        />
      </div>
    </div>
  );
}

export function VisionMissionValues() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeValue, setActiveValue] = useState(0);

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
      className="relative isolate overflow-hidden bg-[#f4f4f4] py-24 sm:py-28 lg:py-32"
      ref={sectionRef}
    >
      <Image
        className="-z-10 object-cover object-bottom opacity-80"
        src={`${imageRoot}/city-blueprint.png`}
        alt=""
        fill
        sizes="100vw"
      />

      <div className="mx-auto grid w-[min(1380px,calc(100%-2.25rem))] items-start gap-14 lg:grid-cols-[.9fr_1.25fr_1fr] lg:gap-10">
        <div className="space-y-14 lg:space-y-16">
          <div>
            <AnimatedHeading isVisible={isVisible} delay={100}>
              Tầm nhìn
            </AnimatedHeading>
            <p
              className={`mt-5 max-w-[410px] text-justify text-xl leading-7 text-neutral-700 [text-align-last:left] [text-justify:inter-character] transition-[opacity,translate] duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-x-0 motion-reduce:opacity-100 ${
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

          <div>
            <AnimatedHeading isVisible={isVisible} delay={650}>
              Sứ mệnh
            </AnimatedHeading>
            <p
              className={`mt-5 max-w-[410px] text-justify text-xl leading-7 text-neutral-700 [text-align-last:left] [text-justify:inter-character] transition-[opacity,translate] duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-x-0 motion-reduce:opacity-100 ${
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
          className={`order-first transition-[opacity,scale] duration-1000 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:scale-100 motion-reduce:opacity-100 lg:order-none ${
            isVisible ? "scale-100 opacity-100" : "scale-[.92] opacity-0"
          }`}
          style={{ transitionDelay: "430ms" }}
        >
          <div className={styles.illustrationFloat}>
            <Image
              className="mx-auto h-auto w-full max-w-[640px]"
              src={`${imageRoot}/architect-isometric.png`}
              alt="Kiến trúc sư BMT Decor phát triển phương án thiết kế"
              width={1739}
              height={1417}
              sizes="(max-width: 1024px) 90vw, 42vw"
            />
          </div>
        </div>

        <div className="lg:pt-0">
          <AnimatedHeading isVisible={isVisible} delay={260}>
            Giá trị cốt lõi
          </AnimatedHeading>

          <div className="mt-7 space-y-2">
            {coreValues.map(({ title, description }, index) => {
              const isActive = activeValue === index;

              return (
                <div
                  className={`transition-[opacity,translate] duration-800 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-x-0 motion-reduce:opacity-100 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "translate-x-20 opacity-0"
                  }`}
                  style={{ transitionDelay: `${620 + index * 120}ms` }}
                  key={title}
                >
                  <button
                    className="group/value grid w-full grid-cols-[18px_22px_1fr] items-center gap-2.5 py-2 text-left"
                    type="button"
                    onClick={() => setActiveValue(index)}
                    aria-expanded={isActive}
                  >
                    <span
                      className={`size-[18px] rounded-full border-[3px] transition-[background-color,border-color,box-shadow,scale] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover/value:scale-110 group-hover/value:border-white group-hover/value:bg-brand group-hover/value:shadow-[0_0_0_1.5px_#f47a2a] ${
                        isActive
                          ? "border-white bg-brand shadow-[0_0_0_1.5px_#f47a2a]"
                          : "border-charcoal bg-charcoal shadow-none"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`h-px w-full transition-colors duration-400 ${isActive ? "bg-brand" : "bg-charcoal"}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-xl font-bold uppercase leading-tight transition-colors duration-400 group-hover/value:text-brand ${
                        isActive ? "text-brand" : "text-charcoal"
                      }`}
                    >
                      {title}
                    </span>
                  </button>

                  <div
                    className={`grid pl-[30px] transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                      isActive
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-3 text-justify text-xl leading-6 text-neutral-700 [text-align-last:left] [text-justify:inter-character]">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
