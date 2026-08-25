"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "@/features/quotation/quotation.module.css";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import {
  quotationAreaInput,
  quotationBudgetInput,
  quotationBuildingTypes as buildingTypes,
  quotationNavLabels,
  quotationRates,
  quotationResultIncludeLabel,
  quotationServiceTypes as serviceTypes,
  quotationStepCopy as stepCopy,
  quotationSteps as steps,
} from "@/features/quotation/data/quotation-estimator";

/**
 * Khung ước tính báo giá + dải liên hệ.
 *
 * Mọi kích thước trước đây nằm trong quotation.module.css bằng px cứng, giờ
 * chuyển sang Tailwind. Mốc `md:` (>=768px) tương ứng đúng media query cũ, nên
 * bản desktop giữ nguyên; phần dưới 768px là các giá trị nhỏ hơn của bản cũ.
 */

/** Ô chọn / ô nhập dùng chung một chiều cao: 58px ở mobile, 68px từ md. */
const PILL_HEIGHT = "h-12 md:h-[4.25rem]";

function digitsOnly(value: string) {
  return /^\d+$/.test(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(Math.round(value));
}

export function QuotationEstimator() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLSpanElement>(null);
  const stepButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [inView, setInView] = useState(false);
  const [step, setStep] = useState(0);
  const [building, setBuilding] = useState(buildingTypes[0]);
  const [service, setService] = useState(serviceTypes[0]);
  const [area, setArea] = useState("");
  const [budget, setBudget] = useState("");
  const [areaError, setAreaError] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const [areaTouched, setAreaTouched] = useState(false);
  const [budgetTouched, setBudgetTouched] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const progress = progressRef.current;
    const track = mobileTrackRef.current;
    const activeButton = stepButtonRefs.current[step];
    if (!progress || !track || !activeButton) return;

    const updateTrack = () => {
      const progressRect = progress.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const activeStart = Math.max(0, buttonRect.left - progressRect.left);
      const activeEnd = Math.min(
        progressRect.width,
        buttonRect.right - progressRect.left,
      );

      track.style.background = `linear-gradient(to right, #f0f0f1 0 ${activeStart}px, #ef7b30 ${activeStart}px ${activeEnd}px, #f0f0f1 ${activeEnd}px 100%)`;
    };

    updateTrack();
    const resizeObserver = new ResizeObserver(updateTrack);
    resizeObserver.observe(progress);
    resizeObserver.observe(activeButton);
    return () => resizeObserver.disconnect();
  }, [step]);

  const estimate = useMemo(() => {
    const squareMeters = digitsOnly(area) ? Number(area) : 80;
    const [lowRate, highRate] = quotationRates[service];
    return {
      low: squareMeters * lowRate,
      high: squareMeters * highRate,
      rate: Math.round((lowRate + highRate) / 2 / 50000) * 50000,
      squareMeters,
    };
  }, [area, service]);

  function validateArea() {
    setAreaTouched(true);
    if (!area.trim()) {
      setAreaError("Vui lòng nhập diện tích.");
      return false;
    }
    if (!digitsOnly(area)) {
      setAreaError("Vui lòng chỉ nhập số");
      return false;
    }
    setAreaError("");
    return true;
  }

  function validateBudget() {
    setBudgetTouched(true);
    const plain = budget.replaceAll(".", "");
    if (!plain.trim()) {
      setBudgetError("Vui lòng nhập ngân sách.");
      return false;
    }
    if (!digitsOnly(plain)) {
      setBudgetError("Vui lòng chỉ nhập số");
      return false;
    }
    setBudgetError("");
    return true;
  }

  function next() {
    if (step === 1 && !validateArea()) return;
    if (step === 2 && !validateBudget()) return;
    setStep((current) => Math.min(current + 1, 4));
  }

  function previous() {
    setStep((current) => Math.max(current - 1, 0));
  }

  function updateArea(value: string) {
    setArea(value);
    if (!areaTouched) return;
    if (!value.trim()) setAreaError("Vui lòng nhập diện tích.");
    else if (!digitsOnly(value)) setAreaError("Vui lòng chỉ nhập số");
    else setAreaError("");
  }

  function updateBudget(value: string) {
    const plain = value.replaceAll(".", "");
    if (digitsOnly(plain)) setBudget(formatNumber(Number(plain)));
    else setBudget(value);
    if (!budgetTouched) return;
    if (!plain.trim()) setBudgetError("Vui lòng nhập ngân sách.");
    else if (!digitsOnly(plain)) setBudgetError("Vui lòng chỉ nhập số");
    else setBudgetError("");
  }

  return (
    <>
      <section
        className={`mx-auto min-h-[20rem] w-[calc(100%_-_2rem)] bg-white pt-6 md:min-h-[32.5rem] md:w-[min(57.5rem,calc(100%_-_2rem))] md:pt-[1.5625rem] ${
          inView ? styles.estimatorVisible : ""
        }`}
        ref={sectionRef}
        aria-labelledby="estimator-title"
      >
        {/* Mobile: dải tiến trình cuộn ngang có snap; từ md giãn đều 5 cột. */}
        <div
          className={`relative flex min-h-7 items-center after:absolute after:inset-x-0 after:bottom-0 after:z-0 after:hidden after:h-[0.3125rem] after:bg-[#f0f0f1] after:content-[''] md:grid md:min-h-[2.625rem] md:grid-cols-5 md:after:block ${styles.progressScroller}`}
          ref={progressRef}
          aria-label="Tiến trình báo giá"
        >
          <span
            className="absolute inset-x-0 bottom-0 z-[1] h-[0.1875rem] md:hidden"
            ref={mobileTrackRef}
            aria-hidden="true"
          />
          {steps.map((label, index) => (
            <div
              className={`contents md:relative md:z-[1] md:flex md:min-w-0 md:items-center md:justify-start md:self-stretch ${styles.progressItem}`}
              style={{
                animationDelay: `${index * 90}ms`,
              }}
              key={label}
            >
              <button
                className={`relative z-[2] flex h-auto min-w-0 shrink-0 items-center justify-center border-0 bg-transparent px-0 pb-0 text-[0.5625rem] leading-none whitespace-nowrap disabled:cursor-default min-[480px]:text-[0.625rem] md:h-full md:shrink md:justify-start md:px-0 md:pb-[0.3125rem] md:text-sm md:leading-normal md:disabled:opacity-100 ${styles.progressMobileItem} ${
                  index === step ? "text-[#ef7b30]" : "text-[#3c3839]"
                }`}
                ref={(node) => {
                  stepButtonRefs.current[index] = node;
                }}
                type="button"
                onClick={() => index <= step && setStep(index)}
                aria-current={index === step ? "step" : undefined}
                disabled={index > step}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <span className="mr-0.5 md:mr-1">
                  {String(index + 1).padStart(2, "0")}
                </span>{" "}
                {label}
                {index === step && (
                  <Image
                    className="absolute bottom-0 left-0 z-[3] hidden h-[0.3125rem] w-full object-fill md:block"
                    src="/images/bao-gia/decor-24.jpg"
                    alt=""
                    width={459}
                    height={21}
                  />
                )}
              </button>
              <span
                className={`relative mx-[0.1875rem] h-px min-w-1 flex-1 self-center bg-[#171415] md:mr-2 md:ml-3 md:h-0.5 md:min-w-[1.5625rem] ${styles.progressMobileItem} ${index === steps.length - 1 ? "hidden md:block" : "block"}`}
                style={{ animationDelay: `${index * 90}ms` }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        <div
          className={`pt-5 pb-6 text-center md:pt-7 md:pb-[3.375rem] ${styles.animStepPanel}`}
          key={step}
        >
          {step < 4 ? (
            <>
              <h2
                id="estimator-title"
                className="m-0 text-[1.5rem] leading-[1.08] font-extrabold md:text-[clamp(1.875rem,3vw,2.5rem)] md:leading-[1.1]"
              >
                {stepCopy[step][0]}
              </h2>
              <p className="mx-auto mt-2 mb-0 min-h-8 max-w-[26rem] text-[0.8125rem] leading-[1.35] md:mt-[0.8125rem] md:min-h-0 md:max-w-none md:text-[0.9375rem] md:leading-5">
                {stepCopy[step][1]}
              </p>
              <HeadingRule />
            </>
          ) : (
            <>
              <h2
                id="estimator-title"
                className="m-0 text-[1.5rem] leading-[1.08] font-extrabold md:text-[clamp(1.875rem,3vw,2.5rem)] md:leading-[1.1]"
              >
                ƯỚC TÍNH CỦA BẠN
              </h2>
              <HeadingRule />
            </>
          )}

          {step === 0 && (
            <OptionGrid
              options={buildingTypes}
              selected={building}
              onSelect={setBuilding}
            />
          )}

          {step === 1 && (
            <UnitInput
              id="area"
              placeholder={quotationAreaInput.placeholder}
              value={area}
              unit={quotationAreaInput.unit}
              error={areaError}
              valid={areaTouched && !areaError && digitsOnly(area)}
              onBlur={validateArea}
              onChange={updateArea}
            />
          )}

          {step === 2 && (
            <UnitInput
              id="budget"
              placeholder={quotationBudgetInput.placeholder}
              value={budget}
              unit={quotationBudgetInput.unit}
              error={budgetError}
              valid={
                budgetTouched &&
                !budgetError &&
                digitsOnly(budget.replaceAll(".", ""))
              }
              onBlur={validateBudget}
              onChange={updateBudget}
            />
          )}

          {step === 3 && (
            <OptionGrid
              options={serviceTypes}
              selected={service}
              onSelect={setService}
            />
          )}

          {step === 4 && (
            <div>
              <div
                className={`group/result relative grid h-[3.25rem] w-full place-items-center overflow-hidden rounded-full border border-transparent bg-[#f2f2f4] transition-[border-color,background-color] duration-[250ms] hover:border-[#ef7b30] hover:bg-[#ececee] md:h-19 ${styles.animResult}`}
              >
                <Image
                  className="z-0 object-fill"
                  src="/images/bao-gia/decor-23.jpg"
                  alt=""
                  fill
                  sizes="900px"
                />
                <strong className="relative z-[1] text-[clamp(1.3125rem,6.3vw,1.875rem)] leading-none md:text-[clamp(1.75rem,3.2vw,2.6875rem)]">
                  {formatNumber(estimate.low)}đ - {formatNumber(estimate.high)}đ
                </strong>
                <span
                  className={`absolute inset-0 z-[2] bg-white ${styles.animCurtain}`}
                  aria-hidden="true"
                />
              </div>
              <p
                className={`mt-5 mb-0 text-[0.8125rem] leading-[1.45] md:text-[0.9375rem] md:leading-normal ${styles.animResultCaption}`}
              >
                ~ {formatNumber(estimate.rate)} đ/m² - {building}{" "}
                {estimate.squareMeters} {quotationAreaInput.unit} - {quotationResultIncludeLabel}{" "}
                {service.toLocaleLowerCase("vi")}
              </p>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between md:mt-[2.1875rem]">
            <StepButton onClick={previous} label={quotationNavLabels.back} icon="left" />
            {step < 4 && (
              <StepButton onClick={next} label={quotationNavLabels.next} icon="right" />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function HeadingRule() {
  return (
    <span className="mx-auto mt-1.5 mb-4 block h-[1.125rem] w-[10.5rem] max-w-full -translate-y-[10px] md:mt-2 md:mb-[1.375rem] md:h-[1.4375rem] md:w-62.5 md:translate-y-0">
      <Image
        className={`size-full object-fill ${styles.animRule}`}
        src="/images/bao-gia/decor-27.jpg"
        alt=""
        width={1388}
        height={127}
      />
    </span>
  );
}

function StepButton({
  onClick,
  label,
  icon,
}: {
  onClick: () => void;
  label: string;
  icon: "left" | "right";
}) {
  const arrow = (
    <Image
      className="relative z-[2] size-7 rounded-full object-cover md:size-[1.9375rem]"
      src={
        icon === "left"
          ? "/images/bao-gia/decor-33.jpg"
          : "/images/bao-gia/decor-32.jpg"
      }
      alt=""
      width={167}
      height={167}
    />
  );

  return (
    <button
      className={`relative flex h-12 items-center gap-2 overflow-hidden rounded-full border-0 text-[#231f20] transition-[color,transform,translate,scale] duration-300 ease-out hover:-translate-y-[5px] hover:scale-[1.02] focus-visible:-translate-y-[5px] focus-visible:scale-[1.02] active:translate-y-[2px] active:scale-[0.99] md:h-[3.625rem] md:min-w-[10.3125rem] md:justify-center md:gap-2.5 md:bg-white md:px-[1.375rem] md:text-[#231f20] md:hover:text-white md:focus-visible:text-white ${icon === "right" ? "min-w-[8.5rem] justify-center bg-[#231f20] px-3 text-white" : "min-w-0 justify-start bg-white px-0"} ${styles.stepButton}`}
      type="button"
      onClick={onClick}
    >
      {icon === "left" && arrow}
      <span className="relative z-[2] text-sm md:text-[0.9375rem]">
        {label}
      </span>
      {icon === "right" && arrow}
      <Image
        className={`z-[1] object-fill opacity-0 transition-opacity duration-[250ms] ${styles.buttonHoverFill}`}
        src="/images/bao-gia/decor-31.jpg"
        alt=""
        fill
        sizes="190px"
      />
    </button>
  );
}

type OptionGridProps = {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
};

function OptionGrid({ options, selected, onSelect }: OptionGridProps) {
  return (
    <div
      className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-x-[1.125rem] md:gap-y-[0.8125rem]"
      role="radiogroup"
    >
      {options.map((option, index) => {
        const checked = selected === option;
        return (
          <button
            className={`relative flex ${PILL_HEIGHT} min-w-0 items-center overflow-hidden rounded-full border bg-white px-3 text-left transition-[border-color,background-color,translate,scale] duration-300 ease-out hover:-translate-y-[5px] hover:scale-[1.02] hover:border-[#ef7b30] hover:bg-[#f2f2f4] active:translate-y-[2px] active:scale-[0.99] md:border-2 md:px-[1.8125rem] ${
              checked
                ? `border-[#ef7b30] bg-[#f2f2f4] ${styles.optionSelected}`
                : "border-[#ededee]"
            } ${styles.animOption}`}
            type="button"
            role="radio"
            aria-checked={checked}
            style={{ animationDelay: `${index * 90}ms` }}
            onClick={() => onSelect(option)}
            key={option}
          >
            <span className="relative z-[1] text-[0.8125rem] leading-[1.2] md:text-[0.9375rem] md:leading-normal">
              {option}
            </span>
            <span
              className={`relative z-[1] ml-auto block h-[1.125rem] w-[0.625rem] shrink-0 border-r border-b border-[#ef7b30] md:h-[1.6875rem] md:w-[0.9375rem] md:border-r-2 md:border-b-2 ${styles.animTick}`}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

type UnitInputProps = {
  id: string;
  placeholder: string;
  value: string;
  unit: string;
  error: string;
  valid: boolean;
  onBlur: () => void;
  onChange: (value: string) => void;
};

function UnitInput({
  id,
  placeholder,
  value,
  unit,
  error,
  valid,
  onBlur,
  onChange,
}: UnitInputProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[56.25rem] text-left ${styles.animInputBlock}`}
    >
      <div
        className={`relative flex ${PILL_HEIGHT} items-center overflow-hidden rounded-full border-2 bg-[#f2f2f4] transition-[border-color,background-color] duration-[240ms] focus-within:border-[#ef7b30] ${
          error
            ? "border-[#d92d20]"
            : valid
              ? "border-[#ef7b30]"
              : "border-[#ef7b30]"
        }`}
      >
        <input
          className="relative z-[1] h-full w-full border-0 bg-transparent pr-[4.25rem] pl-[1.75rem] font-[inherit] text-[#231f20] outline-0"
          id={`quotation-${id}`}
          aria-label={placeholder}
          value={value}
          placeholder={placeholder}
          inputMode="numeric"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `quotation-${id}-error` : undefined}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="absolute right-7 z-[1] text-sm md:text-[0.9375rem]">
          {unit}
        </span>
      </div>
      {error && (
        <p
          className={`mt-[0.4375rem] mb-0 ml-5 text-[0.8125rem] text-[#b42318] md:ml-[1.5625rem] ${styles.animError}`}
          id={`quotation-${id}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
