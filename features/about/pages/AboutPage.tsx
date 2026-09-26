"use client";

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
import type { AboutPublicData } from "@/features/about/types/about-public";
import { useSiteSettings } from "@/shared/site-settings/SiteSettingsProvider";

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
export function AboutPage({ data }: { data: AboutPublicData }) {
  const { settings: siteSettings } = useSiteSettings();


  const partnerTitle = siteSettings?.partners.title ?? "";
  const partnerItems =
    siteSettings?.partners.items
      .filter((item) => item.name && item.logoImage)
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        name: item.name as string,
        image: item.logoImage as string,
      })) ?? [];

  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden" data-scroll-snap-page>
        <AboutHero content={data.hero} />
        <JourneyTimeline content={data.journey} />
        <VisionMissionValues
          visionMission={data.visionMission}
          coreValues={data.coreValues}
        />

        <CapabilitiesSection content={data.capabilities} />

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
                {partnerTitle && (
                  <SectionHeadingPartNer title={partnerTitle} />
                )}
                <Reveal delay={120}>
                  <PartnerMarquee partners={partnerItems} />
                </Reveal>
              </div>
            </section>
          </div>
        </section>

        <ContactForm
          showTopNotch
          title={data.contactForm.title}
          description={data.contactForm.description}
          successMessage={data.contactForm.successMessage}
          submitToApi
        />
      </main>
      <SiteFooter showTopBorder={false} />
    </>
  );
}
