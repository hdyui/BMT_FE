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
import { SERVICE_HERO_CLASS_NAME } from "@/features/services/config/layout";

const cardPositions = [
  "top-[16%] left-0 z-40",
  "top-[10.7%] left-[23.5%] z-30",
  "top-[5.35%] left-[47%] z-20",
  "top-0 left-[70.5%] z-10",
] as const;

export function ServicesOverviewPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-white pt-16 text-charcoal">
      <SiteHeader />

      <section className={SERVICE_HERO_CLASS_NAME}>
        <Image
          className="-z-30 object-cover"
          src="/images/services/hero-background.webp"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgb(255_255_255/.95)_0%,rgb(255_255_255/.78)_38%,rgb(255_255_255/.08)_68%)] max-md:bg-[linear-gradient(180deg,rgb(255_255_255/.96)_0%,rgb(255_255_255/.88)_55%,rgb(255_255_255/.18)_100%)]" />

        <div className="relative h-full w-full max-md:mx-auto max-md:w-[calc(100%-2.25rem)]">
          <div className="relative z-10 flex h-full w-[36%] max-w-[640px] flex-col justify-center lg:ml-[7.3%] lg:-translate-y-[2vw] max-md:h-auto max-md:w-full max-md:translate-y-0 max-md:justify-start max-md:pt-16">
            <Reveal>
              <p className="mb-4 inline-block border-b-2 border-charcoal pb-1 text-lg">
                GIẢI PHÁP
              </p>
              <h1 className="max-w-[480px] text-[clamp(1.5rem,1.9vw,2.35rem)] leading-[1.18] font-bold text-brand">
                <span className="block lg:whitespace-nowrap">
                  THIẾT KẾ THI CÔNG, XÂY DỰNG VÀ
                </span>
                <span className="block lg:whitespace-nowrap">CẢI TẠO TRỌN GÓI</span>
              </h1>
            </Reveal>

            <BuildingRule
              className="mt-2 max-w-[340px]"
              src="/images/services/rule-dark.png"
              delay={200}
            />

            <Reveal delay={320} from="left">
              <h2 className="mt-5 mb-4 max-w-[640px] text-base font-semibold">
                ĐÁP ỨNG ĐA DẠNG NHU CẦU CHO NHÀ Ở VÀ CÔNG TRÌNH THƯƠNG MẠI
              </h2>
              <p className="flex max-w-[640px] items-start gap-1.5 text-base leading-relaxed text-pretty">
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

          <div className="absolute top-[9%] right-[7.2%] aspect-[1387/1000] w-[49%] max-md:top-auto max-md:-right-12 max-md:bottom-0 max-md:w-[680px] max-md:origin-bottom-right max-md:scale-[.66]">
            {heroCards.map((card, index) => (
              <Reveal
                className={`absolute w-[31.5%] hover:z-50 ${cardPositions[index]}`}
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
          <BuildingRule
            className="mx-auto mt-4 max-w-[330px]"
            src="/images/services/rule-orange.png"
            delay={320}
          />
        </div>
        <ProcessAccordion />
      </section>

      {/* Ảnh trái chạm đáy section, panel xám lệch xuống 30px và thò qua phần
          liên hệ bên dưới. Phía trên đỉnh panel (bên phải đường cong của ảnh)
          để trắng, đúng bản thiết kế. Panel thụt sang trái 14px chui dưới ảnh
          để mép cong chạm đúng góc trên-trái của panel, không hở nêm trắng:
          14 = R - √(R² - (R - lệch)²) với R = 72, lệch = 30. */}
      <section className="grid lg:grid-cols-2">
        <Reveal
          className="relative z-20 min-h-[280px] overflow-hidden rounded-tr-[54px] lg:min-h-[480px] lg:rounded-tr-[72px]"
          from="left"
        >
          <Image
            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
            src="/images/services/faq-photo.webp"
            alt="Góc thư giãn trong công trình do BMT Decor thực hiện"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>
        <div className="relative z-10 bg-neutral-100 px-5 py-14 lg:mt-[30px] lg:-mb-[30px] lg:-ml-[14px] lg:rounded-tr-[83px] lg:rounded-bl-[30px] lg:pt-8 lg:pr-[8%] lg:pb-12 lg:pl-[5.5%]">
          <Reveal>
            <h2 className="text-4xl font-normal">CÁC CÂU HỎI THƯỜNG GẶP</h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-4 max-w-[440px] text-sm leading-relaxed text-pretty">
              Giải đáp những thắc mắc phổ biến giúp khách hàng hiểu rõ hơn về
              quy trình và dịch vụ của BMT Decor
            </p>
          </Reveal>
          <BuildingRule
            className="mt-3 mb-[72px] max-w-[330px]"
            src="/images/services/rule-orange.png"
            delay={320}
          />
          <FaqAccordion />
        </div>
      </section>

      <ContactForm />
      <SiteFooter />
    </div>
  );
}
