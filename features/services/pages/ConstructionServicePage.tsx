import Image from "next/image";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ContactForm } from "@/lib/components/shared/ContactForm";

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
  featuredProjects,
  solutionCards,
} from "@/features/services/data/thi-cong-xay-dung";

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
    src: "/images/thi-cong-xay-dung/hero-diamond-top.webp",
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
    src: "/images/thi-cong-xay-dung/hero-diamond-right.webp",
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
    src: "/images/thi-cong-xay-dung/hero-diamond-bottom.webp",
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
    src: "/images/thi-cong-xay-dung/hero-diamond-left.webp",
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
  // Quầng chung của cả cụm. Rất nhạt: nền quanh cụm đo được 235..237 ở vài cạnh,
  // tức chỉ tối hơn nền 5..7 đơn vị. Để đậm hơn là bốn cạnh sạch (right U+/V-,
  // bottom U+/V-, đo đúng 242 phẳng lì) bị đục đi, sai mockup ngay.
  {
    key: "cluster",
    left: "29.3%",
    top: "47.4%",
    size: "95%",
    dx: "0%",
    dy: "3%",
    blur: "blur-[5vw]",
    tone: "bg-[rgb(36_33_34/.015)]",
  },

  // VIỀN SẮC — tấm nền KHÔNG nhoè, dời đi vài % nên ló ra dải mép rõ nét.
  // Vẽ SAU quầng chung. Chỉ hai hình này có trong mockup.
  //   left: dời NGANG sang trái 20px (thang 2000) -> ló 20px ở CẢ HAI cạnh trái
  //         (U- và V+). Đây chính là cái viền bạn thấy ở hình văn phòng.
  {
    key: "left-edge",
    from: "left",
    dx: "-7.5%",
    dy: "0%",
    blur: "",
    tone: "bg-[#dedee1]",
  },
  //   right: dời CHÉO lên-trái 16px -> chỉ ló ở U-. Nền 242, viền 238 — rất nhạt,
  //         mockup đúng như vậy; muốn rõ hơn thì chỉnh tone tối xuống.
  {
    key: "right-edge",
    from: "right",
    dx: "-3.1%",
    dy: "-3.1%",
    blur: "",
    tone: "bg-[#eeeef0]",
  },
] as const;

/**
 * BÓNG MỀM bám MỘT ĐOẠN của MỘT cạnh.
 *
 * Hai cái bẫy đã đâm phải, đừng lặp lại:
 *
 * 1. KHÔNG lấy nguyên hình kim cương dời đi rồi blur. Dời theo +U thì hai cạnh V
 *    vẫn trùng khít mép ảnh, blur xong mỗi cạnh V lòi ra đúng 50% độ đậm — bản
 *    dựng thử đo ra 202 trong khi mockup là 237.
 * 2. Bóng KHÔNG trải đều suốt cạnh. Quét dọc từng cạnh (cách mép 12px) cho thấy
 *    nó là vệt cục bộ nằm trong KHE giữa các hình. Ví dụ cạnh U+ của `top`:
 *      vị trí dọc cạnh  -0,5  -0,4  -0,3  -0,2  -0,1   0   0,1  0,2  0,3  0,4  0,5
 *      độ sáng           242   242   242   242   222  175  156  164  175  198  223
 *    nửa phía đỉnh phải (giáp Zena) sạch trơn, chỉ nửa phía đỉnh dưới mới tối.
 *    Đó là lý do cạnh U- của Zena đo ra 238 dù nó nhìn thẳng vào khe.
 *
 * Nên mỗi vệt là một DẢI GRADIENT có giới hạn hai đầu, đặt trong khung đã xoay
 * 45° của hình. Trong hệ đã xoay, +x cục bộ = +U (xuống-phải) trên màn hình,
 * +y cục bộ = +V (xuống-trái).
 *
 *   dir    cạnh mang bóng, theo trục cục bộ
 *   alpha  độ đậm sát mép (= độ tối đo được / 242)
 *   reach  tầm với ra ngoài, % cạnh khối vuông
 *   along  tâm của vệt dọc theo cạnh, % cạnh (0 = đầu này, 100 = đầu kia)
 *   len    bề dài vệt, % cạnh. Hai đầu vệt được `mask` vuốt tắt nên không cụt.
 *
 * Bốn con số này dò bằng cách dựng lại banner rồi đo y hệt cách đo mockup, chỉnh
 * tới khi 16 đường quét khớp. Sửa một số là phải đo lại, đừng chỉnh mò.
 */
const HERO_EDGE_CASTS = [
  {
    key: "top-cast",
    from: "top",
    dir: "u+",
    alpha: 0.4,
    reach: 34,
    along: 70,
    len: 58,
    blur: "blur-[0.6vw]",
  },
  {
    key: "left-cast",
    from: "left",
    dir: "u+",
    alpha: 0.5,
    reach: 38,
    along: 38,
    len: 86,
    blur: "blur-[0.5vw]",
  },
  {
    key: "bottom-cast",
    from: "bottom",
    dir: "v+",
    alpha: 0.5,
    reach: 23,
    along: 48,
    len: 85,
    blur: "blur-[0.5vw]",
  },
  // Zena chỉ tối ở mẩu cạnh trên-trái sát đỉnh trái của nó, chỗ chui vào khe.
  {
    key: "right-cast",
    from: "right",
    dir: "u-",
    alpha: 0.24,
    reach: 20,
    along: 90,
    len: 26,
    blur: "blur-[0.5vw]",
  },
] as const;

/**
 * NHÓM 2 — vết bóng của hình bên cạnh HẮT LÊN mặt ảnh, không được loang ra nền.
 * Nên mỗi vết gồm hai lớp: khung ngoài sao chép đúng hình nhận bóng và
 * `overflow-hidden` để cắt, bên trong xoay ngược `-rotate-45` về hệ toạ độ màn
 * hình rồi mới đặt vệt mờ vào góc cần.
 *
 * Chỉ còn hai vết, đúng theo hai khe CÓ bóng trong mockup (khe top|right và khe
 * left|bottom). Hai khe còn lại (top|left, right|bottom) đo ra 242 phẳng nên
 * không có vết nào — trước đây code đặt bóng ở đó là không đúng mockup.
 *
 * `zIndex` phải nằm giữa hình nhận bóng và hình đè lên nó: hình Top z10, Bên
 * phải z20, Bên trái z30, Dưới cùng z40.
 */
const HERO_OVERLAP_SHADOWS = [
  // `left` hắt sang mép trên-trái của `bottom` — khe này đo được 33 độ tối.
  {
    key: "left-on-bottom",
    on: "bottom",
    zIndex: 41,
    x: "-26%",
    y: "-26%",
    size: "70%",
    tone: "bg-[rgb(36_33_34/.16)]",
    blur: "blur-[1.4vw]",
  },
  // `top` hắt sang mép trên-trái của `right` — chỉ 4 độ tối nên để rất nhẹ.
  {
    key: "top-on-right",
    on: "right",
    zIndex: 21,
    x: "-14%",
    y: "-14%",
    size: "48%",
    tone: "bg-[rgb(36_33_34/.05)]",
    blur: "blur-[1.2vw]",
  },
] as const;

const DIAMOND_BY_KEY = Object.fromEntries(
  HERO_DIAMONDS.map((diamond) => [diamond.key, diamond]),
);

export function ConstructionServicePage() {
  return (
    <div className="min-h-screen bg-white text-charcoal max-md:overflow-x-hidden">
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
          {/* NHÓM 1: vẽ trước 4 ảnh nên nằm dưới. */}
          {HERO_BACKDROPS.map((shadow, index) => {
            const base =
              "from" in shadow ? DIAMOND_BY_KEY[shadow.from] : shadow;
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

          {/* Dải bóng bám cạnh — vẫn nằm dưới 4 ảnh. */}
          {HERO_EDGE_CASTS.map((cast, index) => {
            const host = DIAMOND_BY_KEY[cast.from];
            const axis = cast.dir[0]; // "u" | "v"
            const out = cast.dir[1] === "-" ? -1 : 1;
            // Dải chạy từ TÂM hình ra ngoài nên dài 50% + tầm với. Đoạn nằm
            // trong lòng ảnh giữ nguyên độ đậm (ảnh che mất), qua mép mới nhạt
            // dần -> `solid` chính là chỗ mép ảnh rơi vào trên dải.
            const span = 50 + cast.reach;
            const solid = ((50 / span) * 100).toFixed(1);
            const tone = `rgb(36 33 34 / ${cast.alpha})`;
            const fade =
              axis === "u"
                ? out > 0
                  ? "to right"
                  : "to left"
                : out > 0
                  ? "to bottom"
                  : "to top";
            // vuốt tắt hai đầu vệt để nó không cụt ngang ở giữa khe
            const taper = `linear-gradient(${axis === "u" ? "to bottom" : "to right"}, transparent 0%, #000 18%, #000 82%, transparent 100%)`;
            const near = out > 0 ? "50%" : "auto";
            const far = out > 0 ? "auto" : "50%";
            const start = `${cast.along - cast.len / 2}%`;
            const size = `${cast.len}%`;
            const bar =
              axis === "u"
                ? {
                    left: near,
                    right: far,
                    width: `${span}%`,
                    top: start,
                    height: size,
                  }
                : {
                    top: near,
                    bottom: far,
                    height: `${span}%`,
                    left: start,
                    width: size,
                  };
            return (
              <Reveal
                className="pointer-events-none absolute z-[1] aspect-square -translate-x-1/2 -translate-y-1/2"
                delay={220 + index * 90}
                duration={650}
                from="fade"
                style={{ left: host.left, top: host.top, height: host.size }}
                key={cast.key}
                aria-hidden="true"
              >
                <div className="relative size-full rotate-45">
                  <div
                    className={`absolute ${cast.blur}`}
                    style={{
                      ...bar,
                      background: `linear-gradient(${fade}, ${tone} 0%, ${tone} ${solid}%, transparent 100%)`,
                      WebkitMaskImage: taper,
                      maskImage: taper,
                    }}
                  />
                </div>
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

          {/* NHÓM 2: vẽ sau 4 ảnh, mỗi vết bị khung của chính hình nhận bóng cắt
              nên không loang ra nền. */}
          {HERO_OVERLAP_SHADOWS.map((shadow, index) => {
            const host = DIAMOND_BY_KEY[shadow.on];
            return (
              <Reveal
                className="pointer-events-none absolute aspect-square -translate-x-1/2 -translate-y-1/2"
                delay={520 + index * 90}
                duration={650}
                from="fade"
                style={{
                  left: host.left,
                  top: host.top,
                  height: host.size,
                  zIndex: shadow.zIndex,
                }}
                key={shadow.key}
                aria-hidden="true"
              >
                {/* `relative` là bắt buộc: không có nó thì lớp `absolute` bên
                    trong lấy mốc từ div ngoài — vốn là CHA của div này — nên
                    `overflow-hidden` ở đây không cắt được, vệt bóng loang ra nền. */}
                <div className="relative size-full rotate-45 overflow-hidden rounded-[16%]">
                  <div className="absolute inset-0 -rotate-45">
                    <div
                      className={`absolute aspect-square rounded-[12%] ${shadow.tone} ${shadow.blur}`}
                      style={{
                        left: shadow.x,
                        top: shadow.y,
                        width: shadow.size,
                      }}
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}
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
            <p className="mx-auto mt-4 max-w-[73.75rem] text-[clamp(0.78rem,2.75vw,1rem)] leading-[1.25] text-pretty text-center md:text-sm md:leading-relaxed">
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
            label="TƯ VẤN MIỄN PHÍ"
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

      <ContactForm />
      <SiteFooter />
    </div>
  );
}
