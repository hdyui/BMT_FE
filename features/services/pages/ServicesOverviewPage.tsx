import Image from "next/image";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { FaqAccordion } from "@/features/services/components/FaqAccordion";
import { ProcessAccordion } from "@/features/services/components/ProcessAccordion";
import { ServiceTabs } from "@/features/services/components/ServiceTabs";
import { heroCards } from "@/features/services/data/overview";

const cardPositions = [
  "top-[118px] left-0 z-40",
  "top-[72px] left-[24%] z-30",
  "top-8 left-[49%] z-20",
  "top-0 right-0 z-10",
] as const;

export function ServicesOverviewPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white pt-16 text-charcoal">
      <SiteHeader />

      <section className="relative isolate min-h-[760px] max-md:min-h-[900px]">
        <Image
          className="-z-30 object-cover"
          src="/images/services/hero-background.webp"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgb(255_255_255/.95)_0%,rgb(255_255_255/.78)_38%,rgb(255_255_255/.08)_68%)] max-md:bg-[linear-gradient(180deg,rgb(255_255_255/.96)_0%,rgb(255_255_255/.88)_55%,rgb(255_255_255/.18)_100%)]" />

        <div className="relative mx-auto min-h-[760px] w-[min(1640px,calc(100%-4rem))] max-md:min-h-[900px] max-md:w-[calc(100%-2.25rem)]">
          <div className="relative z-10 flex h-[760px] w-[46%] max-w-[720px] flex-col justify-center max-md:h-auto max-md:w-full max-md:justify-start max-md:pt-16">
            <Reveal>
              <p className="mb-4 inline-block border-b-2 border-charcoal pb-1 text-lg">
                GIẢI PHÁP
              </p>
              <h1 className="max-w-[560px] text-[clamp(2rem,2.2vw,2.75rem)] leading-[1.18] font-normal text-brand">
                THIẾT KẾ THI CÔNG, XÂY DỰNG VÀ CẢI TẠO TRỌN GÓI
              </h1>
            </Reveal>

            <BuildingRule className="mt-2 max-w-[340px]" src="/images/services/rule-dark.png" />

            <Reveal delay={200} from="left">
              <h2 className="mt-5 mb-4 max-w-[560px] text-base font-semibold">
                ĐÁP ỨNG ĐA DẠNG NHU CẦU CHO NHÀ Ở VÀ CÔNG TRÌNH THƯƠNG MẠI
              </h2>
              <p className="flex max-w-[500px] items-start gap-1.5 text-base leading-relaxed text-pretty">
                <Image
                  className="size-4 shrink-0 translate-y-0.5 object-contain"
                  src="/images/services/icon-house.png"
                  alt=""
                  width={86}
                  height={91}
                />
                <span>
                  BMT Decor mang đến dịch vụ thiết kế thi công, xây dựng và cải
                  tạo trọn gói từ ý tưởng đến hoàn thiện, tạo nên những công
                  trình chất lượng và đáp ứng nhu cầu sử dụng.
                </span>
              </p>
            </Reveal>
          </div>

          <div className="absolute top-16 -right-8 h-[620px] w-[56%] max-lg:origin-top-right max-lg:scale-[.82] max-md:top-auto max-md:-right-12 max-md:bottom-0 max-md:w-[680px] max-md:origin-bottom-right max-md:scale-[.66]">
            {heroCards.map((card, index) => (
              <Reveal
                className={`absolute w-[280px] hover:z-50 ${cardPositions[index]}`}
                delay={(heroCards.length - 1 - index) * 130}
                from="right"
                key={card.image}
              >
                <Image
                  className="h-auto w-full transition-transform duration-500 ease-out hover:scale-105"
                  src={card.image}
                  alt={card.alt}
                  width={800}
                  height={1501}
                  sizes="280px"
                  priority
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 py-16">
        <div className="mx-auto w-[min(1200px,calc(100%-2.25rem))]">
          <ServiceTabs />
        </div>
      </section>

      <section className="py-20" id="quy-trinh">
        <div className="mx-auto mb-10 w-[min(790px,calc(100%-2.25rem))] text-center">
          <Reveal>
            <h2 className="text-4xl font-normal md:text-[43px]">
              QUY TRÌNH LÀM VIỆC
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-3 max-w-[720px] leading-relaxed">
              BMT Decor triển khai dự án theo quy trình 6 bước rõ ràng, đảm bảo
              tiến độ, chất lượng và đồng hành cùng khách hàng trong từng giai
              đoạn.
            </p>
          </Reveal>
          <BuildingRule className="mx-auto mt-4 max-w-[330px]" src="/images/services/rule-orange.png" />
        </div>
        <ProcessAccordion />
      </section>

      <section className="grid lg:grid-cols-2">
        <Reveal className="relative min-h-[280px] overflow-hidden rounded-tr-[54px] lg:min-h-[620px] lg:rounded-tr-[72px]">
          <Image
            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
            src="/images/services/faq-photo.webp"
            alt="Góc thư giãn trong công trình do BMT Decor thực hiện"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>
        <div className="bg-neutral-100 px-5 py-14 lg:rounded-tl-[72px] lg:py-16 lg:pr-[9%] lg:pl-[6%]">
          <Reveal>
            <h2 className="text-4xl font-normal">CÁC CÂU HỎI THƯỜNG GẶP</h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-4 max-w-[520px] text-sm leading-relaxed text-pretty">
              Giải đáp những thắc mắc phổ biến giúp khách hàng hiểu rõ hơn về
              quy trình và dịch vụ của BMT Decor
            </p>
          </Reveal>
          <BuildingRule className="mt-3 mb-8 max-w-[330px]" src="/images/services/rule-orange.png" />
          <FaqAccordion />
        </div>
      </section>

      <ContactForm />
      <SiteFooter />
    </div>
  );
}
