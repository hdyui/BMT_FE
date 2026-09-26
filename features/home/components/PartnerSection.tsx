"use client";

import { PartnerMarquee } from "@/shared/components/layout/PartnerMarquee";
import { BuildingRule } from "@/shared/components/BuildingRule";
import { Reveal } from "@/shared/components/Reveal";
import { useSiteSettings } from "@/shared/site-settings/SiteSettingsProvider";

export function PartnerSection({ className = "" }: { className?: string }) {
  const { settings } = useSiteSettings();
  const title = settings?.partners.title ?? "";
  const partners =
    settings?.partners.items
      .filter((item) => item.name && item.logoImage)
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        name: item.name as string,
        image: item.logoImage as string,
      })) ?? [];

  if (!title && partners.length === 0) return null;

  return (
    <section className={`py-14 max-sm:pt-10 max-sm:pb-4 ${className}`}>
      <div className="mx-auto w-[min(1200px,calc(100%-2.25rem))]">
        <Reveal className="text-center">
          {title && (
            <h2 className="text-4xl font-extrabold uppercase tracking-[-0.035em] sm:text-5xl max-sm:text-[26px] max-sm:leading-none">
              {title}
            </h2>
          )}
          <BuildingRule className="mx-auto mt-4 max-w-72 text-brand max-sm:mt-2 max-sm:max-w-[200px]" />
        </Reveal>
        <Reveal delay={120}>
          <PartnerMarquee partners={partners} />
        </Reveal>
      </div>
    </section>
  );
}
