import type { RemoteResourceBinding } from "@/features/admin/services/remote-binding";
import { revalidatePublicContent } from "@/features/admin/services/revalidate-public-content";
import type { AdminCrudRecord } from "@/features/admin/lib/types/crud";
import type { CapabilityProfileContent } from "@/features/capability-profile/services/capability-profile.service";
import { api } from "@/shared/lib/api/client";

/**
 * Nối các resource của trang Hồ sơ năng lực với backend:
 *  - `GET /admin/pages/capability-profile` + `PATCH .../hero` và `PATCH .../contact-form`
 *    (mỗi PATCH thay CẢ section nên luôn gửi đủ object);
 *  - `GET/POST/PATCH/DELETE /admin/capability-profile/pages`: các trang của cuốn hồ sơ
 *    sách lật (mỗi trang là một ảnh, thứ tự đọc theo `metadata.sortOrder`).
 */

const CONTENT = "settings/capability-profile";
const CONTACT_FORM = "settings/capability-profile/contact-form";
const PAGES = "settings/capability-profile-pages";

const CONTENT_FIELDS = [
  "title",
  "subtitle",
  "description",
  "heroImage",
  "decor08",
  "documentHeading",
] as const;
const CONTACT_FIELDS = ["title", "description", "successMessage"] as const;

interface PageItem {
  id: string;
  title?: string | null;
  imageUrl: string;
  metadata?: { sortOrder?: number | null } | null;
}

const text = (value: unknown) => (typeof value === "string" ? value : "");
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const changed = (before: AdminCrudRecord | undefined, after: AdminCrudRecord, keys: readonly string[]) =>
  keys.some((key) => !same(before?.[key], after[key]));

/** Tên nội bộ của trang trong backend; trên site không hiển thị (chỉ ảnh). */
const pageTitle = (order: number) => `Trang ${order}`;

function pageRecord(item: PageItem, index: number): AdminCrudRecord {
  const order = item.metadata?.sortOrder ?? index + 1;
  return { id: item.id, title: pageTitle(order), image: item.imageUrl, order };
}

const byOrder = (a: AdminCrudRecord, b: AdminCrudRecord) => Number(a.order) - Number(b.order);

export function createCapabilityProfileBinding(): RemoteResourceBinding {
  const revalidate = (path: string) => revalidatePublicContent(path).catch(() => undefined);

  return {
    pageKey: "settings/capability-profile",
    handles: (resourceKey) =>
      resourceKey === CONTENT || resourceKey === PAGES || resourceKey === CONTACT_FORM,

    async load() {
      const [page, pages] = await Promise.all([
        api.get<{ pageCode: string; content: CapabilityProfileContent }>(
          "/admin/pages/capability-profile",
        ),
        api.get<{ items: PageItem[] }>("/admin/capability-profile/pages", {
          query: { pageIndex: 1, pageSize: 100 },
        }),
      ]);
      const { hero, contactForm } = page.content;
      return {
        [CONTENT]: [
          {
            id: "capability-profile",
            title: text(hero.title),
            subtitle: text(hero.subtitle),
            description: text(hero.description),
            heroImage: text(hero.heroImage),
            decor08: text(hero.decor08),
            documentHeading: text(hero.documentHeading),
          },
        ],
        [CONTACT_FORM]: [
          {
            id: "capability-profile-contact-form",
            title: text(contactForm.title),
            description: text(contactForm.subtitle),
            successMessage: text(contactForm.successMessage),
          },
        ],
        [PAGES]: pages.items.map(pageRecord).sort(byOrder),
      };
    },

    async save(resourceKey, previous, next) {
      if (resourceKey === CONTENT) {
        const after = next[0];
        if (!after || !changed(previous[0], after, CONTENT_FIELDS)) return next;
        await api.patch("/admin/pages/capability-profile/hero", {
          title: text(after.title),
          subtitle: text(after.subtitle),
          description: text(after.description),
          heroImage: text(after.heroImage),
          decor08: text(after.decor08),
          documentHeading: text(after.documentHeading),
        });
        await revalidate("/pages/capability-profile");
        return next;
      }

      if (resourceKey === CONTACT_FORM) {
        const after = next[0];
        if (!after || !changed(previous[0], after, CONTACT_FIELDS)) return next;
        await api.patch("/admin/pages/capability-profile/contact-form", {
          title: text(after.title),
          subtitle: text(after.description),
          successMessage: text(after.successMessage),
        });
        await revalidate("/pages/capability-profile");
        return next;
      }

      if (resourceKey === PAGES) {
        let touched = false;
        for (const record of next) {
          const before = previous.find((item) => item.id === record.id);
          if (!before || !changed(before, record, ["image", "order"])) continue;
          const order = Number(record.order);
          await api.patch(`/admin/capability-profile/pages/${record.id}`, {
            title: pageTitle(order),
            imageUrl: text(record.image),
            metadata: { sortOrder: order },
          });
          touched = true;
        }
        if (touched) await revalidate("/capability-profile/pages");
        return next.map((record) => ({ ...record, title: pageTitle(Number(record.order)) })).sort(byOrder);
      }

      return next;
    },

    async create(resourceKey, previous, input) {
      if (resourceKey !== PAGES) throw new Error("Nội dung này không thể thêm mục mới.");
      const order = Number(input.order) || previous.length + 1;
      const created = await api.post<PageItem>("/admin/capability-profile/pages", {
        title: pageTitle(order),
        imageUrl: text(input.image),
        metadata: { sortOrder: order },
      });
      await revalidate("/capability-profile/pages");
      return [...previous, pageRecord(created, previous.length)].sort(byOrder);
    },

    async remove(resourceKey, previous, id) {
      if (resourceKey !== PAGES) throw new Error("Nội dung này không thể xóa.");
      await api.delete(`/admin/capability-profile/pages/${id}`);

      // Dồn lại thứ tự đọc để không để lại khoảng trống giữa các trang.
      const removed = previous.find((item) => item.id === id);
      const remaining = previous.filter((item) => item.id !== id).sort(byOrder);
      const renumbered: AdminCrudRecord[] = [];
      for (const [index, record] of remaining.entries()) {
        const order = index + 1;
        if (removed && Number(record.order) > Number(removed.order) && Number(record.order) !== order) {
          await api.patch(`/admin/capability-profile/pages/${record.id}`, {
            title: pageTitle(order),
            metadata: { sortOrder: order },
          });
        }
        renumbered.push({ ...record, order, title: pageTitle(order) });
      }
      await revalidate("/capability-profile/pages");
      return renumbered;
    },
  };
}
