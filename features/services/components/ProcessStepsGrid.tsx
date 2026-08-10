import Image from "next/image";
import { Reveal } from "@/lib/components/shared/Reveal";
import { processSteps } from "@/features/services/data/xay-dung-tron-goi";

const CARD_ASPECT = "1486/1048";

export function ProcessStepsGrid() {
  return (
    <div className="mx-auto w-[min(57.5rem,calc(100%-2.25rem))]">
      {[0, 3].map((rowStart) => (
        <div className="relative" key={rowStart}>
          <div className="grid gap-x-[7%] gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.slice(rowStart, rowStart + 3).map((step, column) => {
              const index = rowStart + column;

              return (
                <Reveal delay={index * 110} from="fade" key={step.number}>
                  <div
                    className="group/step @container relative w-full transition-[transform,filter] duration-300 ease-out hover:-translate-y-1.5 hover:drop-shadow-[0_18px_28px_rgb(36_33_34/.16)]"
                    style={{ aspectRatio: CARD_ASPECT }}
                  >
                    {/* Nền card là layer gốc khách hàng cung cấp. */}
                    <Image
                      className="absolute top-[19%] left-[7%] h-[81%] w-[81%] object-fill"
                      src="/images/xay-dung-tron-goi/step-card-background.png"
                      alt=""
                      width={1202}
                      height={848}
                      aria-hidden="true"
                    />

                    {/* Số thứ tự trượt ngang độc lập, đồng thời đổi cam khi hover.
                        `right-56` cũ là 224px cứng nên số chạy lệch hẳn ra ngoài
                        card khi card rộng hơn (tablet/mobile); đổi sang % để bám
                        đúng vị trí desktop ở mọi bề rộng. */}
                    <Reveal
                      className="absolute top-[35%] left-[-3%] h-[52%] w-[18%]"
                      delay={index * 110 + 80}
                      from="left"
                    >
                      <span
                        className="block size-full bg-charcoal transition-colors duration-300 group-hover/step:bg-brand"
                        style={{
                          maskImage: `url(${step.numeralImage})`,
                          maskPosition: "center",
                          maskRepeat: "no-repeat",
                          maskSize: "contain",
                          WebkitMaskImage: `url(${step.numeralImage})`,
                          WebkitMaskPosition: "center",
                          WebkitMaskRepeat: "no-repeat",
                          WebkitMaskSize: "contain",
                        }}
                        aria-hidden="true"
                      />
                    </Reveal>

                    {/* Icon, tiêu đề và mô tả đi lên cùng nhau sau số thứ tự. */}
                    <Reveal
                      className="absolute inset-0"
                      delay={index * 110 + 180}
                      from="bottom"
                    >
                      <span className="absolute top-0 right-[2%] grid aspect-square w-[29%] place-items-center">
                        <Image
                          className="absolute inset-0 size-full object-contain"
                          src="/images/xay-dung-tron-goi/icon-circle-bg.png"
                          alt=""
                          width={630}
                          height={630}
                          aria-hidden="true"
                        />
                        <Image
                          className="relative size-[85%] object-contain bottom-[28%] left-[17%]"
                          src={step.icon}
                          alt=""
                          width={340}
                          height={340}
                          aria-hidden="true"
                        />
                      </span>

                      <div className="absolute top-[28%] right-[17%] bottom-[8%] left-[27%]">
                        {/* Cỡ chữ theo bề rộng card (cqw) để chữ luôn cân với
                            khung nền; từ lg chốt lại đúng 13px/11px như cũ. */}
                        <h3 className="font-heading pr-[20%] text-[4.93cqw] leading-tight font-bold whitespace-pre-line transition-colors duration-300 group-hover/step:text-brand lg:text-[0.8125rem]">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-[4.17cqw] leading-snug text-muted-foreground text-pretty lg:text-[0.6875rem]">
                          {step.copy}
                        </p>
                      </div>
                    </Reveal>

                    {column < 2 && (
                      <Reveal
                        className="pointer-events-none absolute top-[80%] -right-[25%] hidden w-[25%] lg:block"
                        from="fade"
                        delay={index * 110 + 320}
                      >
                        <Image
                          className="h-auto w-full"
                          src="/images/xay-dung-tron-goi/step-dots.png"
                          alt=""
                          width={575}
                          height={8}
                          aria-hidden="true"
                        />
                      </Reveal>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>

          {rowStart === 0 && (
            <Reveal
              className="mt-5 mb-8 hidden lg:block"
              from="fade"
              delay={460}
            >
              <Image
                className="h-auto w-full"
                src="/images/xay-dung-tron-goi/step-row-line.png"
                alt=""
                width={4629}
                height={86}
                aria-hidden="true"
              />
            </Reveal>
          )}
        </div>
      ))}
    </div>
  );
}
