import { ServiceShowcase } from "@/features/home/components/ServiceShowcase";
import { homeSectionContent } from "@/features/home/data/home-content";
import { BuildingRule } from "@/shared/components/BuildingRule";
import { Reveal } from "@/shared/components/Reveal";

function ServiceSectionHeading() {
  return (
    <div className="text-center">
      <Reveal>
        <h2 className="text-4xl font-extrabold uppercase tracking-[-0.035em] max-sm:text-[30px] max-sm:leading-tight sm:text-5xl">
          {homeSectionContent.featuredServices.title}
        </h2>
      </Reveal>
      <Reveal delay={140}>
        <p className="mx-auto mt-3 max-w-2xl text-xl leading-relaxed text-muted-foreground max-sm:text-sm">
          {homeSectionContent.featuredServices.description}
        </p>
      </Reveal>
      <BuildingRule
        className="mx-auto mt-4 max-w-72 text-brand max-sm:mt-2 max-sm:max-w-[200px]"
        delay={300}
      />
    </div>
  );
}

export function FeaturedServicesSection() {
  return (
    <section className="relative overflow-hidden py-16 max-sm:bg-white">
      <div
        className="pointer-events-none absolute inset-0 bg-top bg-repeat-y opacity-35 mix-blend-multiply max-sm:hidden"
        style={{
          backgroundImage: "url('/images/home/blueprint-background.png')",
          backgroundSize: "1922px 440px",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto w-[min(1200px,calc(100%-2.25rem))]">
        <ServiceSectionHeading />
        <ServiceShowcase />
      </div>
    </section>
  );
}
