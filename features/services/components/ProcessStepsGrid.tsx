import Image from "next/image";
import { Reveal } from "@/lib/components/shared/Reveal";
import { processSteps } from "@/features/services/data/xay-dung-tron-goi";

const CARD_ASPECT = "1486/1048";

const mobileStepFrames = [
  "/images/xay-dung-tron-goi/mobile/process-step-1.png",
  "/images/xay-dung-tron-goi/mobile/process-step-2.png",
  "/images/xay-dung-tron-goi/mobile/process-step-3.png",
  "/images/xay-dung-tron-goi/mobile/process-step-4.png",
  "/images/xay-dung-tron-goi/mobile/process-step-5.png",
  "/images/xay-dung-tron-goi/mobile/process-step-6.png",
] as const;

export function ProcessStepsGrid({
  mobileMockup = false,
}: {
  mobileMockup?: boolean;
} = {}) {
  return (
    <>
      {mobileMockup && (
        <div className="mx-auto w-[calc(100%-2rem)] md:hidden">
          {[0, 2, 4].map((rowStart, rowIndex) => (
            <div className="relative pb-8" key={rowStart}>
              <div className="grid grid-cols-2 gap-x-8">
                {processSteps
                  .slice(rowStart, rowStart + 2)
                  .map((step, column) => {
                    const index = rowStart + column;

                    return (
                      <Reveal delay={index * 90} from="fade" key={step.number}>
                        <div className="group/step @container relative aspect-[1534/1350] w-full transition-[transform,filter] duration-300 ease-out active:-translate-y-1 active:drop-shadow-[0_14px_24px_rgb(36_33_34/.14)]">
                          <span
                            className="absolute top-[15%] right-[7%] bottom-[1%] left-0 rounded-br-[7%] bg-[#e9e9e9]"
                            aria-hidden="true"
                          />
                          <Image
                            className="absolute inset-0 size-full object-contain"
                            src={mobileStepFrames[index]}
                            alt=""
                            width={1534}
                            height={1350}
                            aria-hidden="true"
                          />
                          <Reveal
                            className="absolute top-[19%] -left-[9%] h-[30%] w-[18%]"
                            delay={index * 90 + 80}
                            from={column === 0 ? "fade" : "left"}
                          >
                            <span
                              className={`block size-full origin-center bg-charcoal transition-colors duration-300 group-active/step:bg-brand ${
                                index === 1 ? "scale-[0.8]" : "scale-[1.12]"
                              }`}
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
                          <Reveal
                            className="absolute top-[21%] right-[15%] bottom-[7%] left-[8%]"
                            delay={index * 90 + 180}
                            from="bottom"
                          >
                            <h3 className="font-heading pr-[25%] text-[7.1cqw] leading-[1.08] font-bold whitespace-pre-line">
                              {step.title}
                            </h3>
                            <p className="mt-[4cqw] text-justify text-[6.1cqw] leading-[1.18] text-charcoal">
                              {step.copy}
                            </p>
                          </Reveal>
                        </div>
                      </Reveal>
                    );
                  })}
              </div>

              <Reveal
                className="absolute top-[55%] left-[43%] h-0.5 w-[12%] bg-[radial-gradient(circle,#242122_0_1px,transparent_1.5px)] bg-[length:0.5625rem_0.125rem] bg-repeat-x"
                delay={rowStart * 90 + 300}
                from="fade"
                aria-hidden="true"
              />

              {rowIndex < 2 && (
                <Reveal
                  className="absolute inset-x-0 bottom-3 h-px bg-white shadow-[0_1px_2px_rgb(36_33_34/.12)]"
                  delay={rowStart * 90 + 360}
                  from="fade"
                  aria-hidden="true"
                >
                  <span className="absolute top-1/2 left-[23%] size-2.5 -translate-y-1/2 rounded-full bg-black" />
                  <span className="absolute top-1/2 right-[23%] size-2.5 -translate-y-1/2 rounded-full bg-black" />
                </Reveal>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        className={`mx-auto w-[min(57.5rem,calc(100%-2.25rem))] ${
          mobileMockup ? "max-md:hidden" : ""
        }`}
      >
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
                      <span className="absolute top-[-4%] right-[-3%] grid aspect-square w-[29%] place-items-center">
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

                      <div className="absolute top-[28%] right-[17%] bottom-[8%] left-[17%]">
                        {/* Cỡ chữ theo bề rộng card (cqw) để chữ luôn cân với
                            khung nền; từ lg chốt lại đúng 13px/11px như cũ. */}
                        <h3 className="font-heading pr-[20%] text-[4.93cqw] leading-[1.08] font-extrabold whitespace-pre-line transition-colors duration-300 group-hover/step:text-brand lg:text-[0.9rem]">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-[4.17cqw] leading-[1.18] text-charcoal text-justify text-pretty lg:text-[0.8125rem]">
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
    </>
  );
}
