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
  featuredProjects,
  solutionCards,
} from "@/features/services/data/xay-dung-tron-goi";

export function FullConstructionServicePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white pt-16 text-charcoal">
      <SiteHeader />

      <section className="relative isolate overflow-hidden">
        <Image
          className="absolute inset-y-0 right-0 -z-10 hidden h-full w-[60%] object-cover object-left opacity-90 lg:block"
          src="/images/xay-dung-tron-goi/hero-wireframe.png"
          alt=""
          width={1400}
          height={1310}
          priority
        />

        <div className="mx-auto grid w-[min(1200px,calc(100%-2.25rem))] items-center gap-10 py-16 lg:grid-cols-[0.9fr_1fr] lg:gap-16 lg:py-24">
          <Reveal from="left">
            <HexagonShowcase />
          </Reveal>

          <div>
            <Reveal>
              <h1 className="text-3xl leading-tight font-normal text-brand sm:text-4xl">
                DỊCH VỤ THIẾT KẾ THI CÔNG
                <br />& XÂY DỰNG TRỌN GÓI
              </h1>
            </Reveal>
            <BuildingRule
              className="mt-3 max-w-[280px]"
              src="/images/xay-dung-tron-goi/rule-dark.png"
            />
            <Reveal delay={160} from="left">
              <p className="mt-4 max-w-md text-sm leading-relaxed font-medium text-pretty">
                Kiến tạo công trình bền vững từ thiết kế đến thi công
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden py-16">
        <Image
          className="-z-10 object-cover"
          src="/images/xay-dung-tron-goi/carousel-background.png"
          alt=""
          fill
          sizes="100vw"
        />

        <div className="mx-auto w-[min(1200px,calc(100%-2.25rem))] text-center">
          <Reveal>
            <h2 className="text-3xl font-normal sm:text-4xl">
              TỐI ƯU MÔ HÌNH THIẾT KẾ THI CÔNG TRỌN GÓI
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-pretty">
              Dịch vụ thiết kế thi công và xây dựng trọn gói giúp chủ đầu tư
              triển khai công trình một cách đồng bộ, từ ý tưởng, thiết kế đến
              thi công hoàn thiện. Thay vì làm việc với nhiều đơn vị, khách
              hàng chỉ cần một đầu mối duy nhất để quản lý toàn bộ dự án, giúp
              tiết kiệm thời gian, kiểm soát ngân sách và hạn chế phát sinh
              trong quá trình xây dựng.
            </p>
          </Reveal>
          <BuildingRule
            className="mx-auto mt-5"
            src="/images/xay-dung-tron-goi/rule-orange.png"
          />
        </div>

        <Reveal className="mt-12" delay={120}>
          <ProjectCarousel projects={featuredProjects} />
        </Reveal>

        <Reveal className="mt-8 flex justify-center" delay={200}>
          <PillCtaButton
            className="w-[220px]"
            href="#contact-form"
            label="TƯ VẤN MIỄN PHÍ"
            image="/images/xay-dung-tron-goi/btn-pill.png"
            imageWidth={1539}
            imageHeight={292}
          />
        </Reveal>
      </section>

      <section className="bg-neutral-100 py-16">
        <div className="mx-auto w-[min(1200px,calc(100%-2.25rem))]">
          <div className="text-center">
            <Reveal>
              <h2 className="text-3xl font-normal sm:text-4xl">
                GIẢI PHÁP THIẾT KẾ THI CÔNG
                <br />
                THEO TỪNG LOẠI HÌNH CÔNG TRÌNH
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed">
                Giải pháp thiết kế tối ưu cho từng không gian
              </p>
            </Reveal>
            <BuildingRule
              className="mx-auto mt-5 mb-12"
              src="/images/xay-dung-tron-goi/rule-orange.png"
            />
          </div>

          <SolutionCards cards={solutionCards} />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto mb-12 w-[min(790px,calc(100%-2.25rem))] text-center">
          <Reveal>
            <h2 className="text-3xl font-normal sm:text-4xl">
              QUY TRÌNH THIẾT KẾ THI CÔNG
              <br />& XÂY NHÀ TRỌN GÓI
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed">
              Triển khai đồng bộ, kiểm soát chất lượng trong từng giai đoạn
            </p>
          </Reveal>
          <BuildingRule
            className="mx-auto mt-5"
            src="/images/xay-dung-tron-goi/rule-orange.png"
          />
        </div>

        <ProcessStepsGrid />
      </section>

      <ContactForm />
      <SiteFooter />
    </div>
  );
}
