"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { adminResourceRegistry } from "@/features/admin/lib/mock-data/resource-registry";
import { adminCrudMockService } from "@/features/admin/services/crud-mock.service";
import { getRemoteBinding } from "@/features/admin/services/remote-bindings";
import { adminCatalogApiClient } from "@/features/admin/services/catalog-api.client";
import {
  CONTACT_PAGE_ADMIN_API_RESOURCE_KEYS,
  ABOUT_ADMIN_API_RESOURCE_KEYS,
  HOME_ADMIN_API_RESOURCE_KEYS,
  NEWS_PAGE_ADMIN_API_RESOURCE_KEYS,
  PROJECTS_PAGE_ADMIN_API_RESOURCE_KEYS,
  RECRUITMENT_PAGE_ADMIN_API_RESOURCE_KEYS,
  SETTINGS_ADMIN_API_RESOURCE_KEYS,
  isFixedPageAdminApiResourceKey,
  type AdminApiResourceKey,
} from "@/features/admin/services/catalog-api.types";
import type { AdminCrudRecord } from "@/features/admin/lib/types/crud";
import { ApiError } from "@/shared/lib/api/errors";

/**
 * Trạng thái tải dữ liệu từ backend của một resource:
 * `none` = resource chỉ chạy mock; còn lại chỉ có ý nghĩa với resource đã nối API.
 */
export interface RemoteState {
  status: "none" | "idle" | "loading" | "ready" | "error";
  error?: string;
}

const apiResourceKeys = new Set([
  "projects/list",
  "projects/details",
  "news/list",
  "recruitment/jobs",
  ...HOME_ADMIN_API_RESOURCE_KEYS,
  ...CONTACT_PAGE_ADMIN_API_RESOURCE_KEYS,
  ...ABOUT_ADMIN_API_RESOURCE_KEYS,
  ...SETTINGS_ADMIN_API_RESOURCE_KEYS,
  ...PROJECTS_PAGE_ADMIN_API_RESOURCE_KEYS,
  ...NEWS_PAGE_ADMIN_API_RESOURCE_KEYS,
  ...RECRUITMENT_PAGE_ADMIN_API_RESOURCE_KEYS,
]);

interface AdminCrudContextValue {
  getRecords: (resourceKey: string) => AdminCrudRecord[];
  loadRecords: (resourceKey: string) => Promise<AdminCrudRecord[]>;
  loadRecord: (
    resourceKey: string,
    id: string,
  ) => Promise<AdminCrudRecord | null>;
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
  getRemoteState: (resourceKey: string) => RemoteState;
  /** Tải dữ liệu của trang chứa resource từ backend (chỉ tải một lần, trừ khi lần trước lỗi). */
  loadRemote: (resourceKey: string) => Promise<void>;
}

const AdminCrudContext = createContext<AdminCrudContextValue | null>(null);

function createInitialRecords() {
  return Object.fromEntries(
    Object.entries(adminResourceRegistry).map(([key, config]) => [
      key,
      apiResourceKeys.has(key) || getRemoteBinding(key)
        ? []
        : structuredClone(config.initialRecords),
    ]),
  );
}

function describeLoadError(error: unknown) {
  if (error instanceof ApiError && (error.status === 404 || error.status === 409)) {
    return "Nội dung trang này chưa được khởi tạo trên máy chủ. Vui lòng liên hệ đội backend để tạo dữ liệu ban đầu.";
  }
  return error instanceof Error ? error.message : "Không tải được nội dung.";
}

export function AdminCrudProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recordsByResource, setRecordsByResource] =
    useState<Record<string, AdminCrudRecord[]>>(createInitialRecords);
  const [remoteStates, setRemoteStates] = useState<Record<string, RemoteState>>({});
  const remoteInFlight = useRef(new Set<string>());
  const loadedApiResourcesRef = useRef(new Map<string, { records: AdminCrudRecord[]; expiresAt: number }>());
  const inFlightApiResourcesRef = useRef(
    new Map<string, Promise<AdminCrudRecord[]>>(),
  );

  const getRecords = useCallback(
    (resourceKey: string) => recordsByResource[resourceKey] ?? [],
    [recordsByResource],
  );

  const getRemoteState = useCallback(
    (resourceKey: string): RemoteState => {
      const binding = getRemoteBinding(resourceKey);
      if (!binding) return { status: "none" };
      return remoteStates[binding.pageKey] ?? { status: "idle" };
    },
    [remoteStates],
  );

  const loadRemote = useCallback(async (resourceKey: string) => {
    const binding = getRemoteBinding(resourceKey);
    if (!binding || remoteInFlight.current.has(binding.pageKey)) return;

    remoteInFlight.current.add(binding.pageKey);
    setRemoteStates((state) => ({ ...state, [binding.pageKey]: { status: "loading" } }));
    try {
      const loaded = await binding.load();
      setRecordsByResource((state) => ({ ...state, ...loaded }));
      setRemoteStates((state) => ({ ...state, [binding.pageKey]: { status: "ready" } }));
    } catch (error) {
      setRemoteStates((state) => ({
        ...state,
        [binding.pageKey]: { status: "error", error: describeLoadError(error) },
      }));
    } finally {
      remoteInFlight.current.delete(binding.pageKey);
    }
  }, []);

  const loadRecords = useCallback(async (resourceKey: string) => {
    if (!apiResourceKeys.has(resourceKey)) return [];

    const cached = loadedApiResourcesRef.current.get(resourceKey);
    if (cached && cached.expiresAt > Date.now()) return cached.records;

    const existingRequest = inFlightApiResourcesRef.current.get(resourceKey);
    if (existingRequest) return existingRequest;

    const request = adminCatalogApiClient
      .getList(
        resourceKey as AdminApiResourceKey,
      )
      .then((records) => {
        setRecordsByResource((state) => ({
          ...state,
          [resourceKey]: records,
        }));
        loadedApiResourcesRef.current.set(resourceKey, { records, expiresAt: Date.now() + 30_000 });
        return records;
      })
      .finally(() => {
        inFlightApiResourcesRef.current.delete(resourceKey);
      });

    inFlightApiResourcesRef.current.set(resourceKey, request);
    return request;
  }, []);

  const loadRecord = useCallback(
    async (resourceKey: string, id: string) => {
      if (!apiResourceKeys.has(resourceKey)) return null;

      const record = await adminCatalogApiClient.getOne(
        resourceKey as AdminApiResourceKey,
        id,
      );
      setRecordsByResource((state) => {
        const current = state[resourceKey] ?? [];
        const exists = current.some((item) => item.id === id);
        return {
          ...state,
          [resourceKey]: exists
            ? current.map((item) => (item.id === id ? record : item))
            : [...current, record],
        };
      });
      return record;
    },
    [],
  );
  const createRecord = useCallback(
    async (resourceKey: string, input: AdminCrudRecord) => {
      if (apiResourceKeys.has(resourceKey)) {
        const saved = await adminCatalogApiClient.create(
          resourceKey as AdminApiResourceKey,
          input,
        );
        loadedApiResourcesRef.current.clear();
        setRecordsByResource((state) => ({
          ...state,
          [resourceKey]: [...(state[resourceKey] ?? []), saved],
        }));
        return saved;
      }

      const current = recordsByResource[resourceKey] ?? [];
      const binding = getRemoteBinding(resourceKey);
      if (binding) {
        if (!binding.create) {
          throw new Error("Nội dung này có số mục cố định, không thể thêm mục mới.");
        }
        const saved = await binding.create(resourceKey, current, input);
        setRecordsByResource((state) => ({ ...state, [resourceKey]: saved }));
        const known = new Set(current.map((item) => item.id));
        return saved.find((item) => !known.has(item.id)) ?? input;
      }
      const next = await adminCrudMockService.create(current, input);
      setRecordsByResource((state) => ({ ...state, [resourceKey]: next }));
      return input;
    },
    [recordsByResource],
  );

  const updateRecord = useCallback(
    async (resourceKey: string, id: string, input: AdminCrudRecord) => {
      if (apiResourceKeys.has(resourceKey)) {
        const saved = await adminCatalogApiClient.update(
          resourceKey as AdminApiResourceKey,
          id,
          input,
        );
        loadedApiResourcesRef.current.clear();
        setRecordsByResource((state) => ({
          ...state,
          [resourceKey]: (state[resourceKey] ?? []).map((item) =>
            item.id === id ? saved : item,
          ),
        }));
        return saved;
      }

      const current = recordsByResource[resourceKey] ?? [];
      const binding = getRemoteBinding(resourceKey);
      if (binding) {
        const saved = await binding.save(
          resourceKey,
          current,
          current.map((item) => (item.id === id ? input : item)),
        );
        setRecordsByResource((state) => ({ ...state, [resourceKey]: saved }));
        return saved.find((item) => item.id === id) ?? input;
      }
      const next = await adminCrudMockService.update(current, id, input);
      setRecordsByResource((state) => ({ ...state, [resourceKey]: next }));
      return input;
    },
    [recordsByResource],
  );

  const removeRecord = useCallback(
    async (resourceKey: string, id: string) => {
      if (apiResourceKeys.has(resourceKey)) {
        await adminCatalogApiClient.remove(
          resourceKey as AdminApiResourceKey,
          id,
        );
        loadedApiResourcesRef.current.clear();
        setRecordsByResource((state) => ({
          ...state,
          [resourceKey]: (state[resourceKey] ?? []).filter(
            (item) => item.id !== id,
          ),
        }));
        return;
      }

      const current = recordsByResource[resourceKey] ?? [];
      const binding = getRemoteBinding(resourceKey);
      if (binding) {
        if (!binding.remove) {
          throw new Error("Nội dung này có số mục cố định, không thể xóa.");
        }
        const saved = await binding.remove(resourceKey, current, id);
        setRecordsByResource((state) => ({ ...state, [resourceKey]: saved }));
        return;
      }
      const next = await adminCrudMockService.remove(current, id);
      setRecordsByResource((state) => ({ ...state, [resourceKey]: next }));
    },
    [recordsByResource],
  );

  const reorderRecords = useCallback(
    async (resourceKey: string, records: AdminCrudRecord[]) => {
      if (apiResourceKeys.has(resourceKey)) {
        if (isFixedPageAdminApiResourceKey(resourceKey)) {
          const saved = await adminCatalogApiClient.replace(
            resourceKey as AdminApiResourceKey,
            records,
          );
        loadedApiResourcesRef.current.clear();
          setRecordsByResource((state) => ({
            ...state,
            [resourceKey]: structuredClone(saved),
          }));
          return;
        }

        setRecordsByResource((state) => ({
          ...state,
          [resourceKey]: structuredClone(records),
        }));
        return;
      }

      const binding = getRemoteBinding(resourceKey);
      if (binding) {
        const saved = await binding.save(
          resourceKey,
          recordsByResource[resourceKey] ?? [],
          records,
        );
        setRecordsByResource((state) => ({ ...state, [resourceKey]: saved }));
        return;
      }

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
      loadRecords,
      loadRecord,
      createRecord,
      updateRecord,
      removeRecord,
      reorderRecords,
      getRemoteState,
      loadRemote,
    }),
    [
      getRecords,
      loadRecords,
      loadRecord,
      createRecord,
      updateRecord,
      removeRecord,
      reorderRecords,
      getRemoteState,
      loadRemote,
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
