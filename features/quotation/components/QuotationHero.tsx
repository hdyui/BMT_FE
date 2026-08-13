import Image from "next/image";
import Link from "next/link";
import styles from "@/features/quotation/quotation.module.css";

/**
 * Banner trang báo giá.
 *
 * Trước đây toàn bộ kích thước nằm trong quotation.module.css bằng px cứng nên
 * chỉ đúng ở một khổ màn hình. Nay chuyển hết sang Tailwind, giữ NGUYÊN ba mốc
 * của bản cũ: mobile (<768px), tablet (768–1199px) và desktop (>=1200px, viết
 * bằng biến thể `min-[75rem]:`) — nên bản desktop không đổi một pixel nào.
 */

/** Lớp trang trí bị ẩn ở dải tablet, giống hệt media query cũ. */
const DESKTOP_ONLY = "md:hidden min-[75rem]:block";

const decorativeLayers = [
  [
    "/images/bao-gia/decor-01.jpg",
    `bottom-0 left-0 h-full w-[29.2%] object-fill ${DESKTOP_ONLY}`,
    3000,
    3476,
  ],
  [
    "/images/bao-gia/decor-03.jpg",
    `right-0 bottom-[2.2%] w-[28.6%] ${DESKTOP_ONLY}`,
    2289,
    330,
  ],
  [
    "/images/bao-gia/decor-02.jpg",
    `right-[31.2%] bottom-[7%] w-[1.7%] ${DESKTOP_ONLY}`,
    137,
    137,
  ],
  [
    "/images/bao-gia/decor-04.jpg",
    `right-[27.5%] bottom-[19.2%] w-[1.15%] ${DESKTOP_ONLY}`,
    92,
    92,
  ],
  ["/images/bao-gia/decor-08.jpg", "top-[1.3%] right-[6%] w-[9.1%]", 716, 679],
  ["/images/bao-gia/decor-09.jpg", "top-[21%] right-[3.5%] w-[2.3%]", 183, 183],
  ["/images/bao-gia/decor-10.jpg", "top-[31%] right-[5.2%] w-[6.2%]", 453, 298],
  [
    "/images/bao-gia/decor-11.jpg",
    "right-[28.8%] bottom-[12.5%] w-[2.7%]",
    214,
    214,
  ],
  [
    "/images/bao-gia/decor-12.jpg",
    "bottom-[2.7%] left-[43.5%] w-[5.7%]",
    325,
    278,
  ],
  ["/images/bao-gia/decor-13.jpg", "top-[18%] left-[4.3%] w-[1.5%]", 120, 343],
] as const;

const DECORATION_CLASS =
  "absolute z-[1] object-contain mix-blend-multiply";

export function QuotationHero() {
  return (
    <section
      className="relative overflow-hidden bg-white pt-[min(62vw,19.375rem)] md:mt-[5.3125rem] md:min-h-[35.125rem] md:bg-[#f6f6f6] md:pt-0"
      aria-labelledby="quotation-title"
    >
      <div className="absolute inset-0 max-md:hidden" aria-hidden="true">
        {/* Nền gradient: chỉ có ở mobile và desktop, dải tablet dùng decor-14. */}
        <Image
          className={`z-0 object-cover ${DESKTOP_ONLY}`}
          src="/images/bao-gia/decor-06.jpg"
          alt=""
          fill
          sizes="100vw"
        />
        <Image
          className="z-0 hidden object-cover md:block min-[75rem]:hidden"
          src="/images/bao-gia/decor-14.jpg"
          alt=""
          fill
          sizes="100vw"
        />
        {decorativeLayers.map(([src, position, width, height], index) => (
          <Image
            key={`${src}-${index}`}
            className={`${DECORATION_CLASS} ${position} ${styles.animFade}`}
            src={src}
            alt=""
            width={width}
            height={height}
            style={{ animationDelay: `${180 + index * 90}ms` }}
          />
        ))}
        <Image
          className={`${DECORATION_CLASS} bottom-[9.5%] left-[4.3%] w-[1.5%] ${styles.animFade}`}
          src="/images/bao-gia/decor-13.jpg"
          alt=""
          width={120}
          height={343}
          style={{ animationDelay: "1170ms" }}
        />
        <div
          className={`absolute top-[12.5%] left-[8.8%] z-[3] h-[26.75rem] w-[calc(38.2%_-_64px)] overflow-hidden rounded-[1.625rem] border-[10px] border-white shadow-[0_18px_40px_rgb(36_33_34/.18),0_0_28px_rgb(36_33_34/.12)] min-[75rem]:w-[calc(37.6%_-_64px)] ${styles.heroPhotoFrame} ${styles.animPhotoFrame}`}
        >
          <div className="relative size-full overflow-hidden">
            <Image
              className={`object-cover ${styles.animPhotoZoom}`}
              src="/images/bao-gia/decor-07.jpg"
              alt="Kiến trúc sư BMT Decor đang tính toán phương án thiết kế"
              fill
              sizes="(max-width: 1199px) 42vw, 34vw"
            />
          </div>
        </div>
      </div>

      {/* Ảnh mobile: neo trên đỉnh, cao đúng phần padding-top của section. */}
      <Image
        className="absolute inset-x-0 top-0 bottom-auto !h-[min(62vw,19.375rem)] object-cover object-left md:hidden"
        src="/images/bao-gia/decor-18.jpg"
        alt="Kiến trúc sư BMT Decor đang tính toán phương án thiết kế"
        fill
        sizes="100vw"
      />

      <div className="relative z-[5] mx-auto w-[calc(100%-2rem)] pt-7 pb-[2.375rem] pl-3.5 md:mx-0 md:ml-[47%] md:w-[49%] md:px-0 md:pt-22 md:pb-0 min-[75rem]:ml-[46.4%] min-[75rem]:w-[min(38.75rem,44.5%)]">
        <Image
          className="absolute top-[1.875rem] left-0 h-55 w-0.5 object-cover object-center md:top-[5.6875rem] md:left-[-1.25rem] md:h-[21.875rem]"
          src="/images/bao-gia/decor-15.jpg"
          alt=""
          width={9}
          height={1997}
        />
        <p
          className={`mb-2 text-lg leading-[1.08] md:mb-3 md:text-[clamp(1.375rem,2.05vw,2.1875rem)] ${styles.animUp}`}
          style={{ animationDelay: "300ms" }}
        >
          BÁO GIÁ DỊCH VỤ BMT DECOR
        </p>
        <h1
          id="quotation-title"
          className={`m-0 text-[clamp(2.25rem,11.2vw,3.1875rem)] leading-[1.06] font-extrabold tracking-[-0.035em] md:text-[clamp(2.375rem,5.2vw,3.25rem)] min-[75rem]:text-[clamp(2.625rem,4.2vw,4.125rem)] ${styles.animUp}`}
          style={{ animationDelay: "390ms" }}
        >
          MINH BẠCH VÀ
          <br />
          TỐI ƯU CHI PHÍ
        </h1>
        <p
          className={`m-0 mt-4 max-w-[36.875rem] text-[0.8125rem] leading-[1.22] mix-blend-multiply md:mt-5 md:text-xs md:leading-[1.55] min-[75rem]:text-sm ${styles.animFromRight}`}
        >
          <Image
            className="mr-1.5 mb-0.5 inline-block h-[1.0625rem] w-4 object-contain align-middle"
            src="/images/bao-gia/dong goi trang bao gia web BMT decor-16.png"
            alt=""
            width={86}
            height={90}
          />
          Tham khảo báo giá các dịch vụ thiết kế kiến trúc &amp; nội thất,
          thiết kế thi công, xây nhà trọn gói, thi công nội &amp; ngoại thất,
          cải tạo và sửa chữa nhà. Mỗi phương án được tư vấn và báo giá chi
          tiết theo nhu cầu thực tế, giúp khách hàng tối ưu ngân sách.
        </p>
        <Link
          className={`relative mt-3.5 grid h-[2.875rem] w-[12.8125rem] place-items-center overflow-hidden rounded-full text-white transition-[transform,filter] duration-[260ms] ease-out hover:-translate-y-1 hover:brightness-[1.08] hover:drop-shadow-[0_12px_15px_rgb(159_77_24/.24)] md:mt-5 md:h-13 md:w-59 ${styles.animCtaFade}`}
          href="/lien-he"
        >
          <Image
            className="z-[-1] object-cover"
            src="/images/bao-gia/decor-17.jpg"
            alt=""
            fill
            sizes="240px"
          />
          <span className="mr-8 text-[1.0625rem] font-extrabold md:text-xl">
            LIÊN HỆ NGAY
          </span>
        </Link>
      </div>
    </section>
  );
}
