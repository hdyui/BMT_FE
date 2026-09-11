import Image from "next/image";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";
import { BuildingRule } from "@/shared/components/BuildingRule";
import { Reveal } from "@/shared/components/Reveal";
import { ContactForm } from "@/shared/components/ContactForm";

import { ProjectCarousel } from "@/features/services/components/ProjectCarousel";
import { SolutionCards } from "@/features/services/components/SolutionCards";
import { PillCtaButton } from "@/features/services/components/PillCtaButton";
import { ConstructionProcessList } from "@/features/services/components/ConstructionProcessList";
import { DiamondPhotoFrame } from "@/features/services/components/DiamondPhotoFrame";
import {
  ConstructionMobileHero,
  ConstructionMobileProcess,
} from "@/features/services/components/ConstructionMobileContent";
import {
  SERVICE_HERO_CLASS_NAME,
  SERVICE_PROJECT_CAROUSEL_CLASS_NAME,
  SERVICE_PROJECT_CTA_CLASS_NAME,
  SERVICE_PROJECT_HEADING_CLASS_NAME,
  SERVICE_PROJECT_SECTION_CLASS_NAME,
  SERVICE_SOLUTION_CARDS_CLASS_NAME,
  SERVICE_SOLUTION_HEADING_CLASS_NAME,
  SERVICE_SOLUTION_SECTION_CLASS_NAME,
} from "@/features/services/config/layout";

import {
  contactFormContent,
  featuredProjectCtaLabel,
  featuredProjects,
  solutionCards,
} from "@/features/services/data/construction";

// TOẠ ĐỘ ĐO TRỰC TIẾP TỪ MOCKUP `pic_thicong/banner-chuan.png` (1254 x 530).
//
// Cách đo: giải mã PNG, dựng mặt nạ pixel-ảnh-chụp, rồi lấy cực trị của (x+y) và
// (x-y) trên từng vùng. Hình vuông xoay 45° là tập điểm |x-xc| + |y-yc| <= d,
// nên cạnh của nó luôn nằm trên hai họ đường đó; hai cạnh không bị che là đủ suy
// ra tâm và d. Phải đo kiểu này vì mockup có menu dropdown che một phần cụm.
// Số đo (px trên mockup) -> % ở dưới:
//   top    tâm (294,  49) d=234      right  tâm (613, 181) d=142
//   left   tâm ( 93, 308) d=148      bottom tâm (482, 382) d=144
//
// `left` là % BỀ RỘNG banner, `top`/`size` là % CHIỀU CAO banner (khối chứa đã
// được cho trùng khít banner). `size` là cạnh hình vuông trước khi xoay, nên
// size = d / 0.7071.
//
// Mockup quy định, đừng "sửa cho đẹp" nếu chưa đối chiếu lại ảnh:
//   - hình top CỐ TÌNH cắm lên quá cạnh trên (đỉnh ở y=-185px) và chui sau header
//   - mép phải cụm dừng đúng ở x=755 = 60,2%, sát thanh cam của khối chữ
//
// Ba hình còn lại được GIẢI LẠI từ mốc là hình top, để bốn khe hở bằng nhau
// đúng 42px (ở 1440px) và thoả hai điều kiện biên: hình bottom chìm 6,5% dưới
// cạnh đáy banner, hình left thò ra khỏi cạnh trái 10% bề ngang của nó. Cách
// giải: đặt A=B=C=D rồi rút ra toạ độ — chi tiết ở phần trên. Sửa lẻ MỘT số sẽ
// làm lệch hai khe kề nó, phải giải lại cả cụm.
//
// ẢNH: 4 file `hero-diamond-*.webp` được CẮT RA TỪ CHÍNH MOCKUP
// `pic_thicong/down-du/file PNG trang dich vu - thi cong xay dung-14.png` (8000x3468).
// Mỗi file là HỘP BAO của một hình kim cương trong mockup (vuông, cạnh 2d), nên
// khi DiamondPhotoFrame phóng ô ảnh lên √2 thì nội dung trùng khít khung 1:1 —
// không còn cảnh ảnh lệch/hở đỉnh như bốn file cũ (hero-top.jpg, right.png,
// leet.png, hero-bottom.jpg vốn là ảnh chữ nhật tỉ lệ bất kỳ).
// Tâm/nửa đường chéo đo trên mockup (px ảnh gốc):
//   top (1920,244) d=1660 | right (3926,1176) d=1022
//   left ( 743,2085) d=1071 | bottom (2784,2550) d=1218
// Đã lùi mép 4% và soi gương bù ba chỗ mockup thiếu dữ liệu: đỉnh trên hình top
// (nằm trên cạnh canvas), đỉnh trái hình left, đỉnh dưới hình bottom, và mép
// phải hình top (trong mockup bị cắt vát dọc ở x=3252).
const HERO_DIAMONDS = [
  {
    key: "top",
    src: "/images/thi-cong-xay-dung/hero-frame-top.webp",
    alt: "Thi công nhà hàng",
    // Hình lớn nhất cụm, cắm lên quá cạnh trên banner. `top` đã hạ 9,2% -> 15,8%
    // (xuống 40px) để hình hiện ra nhiều hơn: phần thấy được dưới header đi từ
    // 44,6% lên 52,1% chiều cao hình. Ba hình kia đã được giải lại theo, vì hạ
    // hình này xuống là bóp hai khe hở kề nó.
    left: "23.4%",
    top: "15.8%",
    size: "62.5%",
    zIndex: 10,
  },
  {
    key: "right",
    src: "/images/thi-cong-xay-dung/hero-frame-right.webp",
    alt: "Thi công thẩm mỹ viện",
    // Mép phải hình này là mép phải của cả cụm: 48,9% + 0.7071 x 37,9% x 0.423
    // = 60,2% bề rộng banner, dừng đúng ở thanh cam của khối chữ bên phải.
    left: "48.9%",
    top: "36.3%",
    size: "37.9%",
    zIndex: 20,
  },
  {
    key: "bottom",
    src: "/images/thi-cong-xay-dung/hero-frame-bottom.webp",
    alt: "Thi công nhà ở",
    // To hơn mockup (38,4% -> 44,6%) để chìm 6,5% dưới cạnh đáy banner:
    // đỉnh dưới ở 72,6% + 0.7071 x 44,6% = 104,1% chiều cao banner.
    left: "35.4%",
    top: "72.6%",
    size: "44.6%",
    zIndex: 40,
  },
  {
    key: "left",
    src: "/images/thi-cong-xay-dung/hero-frame-left.webp",
    alt: "Thi công văn phòng",
    // Thò ra ngoài cạnh trái banner đúng 10% bề ngang hình (mockup là 18,5%, đã
    // giảm theo yêu cầu): tâm 9,4% bề rộng, nửa đường chéo quy ra bề rộng 11,8%.
    left: "9.4%",
    top: "64.7%",
    size: "39.5%",
    zIndex: 30,
  },
] as const;

/**
 * Các lớp shadow thật do khách hàng xuất riêng từ artwork 8000x3468.
 *
 * Tọa độ dùng cùng hệ phần trăm với banner. Các lớp cast bám khung của bản cũ
 * được giữ nguyên; nhóm này chỉ thêm các diamond lớn ở nền được đánh dấu trong
 * mockup. Mỗi file giữ alpha gốc và được fade riêng, không ghép chung với ảnh.
 */
const HERO_DECORATIVE_SHADOWS = [
  {
    key: "top-left-field",
    src: "/images/thi-cong-xay-dung/hero-shadows/shadow-02.webp",
    left: "-12%",
    top: "-20%",
    width: "30%",
    opacity: 0.85,
  },
  // top-right-field (shadow-03.webp) — vệt bóng "xẹt xuống" ở góc phải trên đã
  // bỏ; thay bằng `title-diamond.png` phía trên tiêu đề (xem trong phần map).
  {
    key: "bottom-left-field",
    src: "/images/thi-cong-xay-dung/hero-shadows/shadow-07.webp",
    left: "-12%",
    top: "18%",
    width: "40%",
    opacity: 0.18,
  },
  {
    key: "bottom-right-field",
    src: "/images/thi-cong-xay-dung/hero-shadows/shadow-12.webp",
    left: "45%",
    top: "45%",
    width: "27%",
    opacity: 0.8,
  },
] as const;

/**
 * NHÓM 1 — các mảng nằm DƯỚI 4 ảnh.
 *
 * ĐO TRỰC TIẾP trên mockup `...xay dung-14.png`: quét độ sáng theo pháp tuyến ra
 * ngoài từng cạnh (chỉ lấy pixel trung tính, bỏ pixel ảnh chụp). Nền banner đo
 * được 242. Bảng độ TỐI so với nền, ngay sát mép (khoảng cách 1..5px ở thang
 * ảnh rộng 2000):
 *
 *              U- trên-trái   U+ dưới-phải   V- trên-phải   V+ dưới-trái
 *   top        (ngoài canvas)  65 mềm ~150px  (ngoài canvas)  6 mờ đều
 *   right           4 sắc 16px      0              0              0
 *   left           21 sắc 19px     70 mềm ~120px   8             16 sắc 20px
 *   bottom     33 (bóng của left)   0              0             91 mềm ~100px
 *
 * => mockup có HAI loại mảng khác hẳn nhau, đừng gộp làm một:
 *
 *   a) BÓNG MỀM (`*-cast`) — tấm nền cùng hình, dời đi rồi làm nhoè. `top` và
 *      `left` hắt về +U (xuống-phải), `bottom` hắt về +V (xuống-trái), `right`
 *      KHÔNG có (bốn cạnh của nó đo ra đúng 242 phẳng lì).
 *      Độ dời và độ nhoè suy ngược từ đường cong đo được: coi mảng nhoè là hàm
 *      Φ((o-x)/σ) rồi khớp 3 điểm — ra o và σ ở bảng dưới.
 *
 *   b) VIỀN SẮC (`*-edge`) — tấm nền KHÔNG nhoè, chỉ dời đi vài % nên ló ra một
 *      dải mép rõ nét. Chỉ `left` (dời sang TRÁI nên ló ở cả hai cạnh trái) và
 *      `right` (dời chéo lên-trái nên chỉ ló ở cạnh trên-trái) mới có.
 *      Nhoè nhóm này là mất hẳn cái nét mockup có.
 *
 * `dx`/`dy` tính theo % KÍCH THƯỚC CHÍNH NÓ (khối vuông) chứ không theo % banner
 * — lấy % banner thì 1% ngang dài gấp 2,4 lần 1% dọc, viền sẽ dày mỏng không đều
 * giữa hai cạnh. `blur` để bằng vw vì cụm hình co giãn theo bề ngang viewport ở
 * mọi khổ màn, dùng rem thì màn nhỏ bóng sẽ nhoè quá tay.
 *
 * `from` trỏ tới hình trong HERO_DIAMONDS nên mảng tự bám theo, dời hình là nó
 * đi theo.
 */
const HERO_BACKDROPS = [
  // VIỀN SẮC — tấm nền KHÔNG nhoè, dời NGANG sang trái 20px (thang 2000) nên ló
  // ~20px ở CẢ HAI cạnh trái (U- và V+). Vẽ SAU quầng chung. Theo yêu cầu: cả
  // 4 hình dùng CHUNG một kiểu viền như hình "văn phòng" (dx -7.5%, dy 0,
  // không blur, tone #dedee1) — chỗ nào bị hình khác đè thì tự khuất.
  {
    key: "top-edge",
    from: "top",
    dx: "-7.5%",
    dy: "0%",
    blur: "",
    tone: "bg-[#dedee1]",
  },
  {
    key: "right-edge",
    from: "right",
    dx: "-7.5%",
    dy: "0%",
    blur: "",
    tone: "bg-[#dedee1]",
  },
  {
    key: "bottom-edge",
    from: "bottom",
    dx: "-7.5%",
    dy: "0%",
    blur: "",
    tone: "bg-[#dedee1]",
  },
  {
    key: "left-edge",
    from: "left",
    dx: "-7.5%",
    dy: "0%",
    blur: "",
    tone: "bg-[#dedee1]",
  },
] as const;

const DIAMOND_BY_KEY = Object.fromEntries(
  HERO_DIAMONDS.map((diamond) => [diamond.key, diamond]),
);

export function ConstructionServicePage() {
  return (
    <div className="min-h-screen bg-white text-charcoal ">
      <SiteHeader />

      <ConstructionMobileHero />

      {/* SECTION 1: BANNER
          Tỉ lệ banner lấy đúng mockup `pic_thicong/banner-chuan.png`: 530/1254 =
          42,3vw, cao hơn token chung (38.9vw) một chút. Toạ độ cụm kim cương bên
          dưới được đo trên chính mockup đó nên chiều cao phải khớp, nếu không cụm
          sẽ lệch. `!` để thắng `lg:h-` của token chung. */}
      <section
        className={`${SERVICE_HERO_CLASS_NAME} max-md:hidden lg:!h-[clamp(38rem,42.3vw,51.5rem)]`}
      >
        <Reveal
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] lg:block"
          from="fade"
        >
          <Image
            className="object-cover object-right opacity-80"
            src="/images/thi-cong-xay-dung/hero-wireframe.png"
            alt=""
            fill
            sizes="38vw"
            priority
            aria-hidden="true"
          />
        </Reveal>

        {/* Từ lg khối này TRÙNG KHÍT banner (`inset-0`), không còn bị nhốt trong
            `w-[63.94%]` như trước — vì toạ độ trong HERO_DIAMONDS là % của cả
            banner, đo thẳng trên mockup. Chính chỗ nhốt bề rộng đó làm cụm chỉ
            với tới 50% bề rộng trong khi mockup cho nó tới 60%.

            Màn nhỏ giữ khung theo đúng tỉ lệ mockup (1254/530) để cách xếp 4 hình
            không đổi, chỉ nhỏ lại. */}
        <div className="relative mx-auto aspect-1254/530 w-full max-w-140 lg:absolute lg:inset-0 lg:mx-0 lg:aspect-auto lg:h-full lg:w-full lg:max-w-none">
          {/* Shadow PNG giữ alpha gốc và xuất hiện tuần tự, độc lập với bốn ảnh. */}
          {HERO_DECORATIVE_SHADOWS.map((shadow, index) => (
            <Reveal
              className="pointer-events-none absolute z-[2] aspect-square"
              delay={80 + index * 75}
              duration={650}
              from="fade"
              style={{
                left: shadow.left,
                top: shadow.top,
                width: shadow.width,
              }}
              key={shadow.key}
              aria-hidden="true"
            >
              <Image
                className="object-contain"
                src={shadow.src}
                alt=""
                fill
                sizes="50vw"
                style={{ opacity: shadow.opacity }}
                aria-hidden="true"
              />
            </Reveal>
          ))}

          {/* Bóng ở TRUNG TÂM cụm 4 hình kim cương (file khách cấp
              `hero-shadows/cluster-center.png`). `z-[2]` nên nằm SAU 4 ảnh,
              chỉ hiện ở khoảng trống giữa cụm. Núm: `left`/`top`/`w`/`h`. */}
          <Reveal
            className="pointer-events-none absolute top-[-5%] left-[-15%] z-[2] h-[97%] w-[78%]"
            delay={300}
            duration={750}
            from="fade"
            aria-hidden="true"
          >
            <Image
              className="object-contain mix-blend-multiply"
              src="/images/thi-cong-xay-dung/hero-shadows/cluster-center.png"
              alt=""
              fill
              sizes="46vw"
              aria-hidden="true"
            />
          </Reveal>

          {/* Bóng TRUNG TÂM cụm — lớp thứ 2 (file khách cấp
              `hero-shadows/cluster-center-2.png`). Núm: `left`/`top`/`w`/`h`. */}
          <Reveal
            className="pointer-events-none absolute top-[5%] left-[-8%] z-[2] h-[97%] w-[78%]"
            delay={450}
            duration={750}
            from="fade"
            aria-hidden="true"
          >
            <Image
              className="object-contain mix-blend-multiply [filter:brightness(.78)_contrast(1.55)]"
              src="/images/thi-cong-xay-dung/hero-shadows/cluster-center-2.png"
              alt=""
              fill
              sizes="46vw"
              aria-hidden="true"
            />
          </Reveal>

          {/* Bóng ở GÓC TRÁI của hình "bottom" (file khách cấp
              `hero-shadows/bottom-left-corner.png`). `z-[2]` nên nằm sau ảnh.
              Núm: `left`/`top`/`w`/`h`. */}
          <Reveal
            className="pointer-events-none absolute top-[20%] left-[-4%] z-[2] h-[74%] w-[62%] -rotate-90"
            delay={600}
            duration={750}
            from="fade"
            aria-hidden="true"
          >
            <Image
              className="object-contain mix-blend-multiply"
              src="/images/thi-cong-xay-dung/hero-shadows/bottom-left-corner.png"
              alt=""
              fill
              sizes="38vw"
              aria-hidden="true"
            />
          </Reveal>

          {/* Bóng ở GÓC TRÁI của banner (file khách cấp
              `hero-shadows/left-corner.png`). Núm: `left`/`top`/`w`/`h`. */}
          <Reveal
            className="pointer-events-none absolute top-[18%] left-[-24%] z-[2] h-[92%] w-[70%] rotate-90 opacity-40"
            delay={750}
            duration={750}
            from="fade"
            aria-hidden="true"
          >
            <Image
              className="object-contain mix-blend-multiply"
              src="/images/thi-cong-xay-dung/hero-shadows/left-corner.png"
              alt=""
              fill
              sizes="38vw"
              aria-hidden="true"
            />
          </Reveal>

          {/* Cùng file `bottom-left-corner.png` nhưng đặt ở BÊN PHẢI (lật ngang
              `-scale-x-100` cho phần đậm quay sang phải). Núm: `left`/`top`/`w`/`h`. */}
          <Reveal
            className="pointer-events-none absolute top-[2%] left-[-11%] z-[2] h-[82%] w-[74%] -scale-x-100 -rotate-45 opacity-40"
            delay={900}
            duration={750}
            from="fade"
            aria-hidden="true"
          >
            <Image
              className="object-contain mix-blend-multiply"
              src="/images/thi-cong-xay-dung/hero-shadows/bottom-left-corner.png"
              alt=""
              fill
              sizes="38vw"
              aria-hidden="true"
            />
          </Reveal>

          {/* Cục bóng nền phía trên tiêu đề — dùng file khách cấp
              (`hero-shadows/title-diamond.png`, mảng kim cương bo góc mờ dần).
              `z-[2]` nên nằm sau chữ (chữ ở `z-20`). Núm: `left`/`top` (vị trí),
              `w`/`h` (kích thước khung). */}
          <Reveal
            className="pointer-events-none absolute top-[-1%] left-[60%] z-[2] h-[40%] w-[30%]"
            delay={1050}
            duration={750}
            from="fade"
            aria-hidden="true"
          >
            <Image
              className="object-contain object-top mix-blend-multiply -scale-y-100"
              src="/images/thi-cong-xay-dung/hero-shadows/title-diamond.png"
              alt=""
              fill
              sizes="30vw"
              aria-hidden="true"
            />
          </Reveal>

          {/* Hai cục bóng cùng loại ở khoảng trống góc trái-dưới banner (theo ảnh
              `pic_thicong/same.jpg`). `z-[10]` để nổi lên trên nền + bản vẽ
              (dưới 4 ảnh kim cương z>=10 nên vẫn khuất sau ảnh, chỉ hiện ở
              khoảng trống). Núm mỗi cục: `left`/`top`/`w`/`h`. */}
          <Reveal
            className="pointer-events-none absolute top-[66%] left-[42%] z-[41] h-[40%] w-[25%] -rotate-90"
            delay={1200}
            duration={750}
            from="fade"
            aria-hidden="true"
          >
            <Image
              className="object-contain object-top mix-blend-multiply"
              src="/images/thi-cong-xay-dung/hero-shadows/title-diamond.png"
              alt=""
              fill
              sizes="34vw"
              aria-hidden="true"
            />
          </Reveal>
          <Reveal
            className="pointer-events-none absolute top-[90%] left-[38%] z-[41] h-[24%] w-[14%]"
            delay={1350}
            duration={750}
            from="fade"
            aria-hidden="true"
          >
            <Image
              className="object-contain object-top mix-blend-multiply"
              src="/images/thi-cong-xay-dung/hero-shadows/title-diamond.png"
              alt=""
              fill
              sizes="33vw"
              aria-hidden="true"
            />
          </Reveal>

          {/* Viền sắc bám cạnh trái của từng hình — vẽ trước 4 ảnh nên nằm dưới. */}
          {HERO_BACKDROPS.map((shadow, index) => {
            const base = DIAMOND_BY_KEY[shadow.from];
            return (
              <Reveal
                className="pointer-events-none absolute z-[1] aspect-square"
                delay={80 + index * 90}
                duration={650}
                from="fade"
                style={{
                  left: base.left,
                  top: base.top,
                  height: base.size,
                  transform: `translate(calc(-50% + ${shadow.dx}), calc(-50% + ${shadow.dy}))`,
                }}
                key={shadow.key}
                aria-hidden="true"
              >
                <div
                  className={`size-full rotate-45 rounded-[16%] ${shadow.tone} ${shadow.blur}`}
                />
              </Reveal>
            );
          })}

          {HERO_DIAMONDS.map((diamond, index) => (
            <DiamondPhotoFrame
              key={diamond.key}
              src={diamond.src}
              alt={diamond.alt}
              left={diamond.left}
              top={diamond.top}
              size={diamond.size}
              zIndex={diamond.zIndex}
              delay={index * 170}
            />
          ))}
        </div>

        <div className="relative z-20 px-6 pt-10 pb-14 lg:absolute lg:top-[44%] lg:left-[60.2%] lg:px-0 lg:pt-0 lg:pb-0">
          <div className="flex gap-4">
            <Reveal className="-my-1.5 shrink-0" from="fade">
              <Image
                className="h-full w-0.5 rounded-full object-fill sm:w-1"
                src="/images/thi-cong-xay-dung/accent-tick.png"
                alt=""
                width={25}
                height={840}
                aria-hidden="true"
              />
            </Reveal>

            <div className="flex flex-col">
              <Reveal from="bottom">
                {/* Đã cập nhật class font giống với DesignServicePage và giảm kích thước */}
                <h1 className="font-heading text-xl font-extrabold leading-[1.05] text-brand uppercase tracking-wide sm:text-[clamp(1.6rem,1.95vw,2.2rem)]">
                  Dịch Vụ Thi Công
                  <br />
                  Xây Dựng
                </h1>
              </Reveal>

              {/* Đường line đen: dùng chung pattern với 3 trang dịch vụ còn lại
                  (Full / Renovation / Design) — hộp w-28 + overflow-hidden cắt
                  lấy phần ĐUÔI của ảnh 1388x128 (ảnh neo `right-0` và rộng gấp
                  đôi hộp), nên chỉ hiện đoạn vạch ngắn kèm icon nhà.
                  BuildingRule trước đây kéo ảnh full 340px làm vạch dài hơn hẳn
                  3 trang kia. mt-4 + delay 220 khớp RenovationServicePage. */}
              <Reveal
                className="relative mt-4 h-[1.3rem] w-28 overflow-hidden"
                delay={220}
                from="fade"
              >
                <Image
                  className="absolute top-0 right-0 w-56 max-w-none"
                  src="/images/services/rule-dark.png"
                  alt=""
                  width={1388}
                  height={128}
                  aria-hidden="true"
                />
              </Reveal>

              <Reveal delay={380} from="left">
                <p className="mt-1 max-w-[19.375rem] text-pretty text-sm font-normal leading-snug text-charcoal sm:text-base">
                  Đồng Hành Kiến Tạo Công Trình
                  <br />
                  Bền Vững
                </p>
              </Reveal>
            </div>
          </div>

          {/* Hình chấm bi tách khỏi hàng flex chứa thanh cam, để thanh cam chỉ
              kéo dài tới hết đoạn text chứ không giãn xuống tới đây. `ml-` bù
              đúng bề rộng thanh cam (w-0.5/w-1) cộng `gap-4` để vẫn thẳng hàng
              với khối chữ bên trên. */}
          <Reveal delay={520} from="left">
            <Image
              className="mt-8 ml-[1.125rem] w-8 object-contain sm:ml-[1.25rem] sm:w-12 lg:mt-10 xl:mt-14"
              src="/images/thi-cong-xay-dung/dots-pattern.png"
              alt=""
              width={288}
              height={207}
              aria-hidden="true"
            />
          </Reveal>
        </div>
      </section>

      {/* SECTION 2: TỪ PHẦN THÔ ĐẾN HOÀN THIỆN */}
      <section
        className={`${SERVICE_PROJECT_SECTION_CLASS_NAME} relative isolate !py-12 max-md:!pt-8 max-md:!pb-3 lg:!py-16`}
      >
        <Image
          className="-z-10 object-cover"
          src="/images/thi-cong-xay-dung/carousel-background.png"
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
        />

        <div
          className={`${SERVICE_PROJECT_HEADING_CLASS_NAME} !mb-0 !pb-0 text-center px-4`}
        >
          <Reveal from="bottom">
            <h2 className="font-heading text-[clamp(1.12rem,4.75vw,1.55rem)] leading-[1.08] font-extrabold uppercase md:text-3xl lg:text-4xl text-center">
              THI CÔNG XÂY DỰNG TỪ PHẦN THÔ ĐẾN HOÀN THIỆN
            </h2>
          </Reveal>
          <Reveal delay={140} from="bottom">
            {/* Chỉ MOBILE đồng bộ với section 02 trang thiết kế kiến trúc nội
                thất (size + justify 2 lề, dòng cuối canh giữa). Desktop giữ
                nguyên: max-w-[73.75rem], text-center, text-sm. */}
            <p className="mx-auto mt-4 max-w-[73.75rem] text-pretty text-center text-sm leading-relaxed max-md:max-w-3xl max-md:text-justify max-md:[text-align-last:center] max-md:text-[0.82rem] max-md:leading-[1.3]">
              Thi công xây dựng là giai đoạn quyết định chất lượng và tuổi thọ
              của công trình. BMT Decor triển khai{" "}
              <strong className="font-normal lg:font-bold">
                xây dựng phần thô
              </strong>
              ,{" "}
              <strong className="font-normal lg:font-bold">
                thi công hoàn
                <br className="hidden lg:inline" /> thiện
              </strong>{" "}
              và các hạng mục xây dựng theo đúng hồ sơ kỹ thuật, đảm bảo quy
              trình thi công đồng bộ, kiểm soát chặt chẽ chất lượng vật liệu,
              <br className="hidden lg:inline" /> tiến độ và an toàn lao động.
              Mỗi công trình đều được giám sát xuyên suốt nhằm hạn chế phát sinh
              và đảm bảo chất lượng khi bàn giao.
            </p>
          </Reveal>
          <BuildingRule
            className="mx-auto mt-5 h-[clamp(1.25rem,4vw,2rem)] w-[45vw] max-w-none md:w-full md:max-w-62.5"
            src="/images/xay-dung-tron-goi/rule-orange.png"
            align="center"
            delay={300}
          />
        </div>

        <Reveal
          className={`${SERVICE_PROJECT_CAROUSEL_CLASS_NAME} !mt-8 max-md:!mt-4 lg:!mt-10 w-full`}
          delay={120}
          duration={850}
          from="bottom"
        >
          <ProjectCarousel
            projects={featuredProjects}
            prevIcon="/images/thi-cong-xay-dung/nav-prev.png"
            nextIcon="/images/thi-cong-xay-dung/nav-next.png"
            mobileMockup
            mobileInitialIndex={0}
          />
        </Reveal>

        <Reveal
          className={`${SERVICE_PROJECT_CTA_CLASS_NAME} !mt-8 max-md:!mt-3 lg:!mt-12 flex justify-center w-full`}
          delay={200}
          duration={800}
          from="bottom"
        >
          <PillCtaButton
            className="h-full max-md:[&>span:first-child]:!h-[clamp(2rem,7vw,2.75rem)]"
            href="#contact-form"
            label={featuredProjectCtaLabel}
            image="/images/thi-cong-xay-dung/btn-pill.png"
            imageWidth={1539}
            imageHeight={292}
            mobileImage="/images/thi-cong-xay-dung/mobile/btn-consult.png"
            mobileImageWidth={1539}
            mobileImageHeight={292}
            mobileTextCentered
            textClassName="!text-[clamp(0.8rem,3.2vw,1.25rem)] lg:!text-2xl"
          />
        </Reveal>
      </section>

      {/* SECTION 3: THEO LOẠI HÌNH CÔNG TRÌNH */}
      <section
        id="solution-cards"
        className={`bg-white ${SERVICE_SOLUTION_SECTION_CLASS_NAME} max-md:!pt-7 max-md:!pb-8`}
      >
        <div className={`${SERVICE_SOLUTION_HEADING_CLASS_NAME} max-md:!mb-4`}>
          <div className="text-center md:mb-12">
            <Reveal from="bottom">
              <h2 className="font-heading text-[clamp(1.05rem,4.55vw,1.5rem)] leading-[1.12] uppercase md:text-4xl md:leading-normal">
                <span className="font-normal">THI CÔNG XÂY DỰNG</span>
                <br />
                <span className="font-extrabold">
                  THEO TỪNG LOẠI HÌNH CÔNG TRÌNH
                </span>
              </h2>
            </Reveal>
            <Reveal delay={140} from="bottom">
              <p className="mx-auto mt-2 max-w-xl text-[clamp(0.72rem,2.9vw,0.86rem)] md:mt-4 md:text-sm md:leading-relaxed">
                Thi công đồng bộ, đảm bảo chất lượng và tiến độ
              </p>
            </Reveal>
            <Reveal delay={250} from="left">
              <BuildingRule
                className="mx-auto mt-3 h-[clamp(1.25rem,4vw,2rem)] w-[45vw] max-w-none md:mt-5 md:w-full md:max-w-62.5"
                src="/images/cai-tao-sua-chua/rule-orange-center.png"
                align="center"
              />
            </Reveal>
          </div>
        </div>

        <div className={SERVICE_SOLUTION_CARDS_CLASS_NAME}>
          <SolutionCards
            cards={solutionCards}
            checkIcon="/images/cai-tao-sua-chua/icon-house.png"
            ruleImage="/images/cai-tao-sua-chua/rule-short.png"
          />
        </div>
      </section>

      {/* SECTION 4: QUY TRÌNH THI CÔNG */}
      {/* Dưới lg, ContactForm luôn vẽ ảnh khấc `form-background.png` mà 2,3429%
          bề rộng trên cùng của ảnh là TRONG SUỐT (hàng đục hoàn toàn đầu tiên ở
          y=91/3884). Không kéo form lên thì dải trong suốt đó lộ nền trắng của
          trang chứ không phải nền xám của section này -> thấy vệt lệch màu.
          `-mb` kéo form đè lên đúng chiều cao khấc, `pb` cộng bù lại để khoảng
          trắng nhìn thấy không đổi. Đây là cách 3 trang dịch vụ kia đang làm.
          Chỉ áp dưới lg: từ lg trở lên trang này dùng ContactForm không notch
          (nền cam đặc, không trong suốt) nên không có vệt lệch. */}
      <section
        className="relative isolate scroll-mt-[85px] overflow-hidden bg-[#F2F2F3] py-16 max-lg:-mb-[2.342945vw] max-lg:pb-[calc(4rem+2.342945vw)] max-md:pt-12 max-md:pb-[calc(2rem+2.342945vw)]"
        id="construction-process"
      >
        <Image
          className="-z-10 object-cover"
          src="/images/thi-cong-xay-dung/process-background.png"
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="mx-auto mb-4 w-[calc(100%-2rem)] text-center md:hidden">
          <Reveal from="bottom">
            <h2 className="font-heading text-[clamp(0.95rem,4.75vw,1.55rem)] leading-none font-extrabold uppercase">
              QUY TRÌNH THI CÔNG XÂY DỰNG
            </h2>
          </Reveal>
          <Reveal delay={140} from="bottom">
            <p className="mx-auto mt-3 text-[clamp(0.78rem,2.72vw,1rem)] leading-relaxed">
              Triển khai bài bản, giám sát chặt chẽ trong từng giai đoạn
            </p>
          </Reveal>
          <Reveal delay={250} from="left">
            <BuildingRule
              // Không có h- thì BuildingRule giữ mặc định h-10 (40px) trong khi
              // ảnh 1388x128 co theo w-[36vw] chỉ cao ~13px -> thừa ~13px trống
              // ở CẢ trên lẫn dưới vạch. h-auto + đúng aspect ảnh cho hộp ôm sát.
              className="mx-auto mt-2 h-[clamp(1.25rem,4vw,2rem)] w-[45vw] max-w-none"
              src="/images/thi-cong-xay-dung/rule-orange-center.png"
            />
          </Reveal>
        </div>

        <ConstructionMobileProcess />

        <div className="hidden md:block">
          <div className="mx-auto mb-12 w-[min(790px,calc(100%-2.25rem))] text-center">
            <Reveal from="bottom">
              {/* font-extrabold cho khớp tiêu đề section cuối của DesignServicePage
                  (text-4xl font-extrabold) và FullConstructionServicePage — hai
                  trang đó đều extrabold, riêng trang này còn ở bold nên nét chữ
                  mảnh hơn hẳn. */}
              <h2 className="font-heading text-3xl font-extrabold uppercase sm:text-4xl">
                QUY TRÌNH THI CÔNG XÂY DỰNG
              </h2>
            </Reveal>
            <Reveal delay={140} from="bottom">
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed">
                Triển khai bài bản, giám sát chặt chẽ trong từng giai đoạn
              </p>
            </Reveal>
            <Reveal delay={250} from="left">
              {/* Không có h-/w- thì BuildingRule rơi về mặc định h-10 w-full
                  max-w-[430px] = 430x40px, to hơn hẳn hai vạch cam ở section 2
                  và 3 (250x32px). Khối này nằm trong `hidden md:block` nên chỉ
                  cần nhánh md+ của hai vạch kia: w-full max-w-62.5 + cùng thang
                  h-clamp. `align="center"` để ảnh "-center" neo giữa khung như
                  section 3, thay vì object-right mặc định. */}
              <BuildingRule
                className="mx-auto mt-5 h-[clamp(1.25rem,4vw,2rem)] w-full max-w-62.5"
                src="/images/thi-cong-xay-dung/rule-orange-center.png"
                align="center"
              />
            </Reveal>
          </div>

          <ConstructionProcessList />
        </div>
      </section>

      <ContactForm {...contactFormContent} />
      <SiteFooter />
    </div>
  );
}
