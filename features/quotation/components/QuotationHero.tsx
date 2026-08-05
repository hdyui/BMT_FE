import Image from "next/image";
import Link from "next/link";
import styles from "@/features/quotation/quotation.module.css";

const decorativeLayers = [
  ["/images/bao-gia/decor-01.jpg", styles.heroGrayLeft, 3000, 3476],
  ["/images/bao-gia/decor-03.jpg", styles.heroGrayPill, 2289, 330],
  ["/images/bao-gia/decor-02.jpg", styles.heroGraySquareBottom, 137, 137],
  ["/images/bao-gia/decor-04.jpg", styles.heroGraySquareMiddle, 92, 92],
  ["/images/bao-gia/decor-08.jpg", styles.heroOrangeLarge, 716, 679],
  ["/images/bao-gia/decor-09.jpg", styles.heroOrangeSmall, 183, 183],
  ["/images/bao-gia/decor-10.jpg", styles.heroDotsRight, 453, 298],
  ["/images/bao-gia/decor-11.jpg", styles.heroOrangeBottom, 214, 214],
  ["/images/bao-gia/decor-12.jpg", styles.heroDotsBottom, 325, 278],
  ["/images/bao-gia/decor-13.jpg", styles.heroDotsLeftTop, 120, 343],
] as const;

export function QuotationHero() {
  return (
    <section className={styles.hero} aria-labelledby="quotation-title">
      <svg width="0" height="0" aria-hidden="true">
        <filter
          id="quotation-remove-white"
          colorInterpolationFilters="sRGB"
        >
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -1 -1 -1 0 3"
            result="quotation-logo-mask"
          />
          <feFlood floodColor="#ef7b30" result="quotation-logo-orange" />
          <feComposite
            in="quotation-logo-orange"
            in2="quotation-logo-mask"
            operator="in"
          />
        </filter>
      </svg>
      <div className={styles.heroDesktopArt} aria-hidden="true">
        <Image
          className={styles.heroGradient}
          src="/images/bao-gia/decor-06.jpg"
          alt=""
          fill
          sizes="100vw"
          preload
        />
        <Image
          className={styles.heroTabletBase}
          src="/images/bao-gia/decor-14.jpg"
          alt=""
          fill
          sizes="100vw"
        />
        {decorativeLayers.map(([src, className, width, height], index) => (
          <Image
            key={src}
            className={`${className} ${styles.heroDecoration}`}
            src={src}
            alt=""
            width={width}
            height={height}
            style={{ animationDelay: `${180 + index * 90}ms` }}
          />
        ))}
        <Image
          className={`${styles.heroDotsLeftBottom} ${styles.heroDecoration}`}
          src="/images/bao-gia/decor-13.jpg"
          alt=""
          width={120}
          height={343}
          style={{ animationDelay: "1170ms" }}
        />
        <div className={styles.heroPhotoFrame}>
          <Image
            className={styles.heroPhoto}
            src="/images/bao-gia/decor-07.jpg"
            alt="Kiến trúc sư BMT Decor đang tính toán phương án thiết kế"
            fill
            sizes="(max-width: 1199px) 42vw, 34vw"
            preload
          />
        </div>
      </div>

      <Image
        className={styles.heroMobileArt}
        src="/images/bao-gia/decor-18.jpg"
        alt="Kiến trúc sư BMT Decor đang tính toán phương án thiết kế"
        fill
        sizes="100vw"
        preload
      />

      <div className={styles.heroCopy}>
        <Image
          className={styles.heroVerticalLine}
          src="/images/bao-gia/decor-15.jpg"
          alt=""
          width={9}
          height={1997}
        />
        <p className={styles.heroEyebrow}>BÁO GIÁ DỊCH VỤ BMT DECOR</p>
        <h1 id="quotation-title">
          MINH BẠCH VÀ
          <br />
          TỐI ƯU CHI PHÍ
        </h1>
        <div className={styles.heroDescription}>
          <Image
            src="/images/bao-gia/decor-16.jpg"
            alt=""
            width={86}
            height={90}
          />
          <p>
            Tham khảo báo giá các dịch vụ thiết kế kiến trúc &amp; nội thất,
            thiết kế thi công, xây nhà trọn gói, thi công nội &amp; ngoại thất,
            cải tạo và sửa chữa nhà. Mỗi phương án được tư vấn và báo giá chi
            tiết theo nhu cầu thực tế, giúp khách hàng tối ưu ngân sách.
          </p>
        </div>
        <Link className={styles.heroCta} href="/lien-he">
          <Image src="/images/bao-gia/decor-17.jpg" alt="" fill sizes="240px" />
          <span>LIÊN HỆ NGAY</span>
        </Link>
      </div>
    </section>
  );
}
