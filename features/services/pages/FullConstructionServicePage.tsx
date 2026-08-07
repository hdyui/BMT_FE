import Image from "next/image";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { HexagonShowcase } from "@/features/services/components/HexagonShowcase";
import { ProjectCarousel } from "@/features/services/components/ProjectCarousel";
import { SolutionCards } from "@/features/services/components/SolutionCards";
import { ProcessStepsGrid } from "@/features/services/components/ProcessStepsGrid";
import { PillCtaButton } from "@/features/services/components/PillCtaButton";
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
} from "@/features/services/data/xay-dung-tron-goi";

export function FullConstructionServicePage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-white pt-16 text-charcoal">
      <SiteHeader />

      <section className={`${SERVICE_HERO_CLASS_NAME} md:h-[55vw] md:min-h-0`}>
        {/* Đã thêm translate-x-[15%] để cắt cạnh phải của hình này */}
        <Image
          className="absolute inset-y-0 right-0 translate-x-[15%] -z-10 hidden h-full w-[60%] object-cover object-left opacity-90 md:block"
          src="/images/xay-dung-tron-goi/hero-wireframe-nodots.png"
          alt=""
          width={1400}
          height={1241}
          priority
        />

        <div className="mx-auto grid w-[min(92%,760px)] items-center gap-10 py-12 md:block md:h-full md:w-full md:max-w-none md:py-0">
          <div className="md:absolute md:-top-[17.35%] md:left-0 md:w-[55vw] lg:left-[7.3%] lg:w-[clamp(560px,43.35vw,860px)]">
            <HexagonShowcase />
          </div>

          {/* Thu nhỏ width phần content: md:w-[39%] -> md:w-[34%], lg:w-[32%] -> lg:w-[27%] để không đè lên hình phải */}
          <div className="md:absolute md:top-[24%] md:left-[58%] md:w-[40%] lg:top-[30.7%] lg:left-[max(52.3%,calc(7.3%_+_clamp(560px,43.35vw,860px)_+_24px))] lg:w-[40%]">
            <div className="relative pl-6 sm:pl-8">
              <Reveal
                className="absolute inset-y-0 left-0 w-[5px]"
                from="fade"
                delay={80}
              >
                <Image
                  className="h-full w-full object-fill"
                  src="/images/xay-dung-tron-goi/hero-bar.png"
                  alt=""
                  width={25}
                  height={1070}
                  aria-hidden="true"
                />
              </Reveal>

              <Reveal>
                <h1 className="text-2xl font-extrabold leading-[1.12] text-brand sm:text-[clamp(1.75rem,2.15vw,2.45rem)]">
                  DỊCH VỤ THIẾT KẾ THI CÔNG
                  <br />& XÂY DỰNG TRỌN GÓI
                </h1>
              </Reveal>
              <BuildingRule
                className="mt-3 block mr-auto ml-0 max-w-[165px]"
                src="/images/xay-dung-tron-goi/rule-dark.png"
                delay={200}
              />
              <Reveal delay={320} from="left">
                <p className="mt-2 max-w-[310px] text-pretty text-sm font-normal leading-relaxed sm:text-base">
                  Kiến tạo công trình bền vững từ thiết kế đến thi công
                </p>
              </Reveal>
            </div>

            {/* Chuyển ml-[59%] thành ml-[42%] để dấu chấm xích qua trái */}
            <Reveal
              className="mt-8 ml-[42%] w-12 lg:mt-12"
              from="fade"
              delay={460}
            >
              <Image
                className="h-auto w-full"
                src="/images/xay-dung-tron-goi/hero-dots.png"
                alt=""
                width={291}
                height={207}
                aria-hidden="true"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section
        className={`${SERVICE_PROJECT_SECTION_CLASS_NAME} relative isolate !py-12 lg:!py-16`}
      >
        <Image
          className="-z-10 object-cover"
          src="/images/xay-dung-tron-goi/carousel-background.png"
          alt=""
          fill
          sizes="100vw"
        />

        <div
          className={`${SERVICE_PROJECT_HEADING_CLASS_NAME} !mb-8 lg:!mb-10 text-center px-4`}
        >
          <Reveal>
            <h2 className="text-3xl font-bold sm:text-[32px] text-center">
              TỐI ƯU MÔ HÌNH THIẾT KẾ THI CÔNG TRỌN GÓI
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-center">
              Dịch vụ <span className="font-bold">thiết kế thi công</span> và <span className="font-bold">xây dựng trọn gói</span> giúp chủ đầu tư
              triển khai công trình một cách đồng bộ, từ ý tưởng, thiết kế đến
              thi công hoàn thiện. Thay vì làm việc với nhiều đơn vị, khách hàng
              chỉ cần một đầu mối duy nhất để quản lý toàn bộ dự án, giúp tiết
              kiệm thời gian, kiểm soát ngân sách và hạn chế phát sinh trong quá
              trình xây dựng.
            </p>
          </Reveal>
          <BuildingRule
            className="mx-auto mt-5 h-8 max-w-[250px]"
            src="/images/xay-dung-tron-goi/rule-orange.png"
            delay={300}
          />
        </div>

        <Reveal
          className={`${SERVICE_PROJECT_CAROUSEL_CLASS_NAME} w-full`}
          delay={120}
        >
          <ProjectCarousel
            projects={featuredProjects}
            prevIcon="/images/cai-tao-sua-chua/nav-prev.png"
            nextIcon="/images/cai-tao-sua-chua/nav-next.png"
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

      <section className={`bg-white ${SERVICE_SOLUTION_SECTION_CLASS_NAME}`}>
        <div className={SERVICE_SOLUTION_HEADING_CLASS_NAME}>
          <div className="text-center">
            <Reveal>
              <h2 className="text-3xl uppercase sm:text-[32px]">
                <span className="font-normal">GIẢI PHÁP THIẾT KẾ THI CÔNG</span>
                <br />
                <span className="font-bold">
                  THEO TỪNG LOẠI HÌNH CÔNG TRÌNH
                </span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed">
                Giải pháp thiết kế tối ưu cho từng không gian
              </p>
            </Reveal>
            <BuildingRule
              className="mx-auto mt-3 mb-8 h-8 max-w-[250px]"
              src="/images/xay-dung-tron-goi/rule-orange.png"
              delay={300}
            />
          </div>
        </div>

        <div className={SERVICE_SOLUTION_CARDS_CLASS_NAME}>
          <SolutionCards cards={solutionCards} />
        </div>
      </section>

      <section className="bg-[#f2f2f3] py-12 lg:py-14">
        <div className="mx-auto mb-8 w-[min(790px,calc(100%-2.25rem))] text-center">
          <Reveal>
            <h2 className="text-3xl font-extrabold sm:text-[32px]">
              QUY TRÌNH THIẾT KẾ THI CÔNG &
              <br /> XÂY NHÀ TRỌN GÓI
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed">
              Triển khai đồng bộ, kiểm soát chất lượng trong từng giai đoạn
            </p>
          </Reveal>
          <BuildingRule
            className="mx-auto mt-3 h-8 max-w-[250px]"
            src="/images/xay-dung-tron-goi/rule-orange.png"
            delay={300}
          />
        </div>

        <ProcessStepsGrid />
      </section>

      <ContactForm />
      <SiteFooter />
    </div>
  );
}
