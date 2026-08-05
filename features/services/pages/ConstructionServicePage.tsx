import Image from "next/image";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ContactForm } from "@/lib/components/shared/ContactForm";

import { ProjectCarousel } from "@/features/services/components/ProjectCarousel";
import { SolutionCards } from "@/features/services/components/SolutionCards";
import { PillCtaButton } from "@/features/services/components/PillCtaButton";
import { ConstructionProcessList } from "@/features/services/components/ConstructionProcessList";
import { DiamondPhotoFrame } from "@/features/services/components/DiamondPhotoFrame";
import {
  SERVICE_HERO_CLASS_NAME,
  SERVICE_PROJECT_CAROUSEL_CLASS_NAME,
  SERVICE_PROJECT_CTA_CLASS_NAME,
  SERVICE_PROJECT_HEADING_CLASS_NAME,
  SERVICE_PROJECT_SECTION_CLASS_NAME,
  SERVICE_SOLUTION_CARDS_CLASS_NAME,
  SERVICE_SOLUTION_HEADING_CLASS_NAME,
  SERVICE_SOLUTION_SECTION_CLASS_NAME,
} from "@/features/services/config/layout";

import {
  featuredProjects,
  solutionCards,
} from "@/features/services/data/thi-cong-xay-dung";

// TỌA ĐỘ VÀ KÍCH THƯỚC ĐÃ ĐƯỢC TỊNH TIẾN SANG PHẢI 12%
// Toàn bộ các đường chéo song song và khoảng trắng đều nhau được giữ nguyên tuyệt đối.
const HERO_DIAMONDS = [
  {
    key: "top",
    src: "/images/thi-cong-xay-dung/hero-top.jpg",
    alt: "Thi công nhà hàng",
    left: "39.0%",
    top: "3.0%", // Đã dời xuống (cũ: -4.0%)
    size: "66.0%",
    zIndex: 10,
  },
  {
    key: "right",
    src: "/images/thi-cong-xay-dung/right.png",
    alt: "Thi công thẩm mỹ viện",
    left: "74.0%",
    top: "34.0%", // Đã dời xuống (cũ: 27.0%) - An toàn 100% không bị cắt
    size: "46.0%",
    zIndex: 20,
  },
  {
    key: "left",
    src: "/images/thi-cong-xay-dung/leet.png",
    alt: "Thi công văn phòng",
    left: "15.5%",
    top: "54.5%", // Đã dời xuống (cũ: 47.5%)
    size: "48.0%",
    zIndex: 30,
  },
  {
    key: "bottom",
    src: "/images/thi-cong-xay-dung/hero-bottom.jpg",
    alt: "Thi công nhà ở",
    left: "50.5%",
    top: "81.5%", // Đã dời xuống (cũ: 74.5%)
    size: "60.0%",
    zIndex: 40,
  },
] as const;

export function ConstructionServicePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white pt-16 text-charcoal">
      <SiteHeader />

      {/* SECTION 1: BANNER */}
      <section className={SERVICE_HERO_CLASS_NAME}>
        <Reveal
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] lg:block"
          from="fade"
        >
          <Image
            className="object-cover object-right opacity-80"
            src="/images/thi-cong-xay-dung/hero-wireframe.png"
            alt=""
            fill
            sizes="38vw"
            priority
            aria-hidden="true"
          />
        </Reveal>

        <div className="relative mx-auto aspect-[1400/949] w-full max-w-[560px] lg:absolute lg:inset-y-0 lg:left-0 lg:mx-0 lg:aspect-auto lg:h-full lg:w-[63.94%] lg:max-w-none">
          {HERO_DIAMONDS.map((diamond, index) => (
            <DiamondPhotoFrame
              key={diamond.key}
              src={diamond.src}
              alt={diamond.alt}
              left={diamond.left}
              top={diamond.top}
              size={diamond.size}
              zIndex={diamond.zIndex}
              delay={index * 170}
            />
          ))}
        </div>

        <div className="relative z-20 px-6 pt-10 pb-14 lg:absolute lg:top-[44%] lg:left-[60.2%] lg:px-0 lg:pt-0 lg:pb-0">
          <div className="flex gap-4">
            <Reveal className="shrink-0" from="fade">
              <Image
                className="h-full w-[5px] rounded-full object-fill"
                src="/images/thi-cong-xay-dung/accent-tick.png"
                alt=""
                width={25}
                height={840}
                aria-hidden="true"
              />
            </Reveal>

            <div className="flex flex-col">
              <Reveal from="bottom">
                {/* Đã cập nhật class font giống với DesignServicePage và giảm kích thước */}
                <h1 className="text-2xl font-normal leading-[1.12] text-[#F05B43] uppercase tracking-wide sm:text-[clamp(1.6rem,1.9vw,2.3rem)]">
                  <span className="inline-block bg-[#FFEAEA] px-5 py-1.5">
                    Dịch Vụ Thi Công
                  </span>
                  <br />
                  <span className="mt-2 inline-block bg-[#FFEAEA] px-5 py-1.5 sm:mt-3">
                    Xây Dựng
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={220} from="left">
                <Image
                  className="mt-4 h-[26px] w-auto object-contain object-left xl:h-[32px]"
                  src="/images/thi-cong-xay-dung/icon-building-divider.png"
                  alt=""
                  width={571}
                  height={128}
                  aria-hidden="true"
                />
              </Reveal>

              <Reveal delay={380} from="left">
                <p className="mt-4 text-[16px] leading-[1.55] text-charcoal xl:text-[18px]">
                  Đồng Hành Kiến Tạo Công Trình
                  <br />
                  Bền Vững
                </p>
              </Reveal>

              <Reveal delay={520} from="left">
                <Image
                  className="mt-10 w-[66px] object-contain xl:mt-14"
                  src="/images/thi-cong-xay-dung/dots-pattern.png"
                  alt=""
                  width={288}
                  height={207}
                  aria-hidden="true"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TỪ PHẦN THÔ ĐẾN HOÀN THIỆN */}
      <section
        className={`${SERVICE_PROJECT_SECTION_CLASS_NAME} relative isolate !py-12 lg:!py-16`}
      >
        <Image
          className="-z-10 object-cover"
          src="/images/thi-cong-xay-dung/carousel-background.png"
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
        />

        <div
          className={`${SERVICE_PROJECT_HEADING_CLASS_NAME} !mb-0 !pb-0 text-center px-4`}
        >
          <Reveal from="bottom">
            <h2 className="text-3xl font-bold uppercase sm:text-4xl text-center">
              THI CÔNG XÂY DỰNG TỪ PHẦN THÔ ĐẾN HOÀN THIỆN
            </h2>
          </Reveal>
          <Reveal delay={140} from="bottom">
            <p className="mx-auto mt-4 max-w-[1180px] text-sm leading-relaxed text-pretty text-center">
              Thi công xây dựng là giai đoạn quyết định chất lượng và tuổi thọ
              của công trình. BMT Decor triển khai{" "}
              <strong className="font-bold">xây dựng phần thô</strong>,{" "}
              <strong className="font-bold">thi công hoàn thiện</strong> và các
              hạng mục xây dựng theo đúng hồ sơ kỹ thuật, đảm bảo quy trình thi
              công đồng bộ, kiểm soát chặt chẽ chất lượng vật liệu, tiến độ và
              an toàn lao động. Mỗi công trình đều được giám sát xuyên suốt nhằm
              hạn chế phát sinh và đảm bảo chất lượng khi bàn giao.
            </p>
          </Reveal>
          <BuildingRule
            className="mx-auto mt-5 h-8 max-w-[250px]"
            src="/images/xay-dung-tron-goi/rule-orange.png"
            delay={300}
          />
        </div>

        <Reveal
          className={`${SERVICE_PROJECT_CAROUSEL_CLASS_NAME} !mt-8 lg:!mt-10 w-full`}
          delay={120}
        >
          <ProjectCarousel
            projects={featuredProjects}
            prevIcon="/images/thi-cong-xay-dung/nav-prev.png"
            nextIcon="/images/thi-cong-xay-dung/nav-next.png"
          />
        </Reveal>

        <Reveal
          className={`${SERVICE_PROJECT_CTA_CLASS_NAME} !mt-8 lg:!mt-12 flex justify-center w-full`}
          delay={200}
        >
          <PillCtaButton
            className="h-full"
            href="#contact-form"
            label="TƯ VẤN MIỄN PHÍ"
            image="/images/thi-cong-xay-dung/btn-pill.png"
            imageWidth={1539}
            imageHeight={292}
          />
        </Reveal>
      </section>

      {/* SECTION 3: THEO LOẠI HÌNH CÔNG TRÌNH */}
      <section className={`bg-white ${SERVICE_SOLUTION_SECTION_CLASS_NAME}`}>
        <div className={SERVICE_SOLUTION_HEADING_CLASS_NAME}>
          <div className="mb-12 text-center">
            <Reveal from="bottom">
              <h2 className="text-3xl uppercase sm:text-4xl">
                <span className="font-normal">THI CÔNG XÂY DỰNG</span>
                <br />
                <span className="font-bold">
                  THEO TỪNG LOẠI HÌNH CÔNG TRÌNH
                </span>
              </h2>
            </Reveal>
            <Reveal delay={140} from="bottom">
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed">
                Giải pháp thiết kế tối ưu cho từng không gian
              </p>
            </Reveal>
            <Reveal delay={250} from="left">
              <BuildingRule
                className="mx-auto mt-5"
                src="/images/thi-cong-xay-dung/rule-orange-center.png"
              />
            </Reveal>
          </div>
        </div>

        <div className={SERVICE_SOLUTION_CARDS_CLASS_NAME}>
          <SolutionCards
            cards={solutionCards}
            checkIcon="/images/thi-cong-xay-dung/icon-house.png"
            ruleImage="/images/thi-cong-xay-dung/rule-short.png"
          />
        </div>
      </section>

      {/* SECTION 4: QUY TRÌNH THI CÔNG */}
      <section className="relative isolate overflow-hidden bg-[#F2F2F3] py-16">
        <Image
          className="-z-10 object-cover"
          src="/images/thi-cong-xay-dung/process-background.png"
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="mx-auto mb-12 w-[min(790px,calc(100%-2.25rem))] text-center">
          <Reveal from="bottom">
            <h2 className="text-3xl font-bold uppercase sm:text-4xl">
              QUY TRÌNH THI CÔNG XÂY DỰNG
            </h2>
          </Reveal>
          <Reveal delay={140} from="bottom">
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed">
              Triển khai bài bản, giám sát chặt chẽ trong từng giai đoạn
            </p>
          </Reveal>
          <Reveal delay={250} from="left">
            <BuildingRule
              className="mx-auto mt-5"
              src="/images/thi-cong-xay-dung/rule-orange-center.png"
            />
          </Reveal>
        </div>

        <ConstructionProcessList />
      </section>

      <ContactForm />
      <SiteFooter />
    </div>
  );
}
