import Image from "next/image";
import Link from "next/link";

type PillCtaButtonProps = {
  href: string;
  label: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  className?: string;
};

export function PillCtaButton({
  href,
  label,
  image,
  imageWidth,
  imageHeight,
  className,
}: PillCtaButtonProps) {
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
      <span className="absolute inset-0 flex items-center justify-center pr-[18%] text-sm font-semibold text-white uppercase">
        {label}
      </span>
    </Link>
  );
}
