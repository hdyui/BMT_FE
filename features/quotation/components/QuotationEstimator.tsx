"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/features/quotation/quotation.module.css";

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
        className={`${styles.estimator} ${inView ? styles.estimatorVisible : ""}`}
        ref={sectionRef}
        aria-labelledby="estimator-title"
      >
        <div className={styles.progress} aria-label="Tiến trình báo giá">
          {steps.map((label, index) => (
            <div
              className={styles.progressItem}
              style={{ animationDelay: `${index * 90}ms` }}
              key={label}
            >
              <button
                className={index === step ? styles.progressActive : undefined}
                type="button"
                onClick={() => index <= step && setStep(index)}
                aria-current={index === step ? "step" : undefined}
                disabled={index > step}
              >
                <span>{String(index + 1).padStart(2, "0")}</span> {label}
                {index === step && (
                  <Image
                    className={styles.progressUnderline}
                    src="/images/bao-gia/decor-24.jpg"
                    alt=""
                    width={459}
                    height={21}
                  />
                )}
              </button>
              <span className={styles.progressConnector} aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className={styles.stepPanel} key={step}>
          {step < 4 ? (
            <>
              <h2 id="estimator-title">{stepCopy[step][0]}</h2>
              <p className={styles.stepDescription}>{stepCopy[step][1]}</p>
              <Image
                className={styles.headingRule}
                src="/images/bao-gia/decor-27.jpg"
                alt=""
                width={1388}
                height={127}
              />
            </>
          ) : (
            <>
              <h2 id="estimator-title">ƯỚC TÍNH CỦA BẠN</h2>
              <Image
                className={styles.headingRule}
                src="/images/bao-gia/decor-27.jpg"
                alt=""
                width={1388}
                height={127}
              />
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
              label="Diện tích sàn"
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
              label="Ngân sách"
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
            <div className={styles.resultWrap}>
              <div className={styles.resultCard}>
                <Image
                  src="/images/bao-gia/decor-23.jpg"
                  alt=""
                  fill
                  sizes="900px"
                />
                <strong>
                  {formatNumber(estimate.low)}đ - {formatNumber(estimate.high)}đ
                </strong>
                <span className={styles.resultCurtain} aria-hidden="true" />
              </div>
              <p className={styles.resultCaption}>
                ~ {formatNumber(estimate.rate)} đ/m² - {building}{" "}
                {estimate.squareMeters} m² - Bao gồm{" "}
                {service.toLocaleLowerCase("vi")}
              </p>
            </div>
          )}

          <div className={styles.stepActions}>
            <button
              className={styles.stepButton}
              type="button"
              onClick={previous}
            >
              <Image
                src="/images/bao-gia/decor-33.jpg"
                alt=""
                width={167}
                height={167}
              />
              <span>Quay lại</span>
              <Image
                className={styles.buttonHoverFill}
                src="/images/bao-gia/decor-31.jpg"
                alt=""
                fill
                sizes="190px"
              />
            </button>
            {step < 4 && (
              <button
                className={`${styles.stepButton} ${styles.stepButtonNext}`}
                type="button"
                onClick={next}
              >
                <span>Tiếp tục</span>
                <Image
                  src="/images/bao-gia/decor-32.jpg"
                  alt=""
                  width={167}
                  height={167}
                />
                <Image
                  className={styles.buttonHoverFill}
                  src="/images/bao-gia/decor-31.jpg"
                  alt=""
                  fill
                  sizes="190px"
                />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className={styles.contactBand}>
        <Image
          className={styles.contactBackground}
          src="/images/bao-gia/decor-28.jpg"
          alt=""
          fill
          sizes="100vw"
        />
        <form className={styles.contactForm} onSubmit={submitContact}>
          <h2>{step === 4 ? "NHẬN BÁO GIÁ CHI TIẾT" : "LIÊN HỆ TƯ VẤN"}</h2>
          {step === 4 && (
            <p>
              Để lại thông tin, chúng tôi sẽ gửi báo giá chi tiết theo từng hạng
              mục miễn phí, không ràng buộc.
            </p>
          )}
          <Image
            className={styles.contactRule}
            src="/images/bao-gia/decor-34.jpg"
            alt=""
            width={5014}
            height={127}
          />
          <div className={styles.contactFields}>
            <label>
              <span className={styles.srOnly}>Tên khách hàng</span>
              <Image
                src="/images/bao-gia/decor-35.jpg"
                alt=""
                fill
                sizes="420px"
              />
              <input name="name" placeholder="Tên khách hàng..." required />
            </label>
            <label>
              <span className={styles.srOnly}>Số điện thoại</span>
              <Image
                src="/images/bao-gia/decor-35.jpg"
                alt=""
                fill
                sizes="420px"
              />
              <input
                name="phone"
                inputMode="tel"
                placeholder="Số điện thoại..."
                required
              />
            </label>
          </div>
          <button className={styles.contactSubmit} type="submit">
            <Image
              src="/images/bao-gia/decor-36.jpg"
              alt=""
              fill
              sizes="900px"
            />
            <span>{submitted ? "Đã nhận thông tin" : "Gửi ngay"}</span>
          </button>
        </form>
      </section>
    </>
  );
}

type OptionGridProps = {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
};

function OptionGrid({ options, selected, onSelect }: OptionGridProps) {
  return (
    <div className={styles.optionGrid} role="radiogroup">
      {options.map((option, index) => {
        const checked = selected === option;
        return (
          <button
            className={`${styles.option} ${checked ? styles.optionSelected : ""}`}
            type="button"
            role="radio"
            aria-checked={checked}
            style={{ animationDelay: `${index * 90}ms` }}
            onClick={() => onSelect(option)}
            key={option}
          >
            <span>{option}</span>
            <span className={styles.tick} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

type UnitInputProps = {
  label: string;
  placeholder: string;
  value: string;
  unit: string;
  error: string;
  valid: boolean;
  onBlur: () => void;
  onChange: (value: string) => void;
};

function UnitInput({
  label,
  placeholder,
  value,
  unit,
  error,
  valid,
  onBlur,
  onChange,
}: UnitInputProps) {
  return (
    <div className={styles.inputBlock}>
      <label htmlFor={`quotation-${label}`}>{label}</label>
      <div
        className={`${styles.unitInput} ${error ? styles.inputError : ""} ${valid ? styles.inputValid : ""}`}
      >
        <input
          id={`quotation-${label}`}
          value={value}
          placeholder={placeholder}
          inputMode="numeric"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `quotation-${label}-error` : undefined}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
        />
        <span>{unit}</span>
      </div>
      {error && (
        <p className={styles.errorMessage} id={`quotation-${label}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
