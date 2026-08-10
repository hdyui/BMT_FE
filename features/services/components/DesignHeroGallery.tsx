"use client";

import Image from "next/image";
import { Reveal } from "@/lib/components/shared/Reveal";

/**
 * Cụm 3 khung ảnh nghiêng ở nửa phải banner trang "Thiết kế kiến trúc & nội thất".
 *
 * HỆ TOẠ ĐỘ
 * Cả cụm là một khối tỉ lệ cố định 29/20 (rộng = 1.45 lần chiều cao banner) dán
 * sát mép phải banner. Nhờ vậy:
 *   - `height` và `bottom` tính theo % CHIỀU CAO banner,
 *   - `right` tính theo % CHIỀU RỘNG cụm,
 * nên cả cụm phóng to / thu nhỏ đúng tỉ lệ theo chiều cao banner. Chiều cao
 * banner lấy từ SERVICE_HERO_CLASS_NAME (38.9vw) nên tỉ lệ so với bề rộng màn
 * hình luôn giữ nguyên ở mọi khổ màn hình và mọi mức zoom trình duyệt.
 *
 * MỖI KHUNG GỒM 2 LỚP
 *   - `backing`: tấm bìa tạo bóng, VẼ BẰNG CSS (không dùng file ảnh). Nó là một
 *     hình chữ nhật bo góc được `skewX` thành hình bình hành trùng dáng ảnh, đặt
 *     lệch sang trái so với ảnh chính. Phần thò ra chính là dải bóng thấy ở mép
 *     trái tấm 1, góc dưới-trái tấm 1 và góc trên-trái tấm 3.
 *   - `photo`: ảnh chính nằm trên, xuất hiện ngay sau tấm bìa.
 * Thứ tự DOM cho tấm bìa của khung sau đè lên mép phải của khung trước, tạo dải
 * ngăn cách giữa các khung.
 *
 * LƯU Ý KHI THAY ẢNH
 * `aspect` phải bằng đúng tỉ lệ (rộng / cao) của file ảnh mới, nếu không ảnh sẽ
 * bị méo. `hitArea` là vùng bắt chuột hình bình hành (theo % khung ảnh chính).
 */

const IMAGE_DIR = "/images/thiet-ke-kien-truc-noi-that";

/** Độ nghiêng của 3 tấm ảnh: lệch ngang 0.3825 đơn vị trên mỗi đơn vị chiều cao. */
const SKEW_DEG = -20.94;

type Layer = {
  /** Đường dẫn ảnh — THAY URL THẬT TẠI ĐÂY. */
  src: string;
  /** Tỉ lệ rộng/cao của file ảnh gốc. */
  aspect: string;
  /** Chiều cao lớp, % chiều cao banner. */
  height: number;
  /** Mép phải lớp cách mép phải cụm bao nhiêu, % chiều rộng cụm (âm = tràn ra ngoài). */
  right: number;
  /** Đáy lớp cách đáy banner bao nhiêu, % chiều cao banner. */
  bottom: number;
};

/** Tấm bìa tạo bóng: hình chữ nhật CHƯA skew, cùng hệ toạ độ với `Layer`. */
type Backing = Omit<Layer, "src" | "aspect"> & { width: number };

type HeroFrame = {
  id: string;
  alt: string;
  photo: Layer;
  backing: Backing;
  /** Vùng bắt hover đúng theo hình bình hành của ảnh, % khung ảnh chính. */
  hitArea: string;
};

const heroFrames: readonly HeroFrame[] = [
  {
    id: "yensao",
    alt: "Showroom Yến Sào do BMT Decor thiết kế nội thất",
    // ← ẢNH CHÍNH TRÁI
    photo: {
      src: `${IMAGE_DIR}/left-corner.png`,
      aspect: "2133 / 2691",
      height: 86.96,
      right: 46.25,
      // Khung trái nhích cao hơn hai khung kia (đáy KHÔNG ngang hàng).
      // Tăng số này = đẩy tấm trái lên cao thêm.
      bottom: 8.57,
    },
    backing: { width: 23.85, height: 52, right: 60.2, bottom: 37.21 },
    hitArea: "polygon(47.9% 5.54%, 97.88% 5.54%, 54.36% 96.25%, 4.19% 96.25%)",
  },
  {
    id: "cau-thang",
    alt: "Nhà phố do BMT Decor thiết kế nội thất",
    // ← ẢNH CHÍNH GIỮA
    photo: {
      src: `${IMAGE_DIR}/between.png`,
      aspect: "2153 / 2622",
      height: 84.73,
      right: 19.43,
      // Đáy ngang hàng với khung phải.
      bottom: 1.42,
    },
    backing: { width: 23.85, height: 72.88, right: 42.25, bottom: 10.05 },
    hitArea: "polygon(45.89% 3.2%, 95.59% 3.2%, 52.28% 96.3%, 2.63% 96.3%)",
  },
  {
    id: "zena-spa",
    alt: "Zena Spa do BMT Decor thiết kế nội thất",
    // ← ẢNH CHÍNH PHẢI (khung to nhất, dính sát mép phải banner)
    photo: {
      src: `${IMAGE_DIR}/right-corner.png`,
      aspect: "1957 / 3033",
      height: 98,
      // Âm để phần lề trong suốt của file ảnh nằm ngoài khung -> cạnh phải của
      // tấm ảnh dính sát mép phải, không chừa khoảng trắng.
      right: -2.68,
      bottom: 1.39,
    },
    backing: { width: 23.85, height: 90.36, right: 14.6, bottom: 3.06 },
    hitArea: "polygon(56.8% 4.62%, 93.87% 4.62%, 93.87% 96.77%, 2.1% 96.77%)",
  },
];

/** Tấm bìa hiện trước, ảnh chính hiện sau — cách nhau đúng một nhịp. */
const BACKING_DELAY = 120;
const PHOTO_DELAY = 320;

function boxStyle(box: { height: number; right: number; bottom: number }) {
  return {
    height: `${box.height}%`,
    right: `${box.right}%`,
    bottom: `${box.bottom}%`,
  };
}

export function DesignHeroGallery() {
  return (
    // Màn nhỏ: thu nhỏ cụm và neo góc dưới phải để không đè lên khối chữ.
    //
    // Từ lg: `top-22 bottom-0` + `h-auto` thay cho `inset-y-0 h-full`. Trang đã
    // bỏ `pt-16` nên banner chạm cạnh trên, để `inset-y-0` thì đỉnh cụm ở y=0 và
    // 85px trên cùng nằm sau SiteHeader. Mốc top vừa đẩy cụm khỏi header vừa thu
    // nhỏ nó đều: chiều cao do top/bottom quyết định, bề rộng suy ra từ
    // `aspect-[29/20]` nên không méo.
    //
    // Hai mốc dưới được GIẢI RA từ điều kiện "hai khe hở bằng nhau và cùng bằng
    // g", không phải chọn tay. Ảnh cao nhất (zena-spa) có đỉnh ở 99,39% chiều
    // cao cụm tính từ đáy cụm, ảnh thấp nhất có đáy ở 1,39%. Gọi đáy cụm là B:
    //     khe trên  = (B - 0.9939 x H) - 85 = g
    //     khe dưới  = 560 - (B - 0.0139 x H) = g
    // Cộng hai vế: H = (475 - 2g) / 0.98.
    //
    // g = 2px (sát nhưng KHÔNG chạm header lẫn đáy banner) -> H = 481px, đáy cụm
    // ở 565px tức tràn 5px ra ngoài banner, đỉnh cụm ở 84px. g = 0 là chạm, nên
    // chiều cao coi như đã kịch trần, không còn gì để lấy thêm.
    //
    // `lg:aspect-[31/20]` (gốc 29/20): chiều cao hết đường thì muốn cụm lấn sang
    // trái chỉ còn cách nới tỉ lệ khung. Bề rộng mỗi tấm ảnh KHÔNG đổi (nó bằng
    // chiều cao tấm nhân tỉ lệ file ảnh, đều tính theo chiều cao cụm) — cái thay
    // đổi là ba tấm dàn xa nhau hơn theo phương ngang. Đây là chỗ phải canh: dàn
    // quá thì ba tấm hở mép, mất kiểu xếp nan quạt của bản thiết kế.
    <div className="pointer-events-none absolute right-0 bottom-0 aspect-[29/20] h-[45%] sm:h-[55%] lg:top-[5.25rem] lg:-bottom-[0.3125rem] lg:aspect-[31/20] lg:h-auto">
      {/* CẢ 3 TẤM BÌA vẽ trước để nằm DƯỚI cả 3 ảnh chính. Nhờ vậy bìa của
          khung sau bị ảnh của khung trước che, chỉ ló ra đúng ở khe hở và ở
          những chỗ không có ảnh nào phía trước — giống hệt bản thiết kế. */}
      {heroFrames.map((frame, index) => (
        <Reveal
          className="absolute"
          style={{
            ...boxStyle(frame.backing),
            width: `${frame.backing.width}%`,
          }}
          delay={index * BACKING_DELAY}
          from="fade"
          key={`${frame.id}-backing`}
        >
          <div
            className="size-full rounded-[1.5rem] bg-gradient-to-b from-[#c3c4c7] to-[#e4e5e8]"
            style={{ transform: `skewX(${SKEW_DEG}deg)` }}
          />
        </Reveal>
      ))}

      {heroFrames.map((frame, index) => (
        <div className="group/frame contents" key={frame.id}>
          {/* ẢNH CHÍNH — nằm trên, xuất hiện ngay sau tấm bìa */}
          <Reveal
            className="absolute"
            style={{
              ...boxStyle(frame.photo),
              aspectRatio: frame.photo.aspect,
            }}
            delay={PHOTO_DELAY + index * BACKING_DELAY}
            from="bottom"
          >
            {/* Hover: ảnh phóng to nhẹ, viền khung có bóng đổ mềm. Tấm bìa là
                phần tử riêng nên KHÔNG phóng to theo -> khung giữ nguyên.
                Tailwind v4 xuất `scale-*` ra thuộc tính `scale` riêng (không
                phải `transform`), nên transition phải khai báo đúng `scale`. */}
            <div className="size-full transition-[scale,filter] duration-500 ease-out group-hover/frame:scale-[1.035] group-hover/frame:drop-shadow-[0_14px_30px_rgb(36_33_34/.22)]">
              <Image
                className="size-full object-fill"
                src={frame.photo.src}
                alt={frame.alt}
                fill
                sizes="(max-width: 1024px) 34vw, 28vw"
                priority
              />
            </div>
          </Reveal>

          {/* Vùng bắt chuột cắt đúng hình bình hành, nếu không khung nằm trên
              sẽ nuốt hover của khung nằm dưới. */}
          <div
            className="pointer-events-auto absolute"
            style={{
              ...boxStyle(frame.photo),
              aspectRatio: frame.photo.aspect,
              clipPath: frame.hitArea,
            }}
          />
        </div>
      ))}
    </div>
  );
}
