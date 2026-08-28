import Image from "next/image";
import { AboutHero } from "@/features/about/components/AboutHero";
import { CapabilitiesSection } from "@/features/about/components/CapabilitiesSection";
import { JourneyTimeline } from "@/features/about/components/JourneyTimeline";
import { VisionMissionValues } from "@/features/about/components/VisionMissionValues";
import { PartnerSection } from "@/features/home/components/PartnerSection";
import { PartnerMarquee } from "@/shared/components/layout/PartnerMarquee";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";
import { BuildingRule } from "@/shared/components/BuildingRule";
import { ContactForm } from "@/shared/components/ContactForm";
import { Reveal } from "@/shared/components/Reveal";

const imageRoot = "/images/about/source";

function SectionHeadingPartNer({
  title,
  copy,
}: {
  title: string;
  copy?: string;
}) {
  return (
    <Reveal className="text-center">
      <h2 className="text-4xl font-extrabold tracking-[-0.035em] uppercase sm:text-5xl">
        {title}
      </h2>
      {copy && (
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">
          {copy}
        </p>
      )}
      <BuildingRule className="mx-auto mt-4 max-w-72 text-brand" />
    </Reveal>
  );
}
export function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden" data-scroll-snap-page>
        <AboutHero />
        <JourneyTimeline />
        <VisionMissionValues />
        <section className="hidden relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-white lg:min-h-[720px]">
          <Image
            className="-z-20 object-cover object-[62%_center]"
            src={`${imageRoot}/hero-interior.png`}
            alt="Không gian nội thất phòng ăn hiện đại do BMT Decor thiết kế"
            fill
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,.98)_34%,rgba(255,255,255,.78)_48%,rgba(255,255,255,.08)_70%)] max-lg:bg-[linear-gradient(90deg,rgba(255,255,255,.98)_0%,rgba(255,255,255,.9)_58%,rgba(255,255,255,.32)_100%)]"
            aria-hidden="true"
          />

          <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-[min(1380px,calc(100%-2.25rem))] items-center py-16 lg:min-h-[720px]">
            <Reveal className="w-full max-w-[610px]" from="left">
              <p className="text-lg font-medium uppercase tracking-[0.02em] text-charcoal underline decoration-1 underline-offset-8 sm:text-xl">
                Về chúng tôi
              </p>
              <h1 className="mt-10 max-w-[590px] text-[clamp(2.75rem,5vw,5.15rem)] font-bold uppercase leading-[0.98] tracking-[-0.035em] text-brand">
                Kiến tạo giá trị từ mỗi không gian
              </h1>
              <BuildingRule className="mt-8 h-8 max-w-[410px] brightness-0" />
              <p className="mt-7 max-w-[570px] text-base leading-7 text-neutral-800 sm:text-lg sm:leading-8">
                BMT Decor là đơn vị thiết kế kiến trúc, thiết kế nội thất, thi
                công xây dựng và cải tạo trọn gói. Với hơn 15 năm kinh nghiệm,
                chúng tôi đồng hành từ ý tưởng đến hiện thực, kiến tạo không
                gian hài hòa giữa công năng, thẩm mỹ và chất lượng bền vững.
              </p>
            </Reveal>
          </div>
        </section>

        <CapabilitiesSection />

        <PartnerSection className="sm:hidden mb-14" />

        <section className="relative hidden py-24 sm:block sm:py-28 lg:py-32">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -bottom-[2.342945vw] z-0 overflow-hidden bg-[#f6f6f6] lg:-bottom-[2.57vw]"
            aria-hidden="true"
          >
            <Image
              className="object-cover object-bottom opacity-55"
              src={`${imageRoot}/city-blueprint.png`}
              alt=""
              fill
              sizes="100vw"
            />
          </div>
          <div className="relative z-10 mx-auto w-[min(1280px,calc(100%-2.25rem))]">
            <section className="py-14">
              <div className="mx-auto w-[min(1200px,calc(100%-2.25rem))]">
                <SectionHeadingPartNer title="Đối tác của BMT Decor" />
                <Reveal delay={120}>
                  <PartnerMarquee />
                </Reveal>
              </div>
            </section>
          </div>
        </section>

        <ContactForm showTopNotch />
      </main>
      <SiteFooter showTopBorder={false} />
    </>
  );
}
