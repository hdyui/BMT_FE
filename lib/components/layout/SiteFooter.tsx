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

const contactIconClass = "mt-0.5 size-8 shrink-0 object-contain";

export function SiteFooter({
  showTopBorder = true,
}: {
  showTopBorder?: boolean;
}) {
  return (
    <footer
      className={`${showTopBorder ? "border-t-[10px] border-brand" : "border-t-0"} bg-[#f1f1f3]`}
      id="footer"
    >
      <div className="mx-auto grid w-[min(1700px,calc(100%-2.5rem))] gap-10 py-10 md:grid-cols-2 lg:grid-cols-[340px_minmax(0,1fr)_425px] lg:gap-x-16 lg:py-10 xl:gap-x-24">
        <Reveal className="flex flex-col items-start">
          <BrandLogo className="ml-1 w-[215px] mix-blend-multiply" large />

          <div className="mt-3">
            <h3 className="mb-1 text-xl font-extrabold uppercase">Dịch vụ:</h3>
            <nav
              className="grid gap-0.5 text-lg leading-relaxed"
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
          </div>
        </Reveal>

        <Reveal className="md:col-span-2 lg:col-span-1" delay={120}>
          <h3 className="mb-3 text-xl font-extrabold uppercase">Liên hệ:</h3>
          <div className="grid gap-1.5 text-lg leading-relaxed xl:text-xl">
            <p className="flex items-start gap-2.5">
              <Image
                className={contactIconClass}
                src="/images/home/pin.png"
                alt=""
                width={32}
                height={32}
              />
              <span>Địa chỉ: {contactInformation.office}</span>
            </p>
            <p className="flex items-start gap-2.5">
              <Image
                className={contactIconClass}
                src="/images/home/zalo.png"
                alt=""
                width={32}
                height={32}
              />
              <span>Hỗ trợ tư vấn: {contactInformation.phone}</span>
            </p>
            <p className="flex items-start gap-2.5">
              <Image
                className={contactIconClass}
                src="/images/home/mail.png"
                alt=""
                width={32}
                height={32}
              />
              <span>Email: {contactInformation.email}</span>
            </p>
          </div>

          <h3 className="mt-24 mb-3 text-xl font-extrabold uppercase">
            Chi nhánh và nhà xưởng:
          </h3>
          <div className="grid gap-1.5 text-lg leading-relaxed xl:text-xl">
            {contactInformation.branches.map((branch, index) => (
              <p className="flex items-start gap-2.5" key={branch}>
                <Image
                  className={contactIconClass}
                  src={`/images/home/pin-branch-0${index + 1}.png`}
                  alt=""
                  width={32}
                  height={32}
                />
                <span>
                  {index < 2
                    ? `Địa chỉ chi nhánh ${index + 1}: `
                    : "Xưởng sản xuất: "}
                  {branch}
                </span>
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={240}>
          <h3 className="mb-1 text-xl font-extrabold uppercase">Theo dõi:</h3>
          <div className="flex items-center gap-5">
            {socialLinks.map(([label, src]) => (
              <Link
                className="group grid size-10 place-items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                href="#"
                aria-label={label}
                key={label}
              >
                <span
                  className="size-8 bg-charcoal transition-[background-color,transform] duration-300 ease-out group-hover:scale-110 group-hover:bg-brand"
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
            className="mt-3 w-full"
            src="/images/home/facebook-widget.png"
            alt="Trang Facebook BMT Decor"
            width={1701}
            height={730}
            sizes="(min-width: 1024px) 425px, (min-width: 768px) 50vw, 100vw"
          />
        </Reveal>
      </div>

      <div className="bg-charcoal px-5 py-4 text-white">
        <Reveal className="text-center text-xs sm:text-sm" delay={360}>
          Copyright 2010 © CÔNG TY TNHH TMDV BMT DECOR | MST: 0317552987
        </Reveal>
      </div>
    </footer>
  );
}
