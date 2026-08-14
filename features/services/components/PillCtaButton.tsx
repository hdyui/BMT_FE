import Image from "next/image";
import Link from "next/link";

type PillCtaButtonProps = {
  href: string;
  label: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  className?: string;
  textClassName?: string; // <-- 1. Thêm dòng này để nhận class chữ từ bên ngoài
  /** Ảnh pill riêng cho mobile/tablet (dưới `lg`) — mockup dùng ảnh nền được
   * đo vẽ riêng cho từng độ dài label ở khổ mobile (không kéo giãn ảnh desktop). */
  mobileImage?: string;
  mobileImageWidth?: number;
  mobileImageHeight?: number;
  /** Bỏ khoảng chừa cho icon mũi tên, canh chữ đúng giữa nút ở khổ mobile. */
  mobileTextCentered?: boolean;
  /** Khoảng chừa bên phải cho icon mũi tên (nhánh không dùng `mobileImage`),
   * tính theo % bề rộng nút. Mặc định 18 khớp ảnh pill gốc; giảm số này khi
   * label dài/nút hẹp khiến chữ bị dồn sát mép trái. */
  textPaddingRightPercent?: number;
};

export function PillCtaButton({
  href,
  label,
  image,
  imageWidth,
  imageHeight,
  className,
  textClassName, // <-- 2. Khai báo biến ở đây
  mobileImage,
  mobileImageWidth,
  mobileImageHeight,
  mobileTextCentered = false,
  textPaddingRightPercent = 18,
}: PillCtaButtonProps) {
  // Icon mũi tên trên ảnh pill mobile có đường kính ~bằng chiều cao ảnh, nên
  // tỉ lệ % nó chiếm theo chiều rộng co giãn ngược theo độ dài label (label
  // càng dài, ảnh càng rộng, icon càng chiếm % nhỏ). Tính động thay vì dùng
  // con số cố định của bản desktop để chữ không bị đẩy tràn xuống dòng.
  const mobileIconPaddingPercent = mobileTextCentered
    ? 12
    : mobileImageWidth && mobileImageHeight
      ? (mobileImageHeight / mobileImageWidth) * 100 + 3
      : 0;

  if (!mobileImage || !mobileImageWidth || !mobileImageHeight) {
    return (
      <Link
        className={`group/pill relative inline-flex shrink-0 items-center self-start transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] ${className ?? ""}`}
        href={href}
        style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}
      >
        <Image
          className="h-full w-full transition-[filter] duration-300 group-hover/pill:brightness-[.88] group-hover/pill:drop-shadow-[0_10px_18px_rgb(244_122_42/.28)]"
          src={image}
          alt=""
          width={imageWidth}
          height={imageHeight}
          aria-hidden="true"
        />
        {/* 3. Ghép textClassName vào đoạn thẻ span này */}
        <span
          className={`absolute inset-0 flex items-center justify-center text-sm font-semibold whitespace-nowrap text-white uppercase ${textClassName ?? ""}`}
          style={{ paddingRight: `${textPaddingRightPercent}%` }}
        >
          {label}
        </span>
      </Link>
    );
  }

  return (
    <Link
      className={`group/pill inline-flex shrink-0 items-center self-start transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] ${className ?? ""}`}
      href={href}
    >
      <span
        className="relative block h-7 sm:h-8 md:h-9 lg:hidden"
        style={{ aspectRatio: `${mobileImageWidth} / ${mobileImageHeight}` }}
      >
        <Image
          className="h-full w-full transition-[filter] duration-300 group-hover/pill:brightness-[.88] group-hover/pill:drop-shadow-[0_10px_18px_rgb(244_122_42/.28)]"
          src={mobileImage}
          alt=""
          width={mobileImageWidth}
          height={mobileImageHeight}
          aria-hidden="true"
        />
        <span
          className={`absolute inset-0 flex items-center justify-center text-[0.625rem] leading-tight font-semibold text-white uppercase sm:text-[0.6875rem] md:pl-[5%] md:text-xs md:whitespace-nowrap ${textClassName ?? ""}`}
          style={{ paddingRight: `${mobileIconPaddingPercent}%` }}
        >
          {label}
        </span>
      </span>

      <span
        className="relative hidden h-full lg:block"
        style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}
      >
        <Image
          className="h-full w-full transition-[filter] duration-300 group-hover/pill:brightness-[.88] group-hover/pill:drop-shadow-[0_10px_18px_rgb(244_122_42/.28)]"
          src={image}
          alt=""
          width={imageWidth}
          height={imageHeight}
          aria-hidden="true"
        />
        <span
          className={`absolute inset-0 flex items-center justify-center pr-[18%] pl-[8%] text-sm font-semibold whitespace-nowrap text-white uppercase ${textClassName ?? ""}`}
        >
          {label}
        </span>
      </span>
    </Link>
  );
}
