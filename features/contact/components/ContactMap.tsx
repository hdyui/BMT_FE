import { Reveal } from "@/shared/components/Reveal";

export const defaultContactMapContent = {
  title: "Bản đồ văn phòng BMT Decor tại 7/92 Thành Thái, TP.HCM",
  googleMapsUrl:
    "https://www.google.com/maps?q=7%2F92%20Th%C3%A0nh%20Th%C3%A1i%2C%20Ph%C6%B0%E1%BB%9Dng%20Di%C3%AAn%20H%E1%BB%93ng%2C%20TP.HCM&output=embed",
};

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
      </section>
    </Reveal>
  );
}
