export type DynamicCollectionUiKind = "projects" | "news" | "recruitment";

const dynamicCollectionUiKinds: Record<string, DynamicCollectionUiKind> = {
  "projects/list": "projects",
  "news/list": "news",
  "recruitment/jobs": "recruitment",
};

/**
 * Ba collection này có hình thái ngoài website rất rõ (card dự án, hàng tin tức,
 * hàng tuyển dụng), nên admin dùng UI riêng thay vì bảng/form CRUD chung.
 */
export function getDynamicCollectionUiKind(resourceKey: string) {
  return dynamicCollectionUiKinds[resourceKey];
}