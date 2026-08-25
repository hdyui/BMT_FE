import { PartnerMarquee } from "@/lib/components/layout/PartnerMarquee";
import { homeSectionContent } from "@/features/home/data/home-content";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";

export function PartnerSection({ className = "" }: { className?: string }) {
  return (
    <section className={`py-14 max-sm:pt-10 max-sm:pb-4 ${className}`}>
      <div className="mx-auto w-[min(1200px,calc(100%-2.25rem))]">
        <Reveal className="text-center">
          <h2 className="text-4xl font-extrabold uppercase tracking-[-0.035em] sm:text-5xl max-sm:text-[26px] max-sm:leading-none">
            {homeSectionContent.partners.title}
          </h2>
          <BuildingRule className="mx-auto mt-4 max-w-72 text-brand max-sm:mt-2 max-sm:max-w-[200px]" />
        </Reveal>
        <Reveal delay={120}>
          <PartnerMarquee />
        </Reveal>
      </div>
    </section>
  );
}
