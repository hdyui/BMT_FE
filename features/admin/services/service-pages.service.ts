import { revalidatePublicContent } from "@/features/admin/services/revalidate-public-content";
import type { RemoteResourceBinding } from "@/features/admin/services/remote-binding";
import type { AdminCrudRecord, AdminFieldValue } from "@/features/admin/lib/types/crud";
import {
  SERVICE_PAGES,
  type ServicePageSpec,
  type ServiceSectionSpec,
} from "@/features/services/api/spec";
import { api } from "@/shared/lib/api/client";

/**
 * Nối các resource `services/*` của admin với cây `Pages` của backend
 * (`GET /admin/pages/{pageCode}`, `PATCH /admin/pages/{pageCode}/nodes`).
 *
 * Record admin được dựng HOÀN TOÀN từ dữ liệu backend cho đúng các field trong
 * spec (không có giá trị mặc định nào lấy từ code); `id` của record là `id` của
 * node để PATCH đúng chỗ.
 */

interface PageNode {
  id: string;
  nodeKey: string;
  nodeKind: string;
  value: Record<string, unknown>;
  children: PageNode[];
}

interface AdminPage {
  pageCode: string;
  nodes: PageNode[];
}

function toFieldValue(value: unknown): AdminFieldValue {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  return "";
}

function applyNode(node: PageNode, spec: ServiceSectionSpec): AdminCrudRecord {
  const record: AdminCrudRecord = { id: node.id };
  for (const field of spec.fields) {
    // Field tùy chọn chưa có trên backend thì để trống.
    record[field] = field in node.value ? toFieldValue(node.value[field]) : field === "checklist" ? [] : "";
  }
  return record;
}

function itemNumber(node: PageNode) {
  return Number(node.nodeKey.replace(/\D+/g, "")) || 0;
}

const sameValue = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

function createBinding(page: ServicePageSpec): RemoteResourceBinding {
  const sectionByKey = new Map(page.sections.map((section) => [section.resourceKey, section]));

  const pageKey = `services/${page.adminBase}`;

  return {
    pageKey,
    handles: (resourceKey) => resourceKey === pageKey || resourceKey.startsWith(`${pageKey}/`),

    async load() {
      const { nodes } = await api.get<AdminPage>(`/admin/pages/${page.pageCode}`);
      const sections = new Map((nodes[0]?.children ?? []).map((node) => [node.nodeKey, node]));
      const loaded: Record<string, AdminCrudRecord[]> = {};

      for (const spec of page.sections) {
        const section = sections.get(spec.section);
        if (!section) {
          throw new Error(`Máy chủ chưa có section "${spec.section}" của trang ${page.pageCode}.`);
        }

        if (spec.kind === "single") {
          loaded[spec.resourceKey] = [applyNode(section, spec)];
        } else {
          const items = [...section.children].sort((a, b) => itemNumber(a) - itemNumber(b));
          loaded[spec.resourceKey] = items.slice(0, spec.slots).map((node, index) => ({
            ...applyNode(node, spec),
            order: index + 1,
          }));
        }
      }
      return loaded;
    },

    async save(resourceKey, previous, next) {
      const spec = sectionByKey.get(resourceKey);
      if (!spec) throw new Error(`Không có cấu hình lưu cho ${resourceKey}.`);

      // Chỉ gửi các field backend lưu và thực sự đã đổi.
      const items = next.flatMap((record) => {
        const before = previous.find((item) => item.id === record.id);
        const value: Record<string, AdminFieldValue> = {};
        for (const field of spec.fields) {
          if (!sameValue(record[field], before?.[field])) value[field] = record[field];
        }
        return Object.keys(value).length > 0 ? [{ id: record.id, value }] : [];
      });
      if (items.length === 0) return next;

      const saved = await api.patch<{ items: PageNode[] }>(
        `/admin/pages/${page.pageCode}/nodes`,
        { items },
      );
      // Đã lưu ở backend: xóa cache trang public để website đổi ngay. Lỗi ở bước
      // này (mất phiên, mạng) không được làm hỏng việc lưu vốn đã thành công.
      await revalidatePublicContent(`/pages/${page.pageCode}`).catch(() => undefined);
      const nodeById = new Map(saved.items.map((node) => [node.id, node]));
      return next.map((record) => {
        const node = nodeById.get(record.id);
        return node ? { ...applyNode(node, spec), order: record.order } : record;
      });
    },
  };
}

/** Binding của 5 trang dịch vụ (`services/<base>/...`). */
export const serviceBindings: RemoteResourceBinding[] = SERVICE_PAGES.map(createBinding);
