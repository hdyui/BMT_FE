import { createCapabilityProfileBinding } from "@/features/admin/services/capability-profile.service";
import { createQuotationBinding } from "@/features/admin/services/quotation-page.service";
import type { RemoteResourceBinding } from "@/features/admin/services/remote-binding";
import { serviceBindings } from "@/features/admin/services/service-pages.service";

/**
 * Mọi nhóm resource của admin đã nối API: 5 trang dịch vụ, Báo giá và Hồ sơ năng
 * lực. Resource không thuộc nhóm nào ở đây vẫn chạy trên dữ liệu mock (các trang
 * chưa được nối).
 */
const bindings: RemoteResourceBinding[] = [
  ...serviceBindings,
  createQuotationBinding(),
  createCapabilityProfileBinding(),
];

/** Binding của resource; `null` nếu resource chưa nối API. */
export function getRemoteBinding(resourceKey: string): RemoteResourceBinding | null {
  return bindings.find((binding) => binding.handles(resourceKey)) ?? null;
}
