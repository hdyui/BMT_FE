import Image from "next/image";
import Link from "next/link";
import { contactInformation, services } from "@/config/site";
import { BrandLogo } from "@/lib/components/shared/BrandLogo";
import { Reveal } from "@/lib/components/shared/Reveal";

const socialLinks = [
  ["Facebook", "/images/home/facebook.png"],
  ["TikTok", "/images/home/tiktok.png"],
  ["Instagram", "/images/home/instagram.png"],
  ["LinkedIn", "/images/home/linkedin.png"],
] as const;

export function SiteFooter({
  showTopBorder = true,
}: {
  showTopBorder?: boolean;
}) {
  return (
    <footer
      className={`${showTopBorder ? "border-t-[6px] border-brand" : "border-t-0"} bg-neutral-100`}
      id="footer"
    >
      <div className="mx-auto grid w-[min(1360px,calc(100%-2.5rem))] gap-10 py-8 lg:grid-cols-[280px_minmax(0,1fr)_340px] lg:gap-16">
        <Reveal>
          <BrandLogo className="w-[145px] mix-blend-multiply" large />
          <p className="mt-5 max-w-48 text-sm leading-relaxed text-neutral-600">
            Thiết kế và thi công kiến trúc, nội thất trọn gói tại Việt Nam.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <h3 className="mb-5 text-sm font-bold uppercase">Dịch vụ</h3>
          <nav
            className="grid gap-3 text-sm"
            aria-label="Dịch vụ tại chân trang"
          >
            {services.map((service) => (
              <Link
                className="w-fit text-charcoal transition-colors duration-300 hover:text-brand hover:underline hover:decoration-brand hover:underline-offset-4 focus-visible:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                href={service.href}
                key={service.href}
              >
                {service.label}
              </Link>
            ))}
          </nav>
        </Reveal>

        <Reveal delay={160}>
          <h3 className="mb-3 text-base font-extrabold uppercase">Liên hệ:</h3>
          <div className="grid gap-2 text-base leading-relaxed">
            <p className="flex items-start gap-2.5">
              <Image
                className="mt-0.5 size-5 shrink-0 object-contain"
                src="/images/home/pin.png"
                alt=""
                width={24}
                height={24}
              />
              Địa chỉ: {contactInformation.office}
            </p>
            <p className="flex items-center gap-2.5">
              <Image
                className="size-5 shrink-0 object-contain"
                src="/images/home/zalo.png"
                alt=""
                width={24}
                height={24}
              />
              Hỗ trợ tư vấn: {contactInformation.phone}
            </p>
            <p className="flex items-center gap-2.5">
              <Image
                className="size-5 shrink-0 object-contain"
                src="/images/home/mail.png"
                alt=""
                width={24}
                height={24}
              />
              Email: {contactInformation.email}
            </p>
          </div>

          <h3 className="mt-12 mb-3 text-base font-extrabold uppercase">
            Chi nhánh và nhà xưởng:
          </h3>
          <div className="grid gap-2 text-base leading-relaxed">
            {contactInformation.branches.map((branch, index) => (
              <p className="flex items-start gap-2.5" key={branch}>
                <Image
                  className="mt-0.5 size-5 shrink-0 object-contain"
                  src={`/images/home/pin-branch-0${index + 1}.png`}
                  alt=""
                  width={24}
                  height={24}
                />
                {index < 2
                  ? `Địa chỉ chi nhánh ${index + 1}: `
                  : "Xưởng sản xuất: "}
                {branch}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={320}>
          <h3 className="mb-3 text-base font-extrabold uppercase">Theo dõi:</h3>
          <div className="flex items-center gap-5">
            {socialLinks.map(([label, src]) => (
              <Link
                className="group grid size-9 place-items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                href="#"
                aria-label={label}
                key={label}
              >
                <span
                  className="size-7 bg-charcoal transition-[background-color,transform] duration-300 ease-out group-hover:scale-110 group-hover:bg-brand"
                  style={{
                    maskImage: `url(${src})`,
                    maskPosition: "center",
                    maskRepeat: "no-repeat",
                    maskSize: "contain",
                    WebkitMaskImage: `url(${src})`,
                    WebkitMaskPosition: "center",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskSize: "contain",
                  }}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
          <Image
            className="mt-3 w-full rounded-sm"
            src="/images/home/facebook-widget.png"
            alt="Trang Facebook BMT Decor"
            width={1701}
            height={730}
            sizes="280px"
          />
        </Reveal>
      </div>

      <div className="bg-charcoal px-5 py-4 text-white">
        <Reveal className="text-center text-xs sm:text-sm" delay={480}>
          Copyright 2010 © CÔNG TY TNHH TMDV BMT DECOR | MST: 0317552987
        </Reveal>
      </div>
    </footer>
  );
}
