import Image from "next/image";
import { BmtCta } from "@/shared/components/BmtCta";
import styles from "./ContactHero.module.css";

const heroDecorations = [
  { src: "/images/contact/decorations/transparent/decor-01.png", className: styles.topGroup, delay: "80ms" },
  { src: "/images/contact/decorations/transparent/decor-02.png", className: styles.topDots, delay: "160ms" },
  { src: "/images/contact/decorations/transparent/decor-03.png", className: styles.leftOutline, delay: "240ms" },
  { src: "/images/contact/decorations/transparent/decor-08.png", className: styles.rightLines, delay: "320ms" },
  { src: "/images/contact/decorations/transparent/decor-04.png", className: styles.leftDots, delay: "400ms" },
  { src: "/images/contact/decorations/transparent/decor-09.png", className: styles.rightHalfCircle, delay: "480ms" },
  { src: "/images/contact/decorations/transparent/decor-10.png", className: styles.rightDots, delay: "560ms" },
  { src: "/images/contact/decorations/transparent/decor-11.png", className: styles.bottomComposite, delay: "640ms" },
] as const;

export const defaultContactHeroContent = {
  title: "LIÊN HỆ NGAY",
  description: "Hãy chia sẻ nhu cầu về thiết kế kiến trúc, thiết kế nội thất, xây dựng, cải tạo hoặc sửa chữa nhà để đội ngũ BMT Decor tư vấn giải pháp phù hợp với không gian và ngân sách của bạn.",
  ctaLabel: "LIÊN HỆ NGAY",
  ctaHref: "#contact-form",
  photo: "/images/contact/contact-consultant.jpg",
  photoAlt: "Tư vấn viên BMT Decor hỗ trợ khách hàng về thiết kế và thi công",
};

export function ContactHero({ content = defaultContactHeroContent }: { content?: typeof defaultContactHeroContent }) {
  return (
    <section className={styles.hero} aria-labelledby="contact-hero-title">
      <div className={styles.heroCanvas}>
        <Image
          className={styles.mobileArtwork}
          src="/images/contact/mobile/hero-artwork.png"
          alt=""
          width={3884}
          height={5972}
          preload
          sizes="(max-width: 880px) min(100vw, 640px), 1px"
          aria-hidden="true"
        />
        <Image
          className={styles.backgroundTexture}
          src="/images/contact/decorations/hero-background.jpg"
          alt=""
          fill
          preload
          sizes="100vw"
          aria-hidden="true"
        />

        <div className={styles.decorations} aria-hidden="true">
          {heroDecorations.map((decoration) => (
            <span
              className={`${styles.decoration} ${decoration.className}`}
              style={{ animationDelay: decoration.delay }}
              key={decoration.src}
            >
              <Image src={decoration.src} alt="" fill sizes="20vw" unoptimized />
            </span>
          ))}
        </div>

        <div className={styles.inner}>
          <div className={styles.copy}>
            <h1 className={styles.title} id="contact-hero-title">
              <span>{content.title}</span>
              <Image
                className={styles.brandLogo}
                src="/images/contact/contact-wordmark-transparent.png"
                alt="BMT Decor"
                width={1649}
                height={287}
                unoptimized
              />
              <Image className={styles.mobileBrandLogo} src="/images/contact/mobile/brand-wordmark.png" alt="BMT Decor" width={1230} height={214} sizes="(max-width: 880px) 235px, 1px" />
              <Image className={styles.mobileTitleDivider} src="/images/contact/mobile/hero-title-divider.png" alt="" width={1388} height={128} sizes="(max-width: 880px) 240px, 1px" aria-hidden="true" />
            </h1>

            <p className={styles.description}>
              <Image
                className={styles.descriptionIcon}
                src="/images/home/building-mark.png"
                alt=""
                width={110}
                height={116}
                sizes="24px"
                aria-hidden="true"
              />
              <Image className={styles.mobileDescriptionIcon} src="/images/contact/mobile/description-icon.png" alt="" width={86} height={91} sizes="14px" aria-hidden="true" />
              {content.description}
            </p>

            <div className={styles.ctaSlot}>
              <BmtCta href={content.ctaHref}>{content.ctaLabel}</BmtCta>
            </div>
          </div>

        </div>
      </div>

      <div className={styles.photoBackdrop} aria-hidden="true" />

      <div className={styles.photoEntrance}>
        <div className={styles.photoFrame}>
          <Image
            className={styles.photo}
            src={content.photo}
            alt={content.photoAlt}
            fill
            preload
            unoptimized
            sizes="(min-width: 56rem) 44vw, min(92vw, 40rem)"
          />
        </div>
      </div>
    </section>
  );
}
