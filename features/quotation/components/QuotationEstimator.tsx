"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/features/quotation/quotation.module.css";

/**
 * Khung ước tính báo giá + dải liên hệ.
 *
 * Mọi kích thước trước đây nằm trong quotation.module.css bằng px cứng, giờ
 * chuyển sang Tailwind. Mốc `md:` (>=768px) tương ứng đúng media query cũ, nên
 * bản desktop giữ nguyên; phần dưới 768px là các giá trị nhỏ hơn của bản cũ.
 */

const steps = [
  "Loại hình",
  "Diện tích",
  "Ngân sách",
  "Gói",
  "Ước tính",
] as const;
const buildingTypes = [
  "Nhà ở",
  "Văn phòng",
  "Thẩm mỹ viện, showroom",
  "Nhà hàng, khách sạn",
];
const serviceTypes = [
  "Xây dựng trọn gói",
  "Thiết kế kiến trúc & nội thất",
  "Thi công xây dựng",
  "Cải tạo & sửa chữa",
];

const stepCopy = [
  [
    "BẠN CẦN THIẾT KẾ GÌ?",
    "Chọn loại không gian phù hợp với căn nhà của anh/chị",
  ],
  ["DIỆN TÍCH BAO NHIÊU?", "Điền diện tích sàn ước tính"],
  [
    "NGÂN SÁCH CỦA ANH CHỊ?",
    "Một khoảng ngân sách thực tế giúp chúng tôi gợi ý gói phù hợp",
  ],
  ["CHỌN MỨC DỊCH VỤ", "Có thể đổi bất cứ lúc nào, chỉ ảnh hưởng đến ước tính"],
] as const;

/** Ô chọn / ô nhập dùng chung một chiều cao: 58px ở mobile, 68px từ md. */
const PILL_HEIGHT = "h-[3.625rem] md:h-[4.25rem]";

function digitsOnly(value: string) {
  return /^\d+$/.test(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(Math.round(value));
}

export function QuotationEstimator() {
  const sectionRef = useRef<HTMLElement>(null);
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
  const [submitted, setSubmitted] = useState(false);

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

  const estimate = useMemo(() => {
    const squareMeters = digitsOnly(area) ? Number(area) : 80;
    const rates: Record<string, [number, number]> = {
      "Xây dựng trọn gói": [315000, 402500],
      "Thiết kế kiến trúc & nội thất": [220000, 285000],
      "Thi công xây dựng": [4800000, 6200000],
      "Cải tạo & sửa chữa": [2100000, 3800000],
    };
    const [lowRate, highRate] = rates[service];
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

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <section
        className={`mx-auto min-h-[32.5rem] w-[min(57.5rem,calc(100%-2rem))] bg-white pt-3 md:pt-[1.5625rem] ${
          inView ? styles.estimatorVisible : ""
        }`}
        ref={sectionRef}
        aria-labelledby="estimator-title"
      >
        {/* Mobile: dải tiến trình cuộn ngang có snap; từ md giãn đều 5 cột. */}
        <div
          className={`relative flex min-h-[2.625rem] items-start overflow-x-auto after:absolute after:inset-x-0 after:bottom-0 after:z-0 after:h-[0.3125rem] after:bg-[#f0f0f1] after:content-[''] md:grid md:grid-cols-5 md:items-center md:overflow-visible ${styles.progressScroller}`}
          style={{ scrollSnapType: "x mandatory" }}
          aria-label="Tiến trình báo giá"
        >
          {steps.map((label, index) => (
            <div
              className={`relative z-[1] flex min-w-0 shrink-0 items-center self-stretch md:shrink ${styles.progressItem}`}
              style={{
                animationDelay: `${index * 90}ms`,
                scrollSnapAlign: "start",
              }}
              key={label}
            >
              <button
                className={`relative z-[2] flex h-full items-center border-0 bg-transparent pb-[0.3125rem] text-xs whitespace-nowrap disabled:cursor-default disabled:opacity-100 md:text-sm ${
                  index === step ? "text-[#ef7b30]" : "text-[#3c3839]"
                }`}
                type="button"
                onClick={() => index <= step && setStep(index)}
                aria-current={index === step ? "step" : undefined}
                disabled={index > step}
              >
                <span className="mr-1">
                  {String(index + 1).padStart(2, "0")}
                </span>{" "}
                {label}
                {index === step && (
                  <Image
                    className="absolute bottom-0 left-0 z-[3] h-[0.3125rem] w-full object-fill"
                    src="/images/bao-gia/decor-24.jpg"
                    alt=""
                    width={459}
                    height={21}
                  />
                )}
              </button>
              <span
                className="relative block h-0.5 w-[2.125rem] flex-none bg-[#171415] md:w-auto md:min-w-[1.5625rem] md:flex-1"
                style={{ marginLeft: "0.75rem", marginRight: "0.5rem" }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        <div
          className={`pt-[1.5625rem] pb-[2.375rem] text-center md:pt-7 md:pb-[3.375rem] ${styles.animStepPanel}`}
          key={step}
        >
          {step < 4 ? (
            <>
              <h2
                id="estimator-title"
                className="m-0 text-[1.8125rem] leading-[1.1] font-extrabold md:text-[clamp(1.875rem,3vw,2.5rem)]"
              >
                {stepCopy[step][0]}
              </h2>
              <p className="mt-[0.8125rem] mb-0 min-h-9 text-sm md:min-h-0 md:text-[0.9375rem]">
                {stepCopy[step][1]}
              </p>
              <HeadingRule />
            </>
          ) : (
            <>
              <h2
                id="estimator-title"
                className="m-0 text-[1.8125rem] leading-[1.1] font-extrabold md:text-[clamp(1.875rem,3vw,2.5rem)]"
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
              placeholder="Diện tích sàn..."
              value={area}
              unit="m²"
              error={areaError}
              valid={areaTouched && !areaError && digitsOnly(area)}
              onBlur={validateArea}
              onChange={updateArea}
            />
          )}

          {step === 2 && (
            <UnitInput
              id="budget"
              placeholder="Ngân sách ..."
              value={budget}
              unit="đ"
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
                className={`group/result relative grid h-[4.25rem] w-full place-items-center overflow-hidden rounded-full border border-transparent bg-[#f2f2f4] transition-[border-color,background-color] duration-[250ms] hover:border-[#ef7b30] hover:bg-[#ececee] md:h-19 ${styles.animResult}`}
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
                {estimate.squareMeters} m² - Bao gồm{" "}
                {service.toLocaleLowerCase("vi")}
              </p>
            </div>
          )}

          <div className="mt-[1.5625rem] flex items-center justify-between md:mt-[2.1875rem]">
            <StepButton onClick={previous} label="Quay lại" icon="left" />
            {step < 4 && (
              <StepButton onClick={next} label="Tiếp tục" icon="right" />
            )}
          </div>
        </div>
      </section>

      <section className="relative min-h-[24.375rem] overflow-hidden text-white md:min-h-[20.125rem]">
        <Image
          className="z-0 object-cover object-top"
          src="/images/bao-gia/decor-28.jpg"
          alt=""
          fill
          sizes="100vw"
        />
        <form
          className="relative z-[1] mx-auto w-[min(56.25rem,calc(100%-2rem))] pt-22 pb-[2.8125rem] md:pt-25"
          onSubmit={submitContact}
        >
          <h2 className="m-0 text-[1.5625rem] leading-[1.1] font-extrabold md:text-[1.8125rem]">
            {step === 4 ? "NHẬN BÁO GIÁ CHI TIẾT" : "LIÊN HỆ TƯ VẤN"}
          </h2>
          {step === 4 && (
            <p className="mt-1.5 mb-0 text-sm">
              Để lại thông tin, chúng tôi sẽ gửi báo giá chi tiết theo từng hạng
              mục miễn phí, không ràng buộc.
            </p>
          )}
          <Image
            className="my-3.5 h-0.5 w-full object-fill"
            src="/images/bao-gia/decor-34.jpg"
            alt=""
            width={5014}
            height={127}
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-[3.125rem]">
            <ContactField name="name" label="Tên khách hàng" />
            <ContactField
              name="phone"
              label="Số điện thoại"
              inputMode="tel"
            />
          </div>
          <button
            className="relative mt-3 grid h-[2.375rem] w-full place-items-center overflow-hidden rounded-full border-0 bg-[#231f20] text-white transition-[transform,filter] duration-[240ms] hover:-translate-y-0.5 hover:brightness-[1.18]"
            type="submit"
          >
            <Image
              className="z-0 object-fill"
              src="/images/bao-gia/decor-36.jpg"
              alt=""
              fill
              sizes="900px"
            />
            <span className="relative z-[1] font-bold">
              {submitted ? "Đã nhận thông tin" : "Gửi ngay"}
            </span>
          </button>
        </form>
      </section>
    </>
  );
}

function HeadingRule() {
  return (
    <Image
      className={`mx-auto mt-2 mb-[1.375rem] h-[1.4375rem] w-[13.4375rem] max-w-full object-fill md:w-62.5 ${styles.animRule}`}
      src="/images/bao-gia/decor-27.jpg"
      alt=""
      width={1388}
      height={127}
    />
  );
}

function ContactField({
  name,
  label,
  inputMode,
}: {
  name: string;
  label: string;
  inputMode?: "tel";
}) {
  return (
    <label className="relative h-[2.375rem] overflow-hidden rounded-full focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-white">
      <span className="sr-only">{label}</span>
      <Image
        className="z-0 object-fill"
        src="/images/bao-gia/decor-35.jpg"
        alt=""
        fill
        sizes="420px"
      />
      <input
        className="relative z-[1] h-full w-full border-0 bg-transparent px-[1.125rem] font-[inherit] text-[#231f20] outline-0"
        name={name}
        inputMode={inputMode}
        placeholder={`${label}...`}
        required
      />
    </label>
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
      className={`relative flex h-13 min-w-35 items-center justify-center gap-2.5 overflow-hidden rounded-full border-0 bg-white px-3.5 text-[#231f20] transition-[color,transform] duration-[250ms] hover:-translate-y-0.5 hover:text-white focus-visible:-translate-y-0.5 focus-visible:text-white md:h-[3.625rem] md:min-w-[10.3125rem] md:px-[1.375rem] ${styles.stepButton}`}
      type="button"
      onClick={onClick}
    >
      {icon === "left" && arrow}
      <span className="relative z-[2] text-sm md:text-[0.9375rem]">{label}</span>
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
      className="grid grid-cols-1 gap-[0.6875rem] md:grid-cols-2 md:gap-x-[1.125rem] md:gap-y-[0.8125rem]"
      role="radiogroup"
    >
      {options.map((option, index) => {
        const checked = selected === option;
        return (
          <button
            className={`relative flex ${PILL_HEIGHT} items-center overflow-hidden rounded-full border-2 bg-white px-5 text-left transition-[border-color,background-color] duration-[240ms] hover:border-[#ef7b30] hover:bg-[#f2f2f4] md:px-[1.8125rem] ${
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
            <span className="relative z-[1] text-sm md:text-[0.9375rem]">
              {option}
            </span>
            <span
              className={`relative z-[1] ml-auto block h-[1.6875rem] w-[0.9375rem] border-r-2 border-b-2 border-[#ef7b30] ${styles.animTick}`}
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
