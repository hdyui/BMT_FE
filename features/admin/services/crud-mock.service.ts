import type { AdminCrudRecord } from "@/features/admin/lib/types/crud";

const wait = (duration = 320) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

export const adminCrudMockService = {
  async getAll(records: AdminCrudRecord[]) {
    await wait(180);
    return structuredClone(records);
  },

  async getById(records: AdminCrudRecord[], id: string) {
    await wait(120);
    return structuredClone(records.find((item) => item.id === id) ?? null);
  },

  async create(records: AdminCrudRecord[], input: AdminCrudRecord) {
    await wait();
    // TODO(BE): Replace FE-only mock implementation with real API.
    return [...records, structuredClone(input)];
  },

  async update(records: AdminCrudRecord[], id: string, input: AdminCrudRecord) {
    await wait();
    // TODO(BE): Replace FE-only mock implementation with real API.
    return records.map((item) =>
      item.id === id ? structuredClone(input) : item,
    );
  },

  async remove(records: AdminCrudRecord[], id: string) {
    await wait(240);
    // TODO(BE): Replace FE-only mock implementation with real API.
    return records.filter((item) => item.id !== id);
  },

  async reorder(records: AdminCrudRecord[], nextRecords: AdminCrudRecord[]) {
    await wait(160);
    // TODO(BE): Replace FE-only mock implementation with real API.
    return structuredClone(nextRecords);
  },
};
