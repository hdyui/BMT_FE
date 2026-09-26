"use client";

import { Reveal } from "@/shared/components/Reveal";
import { useSiteSettings } from "@/shared/site-settings/SiteSettingsProvider";
import type { ContactMapContent } from "@/features/contact/types/contact-public";

export function ContactMap({ content }: { content: ContactMapContent }) {
  const { settings } = useSiteSettings();
  const officeAddress = settings?.footer.officeAddress ?? "";

  if (!content.googleMapsUrl) return null;

  return (
    <Reveal className="w-full overflow-hidden bg-[#e9e5dc]" from="left">
      <section
        className="relative aspect-[3.46/1] w-full overflow-hidden bg-[#e9e5dc] max-[55rem]:aspect-[1.7/1] max-[34rem]:aspect-[1.42/1]"
        aria-labelledby="contact-map-title"
      >
        <h2 className="sr-only" id="contact-map-title">
          {content.title}
        </h2>
        <iframe
          className="block h-full w-full border-0 [filter:saturate(.72)_contrast(.94)_brightness(1.04)] [touch-action:auto] pointer-events-auto"
          src={content.googleMapsUrl}
          title={content.title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        {officeAddress && (
          <div className="pointer-events-none absolute top-4 left-4 z-10 max-w-[calc(100%-2rem)] bg-white px-4 py-3 text-charcoal shadow-[0_2px_8px_rgb(0_0_0/.2)] sm:top-6 sm:left-6 sm:max-w-md sm:px-5 sm:py-4">
            <p className="text-xs leading-relaxed text-neutral-600 sm:text-sm">
              {officeAddress}
            </p>
          </div>
        )}
      </section>
    </Reveal>
  );
}
