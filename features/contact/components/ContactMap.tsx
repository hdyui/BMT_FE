import { Reveal } from "@/shared/components/Reveal";
import styles from "./ContactMap.module.css";

export const defaultContactMapContent = {
  title: "Bản đồ văn phòng BMT Decor tại 7/92 Thành Thái, TP.HCM",
  googleMapsUrl:
    "https://www.google.com/maps?q=7%2F92%20Th%C3%A0nh%20Th%C3%A1i%2C%20Ph%C6%B0%E1%BB%9Dng%20Di%C3%AAn%20H%E1%BB%93ng%2C%20TP.HCM&output=embed",
};

export function ContactMap({ content = defaultContactMapContent }: { content?: typeof defaultContactMapContent }) {
  return (
    <Reveal className={styles.reveal} from="left">
      <section className={styles.section} aria-labelledby="contact-map-title">
        <h2 className="sr-only" id="contact-map-title">
          {content.title}
        </h2>
        <iframe
          className={styles.map}
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
