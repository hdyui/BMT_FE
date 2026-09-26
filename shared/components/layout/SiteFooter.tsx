"use client";

import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { Reveal } from "@/shared/components/Reveal";
import { useSiteSettings } from "@/shared/site-settings/SiteSettingsProvider";
import type { SiteFooterSettings } from "@/shared/site-settings/types";

const socialIcons = [
  ["Facebook", "/images/home/facebook.png", "facebookUrl"],
  ["TikTok", "/images/home/tiktok.png", "tiktokUrl"],
  ["Instagram", "/images/home/instagram.png", "instagramUrl"],
  ["LinkedIn", "/images/home/linkedin.png", "linkedinUrl"],
] as const;

const contactIconClass =
  "mt-0.5 size-6 shrink-0 object-contain 2xl:size-8";
const mobileContactListClass =
  "grid gap-1.5 text-[clamp(11.25px,2.95vw,14px)] leading-[1.4] tracking-[-0.025em]";
const mobileContactRowClass = "flex min-w-0 items-start gap-2";
const mobileContactIconClass = "size-4 shrink-0 object-contain";

function footerServices(footer: SiteFooterSettings) {
  return [
    { label: footer.service1Label, href: footer.service1Href },
    { label: footer.service2Label, href: footer.service2Href },
    { label: footer.service3Label, href: footer.service3Href },
    { label: footer.service4Label, href: footer.service4Href },
  ].filter(
    (item): item is { label: string; href: string } =>
      Boolean(item.label && item.href),
  );
}

function ServicesNav({
  footer,
  mobileMockup = false,
}: {
  footer: SiteFooterSettings;
  mobileMockup?: boolean;
}) {
  const services = footerServices(footer);
  if (services.length === 0) return null;

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
  footer,
  mobileMockup = false,
}: {
  footer: SiteFooterSettings;
  mobileMockup?: boolean;
}) {
  const branches = [
    footer.branch1Address,
    footer.branch2Address,
    footer.workshopAddress,
  ].filter((value): value is string => Boolean(value));

  const hasContact =
    footer.contactHeading ||
    footer.officeAddress ||
    footer.phone ||
    footer.email ||
    footer.branchesHeading ||
    branches.length > 0;

  if (!hasContact) return null;

  return (
    <>
      {footer.contactHeading && (
        <h3
          className={`mb-3 pl-[34px] text-xl font-extrabold uppercase 2xl:pl-[42px] ${
            mobileMockup ? "max-md:text-base" : ""
          }`}
        >
          {footer.contactHeading}
        </h3>
      )}
      <div
        className={`grid gap-1.5 text-base leading-relaxed lg:text-lg 2xl:text-xl ${
          mobileMockup ? "max-md:text-sm" : ""
        }`}
      >
        {footer.officeAddress && (
          <p className="flex items-start gap-2.5">
            <Image
              className={contactIconClass}
              src="/images/home/pin.png"
              alt=""
              width={32}
              height={32}
            />
            <span className="min-w-0 max-w-[620px]">
              {footer.officeAddress}
            </span>
          </p>
        )}
        {footer.phone && (
          <p className="flex items-start gap-2.5">
            <Image
              className={contactIconClass}
              src="/images/home/zalo.png"
              alt=""
              width={32}
              height={32}
            />
            <span>{footer.phone}</span>
          </p>
        )}
        {footer.email && (
          <p className="flex items-start gap-2.5">
            <Image
              className={contactIconClass}
              src="/images/home/mail.png"
              alt=""
              width={32}
              height={32}
            />
            <span>{footer.email}</span>
          </p>
        )}
      </div>

      {(footer.branchesHeading || branches.length > 0) && (
        <>
          {footer.branchesHeading && (
            <h3
              className={`mt-10 mb-3 pl-[34px] text-xl font-extrabold uppercase lg:mt-20 2xl:mt-24 2xl:pl-[42px] ${
                mobileMockup ? "max-md:mt-8 max-md:text-base" : ""
              }`}
            >
              {footer.branchesHeading}
            </h3>
          )}
          <div
            className={`grid gap-1.5 text-base leading-relaxed lg:text-lg 2xl:text-xl ${
              mobileMockup ? "max-md:text-sm" : ""
            }`}
          >
            {branches.map((branch, index) => (
              <p className="flex items-start gap-2.5" key={branch}>
                <Image
                  className={contactIconClass}
                  src={`/images/home/pin-branch-0${index + 1}.png`}
                  alt=""
                  width={32}
                  height={32}
                />
                <span className="min-w-0 max-w-[620px]">{branch}</span>
              </p>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function FollowLinks({
  footer,
  mobileMockup = false,
}: {
  footer: SiteFooterSettings;
  mobileMockup?: boolean;
}) {
  const links = socialIcons.flatMap(([label, icon, key]) => {
    const url = footer[key];
    return url ? [{ label, icon, url }] : [];
  });

  if (links.length === 0 && !footer.socialWidgetImage) return null;

  return (
    <>
      {links.length > 0 && (
        <>
          <h3
            className={`mb-1 text-xl font-extrabold uppercase ${
              mobileMockup ? "max-md:text-base" : ""
            }`}
          >
            Theo dõi:
          </h3>
          <div className="flex items-center gap-4 lg:gap-5">
            {links.map(({ label, icon, url }) => (
              <Link
                className={`group grid size-10 place-items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${
                  mobileMockup ? "max-md:size-8" : ""
                }`}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                key={label}
              >
                <span
                  className={`size-8 bg-charcoal transition-[background-color,transform] duration-300 ease-out group-hover:scale-110 group-hover:bg-brand ${
                    mobileMockup ? "max-md:size-6" : ""
                  }`}
                  style={{
                    maskImage: `url(${icon})`,
                    maskPosition: "center",
                    maskRepeat: "no-repeat",
                    maskSize: "contain",
                    WebkitMaskImage: `url(${icon})`,
                    WebkitMaskPosition: "center",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskSize: "contain",
                  }}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </>
      )}

      {footer.socialWidgetImage && (
        <Image
          className="mt-3 w-full"
          src={footer.socialWidgetImage}
          alt={footer.socialWidgetAlt ?? ""}
          width={1701}
          height={730}
          sizes="(min-width: 1024px) 425px, (min-width: 768px) 50vw, 100vw"
        />
      )}
    </>
  );
}

export function SiteFooter({
  showTopBorder = true,
  hideTopBorderOnMobile = false,
}: {
  showTopBorder?: boolean;
  hideTopBorderOnMobile?: boolean;
}) {
  const { settings } = useSiteSettings();
  const footer = settings?.footer;

  if (!footer) {
    return (
      <footer
        className={`${
          showTopBorder ? "border-t-[10px] border-brand" : "border-t-0"
        } ${
          hideTopBorderOnMobile ? "max-md:border-t-0" : ""
        } bg-[#f1f1f3]`}
        id="footer"
      />
    );
  }

  const services = footerServices(footer);
  const socialLinks = socialIcons
    .map(([label, icon, key]) => ({
      label,
      icon,
      url: footer[key],
    }))
    .filter((item) => Boolean(item.url));
  const branches = [
    footer.branch1Address,
    footer.branch2Address,
    footer.workshopAddress,
  ].filter((value): value is string => Boolean(value));

  return (
    <footer
      className={`${
        showTopBorder ? "border-t-[10px] border-brand" : "border-t-0"
      } ${
        hideTopBorderOnMobile ? "max-md:border-t-0" : ""
      } bg-[#f1f1f3]`}
      id="footer"
    >
      <div className="px-[clamp(16px,4.2vw,24px)] py-8 sm:hidden">
        {footer.footerLogo && (
          <Reveal className="flex justify-start px-[clamp(8px,2.2vw,12px)]">
            <BrandLogo
              className="w-[100px] mix-blend-multiply"
              src={footer.footerLogo}
              alt={footer.footerLogoAlt}
              large
            />
          </Reveal>
        )}

        <Reveal
          className="mt-7 grid grid-cols-2 gap-5 px-[clamp(8px,2.2vw,12px)]"
          delay={120}
        >
          {services.length > 0 && (
            <div>
              <h3 className="mb-2 text-lg font-extrabold uppercase">
                Dịch vụ:
              </h3>
              <nav
                className="grid gap-1 text-[13px] leading-relaxed"
                aria-label="Dịch vụ tại chân trang mobile"
              >
                {services.map((service) => (
                  <Link
                    className="w-fit whitespace-nowrap text-charcoal"
                    href={service.href}
                    key={service.href}
                  >
                    {service.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {(socialLinks.length > 0 || footer.socialWidgetImage) && (
            <div>
              {socialLinks.length > 0 && (
                <>
                  <h3 className="mb-2 text-lg font-extrabold uppercase">
                    Theo dõi:
                  </h3>
                  <div className="flex items-center gap-2">
                    {socialLinks.map(({ label, icon, url }) => (
                      <Link
                        className="grid size-6 place-items-center"
                        href={url as string}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        key={label}
                      >
                        <span
                          className="size-[18px] bg-charcoal"
                          style={{
                            maskImage: `url(${icon})`,
                            maskPosition: "center",
                            maskRepeat: "no-repeat",
                            maskSize: "contain",
                            WebkitMaskImage: `url(${icon})`,
                            WebkitMaskPosition: "center",
                            WebkitMaskRepeat: "no-repeat",
                            WebkitMaskSize: "contain",
                          }}
                          aria-hidden="true"
                        />
                      </Link>
                    ))}
                  </div>
                </>
              )}
              {footer.socialWidgetImage && (
                <Image
                  className="mt-3 w-full"
                  src={footer.socialWidgetImage}
                  alt={footer.socialWidgetAlt ?? ""}
                  width={1701}
                  height={730}
                  sizes="45vw"
                />
              )}
            </div>
          )}
        </Reveal>

        {(footer.contactHeading ||
          footer.officeAddress ||
          footer.phone ||
          footer.email) && (
          <Reveal className="mt-8" delay={240}>
            {footer.contactHeading && (
              <h3 className="mb-3 pl-6 text-lg font-extrabold uppercase">
                {footer.contactHeading}
              </h3>
            )}
            <div className={mobileContactListClass}>
              {footer.officeAddress && (
                <p className={mobileContactRowClass}>
                  <Image
                    className={mobileContactIconClass}
                    src="/images/home/pin.png"
                    alt=""
                    width={32}
                    height={32}
                  />
                  <span>{footer.officeAddress}</span>
                </p>
              )}
              {footer.phone && (
                <p className={mobileContactRowClass}>
                  <Image
                    className={mobileContactIconClass}
                    src="/images/home/zalo.png"
                    alt=""
                    width={32}
                    height={32}
                  />
                  <span>{footer.phone}</span>
                </p>
              )}
              {footer.email && (
                <p className={mobileContactRowClass}>
                  <Image
                    className={mobileContactIconClass}
                    src="/images/home/mail.png"
                    alt=""
                    width={32}
                    height={32}
                  />
                  <span>{footer.email}</span>
                </p>
              )}
            </div>
          </Reveal>
        )}

        {(footer.branchesHeading || branches.length > 0) && (
          <Reveal className="mt-8" delay={360}>
            {footer.branchesHeading && (
              <h3 className="mb-3 pl-6 text-lg font-extrabold uppercase">
                {footer.branchesHeading}
              </h3>
            )}
            <div className={mobileContactListClass}>
              {branches.map((branch, index) => (
                <p className={mobileContactRowClass} key={branch}>
                  <Image
                    className={mobileContactIconClass}
                    src={`/images/home/pin-branch-0${index + 1}.png`}
                    alt=""
                    width={32}
                    height={32}
                  />
                  <span>{branch}</span>
                </p>
              ))}
            </div>
          </Reveal>
        )}
      </div>

      <div className="mx-auto hidden w-[calc(100%-2.5rem)] max-w-[1500px] gap-10 py-10 sm:grid md:w-[calc(100%-4rem)] md:grid-cols-2 lg:w-[calc(100%-6rem)] lg:grid-cols-[265px_minmax(0,1fr)_300px] lg:gap-x-8 lg:py-10 xl:grid-cols-[275px_minmax(0,1fr)_360px] xl:gap-x-10 2xl:grid-cols-[295px_minmax(0,1fr)_425px] 2xl:gap-x-12">
        <Reveal className="flex flex-col items-start">
          {footer.footerLogo && (
            <BrandLogo
              className="ml-1 w-[180px] mix-blend-multiply 2xl:w-[215px]"
              src={footer.footerLogo}
              alt={footer.footerLogoAlt}
              large
            />
          )}
          <div className="mt-3">
            <ServicesNav footer={footer} />
          </div>
        </Reveal>

        <Reveal className="md:col-span-2 lg:col-span-1" delay={120}>
          <ContactDetails footer={footer} />
        </Reveal>

        <Reveal delay={240}>
          <FollowLinks footer={footer} />
        </Reveal>
      </div>

      <div className="bg-[#0b0b0b] px-5 py-4 text-white sm:bg-charcoal">
        <Reveal className="text-center text-sm sm:text-sm" delay={360}>
          Copyright 2010 © CÔNG TY TNHH TMDV BMT DECOR |
          <br className="sm:hidden" />{" "}
          <span className="sm:inline">MST: 0317552987</span>
        </Reveal>
      </div>
    </footer>
  );
}
