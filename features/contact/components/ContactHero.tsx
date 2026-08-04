import Image from "next/image";
import { ArrowUpRight, Building2 } from "lucide-react";
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

export function ContactHero() {
  return (
    <section className={styles.hero} aria-labelledby="contact-hero-title">
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
            <span>LIÊN HỆ NGAY</span>
            <span className={styles.brandLine}>
              <span className={styles.brandMark} aria-hidden="true">
                <Image
                  src="/images/contact/contact-logo-transparent.png"
                  alt=""
                  width={855}
                  height={923}
                  unoptimized
                />
              </span>
              <span>BMT DECOR</span>
            </span>
          </h1>

          <p className={styles.description}>
            <Building2 aria-hidden="true" />
            <span>
              Hãy chia sẻ nhu cầu về thiết kế kiến trúc, thiết kế nội thất, xây dựng,
              cải tạo hoặc sửa chữa nhà để đội ngũ BMT Decor tư vấn giải pháp phù hợp
              với không gian và ngân sách của bạn.
            </span>
          </p>

          <a className={styles.cta} href="#contact-form">
            <span>LIÊN HỆ NGAY</span>
            <span className={styles.ctaIcon} aria-hidden="true">
              <ArrowUpRight />
            </span>
          </a>
        </div>

        <div className={styles.photoEntrance}>
          <div className={styles.photoFrame}>
            <Image
              className={styles.photo}
              src="/images/contact/contact-consultant.jpg"
              alt="Tư vấn viên BMT Decor hỗ trợ khách hàng về thiết kế và thi công"
              fill
              preload
              unoptimized
              sizes="(min-width: 56rem) 44vw, min(92vw, 40rem)"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
