"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { adminResourceRegistry } from "@/features/admin/lib/mock-data/resource-registry";
import { adminCrudMockService } from "@/features/admin/services/crud-mock.service";
import type { AdminCrudRecord } from "@/features/admin/lib/types/crud";

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

export function AdminCrudProvider({ children }: { children: React.ReactNode }) {
  const [recordsByResource, setRecordsByResource] =
    useState<Record<string, AdminCrudRecord[]>>(initialRecords);

  const getRecords = useCallback(
    (resourceKey: string) => recordsByResource[resourceKey] ?? [],
    [recordsByResource],
  );

  const createRecord = useCallback(
    async (resourceKey: string, input: AdminCrudRecord) => {
      const current = recordsByResource[resourceKey] ?? [];
      const next = await adminCrudMockService.create(current, input);
      setRecordsByResource((state) => ({ ...state, [resourceKey]: next }));
      return input;
    },
    [recordsByResource],
  );

  const updateRecord = useCallback(
    async (resourceKey: string, id: string, input: AdminCrudRecord) => {
      const current = recordsByResource[resourceKey] ?? [];
      const next = await adminCrudMockService.update(current, id, input);
      setRecordsByResource((state) => ({ ...state, [resourceKey]: next }));
      return input;
    },
    [recordsByResource],
  );

  const removeRecord = useCallback(
    async (resourceKey: string, id: string) => {
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
