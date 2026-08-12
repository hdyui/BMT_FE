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

const contactIconClass =
  "mt-0.5 size-6 shrink-0 object-contain 2xl:size-8";

function ServicesNav({ mobileMockup = false }: { mobileMockup?: boolean } = {}) {
  return (
    <div>
      <h3
        className={`mb-1 text-xl font-extrabold uppercase ${
          mobileMockup ? "max-md:text-base" : ""
        }`}
      >
        Dịch vụ:
      </h3>
      <nav
        className={`grid gap-0.5 text-base leading-relaxed lg:text-lg ${
          mobileMockup ? "max-md:text-sm" : ""
        }`}
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
  );
}

function ContactDetails({
  mobileMockup = false,
}: {
  mobileMockup?: boolean;
} = {}) {
  return (
    <>
      <h3
        className={`mb-3 text-xl font-extrabold uppercase ${
          mobileMockup ? "max-md:text-base" : ""
        }`}
      >
        Liên hệ:
      </h3>
      <div
        className={`grid gap-1.5 text-base leading-relaxed lg:text-lg 2xl:text-xl ${
          mobileMockup ? "max-md:text-sm" : ""
        }`}
      >
        <p className="flex items-start gap-2.5">
          <Image
            className={contactIconClass}
            src="/images/home/pin.png"
            alt=""
            width={32}
            height={32}
          />
          <span className="min-w-0 max-w-[620px]">
            Địa chỉ: {contactInformation.office}
          </span>
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

      <h3
        className={`mt-10 mb-3 text-xl font-extrabold uppercase lg:mt-20 2xl:mt-24 ${
          mobileMockup ? "max-md:mt-8 max-md:text-base" : ""
        }`}
      >
        Chi nhánh và nhà xưởng:
      </h3>
      <div
        className={`grid gap-1.5 text-base leading-relaxed lg:text-lg 2xl:text-xl ${
          mobileMockup ? "max-md:text-sm" : ""
        }`}
      >
        {contactInformation.branches.map((branch, index) => (
          <p className="flex items-start gap-2.5" key={branch}>
            <Image
              className={contactIconClass}
              src={`/images/home/pin-branch-0${index + 1}.png`}
              alt=""
              width={32}
              height={32}
            />
            <span className="min-w-0 max-w-[620px]">
              {index < 2
                ? `Địa chỉ chi nhánh ${index + 1}: `
                : "Xưởng sản xuất: "}
              {branch}
            </span>
          </p>
        ))}
      </div>
    </>
  );
}

function FollowLinks({ mobileMockup = false }: { mobileMockup?: boolean } = {}) {
  return (
    <>
      <h3
        className={`mb-1 text-xl font-extrabold uppercase ${
          mobileMockup ? "max-md:text-base" : ""
        }`}
      >
        Theo dõi:
      </h3>
      <div className="flex items-center gap-4 lg:gap-5">
        {socialLinks.map(([label, src]) => (
          <Link
            className={`group grid size-10 place-items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${
              mobileMockup ? "max-md:size-8" : ""
            }`}
            href="#"
            aria-label={label}
            key={label}
          >
            <span
              className={`size-8 bg-charcoal transition-[background-color,transform] duration-300 ease-out group-hover:scale-110 group-hover:bg-brand ${
                mobileMockup ? "max-md:size-6" : ""
              }`}
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
    </>
  );
}

export function SiteFooter({
  showTopBorder = true,
  mobileServiceMockup = false,
}: {
  showTopBorder?: boolean;
  mobileServiceMockup?: boolean;
}) {
  return (
    <footer
      className={`${showTopBorder ? "border-t-[10px] border-brand" : "border-t-0"} bg-[#f1f1f3]`}
      id="footer"
    >
      {/* Mockup mobile xếp khác desktop: logo riêng ở giữa, Dịch vụ/Theo dõi
          nằm chung một hàng 2 cột, Liên hệ + Chi nhánh xuống dưới cùng - khác
          cách gộp "Logo+Dịch vụ" và "Liên hệ+Chi nhánh" của bản desktop nên
          tách thành 2 layout riêng thay vì ép chung một lưới. */}
      <div
        className={`mx-auto flex w-[calc(100%-2.5rem)] max-w-[1500px] flex-col items-center gap-10 py-10 lg:hidden ${
          mobileServiceMockup ? "max-md:gap-7 max-md:py-8" : ""
        }`}
      >
        <Reveal>
          <BrandLogo
            className={`w-[180px] mix-blend-multiply ${
              mobileServiceMockup ? "max-md:w-[8.5rem]" : ""
            }`}
            large
          />
        </Reveal>

        <Reveal className="grid w-full grid-cols-2 gap-x-6" delay={120}>
          <ServicesNav mobileMockup={mobileServiceMockup} />
          <FollowLinks mobileMockup={mobileServiceMockup} />
        </Reveal>

        <Reveal className="w-full" delay={240}>
          <ContactDetails mobileMockup={mobileServiceMockup} />
        </Reveal>
      </div>

      <div className="mx-auto hidden max-w-[1500px] gap-10 py-10 lg:grid lg:w-[calc(100%-6rem)] lg:grid-cols-[265px_minmax(0,1fr)_300px] lg:gap-x-8 lg:py-10 xl:grid-cols-[275px_minmax(0,1fr)_360px] xl:gap-x-10 2xl:grid-cols-[295px_minmax(0,1fr)_425px] 2xl:gap-x-12">
        <Reveal className="flex flex-col items-start">
          <BrandLogo
            className="ml-1 w-[180px] mix-blend-multiply 2xl:w-[215px]"
            large
          />

          <div className="mt-3">
            <ServicesNav />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ContactDetails />
        </Reveal>

        <Reveal delay={240}>
          <FollowLinks />
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
