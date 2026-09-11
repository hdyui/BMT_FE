import { Reveal } from "@/shared/components/Reveal";

export const defaultContactMapContent = {
  title: "Bản đồ văn phòng BMT Decor tại 7/92 Thành Thái, TP.HCM",
  googleMapsUrl:
    "https://www.google.com/maps?q=10.7690413%2C106.6658361&z=18&iwloc=0&output=embed",
};

const contactMapAddress = {
  short: "7/92 Thành Thái",
  full: "7/92 Thành Thái, Diên Hồng, Hồ Chí Minh, Việt Nam",
} as const;

export function ContactMap({ content = defaultContactMapContent }: { content?: typeof defaultContactMapContent }) {
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
        <div className="pointer-events-none absolute top-4 left-4 z-10 max-w-[calc(100%-2rem)] bg-white px-4 py-3 text-charcoal shadow-[0_2px_8px_rgb(0_0_0/.2)] sm:top-6 sm:left-6 sm:max-w-md sm:px-5 sm:py-4">
          <p className="text-base font-bold sm:text-lg">
            {contactMapAddress.short}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-neutral-600 sm:text-sm">
            {contactMapAddress.full}
          </p>
        </div>
      </section>
    </Reveal>
  );
}
