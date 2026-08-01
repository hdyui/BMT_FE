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
      className={`group/pill relative inline-flex items-center transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] ${className ?? ""}`}
      href={href}
    >
      <Image
        className="h-auto w-full"
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
