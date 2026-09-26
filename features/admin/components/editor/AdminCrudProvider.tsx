"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";

import { adminResourceRegistry } from "@/features/admin/lib/mock-data/resource-registry";
import { adminCrudMockService } from "@/features/admin/services/crud-mock.service";
import type { AdminCrudRecord } from "@/features/admin/lib/types/crud";
import {
  createCapabilityProfilePage,
  deleteCapabilityProfilePage,
  getAdminCapabilityProfileContent,
  getAdminCapabilityProfilePages,
  updateCapabilityProfileContactForm,
  updateCapabilityProfileHero,
  updateCapabilityProfilePage,
} from "@/features/capability-profile/services/capability-profile.service";
import {
  getAdminQuotationPage,
  updateQuotationContactForm,
  updateQuotationEstimator,
  updateQuotationHero,
} from "@/features/quotation/services/quotation.service";

interface AdminCrudContextValue {
  getRecords: (resourceKey: string) => AdminCrudRecord[];
  createRecord: (
    resourceKey: string,
    input: AdminCrudRecord,
  ) => Promise<AdminCrudRecord>;
  updateRecord: (
    resourceKey: string,
    id: string,
    input: AdminCrudRecord,
  ) => Promise<AdminCrudRecord>;
  removeRecord: (resourceKey: string, id: string) => Promise<void>;
  reorderRecords: (
    resourceKey: string,
    records: AdminCrudRecord[],
  ) => Promise<void>;
}

const AdminCrudContext = createContext<AdminCrudContextValue | null>(null);

const initialRecords = Object.fromEntries(
  Object.entries(adminResourceRegistry).map(([key, config]) => [
    key,
    structuredClone(config.initialRecords),
  ]),
);

function mapQuotationContent(content: Awaited<ReturnType<typeof getAdminQuotationPage>>["content"]) {
  const estimator = content.estimator;
  return {
    "quotation/hero": {
      ...(initialRecords["quotation/hero"]?.[0] ?? { id: "quotation-hero" }),
      eyebrow: content.hero.eyebrow,
      title: content.hero.title,
      description: content.hero.description,
      mobileImage: content.hero.mobileImage,
      mainPhoto: content.hero.mainPhoto,
    },
    "quotation/estimator": {
      ...(initialRecords["quotation/estimator"]?.[0] ?? { id: "quotation-estimator" }),
      stepLabels: estimator.stepLabels,
      heading1: estimator.buildingType.heading,
      instruction1: estimator.buildingType.instruction,
      buildingOptions: estimator.buildingType.options,
      heading2: estimator.area.heading,
      instruction2: estimator.area.instruction,
      areaPlaceholder: estimator.area.placeholder,
      areaUnit: estimator.area.unit,
      heading3: estimator.budget.heading,
      instruction3: estimator.budget.instruction,
      budgetPlaceholder: estimator.budget.placeholder,
      budgetUnit: estimator.budget.unit,
      heading4: estimator.service.heading,
      instruction4: estimator.service.instruction,
      serviceOptions: estimator.service.options,
      resultIncludeLabel: estimator.resultIncludeLabel,
    },
    "quotation/contact-form": {
      ...(initialRecords["quotation/contact-form"]?.[0] ?? { id: "quotation-contact-form" }),
      title: content.contactForm.title,
      description: content.contactForm.subtitle,
      requiredMessage: content.contactForm.requiredMessage,
      successMessage: content.contactForm.successMessage,
    },
  } satisfies Record<string, AdminCrudRecord>;
}

function mapCapabilityProfileContent(
  content: Awaited<ReturnType<typeof getAdminCapabilityProfileContent>>["content"],
) {
  return {
    "settings/capability-profile": {
      ...(initialRecords["settings/capability-profile"]?.[0] ?? { id: "capability-profile" }),
      title: content.hero.title,
      subtitle: content.hero.subtitle,
      description: content.hero.description,
      heroImage: content.hero.heroImage,
      heroAlt: content.hero.heroImageAlt,
      decor08: content.hero.decor08,
      documentHeading: content.hero.documentHeading,
    },
    "settings/capability-profile/contact-form": {
      ...(initialRecords["settings/capability-profile/contact-form"]?.[0] ?? {
        id: "capability-profile-contact-form",
      }),
      title: content.contactForm.title,
      description: content.contactForm.subtitle,
      successMessage: content.contactForm.successMessage,
    },
  } satisfies Record<string, AdminCrudRecord>;
}

export function AdminCrudProvider({ children }: { children: React.ReactNode }) {
  const [recordsByResource, setRecordsByResource] =
    useState<Record<string, AdminCrudRecord[]>>(initialRecords);

  useEffect(() => {
    void getAdminQuotationPage()
      .then(({ content }) => {
        const mapped = mapQuotationContent(content);
        setRecordsByResource((state) => ({
          ...state,
          ...Object.fromEntries(
            Object.entries(mapped).map(([key, record]) => [key, [record]]),
          ),
        }));
      })
      .catch(() => undefined);

    void getAdminCapabilityProfileContent()
      .then(({ content }) => {
        const mapped = mapCapabilityProfileContent(content);
        setRecordsByResource((state) => ({
          ...state,
          ...Object.fromEntries(
            Object.entries(mapped).map(([key, record]) => [key, [record]]),
          ),
        }));
      })
      .catch(() => undefined);

    void getAdminCapabilityProfilePages()
      .then((pages) => {
        if (pages.length === 0) return;
        setRecordsByResource((state) => ({
          ...state,
          "settings/capability-profile-pages": pages.map((page) => ({
            id: page.id,
            title: page.title,
            image: page.imageUrl,
            imageAlt: page.title,
            order: page.metadata?.sortOrder ?? 0,
          })),
        }));
      })
      .catch(() => undefined);
  }, []);

  const getRecords = useCallback(
    (resourceKey: string) => recordsByResource[resourceKey] ?? [],
    [recordsByResource],
  );

  const createRecord = useCallback(
    async (resourceKey: string, input: AdminCrudRecord) => {
      if (resourceKey === "settings/capability-profile-pages") {
        const saved = await createCapabilityProfilePage({
          title: String(input.title ?? ""),
          imageUrl: String(input.image ?? ""),
          metadata: { sortOrder: Number(input.order ?? 0) },
        });
        setRecordsByResource((state) => ({
          ...state,
          [resourceKey]: [...(state[resourceKey] ?? []), {
            ...input,
            id: saved.id,
            image: saved.imageUrl,
            order: saved.metadata?.sortOrder ?? input.order ?? 0,
          }],
        }));
        return { ...input, id: saved.id };
      }

      const current = recordsByResource[resourceKey] ?? [];
      const next = await adminCrudMockService.create(current, input);
      setRecordsByResource((state) => ({ ...state, [resourceKey]: next }));
      return input;
    },
    [recordsByResource],
  );

  const updateRecord = useCallback(
    async (resourceKey: string, id: string, input: AdminCrudRecord) => {
      if (resourceKey === "quotation/hero") {
        await updateQuotationHero({
          eyebrow: String(input.eyebrow ?? ""),
          title: String(input.title ?? ""),
          description: String(input.description ?? ""),
          mobileImage: String(input.mobileImage ?? ""),
          mainPhoto: String(input.mainPhoto ?? ""),
        });
      } else if (resourceKey === "quotation/estimator") {
        await updateQuotationEstimator({
          stepLabels: Array.isArray(input.stepLabels) ? input.stepLabels : [],
          buildingType: {
            heading: String(input.heading1 ?? ""),
            instruction: String(input.instruction1 ?? ""),
            options: Array.isArray(input.buildingOptions) ? input.buildingOptions : [],
          },
          area: {
            heading: String(input.heading2 ?? ""),
            instruction: String(input.instruction2 ?? ""),
            placeholder: String(input.areaPlaceholder ?? ""),
            unit: String(input.areaUnit ?? ""),
          },
          budget: {
            heading: String(input.heading3 ?? ""),
            instruction: String(input.instruction3 ?? ""),
            placeholder: String(input.budgetPlaceholder ?? ""),
            unit: String(input.budgetUnit ?? ""),
          },
          service: {
            heading: String(input.heading4 ?? ""),
            instruction: String(input.instruction4 ?? ""),
            options: Array.isArray(input.serviceOptions) ? input.serviceOptions : [],
          },
          resultIncludeLabel: String(input.resultIncludeLabel ?? ""),
        });
      } else if (resourceKey === "quotation/contact-form") {
        await updateQuotationContactForm({
          title: String(input.title ?? ""),
          subtitle: String(input.description ?? ""),
          requiredMessage: String(input.requiredMessage ?? ""),
          successMessage: String(input.successMessage ?? ""),
        });
      } else if (resourceKey === "settings/capability-profile") {
        await updateCapabilityProfileHero({
          title: String(input.title ?? ""),
          description: String(input.description ?? ""),
          subtitle: String(input.subtitle ?? ""),
          documentHeading: String(input.documentHeading ?? ""),
        });
      } else if (resourceKey === "settings/capability-profile/contact-form") {
        await updateCapabilityProfileContactForm({
          title: String(input.title ?? ""),
          subtitle: String(input.description ?? ""),
          successMessage: String(input.successMessage ?? ""),
        });
      } else if (resourceKey === "settings/capability-profile-pages") {
        await updateCapabilityProfilePage(id, {
          title: String(input.title ?? ""),
          imageUrl: String(input.image ?? ""),
          metadata: { sortOrder: Number(input.order ?? 0) },
        });
      }

      const current = recordsByResource[resourceKey] ?? [];
      const next = await adminCrudMockService.update(current, id, input);
      setRecordsByResource((state) => ({ ...state, [resourceKey]: next }));
      return input;
    },
    [recordsByResource],
  );

  const removeRecord = useCallback(
    async (resourceKey: string, id: string) => {
      if (resourceKey === "settings/capability-profile-pages") {
        await deleteCapabilityProfilePage(id);
      }
      const current = recordsByResource[resourceKey] ?? [];
      const next = await adminCrudMockService.remove(current, id);
      setRecordsByResource((state) => ({ ...state, [resourceKey]: next }));
    },
    [recordsByResource],
  );

  const reorderRecords = useCallback(
    async (resourceKey: string, records: AdminCrudRecord[]) => {
      const next = await adminCrudMockService.reorder(
        recordsByResource[resourceKey] ?? [],
        records,
      );
      setRecordsByResource((state) => ({ ...state, [resourceKey]: next }));
    },
    [recordsByResource],
  );

  const value = useMemo(
    () => ({
      getRecords,
      createRecord,
      updateRecord,
      removeRecord,
      reorderRecords,
    }),
    [
      getRecords,
      createRecord,
      updateRecord,
      removeRecord,
      reorderRecords,
    ],
  );

  return (
    <AdminCrudContext.Provider value={value}>
      {children}
    </AdminCrudContext.Provider>
  );
}

export function useAdminCrud() {
  const value = useContext(AdminCrudContext);
  if (!value) {
    throw new Error("useAdminCrud must be used within AdminCrudProvider");
  }
  return value;
}
