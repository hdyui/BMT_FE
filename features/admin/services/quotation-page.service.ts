import type { RemoteResourceBinding } from "@/features/admin/services/remote-binding";
import { revalidatePublicContent } from "@/features/admin/services/revalidate-public-content";
import type { AdminCrudRecord } from "@/features/admin/lib/types/crud";
import {
  BUILDING_TYPE_CODES,
  SERVICE_TYPE_CODES,
} from "@/features/quotation/services/estimate-codes";
import type { QuotationPageContent } from "@/features/quotation/services/quotation.service";
import { api } from "@/shared/lib/api/client";

/**
 * Nối các resource `quotation/*` của admin với backend:
 *  - `GET /admin/pages/quotation` + `PATCH /admin/pages/quotation/{hero|estimator|contact-form}`
 *    (mỗi PATCH thay CẢ section nên luôn gửi đủ object; GET không trả id nên id
 *    record là hằng số);
 *  - `GET/POST/PATCH /admin/price-ranges`: 16 khoảng giá thị trường (4 loại hình × 4
 *    gói) mà backend dùng để tính ước tính, hiện thành các ô `market_<loại>_<gói>_min|max`.
 */

const HERO = "quotation/hero";
const ESTIMATOR = "quotation/estimator";
const CONTACT_FORM = "quotation/contact-form";

const HERO_FIELDS = ["eyebrow", "title", "description", "mobileImage", "mainPhoto"] as const;
const CONTACT_FIELDS = ["title", "description", "requiredMessage", "successMessage"] as const;

interface PriceRange {
  id: string;
  buildingType: string;
  serviceType: string;
  unitPriceMin: number;
  unitPriceMax: number;
}

const text = (value: unknown) => (typeof value === "string" ? value : "");
const strings = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const changed = (before: AdminCrudRecord | undefined, after: AdminCrudRecord, keys: readonly string[]) =>
  keys.some((key) => !same(before?.[key], after[key]));

const marketKey = (building: number, service: number, edge: "min" | "max") =>
  `market_${building}_${service}_${edge}`;
const marketKeys = BUILDING_TYPE_CODES.flatMap((_, building) =>
  SERVICE_TYPE_CODES.flatMap((__, service) => [
    marketKey(building, service, "min"),
    marketKey(building, service, "max"),
  ]),
);

const rangeId = (building: string, service: string) => `${building}|${service}`;

export function createQuotationBinding(): RemoteResourceBinding {
  let ranges = new Map<string, PriceRange>();

  async function loadRanges() {
    const all = await api.get<PriceRange[]>("/admin/price-ranges");
    ranges = new Map(all.map((range) => [rangeId(range.buildingType, range.serviceType), range]));
  }

  function heroRecord(content: QuotationPageContent["hero"]): AdminCrudRecord {
    return {
      id: "quotation-hero",
      eyebrow: text(content.eyebrow),
      title: text(content.title),
      description: text(content.description),
      mobileImage: text(content.mobileImage),
      mainPhoto: text(content.mainPhoto),
    };
  }

  function estimatorRecord(content: QuotationPageContent["estimator"]): AdminCrudRecord {
    const record: AdminCrudRecord = {
      id: "quotation-estimator",
      stepLabels: strings(content.stepLabels),
      heading1: text(content.buildingType.heading),
      instruction1: text(content.buildingType.instruction),
      buildingOptions: strings(content.buildingType.options),
      heading2: text(content.area.heading),
      instruction2: text(content.area.instruction),
      areaPlaceholder: text(content.area.placeholder),
      areaUnit: text(content.area.unit),
      heading3: text(content.budget.heading),
      instruction3: text(content.budget.instruction),
      budgetPlaceholder: text(content.budget.placeholder),
      budgetUnit: text(content.budget.unit),
      heading4: text(content.service.heading),
      instruction4: text(content.service.instruction),
      serviceOptions: strings(content.service.options),
      resultIncludeLabel: text(content.resultIncludeLabel),
    };
    BUILDING_TYPE_CODES.forEach((building, buildingIndex) =>
      SERVICE_TYPE_CODES.forEach((service, serviceIndex) => {
        const range = ranges.get(rangeId(building, service));
        record[marketKey(buildingIndex, serviceIndex, "min")] = range?.unitPriceMin ?? "";
        record[marketKey(buildingIndex, serviceIndex, "max")] = range?.unitPriceMax ?? "";
      }),
    );
    return record;
  }

  function contactRecord(content: QuotationPageContent["contactForm"]): AdminCrudRecord {
    return {
      id: "quotation-contact-form",
      title: text(content.title),
      description: text(content.subtitle),
      requiredMessage: text(content.requiredMessage),
      successMessage: text(content.successMessage),
    };
  }

  /** Lưu các ô khoảng giá đã đổi: có sẵn thì PATCH, chưa có thì tạo mới. */
  async function saveMarketRanges(before: AdminCrudRecord | undefined, after: AdminCrudRecord) {
    let touched = false;
    for (const [buildingIndex, building] of BUILDING_TYPE_CODES.entries()) {
      for (const [serviceIndex, service] of SERVICE_TYPE_CODES.entries()) {
        const minKey = marketKey(buildingIndex, serviceIndex, "min");
        const maxKey = marketKey(buildingIndex, serviceIndex, "max");
        if (!changed(before, after, [minKey, maxKey])) continue;

        const unitPriceMin = Number(after[minKey]);
        const unitPriceMax = Number(after[maxKey]);
        if (!Number.isFinite(unitPriceMin) || !Number.isFinite(unitPriceMax)) {
          throw new Error("Khoảng giá thị trường phải là số.");
        }
        if (unitPriceMin > unitPriceMax) {
          throw new Error("Giá thấp nhất không được lớn hơn giá cao nhất.");
        }

        const existing = ranges.get(rangeId(building, service));
        if (existing) {
          await api.patch(`/admin/price-ranges/${existing.id}`, { unitPriceMin, unitPriceMax });
        } else {
          await api.post("/admin/price-ranges", {
            buildingType: building,
            serviceType: service,
            unitPriceMin,
            unitPriceMax,
          });
        }
        touched = true;
      }
    }
    if (touched) await loadRanges();
  }

  return {
    pageKey: "quotation",
    handles: (resourceKey) => resourceKey.startsWith("quotation/"),

    async load() {
      const [page] = await Promise.all([
        api.get<{ pageCode: string; content: QuotationPageContent }>("/admin/pages/quotation"),
        loadRanges(),
      ]);
      return {
        [HERO]: [heroRecord(page.content.hero)],
        [ESTIMATOR]: [estimatorRecord(page.content.estimator)],
        [CONTACT_FORM]: [contactRecord(page.content.contactForm)],
      };
    },

    async save(resourceKey, previous, next) {
      const before = previous[0];
      const after = next[0];
      if (!after) return next;

      if (resourceKey === HERO) {
        if (!changed(before, after, HERO_FIELDS)) return next;
        await api.patch("/admin/pages/quotation/hero", {
          eyebrow: text(after.eyebrow),
          title: text(after.title),
          description: text(after.description),
          mobileImage: text(after.mobileImage),
          mainPhoto: text(after.mainPhoto),
        });
      } else if (resourceKey === ESTIMATOR) {
        const contentKeys = Object.keys(after).filter(
          (key) => key !== "id" && !marketKeys.includes(key),
        );
        if (changed(before, after, contentKeys)) {
          await api.patch("/admin/pages/quotation/estimator", {
            stepLabels: strings(after.stepLabels),
            buildingType: {
              heading: text(after.heading1),
              instruction: text(after.instruction1),
              options: strings(after.buildingOptions),
            },
            area: {
              heading: text(after.heading2),
              instruction: text(after.instruction2),
              placeholder: text(after.areaPlaceholder),
              unit: text(after.areaUnit),
            },
            budget: {
              heading: text(after.heading3),
              instruction: text(after.instruction3),
              placeholder: text(after.budgetPlaceholder),
              unit: text(after.budgetUnit),
            },
            service: {
              heading: text(after.heading4),
              instruction: text(after.instruction4),
              options: strings(after.serviceOptions),
            },
            resultIncludeLabel: text(after.resultIncludeLabel),
          });
        }
        // Khoảng giá lưu ở bảng riêng và được backend đọc trực tiếp khi tính ước tính.
        await saveMarketRanges(before, after);
      } else if (resourceKey === CONTACT_FORM) {
        if (!changed(before, after, CONTACT_FIELDS)) return next;
        await api.patch("/admin/pages/quotation/contact-form", {
          title: text(after.title),
          subtitle: text(after.description),
          requiredMessage: text(after.requiredMessage),
          successMessage: text(after.successMessage),
        });
      } else {
        return next;
      }

      // Đã lưu ở backend: xóa cache trang public để website đổi ngay. Lỗi ở bước
      // này không được làm hỏng việc lưu vốn đã thành công.
      await revalidatePublicContent("/pages/quotation").catch(() => undefined);
      return [after];
    },
  };
}
